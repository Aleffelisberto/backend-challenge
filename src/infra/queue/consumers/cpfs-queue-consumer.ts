import { makeLoadBenefitsUseCase } from '@main/factories/use-cases/load-benefits-factory';
import { CpfQueueMessage } from '../rabbit-helper';

export interface CpfsQueueMessage {
    cpf: string;
}

export class CpfsQueueConsumer {
    async consume(message: CpfQueueMessage): Promise<boolean> {
        await makeLoadBenefitsUseCase().load(message.cpf);

        return true;
    }
}
