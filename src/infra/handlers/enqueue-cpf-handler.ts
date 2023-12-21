import { Request, Response } from 'express';
import { Validator } from '@presentation/protocols/validator';
import { Handler } from '@presentation/protocols/handler';
import { EnqueueCpf } from '@domain/use-cases/enqueue-cpf';

export class EnqueueCpfHandler implements Handler {
    constructor(
        private readonly validator: Validator,
        private readonly enqueueCpfUseCase: EnqueueCpf
    ) {}

    async handle(req: Request, res: Response) {
        try {
            const isRequestInvalid = this.validator.validate(req.body);
            if (isRequestInvalid) {
                return res.status(400).json({ error: isRequestInvalid.message });
            }
            await this.enqueueCpfUseCase.enqueue(req.body.cpfs);

            return res.status(200).json({ result: req.body.cpfs });
        } catch (error: unknown) {
            return res.status(500).json({ message: (<Error>error).message });
        }
    }
}
