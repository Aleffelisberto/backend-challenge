import { InvalidParamError } from './invalid-param-error';

describe('InvalidParamError', () => {
    it('should create an InvalidParamError instance with the correct message', () => {
        const paramName = 'someParam';
        const invalidParamError = new InvalidParamError(paramName);

        expect(invalidParamError).toBeInstanceOf(InvalidParamError);
        expect(invalidParamError.message).toEqual(`parâmetro inválido: ${paramName}`);
        expect(invalidParamError.name).toEqual('InvalidParamError');
    });
});
