import { LoadBenefitsUseCase } from '@data/use-cases/ds-load-benefits';
import ConsultaApiService from '@infra/services/consulta-api-service';

export const makeLoadBenefitsUseCase = (): LoadBenefitsUseCase => {
    return new LoadBenefitsUseCase(new ConsultaApiService());
};
