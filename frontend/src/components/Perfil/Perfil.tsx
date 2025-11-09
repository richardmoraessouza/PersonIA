import React, { useEffect, useState } from 'react';
import styles from './Perfil.module.css';
import axios from 'axios';
import { useAuth } from '../AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';

// Definindo o tipo da resposta de atualização
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

function Perfil() {
    // 1. OBTENDO DADOS E FUNÇÕES DO CONTEXTO
    const { 
        usuario: nomeAtualContexto, 
        usuarioId, 
        fotoPerfil: fotoAtualContexto, 
        token, 
        login,
        logout,
        descricao: descricaoAtualContexto
    } = useAuth();
    
    const navigate = useNavigate(); 
    const [modalDefinicoes, setModalDefinicoes] = useState<boolean>(false);
    
    // Inicializados com os valores do Contexto para persistência
    const [imgPerfil, setImgPerfil] = useState<string | null>(fotoAtualContexto || null);
    const [novoNome, setNovoNome] = useState<string>(nomeAtualContexto || ''); 
    const [descricao, setDescricao] = useState<string>(descricaoAtualContexto || '');
    const [erro, setErro] = useState<string>('');
    
    // Variável de pegar primeira letra do nome para coloca no perfil
    const inicialNome = nomeAtualContexto?.charAt(0).toUpperCase() || "?"; 
    

    // Função para garantir o usuario colocar png ou jpg
    function converterBase64(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            const tiposPermitidos = ["image/jpeg", "image/png"];
            if (!tiposPermitidos.includes(file.type)) {
                alert("Apenas imagens PNG ou JPEG são permitidas!");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => setImgPerfil(reader.result as string);
            reader.readAsDataURL(file);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro(''); 

        if (!usuarioId || !token) {
            setErro("Você precisa estar logado para editar o perfil.");
            return;
        }

        try {
            const res = await axios.put<UserUpdateResponse>(`http://localhost:3000/editar/${usuarioId}`, {
                nome: novoNome || nomeAtualContexto,
                foto_perfil: imgPerfil,
                descricao
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.data.success && res.data.usuario_atualizado) {
                const dadosAtualizados = res.data.usuario_atualizado;
                
                // ATUALIZA O CONTEXTO com os novos dados
                login({ 
                    ...dadosAtualizados, 
                    token: token, 
                    id: usuarioId,
                    gmail: dadosAtualizados.gmail || '' 
                });
                
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

    // Busca os dados do usuário ao montar o componente
    useEffect(() => {
        if (usuarioId && token) {
            axios.get(`http://localhost:3000/usuario/${usuarioId}`, {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            })
            .then(res => {
                // Atualiza o estado local, que pode vir mais recente do servidor
                setNovoNome(res.data.nome || nomeAtualContexto);
                setImgPerfil(res.data.foto_perfil || fotoAtualContexto);
                setDescricao(res.data.descricao || '');
            })
            .catch(err => {
                console.error("Erro ao buscar detalhes do perfil:", err);
            });
        }
    }, [usuarioId, token, navigate, logout, nomeAtualContexto, fotoAtualContexto]);

    function definicoes() {
        setModalDefinicoes(prev => !prev);
    }

    return (
        <main className={`${styles.containerPerfil} min-h-screen flex flex-col items-center gap-10`}>
            {/* Cabeçalho */}
            <section className={styles.containerItemsPerfil}>
                <div className="flex flex-col items-center mt-10 gap-2">
                    {imgPerfil ? (
                        <img
                            src={imgPerfil}
                            alt="Foto de Perfil"
                            className="w-28 h-28 rounded-full object-cover" 
                        />
                    ) : (
                        <div 
                            className="w-28 h-28 rounded-full bg-gradient-to-b bg-blue-600 flex items-center justify-center text-4xl font-bold"
                        >
                            {inicialNome}
                        </div>
                    )}

                    <h1 className="mt-4 text-xl font-semibold">{nomeAtualContexto}</h1>
                    {/* Botões de status */}
                    <div className={`text-gray-400 text-sm mt-1 flex flex-row gap-1 ${styles.btnStatus}`}>
                        <button>0 seguidores · </button>
                        <button>0 a seguir · </button>
                        <button>0 Personagens</button>
                    </div>

                    <button
                        className={`mt-4 px-4 py-2 rounded-lg hover:bg-gray-700 transition cursor-pointer ${styles.definicoesPerfil}`}
                        onClick={definicoes}
                    >
                        <i className="fa-solid fa-pen"></i> Editar Perfil
                    </button>

                    <div className={styles.descricao}>
                        {descricao ? (
                            <p>{descricao}</p>
                        ) : (
                            <p>{nomeAtualContexto} ainda não tem uma descrição</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Modal de edição de perfil */}
            {modalDefinicoes && (
                <section className={`${styles.editarPerfil}`}>
                    {/* Botão de Fechar Modal */}
                    <button 
                        className='absolute top-3.5 right-3 bg-gray-800 hover:bg-gray-900 rounded-full min-w-[2rem] min-h-[2rem] cursor-pointer' 
                        onClick={definicoes}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                    
                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                        
                        {/* Foto de Perfil na Edição */}
                        <div className={`flex flex-col justify-center items-center ${styles.containerFoto}`}>
                            {imgPerfil ? (
                                <div className='relative'>
                                    <img
                                        src={imgPerfil}
                                        alt="Foto de Perfil"
                                        className="w-28 h-28 rounded-full object-cover"
                                    />
                                    <div className="absolute bottom-0 right-1 bg-gray-900 w-9 h-9 text-xl rounded-full flex justify-center items-center">
                                        <label htmlFor="foto" title="Alterar foto">
                                            <i className="fa-solid fa-pen cursor-pointer"></i>
                                        </label>
                                        <input
                                            id="foto"
                                            type="file"
                                            accept="image/*"
                                            onChange={converterBase64}
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="w-28 h-28 rounded-full bg-gradient-to-b bg-blue-600 relative flex items-center justify-center text-4xl font-bold">
                                    {inicialNome}
                                    <div className="absolute bottom-0 right-0 bg-gray-900 w-10 h-10 text-xl rounded-full flex justify-center items-center">
                                        <label htmlFor="foto" title="Alterar foto">
                                            <i className="fa-solid fa-pen cursor-pointer"></i>
                                        </label>
                                        <input
                                            id="foto"
                                            type="file"
                                            accept="image/*"
                                            onChange={converterBase64}
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            )} 
                           {/*caso da erro aparece aqui*/}
                            <p className='text-red-500 w-auto'>{erro}</p>
                        </div>

                        {/* Nome */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="nome">Nome</label>
                            <input
                                type="text"
                                id="nome"
                                placeholder="Nome"
                                value={novoNome}
                                onChange={e => setNovoNome(e.target.value)}
                            />
                        </div>

                        {/* Descrição */}
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