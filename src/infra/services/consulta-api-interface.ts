export interface ConsulaApiInterface {
    generateJwtToken(): Promise<ConsulaApiTokenData>;
    getBenifitsDataByCpf(cpf: string): Promise<ConsultaApiBenefitData>;
}

export interface ConsulaApiTokenData {
    tokenJwt: string;
    expiresIn: string;
}

export interface ConsultaApiBenefitData {
    benefitNumber: string;
    benefitTypeCode: string;
}
