import rabbitHelper, { CpfQueueMessage } from '@infra/queue/rabbit-helper';
import AmqpLib, { Connection } from 'amqplib';

jest.mock('amqplib', () => ({
    connect: jest.fn().mockResolvedValue({
        createChannel: jest.fn().mockResolvedValue({
            publish: jest.fn().mockResolvedValue(true),
            prefetch: jest.fn(),
            consume: jest.fn(),
            ack: jest.fn(),
            nack: jest.fn(),
            assertExchange: jest.fn(),
            assertQueue: jest.fn(),
            bindQueue: jest.fn(),
        }),
        close: jest.fn().mockResolvedValue(true),
    }),
}));

interface SutTypes {
    sut: typeof rabbitHelper;
}

const makeSut = (): SutTypes => {
    const sut = rabbitHelper;

    return { sut };
};

describe('RabbitMQ', () => {
    beforeEach(() => {
        process.env.RABBIT_URL = 'someurl';
        jest.clearAllMocks();
    });

    it('should log error if RABBIT_URL is not defined', async () => {
        process.env.RABBIT_URL = '';
        const logSpy = jest.spyOn(global.console, 'error').mockImplementation(() => {});
        await makeSut().sut.init();

        expect(logSpy).toHaveBeenCalledTimes(2);
        expect(logSpy).toHaveBeenNthCalledWith(1, 'ERROR RABBIT INIT CONNECTION', 'RABBIT_URL not found');
    });

    it('should send cpf to queue', async () => {
        const { sut } = makeSut();
        const message: CpfQueueMessage = {
            cpf: '123.456.789-10',
        };
        const result = await sut.sendCpfToQueue(message);
        expect(result).toBe(true);
    });

    it('should set connection to null and log error if connect method fails', async () => {
        jest.spyOn(AmqpLib, 'connect').mockReturnValueOnce(Promise.resolve(null as unknown as Connection));
        const logSpy = jest.spyOn(global.console, 'error').mockImplementation(() => {});

        const response = await makeSut().sut.init();

        expect(response).toBeUndefined();
        expect(logSpy).toHaveBeenCalledTimes(2);
        expect(logSpy).toHaveBeenNthCalledWith(1, 'ERROR RABBIT INIT CONNECTION', 'Rabbit connection not found');
    });

    it('should set channel to null and log error if channel method fails', async () => {
        jest.spyOn(AmqpLib, 'connect').mockResolvedValueOnce({
            createChannel: jest.fn().mockResolvedValueOnce(null),
        } as any);
        const logSpy = jest.spyOn(global.console, 'error').mockImplementation(() => {});

        const response = await makeSut().sut.init();

        expect(response).toBeUndefined();
        expect(logSpy).toHaveBeenCalledTimes(2);
        expect(logSpy).toHaveBeenNthCalledWith(1, 'ERROR RABBIT INIT CONNECTION', 'Rabbit channel not found');
    });
});
