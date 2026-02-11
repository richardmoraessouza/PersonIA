import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './PersonagemPesquisado.module.css';
import CampoDePesquisar from '../../components/CampoDePesquisar/CampoDePesquisar';

function PersonagemPesquisado() {
    const location = useLocation();
    const [resultados, setResultados] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // console.log( nomeUser);

    useEffect(() => {
        if (location.state?.resultados) {
            setResultados(location.state.resultados);
            window.scrollTo(0, 0);
        }
    }, [location.state?.resultados]);

    const handleNovasBuscas = (novosResultados: any[]) => {
        setResultados(novosResultados);
        setIsLoading(false);
        window.scrollTo(0, 0);
        
        if (novosResultados.length === 0) {
            console.log("❌ Nenhum personagem encontrado");
        } else {
            console.log(`✅ ${novosResultados.length} personagem(ns) encontrado(s)`);
        }
    }

    const handleSearchStart = () => {
        setIsLoading(true);
    }

    return (
        <main className={styles.container}>
            <CampoDePesquisar onSearch={handleNovasBuscas} onSearchStart={handleSearchStart} />
            <div className={styles.buttonsContainer}>
                <button className={styles.activeButton}>Personagens</button>
                <button className={styles.inactiveButton}>Criadores</button>
            </div>

            {isLoading ? (
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                </div>
                
            ) : resultados.length > 0 ? (
                <>
                    <article className={styles.gridCards}>
                        {resultados.map((personagem: any) => (
                            <div key={personagem.id} className={styles.card}>
                                <div className={styles.cardImageContainer}>
                                    {personagem.fotoia ? (
                                        <img 
                                            src={personagem.fotoia} 
                                            alt={personagem.nome} 
                                            className={styles.cardImage}
                                        />
                                    ) : (
                                        <div>
                                            <img src="/image/semPerfil.jpg" alt="Sem imagem de perfil" className={styles.cardImage} />
                                        </div>
                                    )}
                                </div>
                                <div className={styles.cardContent}>
                                    <div>
                                        <h3 className={styles.cardNome}>
                                            {personagem.nome}
                                            <span className={styles.linkIcon}>↗</span>
                                        </h3>
                                        <p className={styles.cardBio}>
                                            {personagem.bio || 'Sem descrição bio'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </article>
                </>
            ) : (
                <div className={styles.emptyMessageContainer}>
                    <CampoDePesquisar onSearch={handleNovasBuscas} onSearchStart={handleSearchStart} />
                    <div className={styles.emptyMessage}>
                        Nenhum personagem encontrado. Tente fazer uma busca!
                    </div>
                </div>
            )}
        </main>
    )
}

export default PersonagemPesquisado;