import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useMessage, useUpdateMessage } from '../api/hooks';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';
import type { ProblemDetails } from '../types/problem';
import { useEffect, useState } from 'react';
import { BiArrowBack, BiSave } from 'react-icons/bi';

const schema = z.object({
    title: z.string().min(1, 'Título é obrigatório'),
    description: z.string().min(10, 'Mínimo de 10 caracteres'),
    status: z.enum(['draft', 'published'])
});

type FormData = z.infer<typeof schema>;

export default function EditMessagePage(){
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { data: message, isLoading, error } = useMessage(id || '');
    const update = useUpdateMessage(id || '');
    
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({ 
        resolver: zodResolver(schema),
        defaultValues: {
            title: '',
            description: '',
            status: 'draft'
        }
    });
    
    useEffect(() => {
        if (message) {
            setValue('title', message.title);
            setValue('description', message.descricao);
            setValue('status', message.status);
        }
    }, [message, setValue]);
    
    async function onSubmit(values: FormData) {
        if (!id) return;
        
        setIsSubmitting(true);
        try {
            await update.mutateAsync(values);
            navigate(`/messages/${id}`);
        } catch (error) {
            console.error('Erro ao salvar mensagem:', error);
        } finally {
            setIsSubmitting(false);
        }
    }
    
    if (isLoading) {return <Loader />}
    
    if (error) {
        return (
            <div className="messages-container fade-in">
                <div className="header">
                    <button className="btn-close" onClick={() => navigate(-1)} style={{ marginRight: '12px' }}>
                        <BiArrowBack />
                    </button>
                    <h2>Erro ao carregar</h2>
                </div>
                <ErrorAlert problem={error as unknown as ProblemDetails} />
                <button className="btn-secondary" onClick={() => navigate(-1)}>
                    Voltar
                </button>
            </div>
        );
    }
    
    return (
        <div className="messages-container slide-up">
            <div className="header">
                <button className="btn-close" onClick={() => navigate(-1)} style={{ marginRight: '12px' }}>
                    <BiArrowBack />
                </button>
                <h2>Editar mensagem</h2>
            </div>
            
            <ErrorAlert problem={(update.error as ProblemDetails) || null} />
            
            <form onSubmit={handleSubmit(onSubmit)} className="bubble-container" style={{ padding: '0' }}>
                <div className="form-group">
                    <label>Título</label>
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
                    <label>Status</label>
                    <select {...register('status')}>
                        <option value="draft">Rascunho</option>
                        <option value="published">Publicado</option>
                    </select>
                </div>
                
                <div className="form-actions" style={{ justifyContent: 'flex-end', marginTop: '2rem' }}>
                    <button 
                        type="button" 
                        className="btn-secondary" 
                        onClick={() => navigate(-1)}
                        disabled={isSubmitting || update.isPending}
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        className="btn-login" 
                        disabled={isSubmitting || update.isPending}
                        style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '0' }}
                    >
                        {isSubmitting || update.isPending ? 'Salvando...' : 'Salvar Alterações'}
                        <BiSave />
                    </button>
                </div>
            </form>
        </div>
    );
}
