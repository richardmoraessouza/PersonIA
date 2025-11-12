import React, { useState } from 'react';
import styles from './Authetication.module.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext.tsx'; 

interface ErrorResponse {
  error: string;
}

interface SituacaoProps {
  verificar: boolean;
}

function Authentication({ verificar }: SituacaoProps) {
  const [condicaoUsuario, setCondicaoUsuario] = useState<boolean>(verificar);
  const [gmail, setGmail] = useState<string>('');
  const [nome, setNome] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [loginErro, setLoginErro] = useState<string>('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErro('');

    try {
      if (condicaoUsuario) {
        // Entrar
        const res = await axios.post('https://api-personia.onrender.com/entrar', { gmail, senha });
        const usuarioData = res.data;
        login(usuarioData);
        navigate('/', { replace: true });
      } else {
        // Cadastrar e avaliar nome
    
        if (/[^A-Za-zÀ-ú0-9 ]/.test(nome)) {
          setLoginErro("O nome contém caracteres inválidos.");
          return;
        }
        if (!/[A-Za-zÀ-ú]/.test(nome)) {
          setLoginErro("O nome deve conter letras.");
          return;
        }

        await axios.post('https://api-personia.onrender.com/cadastra', { nome, gmail, senha });
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
  };

  return (
    <main className={`flex flex-col justify-center items-center ${styles.authentication}`}>
      <section className={`${styles.verificarUsuario}`}>
        <h1 className={`text-center font-bold`}>
          {condicaoUsuario ? 'Entrar' : 'Cadastra'}
        </h1>

        {/* Exibe o erro */}
        {loginErro && <p className="text-center text-red-500">{loginErro}</p>}

        <form className="flex flex-col" onSubmit={handleSubmit}>
            {!condicaoUsuario && (
                <>
                <label htmlFor="nome">Nome</label>
                <input
                    type="text"
                    name="nome"
                    id="nome"
                    required
                    placeholder="Digite seu nome"
                    value={nome}
                    maxLength={50}
                    minLength={2}
                    onChange={(e) => {
                    const valor = e.target.value;
                    const filtrado = valor.replace(/[^A-Za-zÀ-ú0-9 ]/g, '');
                    setNome(filtrado);
                    }}
                />
                </>
            )}

            <label htmlFor="gmail">Gmail</label>
            <input
                type="email"
                name="gmail"
                id="gmail"
                required
                placeholder="Digite seu Gmail"
                value={gmail}
                onChange={(e) => setGmail(e.target.value)}
            />

            <label htmlFor="senha">Senha</label>
            <input
                type="password"
                name="senha"
                id="senha"
                required
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
            />

            <input type="submit" value={condicaoUsuario ? 'Entrar' : 'Cadastra'} className='cursor-pointer' />
        </form>

        {/* Links de navegação de entrar e cadastra*/}
        {condicaoUsuario ? (
          <p className="text-center">
            Não possui conta?{' '}
            <strong>
              <Link to="/cadastra">Cadastra</Link>
            </strong>
          </p>
        ) : (
          <p className="text-center">
            Já possui conta?{' '}
            <strong>
              <Link to="/entrar">Entrar</Link>
            </strong>
          </p>
        )}
      </section>
    </main>
  );
}

export default Authentication;
