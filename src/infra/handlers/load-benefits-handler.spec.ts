import request from 'supertest';
import { LoadBenefitsUseCase } from '@data/use-cases/ds-load-benefits';
import app from '@main/app';

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

const benefits = [{ numero_beneficio: '124', codigo_tipo_beneficio: '1' }];

describe('LoadBenefitsHandler', () => {
    test('should return status 400 if CPF is missing', async () => {
        const response = await request(app).get(`/customer`);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'parâmetro ausente: cpf' });
    });

    test('should return status 400 if CPF is invalid', async () => {
        const response = await request(app).get(`/customer?cpf=1234234`);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'parâmetro inválido: cpf' });
    });

    test('should return status 404 if no benefits are returned', async () => {
        jest.spyOn(LoadBenefitsUseCase.prototype, 'load').mockReturnValueOnce(Promise.resolve({ cpf: '42756551090', beneficios: [] }));
        const response = await request(app).get(`/customer?cpf=427.565.510-90`);
        expect(response.body).toEqual({ cpf: '42756551090', message: 'nenhum benefício cadastrado' });
        expect(response.statusCode).toBe(404);
    });

    test('should return status 200 and the benefits if CPF has at least one benefit', async () => {
        jest.spyOn(LoadBenefitsUseCase.prototype, 'load').mockReturnValueOnce(Promise.resolve({ cpf: '42756551090', beneficios: benefits }));
        const response = await request(app).get(`/customer?cpf=427.565.510-90`);
        expect(response.body).toEqual({
            cpf: '42756551090',
            beneficios: benefits,
        });
        expect(response.statusCode).toBe(200);
    });

    test('should return status 500 if some error occur', async () => {
        jest.spyOn(LoadBenefitsUseCase.prototype, 'load').mockImplementationOnce(() => {
            throw new Error('some error occurred');
        });
        const response = await request(app).get(`/customer?cpf=427.565.510-90`);
        expect(response.body).toEqual({ message: 'internal server error' });
        expect(response.statusCode).toBe(500);
    });
});
