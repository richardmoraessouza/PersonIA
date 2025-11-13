import React, { useEffect, useState } from 'react';
import styles from './Perfil.module.css';
import axios from 'axios';
import { useAuth } from '../AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';
import ModalSeguidores from '../ModalSeguidores/ModalSeguidores';

interface UserUpdateResponse {
    success: boolean;
    error?: string;
    usuario_atualizado?: {
        id: number;
        nome: string;
        gmail: string;
        foto_perfil?: string;
        descricao?: string;
    };
}

interface Seguindor {
    id: number;
    nome?: string;
    foto_perfil?: string | null;
}

function Perfil() {
    const { 
        usuario: nomeAtualContexto, 
        usuarioId, 
        fotoPerfil: fotoAtualContexto, 
        token, 
        login,
        logout,
        descricao: descricaoAtualContexto
    } = useAuth();

    const [imgPerfil, setImgPerfil] = useState<string | null>(fotoAtualContexto || null);
    const [novoNome, setNovoNome] = useState<string>(nomeAtualContexto || ''); 
    const [descricao, setDescricao] = useState<string>(descricaoAtualContexto || '');
    const [erro, setErro] = useState<string>('');

    const [seguidores, setSeguidores] = useState<Seguindor[]>([]);
    const [seguindo, setSeguindo] = useState<Seguindor[]>([]);

    const [abrirSeguidores, setAbrirSeguidores] = useState<boolean>(false);
    const [abrirSeguindo, setAbrirSeguindo] = useState<boolean>(false);
    const [modalDefinicoes, setModalDefinicoes] = useState<boolean>(false); 

    const navigate = useNavigate(); 

    // função para abrir modais de definições, seguidores e seguindo
    function abrirModalSeguidores() {
        setAbrirSeguidores(prev => !prev);
    }

    function abrirModalSeguindo() {
        setAbrirSeguindo(prev => !prev);
    }

    function definicoes() {
        setModalDefinicoes(prev => !prev);
    }

    function converterBase64(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const tiposPermitidos = ["image/jpeg", "image/png"];
        if (!tiposPermitidos.includes(file.type)) {
            alert("Apenas imagens PNG ou JPEG são permitidas!");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => setImgPerfil(reader.result as string);
        reader.readAsDataURL(file);
    }

    // Busca seguidores e seguindo para exibir quantos o usuário tem
    useEffect(() => {
        const dadosSeguidores = async () => {
            try {
                const seguidoresRes = await axios.get(`https://api-personia.onrender.com/seguidores/${usuarioId}`);
                setSeguidores(seguidoresRes.data.seguidores || []);

                const seguindoRes = await axios.get(`https://api-personia.onrender.com/seguindo/${usuarioId}`);
                setSeguindo(seguindoRes.data.seguindo || []);
            } catch (err) {
                console.error("Erro ao carregar seguidores e seguindo:", err);
            }
        };
        dadosSeguidores(); 
    }, [usuarioId, token]);

    // Carrega os dados atuais do perfil
    useEffect(() => {
        if (usuarioId && token) {
            axios.get(`https://api-personia.onrender.com/usuario/${usuarioId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => {
                setNovoNome(res.data.nome || nomeAtualContexto);
                setImgPerfil(res.data.foto_perfil || fotoAtualContexto);
                setDescricao(res.data.descricao || '');
            })
            .catch(err => console.error("Erro ao buscar detalhes do perfil:", err));
        }
    }, [usuarioId, token, nomeAtualContexto, fotoAtualContexto]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');

        // Validações do nome
        if (!usuarioId || !token) {
            setErro("Você precisa estar logado para editar o perfil.");
            return;
        }
        
        if (/[^A-Za-zÀ-ú0-9 ]/.test(novoNome)) {
            setErro("O nome contém caracteres inválidos.");
            return;
        }

        if (!/[A-Za-zÀ-ú]/.test(novoNome)) {
            setErro("O nome deve conter letras.");
            return;
        }

        try {
            const res = await axios.put<UserUpdateResponse>(
                `https://api-personia.onrender.com/editar/${usuarioId}`,
                { nome: novoNome, foto_perfil: imgPerfil, descricao },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success && res.data.usuario_atualizado) {
                const dadosAtualizados = res.data.usuario_atualizado;
                login({ ...dadosAtualizados, token, id: usuarioId, gmail: dadosAtualizados.gmail || '' });
                setNovoNome(dadosAtualizados.nome);
                setImgPerfil(dadosAtualizados.foto_perfil || null);
                setDescricao(dadosAtualizados.descricao || '');
                setModalDefinicoes(false);
            } else {
                setErro(res.data.error || "Erro ao atualizar perfil.");
            }
        } catch (error) {
            console.error("Erro no envio do formulário:", error);
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                alert("Sua sessão expirou. Você será redirecionado para o login.");
                logout();
                navigate('/entrar'); 
            } else {
                setErro("Ops! Tivemos um problema ao carregar seu perfil. Tente novamente mais tarde.");
            }
        }
    };

    return (
        <main className={`${styles.containerPerfil} min-h-screen flex flex-col items-center gap-10`}>
            <section className={styles.containerItemsPerfil}>
                <div className="flex flex-col items-center mt-10 gap-2">
                    <img src={imgPerfil || '/image/semPerfil.jpg'} alt='erro ao carregar imagem' className="w-28 h-28 rounded-full object-cover"/>
                    <h1 className="mt-4 text-xl font-semibold">{nomeAtualContexto}</h1>

                    <div className={`text-gray-400 text-sm mt-1 flex flex-row gap-5 ${styles.btnStatus}`}>
                        {/* btn de abrir modal de seguidores e seguindo */}
                        <button onClick={abrirModalSeguidores}>{seguidores.length} Seguidores</button>
                        <button onClick={abrirModalSeguindo}>{seguindo.length} Seguindo</button>
                        {abrirSeguidores && (
                            <ModalSeguidores 
                                tipo="seguidores" 
                                lista={seguidores} 
                                onClose={() => setAbrirSeguidores(false)} 
                                usuario={Number(usuarioId)}
                                usuarioLogado={Number(usuarioId)}
                            />
                        )}
                        {abrirSeguindo && (
                            <ModalSeguidores 
                                tipo="seguindo" 
                                lista={seguindo} 
                                onClose={() => setAbrirSeguindo(false)} 
                                usuario={Number(usuarioId)}
                                usuarioLogado={Number(usuarioId)}
                            />
                        )}
                    </div>

                    {/* botão para abrir o modal de definições */}
                    <button
                        className={`mt-4 px-4 py-2 rounded-lg hover:bg-gray-700 transition cursor-pointer ${styles.definicoesPerfil}`}
                        onClick={definicoes}
                    >
                        <i className="fa-solid fa-pen"></i> Editar Perfil
                    </button>
                    <div className={styles.descricao}>
                        {descricao ? <p>{descricao}</p> : <p>{nomeAtualContexto} ainda não tem uma descrição</p>}
                    </div>
                </div>
            </section>

            {modalDefinicoes && (
                <section className={`${styles.editarPerfil}`}>
                    {/* botão para fechar o modal de definições */}
                    <button 
                        className='absolute top-3.5 right-3 bg-gray-800 hover:bg-gray-900 rounded-full min-w-[2rem] min-h-[2rem] cursor-pointer' 
                        onClick={definicoes}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>

                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                        <div className={`flex flex-col justify-center items-center ${styles.containerFoto}`}>
                            <div className='relative'>
                                <img src={imgPerfil || '/image/semPerfil.jpg'} alt="Foto de Perfil" className="w-28 h-28 rounded-full object-cover"/>
                                <div className="absolute bottom-0 right-1 bg-gray-900 w-9 h-9 text-xl rounded-full flex justify-center items-center">
                                    <label htmlFor="foto" title="Alterar foto">
                                        <i className="fa-solid fa-pen cursor-pointer"></i>
                                    </label>
                                    <input id="foto" type="file" accept="image/*" onChange={converterBase64} className="hidden"/>
                                </div>
                            </div>
                            <p className='text-red-500 w-auto'>{erro}</p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="nome">Nome</label>
                            <input
                                type="text"
                                id="nome"
                                placeholder="Nome"
                                value={novoNome}
                                maxLength={20}
                                minLength={2}
                                onChange={e => {
                                    const valor = e.target.value;
                                    const filtrado = valor.replace(/[^A-Za-zÀ-ú0-9]/g, '');
                                    setNovoNome(filtrado);
                                }}
                            />
                            <p className="text-gray-400 text-sm flex justify-end">{novoNome.length}/20 caracteres</p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="descricao">Descrição</label>
                            <textarea
                                id="descricao"
                                placeholder="Descrição"
                                className={styles.editarDescricao}
                                value={descricao}
                                onChange={e => setDescricao(e.target.value)}
                                maxLength={1000}
                            ></textarea>
                            <p className="text-gray-400 text-sm flex justify-end">{descricao.length}/1000 caracteres</p>
                        </div>

                        <input
                            type="submit"
                            value="Salvar" 
                            className="bg-blue-500 border rounded-lg py-2 cursor-pointer hover:bg-blue-600 transition"
                        />
                    </form>
                </section>
            )} 
        </main>
    );
}

export default Perfil;
