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
                const personagensRes = await axios.get(`${API_URL}/buscarPerson/${usuarioId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const listaBase: Personagem[] = Array.isArray(personagensRes.data)
                    ? personagensRes.data
                    : personagensRes.data.personagens || [];

                // Busca os IDs curtidos pelo usuário atual (se houver)
                let idsCurtidos: number[] = [];
                if (usuarioId) {
                    try {
                        const resLikes = await axios.get(`${API_URL}/likesByUsuario/${usuarioId}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        idsCurtidos = Array.isArray(resLikes.data) ? resLikes.data : [];
                    } catch (e) {
                        console.error('Erro ao buscar likes do usuário, continuando sem eles...');
                    }
                }

                // Para cada personagem, busca a quantidade de likes e marca se o usuário curtiu
                const personagensComDados = await Promise.all(
                    listaBase.map(async (p: Personagem) => {
                        let qtdLikes = 0;
                        try {
                            const likesRes = await axios.get(`${API_URL}/likesQuantidade/${p.id}`);
                            qtdLikes = likesRes.data.total || likesRes.data.likes || 0;
                        } catch (err) {
                            console.error(`Erro ao buscar likes do personagem ${p.id}:`, err);
                        }

                        return {
                            ...p,
                            likes: qtdLikes,
                            curtidoPeloUsuario: idsCurtidos.includes(p.id)
                        };
                    })
                );

                setPersonagensDoUsuarios(personagensComDados);
            } catch (err) {
                console.log("Erro ao carregar os personagens")
            }
        }
        carregarPersonagens()
    }, [usuarioId])

    

    const Like = async (e: React.MouseEvent, personagem_id: number) => {
        e.stopPropagation();
        try {
            const res = await axios.post(`${API_URL}/toggleLike/${usuarioId}/${personagem_id}`, null, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const { liked } = res.data;

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