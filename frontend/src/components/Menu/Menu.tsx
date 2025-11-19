import { useEffect, useState } from 'react';
import styles from './Menu.module.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext';
import axios from 'axios'

type Personagem = {
    id: number;
    fotoia: string;
    nome: string;
  };

interface MenuProps {
    setPersonId: React.Dispatch<React.SetStateAction<number>>;
    onMenuToggle?: (isOpen: boolean) => void;
}

function Menu({ setPersonId, onMenuToggle }: MenuProps) {
    const { usuario, fotoPerfil, estaLogado, logout } = useAuth();
    const [abrirConta, setAbrirConta] = useState<boolean>(false);
    const [modalOpen, setModaOpen] = useState<boolean>(true);
    const [personagens, setPersonagens] = useState<Personagem[]>([])

    useEffect(() => {
        const mostraPersonagens =  async () => {
            try {
                const res = await axios("https://api-personia.onrender.com/personagens")
                setPersonagens(res.data)
            } catch (err) {
                console.error("Erro ao carregar usuários")
            }
        }
        
        mostraPersonagens()
    }, [])

    // Notifica o App quando o menu abre/fecha
    useEffect(() => {
        if (onMenuToggle) {
            onMenuToggle(modalOpen);
        }
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

    return (
        <>
            <button onClick={modalCondicao} className={styles.btnMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"
                    className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {modalOpen && (
                <aside className={`fixed top-0 left-0 p-4 ${styles.menu}`}>
                    <h1><a href="/" className='flex justify-center items-center w-full'><img src="/image/PersonIA.png" alt="PersonIA" className={styles.logo} /></a></h1>
                    <section>
                        <h2 className={styles.subTitulo}>Criação</h2>
                        <nav>
                            <ul className={styles.menuItems}>
                                <li><Link to={'/criacao-person'}><i className="fa-solid fa-user"></i> Criar personagem</Link></li>
                                <li><Link to={'/person-ficticio'}><i className="fa-solid fa-user"></i>Fictício</Link></li>

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

                    <section>
                        <h2 className={styles.subTitulo}>Personagens</h2>
                        <nav>
                            <ul className={styles.menuItems}>
                                <div className={styles.containerPerson}>
                                    {personagens.map((item) => (
                                        <li key={item.id}>
                                            <button className="w-full" onClick={() => {setPersonId(item.id);}}
                                                >
                                            <img src={item.fotoia || '/public/image/semPerfil.jpg'} alt="Foto de perfil" className='w-7 h-7 rounded-full object-cover'/>
                                                <p className={styles.nomePersonagem}>{item.nome}</p>
                                            </button>
                                        </li>
                                    ))}
                                </div>
                            </ul>
                        </nav>
                    </section>

                    <section>

                        
                    <div onClick={sobreConta} className={`absolute bottom-0 left-0 p-11 w-full cursor-pointer ${styles.containerConta}`}>
                            <div className={styles.person}>
                                {estaLogado ? (
                                    <div className='flex flex-row items-center gap-2'>
                                        <img src={fotoPerfil || '/image/semPerfil.jpg'} alt='Erro ao carregar imagem' className='w-9 h-9 rounded-full object-cover'/>
                                         <p className='truncate w-48'>{usuario}</p>
                                    </div>
                                ): (
                                    <div className='flex flex-row items-center gap-2'>
                                        <div>
                                            <img src="/image/semPerfil.jpg" alt="Erro ao carregar imagem" className='w-9 h-9 rounded-full object-cover'/>
                                        </div>
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
                                         <hr className={styles.separacaoConta}/>
                                         <li onClick={sairDaConta}><i className="fa-solid fa-right-from-bracket"></i> Sair</li>
                                        </>

                                    ) : (
                                        <>
                                        <li><Link to={'/entrar'}><i className="fa-solid fa-right-to-bracket"></i> Entrar</Link></li>
                                        <hr className={styles.separacaoConta}/>
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
