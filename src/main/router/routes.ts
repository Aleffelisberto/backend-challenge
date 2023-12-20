import { Router } from 'express';
import { makeLoadCustomerDataHandler } from '@main/factories/handlers/load-customer-data-handler-factory';
import { routeAdapterForHandler } from './router-adapter-for-handler';

const routes = Router();

routes.get('/customer/:cpf', routeAdapterForHandler(makeLoadCustomerDataHandler()));

export default routes;
