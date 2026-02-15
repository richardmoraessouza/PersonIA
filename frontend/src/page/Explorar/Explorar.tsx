import { useState } from 'react';
import styles from './Explorar.module.css';
import { useAuth } from "../../hooks/AuthContext/AuthContext";
import { useFavorites } from '../../hooks/FavoritesContext/FavoritesContext';
import { useNavigate } from 'react-router-dom';
import CampoDePesquisar from '../../components/CampoDePesquisar/CampoDePesquisar';
import { usePersonagensUsuario } from '../../hooks/UserPerson/UserPerson';

function BuscarPersonagem() {
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const { usuarioId, token } = useAuth();
    const { adicionarFavorito, removerFavorito } = useFavorites();

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

        try {
            const personagem = personagens.find(p => p.id === personagem_id);
            
            if (personagem?.favoritadoPeloUsuario) {
                // Remover favorito
                removerFavorito(personagem_id);
            } else if (personagem) {
                // Adicionar favorito
                adicionarFavorito({
                    id: personagem.id,
                    nome: personagem.nome,
                    fotoia: personagem.fotoia
                });
            }

            // Fazer a requisição ao backend
            await favorito(personagem_id);

            // Notificar que os favoritos foram atualizados
            localStorage.setItem('favoritos_updated', Date.now().toString());

            try {
                const next = personagens.map(p => p.id === personagem_id ? { ...p, favoritadoPeloUsuario: !p.favoritadoPeloUsuario } : p);
                const favoritosIds = next.filter(n => n.favoritadoPeloUsuario).map(n => n.id);
                if (usuarioId) localStorage.setItem(`favoritos_${usuarioId}`, JSON.stringify(favoritosIds));
            } catch (err) { /* ignore */ }

        } catch (err) {
            console.error('Erro no toggle favorito:', err);
        }
    };

    return (
        <main className={styles.container}>
            <header>
                <CampoDePesquisar />
            </header>

            {loading ? (
                <div className={styles.loader}>Carregando personagens...</div>
            ) : error ? (
                <div className={styles.empty}>{error}</div>
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

                                    <button onClick={(e) => e.stopPropagation()}>
                                        <span>0 </span> <i className="fa-solid fa-comment"></i> 
                                    </button>

                                    <button className={styles.favorito} onClick={(e) => handleToggleFavorito(e, p.id)}>
                                        <i className={`fa ${p.favoritadoPeloUsuario ? 'fa-solid fa-star' : 'fa-regular fa-star'}`} 
                                        style={{ 
                                            cursor: 'pointer', 
                                            transition: 'all 0.3s',
                                            color: p.favoritadoPeloUsuario ? '#FFD700' : '#888'
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