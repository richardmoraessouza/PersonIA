import React, { useState } from 'react';
import styles from './CriacaoPerson.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext/AuthContext';

function CriacaoPerson() {
    const [historia, setHistoria] = useState<string>('');
    const [personalidade, setPersonalidade] = useState<string>('');
    const [fotoia, setFotoia] = useState<string>('');
    const [comportamento, setComportamento] = useState<string>('');
    const [regras, setRegras] = useState<string>('');
    const [genero, setGenero] = useState<string>('');
    const [descricao, setDescricao] = useState<string>("")
    const [estilo, setEstilo] = useState<string>('');
    const [nome, setNome] = useState<string>('');
    const [erro, setErro] = useState<string>('');
    const { token } = useAuth();
    const navigate = useNavigate();

    // Função para converter imagem para Base64
    function converterBase64(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            const tiposPermitidos = ["image/jpeg", "image/png"];
            if (!tiposPermitidos.includes(file.type)) {
                alert("Apenas imagens PNG ou JPEG são permitidas!");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => setFotoia(reader.result as string);
            reader.readAsDataURL(file);
        }
    }

    const form = async (e: React.FormEvent) => {
        e.preventDefault();

         if (!nome || nome.length < 8) {
            setErro("O nome deve ter pelo menos 8 caracteres.");
            return;
        }
        // Não pode ter caracteres especiais
        if (/[^A-Za-zÀ-ú0-9 ]/.test(nome)) {
            setErro("O nome contém caracteres inválidos.");
            return;
        }
        // Deve ter pelo menos uma letra
        if (!/[A-Za-zÀ-ú]/.test(nome)) {
            setErro("O nome deve conter pelo menos uma letra.");
            return;
        }

        try {

            const res = await axios.post('https://api-personia.onrender.com/criacao', {
            fotoia,
            nome,
            genero,
            personalidade,
            comportamento,
            estilo,
            historia,
            regras,
            descricao
        }, {
            headers: {
                Authorization: `Bearer ${token}` 
            }
        });


            const criacao = res.data;
            console.log('Personagem criada com sucesso:', criacao);
            alert('Personagem criada com sucesso!');
            navigate(`/`);

            // Limpar campos
            setNome('');
            setGenero('');
            setDescricao('')
            setPersonalidade('');
            setComportamento('');
            setRegras('');
            setEstilo('');
            setHistoria('');
            setFotoia('');

        } catch (err) {
            console.error('Erro ao criar personagem:', err);
            alert('Ocorreu um erro ao criar a personagem. Tente novamente.');
        }
    }

    return (
        <main className={styles.criacaoPerson}>
            <section className={styles.containerCriacaoPerson}>
                <form className='flex flex-col gap-4' onSubmit={form}>

                    {/* FOTO DE PERFIL */}
                    <div className='w-full flex justify-center items-center'>
                        <div className='relative'>
                            <img 
                                src={fotoia || "/public/image/semPerfil.png"} 
                                alt="Pré-visualização da imagem" 
                                className='w-28 h-28 rounded-full object-cover'
                            />
                            <div className='absolute bottom-0 right-4 bg-gray-900 w-9 h-9 text-xl rounded-full flex justify-center items-center'>
                                <label htmlFor="foto" title="Adicionar imagem">
                                    <i className="fa-solid fa-pen cursor-pointer"></i>
                                </label>
                                <input 
                                    id="foto" 
                                    type="file" 
                                    onChange={converterBase64}
                                    accept="image/*" 
                                    className="hidden" 
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="nome">Nome</label>
                        <input 
                            type="text" 
                            placeholder="Digite o nome da personagem" 
                            required 
                            value={nome}
                            id='nome'
                            maxLength={50}
                            onChange={e => {
                                    const valor = e.target.value;
                                    // Remove caracteres especiais indesejados
                                    const filtrado = valor.replace(/[^A-Za-zÀ-ú ]/g, '');
                                    setNome(filtrado);
                                }}
                                onBlur={() => {
                                    // Verifica mínimo de 8 caracteres ao sair do input
                                    if (nome.length < 8) {
                                        setErro('O nome deve ter pelo menos 8 caracteres.');
                                    } else {
                                        setErro('');
                                    }
                                }}
                        />
                         <p className="text-gray-400 text-sm flex justify-end">
                                {nome.length}/50 caracteres
                        </p>
                    </div>

                    <div>
                        <label htmlFor="genero">Gênero</label>
                        <input 
                            type="text" 
                            placeholder="Digite o gênero da personagem" 
                            value={genero}
                            onChange={(e) => setGenero(e.target.value)}
                            id='genero'
                            maxLength={20}

                        />
                         <p className="text-gray-400 text-sm flex justify-end">
                                {genero.length}/20 caracteres
                            </p>
                    </div>

                    <div>
                        <label htmlFor="descricao">Descrição</label>
                        <textarea 
                            id="descricao" 
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            maxLength={500}
                            placeholder="Escreva uma descrição do seu personagem, que aparecerá no perfil do personagem."
                        ></textarea>
                         <p className="text-gray-400 text-sm flex justify-end">
                                {descricao.length}/500 caracteres
                        </p>
                    </div>

                    <div>
                        <label htmlFor="historia">História</label>
                        <textarea 
                            id="historia"
                            value={historia}
                            onChange={(e) => setHistoria(e.target.value)}
                            placeholder='Digite a história da personagem'
                        ></textarea>
                    </div>

                    <div>
                        <label htmlFor="personalidade">Personalidade</label>
                        <textarea 
                            id="personalidade" 
                            value={personalidade}
                            onChange={(e) => setPersonalidade(e.target.value)}
                            placeholder='Digite a personalidade da personagem'
                        ></textarea>
                    </div>

                    <div>
                        <label htmlFor="estilo">Estilo</label>
                        <textarea 
                            id="estilo"
                            value={estilo}
                            onChange={(e) => setEstilo(e.target.value)}
                            placeholder='Digite o estilo do seu personagem'
                        ></textarea>
                    </div>

                    <div>
                        <label htmlFor="agir">Comportamento e modo de agir</label>
                        <textarea 
                            id="agir" 
                            value={comportamento}
                            onChange={(e) => setComportamento(e.target.value)}
                            placeholder='Digite o comportamento e modo de agir'
                        ></textarea>
                    </div>


                    <div>
                        <label htmlFor="regras">Regras</label>
                        <textarea 
                            id="regras"
                            value={regras}
                            onChange={(e) => setRegras(e.target.value)} 
                            placeholder='Digite as regras'
                        ></textarea>
                    </div>

                    <input 
                        type="submit" 
                        value="Salvar" 
                        className="bg-blue-500 border rounded-lg py-2 cursor-pointer hover:bg-blue-600 transition"
                    />
                </form>
            </section>
        </main>
    )
}

export default CriacaoPerson;
