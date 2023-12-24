export interface ConsultaApiServiceInterface {
    generateJwtToken(): Promise<ConsulaApiTokenData>;
    getBenifitsDataByCpf(cpf: string, jwtToken: string): Promise<ConsultaApiBenefitData>;
}

export interface ConsulaApiTokenData {
    token: string;
    expiresIn: string;
}

export interface ConsultaApiBenefitData {
    cpf: string;
    beneficios: {
        numero_beneficio: string;
        codigo_tipo_beneficio: string;
    }[];
}
