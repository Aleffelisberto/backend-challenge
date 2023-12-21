import { RedisClientType, createClient } from 'redis';

class RedisHelper {
    private client = null as unknown as RedisClientType;
    private url: string;

    constructor() {
        this.url = process.env.REDIS_URL || 'redis://127.0.0.1:6380';
    }

    async connect() {
        try {
            const redisClient = createClient({ url: this.url });
            redisClient.on('error', err => console.log('Redis Client Error', err));

            await redisClient.connect();

            console.log(`✔️ Redis conectado: ${this.url}`);
            this.client = redisClient as RedisClientType;
        } catch (error: unknown) {
            throw new Error('Redis connection not established');
        }
    }

    async get(value: string) {
        const data = await this.client.get(value);
        return data;
    }

    async set(key: string, value: string) {
        await this.client.set(key, value);
    }

    async setExpireIn(key: string, seconds: number) {
        await this.client.expire(key, seconds);
    }
}

export default new RedisHelper();
