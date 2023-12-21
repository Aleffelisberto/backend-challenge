import { Client } from '@elastic/elasticsearch';

export type ElasticIndices = 'cpfs';

class ElasticSearchHelper {
    private client = null as unknown as Client;
    private cloudId: string;

    constructor() {
        this.cloudId = process.env.ELASTIC_CLOUD_ID;
    }

    public async connect() {
        try {
            const elasticClient = new Client({
                cloud: {
                    id: this.cloudId,
                },
                auth: {
                    username: process.env.ELASTIC_USERNAME,
                    password: process.env.ELASTIC_PASSWORD,
                },
            });

            await elasticClient.indices.create({ index: 'cpfs' });

            this.client = elasticClient;
        } catch (error: unknown) {
            console.error('ELASTIC SEARCH CONNECTION ERROR: ', (<Error>error).message);
        }
    }

    public async indexDocument(index: ElasticIndices, document: any) {
        await this.client.index({
            index,
            document: document,
        });
    }

    public async getById(index: ElasticIndices, id: string) {
        return this.client.get({
            index,
            id,
        });
    }
}

export default new ElasticSearchHelper();
