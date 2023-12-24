import { makeLoadBenefitsHandler } from './load-benefits-handler-factory';
import { LoadBenefitsHandler } from '@infra/handlers/load-benefits-handler';

describe('LoadBenefitsHandler Factory', () => {
    it('should return a LoadBenefitsHandler instance', () => {
        expect(makeLoadBenefitsHandler()).toBeInstanceOf(LoadBenefitsHandler);
    });
});
