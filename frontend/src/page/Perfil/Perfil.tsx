import { useState } from 'react';
import styles from './Perfil.module.css';
import { useAuth } from '../../hooks/AuthContext/AuthContext';
import { normalizeFrame } from '../../utils/frame';
import { useSeguir } from '../../hooks/useSocial/useSocial';
import ModalSeguidores from '../../components/ModalSeguidores/ModalSeguidores';
import TapsPerfil from '../../components/TapsPerfil/TapsPerfil';

function Perfil() {
  const {
    usuario: nome,
    usuarioId,
    fotoPerfil,
    token,
    descricao,
    frame,
  } = useAuth();

  const { seguidores, seguindo } = useSeguir(usuarioId, token);

  const [abrirSeguidores, setAbrirSeguidores] = useState(false);
  const [abrirSeguindo, setAbrirSeguindo] = useState(false);

  const frameAtivo = normalizeFrame(frame);
  const caminhoFrame = frameAtivo ? `/image/frames/${frameAtivo}` : null;
  return (
    <main className={styles.containerPerfil}>

      <section className={styles.hero}>

        {/* AVATAR + FRAME */}
        <div className={styles.avatarWrapper}>
          <img
            src={fotoPerfil || '/image/semPerfil.jpg'}
            alt="Foto de perfil"
            className={styles.avatar}
          />
          {caminhoFrame && (
            <img
              src={caminhoFrame}
              alt="Frame"
              className={styles.frame}
            />
          )}
        </div>

        {/* NOME */}
        <h1 className={styles.nome}>{nome}</h1>

        {/* DESCRIÇÃO */}
        {descricao && (
          <p className={styles.descricao}>{descricao}</p>
        )}

        {/* STATS */}
        <div className={styles.stats}>
          <button className={styles.statBtn} onClick={() => setAbrirSeguidores(true)}>
            <span className={styles.statNumber}>{seguidores.length}</span>
            <span className={styles.statLabel}>Seguidores</span>
          </button>
          <div className={styles.statDivider} />
          <button className={styles.statBtn} onClick={() => setAbrirSeguindo(true)}>
            <span className={styles.statNumber}>{seguindo.length}</span>
            <span className={styles.statLabel}>Seguindo</span>
          </button>
        </div>

      </section>

      <TapsPerfil />

      {abrirSeguidores && (
        <ModalSeguidores
          tipo="seguidores"
          lista={seguidores}
          onClose={() => setAbrirSeguidores(false)}
          usuario={Number(usuarioId)}
          usuarioLogado={Number(usuarioId)}
        />
      )}
      {abrirSeguindo && (
        <ModalSeguidores
          tipo="seguindo"
          lista={seguindo}
          onClose={() => setAbrirSeguindo(false)}
          usuario={Number(usuarioId)}
          usuarioLogado={Number(usuarioId)}
        />
      )}
    </main>
  );
}

export default Perfil;