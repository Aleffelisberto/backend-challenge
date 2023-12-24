import { makeEnqueueCpfUseCase } from './enqueue-cpf-factory';

jest.mock('@data/use-cases/ds-enqueue-cpf', () => {
    return {
        EnqueueCpfUseCase: jest.fn().mockImplementation(() => {
            return {
                enqueue: jest.fn(),
            };
        }),
    };
});

describe('EnqueueCpfUseCase Factory', () => {
    it('should return a EnqueueCpfUseCase instance', () => {
        const response = makeEnqueueCpfUseCase();
        expect(response).not.toBeFalsy();
    });
});
