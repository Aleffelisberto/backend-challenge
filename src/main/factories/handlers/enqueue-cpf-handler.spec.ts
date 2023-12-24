import { EnqueueCpfHandler } from '@infra/handlers/enqueue-cpf-handler';
import { makeEnqueueCpfHandler } from './enqueue-cpf-handler-factory';

jest.mock('@data/use-cases/ds-enqueue-cpf', () => {
    return {
        EnqueueCpfUseCase: jest.fn().mockImplementation(() => {
            return {
                enqueue: jest.fn(),
            };
        }),
    };
});

describe('EnqueueCpfHandler Factory', () => {
    it('should return a EnqueueCpfHandler instance', () => {
        expect(makeEnqueueCpfHandler()).toBeInstanceOf(EnqueueCpfHandler);
    });
});
