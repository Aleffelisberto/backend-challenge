import { Handler } from '@presentation/protocols/handler';
import { Request, Response } from 'express';
import { routeAdapterForHandler } from './router-adapter-for-handler';

describe('Route Adapter', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should create a route adapter for handler', async () => {
        const mockHandler: Handler = {
            async handle(_req: Request, res: Response) {
                return res.json({ message: 'some message' });
            },
        };

        const routeAdapter = routeAdapterForHandler(mockHandler);
        const mockRequest = {} as Request;
        const mockResponse = {
            json: jest.fn(),
        } as unknown as Response;

        await routeAdapter(mockRequest, mockResponse);

        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'some message' });
    });
});
