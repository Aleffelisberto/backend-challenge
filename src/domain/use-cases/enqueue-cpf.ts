export interface EnqueueCpf {
    enqueue: (cpf: string[]) => Promise<void>;
}
