export class MissingParamError extends Error {
    constructor(paramName: string) {
        super(`parâmetro ausente: ${paramName}`);
        this.name = 'MissingParamError';
    }
}
