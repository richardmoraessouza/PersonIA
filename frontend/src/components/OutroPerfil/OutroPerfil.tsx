import { useEffect, useState, useRef } from "react"
import styles from "./OutroPerfil.module.css"
import { useParams } from "react-router-dom";
import axios from "axios"
import { useAuth } from "../AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";

interface outroUsuario {
    nome: string;
    foto_perfil: string;
    descricao: string;
}

interface seguindor {
    id: number;
    nome?: string;
    foto_perfil?: string | null;
}

function OutroPerfil() {
    const [usuarioInfor, setUsuarioInfor] = useState<outroUsuario | null>(null)
    const [listaSeguidores, setListaSeguidores] = useState<seguindor[]>([])
    const [listaSeguindo, setListaSeguindo] = useState<seguindor[]>([])
    const [modalSeguidores, setModalSeguidores] = useState<boolean>(false);
    const [modalSeguindo, setModalSeguindo] = useState<boolean>(false);
    const [estaSeguindo, setEstaSeguindo] = useState<boolean>(false);

    const navigate = useNavigate();

    // variável para quando usuario clicar fora do modal ele fechar
    const modalSeguidoresRef = useRef<HTMLDivElement>(null);
    const modalSeguindoRef = useRef<HTMLDivElement>(null);

    // id do perfil que esta sendo visitado
    const { id } = useParams<{ id: string }>();

    // id da pessoa logada
    const { usuarioId } = useAuth();

    function modalParaSeguidores() {
        setModalSeguidores(!modalSeguidores);
    }

    function modalParaSeguindo() {
        setModalSeguindo(!modalSeguindo);
    }

    useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
        try {
            // Buscar perfil
            const perfilRes = await axios.get(`https://api-personia.onrender.com/perfil/${id}`);
            setUsuarioInfor(perfilRes.data);

            // Buscar seguidores
            const seguidoresRes = await axios.get(`https://api-personia.onrender.com/seguidores/${id}`);
            setListaSeguidores(seguidoresRes.data.seguidores || []);

            // Verificar se o usuário logado já segue este perfil
            const jaSegue = seguidoresRes.data.seguidores.some((s: seguindor) => s.id === Number(usuarioId));
            setEstaSeguindo(jaSegue);

            // Buscar quem ele está seguindo
            const seguindoRes = await axios.get(`https://api-personia.onrender.com/seguindo/${id}`);
            setListaSeguindo(seguindoRes.data.seguindo || []);

        } catch (error) {
            console.error(error);
        }
    }

    fetchData();
}, [id, usuarioId]);


   const seguirUsuario = async () => {
    try {
        if (estaSeguindo) {
            // Deixar de seguir
            await axios.post("https://api-personia.onrender.com/deixar-de-seguir", {
                seguidor_id: Number(usuarioId),
                seguido_id: Number(id),
            });

            setEstaSeguindo(false);
            setListaSeguidores(prev => prev.filter(s => s.id !== Number(usuarioId)));
        } else {
            // Seguir
            await axios.post("https://api-personia.onrender.com/seguir", {
                seguidor_id: Number(usuarioId),
                seguido_id: Number(id),
            });

            const res = await axios.get(`https://api-personia.onrender.com/perfil/${usuarioId}`);
            
            setEstaSeguindo(true);
            setListaSeguidores(prev => {
            // só adiciona se não existir
            if (prev.some(s => s.id === Number(usuarioId))) return prev;
            return [...prev, {
                id: Number(usuarioId),
                nome: res.data.nome,
                foto_perfil: res.data.foto_perfil
            }];
        });
        }
    } catch (error) {
        console.error("Erro ao seguir/deixar de seguir usuário:", error);
    }
};


    useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
        if (modalSeguidores && modalSeguidoresRef.current && !modalSeguidoresRef.current.contains(event.target as Node)) {
            setModalSeguidores(false);
        }
        if (modalSeguindo && modalSeguindoRef.current && !modalSeguindoRef.current.contains(event.target as Node)) {
            setModalSeguindo(false);
        }
    }

        if (modalSeguidores || modalSeguindo) {
            document.addEventListener("mousedown", handleClickOutside);
        } 

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [modalSeguidores, modalSeguindo]);

    return (
        <main className={`${styles.containerPerfil} min-h-screen flex flex-col items-center gap-10`}>
            <section className={styles.containerItemsPerfil}>
                {usuarioInfor ? (
                <div className="flex flex-col items-center mt-10 gap-2">
                      <img src={usuarioInfor.foto_perfil || '/public/image/semPerfil.png'} alt="" className="w-28 h-28 rounded-full shadow-md"/>
                      <h1 className="mt-4 text-xl font-semibold">{usuarioInfor.nome}</h1>
                      <div className={`text-gray-400 text-sm mt-1 flex flex-row gap-5 ${styles.btnStatus}`}>
                        <button onClick={modalParaSeguidores}><strong className="text-neutral-300">{listaSeguidores.length}</strong> seguidores</button>
                        <button onClick={modalParaSeguindo}><strong className="text-neutral-300">{listaSeguindo.length}</strong> seguindo</button>
                     </div>

                     <button
                        onClick={seguirUsuario}
                        className={`${estaSeguindo ? styles.btnDeixarSeguir : styles.btnSeguir}`}
                    >
                        {estaSeguindo ? "Deixar de seguir" : "Seguir"}
                    </button>


                     <div className={styles.descricao}>
                        {usuarioInfor.descricao &&  usuarioInfor.descricao.trim() !== "" ?(
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

            <section>
                <ul className={`flex flex-row gap-10 `}>

                    {/* moda de mostra os seguidores */}
                    {modalSeguidores && (
                    <div  className={`${styles.modalVerUsuarios}`} ref={modalSeguidoresRef}>
                        <button className={styles.btnFecharModal}>
                            <i className="fa-solid fa-xmark" onClick={modalParaSeguidores}></i>
                        </button>

                        <h2 className={styles.titulo}>seguidores</h2>
                        {listaSeguidores.length > 0 ? (
                            listaSeguidores.map((item) => (
                              <li
                                key={item.id}
                                className={`${styles.listaUsuarios} cursor-pointer hover:bg-neutral-800 transition-colors duration-200`}
                                onClick={() => {
                                    if (item.id === Number(usuarioId)) {
                                    navigate(`/perfil/${usuarioId}`); // 👈 vai para o próprio perfil
                                    } else {
                                    navigate(`/outroperfil/${item.id}`); // 👈 vai para outro perfil
                                    }
                                }}
                                >
                                <img
                                    src={item.foto_perfil || '/public/image/semPerfil.png'}
                                    alt={item.nome}
                                    className={`w-8 h-8 rounded-full ${styles.fotoPerfil}`}
                                />
                                {item.nome ? item.nome : `Usuário ${item.id}`}
                            </li>

                            ))
                        ) : (
                            <p className="text-center">Sem seguidores</p>
                        )}
                    </div>
                    )}

                    {/* modal de mostra quem o usuario esta seguindo */}
                    {modalSeguindo && (
                        <div className={`${styles.modalVerUsuarios}`} ref={modalSeguindoRef}>
                            <button className={styles.btnFecharModal}>
                                <i className="fa-solid fa-xmark" onClick={modalParaSeguindo}></i>
                            </button>

                            <h2  className={styles.titulo}>seguindo</h2>
                            {listaSeguindo.length > 0 ? (
                                listaSeguindo.map((item) => (
                                    <li
                                        key={item.id}
                                        className={`${styles.listaUsuarios} cursor-pointer hover:bg-neutral-800 transition-colors duration-200`}
                                        onClick={() => navigate(`/outroperfil/${item.id}`)}
                                    >
                                        <img
                                            src={item.foto_perfil || '/public/image/semPerfil.png'}
                                            alt={item.nome}
                                            className={`w-8 h-8 rounded-full ${styles.fotoPerfil}`}
                                        />
                                        {item.nome ? item.nome : `Usuário ${item.id}`}
                                    </li>
                                ))
                            ) : (
                                <p className="text-center">Seguindo ninguém</p>
                            )}

                        </div>
                        
                    )}
                </ul>
            </section>
        </main>
    )
}

export default OutroPerfil