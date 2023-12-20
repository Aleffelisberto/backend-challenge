import { CustomerDataEntity } from '@domain/entities/customer-data';

export interface LoadCustomerData {
    load: (cnpj: string) => Promise<LoadCustomerData.Result>;
}

export namespace LoadCustomerData {
    export type Result = CustomerDataEntity;
}
