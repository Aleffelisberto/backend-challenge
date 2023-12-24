import { LoadBenefitsUseCase } from '@data/use-cases/ds-load-benefits';
import { CpfsQueueConsumer } from './cpfs-queue-consumer';

jest.mock('@data/use-cases/ds-load-benefits', () => {
    return {
        LoadBenefitsUseCase: jest.fn().mockImplementation(() => {
            return {
                load: jest.fn().mockReturnValueOnce(Promise.resolve([{ numero_beneficio: '123', codigo_tipo_beneficio: '1' }])),
            };
        }),
    };
});

interface SutTypes {
    sut: CpfsQueueConsumer;
}

const makeSut = (): SutTypes => {
    const sut = new CpfsQueueConsumer();

    return { sut };
};

describe('CpfsQueueConsumer', () => {
    it('should return true if LoadBenefitsUseCase response is not null', async () => {
        const response = await makeSut().sut.consume({ cpf: '123.456.789-10' });
        expect(response).toBe(true);
    });
});
