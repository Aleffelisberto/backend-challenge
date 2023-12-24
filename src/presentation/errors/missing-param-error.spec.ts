import { MissingParamError } from './missing-param-error';

describe('MissingParamError', () => {
    it('should create a MissingParamError instance with the correct message', () => {
        const paramName = 'example';
        const missingParamError = new MissingParamError(paramName);

        expect(missingParamError).toBeInstanceOf(MissingParamError);
        expect(missingParamError.message).toEqual(`parâmetro ausente: ${paramName}`);
        expect(missingParamError.name).toEqual('MissingParamError');
    });
});
