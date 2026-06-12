import React, { useState, useEffect } from 'react';
import styles from './TapsPreferencesTheme.module.css';

interface TapsPreferencesThemeProps {
  onThemeChange?: (theme: string) => void;
}

const TapsPreferencesTheme: React.FC<TapsPreferencesThemeProps> = ({ onThemeChange }) => {
  const DEFAULT_USER_BG = '#3b82f6';

  // Pega o default do bot a partir do tema atual (CSS já aplicado)
  const getDefaultBotBg = () =>
    getComputedStyle(document.documentElement)
      .getPropertyValue('--bot-bubble-message-bg').trim() || '#1e1e1e';

  const [theme, setTheme]         = useState<string>('sistema');
  const [styleChat, setStyleChat] = useState<string>('padrao');
  const [fontSize, setFontSize]   = useState<string>('medium');
  const [botBg, setBotBg]         = useState<string>('#1e1e1e');
  const [userBg, setUserBg]       = useState<string>(DEFAULT_USER_BG);

  useEffect(() => {
    const savedTheme    = localStorage.getItem('appTheme')     || 'sistema';
    const savedStyle    = localStorage.getItem('chatStyle')    || 'padrao';
    const savedFontSize = localStorage.getItem('chatFontSize') || 'medium';
    const savedUserBg   = localStorage.getItem('userBg')       || DEFAULT_USER_BG;

    setTheme(savedTheme);
    setStyleChat(savedStyle);
    setFontSize(savedFontSize);
    setUserBg(savedUserBg);

    applyTheme(savedTheme);
    applyChatStyle(savedStyle);
    applyFontSize(savedFontSize);
    applyUserColor(savedUserBg);

    // Restaura cor do bot só se o usuário tiver salvo uma customização
    const savedBotBg = localStorage.getItem('botBg');
    if (savedBotBg) {
      setBotBg(savedBotBg);
      applyBotColor(savedBotBg);
    } else {
      // Sem customização: deixa o CSS do tema mandar, só atualiza o state pro picker
      const themeBotBg = getDefaultBotBg();
      setBotBg(themeBotBg);
      // não seta no body — deixa o CSS assumir
    }
  }, []);

  const applyTheme = (val: string) => {
    const html = document.documentElement;
    if (val === 'claro')       html.setAttribute('data-theme', 'light');
    else if (val === 'escuro') html.setAttribute('data-theme', 'dark');
    else                       html.removeAttribute('data-theme');
  };

  const applyChatStyle = (style: string) => {
    const root = document.documentElement;
    const map: Record<string, { family: string; spacing: string }> = {
      elegante: { family: "'Georgia', serif",          spacing: '0.3px' },
      compacto: { family: "'Courier New', monospace",  spacing: '0.5px' },
      padrao:   { family: '-apple-system, sans-serif', spacing: '0.2px' },
    };
    const s = map[style] ?? map.padrao;
    root.style.setProperty('--chat-font-family',    s.family);
    root.style.setProperty('--chat-letter-spacing', s.spacing);
  };

  const applyFontSize = (size: string) => {
    const sizes: Record<string, string> = { small: '14px', medium: '16px', large: '18px' };
    document.body.style.setProperty('--chat-font-size', sizes[size] ?? '16px');
  };

  const applyBotColor = (bg: string) => {
    document.body.style.setProperty('--bot-bubble-message-bg', bg);
  };

  const applyUserColor = (bg: string) => {
    document.body.style.setProperty('--user-bubble-message-bg', bg);
  };

  const handleThemeChange = (val: string) => {
    setTheme(val);
    localStorage.setItem('appTheme', val);
    applyTheme(val);
    onThemeChange?.(val);

    // Se não tem customização do bot, atualiza o picker pro valor do novo tema
    if (!localStorage.getItem('botBg')) {
      setTimeout(() => setBotBg(getDefaultBotBg()), 0);
    }
  };

  const handleStyleChange = (val: string) => {
    setStyleChat(val);
    localStorage.setItem('chatStyle', val);
    applyChatStyle(val);
  };

  const handleFontSizeChange = (val: string) => {
    setFontSize(val);
    localStorage.setItem('chatFontSize', val);
    applyFontSize(val);
  };

  const handleBotBgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setBotBg(color);
    localStorage.setItem('botBg', color);
    applyBotColor(color);
  };

  const handleUserBgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setUserBg(color);
    localStorage.setItem('userBg', color);
    applyUserColor(color);
  };

  const handleResetColors = () => {
    // Remove customizações — CSS do tema assume automaticamente
    localStorage.removeItem('botBg');
    localStorage.removeItem('userBg');
    document.body.style.removeProperty('--bot-bubble-message-bg');
    document.body.style.removeProperty('--user-bubble-message-bg');
    setUserBg(DEFAULT_USER_BG);
    setTimeout(() => setBotBg(getDefaultBotBg()), 0);
  };

  const Dot = () => <span className={styles.checkmark} />;

  return (
    <div className={styles.container}>

      {/* Tema */}
      <div className={styles.section}>
        <label className={styles.label}>Tema</label>
        <div className={styles.themeOptions}>
          {(['sistema', 'claro', 'escuro'] as const).map((t) => (
            <button
              key={t}
              onClick={() => handleThemeChange(t)}
              className={`${styles.themeButton} ${theme === t ? styles.active : ''}`}
            >
              {theme === t && <Dot />}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Fonte */}
      <div className={styles.section}>
        <label className={styles.label}>Fonte do chat</label>
        <div className={styles.styleOptions}>
          {(['padrao', 'elegante', 'compacto'] as const).map((s) => (
            <button
              key={s}
              onClick={() => handleStyleChange(s)}
              className={`${styles.styleButton} ${styleChat === s ? styles.active : ''}`}
            >
              {styleChat === s && <Dot />}
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tamanho */}
      <div className={styles.section}>
        <label className={styles.label}>Tamanho do texto</label>
        <div className={styles.themeOptions}>
          {(['small', 'medium', 'large'] as const).map((size) => (
            <button
              key={size}
              onClick={() => handleFontSizeChange(size)}
              className={`${styles.themeButton} ${fontSize === size ? styles.active : ''}`}
            >
              {fontSize === size && <Dot />}
              {size === 'small' ? 'Pequeno' : size === 'medium' ? 'Médio' : 'Grande'}
            </button>
          ))}
        </div>
      </div>

      {/* Cores */}
      <div className={styles.section}>
        <label className={styles.label}>Cores de Fundo do Chat</label>
        <div className={styles.colorPickersContainer}>

          <div className={styles.colorPickerBox}>
            <span className={styles.colorSubLabel}>Fundo do Personagem</span>
            <div className={styles.colorInputWrapper}>
              <input type="color" value={botBg} onChange={handleBotBgChange} className={styles.colorInput} />
              <span className={styles.colorHex}>{botBg.toUpperCase()}</span>
            </div>
          </div>

          <div className={styles.colorPickerBox}>
            <span className={styles.colorSubLabel}>Seu Fundo</span>
            <div className={styles.colorInputWrapper}>
              <input type="color" value={userBg} onChange={handleUserBgChange} className={styles.colorInput} />
              <span className={styles.colorHex}>{userBg.toUpperCase()}</span>
            </div>
          </div>

          <button onClick={handleResetColors} className={styles.resetColorsButton} title="Resetar fundos padrão">
            ↺
            <span>Reset</span>
          </button>

        </div>
      </div>

      {/* Preview */}
      <div className={styles.section}>
        <label className={styles.label}>Visualização</label>
        <div className={styles.previewChatBox}>

          <div className={`${styles.previewMessage} ${styles.previewBot}`}>
            <div className={styles.previewBubble} style={{ background: botBg }}>
              Oi! Como ficou o visual?
            </div>
          </div>

          <div className={`${styles.previewMessage} ${styles.previewUser}`}>
            <div className={styles.previewBubble} style={{ background: userBg }}>
              Ficou ótimo!
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default TapsPreferencesTheme;