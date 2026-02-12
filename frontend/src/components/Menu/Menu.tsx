import { useEffect, useState, useRef } from 'react';
import styles from './Menu.module.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext/AuthContext';
import axios from 'axios';
import { API_URL } from '../../config/api';

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
    const { usuario, fotoPerfil, estaLogado, logout, usuarioId, token } = useAuth();
    const [abrirConta, setAbrirConta] = useState<boolean>(false);
    const [modalOpen, setModaOpen] = useState<boolean>(true);
    const [loading, setLoading] = useState(true);
    const [favoritos, setFavoritos] = useState<Personagem[]>([]);
    const [procurarPersonagem, setProcurarPersonagem] = useState<string>('');

    const modalRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Filtra os favoritos com base no que o usuário digita na busca
    const favoritosFiltrados = favoritos.filter((personagem) =>
        personagem.nome.toLocaleLowerCase().includes(procurarPersonagem.toLocaleLowerCase())
    );

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

    // Carregar os personagens favoritados do banco de dados
    useEffect(() => {
        const carregarFavoritos = async () => {
            if (!estaLogado || !usuarioId) {
                setLoading(false);
                setFavoritos([]);
                return;
            }

            try {
                const res = await axios.get(`${API_URL}/getFavoritosFull/${usuarioId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const data = Array.isArray(res.data) ? res.data : [];
                setFavoritos(data);
            } catch (err) {
                console.error("Erro ao carregar favoritos no menu:", err);
                setFavoritos([]);
            } finally {
                setLoading(false);
            }
        };

        carregarFavoritos();
    }, [usuarioId, estaLogado, token]);

    // Fecha o menu ao clicar fora dele (mobile)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (window.innerWidth > 768) return;
            const target = event.target as Node;
            const clickedOutsideModal = modalRef.current && !modalRef.current.contains(target);
            const clickedMenuButton = buttonRef.current && buttonRef.current.contains(target);

            if (clickedOutsideModal && !clickedMenuButton) {
                setModaOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <button ref={buttonRef} onClick={modalCondicao} className={styles.btnMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {modalOpen && (
                <aside ref={modalRef} className={`fixed top-0 left-0 p-4 ${styles.menu}`}>
                    <h1>
                        <a href="/explorar" className='flex justify-center items-center w-full'>
                            <img src="/image/PersonIA.png" alt="PersonIA" className={styles.logo} />
                        </a>
                    </h1>

                    {/* criação e explorar */}
                    <section>
                        <h2 className={styles.subTitulo}>Criação</h2>
                        <nav>
                            <ul className={styles.menuItems}>
                                <li><Link to={'/explorar'}><i className="fa-solid fa-compass"></i>Buscar</Link></li>
                                <li><Link to={'/criacao-person'}><i className="fa-solid fa-user"></i> Criar personagem</Link></li>
                                <li><Link to={'/person-ficticio'}><i className="fa-solid fa-hat-wizard"></i> Fictício</Link></li>

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
                            onChange={(e) => setProcurarPersonagem(e.target.value)}
                            placeholder="Procurar" 
                            className={styles.inputProcurar} 
                        />
                    </div>

                    {/* mostra os favoritos do usuario */}
                    <section>
                        <h2 className={styles.subTitulo}>Favoritos</h2>
                        <nav>
                            <ul className={styles.menuItems}>
                                <div className={styles.containerPerson}>

                                    {loading ? (
                                        <div className={styles.loaderContainer}>
                                            <div className={styles.spinner}></div>
                                            <p>Carregando...</p>
                                        </div>
                                    ) : favoritosFiltrados.length > 0 ? (
                                        favoritosFiltrados.map((item) => (
                                            <li key={item.id}>
                                                <Link
                                                    to={`/personagem/${item.id}`}
                                                    className="w-full flex items-center gap-2 p-1 hover:bg-[#2a2a2a] rounded transition-colors"
                                                    onClick={() => setPersonId && setPersonId(item.id)}
                                                >
                                                    <img
                                                        src={item.fotoia || '/image/semPerfil.jpg'}
                                                        alt={item.nome}
                                                        className='w-7 h-7 rounded-full object-cover'
                                                    />
                                                    <p className={styles.nomePersonagem}>{item.nome}</p>
                                                </Link>
                                            </li>
                                        ))
                                    ) : (
                                        <p className='text-center text-sm text-gray-400 p-4'>
                                            {estaLogado ? "Nenhum favorito encontrado." : "Entre para ver seus favoritos."}
                                        </p>
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
                                            alt='Perfil'
                                            className='w-9 h-9 rounded-full object-cover'
                                        />
                                        <p className='truncate w-48'>{usuario}</p>
                                    </div>
                                ) : (
                                    <div className='flex flex-row items-center gap-2'>
                                        <img
                                            src="/image/semPerfil.jpg"
                                            alt="Visitante"
                                            className='w-9 h-9 rounded-full object-cover'
                                        />
                                        <p>visitante</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* abre o sair e ver perfil da conta */}
                        {abrirConta && (
                            <nav className={`absolute bottom-20 left-0 w-full ${styles.navegacaoConta}`}>
                                <ul className={styles.items}>
                                    {estaLogado ? (
                                        <>
                                            <li><Link to={`/perfil/${usuarioId}`}><i className="fa-solid fa-user"></i> Perfil</Link></li>
                                            <hr className={styles.separacaoConta} />
                                            <li onClick={sairDaConta} className="cursor-pointer">
                                                <i className="fa-solid fa-right-from-bracket"></i> Sair
                                            </li>
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