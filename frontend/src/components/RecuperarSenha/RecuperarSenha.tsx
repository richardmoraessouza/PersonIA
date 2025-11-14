import React, { useState, useEffect } from 'react';
import styles from './RecuperarSenha.module.css';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';

interface ErrorResponse {
  error: string;
}

function RecuperarSenha() {
  const [gmail, setGmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [senhaConfirm, setSenhaConfirm] = useState<string>('');
  const [fase, setFase] = useState<'enviarEmail' | 'novaSenha'>('enviarEmail'); 
  const [mensagem, setMensagem] = useState<string>('');
  const [erro, setErro] = useState<string>('');
  const [token, setToken] = useState<string>('');

  const navigate = useNavigate();
  const location = useLocation();

  // Pega o token da URL se estiver presente
  useEffect(() => {
  const searchParams = new URLSearchParams(location.search);
  const tokenParam = searchParams.get('token');
  if (tokenParam) {
    setToken(decodeURIComponent(tokenParam)); 
    setFase('novaSenha');
  }
}, [location.search]);


  // Enviar e-mail de recuperação
  const handleEnviarEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setMensagem('');

    if (!gmail) {
      setErro('Digite seu Gmail para recuperação.');
      return;
    }

    try {
      await axios.post('http://localhost:3000/esqueci-senha', { gmail });
      setMensagem('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
      // Não muda automaticamente a fase; espera token
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError<ErrorResponse>(err) && err.response) {
        setErro(err.response.data.error || 'Erro ao enviar e-mail.');
      } else {
        setErro('Erro de conexão. Tente novamente mais tarde.');
      }
    }
  };

  // Atualizar senha
  const handleNovaSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setMensagem('');

    if (!senha || !senhaConfirm) {
      setErro('Preencha os campos de senha.');
      return;
    }

    if (senha !== senhaConfirm) {
      setErro('As senhas não coincidem.');
      return;
    }

    if (!token) {
      setErro('Token inválido.');
      return;
    }

    try {
      await axios.post('http://localhost:3000/nova-senha', { token, senha });
      setMensagem('Senha atualizada com sucesso! Faça login.');
      setFase('enviarEmail');
      setSenha('');
      setSenhaConfirm('');
      setGmail('');
      setToken('');
      navigate('/entrar'); 
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError<ErrorResponse>(err) && err.response) {
        setErro(err.response.data.error || 'Erro ao atualizar senha.');
      } else {
        setErro('Erro de conexão. Tente novamente mais tarde.');
      }
    }
  };

  return (
    <main className={`flex flex-col justify-center items-center ${styles.authentication}`}>
      <section className={`${styles.verificarUsuario}`}>
        <h1 className="text-center font-bold">
          {fase === 'enviarEmail' ? 'Recuperar Senha' : 'Defina sua nova senha'}
        </h1>

        {mensagem && <p className="text-center text-green-500">{mensagem}</p>}
        {erro && <p className="text-center text-red-500">{erro}</p>}

        <form
          className="flex flex-col"
          onSubmit={fase === 'enviarEmail' ? handleEnviarEmail : handleNovaSenha}
        >
          {fase === 'enviarEmail' && (
            <>
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
            </>
          )}

          {fase === 'novaSenha' && (
            <>
              <label htmlFor="senha">Nova Senha</label>
              <input
                type="password"
                name="senha"
                id="senha"
                required
                placeholder="Digite sua nova senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />

              <label htmlFor="senhaConfirm">Confirme a Senha</label>
              <input
                type="password"
                name="senhaConfirm"
                id="senhaConfirm"
                required
                placeholder="Confirme a nova senha"
                value={senhaConfirm}
                onChange={(e) => setSenhaConfirm(e.target.value)}
              />
            </>
          )}

          <input
            type="submit"
            value={fase === 'enviarEmail' ? 'Enviar e-mail' : 'Atualizar'}
            className="cursor-pointer mt-2"
          />
        </form>

        {fase === 'enviarEmail' && (
          <p className="text-center mt-2">
            Lembrou da senha? <strong><Link to="/entrar">Entrar</Link></strong>
          </p>
        )}
      </section>
    </main>
  );
}

export default RecuperarSenha;
