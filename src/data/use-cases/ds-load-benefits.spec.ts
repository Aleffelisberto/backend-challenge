import { unmaskCpf } from '@data/utils/unmask-cpf';
import { LoadBenefitsUseCase } from './ds-load-benefits';
import { ConsultaApiServiceInterface } from '@infra/services/consulta-api-interface';
import redisHelper from '@infra/data-store/redis-helper';
import elasticSearchHelper from '@infra/data-store/elastic-search-helper';
import { AggregationsAggregate, SearchResponse } from '@elastic/elasticsearch/lib/api/types';
import { AxiosError, AxiosResponse } from 'axios';

jest.mock('redis');
jest.mock('@infra/data-store/redis-helper', () => {
    return {
        connect: jest.fn(),
        get: jest.fn(),
        set: jest.fn(),
        setExpireIn: jest.fn(),
    };
});
jest.mock('@elastic/elasticsearch');
jest.mock('@infra/data-store/elastic-search-helper', () => {
    return {
        connect: jest.fn(),
        indexDocument: jest.fn(),
        searchByCpf: jest.fn(),
    };
});

interface SutTypes {
    sut: LoadBenefitsUseCase;
    consultaApiMock: ConsultaApiServiceInterface;
}

const benefits = [{ numero_beneficio: '124', codigo_tipo_beneficio: '1' }];

const makeSut = (): SutTypes => {
    const consultaApiMock = {
        generateJwtToken: () => {
            return Promise.resolve({
                token: 'sometoken',
                expiresIn: '2023-12-24 04:45:46',
            });
        },
        getBenifitsDataByCpf: (cpf: string, _jwtToken: string) => {
            return Promise.resolve({
                cpf: unmaskCpf(cpf),
                beneficios: benefits,
            });
        },
    };

    const sut = new LoadBenefitsUseCase(consultaApiMock);

    return { sut, consultaApiMock };
};

describe('load', () => {
    it('should return cached data if CPF is stored in redis', async () => {
        const { sut } = makeSut();
        const cpf = '123.456.789-10';
        const getCachedDataSpy = jest.spyOn(sut, 'getCachedData');
        getCachedDataSpy.mockReturnValueOnce(Promise.resolve(benefits));
        const searchElasticSearchDataSpy = jest.spyOn(sut, 'searchElasticSearchData');

        const response = await sut.load(cpf);
        expect(response).toEqual({ cpf: unmaskCpf(cpf), beneficios: benefits });
        expect(getCachedDataSpy).toHaveBeenCalledWith(unmaskCpf(cpf));
        expect(searchElasticSearchDataSpy).not.toHaveBeenCalled();
    });

    it('should return elastic search data if CPF is stored in elastic search', async () => {
        const { sut } = makeSut();
        const cpf = '123.456.789-10';
        jest.spyOn(sut, 'getCachedData').mockReturnValueOnce(Promise.resolve(null));
        const searchElasticSearchDataSpy = jest.spyOn(sut, 'searchElasticSearchData');
        searchElasticSearchDataSpy.mockReturnValueOnce(Promise.resolve(benefits));
        const ensureApiJwtTokenSpy = jest.spyOn(sut, 'ensureApiJwtToken');

        const response = await sut.load(cpf);
        expect(response).toEqual({ cpf: unmaskCpf(cpf), beneficios: benefits });
        expect(searchElasticSearchDataSpy).toHaveBeenCalledWith(unmaskCpf(cpf));
        expect(ensureApiJwtTokenSpy).not.toHaveBeenCalled();
    });

    it('should save data in elastic search and redis if CPF is not stored', async () => {
        const { sut } = makeSut();
        const cpf = '123.456.789-10';
        jest.spyOn(sut, 'ensureApiJwtToken').mockReturnValueOnce(Promise.resolve('sometoken'));
        const handleApiErrorSpy = jest.spyOn(sut, 'handleApiError');
        jest.spyOn(sut, 'searchElasticSearchData').mockReturnValueOnce(Promise.resolve(null));

        const response = await sut.load(cpf);
        expect(response).toEqual({ cpf: unmaskCpf(cpf), beneficios: benefits });
        expect(handleApiErrorSpy).not.toHaveBeenCalled();
    });

    it('should return data even if api throws', async () => {
        const { sut } = makeSut();
        const cpf = '123.456.789-10';
        jest.spyOn(sut, 'ensureApiJwtToken').mockReturnValueOnce(Promise.resolve('sometoken'));
        const handleApiErrorSpy = jest.spyOn(sut, 'handleApiError');
        jest.spyOn(sut, 'searchElasticSearchData').mockReturnValueOnce(Promise.resolve(null));
        const axiosError = new AxiosError('msg', 'code', undefined, null, {
            data: { observations: 'Token expirado' },
            status: 401,
        } as unknown as AxiosResponse<unknown, any>);
        jest.spyOn(sut, 'fetchApiBenefitsData').mockImplementationOnce(() => {
            throw axiosError;
        });

        const response = await sut.load(cpf);
        expect(response).toEqual({ cpf: unmaskCpf(cpf), beneficios: benefits });
        expect(handleApiErrorSpy).toHaveBeenCalledWith(axiosError, unmaskCpf(cpf));
    });
});

describe('getCachedData', () => {
    it('should return null if data is not in cache', async () => {
        const { sut } = makeSut();
        jest.spyOn(redisHelper, 'get').mockReturnValueOnce(Promise.resolve(null));

        expect(await sut.getCachedData('12345678910')).toBeNull();
    });

    it('should return cachedData if CPF is found in cache', async () => {
        const { sut } = makeSut();
        jest.spyOn(redisHelper, 'get').mockReturnValueOnce(Promise.resolve(JSON.stringify(benefits)));

        expect(await sut.getCachedData('12345678910')).toEqual(benefits);
    });
});

