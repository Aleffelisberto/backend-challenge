import { makeLoadCustomerDataUseCase } from '@main/factories/use-cases/load-customer-data-factory';
import { LoadCustomerDataHandler } from '@infra/handlers/load-customer-data-handler';
import { CpfValidator } from '@validations/cpf-validator';
import { FieldRequirementValidator } from '@validations/field-requirement-validator';
import { Validators } from '@validations/validators';

export const makeLoadCustomerDataHandlerValidator = (): Validators => {
    return new Validators([new FieldRequirementValidator('cpf'), new CpfValidator('cpf')]);
};

export const makeLoadCustomerDataHandler = (): LoadCustomerDataHandler => {
    return new LoadCustomerDataHandler(makeLoadCustomerDataHandlerValidator(), makeLoadCustomerDataUseCase());
};
