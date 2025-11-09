import React, { createContext, useState, useEffect, useContext, type ReactNode } from 'react';

// Tipo do Objeto de Dados que o Back-end retorna no LOGIN/EDIÇÃO
interface UserData {
    id: number;
    nome: string;
    gmail: string;
    foto_perfil?: string; 
    descricao?: string;
    token: string;
}

// Tipo do Contexto (O objeto que será exposto para os componentes)
interface AuthContextType {
    usuario: string | null;
    usuarioId: number | null;
    fotoPerfil: string | null;
    descricao: string | null;
    token: string | null;
    estaLogado: boolean;
    loading: boolean;
    login: (userData: UserData) => void;
    logout: () => void;
}

// Inicializamos o contexto com valores nulos e funções vazias
const initialContextValue: AuthContextType = {
    usuario: null,
    usuarioId: null,
    fotoPerfil: null,
    descricao: null, 
    token: null,
    estaLogado: false,
    loading: true,
    login: () => {},
    logout: () => {},
};

// --- CRIAÇÃO DO CONTEXTO ---
const AuthContext = createContext<AuthContextType>(initialContextValue);

// --- PROVIDER ---
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [usuario, setUsuario] = useState<string | null>(null);
    const [usuarioId, setUsuarioId] = useState<number | null>(null);
    const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
    const [descricao, setDescricao] = useState<string | null>(null); 
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // --- Inicializa estados a partir do localStorage ---
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedNome = localStorage.getItem('usuario_nome');
        const storedId = localStorage.getItem('usuario_id');
        const storedFoto = localStorage.getItem('usuario_foto');
        const storedDescricao = localStorage.getItem('usuario_descricao');

        const parsedId = storedId ? parseInt(storedId, 10) : null;

        if (storedToken && storedNome && parsedId) {
            setToken(storedToken);
            setUsuario(storedNome);
            setUsuarioId(parsedId);
            setFotoPerfil(storedFoto);
            setDescricao(storedDescricao);
        }

        setLoading(false); // carregamento finalizado
    }, []);

    // --- Função de login ---
    const login = (userData: UserData) => {
        localStorage.setItem('token', userData.token);
        localStorage.setItem('usuario_nome', userData.nome);
        localStorage.setItem('usuario_id', userData.id.toString());
        localStorage.setItem('usuario_foto', userData.foto_perfil || '');
        localStorage.setItem('usuario_descricao', userData.descricao || '');

        setToken(userData.token);
        setUsuario(userData.nome);
        setUsuarioId(userData.id);
        setFotoPerfil(userData.foto_perfil || null);
        setDescricao(userData.descricao || null);
    };

    // --- Função de logout ---
    const logout = () => {
        localStorage.clear();
        sessionStorage.clear();

        setToken(null);
        setUsuario(null);
        setUsuarioId(null);
        setFotoPerfil(null);
        setDescricao(null);

        window.location.href = '/';
    };

    const contextValue: AuthContextType = {
        usuario,
        usuarioId,
        fotoPerfil,
        descricao,
        token,
        estaLogado: !!usuarioId,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
