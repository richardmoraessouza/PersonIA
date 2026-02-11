import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext/AuthContext";

const ProtectedRouter: React.FC = () => {
    const { estaLogado } = useAuth();

    if (estaLogado) {
        return <Outlet/>
    }

    return <Navigate to="/entrar" replace/>
}

export default ProtectedRouter