import { Client, errors } from '@elastic/elasticsearch';
import 'dotenv/config';

export type ElasticIndices = 'cpfs';

class ElasticSearchHelper {
    private nodeUrl: string | undefined;
    private client = null as unknown as Client;

    public async connect() {
        this.nodeUrl = process.env.ELASTIC_NODE_URL;
        const elasticClient = new Client({
            node: this.nodeUrl,
        });

        try {
            await elasticClient.ping();
            const cpfsIndexExists = await elasticClient.indices.exists({
                index: 'cpfs',
            });
            if (!cpfsIndexExists) {
                await elasticClient.indices.create({ index: 'cpfs' });
            }
            this.client = elasticClient;

            console.log(`✔️ ElasticSearch conectado: ${this.nodeUrl}`);
        } catch (error) {
            console.error('Erro ao conectar ao Elasticsearch:', error);
            throw new Error('Connection failed');
        }
    }

    public async indexDocument(index: ElasticIndices, document: any) {
        await this.client.index({
            index,
            document: document,
        });
    }

    public async searchByCpf(index: ElasticIndices, cpf: string) {
        return this.client.search({
            index,
            query: {
                term: {
                    cpf,
                },
            },
        });
    }
}

export default new ElasticSearchHelper();
