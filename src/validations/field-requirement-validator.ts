import { MissingParamError } from '@presentation/errors/missing-param-error';
import { Validator } from '@presentation/protocols/validator';

export class FieldRequirementValidator implements Validator {
    constructor(private readonly field: string) {}

    validate(input: any): Error | void {
        if (!input[this.field]) {
            return new MissingParamError(this.field);
        }
    }
}
