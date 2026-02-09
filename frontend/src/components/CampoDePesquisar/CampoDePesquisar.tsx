import { useState } from 'react';
import styles from './CampoDePesquisar.module.css';
import { useNavigate } from 'react-router-dom';

function CampoDePesquisar() {
  const [pesquisa, setPesquisa] = useState<string>("");
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/teste`)
  }

  return (
    <section className={styles.campoPesquisar}>
        <form action="" onSubmit={handleSubmit}>
            <div className={styles.campoPesquisarContainer}>
                <input type="text" value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} placeholder="Procurar personagem" className={`${styles.input}`}/>
                <button type='submit' className={`${styles.botaoPesquisar}`}><i className="fa-solid fa-magnifying-glass"></i></button>
            </div>
        </form>
    </section>
  );
}

export default CampoDePesquisar