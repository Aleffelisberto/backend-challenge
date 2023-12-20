export class InvalidParamError extends Error {
    constructor(paramName: string) {
        super(`parâmetro inválido: ${paramName}`);
        this.name = 'InvalidParamError';
    }
}
