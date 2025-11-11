import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import { AuthProvider } from "./components/AuthContext/AuthContext.tsx";
import App from "./App";
import NoLayout from "./components/NoLayout/NoLayout.tsx";
import Layout from "./components/Layout/Layout";
import Cadastra from "./components/Cadastra/Cadastra";
import Entrar from "./components/Entrar/Entrar.tsx";
import Perfil from "./components/Perfil/Perfil.tsx";
import ProtectedRouter from "./components/BloqueamentoNoLogin/BloqueamentoNoLogin.tsx";
import CriacaoPerson from "./components/CriacaoPerson/CriacaoPerson.tsx";
import PublicRoute from "./components/BloqueamentoLogin/BloqueamentoLogin.tsx";
import OutroPerfil from "./components/OutroPerfil/OutroPerfil.tsx";

const router = createBrowserRouter([
  // Rotas com layout principal
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        element: <ProtectedRouter />,
        children: [
          {
            path: "/perfil/:usuario_id",
            element: <Perfil />,
          },
          {
            path: "/criacao-person",
            element: <CriacaoPerson />,
          },
          {
            path: "/OutroPerfil/:id",
            element: <OutroPerfil />,
          },
        ],
      },
      // Rota do personagem (App) pode ficar acessível sem proteção
      {
        path: "personagem/:id",
        element: <App />,
      },
    ],
  },
  // Rotas sem layout (públicas)
  {
    element: <NoLayout />,
    children: [
      {
        index: true,
        element: <App />, // Home
      },
      {
        element: <PublicRoute />,
        children: [
          {
            path: "/cadastra",
            element: <Cadastra />,
          },
          {
            path: "/entrar",
            element: <Entrar />,
          },
        ],
      },
    ],
  },
]);


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
