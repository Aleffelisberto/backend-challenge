export const unmaskCpf = (cpf: string): string => {
    return cpf.replace(/\D/g, '');
};
