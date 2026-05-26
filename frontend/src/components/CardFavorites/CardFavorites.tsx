import styles from "./CardFavorites.module.css";
import { useMeusPersonagens } from "../../hooks/UserPerson/UserPerson";
import { useAuth } from "../../hooks/AuthContext/AuthContext";
import { useState, useEffect } from "react";
import { buscarFavoritosUsuario, toggleFavorito } from "../../services/personagemService";

const CardFavorites = () => {
    const { usuarioId, token } = useAuth();
    const { like } = useMeusPersonagens(usuarioId, token || '');
    const [favoritos, setFavoritos] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [curtidas, setCurtidas] = useState<{ [key: number]: boolean }>({});
    const [likes, setLikes] = useState<{ [key: number]: number }>({});

    // Carregar favoritos do backend
    useEffect(() => {
        if (usuarioId) {
            setLoading(true);
            buscarFavoritosUsuario(usuarioId)
                .then((ids) => {
                    // Aqui você pode fazer requisições adicionais para pegar os dados completos dos favoritos
                    setFavoritos(ids || []);
                })
                .catch((err) => {
                    console.error("Erro ao carregar favoritos:", err);
                    setFavoritos([]);
                })
                .finally(() => setLoading(false));
        }
    }, [usuarioId]);

    // Sincronizar com os dados dos favoritos quando carregam
    useEffect(() => {
        const novasCurtidas: { [key: number]: boolean } = {};
        const novosLikes: { [key: number]: number } = {};

        favoritos.forEach(p => {
            const id = typeof p === 'number' ? p : p?.id;
            if (id) {
                novasCurtidas[id] = p?.curtidoPeloUsuario || false;
                novosLikes[id] = p?.likes || 0;
            }
        });

        setCurtidas(novasCurtidas);
        setLikes(novosLikes);
    }, [favoritos]);

    // Listener para mudanças de favoritos (sinal de localStorage)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'favoritos_updated' && usuarioId) {
                setTimeout(() => {
                    buscarFavoritosUsuario(usuarioId)
                        .then((ids) => setFavoritos(ids || []))
                        .catch((err) => console.error("Erro ao recarregar favoritos:", err));
                }, 300);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [usuarioId]);

    const handleLike = (personagemId: number) => {
        const jaCurtido = curtidas[personagemId];
        
        // Atualiza state local
        setCurtidas(prev => ({
            ...prev,
            [personagemId]: !jaCurtido
        }));
        
        setLikes(prev => ({
            ...prev,
            [personagemId]: jaCurtido ? (prev[personagemId] || 0) - 1 : (prev[personagemId] || 0) + 1
        }));

        // Envia para o backend
        like(personagemId);
    };

    const handleRemoverFavorito = async (personagemId: number) => {
        if (!usuarioId || !token || token.trim() === '') return;
        
        try {
            await toggleFavorito(usuarioId, personagemId, token);
            setFavoritos(prev => prev.filter(p => {
                const id = typeof p === 'number' ? p : p?.id;
                return id !== personagemId;
            }));
            localStorage.setItem('favoritos_updated', Date.now().toString());
        } catch (err: any) {
            console.error("Erro ao remover favorito:", err);
            if (err?.response?.status === 401) {
                console.warn('Token expirado ou inválido');
                setFavoritos([]);
            }
        }
    };


    if (loading) {
        return (
            <article className="flex justify-center p-4">
                <p className="text-gray-400 text-sm">Carregando favoritos...</p>
            </article>
        );
    }

    if (favoritos.length === 0) {
        return (
            <article className="flex justify-center p-4">
                <p className="text-gray-400 text-sm">Nenhum personagem favoritado.</p>
            </article>
        );
    }

    return (
        <article className={`grid grid-cols-1 gap-3 p-2 ${styles.containerCardFavorites} w-4/6`}>
            {favoritos.map((personagem) => (
                <div 
                    key={personagem.id} 
                    className="flex items-center gap-3 p-3 rounded bg-[#1e1e1e] hover:bg-[#2a2a2a] transition-colors cursor-pointer"
                >
                    <img 
                        src={personagem.fotoia || '/image/semPerfil.jpg'} 
                        alt={personagem.nome} 
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                        <span className="text-white font-medium text-sm">
                            {personagem.nome}
                        </span>
                        <span className="text-gray-400 text-xs">
                            {personagem.bio}
                        </span>
                    </div>
                    <div className={styles.interactions}>
                        <button 
                            className={styles.likeButton}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleLike(personagem.id);
                            }}
                        >
                            <span>{likes[personagem.id] || 0}</span>
                            <svg
                                width="17"
                                height="17"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                fill={curtidas[personagem.id] ? "#ff4b4b" : "none"}
                                stroke={curtidas[personagem.id] ? "#ff4b4b" : "currentColor"}
                            >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </button>

                        <button className={styles.commentButton}>
                            <span>0</span>
                            <svg 
                                xmlns="http://www.w3.org/2000/svg"
                                width="17"
                                height="17"
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

                        <button 
                            className={styles.favoriteButton}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoverFavorito(personagem.id);
                            }}
                        >
                            <i 
                                className="fa-solid fa-star"
                                style={{
                                    color: "#FFD700",
                                    cursor: "pointer"
                                }}
                            ></i>
                        </button>
                    </div>
                </div>
            ))}
        </article>
    );
}

export default CardFavorites;