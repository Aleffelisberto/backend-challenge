import { makeLoadBenefitsUseCase } from './load-benefits-factory';
import { LoadBenefitsUseCase } from '@data/use-cases/ds-load-benefits';

describe('LoadBenefitsUseCase Factory', () => {
    it('should return a LoadBenefitsUseCase instance', () => {
        expect(makeLoadBenefitsUseCase()).toBeInstanceOf(LoadBenefitsUseCase);
    });
});
