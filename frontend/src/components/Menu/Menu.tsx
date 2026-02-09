import { useEffect, useState, useRef } from 'react';
import styles from './Menu.module.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { useNavigate } from 'react-router-dom';

type Personagem = {
    id: number;
    fotoia: string;
    nome: string;
};

interface MenuProps {
    setPersonId?: React.Dispatch<React.SetStateAction<number>>;
    onMenuToggle?: (isOpen: boolean) => void;
}

function Menu({ setPersonId, onMenuToggle }: MenuProps) {
    const { usuario, fotoPerfil, estaLogado, logout } = useAuth();
    const [abrirConta, setAbrirConta] = useState<boolean>(false);
    const [modalOpen, setModaOpen] = useState<boolean>(true);
    const [personagens, setPersonagens] = useState<Personagem[]>([]);
    const [loading, setLoading] = useState(true);
    const [procurarPersonagem, setProcurarPersonagem] = useState<string>('');

    const navigate = useNavigate();
    const modalRef = useRef<HTMLDivElement>(null);
    const personagensFiltrados = personagens.filter((personagem) => personagem.nome.toLocaleLowerCase().includes(procurarPersonagem.toLocaleLowerCase()));

    useEffect(() => {
        if (onMenuToggle) onMenuToggle(modalOpen);
    }, [modalOpen, onMenuToggle]);

    function sairDaConta() {
        logout();
        setAbrirConta(false);
    }

    function sobreConta() {
        setAbrirConta(prev => !prev);
    }

    function modalCondicao() {
        setModaOpen(prev => !prev);
    }

    function goPerson(id: number) {
        console.log('Menu.goPerson: navegando para /personagem/', id);
        navigate(`/personagem/${id}`);
    }

    // Mostrar o personagens
     useEffect(() => {
        const mostraPersonagens = async () => {
            try {
                const res = await axios(`${API_URL}/personagens`);
                const data = Array.isArray(res.data) ? res.data : res.data.personagens || res.data.data || [];
                setPersonagens(data);
            } catch (err) {
                console.error("Erro ao carregar personagens:", err);
                setPersonagens([]);
            } finally {
                setLoading(false);
            }
        };

        mostraPersonagens();
    }, []);

     // faz fechar o menu ao clicar fora dele 
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {

            if (window.innerWidth > 768) return; // Ignora em telas maiores

            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setModaOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    },[]);

    return (
        <>
            <button onClick={modalCondicao} className={styles.btnMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {modalOpen && (
                <aside ref={modalRef} className={`fixed top-0 left-0 p-4 ${styles.menu}`}>
                    <h1>
                        <a href="/" className='flex justify-center items-center w-full'>
                            <img src="/image/PersonIA.png" alt="PersonIA" className={styles.logo} />
                        </a>
                    </h1>

                    <section>
                        <h2 className={styles.subTitulo}>Criação</h2>
                        <nav>
                            <ul className={styles.menuItems}>
                                <li><Link to={'/buscar'}><i className="fa-solid fa-magnifying-glass"></i> Buscar</Link></li>
                                <li><Link to={'/criacao-person'}><i className="fa-solid fa-user"></i> Criar personagem</Link></li>
                                <li><Link to={'/person-ficticio'}><i className="fa-solid fa-user"></i> Fictício</Link></li>

                                {!estaLogado && (
                                    <>
                                        <li><Link to={'/entrar'}><i className="fa-solid fa-right-to-bracket"></i> Entrar</Link></li>
                                        <li><Link to={'/cadastra'}><i className="fa-solid fa-user-plus"></i> Cadastrar</Link></li>
                                    </>
                                )}
                            </ul>
                        </nav>
                    </section>

                    <hr className={styles.separacaoCriacao} />
                    <div className={styles.containerBusca}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input 
                            type="text" 
                            onChange={(e) => {
                                setProcurarPersonagem(e.target.value);
                            }}
                            placeholder="Procurar personagem..." 
                            className={styles.inputProcurar} 
                        />
                    </div>

                    <section>
                        <h2 className={styles.subTitulo}>Personagens</h2>
                        <nav>
                            <ul className={styles.menuItems}>
                                <div className={styles.containerPerson}>

                                    {loading ? (
                                        <div className={styles.loaderContainer}>
                                            <div className={styles.spinner}></div>
                                            <p>Carregando personagens...</p>
                                        </div>
                                    ) : personagensFiltrados.length > 0 ? (
                                        personagensFiltrados.map((item) => (
                                            <li key={item.id}>
                                                <button
                                                    className="w-full"
                                                    onClick={() => {
                                                        if (setPersonId) setPersonId(item.id);
                                                        goPerson(item.id);
                                                    }}
                                                >
                                                    <img
                                                        src={item.fotoia || '/image/semPerfil.jpg'}
                                                        alt="Foto de perfil"
                                                        className='w-7 h-7 rounded-full object-cover'
                                                    />
                                                    <p className={styles.nomePersonagem}>{item.nome}</p>
                                                </button>
                                            </li>
                                        ))
                                    ) : (
                                        <p className='text-center text-sm text-gray-400 texte'>Nenhum personagem encontrado.</p>
                                    )}

                                </div>
                            </ul>
                        </nav>
                    </section>

                    <section>
                        <div
                            onClick={sobreConta}
                            className={`absolute bottom-0 left-0 p-11 w-full cursor-pointer ${styles.containerConta}`}
                        >
                            <div className={styles.person}>
                                {estaLogado ? (
                                    <div className='flex flex-row items-center gap-2'>
                                        <img
                                            src={fotoPerfil || '/image/semPerfil.jpg'}
                                            alt='Erro ao carregar imagem'
                                            className='w-9 h-9 rounded-full object-cover'
                                        />
                                        <p className='truncate w-48'>{usuario}</p>
                                    </div>
                                ) : (
                                    <div className='flex flex-row items-center gap-2'>
                                        <img
                                            src="/image/semPerfil.jpg"
                                            alt="Erro ao carregar imagem"
                                            className='w-9 h-9 rounded-full object-cover'
                                        />
                                        <p>visitante</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {abrirConta && (
                            <nav className={`absolute bottom-20 left-0 w-full ${styles.navegacaoConta}`}>
                                <ul className={styles.items}>
                                    {estaLogado ? (
                                        <>
                                            <li><Link to={'/perfil/:usuario_id'}><i className="fa-solid fa-user"></i> Perfil</Link></li>
                                            <hr className={styles.separacaoConta} />
                                            <li onClick={sairDaConta}><i className="fa-solid fa-right-from-bracket"></i> Sair</li>
                                        </>
                                    ) : (
                                        <>
                                            <li><Link to={'/entrar'}><i className="fa-solid fa-right-to-bracket"></i> Entrar</Link></li>
                                            <hr className={styles.separacaoConta} />
                                            <li><Link to={'/cadastra'}><i className="fa-solid fa-user-plus"></i> Cadastrar</Link></li>
                                        </>
                                    )}
                                </ul>
                            </nav>
                        )}
                    </section>
                </aside>
            )}
        </>
    );
}

export default Menu;
