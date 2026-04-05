import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateUser } from '../api/hooks';
import ErrorAlert from '../components/ErrorAlert';
import type { ProblemDetails } from '../types/problem';
import { useNavigate } from 'react-router-dom';
import { BiUserPlus } from 'react-icons/bi';

const schema = z.object({ username: z.string().min(1, 'Informe usuário'), password: z.string().min(1, 'Informe senha') });
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
    const createUser = useCreateUser();

    async function onSubmit(values: FormData) {
        try {
            await createUser.mutateAsync(values);
            navigate('/login');
        } catch (e) {
            // handled via problem UI
        }
    }

    return (
        <div className="login-container slide-up">
            <div className="chat-avatar" style={{ margin: '0 auto 1.5rem', width: '64px', height: '64px', fontSize: '1.5rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                <BiUserPlus />
            </div>
            <h2>Criar conta</h2>
            <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Junte-se à nossa comunidade</p>

            <ErrorAlert problem={(createUser.error as ProblemDetails) ?? null} />

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label>Usuário</label>
                    <input {...register('username')} placeholder="Escolha um usuário" />
                    {errors.username && <small className="error">{errors.username.message}</small>}
                </div>

                <div className="form-group">
                    <label>Senha</label>
                    <input type="password" {...register('password')} placeholder="••••••••" />
                    {errors.password && <small className="error">{errors.password.message}</small>}
                </div>

                <button type="submit" className="btn-login" disabled={createUser.isPending} style={{ background: '#10b981' }}>
                    {createUser.isPending ? 'Registrando...' : 'Registrar'}
                </button>
                <button type="button" className="btn-register" onClick={() => navigate('/login')} style={{ border: 'none' }}>
                    Já tem conta? <span style={{ fontWeight: 'bold', color: '#10b981' }}>Fazer login</span>
                </button>
            </form>
        </div>
    );
}


