import express, { Express } from 'express';
import routes from './router/routes';

class App {
    public server: Express;

    constructor() {
        this.server = express();

        this.routes();
        // initialize rabbitmq instance (if enabled)
        // initialize redis instance
        // initialize elastic search instance
    }

    routes() {
        this.server.use(routes);
    }
}

export default new App().server;
