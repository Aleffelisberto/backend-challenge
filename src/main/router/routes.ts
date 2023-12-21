import { Router } from 'express';
import { makeLoadCustomerDataHandler } from '@main/factories/handlers/load-customer-data-handler-factory';
import { routeAdapterForHandler } from './router-adapter-for-handler';
import { makeEnqueueCpfHandler } from '@main/factories/handlers/enqueue-cpf-handler-factory';

const routes = Router();

routes.get('/customer/:cpf', routeAdapterForHandler(makeLoadCustomerDataHandler()));

routes.post('/customer', routeAdapterForHandler(makeEnqueueCpfHandler()));

export default routes;
