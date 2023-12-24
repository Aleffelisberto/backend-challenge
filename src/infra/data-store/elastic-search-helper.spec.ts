import elasticSearchHelper from '@infra/data-store/elastic-search-helper';

jest.mock('@elastic/elasticsearch', () => {
    const mockClient = {
        ping: jest.fn().mockResolvedValueOnce({}),
        indices: {
            create: jest.fn().mockResolvedValueOnce({}),
            exists: jest.fn().mockResolvedValueOnce(true),
        },
        index: jest.fn(),
        get: jest.fn(),
    };

    return {
        Client: jest.fn().mockImplementation(() => mockClient),
    };
});

interface SutTypes {
    sut: typeof elasticSearchHelper;
}

const makeSut = (): SutTypes => {
    const sut = elasticSearchHelper;
    return { sut };
};

describe('ElasticSearchHelper', () => {
    beforeEach(() => {
        process.env.ELASTIC_NODE_URL = 'somenodeurl';
        jest.clearAllMocks();
    });

    it('should be able to create a client if connection is estalished', async () => {
        const { sut } = makeSut();

        const response = await sut.connect();
        expect(response).toBeUndefined();
    });
});
