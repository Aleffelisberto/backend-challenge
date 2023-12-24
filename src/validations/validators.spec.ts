import { Validator } from '@presentation/protocols/validator';
import { Validators } from './validators';

class MockValidator implements Validator {
    private readonly shouldFail: boolean;

    constructor(shouldFail: boolean) {
        this.shouldFail = shouldFail;
    }

    validate(_input: any): Error | void {
        if (this.shouldFail) {
            return new Error('Validation failed');
        }
    }
}

describe('Validators', () => {
    it('should not return any error if all validations pass', () => {
        const mockValidators = [new MockValidator(false), new MockValidator(false)];
        const validators = new Validators(mockValidators);
        const result = validators.validate({});

        expect(result).toBeUndefined();
    });

    it('should return the first validation error', () => {
        const mockValidators = [new MockValidator(true), new MockValidator(false)];
        const validators = new Validators(mockValidators);
        const result = validators.validate({});

        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(Error);
        expect(result!.message).toEqual('Validation failed');
    });
});
