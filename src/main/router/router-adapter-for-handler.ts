import { Handler } from '@presentation/protocols/handler';
import { Request, Response } from 'express';

export const routeAdapterForHandler = (handler: Handler) => {
    return async (req: Request, res: Response) => {
        return handler.handle(req, res);
    };
};
