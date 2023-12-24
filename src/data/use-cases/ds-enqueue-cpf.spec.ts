import rabbitHelper from '@infra/queue/rabbit-helper';
import { EnqueueCpfUseCase } from './ds-enqueue-cpf';

jest.mock('amqplib');
jest.mock('@infra/queue/rabbit-helper', () => {
    return {
        connect: jest.fn(),
        sendCpfToQueue: jest.fn(),
    };
});

interface SutTypes {
    sut: EnqueueCpfUseCase;
}

const makeSut = (): SutTypes => {
    const sut = new EnqueueCpfUseCase();

    return { sut };
};

describe('EnqueueCpfUseCase', () => {
    it('should be able to enqueue an cpf in rabbitMQ', async () => {
        const { sut } = makeSut();
        const sendCpfToQueueSpy = jest.spyOn(rabbitHelper, 'sendCpfToQueue');
        const cpf = '12345678910';

        await sut.enqueue(cpf);
        expect(sendCpfToQueueSpy).toHaveBeenCalledWith({ cpf });
    });
});
