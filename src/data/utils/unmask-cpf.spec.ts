import { unmaskCpf } from './unmask-cpf';

describe('unmaskCpf', () => {
    it('should return CPF without special chars', () => {
        const maskedCpf = '869.230.000-41';
        const result = unmaskCpf(maskedCpf);

        expect(result).toEqual('86923000041');
    });

    it('should return the same CPF if its already unmasked', () => {
        const unmaskedCpf = '86923000041';
        const result = unmaskCpf(unmaskedCpf);

        expect(result).toEqual(unmaskedCpf);
    });
});
