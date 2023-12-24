import { ServerError } from './server-error';

describe('ServerError', () => {
    it('should create a ServerError instance with the correct message', () => {
        const stackTrace = 'some stack trace';
        const serverError = new ServerError(stackTrace);

        expect(serverError).toBeInstanceOf(ServerError);
        expect(serverError.message).toEqual('erro interno no servidor');
        expect(serverError.name).toEqual('ServerError');
        expect(serverError.stack).toEqual(stackTrace);
    });
});
