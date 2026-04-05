import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMessage } from '../api/hooks';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';
import type { ProblemDetails } from '../types/problem';
import { BiArrowBack, BiEdit } from 'react-icons/bi';

export default function MessageDetailPage(){
    const { id = '' } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, error } = useMessage(id);
    
    if (isLoading) return <Loader/>;
    
    return (
        <div className="messages-container fade-in">
            <div className="header">
                <button className="btn-close" onClick={() => navigate('/messages')} style={{ marginRight: '12px' }}>
                    <BiArrowBack />
                </button>
                <h2>Detalhe</h2>
                <div style={{ flex: 1 }}></div>
                {data && (
                    <Link className="btn-edit" to={`/messages/${data.id}/edit`}>
                        <BiEdit />
                    </Link>
                )}
            </div>

            <ErrorAlert problem={error as ProblemDetails | null} />

            {data && (
                <div className="bubble-container">
                    <div className="chat-header" style={{ justifyContent: 'center', marginBottom: '20px' }}>
                        <span className="chat-time" style={{ background: '#e2e8f0', padding: '4px 12px', borderRadius: '12px' }}>
                            {new Date(data.updated_at).toLocaleString()}
                        </span>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                        <div className="chat-avatar" style={{ width: '36px', height: '36px', fontSize: '1rem' }}>
                            {data.title.charAt(0).toUpperCase()}
                        </div>
                        <div className="bubble bubble-left slide-up">
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: 'var(--primary)' }}>{data.title}</h3>
                            <p className="detail-body" style={{ margin: 0 }}>{data.descricao}</p>
                            {data.descricao && (
                                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #eee', fontSize: '0.85rem', color: '#666' }}>
                                    <strong>Descrição:</strong> {data.descricao}
                                </div>
                            )}
                            <div className="bubble-meta">
                                <span className={`status-badge status-${data.status}`}>
                                    {data.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
