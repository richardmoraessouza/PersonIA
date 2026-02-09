import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Explorar.module.css';
import { API_URL } from '../../config/api';
import { useAuth } from "../AuthContext/AuthContext";
import { useNavigate } from 'react-router-dom';
import CampoDePesquisar from '../CampoDePesquisar/CampoDePesquisar';

type Personagem = {
    id: number;
    nome: string;
    fotoia?: string;
    descricao?: string;
    usuario_id?: number;
    nome_criador?: string;
    likes?: number;
    curtidoPeloUsuario?: boolean;
};

function BuscarPersonagem() {
    const [personagens, setPersonagens] = useState<Personagem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const { usuarioId } = useAuth();

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

                // 2. Busca os IDs que o usuário curtiu (SÓ se tiver usuarioId)
                let idsCurtidos: number[] = [];
                if (usuarioId) {
                    try {
                        const resLikes = await axios.get(`${API_URL}/likesByUsuario/${usuarioId}`);
                        idsCurtidos = Array.isArray(resLikes.data) ? resLikes.data : [];
                    } catch (e) {
                        console.error("Erro ao buscar likes do usuário, continuando sem eles...");
                    }
                }

                // 3. Monta os detalhes de cada personagem (Nome do criador e total de likes)
                const personagensComDados = await Promise.all(
                    listaBase.map(async (p: Personagem) => {
                        let nomeCriador = 'IA';
                        let qtdLikes = 0;

                        try {
                            const [nomeRes, likesRes] = await Promise.all([
                                p.usuario_id 
                                    ? axios.get(`${API_URL}/nomeCriador/${p.usuario_id}`) 
                                    : Promise.resolve({ data: { nome: 'IA' } }),
                                axios.get(`${API_URL}/likesQuantidade/${p.id}`)
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
                            curtidoPeloUsuario: idsCurtidos.includes(p.id) 
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
        }

        try {
            const res = await axios.post(`${API_URL}/toggleLike/${usuarioId}/${personagem_id}`);
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
                                        5 <i className="fa-solid fa-comment"></i> 
                                    </button>
                                </div>
                            </div>

                            <div className={styles.cardBody}>
                                <div className={styles.name}>{p.nome}</div>
                                <div className={styles.desc}>{p.descricao || 'Sem descrição'}</div>
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