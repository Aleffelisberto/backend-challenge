import { Router } from 'express';
import { makeLoadBenefitsHandler } from '@main/factories/handlers/load-benefits-handler-factory';
import { routeAdapterForHandler } from './router-adapter-for-handler';
import { makeEnqueueCpfHandler } from '@main/factories/handlers/enqueue-cpf-handler-factory';

const routes = Router();

routes.get('/customer', routeAdapterForHandler(makeLoadBenefitsHandler()));

routes.post('/customer', routeAdapterForHandler(makeEnqueueCpfHandler()));

export default routes;
