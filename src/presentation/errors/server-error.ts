export class ServerError extends Error {
    constructor(stack: string) {
        super('erro interno no servidor');
        this.name = 'ServerError';
        this.stack = stack;
    }
}
