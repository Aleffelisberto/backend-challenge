import { EnqueueCpfUseCase } from '@data/use-cases/ds-enqueue-cpf';

export const makeEnqueueCpfUseCase = (): EnqueueCpfUseCase => {
    return new EnqueueCpfUseCase();
};
