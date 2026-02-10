import { API_URL } from '../../config/api';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext';
import styles from './CardUsuario.module.css';

interface Personagem {
    id: number;
    nome: string;
    fotoia?: string;
    bio?: string;
    descricao?: string;
    likes?: number;
    criador?: string;
    usuario_id: number;
    tipo_personagem: string;
    curtidoPeloUsuario?: boolean;
    favoritadoPeloUsuario?: boolean;
    [key: string]: any;
}

function CardUsuario() {
     const [personagensDoUsuario, setPersonagensDoUsuarios] = useState<Personagem[]>([]);
     

     const { 
             usuarioId, 
             token, 
         } = useAuth();

      const navigate = useNavigate();

      useEffect(() => {
        const carregarPersonagens = async () => {
            try {
                // 1. Busca os personagens do usuário
                const personagensRes = await axios.get(`${API_URL}/buscarPerson/${usuarioId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const listaBase: Personagem[] = Array.isArray(personagensRes.data)
                    ? personagensRes.data
                    : personagensRes.data.personagens || [];

                // 2. Busca IDs curtidos
                let idsCurtidos: number[] = [];
                if (usuarioId) {
                    try {
                        const resLikes = await axios.get(`${API_URL}/likesByUsuario/${usuarioId}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        idsCurtidos = Array.isArray(resLikes.data) ? resLikes.data.map((id: any) => Number(id)) : [];
                    } catch (e) { console.error('Erro likes'); }
                }

                // 3. Busca IDs favoritados
                let idsFavoritos: number[] = [];
                if (usuarioId) {
                    try {
                        const resFavs = await axios.get(`${API_URL}/getFavoritosFull/${usuarioId}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });

                        idsFavoritos = Array.isArray(resFavs.data) ? resFavs.data.map((item: any) => Number(item.id)) : [];
                        console.log("IDs favoritados carregados (full):", idsFavoritos);
                    } catch (e) { console.error('Erro favoritos', e); }
                }

                // 4. Monta a lista final com os estados de Like e Favorito
                const personagensComDados = await Promise.all(
                    listaBase.map(async (p: Personagem) => {
                        let qtdLikes = 0;
                        try {
                            const likesRes = await axios.get(`${API_URL}/likesQuantidade/${p.id}`);
                            qtdLikes = likesRes.data.total || likesRes.data.likes || 0;
                        } catch (err) { }

                        return {
                            ...p,
                            likes: qtdLikes,
                            curtidoPeloUsuario: idsCurtidos.includes(Number(p.id)),
                            favoritadoPeloUsuario: idsFavoritos.includes(Number(p.id))
                        };
                    })
                );

                setPersonagensDoUsuarios(personagensComDados);
            } catch (err) {
                console.log("Erro ao carregar os personagens");
            }
        };
        if (usuarioId) carregarPersonagens();
    }, [usuarioId, token]);

    
    // Adicionar os Likes
    const Like = async (e: React.MouseEvent, personagem_id: number) => {
        e.stopPropagation();
        try {
            const res = await axios.post(`${API_URL}/toggleLike/${usuarioId}/${personagem_id}`, null, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const { liked } = res.data;

            // Atualiza a interface para refletir a mudança de like
            setPersonagensDoUsuarios(prev => prev.map(p => {
                if (p.id === personagem_id) {
                    return {
                        ...p,
                        likes: liked ? (p.likes || 0) + 1 : Math.max(0, (p.likes || 0) - 1),
                        curtidoPeloUsuario: liked
                    };
                }
                return p;
            }));

        } catch (err) {
            console.log("Erro ao curtir personagem")
        }
    }

    // Adicionar os Favoritos
    const fav = async (e: React.MouseEvent, personagem_id: number) => {
        e.stopPropagation();
        try {
            const res = await axios.post(`${API_URL}/favoritos/${usuarioId}/${personagem_id}`, null, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            const statusFavorito = res.data.favorited !== undefined ? res.data.favorited : res.data.liked;

            setPersonagensDoUsuarios(prev => prev.map(p => {
                if (p.id === personagem_id) {
                    return {
                        ...p,
                        favoritadoPeloUsuario: statusFavorito !== undefined ? statusFavorito : !p.favoritadoPeloUsuario
                    };
                }
                return p;
            }));

        } catch (err) {
            console.error("Erro na requisição de favorito:", err);
        }
    }
    
    return (
          <section className={styles.cardsPersonagens}>
            {personagensDoUsuario.length > 0 ? (
                personagensDoUsuario.map((p) => (
                    <article key={p.id} className={styles.meusPersonagens}>
                        
                        {/* Botão Editar */}
                        <button 
                            className={styles.btnEditar}
                            onClick={() => {
                                const rota = p.tipo_personagem === 'person' ? '/criacao-person' : '/person-ficticio';
                                navigate(rota, { state: { editar: true, personagem: p } });
                            }}
                        >
                            <i className="fa-solid fa-pen-to-square"></i>
                        </button>

                        <div className={styles.cardHeader}>
                            <img src={p.fotoia || "/image/semPerfil.jpg"} alt={p.nome} className={styles.cardImg} />
                            <h3 className={styles.cardTitle}>{p.nome}</h3>
                        </div>
                        
                        <p className={styles.cardDescription}>
                            {p.descricao || 'Sem bio para este personagem.'}
                        </p>

                        {/* SEÇÃO DE INTERAÇÕES (Likes e Comentários) */}
                        <div className={styles.interactions}>
                            <button 
                                onClick={(e) => Like(e, p.id)}
                                className={`${styles.likeButton} ${p.curtidoPeloUsuario ? styles.active : ''}`}
                            >
                                <span>{p.likes ?? 0}</span>
                                <svg
                                    width="20" height="20" viewBox="0 0 24 24"
                                    fill={p.curtidoPeloUsuario ? "#ff4b4b" : "none"} 
                                    stroke={p.curtidoPeloUsuario ? "#ff4b4b" : "currentColor"}
                                    strokeWidth="2"
                                >
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                            </button>

                            <button className={styles.commentButton} onClick={(e) => e.stopPropagation()}>
                                <span>5</span> <i className="fa-solid fa-comment"></i> 
                            </button>

                            <button className={styles.favorito} onClick={(e) => fav(e, p.id)}>
                                <i className={`fa ${p.favoritadoPeloUsuario ? 'fa-solid fa-star' : 'fa-regular fa-star'}`} 
                                style={{ 
                                    cursor: 'pointer', 
                                    transition: 'all 0.3s',
                                    color: p.favoritadoPeloUsuario ? '#FFD700' : '#888'
                                }}
                                ></i>
                            </button>
                        </div>

                        {/* Botão Conversar */}
                        <div className={styles.btnConversarContainer}>
                            <button
                                className={styles.btnConversar}
                                onClick={() => navigate(`/personagem/${p.id}`, { state: { personagem: p } })}
                            >
                                <i className="fa-solid fa-comment-dots"></i>
                                Conversar
                            </button>
                        </div>

                    </article>
                ))
            ) : (
                <div className={styles.semPersonagens}>
                        <i className={`fa-regular fa-face-sad-tear ${styles.iconSemPersonagens}`}></i>
                        <p className={styles.textSemPersonagens}>Você ainda não criou nenhum personagem.</p>
                    </div>
            )}
        </section>
    )
}

export default CardUsuario