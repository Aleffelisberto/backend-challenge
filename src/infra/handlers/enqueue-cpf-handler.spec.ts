import { EnqueueCpfUseCase } from '@data/use-cases/ds-enqueue-cpf';
import app from '@main/app';
import request from 'supertest';

jest.mock('redis');
jest.mock('@infra/data-store/redis-helper', () => {
    return {
        connect: jest.fn(),
    };
});
jest.mock('@infra/data-store/elastic-search-helper', () => {
    return {
        connect: jest.fn(),
    };
});

describe('EnqueueCpfHandler', () => {
    test('should return status 400 if CPF is missing', async () => {
        const response = await request(app).post(`/customer`).send({});
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'parâmetro ausente: cpf' });
    });

    test('should return status 400 if CPF is invalid', async () => {
        const response = await request(app).post(`/customer`).send({ cpf: 'invalidcpf' });
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'parâmetro inválido: cpf' });
    });

    test('should return status 201 if CPF is enqueued', async () => {
        jest.spyOn(EnqueueCpfUseCase.prototype, 'enqueue').mockReturnValueOnce(Promise.resolve());
        const response = await request(app).post(`/customer`).send({ cpf: '427.565.510-90' });
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({ cpf: '427.565.510-90', message: 'enqueued' });
    });

    test('should return status 500 if some error occur', async () => {
        jest.spyOn(EnqueueCpfUseCase.prototype, 'enqueue').mockImplementationOnce(() => {
            throw new Error('someerror');
        });
        const response = await request(app).post(`/customer`).send({ cpf: '427.565.510-90' });
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ message: 'internal server error' });
    });
});
