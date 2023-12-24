import { BenefitEntity } from '@domain/entities/customer-data';

export interface LoadBenefits {
    load: (cnpj: string) => Promise<LoadBenefits.Result>;
}

export namespace LoadBenefits {
    export type Result = {
        cpf: string;
        beneficios: BenefitEntity[];
    };
}
