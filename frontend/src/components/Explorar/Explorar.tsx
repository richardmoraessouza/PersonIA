import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Explorar.module.css';
import { useAuth } from "../AuthContext/AuthContext";
import { useNavigate } from 'react-router-dom';
import CampoDePesquisar from '../CampoDePesquisar/CampoDePesquisar';
import { API_URL } from '../../config/api';


type Personagem = {
    id: number;
    nome: string;
    fotoia?: string;
    bio?: string;
    usuario_id?: number;
    nome_criador?: string;
    likes?: number;
    curtidoPeloUsuario?: boolean;
    favoritadoPeloUsuario?: boolean;
};

function BuscarPersonagem() {
    const [personagens, setPersonagens] = useState<Personagem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const { usuarioId, token } = useAuth();

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            setError(null);

            try {
                // 1. Busca primeiro a lista de personagens
                const resPersonagens = await axios.get(`${API_URL}/personagens`);
                const listaBase = Array.isArray(resPersonagens.data)
                    ? resPersonagens.data
                    : resPersonagens.data.personagens || [];

                // 2. Busca os IDs que o usuário curtiu
                let idsCurtidos: number[] = [];
                if (usuarioId) {
                    try {
                        const resLikes = await axios.get(`${API_URL}/likesByUsuario/${usuarioId}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        idsCurtidos = Array.isArray(resLikes.data) ? resLikes.data : [];
                    } catch (e) {
                        console.error("Erro ao buscar likes do usuário, continuando sem eles...");
                    }
                }

                // 3. Busca IDs favoritados do usuário (para marcar estrela)
                let idsFavoritos: number[] = [];
                if (usuarioId) {
                    try {
                        // Primeiro tenta o endpoint que retorna os detalhes completos dos favoritos
                        const resFavsFull = await axios.get(`${API_URL}/getFavoritosFull/${usuarioId}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        if (Array.isArray(resFavsFull.data) && resFavsFull.data.length > 0) {
                            idsFavoritos = resFavsFull.data.map((item: any) => Number(item.id));
                        } else {
                            // Se não houver dados, tenta o endpoint mais simples que pode retornar IDs
                            try {
                                const resFavs = await axios.get(`${API_URL}/getFavoritosByUsuario/${usuarioId}`, {
                                    headers: { Authorization: `Bearer ${token}` }
                                });
                                const d = resFavs.data;
                                if (Array.isArray(d) && d.length > 0) {
                                    if (typeof d[0] === 'number') idsFavoritos = d.map((n: any) => Number(n));
                                    else if (typeof d[0] === 'object') idsFavoritos = d.map((o: any) => Number(o.id ?? o.personagem_id ?? o.personagemId));
                                }
                            } catch (errFavSimple) {
                                console.warn('getFavoritosByUsuario também falhou:', errFavSimple);
                                // fallback localStorage
                                try {
                                    const saved = localStorage.getItem(`favoritos_${usuarioId}`);
                                    if (saved) idsFavoritos = JSON.parse(saved).map((n: any) => Number(n));
                                } catch (errLs) { console.error('Erro lendo localStorage favoritos', errLs); }
                            }
                        }
                    } catch (errFavFull) {
                        console.warn('getFavoritosFull falhou, tentando getFavoritosByUsuario', errFavFull);
                        try {
                            const resFavs = await axios.get(`${API_URL}/getFavoritosByUsuario/${usuarioId}`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            const d = resFavs.data;
                            if (Array.isArray(d) && d.length > 0) {
                                if (typeof d[0] === 'number') idsFavoritos = d.map((n: any) => Number(n));
                                else if (typeof d[0] === 'object') idsFavoritos = d.map((o: any) => Number(o.id ?? o.personagem_id ?? o.personagemId));
                            }
                        } catch (errFavSimple) {
                            console.error('Erro ao buscar favoritos:', errFavSimple);
                            try {
                                const saved = localStorage.getItem(`favoritos_${usuarioId}`);
                                if (saved) idsFavoritos = JSON.parse(saved).map((n: any) => Number(n));
                            } catch (errLs) { console.error('Erro lendo localStorage favoritos', errLs); }
                        }
                    }
                }

                // 4. Monta os detalhes de cada personagem (Nome do criador e total de likes)
                const personagensComDados = await Promise.all(
                    listaBase.map(async (p: Personagem) => {
                        let nomeCriador = 'IA';
                        let qtdLikes = 0;

                        try {
                            const [nomeRes, likesRes] = await Promise.all([
                                p.usuario_id 
                                    ? axios.get(`${API_URL}/nomeCriador/${p.usuario_id}`, { headers: { Authorization: `Bearer ${token}` } }) 
                                    : Promise.resolve({ data: { nome: 'IA' } }),
                                axios.get(`${API_URL}/likesQuantidade/${p.id}`, { headers: { Authorization: `Bearer ${token}` } })
                            ]);

                            nomeCriador = nomeRes.data.nome || 'IA';
                            qtdLikes = likesRes.data.total || likesRes.data.likes || 0;
                        } catch (err) {
                            console.error(`Erro no personagem ${p.id}:`, err);
                        }

                        return { 
                            ...p, 
                            nome_criador: nomeCriador, 
                            likes: qtdLikes,
                            curtidoPeloUsuario: idsCurtidos.includes(p.id),
                            favoritadoPeloUsuario: idsFavoritos.includes(p.id)
                        };
                    })
                );

                setPersonagens(personagensComDados);

            } catch (err) {
                console.error("Erro fatal ao carregar:", err);
                setError('Não foi possível carregar os personagens.');
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, [usuarioId]);

    const handleToggleLike = async (e: React.MouseEvent, personagem_id: number) => {
        e.stopPropagation();
        
        if (!usuarioId) {
            navigate('/entrar');
            return;
        }

        try {
            const res = await axios.post(`${API_URL}/toggleLike/${usuarioId}/${personagem_id}`, null, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const { liked } = res.data;

            setPersonagens(prev => prev.map(p => {
                if (p.id === personagem_id) {
                    return {
                        ...p,
                        likes: liked ? (p.likes || 0) + 1 : Math.max(0, (p.likes || 0) - 1),
                        curtidoPeloUsuario: liked
                    };
                }
                return p;
            }));
        } catch (error) {
            console.error("Erro no toggle:", error);
        }
    };

    // Favoritar / desfavoritar
    const handleToggleFavorito = async (e: React.MouseEvent, personagem_id: number) => {
        e.stopPropagation();

        if (!usuarioId) {
            navigate('/entrar');
            return;
        }

        try {
            const res = await axios.post(`${API_URL}/favoritos/${usuarioId}/${personagem_id}`, null, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const statusFavorito = res.data && (res.data.favorited !== undefined ? res.data.favorited : res.data.liked);

            setPersonagens(prev => {
                const next = prev.map(p => {
                    if (p.id === personagem_id) {
                        return {
                            ...p,
                            favoritadoPeloUsuario: statusFavorito !== undefined ? statusFavorito : !p.favoritadoPeloUsuario
                        };
                    }
                    return p;
                });

                try {
                    const favoritosIds = next.filter(n => n.favoritadoPeloUsuario).map(n => n.id);
                    if (usuarioId) localStorage.setItem(`favoritos_${usuarioId}`, JSON.stringify(favoritosIds));
                } catch (err) { /* ignore */ }

                return next;
            });

        } catch (error) {
            console.error('Erro no toggle favorito:', error);
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
                                    <button className={styles.favorito} onClick={(e) => handleToggleFavorito(e, p.id)}>
                                        <i className={`fa ${p.favoritadoPeloUsuario ? 'fa-solid fa-star' : 'fa-regular fa-star'}`} 
                                        style={{ 
                                            cursor: 'pointer', 
                                            transition: 'all 0.3s',
                                            color: p.favoritadoPeloUsuario ? '#FFD700' : '#888'
                                        }}
                                        ></i>
                                    </button>

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