describe('searchElasticSearchData', () => {
    it('should return null if data is not in elastic search', async () => {
        const { sut } = makeSut();
        jest.spyOn(elasticSearchHelper, 'searchByCpf').mockReturnValueOnce(
            Promise.resolve({ hits: { hits: [] } }) as unknown as Promise<SearchResponse<unknown, Record<string, AggregationsAggregate>>>
        );

        expect(await sut.searchElasticSearchData('12345678910')).toBeNull();
    });

    it('should return elastic search data is found', async () => {
        const { sut } = makeSut();
        jest.spyOn(elasticSearchHelper, 'searchByCpf').mockReturnValueOnce(
            Promise.resolve({
                hits: {
                    hits: [
                        {
                            _source: {
                                cpf: '12345678910',
                                benefits,
                            },
                        },
                    ],
                },
            }) as unknown as Promise<SearchResponse<unknown, Record<string, AggregationsAggregate>>>
        );

        expect(await sut.searchElasticSearchData('12345678910')).toEqual(benefits);
    });

    describe('ensureApiJwtToken', () => {
        it('should call refreshApiJwtToken if token is not in cache', async () => {
            const { sut } = makeSut();
            jest.spyOn(redisHelper, 'get').mockReturnValueOnce(Promise.resolve(null));
            const refreshApiJwtTokenSpy = jest.spyOn(sut, 'refreshApiJwtToken');
            refreshApiJwtTokenSpy.mockReturnValueOnce(Promise.resolve('sometoken'));

            const response = await sut.ensureApiJwtToken();
            expect(response).toBe('sometoken');
            expect(refreshApiJwtTokenSpy).toHaveBeenCalled();
        });

        it('should return token stored in cache if exists', async () => {
            const { sut } = makeSut();
            jest.spyOn(redisHelper, 'get').mockReturnValueOnce(Promise.resolve('sometoken'));
            const refreshApiJwtTokenSpy = jest.spyOn(sut, 'refreshApiJwtToken');

            const response = await sut.ensureApiJwtToken();
            expect(response).toBe('sometoken');
            expect(refreshApiJwtTokenSpy).not.toHaveBeenCalled();
        });
    });

    describe('handleApiError', () => {
        it('should return an empty array if error is not expired token error', async () => {
            const { sut } = makeSut();
            expect(await sut.handleApiError(new Error(), '12345678910')).toEqual([]);
        });

        it('should call refreshApiJwtToken and fetchApiBenefitsData if is expired token error', async () => {
            const { sut } = makeSut();
            const refreshApiJwtTokenSpy = jest.spyOn(sut, 'refreshApiJwtToken');
            refreshApiJwtTokenSpy.mockReturnValueOnce(Promise.resolve('sometoken'));
            const fetchApiBenefitsDataSpy = jest.spyOn(sut, 'fetchApiBenefitsData');
            fetchApiBenefitsDataSpy.mockReturnValueOnce(Promise.resolve(benefits));

            const axiosError = new AxiosError('msg', 'code', undefined, null, {
                data: { observations: 'Token expirado' },
                status: 401,
            } as unknown as AxiosResponse<unknown, any>);
            const response = await sut.handleApiError(axiosError, '12345678910');
            expect(response).toEqual(benefits);
            expect(refreshApiJwtTokenSpy).toHaveBeenCalled();
            expect(fetchApiBenefitsDataSpy).toHaveBeenCalledWith('12345678910', 'sometoken');
        });
    });

    describe('refreshApiJwtToken', () => {
        it('should cache token and return', async () => {
            const { sut, consultaApiMock } = makeSut();
            const generateJwtTokenSpy = jest.spyOn(consultaApiMock, 'generateJwtToken');
            const setSpy = jest.spyOn(redisHelper, 'set');
            const setExpireInSpy = jest.spyOn(redisHelper, 'setExpireIn');

            const response = await sut.refreshApiJwtToken();
            expect(response).toBe('sometoken');
            expect(generateJwtTokenSpy).toHaveBeenCalled();
            expect(setSpy).toHaveBeenCalledWith('jwttoken', 'sometoken');
            expect(setExpireInSpy).toHaveBeenCalled();
        });
    });

    describe('fetchApiBenefitsData', () => {
        it('should return beneficios from consultaApiService', async () => {
            const { sut, consultaApiMock } = makeSut();
            const getBenefitsDataByCpfSpy = jest.spyOn(consultaApiMock, 'getBenifitsDataByCpf');

            const response = await sut.fetchApiBenefitsData('12345678910', 'sometoken');
            expect(response).toEqual(benefits);
            expect(getBenefitsDataByCpfSpy).toHaveBeenCalledWith('12345678910', 'sometoken');
        });
    });

    describe('saveToElasticSearchAndRedisCache', () => {
        it('should be able to store data in elastic search and redis', async () => {
            const { sut } = makeSut();
            const indexDocumentSpy = jest.spyOn(elasticSearchHelper, 'indexDocument');
            const setSpy = jest.spyOn(redisHelper, 'set');

            await sut.saveToElasticSearchAndRedisCache('12345678910', benefits);
            expect(indexDocumentSpy).toHaveBeenCalledWith('cpfs', { cpf: '12345678910', beneficios: benefits });
            expect(setSpy).toHaveBeenCalledWith('12345678910', JSON.stringify(benefits));
        });
    });
});
