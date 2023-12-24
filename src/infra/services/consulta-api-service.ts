import Axios from 'axios';
import { ConsultaApiServiceInterface, ConsulaApiTokenData, ConsultaApiBenefitData } from './consulta-api-interface';

export default class ConsultaApiService implements ConsultaApiServiceInterface {
    async generateJwtToken(): Promise<ConsulaApiTokenData> {
        const response = await Axios.post(
            `${process.env.CONSULTA_API_URL}/api/v1/token`,
            {
                username: process.env.CONSULTA_API_USERNAME,
                password: process.env.CONSULTA_API_PASSWORD,
            },
            {}
        );

        return {
            token: response.data.data.token,
            expiresIn: response.data.data.expiresIn,
        };
    }

    async getBenifitsDataByCpf(cpf: string, jwtToken: string): Promise<ConsultaApiBenefitData> {
        const response = await Axios.get(`${process.env.CONSULTA_API_URL}/api/v1/inss/consulta-beneficios?cpf=${cpf}`, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        });

        return response.data.data;
    }
}
