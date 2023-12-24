import { RedisClientType, createClient } from 'redis';
import redisHelper from './redis-helper';

jest.mock('redis', () => {
    const mockedClient: Partial<RedisClientType> = {
        on: jest.fn(),
        connect: jest.fn(),
        get: jest.fn(),
        set: jest.fn(),
        expire: jest.fn(),
    };

    return {
        createClient: jest.fn(() => mockedClient),
    };
});

interface SutTypes {
    sut: typeof redisHelper;
}

const benefits = [{ numero_beneficio: '124', codigo_tipo_beneficio: '1' }];

const makeSut = (): SutTypes => {
    return { sut: redisHelper };
};

describe('redisHelper', () => {
    beforeEach(() => {
        process.env.REDIS_URL = 'some_url';
    });

    it('should throw error if redis connection fail', async () => {
        const { sut } = makeSut();
        jest.spyOn(createClient(), 'on').mockImplementationOnce(() => {
            throw new Error();
        });

        const errorResponse = sut.connect();
        await expect(errorResponse).rejects.toThrow('Redis connection not established');
    });

    it('should create a client if redis establish a connection', async () => {
        const { sut } = makeSut();
        const connectSpy = jest.spyOn(createClient(), 'on');

        const response = await sut.connect();
        expect(connectSpy).toHaveBeenCalled();
        expect(response).toBeUndefined();
    });

    it('should get a value from a given key', async () => {
        const { sut } = makeSut();
        const getSpy = jest.spyOn(createClient(), 'get');
        const stringifiedBenefits = JSON.stringify(benefits);
        getSpy.mockReturnValueOnce(Promise.resolve(stringifiedBenefits));

        const response = await sut.get('123.456.789-10');
        expect(response).toBe(stringifiedBenefits);
        expect(getSpy).toHaveBeenCalledWith('123.456.789-10');
    });

    it('should store a given key-value pair', async () => {
        const { sut } = makeSut();
        const setSpy = jest.spyOn(createClient(), 'set');
        setSpy.mockReturnValueOnce(Promise.resolve(''));

        await sut.set('123.456.789-10', JSON.stringify(benefits));
        expect(setSpy).toHaveBeenCalledWith('123.456.789-10', JSON.stringify(benefits));
    });

    it('should set expiresIn to a given key', async () => {
        const { sut } = makeSut();
        const expireSpy = jest.spyOn(createClient(), 'expire');
        expireSpy.mockReturnValueOnce(Promise.resolve(true));

        await sut.setExpireIn('123.456.789-10', 30);
        expect(expireSpy).toHaveBeenCalledWith('123.456.789-10', 30);
    });
});
