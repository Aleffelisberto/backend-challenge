import { Channel, connect, Connection, ConsumeMessage } from 'amqplib';
import 'dotenv/config';
import { CpfsQueueConsumer, CpfsQueueMessage } from './consumers/cpfs-queue-consumer';

export interface CpfQueueMessage {
    cpf: string;
}
export type IQueues = 'cpfs_queue';
export type IExchanges = 'amq.direct';

class RabbitHelper {
    private connection: Connection | undefined;

    private channel: Channel | undefined;

    private url: string | undefined;

    async init() {
        try {
            this.connection = await this.createConnection();
            this.channel = await this.createChannel(this.connection);
        } catch (err: any) {
            console.error('ERROR RABBIT INIT CONNECTION', err.message);
            console.error('ERROR RABBIT INIT CONNECTION', err.stack);
        }
    }

    async sendCpfToQueue(message: CpfQueueMessage) {
        return this.sendExchange('amq.direct', 'cpfs_queue', JSON.stringify(message));
    }

    async consumeCpfs(message: ConsumeMessage) {
        const data = JSON.parse(message.content.toString()) as CpfsQueueMessage;
        const checkoutTrackingConsumer = new CpfsQueueConsumer();
        return checkoutTrackingConsumer.consume(data);
    }

    async runConsumer() {
        if (!this.connection) {
            this.connection = await this.createConnection();
        }
        if (!this.channel) {
            this.channel = await this.createChannel(this.connection);
        }
        await this.channel.consume('cpfs_queue', async (message: ConsumeMessage | null) => {
            const msg = message as ConsumeMessage;
            const response = await this.consumeCpfs(msg);
            if (response) {
                this.channel!.ack(msg);
            } else {
                this.channel!.nack(msg, false, false);
            }
        });
    }

    private async sendExchange(exchange: IExchanges, queue: IQueues, message: string) {
        try {
            if (!this.connection) {
                this.connection = await this.createConnection();
            }
            if (!this.channel) {
                this.channel = await this.createChannel(this.connection);
            }

            return this.channel.publish(exchange, queue, Buffer.from(message));
        } catch (err: any) {
            console.log('RABBIT MESSAGE ERROR', message);
            console.log('RABBIT CONNECTION ERROR', err.message);
            console.log('RABBIT CONNECTION ERROR', err.stack);

            return false;
        }
    }

    async createConnection(): Promise<Connection> {
        if (!process.env.RABBIT_URL) {
            throw new Error('RABBIT_URL not found');
        }
        this.url = process.env.RABBIT_URL;
        const connection = await connect(this.url);
        if (!connection) {
            throw new Error('Rabbit connection not found');
        }

        return connection;
    }

    async createInfrastructure(channel: Channel) {
        const exchange = 'amq.direct';
        const queue = 'cpfs_queue';
        const routingKey = 'cpfs_queue';
        const deadLetterExchange = 'dead_letter_exchange';
        const deadLetterQueue = 'dead_letter_queue';

        const deadLetterExchangeOptions = { durable: true };
        await channel.assertExchange(deadLetterExchange, 'direct', deadLetterExchangeOptions);

        const deadLetterQueueOptions = { durable: true, deadLetterExchange, deadLetterRoutingKey: routingKey };
        await channel.assertQueue(deadLetterQueue, deadLetterQueueOptions);

        await channel.bindQueue(deadLetterQueue, deadLetterExchange, routingKey);
        const queueOptions = {
            durable: true,
            deadLetterExchange,
            deadLetterRoutingKey: routingKey,
        };
        await channel.assertQueue(queue, queueOptions);
        await channel.bindQueue(queue, exchange, routingKey);
    }

    async createChannel(connection: Connection): Promise<Channel> {
        const channel = await connection.createChannel();
        if (!channel) {
            throw new Error('Rabbit channel not found');
        }

        await this.createInfrastructure(channel);

        const enableConsumer = process.env.ENABLE_CONSUMER;
        if (enableConsumer) {
            if (!this.channel) {
                this.channel = channel;
                this.runConsumer();
            }
        }

        console.log(`✔️ RabbitMQ conectado: ${this.url}`);

        return channel;
    }
}

export default new RabbitHelper();
