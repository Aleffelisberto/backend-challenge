import Axios from 'axios';
import ConsultaApiService from './consulta-api-service';

interface SutTypes {
    sut: ConsultaApiService;
}

process.env.CONSULTA_API_URL = 'some_url';
process.env.CONSULTA_API_PASSWORD = 'somepassword';
process.env.CONSULTA_API_USERNAME = 'someusername';

const makeSut = (): SutTypes => {
    const sut = new ConsultaApiService();

    return { sut };
};

describe('generateJwtToken', () => {
    it('should return token data', async () => {
        const token = 'sometoken';
        const expiresIn = '2023-12-22 01:00:00';
        jest.spyOn(Axios, 'post').mockImplementationOnce(async () => {
            return Promise.resolve({
                data: {
                    data: {
                        token,
                        expiresIn,
                    },
                },
            });
        });
        const response = await makeSut().sut.generateJwtToken();
        expect(response.token).toBe(token);
        expect(response.expiresIn).toBe(expiresIn);
    });
});

describe('getBenifitsDataByCpf', () => {
    it('should return benefits', async () => {
        const cpf = '123.456.789-10';
        const benefits = [
            {
                numero_beneficio: '123',
                codigo_tipo_beneficio: '1',
            },
        ];
        const benefitsResponse = {
            cpf: cpf,
            beneficios: benefits,
        };
        jest.spyOn(Axios, 'get').mockImplementationOnce(async cpf => {
            return Promise.resolve({
                data: { data: benefitsResponse },
            });
        });
        const response = await makeSut().sut.getBenifitsDataByCpf(cpf, 'sometoken');
        expect(response.cpf).toBe(cpf);
        expect(response.beneficios).toEqual(benefits);
    });
});
