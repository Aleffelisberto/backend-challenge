import { LoadCustomerData } from '@domain/use-cases/load-customer-data';

export class LoadCustomerDataUseCase implements LoadCustomerData {
    constructor() {}

    async load(cpf: string): Promise<LoadCustomerData.Result> {}
}
