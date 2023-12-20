import { LoadCustomerDataUseCase } from '@data/use-cases/ds-load-customer-data';

export const makeLoadCustomerDataUseCase = (): LoadCustomerDataUseCase => {
    return new LoadCustomerDataUseCase();
};
