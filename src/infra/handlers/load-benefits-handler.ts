import { LoadBenefits } from '@domain/use-cases/load-benefits';
import { Request, Response } from 'express';
import { Validator } from '@presentation/protocols/validator';
import { Handler } from '@presentation/protocols/handler';

export class LoadBenefitsHandler implements Handler {
    constructor(
        private readonly validator: Validator,
        private readonly loadBenefitsUseCase: LoadBenefits
    ) {}

    async handle(req: Request, res: Response) {
        try {
            const isRequestInvalid = this.validator.validate(req.query);
            if (isRequestInvalid) {
                return res.status(400).json({ error: isRequestInvalid.message });
            }
            const cpfQuery = req.query.cpf as string;
            const { cpf, beneficios } = await this.loadBenefitsUseCase.load(cpfQuery);
            if (beneficios.length === 0) {
                return res.status(404).json({ cpf, message: `nenhum benefício cadastrado` });
            }
            return res.json({ cpf, beneficios });
        } catch (error: unknown) {
            return res.status(500).json({ message: 'internal server error' });
        }
    }
}
