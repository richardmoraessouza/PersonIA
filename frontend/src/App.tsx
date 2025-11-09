import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './App.module.css';
import { useAuth } from './components/AuthContext/AuthContext';
import Menu from './components/Menu/Menu';
import { useNavigate } from 'react-router-dom';


interface Personagem {
  id: number;
  nome: string;
  fotoia?: string;
  descricao?: string;
  criador?: string;
  usuario_id: number;
  [key: string]: any;
}
interface CriadorNome {
  nome: string
}

interface ChatResponse {
  type: 'text' | 'sticker';
  reply: string; // O texto da mensagem ou a representação da figurinha
  stickerName?: string;
}

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

function App() {
  const { usuarioId } = useAuth();
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();


  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [personId, setPersonId] = useState<number>(1); 
  const [menuOpen, setMenuOpen] = useState<boolean>(true);
  const [personagem, setPersonagem] = useState<Personagem | null>(null);
  const [perfilPerson, setPerfilPerson] = useState<boolean>(false)
  const [nome, setNome] = useState<CriadorNome | null>(null)

  const modalPerfil = () => {
    setPerfilPerson(prev => !prev)
  }

  // Limpa chat ao trocar de personagem
  useEffect(() => {
    setChatHistory([]);
  }, [personId]);

  useEffect(() => {
    const nomeCriado = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/nomeCriador/${personagem.usuario_id}`)
        setNome(res.data)
      } catch (err) {
        console.error('Erro ao carregar o nome do criador', err);
      }
    }

    nomeCriado()
  }, [personagem])

  useEffect(() => {
    const buscarPersonagemId = async () => {

      try {
        const res = await axios.get(`http://localhost:3000/personagens/${personId}`);
        setPersonagem(res.data)
      } catch (err) {
        console.error('Erro ao carregar os dados do personagem', err);
      }
    }

    buscarPersonagemId()
}, [personId])


  // Scroll automático
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const enviarMensagem = async () => {
    if (!message.trim()) return;

    const userMsg = message;
    setMessage('');
    setChatHistory((prev) => [...prev, { sender: 'user', text: userMsg }]);

    try {
      setIsLoading(true);

      const payload: any = { message: userMsg };
      if (usuarioId) payload.userId = usuarioId;

      const res = await axios.post<ChatResponse>(`http://localhost:3000/chat/${personId}`, payload);

      const botReply = res.data;

      if (botReply.type === 'sticker') {
        // Exibe o nome da figurinha como texto por enquanto
        const stickerText = `[Figurinha: ${botReply.stickerName}]`;
        setChatHistory((prev) => [...prev, { sender: 'bot', text: stickerText }]);
      } else {
        setChatHistory((prev) => [...prev, { sender: 'bot', text: botReply.reply }]);
      }
    } catch (err) {
      console.error('Erro ao conectar com o servidor:', err);
      setChatHistory((prev) => [
        ...prev,
        { sender: 'bot', text: '⚠️ Erro ao carregar a mensagem.' },
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
          <section className={`fixed top-0  ${styles.contantoPerson} ${!menuOpen ? styles.menuFechado : ''}`}>
              {personagem && (
                <div className='mx-auto text-center flex flex-row items-center gap-2' onClick={modalPerfil}>
                  <img src={personagem.fotoia || '/image/semPerfil.png'} alt={personagem.nome} className={`w-10 h-10 rounded-full`}/>
                  <div className='flex flex-col gap-0 items-center justify-center'>
                    <h2>{personagem.nome}</h2>
                    <p className={styles.online}>Online</p>
                  </div>
                </div>
              )}
              {perfilPerson && (
                <div className={styles.modalOverlay} onClick={() => setPerfilPerson(false)}>
                  <div className={`${styles.modalPerfil}`} onClick={(e) => e.stopPropagation()}>
                    {personagem && (
                      <div className={`${styles.containerPerfil}`}>
                        <div className={`w-full flex items-center justify-center flex-col gap-1`}>
                          <img src={personagem.fotoia || '/image/semPerfil.png'} alt={personagem.nome} className='w-20 h-20 rounded-full shadow-2xl'/>
                          <h2 className='text-xl'><strong>{personagem.nome}</strong></h2>
                        </div>
                        <h3 className='text-gray-950'>Descrição</h3>
                        <p className={styles.descricao}>{personagem.descricao || "Sem Descrição."}</p>
                        <h3 className='text-gray-950'>Criador</h3>
                        <button className={styles.btnCriador} onClick={() => navigate(`/OutroPerfil/${personagem.usuario_id}`)}>
                            {nome && nome.nome}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
          </section>

          <div className={`${styles.containerEmCima}`}></div>

          {/* Chat */}
          <section className={styles.conversas}>
            {chatHistory.map((msg, idx) => (
              <article key={idx} className={`${styles.message} ${msg.sender === 'user' ? styles.userMessage : styles.botMessage}`}>
                <div className={styles.bubble}><p>{msg.text}</p></div>
              </article>
            ))}

            {isLoading && (
              <article className={`${styles.message} ${styles.botMessage}`}>
                <div className={styles.bubble}>
                  <div className={styles.typingIndicator}><span></span><span></span><span></span></div>
                </div>
              </article>
            )}
            <div className={styles.espaco2}>

            </div>
            <div ref={chatEndRef}></div>
          </section>

          {/* Input */}
          <div className={`fixed bottom-8 ${styles.containerMensagem}`}>
            <input
              className={styles.mensagem}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={`Converse com ${personagem && personagem.nome}`}
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
