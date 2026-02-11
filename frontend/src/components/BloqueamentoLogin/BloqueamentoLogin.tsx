import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext/AuthContext";

const PublicRoute = () => {
  const { estaLogado, loading } = useAuth();
 
  if (loading) return null;

  if (estaLogado) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default PublicRoute;
