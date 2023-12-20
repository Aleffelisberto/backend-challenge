import { Validator } from '@presentation/protocols/validator';

export class Validators implements Validator {
    constructor(private readonly validations: Validator[]) {}

    validate(input: any): Error | void {
        for (const validation of this.validations) {
            const hasError = validation.validate(input);
            if (hasError) {
                return hasError;
            }
        }
    }
}
