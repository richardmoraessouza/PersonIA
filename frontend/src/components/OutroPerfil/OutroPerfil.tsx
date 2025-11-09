import { useEffect, useState } from "react"
import styles from "./OutroPerfil.module.css"
import { useParams } from "react-router-dom";
import axios from "axios"

interface outroUsuario {
    nome: string;
    foto_perfil: string;
    descricao: string;
}


function OutroPerfil() {
    const [usuarioInfor, setUsuarioInfor] = useState<outroUsuario | null>(null)
    const { id } = useParams<{ id: string }>();
    
    useEffect(() => {
        const perfilUsuario = async () =>  {
            const res = await axios.get(`http://localhost:3000/perfil/${id}`)
            setUsuarioInfor(res.data)
        }
    
        perfilUsuario()
    },[])
    

    return (
        <main className={`${styles.containerPerfil} min-h-screen flex flex-col items-center gap-10`}>
            <section className={styles.containerItemsPerfil}>
                {usuarioInfor ? (
                <div className="flex flex-col items-center mt-10 gap-2">
                    {usuarioInfor.foto_perfil && usuarioInfor.foto_perfil.trim() !== "" ? (
                        <img 
                            src={usuarioInfor.foto_perfil} 
                            alt={usuarioInfor.nome} 
                            className="w-28 h-28 rounded-full object-cover"
                        />
                    ) : (
                        <div 
                            className="w-28 h-28 rounded-full bg-gradient-to-b from-blue-500 select-none to-blue-600 flex items-center justify-center text-4xl font-bold text-white"
                        >
                            {usuarioInfor.nome.charAt(0).toUpperCase()}
                        </div>
                    )}
                      <h1 className="mt-4 text-xl font-semibold">{usuarioInfor.nome}</h1>
                      <div className={`text-gray-400 text-sm mt-1 flex flex-row gap-1 ${styles.btnStatus}`}>
                        <button>0 seguidores · </button>
                        <button>0 a seguir · </button>
                        <button>0 Personagens</button>
                     </div>

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
        </main>
    )
}

export default OutroPerfil