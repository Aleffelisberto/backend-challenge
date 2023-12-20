import { Request, Response } from 'express';
import { Validator } from '@presentation/protocols/validator';
import { LoadCustomerData } from '@domain/use-cases/load-customer-data';
import { Handler } from '@presentation/protocols/handler';

export class LoadCustomerDataHandler implements Handler {
    constructor(
        private readonly validator: Validator,
        private readonly loadCustomerDataUseCase: LoadCustomerData
    ) {}

    async handle(req: Request, res: Response) {
        try {
            const isRequestInvalid = this.validator.validate(req.params);
            if (isRequestInvalid) {
                return res.status(400).json({ error: isRequestInvalid.message });
            }
            const customerData = await this.loadCustomerDataUseCase.load(req.params.cpf);
            return res.json(customerData);
        } catch (error: unknown) {
            return res.status(500).json({ message: (<Error>error).message });
        }
    }
}
