import { LoadCustomerData } from '@domain/use-cases/load-customer-data';
import { ConsultaApiServiceInterface } from '@infra/services/consulta-api-interface';

export class LoadCustomerDataUseCase implements LoadCustomerData {
    constructor(private readonly consultaApiService: ConsultaApiServiceInterface) {}

    async load(cpf: string): Promise<LoadCustomerData.Result> {
        // buscar cpf no redis

        // se existe, retorna dados

        // se não, busca no elastic

        // se existe, retorna dados

        // se não, busca na consulta api

        // se existe, salva no elastic, salva no redis e retorna

        // se não, retorna null
        return null;
    }
}
