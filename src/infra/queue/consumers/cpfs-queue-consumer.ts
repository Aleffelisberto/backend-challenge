import { makeLoadCustomerDataUseCase } from '@main/factories/use-cases/load-customer-data-factory';
import { CpfQueueMessage } from '../rabbit-helper';

export interface CpfsQueueMessage {
    cpf: string;
}

export class CpfsQueueConsumer {
    async consume(message: CpfQueueMessage): Promise<boolean> {
        try {
            await makeLoadCustomerDataUseCase().load(message.cpf);

            return true;
        } catch (error: unknown) {
            console.error(error);

            return false;
        }
    }
}
