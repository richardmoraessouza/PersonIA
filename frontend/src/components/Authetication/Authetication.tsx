import React, { useState, useEffect } from 'react';
import styles from './Authetication.module.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext.tsx';
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { API_URL } from '../../config/api';

interface ErrorResponse {
    error: string;
}

interface SituacaoProps {
    verificar: boolean;
}
interface dadosUsuario {
    nome: string;
    foto_pefil: string;
}

function Authentication({ verificar }: SituacaoProps) {
    const [condicaoUsuario, setCondicaoUsuario] = useState<boolean>(verificar);
    const [gmail, setGmail] = useState<string>('');
    const [nome, setNome] = useState<string>('');
    const [loginErro, setLoginErro] = useState<string>('');
    const [imgPerfil, setImgPerfil] = useState<string>('');
    const [dados, setDados] = useState<dadosUsuario | null>(null)

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

    const onSuccess = async (credentialResponse: any) => {
        try {
            const tokenGoogle = credentialResponse.credential;
        
            try {
                const decoded: { email?: string } = jwtDecode(tokenGoogle);
                if (decoded.email) {
                    setGmail(decoded.email);
                }

        

            } catch (decodeErr) {
                console.error("Erro ao decodificar o token JWT do Google:", decodeErr);
            }

        } catch (err) {
            console.error("Erro no login com o Google:", err);
        }
    }

    const onError = () => {
        console.error("Erro no login com Google");
    };

    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const buscarDados = async () => {
            try {
                const res = await axios.get(`${API_URL}/buscarUsuario/${gmail}`);
                const dados = res.data
                setDados(dados)
            } catch (err) {
                if (axios.isAxiosError(err) && err.response?.status === 404) {
                    if (condicaoUsuario) {
                        setLoginErro("Ops! Parece que você ainda não tem uma conta.");
                    }
                } else {
                    console.error("Erro ao buscar usuário", err);
                }
            }
        }
    
        if (gmail) {
            buscarDados();
        }
    }, [gmail]);

    useEffect(() => {
        if (condicaoUsuario && dados) {
            setNome(dados.nome);
            setImgPerfil(dados.foto_pefil);
        }
    }, [condicaoUsuario, dados]);
    
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginErro(''); 
        
        
        try {
            if (condicaoUsuario) { // Rota de ENTRAR na conta

                const res = await axios.post(`${API_URL}/entrar`, { gmail });
                const usuarioData = res.data; 
                login(usuarioData); 
                navigate('/', { replace: true });
                // localStorage.removeItem('ultimoGmail');
                
            } else { // Rota de CADASTRA
                await axios.post(`${API_URL}/cadastra`, { gmail, nome, imgPerfil })
                localStorage.setItem('ultimoGmail', gmail); 
                navigate('/entrar', { replace: true });
            }

        } catch (err) {
            console.error(err);
            
            if (axios.isAxiosError<ErrorResponse>(err) && err.response) {
                setLoginErro(err.response.data.error || 'Credenciais inválidas.');
            } else {
                setLoginErro("Erro de conexão. Tente novamente mais tarde.");
            }
        }
    }
    
    return (
        <main className={`flex flex-col justify-center items-center ${styles.authentication}`}>
            {!gmail && (
            <div className={styles.modalBemVindo}>
                <img src="/image/PersonIA.png" alt="logo" />
                <h2>Bem-vindo ao PersonIA</h2>
                <div className="google-button-wrapper">
                    <GoogleLogin
                        onSuccess={onSuccess}
                        onError={onError}
                        auto_select={true}
                                />
                </div>
            </div>
            )}

            {gmail && (
                <section className={`${styles.verificarUsuario}`}>
                <h1 className={`text-center font-bold`}>{condicaoUsuario ? 'Entrar' : "Cadastra"}</h1>

                <form action="" method="post" className={`flex flex-col`} onSubmit={handleSubmit}>

                    <div className={`flex flex-col justify-center items-center ${styles.containerFoto}`}>
                        <div className="relative">
                            <img src={imgPerfil || '/image/semPerfil.jpg'} alt="Foto Perfil" className="w-28 h-28 rounded-full object-cover"/>
                            <div className="absolute bottom-0 right-1 bg-gray-900 w-9 h-9 text-xl rounded-full flex justify-center items-center">
                                <label htmlFor="foto" title="Alterar foto">
                                    <i className="fa-solid fa-pen cursor-pointer"></i>
                                </label>
                                <input id="foto" type="file" accept="image/*"disabled={condicaoUsuario} onChange={converterBase64} className="hidden"/>
                            </div>
                        </div>
                    </div>
                    <div>{loginErro && <p className={`text-center text-red-500`}>{loginErro}</p>}</div>

                    <label htmlFor="nome">Nome</label>
                    <input 
                        type="text" 
                        name="nome" 
                        id="" 
                        required
                        disabled={condicaoUsuario}
                        value={nome} 
                        onChange={(e) => setNome(e.target.value)} 
                    />
                
                    <label htmlFor="gmail">Gmail</label>
                    <input 
                        type="email" 
                        name="gmail" 
                        id="" 
                        required
                        placeholder='Digite seu Gmail' 
                        value={gmail} 
                        disabled
                        onChange={(e) => setGmail(e.target.value)} 
                    />
                   
                    <input type="submit" value={condicaoUsuario ? "Entrar" : "Cadastra"} />
                </form>
                
                {/* Links de navegação */}
                {
                    condicaoUsuario ? 
                    (<p className='text-center'>Não possui conta? <strong><Link to={"/cadastra"}>Cadastra</Link></strong></p>) : 
                    (<p className='text-center'>Já possui conta? <strong><Link to={"/entrar"}>Entrar</Link></strong></p>)
                }
            </section>
            )}
        </main>
    )
}

export default Authentication;