import { LoadBenefitsHandler } from '@infra/handlers/load-benefits-handler';
import { CpfValidator } from '@validations/cpf-validator';
import { FieldRequirementValidator } from '@validations/field-requirement-validator';
import { Validators } from '@validations/validators';
import { makeLoadBenefitsUseCase } from '@main/factories/use-cases/load-benefits-factory';

export const makeLoadBenefitsHandlerValidator = (): Validators => {
    return new Validators([new FieldRequirementValidator('cpf'), new CpfValidator('cpf')]);
};

export const makeLoadBenefitsHandler = (): LoadBenefitsHandler => {
    return new LoadBenefitsHandler(makeLoadBenefitsHandlerValidator(), makeLoadBenefitsUseCase());
};
