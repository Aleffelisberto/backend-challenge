import axios, { AxiosInstance } from 'axios';
import { ConsultaApiServiceInterface, ConsulaApiTokenData, ConsultaApiBenefitData } from './consulta-api-interface';

export default class ConsultaApiService implements ConsultaApiServiceInterface {
    public api: AxiosInstance;

    constructor() {
        this.api = this.createApiInstance();
    }

    public createApiInstance(): AxiosInstance {
        return axios.create({
            baseURL: process.env.CONSULTA_API_URL,
        });
    }

    async generateJwtToken(): Promise<ConsulaApiTokenData> {
        const response = await this.api.post(
            `/api/v1/token`,
            {
                username: process.env.CONSULTA_API_USERNAME,
                password: process.env.CONSULTA_API_PASSWORD,
            },
            {}
        );

        return {
            tokenJwt: response.data.token,
            expiresIn: response.data.expiresIn,
        };
    }

    async getBenifitsDataByCpf(cpf: string): Promise<ConsultaApiBenefitData> {
        const response = await this.api.get(`/api/v1/inss/consulta-beneficios?cpf=${cpf}`);

        return {
            benefitNumber: response.data.benefitNumber || 'qualquercoisa',
            benefitTypeCode: response.data.benefitTypeCode || 'qualquercoisa',
        };
    }
}
