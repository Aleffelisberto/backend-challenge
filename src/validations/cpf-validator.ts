import { InvalidParamError } from '@presentation/errors/invalid-param-error';
import { Validator } from '@presentation/protocols/validator';
import { validateCPF } from 'validations-br';

export class CpfValidator implements Validator {
    constructor(private readonly field: string) {}

    validate(input: any): Error | void {
        const isCpfValid = validateCPF(input[this.field]);
        if (!isCpfValid) {
            return new InvalidParamError('cpf');
        }
    }
}
