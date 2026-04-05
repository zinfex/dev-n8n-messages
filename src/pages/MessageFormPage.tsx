import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateMessage, useMessage, useUpdateMessage } from '../api/hooks';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';
import type { ProblemDetails } from '../types/problem';
import { useEffect } from 'react';
import { BiArrowBack, BiSend } from 'react-icons/bi';

const schema = z.object({
    title: z.string().min(1, 'Título é obrigatório'),
    description: z.string().min(10, 'Mínimo de 10 caracteres'),
    status: z.enum(['draft', 'published'])
});

export type FormData = z.infer<typeof schema>;

export default function MessageFormPage(){
    const { id } = useParams();
    const isEdit = Boolean(id);
    const { data, isLoading, error } = useMessage(id || '');
    const create = useCreateMessage();
    const update = useUpdateMessage(id || '');
    const navigate = useNavigate();
    
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
    
    useEffect(()=>{
        if (isEdit && data) {
            setValue('title', data.title);
            setValue('description', data.descricao);
            setValue('status', data.status);
        }
    }, [isEdit, data, setValue]);

    useEffect(() => {
        if (!isEdit) {
            setValue('title', '');
            setValue('description', '');
            setValue('status', 'draft');
        }
    }, [isEdit, setValue]);
    
    async function onSubmit(values: FormData){
        try {
            if (isEdit) {
                await update.mutateAsync(values);
                navigate(`/messages/${id}`);
            } else {
                const created = await create.mutateAsync(values);
                navigate(`/messages/${created.id}`);
            }
        } catch (error) {
            console.error('Erro ao salvar mensagem:', error);
        }
    }
    
    if (isEdit && isLoading) return <Loader/>;

    const problem = (create.error || update.error || error) as ProblemDetails | null;

    return (
        <div className="messages-container slide-up">
            <div className="header">
                <button className="btn-close" onClick={() => navigate(-1)} style={{ marginRight: '12px' }}>
                    <BiArrowBack />
                </button>
                <h2>{isEdit ? 'Editar mensagem' : 'Nova mensagem'}</h2>
            </div>

            <ErrorAlert problem={problem} />

            <form onSubmit={handleSubmit(onSubmit)} className="bubble-container" style={{ padding: '0' }}>
                <div className="form-group">
                    <label>Título da Mensagem</label>
                    <input {...register('title')} placeholder="Assunto..." />
                    {errors.title && <small className="error">{errors.title.message}</small>}
                </div>

                <div className="form-group">
                    <label>Conteúdo</label>
                    <textarea 
                        rows={8} 
                        {...register('description')} 
                        placeholder="Escreva sua mensagem aqui..."
                        style={{ resize: 'none' }}
                    />
                    {errors.description && <small className="error">{errors.description.message}</small>}
                </div>

                <div className="form-group">
                    <label>Status da Mensagem</label>
                    <select {...register('status')}>
                        <option value="draft">Rascunho (Salvar para depois)</option>
                        <option value="published">Publicado (Enviar agora)</option>
                    </select>
                </div>

                <div className="form-actions" style={{ justifyContent: 'flex-end', marginTop: '2rem' }}>
                    <button 
                        type="button" 
                        className="btn-secondary" 
                        onClick={() => navigate(-1)}
                        disabled={create.isPending || update.isPending}
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        className="btn-login" 
                        disabled={create.isPending || update.isPending}
                        style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '0' }}
                    >
                        {isEdit 
                            ? (update.isPending ? 'Salvando...' : 'Salvar') 
                            : (create.isPending ? 'Enviando...' : 'Enviar')
                        }
                        <BiSend />
                    </button>
                </div>
            </form>
        </div>
    );
}
