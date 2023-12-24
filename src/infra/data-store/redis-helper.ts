import { RedisClientType, createClient } from 'redis';
import 'dotenv/config';

class RedisHelper {
    private client = null as unknown as RedisClientType;
    private url: string | undefined;

    async connect() {
        try {
            this.url = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
            const redisClient = createClient({ url: this.url });
            redisClient.on('error', err => console.log('Redis Client Error', err));

            await redisClient.connect();

            this.client = redisClient as RedisClientType;
            console.log(`✔️ Redis conectado: ${this.url}`);
        } catch (error: unknown) {
            throw new Error('Redis connection not established');
        }
    }

    async get(key: string) {
        const data = await this.client.get(key);

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
