import { InvalidParamError } from '@presentation/errors/invalid-param-error';
import { CpfValidator } from './cpf-validator';

describe('CpfValidator', () => {
    it('should not return error if CPF is valid', () => {
        const cpfValidator = new CpfValidator('cpf');
        const result = cpfValidator.validate({ cpf: '869.230.000-41' });

        expect(result).toBeUndefined();
    });

    it('should return InvalidParamError if CPF is invalid', () => {
        const cpfValidator = new CpfValidator('cpf');
        const result = cpfValidator.validate({ cpf: '123.123.123-333' });

        expect(result).toBeInstanceOf(InvalidParamError);
        expect(result!.message).toEqual('parâmetro inválido: cpf');
    });
});
