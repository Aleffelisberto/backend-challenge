import { EnqueueCpf } from '@domain/use-cases/enqueue-cpf';
import rabbitHelper from '@infra/queue/rabbit-helper';

export class EnqueueCpfUseCase implements EnqueueCpf {
    constructor() {}

    async enqueue(cpf: string): Promise<void> {
        await rabbitHelper.sendCpfToQueue({ cpf });
    }
}
