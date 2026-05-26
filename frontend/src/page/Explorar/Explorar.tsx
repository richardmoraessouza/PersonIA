import styles from './Explorar.module.css';
import { useAuth } from "../../hooks/AuthContext/AuthContext";
import { useNavigate } from 'react-router-dom';
import CampoDePesquisar from '../../components/CampoDePesquisar/CampoDePesquisar';
import { usePersonagensUsuario } from '../../hooks/UserPerson/UserPerson';

function BuscarPersonagem() {
    const navigate = useNavigate();
    const { usuarioId, token } = useAuth();

    const { personagens, like, favorito, loading } = usePersonagensUsuario(usuarioId, token);

    const handleToggleLike = async (e: React.MouseEvent, personagem_id: number) => {
        e.stopPropagation();

        if (!usuarioId) {
            navigate('/entrar');
            return;
        }

        try {
            await like(personagem_id);
        } catch (err) {
            console.error('Erro no toggle like:', err);
        }
    };

    const handleToggleFavorito = async (e: React.MouseEvent, personagem_id: number) => {
        e.stopPropagation();

        if (!usuarioId) {
            navigate('/entrar');
            return;
        }

        if (!token || token.trim() === '') {
            console.error('Token inválido ou vazio');
            navigate('/entrar');
            return;
        }


        try {
            // Fazer a requisição ao favorito (já faz a requisição ao backend)
            await favorito(personagem_id);

            // Notificar que os favoritos foram atualizados
            localStorage.setItem('favoritos_updated', Date.now().toString());

            try {
                const next = personagens.map(p => p.id === personagem_id ? { ...p, favoritadoPeloUsuario: !p.favoritadoPeloUsuario } : p);
                const favoritosIds = next.filter(n => n.favoritadoPeloUsuario).map(n => n.id);
                if (usuarioId) localStorage.setItem(`favoritos_${usuarioId}`, JSON.stringify(favoritosIds));
            } catch (err) { /* ignore */ }

        } catch (err: any) {
            console.error('Erro no toggle favorito:', err);
            
            // Se for erro 401 (Unauthorized), redirecionar para login
            if (err?.response?.status === 401) {
                console.warn('Token expirado ou inválido - redirecionando para login');
                navigate('/entrar');
            }
        }
    };

    return (
        <main className={styles.container}>
            <header>
                <CampoDePesquisar />
            </header>

            {loading ? (
                <div className={styles.loader}>Carregando personagens...</div>
            ) : (
                <section className={styles.grid}>
                    {personagens.map(p => (
                        <article key={p.id} className={styles.card} onClick={() => navigate(`/personagem/${p.id}`)}>
                            <div className={styles.cardHeader}>
                                <img className={styles.avatar} src={p.fotoia || '/image/semPerfil.jpg'} alt={p.nome} />

                                <div className={styles.interactions}>

                                    <button 
                                        className={`${styles.likeButton} ${p.curtidoPeloUsuario ? styles.active : ''}`}
                                        onClick={(e) => handleToggleLike(e, p.id)}
                                        >
                                        <span>{p.likes ?? 0}</span>
                                        <svg
                                            width="24" height="24" viewBox="0 0 24 24"
                                            fill={p.curtidoPeloUsuario ? "#ff4b4b" : "none"} 
                                            stroke={p.curtidoPeloUsuario ? "#ff4b4b" : "currentColor"}
                                            strokeWidth="2"
                                        >
                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                        </svg>
                                    </button>

                                    <button onClick={(e) => e.stopPropagation()} className={`flex items-center gap-2`}>
                                        <span>0</span>
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="15"
                                            height="15"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M4 5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H9l-5 5v-5a3 3 0 0 1-3-3V5z"/>
                                            <line x1="8" y1="8" x2="16" y2="8"/>
                                            <line x1="8" y1="12" x2="13" y2="12"/>
                                        </svg> 
                                    </button>

                                    <button className={styles.favorito} onClick={(e) => handleToggleFavorito(e, p.id)}>
                                        <i className={`fa ${p.favoritadoPeloUsuario ? 'fa-solid fa-star' : 'fa-regular fa-star'}`} 
                                        style={{ 
                                            cursor: 'pointer', 
                                            transition: 'all 0.3s',
                                            color: p.favoritadoPeloUsuario ? '#FFD700' : 'white'
                                        }}
                                        ></i>
                                    </button>
                                </div>
                            </div>

                            <div className={styles.cardBody}>
                                <div className={styles.name}>{p.nome}</div>
                                <div className={styles.desc}>{p.bio || 'Sem Bio'}</div>
                            </div>
                            <div className={styles.meta}>@{p.nome_criador}</div>
                        </article>
                    ))}
                    
                </section>
            )}
        </main>
    );
}

export default BuscarPersonagem;