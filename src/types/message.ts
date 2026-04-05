export type Message = {
    id: string;
    title: string;
    descricao: string;
    status: 'draft' | 'published';
    created_at: string;
    updated_at: string;
};


export type Paginated<T> = {
    data: T[];
    meta: { page: number; limit: number; total: number };
};