import { LoadCustomerDataUseCase } from '@data/use-cases/ds-load-customer-data';
import ConsultaApiService from '@infra/services/consulta-api-service';

export const makeLoadCustomerDataUseCase = (): LoadCustomerDataUseCase => {
    return new LoadCustomerDataUseCase(new ConsultaApiService());
};
