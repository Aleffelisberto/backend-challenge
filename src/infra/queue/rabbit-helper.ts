import { Channel, connect, Connection } from 'amqplib';
import 'dotenv/config';

export interface CpfQueueMessage {
    cpf: string;
}
export type IQueues = 'cpfs_queue';
export type IExchanges = 'amq.direct';

class Rabbit {
    private connection: Connection | undefined;

    private channel: Channel | undefined;

    private uri: string;

    constructor() {
        if (!process.env.RABBIT_URL) {
            throw new Error('RABBIT_URL not found');
        }
        this.uri = process.env.RABBIT_URL;
    }

    async init() {
        try {
            this.connection = await this.createConnection();
            this.channel = await this.createChannel(this.connection);
        } catch (err: any) {
            console.log('ERROR RABBIT INIT CONNECTION', err.message);
            console.log('ERROR RABBIT INIT CONNECTION', err.stack);
        }
    }

    async sendCpfToQueue(message: CpfQueueMessage) {
        return this.sendExchange('amq.direct', 'cpfs_queue', JSON.stringify(message));
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

    async createConnection() {
        const connection = await connect(this.uri);
        if (!connection) {
            throw new Error('Rabbit connection not found');
        }

        return connection;
    }

    async createChannel(connection: Connection) {
        const channel = await connection.createChannel();
        if (!channel) {
            throw new Error('Rabbit channel not found');
        }

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

        console.log(`✔️ RabbitMQ conectado: ${this.uri}`);

        return channel;
    }
}

export default new Rabbit();
