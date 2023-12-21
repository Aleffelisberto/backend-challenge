import { EnqueueCpfHandler } from '@infra/handlers/enqueue-cpf-handler';
import { Validator } from '@presentation/protocols/validator';
import { FieldRequirementValidator } from '@validations/field-requirement-validator';
import { Validators } from '@validations/validators';
import { makeEnqueueCpfUseCase } from '@main/factories/use-cases/enqueue-cpf-factory';

export const makeEnqueueCpfValidator = (): Validators => {
    const validators: Validator[] = [];
    validators.push(new FieldRequirementValidator('cpfs'));

    return new Validators(validators);
};

export const makeEnqueueCpfHandler = (): EnqueueCpfHandler => {
    return new EnqueueCpfHandler(makeEnqueueCpfValidator(), makeEnqueueCpfUseCase());
};
