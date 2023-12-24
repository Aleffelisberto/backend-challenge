import { BenefitEntity } from '@domain/entities/customer-data';
import { unmaskCpf } from '@data/utils/unmask-cpf';
import redisHelper from '@infra/data-store/redis-helper';
import { ConsultaApiServiceInterface } from '@infra/services/consulta-api-interface';
import { differenceInSeconds } from 'date-fns';
import elasticSearchHelper from '@infra/data-store/elastic-search-helper';
import { LoadBenefits } from '@domain/use-cases/load-benefits';
import { AxiosError } from 'axios';

export class LoadBenefitsUseCase implements LoadBenefits {
    constructor(private readonly consultaApiService: ConsultaApiServiceInterface) {}

    async load(cpf: string): Promise<LoadBenefits.Result> {
        const unmaskedCpf = unmaskCpf(cpf);

        const cachedData = await this.getCachedData(unmaskedCpf);
        if (cachedData) {
            return { cpf: unmaskedCpf, beneficios: cachedData };
        }

        const elasticSearchData = await this.searchElasticSearchData(unmaskedCpf);
        if (elasticSearchData) {
            return { cpf: unmaskedCpf, beneficios: elasticSearchData };
        }

        const token = await this.ensureApiJwtToken();

        try {
            const apiData = await this.fetchApiBenefitsData(unmaskedCpf, token);
            await this.saveToElasticSearchAndRedisCache(unmaskedCpf, apiData);
            return { cpf: unmaskedCpf, beneficios: apiData };
        } catch (error) {
            const beneficios = await this.handleApiError(error, unmaskedCpf);
            return { cpf: unmaskedCpf, beneficios };
        }
    }

    async getCachedData(unmaskedCpf: string): Promise<BenefitEntity[] | null> {
        const redisBenefitData = await redisHelper.get(unmaskedCpf);
        if (redisBenefitData) {
            return JSON.parse(redisBenefitData) as BenefitEntity[];
        }
        return null;
    }

    async searchElasticSearchData(unmaskedCpf: string): Promise<BenefitEntity[] | null> {
        const elasticSearchBenefitData = (await elasticSearchHelper.searchByCpf('cpfs', unmaskedCpf)).hits.hits;
        if (elasticSearchBenefitData.length > 0) {
            const benefitsData = elasticSearchBenefitData[0]._source as { benefits: BenefitEntity[] };
            return benefitsData.benefits;
        }
        return null;
    }

    async ensureApiJwtToken(): Promise<string> {
        let token = await redisHelper.get('jwttoken');
        if (!token) {
            token = await this.refreshApiJwtToken();
        }
        return token;
    }

    async handleApiError(error: unknown, unmaskedCpf: string): Promise<BenefitEntity[]> {
        const isExpiredTokenError = error instanceof AxiosError && error.response?.status === 401 && error.response.data.observations === 'Token expirado';
        if (isExpiredTokenError) {
            const token = await this.refreshApiJwtToken();
            return this.fetchApiBenefitsData(unmaskedCpf, token);
        }
        return [];
    }

    async refreshApiJwtToken(): Promise<string> {
        const { token, expiresIn } = await this.consultaApiService.generateJwtToken();
        await redisHelper.set('jwttoken', token);
        const today = new Date();
        const expirationDate = new Date(expiresIn);
        const expirationTimeInSecs = Math.abs(differenceInSeconds(today, expirationDate));
        await redisHelper.setExpireIn('jwttoken', expirationTimeInSecs);

        return token;
    }

    async fetchApiBenefitsData(unmaskedCpf: string, token: string): Promise<BenefitEntity[]> {
        const { beneficios } = await this.consultaApiService.getBenifitsDataByCpf(unmaskedCpf, token);

        return beneficios;
    }

    async saveToElasticSearchAndRedisCache(unmaskedCpf: string, data: BenefitEntity[]): Promise<void> {
        await elasticSearchHelper.indexDocument('cpfs', { cpf: unmaskedCpf, beneficios: data });
        await redisHelper.set(unmaskedCpf, JSON.stringify(data));
    }
}
