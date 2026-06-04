import React from 'react';
import styles from './quick-create.module.css';

interface QuickCreateModeProps {
  nome: string;
  bio: string;
  descricao: string;
  obra: string;
  isFiccional: boolean;
  onNomeChange: (value: string) => void;
  onBioChange: (value: string) => void;
  onDescricaoChange: (value: string) => void;
  onObraChange: (value: string) => void;
}

const contarPalavras = (texto: string) => {
  return texto.trim().split(/\s+/).filter(palavra => palavra.length > 0).length;
};

const validarNome = (texto: string) => {
  // Remove caracteres especiais, mantendo apenas letras, números e espaços
  const limpo = texto.replace(/[^A-Za-zÀ-ú0-9 ]/g, '');
  // Verifica se tem conteúdo após remover espaços e se tem pelo menos uma letra
  return limpo.trim().length > 0 && /[A-Za-zÀ-ú]/.test(limpo) ? limpo : '';
};

export const QuickCreateMode: React.FC<QuickCreateModeProps> = ({ 
  nome, 
  bio, 
  descricao, 
  obra,
  isFiccional,
  onNomeChange,
  onBioChange,
  onDescricaoChange,
  onObraChange
}) => {
  const palavrasNome = contarPalavras(nome);
  const caracteresDescricao = descricao.length;
  
  return (
    <div className={styles.modoRapidoContainer}>      
      <div className={styles.formGroup}>
        <label htmlFor="nome_rapido">Nome do Personagem: </label>
        <input
          id="nome_rapido"
          type="text"
          value={nome}
          required
          placeholder="Ex: Shadow the Hedgehog"
          onChange={(e) => {
            const novoNome = validarNome(e.target.value);
            if (contarPalavras(novoNome) <= 20) {
              onNomeChange(novoNome);
            }
          }}
          className={styles.input}
        />
        <p style={{ color: 'var(--input-placeholder)', fontSize: '12px', textAlign: 'right', marginTop: '4px' }}>{palavrasNome}/20 palavras</p>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="bio_rapido">Bio (Resumo): </label>
        <input
          id="bio_rapido"
          type="text"
          value={bio}
          placeholder="Ex: Um guerreiro ciberpunk"
          onChange={(e) => {
            const novaBio = e.target.value;
            if (contarPalavras(novaBio) <= 50) {
              onBioChange(novaBio);
            }
          }}
          className={styles.input}
        />
        <p style={{ color: 'var(--input-placeholder)', fontSize: '12px', textAlign: 'right', marginTop: '4px' }}>{contarPalavras(bio)}/50 palavras</p>
      </div>

      {isFiccional && (
        <div className={styles.formGroup}>
          <label htmlFor="obra_rapido">Obra / Universo</label>
          <input
            id="obra_rapido"
            type="text"
            value={obra}
            placeholder="De qual obra/universo é este personagem?"
            required
            onChange={(e) => {
              const novaObra = e.target.value;
              if (contarPalavras(novaObra) <= 50) {
                onObraChange(novaObra);
              }
            }}
            className={styles.input}
          />
          <p style={{ color: 'var(--input-placeholder)', fontSize: '12px', textAlign: 'right', marginTop: '4px' }}>{contarPalavras(obra)}/50 palavras</p>
        </div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="descricao_rapido">Descrição</label>
        <textarea
          id="descricao_rapido"
          value={descricao}
          placeholder="Descreva seu personagem: aparência, personalidade, história..."
          onChange={(e) => {
            const novaDescricao = e.target.value;
            if (novaDescricao.length <= 500) {
              onDescricaoChange(novaDescricao);
            }
          }}
          maxLength={500}
          className={styles.textarea}
        />
        <p style={{ color: 'var(--input-placeholder)', fontSize: '12px', textAlign: 'right', marginTop: '4px' }}>{caracteresDescricao}/500 caracteres</p>
      </div>
    </div>
  );
};