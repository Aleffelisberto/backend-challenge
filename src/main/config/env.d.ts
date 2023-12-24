declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            PORT: number;
            CONSULTA_API_USERNAME: string;
            CONSULTA_API_PASSWORD: string;
            CONSULTA_API_URL: string;
            RABBIT_URL: string;
            ELASTIC_NODE_URL: string;
            REDIS_URL: string;
            ENABLE_CONSUMER: boolean;
        }
    }
}

export {};
