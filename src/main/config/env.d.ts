declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            PORT: number;
            CONSULTA_API_USERNAME: string;
            CONSULTA_API_PASSWORD: string;
            CONSULTA_API_URL: string;
            RABBIT_URL: string;
            ELASTIC_CLOUD_ID: string;
            ELASTIC_USERNAME: string;
            ELASTIC_PASSWORD: string;
            REDIS_URL: string;
            ENABLE_CONSUMER: string;
        }
    }
}

export {};
