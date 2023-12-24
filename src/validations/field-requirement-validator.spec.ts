import { MissingParamError } from '@presentation/errors/missing-param-error';
import { FieldRequirementValidator } from './field-requirement-validator';

describe('FieldRequirementValidator', () => {
    it('should not return error if field is passed', () => {
        const fieldValidator = new FieldRequirementValidator('someField');
        const result = fieldValidator.validate({ someField: 'some value' });

        expect(result).toBeUndefined();
    });

    it('should return MissingParamError if field is not passed', () => {
        const fieldValidator = new FieldRequirementValidator('someField');
        const result = fieldValidator.validate({});

        expect(result).toBeInstanceOf(MissingParamError);
        expect(result!.message).toEqual('parâmetro ausente: someField');
    });
});
