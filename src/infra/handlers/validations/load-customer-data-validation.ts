import { validateCPF } from 'validations-br';
import * as yup from 'yup';

export async function loadCustomerDataInputValidation(cpf?: string) {
    const inputValidationObject = {
        cpf: yup
            .string()
            .required()
            .test('cpf-is-valid', 'CPF deve ser válido.', value => validateCPF(value)),
    };

    const schema = yup.object().shape(inputValidationObject);

    const isValid = await schema.validate(
        {
            cpf,
        },
        { abortEarly: false }
    );

    return isValid;
}
