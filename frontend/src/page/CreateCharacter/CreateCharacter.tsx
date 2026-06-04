import React, { useState, useEffect, useRef } from 'react';
import styles from './CreateCharacter.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext/AuthContext';
import { useCharacters } from '../../hooks/useCharacters/useCharacters';
import { converterBase64 } from '../../utils/CorverteImagem/corverteImagem';
import { QuickCreateMode } from '../../components/quick-create/quick-create';

const contarPalavras = (texto: string) => {
  return texto.trim().split(/\s+/).filter(palavra => palavra.length > 0).length;
};

const validarNome = (texto: string) => {
  // Remove caracteres especiais, mantendo apenas letras, números e espaços
  const limpo = texto.replace(/[^A-Za-zÀ-ú0-9 ]/g, '');
  // Verifica se tem conteúdo após remover espaços e se tem pelo menos uma letra
  return limpo.trim().length > 0 && /[A-Za-zÀ-ú]/.test(limpo) ? limpo : '';
};

function CreateCharacter() {
    // Estados Detalhados
    const [nome, setNome] = useState('');
    const [bio, setBio] = useState('');
    const [fotoia, setFotoia] = useState('');
    const [historia, setHistoria] = useState('');
    const [personalidade, setPersonalidade] = useState('');
    const [regras, setRegras] = useState('');
    const [genero, setGenero] = useState('');
    const [descricao, setDescricao] = useState('');
    const [obra, setObra] = useState('');
    const [tipo_personagem, setTipo_personagem] = useState('person');
    const [aparencia, setAparencia] = useState('');
    const [gostos, setGostos] = useState('');
    const [desgostos, setDesgostos] = useState('');
    const [objetivos, setObjetivos] = useState('');
    const [primeiraMensagem, setPrimeiraMensagem] = useState('');
    const [relacaoUsuario, setRelacaoUsuario] = useState('');
    const [cenario, setCenario] = useState('');
    const [exemplosConversa, setExemplosConversa] = useState('');
    
    // Estados Modo Rápido
    const [modoRapido, setModoRapido] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [erro, setErro] = useState('');
    const nomeInputRef = useRef<HTMLInputElement>(null);

    const { token, usuarioId } = useAuth();
    const { createCharacter, updateCharacter, searchCharacterById } = useCharacters();
    const navigate = useNavigate();
    const location = useLocation();

    const modoEdicao = location.state?.editar;

    // Carregar dados do personagem quando em modo de edição
    useEffect(() => {
        const carregarDadosPersonagem = async () => {
            if (modoEdicao && location.state?.personagem?.id) {
                try {
                    const dados = await searchCharacterById(location.state.personagem.id);
                    
                    // Popular todos os campos com os dados retornados
                    setNome(dados.nome || '');
                    setBio(dados.bio || '');
                    setHistoria(dados.historia || '');
                    setPersonalidade(dados.personalidade || '');
                    setRegras(dados.regras || '');
                    setGenero(dados.genero || '');
                    setDescricao(dados.descricao || '');
                    setObra(dados.obra || '');
                    setTipo_personagem(dados.tipo_personagem || 'person');
                    setAparencia(dados.aparencia || '');
                    setGostos(dados.gostos || '');
                    setDesgostos(dados.desgostos || '');
                    setObjetivos(dados.objetivos || '');
                    setPrimeiraMensagem(dados.primeiramensagem || '');
                    setRelacaoUsuario(dados.relacaousuario || '');
                    setCenario(dados.cenario || '');
                    setExemplosConversa(dados.exemplosconversa || '');
                    setModoRapido(dados.is_modo_rapido || false);
                    
                    if (dados.fotoia) {
                        setFotoia(dados.fotoia);
                    }
                    
                    console.log('[CreateCharacter] Dados carregados para edição:', dados.nome);
                } catch (err) {
                    console.error('[CreateCharacter] Erro ao carregar dados do personagem:', err);
                    setErro('Erro ao carregar dados do personagem');
                }
            }
        };

        carregarDadosPersonagem();
    }, [modoEdicao, location.state?.personagem?.id, searchCharacterById]);

    const isFiccional = tipo_personagem === 'ficcional';

    const validarFormulario = () => {
        if (!nome.trim()) return "Por favor, insira o nome do personagem.";
        if (nome.length < 2) return "O nome deve ter pelo menos 2 caracteres.";
        
        if (isFiccional && !obra.trim()) return "Personagens fictícios precisam de uma obra/universo.";
        
        return null;
    };

   const form = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // 1. Executa a validação antes de qualquer coisa
    const erroValidacao = validarFormulario();
    if (erroValidacao) {
        setErro(erroValidacao);
        nomeInputRef.current?.focus();
        nomeInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return; 
    }

    // 2. Valida se o usuário está autenticado
    if (!token || !usuarioId) {
        setErro("Você precisa estar autenticado para criar um personagem.");
        navigate('/entrar');
        return;
    }

    setIsSubmitting(true);
    setErro('');

    try {
        const payload: any = {
            nome, bio, descricao, personalidade, regras, historia, 
            tipo_personagem, is_modo_rapido: modoRapido,
            genero, obra,
            aparencia, gostos, desgostos, objetivos, 
            primeiramensagem: primeiraMensagem, 
            relacaousuario: relacaoUsuario, 
            cenario, exemplosconversa: exemplosConversa
        };

        if (fotoia) payload.fotoia = fotoia;
        
        console.log('[CreateCharacter] Enviando payload:', { nome, tipo_personagem, payloadSize: JSON.stringify(payload).length });
        
        const operacao = location.state?.editar ? 'editar' : 'criar';
        console.log(`[CreateCharacter] ${operacao.toUpperCase()} personagem...`);
        
        await (location.state?.editar 
            ? updateCharacter(location.state.personagem.id, payload, token) 
            : createCharacter(usuarioId, payload, token)
        );
        
        console.log('[CreateCharacter] ✓ Operação concluída com sucesso');
        
        navigate(`/perfil/${usuarioId}`);
    } catch (err: any) {
        // 3. Verifica se é erro 401 (não autorizado)
        if (err?.response?.status === 401) {
            setErro("Sua sessão expirou. Por favor, faça login novamente.");
            localStorage.clear();
            navigate('/entrar');
            return;
        }
        
        // 4. Erros de servidor (se a API retornar um erro)
        const mensagemErro = err?.response?.data?.message || 
                            err?.message || 
                            "Falha ao salvar no servidor. Tente novamente mais tarde.";
        setErro(mensagemErro);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
        setIsSubmitting(false);
    }
};
    return (
        <main className={styles.criacaoPerson}>
            <form onSubmit={form} className={styles.containerCriacaoPerson}>
                
                <div className={styles.toggleContainer}>
                    {/* Grupo do Modo de Criação (Rápido vs Detalhado) */}
                    <button
                        type="button"
                        onClick={() => setModoRapido(true)}
                        className={`${styles.toggleButton} ${modoRapido ? styles.active : ''}`}
                    >
                        Modo Rápido
                    </button>
                    <button
                        type="button"
                        onClick={() => setModoRapido(false)}
                        className={`${styles.toggleButton} ${!modoRapido ? styles.active : ''}`}
                    >
                        Modo Detalhado
                    </button>
                </div>

                <div className={styles.toggleContainer}>
                    {/* Grupo do Tipo de Personagem */}
                    <button
                        type="button"
                        onClick={() => setTipo_personagem('person')}
                        className={`${styles.toggleButton} ${tipo_personagem === 'person' ? styles.active : ''}`}
                    >
                        Personagem Normal
                    </button>
                    <button
                        type="button"
                        onClick={() => setTipo_personagem('ficcional')}
                        className={`${styles.toggleButton} ${tipo_personagem === 'ficcional' ? styles.active : ''}`}
                    >
                        Personagem Fictício
                    </button>
                </div>

                {/* Seção de Foto e Título - Comum aos dois modos */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{ position: 'relative', width: 'fit-content', margin: '0 auto', marginBottom: '20px' }}>
                        <img
                            src={fotoia || "/image/semPerfil.jpg"}
                            alt="Pré-visualização"
                            style={{
                                width: '104px',
                                height: '104px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                            }}
                        />
                        <div style={{
                            position: 'absolute',
                            bottom: '0',
                            right: '0',
                            background: 'var(--bg-main)',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            border: '2px solid var(--text-main)'
                        }}>
                            <label htmlFor="foto" style={{ cursor: 'pointer', margin: 0, color: 'var(--text-main)' }}>
                                <i className="fa-solid fa-pen"></i>
                            </label>
                            <input id="foto" type="file" onChange={(e) => converterBase64(e, setFotoia)} accept="image/*" style={{ display: 'none' }} />
                        </div>
                    </div>
                    <h1 style={{ fontSize: '20px', fontWeight: '700', margin: '20px 0 0 0' }}>
                        {modoEdicao ? "Editar personagem" : isFiccional ? "Crie Seu Personagem fictício" : "Criar personagem"}
                    </h1>
                    {erro && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px' }}>{erro}</p>}
                </div>

                {modoRapido ? (
                    <QuickCreateMode 
                        nome={nome}
                        bio={bio}
                        descricao={descricao}
                        obra={obra}
                        isFiccional={isFiccional}
                        onNomeChange={setNome}
                        onBioChange={setBio}
                        onDescricaoChange={setDescricao}
                        onObraChange={setObra}
                    />
                ) : (
                    <>
                        {/* Informações Básicas */}
                        <div className={styles.formGroup}>
                            <label>Nome</label>
                            <input 
                                ref={nomeInputRef}
                                type="text" 
                                placeholder="Nome" 
                                value={nome} 
                                onChange={(e) => {
                                  const novoNome = validarNome(e.target.value);
                                  if (contarPalavras(novoNome) <= 20) {
                                    setNome(novoNome);
                                  }
                                }} 
                                required
                            />
                            <p style={{ color: 'var(--input-placeholder)', fontSize: '12px', textAlign: 'right', marginTop: '4px' }}>{contarPalavras(nome)}/20 palavras</p>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Bio</label>
                            <input 
                                type="text" 
                                placeholder="Uma descrição breve" 
                                value={bio} 
                                onChange={(e) => {
                                  const novaBio = e.target.value;
                                  if (contarPalavras(novaBio) <= 50) {
                                    setBio(novaBio);
                                  }
                                }} 
                            />
                            <p style={{ color: 'var(--input-placeholder)', fontSize: '12px', textAlign: 'right', marginTop: '4px' }}>{contarPalavras(bio)}/50 palavras</p>
                        </div>

                        {/* Campos condicionais */}
                        {isFiccional && (
                            <>
                                <div className={styles.formGroup}>
                                    <label>Obra / Universo</label>
                                    <input
                                        type="text"
                                        value={obra}
                                        placeholder="De qual obra/universo é este personagem?"
                                        required={isFiccional}
                                        onChange={(e) => {
                                        const novaObra = e.target.value;
                                        if (contarPalavras(novaObra) <= 50) {
                                            setObra(novaObra);
                                        }
                                        }}
                                        className={styles.textarea}
                                    />
                                    <p style={{ color: 'var(--input-placeholder)', fontSize: '12px', textAlign: 'right', marginTop: '4px' }}>{contarPalavras(obra)}/50 palavras</p>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Gênero</label>
                                    <input 
                                        type="text" 
                                        placeholder="Qual é o gênero?" 
                                        value={genero} 
                                        onChange={(e) => {
                                            const novoGenero = e.target.value;
                                            if (contarPalavras(novoGenero) <= 20) {
                                                setGenero(novoGenero);
                                            }
                                        }}
                                    />
                                    <p style={{ color: 'var(--input-placeholder)', fontSize: '12px', textAlign: 'right', marginTop: '4px' }}>{contarPalavras(genero)}/20 palavras</p>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Cenário</label>
                                    <textarea
                                        id="cenário"
                                        value={cenario}
                                        placeholder="Descreva o cenário em que o personagem vive?"
                                        onChange={(e) => {
                                        const novoCenário = e.target.value;
                                        if (contarPalavras(novoCenário) <= 200) {
                                            setCenario(novoCenário);
                                        }
                                        }}
                                        className={styles.textarea}
                                    />
                                    <p style={{ color: 'var(--input-placeholder)', fontSize: '12px', textAlign: 'right', marginTop: '4px' }}>{contarPalavras(cenario)}/200 palavras</p>
                                </div>  
                            </>
                        )}

                        <div className={styles.formGroup}>
                            <label>Descrição</label>
                            <textarea 
                                placeholder="Descreva o personagem em detalhes" 
                                value={descricao} 
                                onChange={(e) => {
                                  const novaDescricao = e.target.value;
                                  if (novaDescricao.length <= 500) {
                                    setDescricao(novaDescricao);
                                  }
                                }}
                                maxLength={500}
                            />
                            <p style={{ color: 'var(--input-placeholder)', fontSize: '12px', textAlign: 'right', marginTop: '4px' }}>{descricao.length}/500 caracteres</p>
                        </div>

                        {/* História */}
                        <div className={styles.formGroup}>
                            <label>História / Backstory</label>
                            <textarea 
                                placeholder="Qual é a história deste personagem?" 
                                value={historia} 
                                onChange={(e) => {
                                  const novaHistoria = e.target.value;
                                  if (contarPalavras(novaHistoria) <= 500) {
                                    setHistoria(novaHistoria);
                                  }
                                }}
                            />
                            <p style={{ color: 'var(--input-placeholder)', fontSize: '12px', textAlign: 'right', marginTop: '4px' }}>{contarPalavras(historia)}/500 palavras</p>
                        </div>
                        
                        {/* Personalidade e Comportamento */}
                        <div className={styles.formGroup}>
                            <label>Personalidade</label>
                            <textarea 
                                placeholder="Quais são seus traços de personalidade?" 
                                value={personalidade} 
                                onChange={(e) => {
                                  const novaPersonalidade = e.target.value;
                                  if (contarPalavras(novaPersonalidade) <= 200) {
                                    setPersonalidade(novaPersonalidade);
                                  }
                                }}
                            />
                            <p style={{ color: 'var(--input-placeholder)', fontSize: '12px', textAlign: 'right', marginTop: '4px' }}>{contarPalavras(personalidade)}/200 palavras</p>
                        </div>

                        {/* Aparência */}
                        <div className={styles.formGroup}>
                            <label>Aparência</label>
                            <textarea 
                                placeholder="Como o personagem se parece?" 
                                value={aparencia} 
                                onChange={(e) => {
                                  const novaAparencia = e.target.value;
                                  if (contarPalavras(novaAparencia) <= 200) {
                                    setAparencia(novaAparencia);
                                  }
                                }}
                            />
                            <p style={{ color: 'var(--input-placeholder)', fontSize: '12px', textAlign: 'right', marginTop: '4px' }}>{contarPalavras(aparencia)}/200 palavras</p>
                        </div>

                        {/* Gostos */}
                        <div className={styles.formGroup}>
                            <label>Gostos</label>
                            <textarea 
                                placeholder="O que ele gosta?" 
                                value={gostos} 
                                onChange={(e) => {
                                  const novosGostos = e.target.value;
                                  if (contarPalavras(novosGostos) <= 200) {
                                    setGostos(novosGostos);
                                  }
                                }}
                            />
                            <p style={{ color: 'var(--input-placeholder)', fontSize: '12px', textAlign: 'right', marginTop: '4px' }}>{contarPalavras(gostos)}/200 palavras</p>
                        </div>
                        
                        {/* Desgostos */}
                        <div className={styles.formGroup}>
                            <label>Desgostos</label>
                            <textarea 
                                placeholder="O que ele não gosta?" 
                                value={desgostos} 
                                onChange={(e) => {
                                  const novosDesgostos = e.target.value;
                                  if (contarPalavras(novosDesgostos) <= 200) {
                                    setDesgostos(novosDesgostos);
                                  }
                                }}
                            />
                            <p style={{ color: 'var(--input-placeholder)', fontSize: '12px', textAlign: 'right', marginTop: '4px' }}>{contarPalavras(desgostos)}/200 palavras</p>
                        </div>

                        {/* Relação com o Usuário */}
                        <div className={styles.formGroup}>
                            <label>Relação com o Usuário</label>
                            <textarea 
                                placeholder="Como o personagem se relaciona com o usuário?" 
                                value={relacaoUsuario} 
                                onChange={(e) => {
                                  const novosRelacionamento = e.target.value;
                                  if (contarPalavras(novosRelacionamento) <= 200) {
                                    setRelacaoUsuario(novosRelacionamento);
                                  }
                                }}
                            />
                            <p style={{ color: 'var(--input-placeholder)', fontSize: '12px', textAlign: 'right', marginTop: '4px' }}>{contarPalavras(relacaoUsuario)}/200 palavras</p>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Exemplos de Conversa</label>
                            <textarea 
                                placeholder="Exemplos de diálogo ou estilo de fala do personagem" 
                                value={exemplosConversa} 
                                onChange={(e) => {
                                  const novosExemplos = e.target.value;
                                  if (contarPalavras(novosExemplos) <= 200) {
                                    setExemplosConversa(novosExemplos);
                                  }
                                }}
                            />
                            <p style={{ color: 'var(--input-placeholder)', fontSize: '12px', textAlign: 'right', marginTop: '4px' }}>{contarPalavras(exemplosConversa)}/200 palavras</p>
                        </div>

                        {/* Objetivos */}
                        <div className={styles.formGroup}>
                            <label>Objetivos</label>
                            <textarea 
                                placeholder="Quais são os objetivos deste personagem?" 
                                value={objetivos} 
                                onChange={(e) => {
                                  const novosObjetivos = e.target.value;
                                  if (contarPalavras(novosObjetivos) <= 200) {
                                    setObjetivos(novosObjetivos);
                                  }
                                }}
                            />
                            <p style={{ color: 'var(--input-placeholder)', fontSize: '12px', textAlign: 'right', marginTop: '4px' }}>{contarPalavras(objetivos)}/200 palavras</p>
                        </div>

                        {/* Primeira Mensagem */}
                        <div className={styles.formGroup}>
                            <label>Primeira Mensagem</label>
                            <textarea 
                                placeholder="Como o personagem deve saudar o usuário pela primeira vez?" 
                                value={primeiraMensagem} 
                                onChange={(e) => {
                                  const novaPrimeiraMensagem = e.target.value;
                                  if (contarPalavras(novaPrimeiraMensagem) <= 200) {
                                    setPrimeiraMensagem(novaPrimeiraMensagem);
                                  }
                                }}
                            />
                            <p style={{ color: 'var(--input-placeholder)', fontSize: '12px', textAlign: 'right', marginTop: '4px' }}>{contarPalavras(primeiraMensagem)}/200 palavras</p>
                        </div>
                        
                        {/* Regras*/}
                        <div className={styles.formGroup}>
                            <label>Regras</label>
                            <textarea 
                                placeholder="Defina as regras de comportamento do personagem" 
                                value={regras} 
                                onChange={(e) => {
                                  const novasRegras = e.target.value;
                                  if (contarPalavras(novasRegras) <= 200) {
                                    setRegras(novasRegras);
                                  }
                                }}
                            />
                            <p style={{ color: 'var(--input-placeholder)', fontSize: '12px', textAlign: 'right', marginTop: '4px' }}>{contarPalavras(regras)}/200 palavras</p>
                        </div>

                    </>
                )}
                
                <input type="submit" value={isSubmitting ? "Salvando..." : "Salvar"} className={styles.submitButton} />
            </form>
        </main>
    );
}

export default CreateCharacter;