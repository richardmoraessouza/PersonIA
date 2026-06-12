
import styles from './MiniProfile.module.css';
import type { MiniProfileType } from "../../types/users/users";
import { normalizeFrame } from "../../utils/frame";

interface MiniProfileProps extends MiniProfileType {
  onClose?: () => void;
}

const MiniProfile = ({
  nome,
  foto,
  descricao,
  frame,
  is_online,
}: MiniProfileProps) => {

  const frameAtivo = normalizeFrame(frame);
  const caminhoMoldura = frameAtivo ? `/image/frames/${frameAtivo}` : null;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatarWrap}>
          
          {caminhoMoldura && (
            <img 
              src={caminhoMoldura} 
              alt="Moldura de Perfil" 
              className={styles.avatarMoldura} 
            />
          )}

          <img
            src={foto || '/image/semPerfil.jpg'}
            alt={nome}
            className={styles.avatar}
          />
          
        </div>
        
        <div className={styles.headerInfo}>
          <span className={styles.nome}>{nome}</span>
          <span className={styles.descricao}>{descricao}</span>
          <span 
            className={styles.status}
            style={{ color: is_online ? '#22c55e' : '#6b7280' }}
          >
            {is_online ? 'Online' : 'Offline'}
          </span>
        </div>
        
      </div>
    </div>
  );
};

export default MiniProfile;