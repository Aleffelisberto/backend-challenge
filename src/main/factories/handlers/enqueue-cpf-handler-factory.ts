import { EnqueueCpfHandler } from '@infra/handlers/enqueue-cpf-handler';
import { FieldRequirementValidator } from '@validations/field-requirement-validator';
import { Validators } from '@validations/validators';
import { makeEnqueueCpfUseCase } from '@main/factories/use-cases/enqueue-cpf-factory';
import { CpfValidator } from '@validations/cpf-validator';

export const makeEnqueueCpfValidator = (): Validators => {
    return new Validators([new FieldRequirementValidator('cpf'), new CpfValidator('cpf')]);
};

export const makeEnqueueCpfHandler = (): EnqueueCpfHandler => {
    return new EnqueueCpfHandler(makeEnqueueCpfValidator(), makeEnqueueCpfUseCase());
};
