import { EnqueueCpf } from '@domain/use-cases/enqueue-cpf';
import rabbitHelper from '@infra/queue/rabbit-helper';

export class EnqueueCpfUseCase implements EnqueueCpf {
    constructor() {}

    async enqueue(cpfs: string[]): Promise<void> {
        for await (const cpf of cpfs) {
            await rabbitHelper.sendCpfToQueue({ cpf });
        }
    }
}
