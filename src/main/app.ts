import express, { Express } from 'express';
import routes from './router/routes';
import bodyParser from 'body-parser';
import rabbitHelper from '@infra/queue/rabbit-helper';
import redisHelper from '@infra/data-store/redis-helper';
import elasticSearchHelper from '@infra/data-store/elastic-search-helper';

class App {
    public server: Express;

    constructor() {
        this.server = express();

        this.routes();
        this.initRabbitMq();
        this.initRedis();
        this.initElasticSeach();
    }

    routes() {
        this.server.use(bodyParser.json());
        this.server.use(routes);
    }

    initRabbitMq() {
        rabbitHelper.init();
    }

    initRedis() {
        redisHelper.connect();
    }

    initElasticSeach() {
        elasticSearchHelper.connect();
    }
}

export default new App().server;
