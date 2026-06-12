import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './ModalSeguidores.module.css';
import { useNavigate } from "react-router-dom";
import { API_URL } from '../../config/api';
import { FiX } from "react-icons/fi";
import { FRAME_UPDATED_EVENT, normalizeFrame, type FrameUpdatedDetail } from '../../utils/frame';

interface Seguidor {
    id: number;
    nome?: string;
    foto_perfil?: string | null;
    frame?: string | null;
}

interface ModalSeguidoresProps {
    tipo: 'seguidores' | 'seguindo';
    lista?: Seguidor[];  
    onClose: () => void;
    usuario: number;
    usuarioLogado: number;
}

function ModalSeguidores({ tipo, lista = [], onClose, usuario, usuarioLogado }: ModalSeguidoresProps) {
    const [usuarios, setUsuarios] = useState<Seguidor[]>(lista);
    const [abaAtiva, setAbaAtiva] = useState<'seguidores' | 'seguindo'>(tipo);
    const modalRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const endpoint = abaAtiva === 'seguidores' 
                    ? `${API_URL}/social/users/${usuario}/followers`
                    : `${API_URL}/social/users/${usuario}/following`;

                const res = await axios.get(endpoint);
                setUsuarios(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.error(`Erro ao buscar ${abaAtiva}:`, error);
                setUsuarios([]);
            }
        };

        fetchUsuarios();
    }, [abaAtiva, usuario]);

    useEffect(() => {
        const handler = (event: Event) => {
            const { usuarioId, frame } = (event as CustomEvent<FrameUpdatedDetail>).detail;

            setUsuarios(prev =>
                prev.map(item =>
                    item.id === usuarioId ? { ...item, frame: normalizeFrame(frame) } : item
                )
            );
        };

        window.addEventListener(FRAME_UPDATED_EVENT, handler);
        return () => window.removeEventListener(FRAME_UPDATED_EVENT, handler);
    }, []);

    return (
        <div className={styles.overlay}>
            <section className={styles.modalVerUsuarios} ref={modalRef}>
                <button className={styles.btnFecharModal} onClick={onClose}>
                    <FiX />
                </button>

                <div className={styles.tabs}>
                    <button
                        onClick={() => setAbaAtiva('seguidores')}
                        className={`${styles.tabBtn} ${abaAtiva === 'seguidores' ? styles.ativa : ''}`}
                    >
                        Seguidores
                    </button>
                    <button
                        onClick={() => setAbaAtiva('seguindo')}
                        className={`${styles.tabBtn} ${abaAtiva === 'seguindo' ? styles.ativa : ''}`}
                    >
                        Seguindo
                    </button>
                </div>

                {usuarios.length > 0 ? (
                    <ul>
                        {usuarios.map((item) => {
                            const frameAtivo = normalizeFrame(item.frame);

                            return (
                            <li
                                key={item.id}
                                className={styles.listaUsuarios}
                                onClick={() => {
                                    if (item.id === usuarioLogado) {
                                        navigate(`/perfil/${usuarioLogado}`);
                                    } else {
                                        navigate(`/outroperfil/${item.id}`);
                                    }
                                    onClose();
                                }}
                            >
                                <div className={styles.avatarWrap}>
                                    <img
                                        src={item.foto_perfil || '/image/semPerfil.jpg'}
                                        alt={item.nome || `Usuário ${item.id}`}
                                        className={styles.fotoPerfil}
                                    />
                                    {frameAtivo && (
                                        <img
                                            src={`/image/frames/${frameAtivo}`}
                                            alt="Frame"
                                            className={styles.frameImg}
                                        />
                                    )}
                                </div>
                                <span className={styles.nomeUsuario}>
                                    {item.nome || `Usuário ${item.id}`}
                                </span>
                            </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="text-center mt-4">
                        {abaAtiva === 'seguidores' ? 'Nenhum seguidor' : 'Não está seguindo ninguém'}
                    </p>
                )}
            </section>
        </div>
    );
}

export default ModalSeguidores;