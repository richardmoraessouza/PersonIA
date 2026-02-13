import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './App.module.css';
import { useAuth } from './hooks/AuthContext/AuthContext';
import Menu from './components/Menu/Menu';
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL } from './config/api';

interface Personagem {
  id: number;
  nome: string;
  fotoia?: string;
  descricao?: string;
  criador?: string;
  usuario_id: number;
  figurinhas?: string[];
  bio?: string;
  [key: string]: any;
}

interface CriadorNome {
  nome: string;
}

interface ChatResponse {
  reply: string;
  figurinha?: string;
}

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  isError?: boolean;
  figurinha?: string | null;
}

function App() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [personId, setPersonId] = useState<number>(() => {
    const n = id != null ? Number(id) : NaN;
    return isNaN(n) ? 29 : n;
  });
  const [menuOpen, setMenuOpen] = useState<boolean>(true);
  const [personagem, setPersonagem] = useState<Personagem | null>(null);
  const [perfilPerson, setPerfilPerson] = useState<boolean>(false);
  const [nome, setNome] = useState<CriadorNome | null>(null);

  const { usuarioId, token } = useAuth();
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const modalPerfil = () => setPerfilPerson(prev => !prev);

  const idNum = id != null ? Number(id) : NaN;
  const personagemIdAtual = !isNaN(idNum) ? idNum : personId;

  useEffect(() => {
    if (!localStorage.getItem("anonId")) {
      localStorage.setItem("anonId", crypto.randomUUID());
    }
  }, []);

  // Sincroniza personId com o param da rota (para chat e menu)
  useEffect(() => {
    if (id != null) {
      const parsed = Number(id);
      if (!isNaN(parsed) && parsed !== personId) {
        setPersonId(parsed);
      }
    }
  }, [id]);

  // Limpa chat ao trocar de personagem
  useEffect(() => setChatHistory([]), [personagemIdAtual]);

  // Busca nome do criador
  useEffect(() => {
    const nomeCriado = async () => {
      if (personagem) {
        try {
          const res = await axios.get(`${API_URL}/nomeCriador/${personagem.usuario_id}`);
          setNome(res.data);
        } catch (err) {
          console.error('Erro ao carregar o nome do criador', err);
        }
      }
    };
    nomeCriado();
  }, [personagem]);

  // Busca personagem pelo ID da URL (trocar de personagem no menu atualiza aqui)
  useEffect(() => {
    if (id == null || isNaN(Number(id))) return;
    const numId = Number(id);
    setPersonagem(null);
    let cancelado = false;
    const buscarPersonagemId = async () => {
      try {
        const res = await axios.get(`${API_URL}/personagens/${numId}`);
        if (!cancelado) setPersonagem(res.data);
      } catch (err) {
        if (!cancelado) console.error('Erro ao carregar os dados do personagem', err);
      }
    };
    buscarPersonagemId();
    return () => { cancelado = true; };
  }, [id]);

  // Scroll automático
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const enviarMensagem = async () => {
    if (!message.trim() || !personagem) return;
  
    const userMsg = message;
    setMessage('');
    setChatHistory(prev => [...prev, { sender: 'user', text: userMsg }]);
  
    try {
      setIsLoading(true);
  
      const payload: any = { message: userMsg };
      
      // Define se envia ID do usuário logado ou ID anônimo
      if (usuarioId) {
        payload.userId = usuarioId;
      } else {
        payload.anonId = localStorage.getItem("anonId");
      }
  
      // ADIÇÃO DO HEADER DE AUTORIZAÇÃO AQUI:
      const res = await axios.post<ChatResponse>(
        `${API_URL}/chat/${personagemIdAtual}`, 
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}` // Envia o token para o servidor
          }
        }
      );
  
      const botReply = res.data;
  
      setChatHistory(prev => [
        ...prev,
        {
          sender: 'bot',
          text: botReply.reply,
          figurinha: botReply.figurinha || null
        }
      ]);
    } catch (err: any) {
      console.error('Erro ao conectar com o servidor:', err);
      
      const msgErro = err.response?.status === 401 
        ? 'Sua sessão expirou. Por favor, faça login novamente.' 
        : 'Ocorreu um erro, tente novamente mais tarde.';
  
      setChatHistory(prev => [
        ...prev,
        { sender: 'bot', text: msgErro, isError: true }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) enviarMensagem();
  };

  return (
    <>
      <Menu setPersonId={setPersonId} onMenuToggle={setMenuOpen} />
      <div className={styles.containerChat}>
        <div className={`${styles.espaco} ${!menuOpen ? styles.menuFechado : ''}`}></div>
        <main className={`${styles.chat} flex flex-col`}>

          {/* Perfil do personagem */}
          <section className={`fixed top-0 ${styles.contantoPerson} ${!menuOpen ? styles.menuFechado : ''}`}>
            {personagem && (
              <div className='mx-auto text-center flex flex-row items-center gap-2' onClick={modalPerfil}>
                <img src={personagem.fotoia || '/image/semPerfil.jpg'} alt={personagem.nome} className='w-10 h-10 rounded-full object-cover shadow-2xl' />
                <div className='flex flex-col gap-0 items-center justify-center'>
                  <h2>{personagem.nome}</h2>
                  <div className='w-full flex items-start'>
                    <p className={styles.online}>Online</p>
                  </div>
                </div>
              </div>
            )}

            {perfilPerson && personagem && (
              <div className={styles.modalOverlay} onClick={() => setPerfilPerson(false)}>
                <div className={styles.modalPerfil} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.containerPerfil}>
                    
                    {/* Topo: Foto e Nome */}
                    <div className={styles.headerCarta}>
                      <img 
                        src={personagem.fotoia || '/image/semPerfil.jpg'} 
                        alt={personagem.nome} 
                        className={styles.fotoPerfilGrande} 
                      />
                      <h2 className={styles.nomePersonagem}>{personagem.nome}</h2>
                      <span className="text-sm text-gray-400">Personalidade Virtual</span>
                    </div>

                    {/* Conteúdo: Bio e Criador */}
                    <div className={styles.corpoCarta}>
                      <span className={styles.labelSetor}>Sobre</span>
                      <p className={styles.descricao}>
                        {personagem.bio || "Este personagem ainda não possui uma biografia detalhada."}
                      </p>

                      <span className={styles.labelSetor}>Criado por</span>
                      <button
                        className={styles.btnCriador}
                        onClick={() => {
                          if (personagem.usuario_id === usuarioId) navigate(`/perfil/${usuarioId}`);
                          else navigate(`/OutroPerfil/${personagem.usuario_id}`);
                        }}
                      >
                        <i className="fa-regular fa-user"></i>
                        {nome ? nome.nome : 'Carregando...'}
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            )}
           
          </section>

          <div className={styles.containerEmCima}></div>

          {/* Chat */}
          <section className={styles.conversas}>
            {chatHistory.map((msg, idx) => (
              <article key={idx} className={`${styles.message} ${msg.sender === 'user' ? styles.userMessage : styles.botMessage}`}>
                <div className={`${styles.bubble} ${msg.isError ? styles.erroMensagem : ''}`}>
                  <p>{msg.text}</p>
                  <div className='w-full flex items-center justify-center'>{msg.figurinha && <img src={msg.figurinha} alt="figurinha" className={styles.figurinha} />}</div>
                </div>
              </article>
            ))}

            {isLoading && (
              <article className={`${styles.message} ${styles.botMessage}`}>
                <div className={styles.bubble}>
                  <div className={styles.typingIndicator}><span></span><span></span><span></span></div>
                </div>
              </article>
            )}
            <div className={styles.espaco2}></div>
            <div ref={chatEndRef}></div>
          </section>

          {/* Input de mensagem */}
          <div className={`fixed bottom-8 ${styles.containerMensagem}`}>
            <input
              className={styles.mensagem}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={personagem ? `Conversar com ${personagem.nome}` : "Fale com o personagem"}
              disabled={isLoading}
            />
            <button onClick={enviarMensagem} disabled={isLoading}>
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
