import React, { useState, useEffect } from 'react';
import styles from './CriacaoPerson.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { useAuth } from '../AuthContext/AuthContext';

function CriacaoPerson() {
    const [historia, setHistoria] = useState('');
    const [personalidade, setPersonalidade] = useState('');
    const [fotoia, setFotoia] = useState('');
    const [comportamento, setComportamento] = useState('');
    const [regras, setRegras] = useState('');
    const [genero, setGenero] = useState('');
    const [descricao, setDescricao] = useState('');
    const [estilo, setEstilo] = useState('');
    const [nome, setNome] = useState('');
    const [tipo_personagem, setTipo_personagem] = useState('person');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [erro, setErro] = useState('');
    const [figurinhas, setFigurinhas] = useState<string[]>(["", "", "", "", "", ""]);

    const location = useLocation();
    const modoEdicao = location.state?.editar || false;
    const personagemState = location.state?.personagem || null;
    const id = personagemState?.id;

    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPersonagem = async () => {
            if (modoEdicao && id) {
                try {
                    const response = await axios.get(`${API_URL}/dadosPersonagem/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const p = response.data.personagem;
                    setNome(p.nome || '');
                    setGenero(p.genero || '');
                    setDescricao(p.descricao || '');
                    setFotoia(p.fotoia || '');
                    setPersonalidade(p.personalidade || '');
                    setComportamento(p.comportamento || '');
                    setRegras(p.regras || '');
                    setEstilo(p.estilo || '');
                    setHistoria(p.historia || '');
                    setTipo_personagem(p.tipo_personagem || 'person');
                    setFigurinhas(p.figurinhas || ["", "", "", "", "", ""]);
                } catch (err) {
                    console.error("Erro ao buscar personagem:", err);
                    alert('Não foi possível carregar os dados do personagem.');
                }
            } else if (personagemState) {
                setNome(personagemState.nome || '');
                setGenero(personagemState.genero || '');
                setDescricao(personagemState.descricao || '');
                setFotoia(personagemState.fotoia || '');
                setPersonalidade(personagemState.personalidade || '');
                setComportamento(personagemState.comportamento || '');
                setRegras(personagemState.regras || '');
                setEstilo(personagemState.estilo || '');
                setHistoria(personagemState.historia || '');
                setTipo_personagem(personagemState.tipo_personagem || 'person');
                setFigurinhas(personagemState.figurinhas || ["", "", "", "", "", ""])
            }
        };

        fetchPersonagem();
    }, [modoEdicao, id, personagemState, token]);

    function converterBase64(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            const tiposPermitidos = ["image/jpeg", "image/png", "image/jpg"];
            if (!tiposPermitidos.includes(file.type)) {
                alert("Apenas imagens PNG ou JPEG são permitidas!");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === "string") {
                    setFotoia(reader.result);
                } else {
                    setFotoia('');
                }
            };
            reader.readAsDataURL(file);
        }
    }

        function converterFigurinha(e: React.ChangeEvent<HTMLInputElement>, index: number) {
            const file = e.target.files?.[0];
            if (file) {
                const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];
                if (!tiposPermitidos.includes(file.type)) {
                   alert("Apenas imagens PNG, JPEG ou WEBP são permitidas!");
                    return;
                }
                const reader = new FileReader();
                reader.onloadend = () => {
                    const novasFigurinhas = [...figurinhas];
                    novasFigurinhas[index] = reader.result as string;
                    setFigurinhas(novasFigurinhas);
                };
                reader.readAsDataURL(file);
            }
        }
        

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        setErro('');

        if (!/[A-Za-zÀ-ú]/.test(nome)) {
            setErro("O nome deve conter letras.");
            setIsSubmitting(false);
            return;
        }

        try {
            const data = { fotoia, nome, genero, personalidade, comportamento, estilo, historia, regras, descricao, tipo_personagem, figurinhas: figurinhas.filter(f => f && f.trim() !== "") };
            if (modoEdicao && id) {
                await axios.put(`${API_URL}/editarPerson/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
            } else {
                await axios.post(`${API_URL}/criacao`, data, { headers: { Authorization: `Bearer ${token}` } });
            }
            navigate(`/buscar`);
        } catch (err) {
            console.error('Erro ao salvar personagem:', err);
            alert('Ocorreu um erro ao salvar a personagem. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className={styles.criacaoPerson}>
            <section className={styles.containerCriacaoPerson}>
                <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                    <div className='w-full flex justify-center items-center'>
                        <div className='relative'>
                            <img 
                                src={fotoia || "/image/semPerfil.jpg"} 
                                alt="Pré-visualização" 
                                className='w-26 h-26 rounded-full object-cover'
                            />
                            <div className='absolute bottom-0 right-0 bg-gray-900 w-9 h-9 text-xl rounded-full flex justify-center items-center'>
                                <label htmlFor="foto">
                                    <i className="fa-solid fa-pen cursor-pointer"></i>
                                </label>
                                <input id="foto" type="file" onChange={converterBase64} accept="image/*" className="hidden" />
                            </div>
                        </div>
                        <h1 className="text-center text-xl font-bold my-6">{modoEdicao ? "Editar personagem" : "Criar personagem"}</h1>
                        {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}
                    </div>

                    {/* Campos */}
                    <div>
                        <label htmlFor="nome">Nome</label>
                        <input type="text" id="nome" placeholder="Digite o nome do personagem" value={nome} maxLength={20} onChange={(e) => setNome(e.target.value.replace(/[^A-Za-zÀ-ú0-9 ]/g, ''))} required />
                        <p className="text-gray-400 text-sm flex justify-end">{nome.length}/20 caracteres</p>
                    </div>

                    <div>
                        <label htmlFor="genero">Gênero</label>
                        <input type="text" id="genero" placeholder="Digite o gênero personagem" value={genero} maxLength={20} onChange={(e) => setGenero(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor="descricao">Descrição</label>
                        <textarea
                            placeholder='Digite a descrição do personagem'
                            id="descricao" 
                            value={descricao} maxLength={200} 
                            onChange={(e) => setDescricao(e.target.value)} />
                            <p className="text-gray-400 text-sm flex justify-end">{descricao.length}/200</p>
                    </div>

                    <div>
                        <label htmlFor='historia'>História</label>
                        <textarea value={historia} id="historia" placeholder='Digite a História do personagem' onChange={(e) => setHistoria(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor='personalidade'>Personalidade</label>
                        <textarea value={personalidade} id="personalidade" placeholder='Digite a personalidade do personagem' onChange={(e) => setPersonalidade(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor='estilo'>Estilo</label>
                        <textarea value={estilo} id= "estilo" placeholder="Digite o estilo do personagem" onChange={(e) => setEstilo(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor='comportamento'>Comportamento</label>
                        <textarea value={comportamento} id="comportamento" placeholder="Digite o comportamento do personagem" onChange={(e) => setComportamento(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor='regras'>Regras</label>
                        <textarea id="regras" placeholder="Digite as regras para seu personagem" value={regras} onChange={(e) => setRegras(e.target.value)} />
                    </div>

                    <h2 className={styles.tituloFigurinhas}>Adicionar figurinhas</h2>
                    <section className={styles.containerFigurinhas}>
                        {figurinhas.map((img, index) => {
                            // Lógica para decidir qual classe usar
                            const cardClass = img 
                                ? `${styles.figurinhas} ${styles.figurinhasPreenchida}` 
                                : `${styles.figurinhas} ${styles.figurinhasVazia}`;

                            return (
                                <label key={index} className={cardClass}>
                                    {img ? (
                                        // Estado Preenchido: Mostra a imagem com a nova classe
                                        <img 
                                            src={img} 
                                            alt={`Figurinha ${index + 1}`} 
                                            className={styles.imgPreview} 
                                        />
                                    ) : (
                                        <div className={styles.conteudoVazio}>
                                            <i className={`fa-solid fa-image ${styles.iconAdd}`}></i>
                                            <span className={styles.textAdd}>Adicionar</span>
                                        </div>
                                    )}

                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        hidden
                                        onChange={(e) => converterFigurinha(e, index)}
                                    />
                                </label>
                            );
                        })}
                    </section>

                    <input type="submit" value={isSubmitting ? "Salvando..." : modoEdicao ? "Salvar" : "Criar"} disabled={isSubmitting} className="bg-blue-500 border rounded-lg py-2 cursor-pointer hover:bg-blue-600 transition" />
                </form>
            </section>
        </main>
    );
}

export default CriacaoPerson;
