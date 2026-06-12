import { useEffect, useState } from "react";
import styles from "./OutroPerfil.module.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../hooks/AuthContext/AuthContext";
import ModalSeguidores from "../../components/ModalSeguidores/ModalSeguidores";
import TapsPerfil from "../../components/TapsPerfil/TapsPerfil";
import { API_URL } from "../../config/api";
import { useSeguir } from "../../hooks/useSocial/useSocial";
import { FRAME_UPDATED_EVENT, normalizeFrame, type FrameUpdatedDetail } from "../../utils/frame";

interface OutroUsuario {
    nome: string;
    foto_perfil: string;
    descricao: string;
    frame?: string | null;
}

function OutroPerfil() {
    const [usuarioInfor, setUsuarioInfor] = useState<OutroUsuario | null>(null);
    const [estaSeguindo, setEstaSeguindo] = useState<boolean>(false);
    const [abrirSeguidores, setAbrirSeguidores] = useState<boolean>(false);
    const [abrirSeguindo, setAbrirSeguindo] = useState<boolean>(false);

    const { id } = useParams<{ id: string }>();
    const { usuarioId, token } = useAuth();
    const { seguidores, seguindo } = useSeguir(Number(id), token);

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            try {
                const perfilRes = await axios.get(`${API_URL}/users/other-user/${id}`);
                setUsuarioInfor(perfilRes.data);

                const seguidoresRes = await axios.get(`${API_URL}/social/users/${id}/followers`);
                const jaSegue = seguidoresRes.data?.some((s: { id: number }) => s.id === Number(usuarioId));
                setEstaSeguindo(jaSegue || false);
            } catch (error) {
                console.error("Erro ao carregar dados do perfil:", error);
            }
        };
        fetchData();
    }, [id, usuarioId]);

    useEffect(() => {
        if (!id) return;

        const handler = (event: Event) => {
            const { usuarioId: updatedId, frame } = (event as CustomEvent<FrameUpdatedDetail>).detail;
            if (updatedId !== Number(id)) return;

            setUsuarioInfor(prev =>
                prev ? { ...prev, frame: normalizeFrame(frame) } : prev
            );
        };

        window.addEventListener(FRAME_UPDATED_EVENT, handler);
        return () => window.removeEventListener(FRAME_UPDATED_EVENT, handler);
    }, [id]);

    const seguirUsuario = async () => {
        try {
            if (estaSeguindo) {
                await axios.delete(`${API_URL}/social/unfollow`, {
                    headers: { Authorization: `Bearer ${token}` },
                    data: { seguidor_id: Number(usuarioId), seguido_id: Number(id) }
                });
                setEstaSeguindo(false);
            } else {
                await axios.post(`${API_URL}/social/follow`, {
                    seguidor_id: Number(usuarioId),
                    seguido_id: Number(id),
                }, { headers: { Authorization: `Bearer ${token}` } });
                setEstaSeguindo(true);
            }
        } catch (error) {
            console.error("Erro ao seguir/deixar de seguir usuário:", error);
        }
    };

    const frameAtivo = normalizeFrame(usuarioInfor?.frame);
    const caminhoFrame = frameAtivo ? `/image/frames/${frameAtivo}` : null;

    return (
        <main className={styles.containerPerfil}>
            <section className={styles.containerItemsPerfil}>
                {usuarioInfor ? (
                    <div className="flex flex-col items-center gap-2">

                        <div className={styles.avatarWrapper}>
                            <img
                                src={usuarioInfor.foto_perfil || '/image/semPerfil.jpg'}
                                alt={usuarioInfor.nome}
                                className={styles.avatar}
                            />
                            {caminhoFrame && (
                                <img
                                    src={caminhoFrame}
                                    alt="Frame"
                                    className={styles.frame}
                                />
                            )}
                        </div>

                        <h1 className="mt-4 text-xl font-semibold">{usuarioInfor.nome}</h1>

                        <div className={`text-gray-400 text-sm mt-1 flex flex-row gap-2 ${styles.btnStatus}`}>
                            <button onClick={() => setAbrirSeguidores(true)}>
                                <strong className="text-neutral-300">{seguidores.length}</strong> seguidores
                            </button>
                            <span>|</span>
                            <button onClick={() => setAbrirSeguindo(true)}>
                                <strong className="text-neutral-300">{seguindo.length}</strong> seguindo
                            </button>
                        </div>

                        {abrirSeguidores && (
                            <ModalSeguidores
                                tipo="seguidores"
                                lista={seguidores}
                                onClose={() => setAbrirSeguidores(false)}
                                usuario={Number(id)}
                                usuarioLogado={Number(usuarioId)}
                            />
                        )}

                        {abrirSeguindo && (
                            <ModalSeguidores
                                tipo="seguindo"
                                lista={seguindo}
                                onClose={() => setAbrirSeguindo(false)}
                                usuario={Number(id)}
                                usuarioLogado={Number(usuarioId)}
                            />
                        )}

                        <button
                            onClick={seguirUsuario}
                            className={estaSeguindo ? styles.btnDeixarSeguir : styles.btnSeguir}
                        >
                            {estaSeguindo ? "Deixar de seguir" : "Seguir"}
                        </button>

                        <div className={styles.descricao}>
                            {usuarioInfor.descricao && usuarioInfor.descricao.trim() !== "" ? (
                                <p>{usuarioInfor.descricao}</p>
                            ) : (
                                <p>{usuarioInfor.nome} ainda não tem descrição</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div>carregando..</div>
                )}
            </section>

            <section className="w-full">
                <TapsPerfil usuarioId={Number(id)} />
            </section>
        </main>
    );
}

export default OutroPerfil;