# PersonIA

**Plataforma web full-stack para criação e conversa com personagens virtuais usando inteligência artificial.**

gi---

## Índice

- [Visão geral](#-visão-geral)
- [Links e deploy](#-links-e-deploy)
- [Stack tecnológica](#-stack-tecnológica)
- [Arquitetura e fluxo de dados](#-arquitetura-e-fluxo-de-dados)
- [Funcionalidades](#-funcionalidades)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Como rodar localmente](#-como-rodar-localmente)
- [Decisões técnicas e desafios](#-decisões-técnicas-e-desafios)
- [Contato](#-contato)

---

## 📌 Visão geral

O **PersonIA** é um produto completo (frontend + integração com API) que permite:

- **Criar personagens** (reais ou fictícios) com nome, foto, personalidade, regras e história.
- **Conversar** com qualquer personagem via chat em tempo real, com respostas geradas por IA.
- **Explorar** personagens de outros usuários, favoritar, dar like e buscar por nome.
- **Gerenciar perfil**, rede social (seguidores/seguindo) e personagens próprios.

O frontend foi desenvolvido em **React 19 + TypeScript**, com **Vite**, **React Router 7** e **Tailwind CSS**, seguindo boas práticas de componentização, estado global (Context API), rotas protegidas e integração REST com JWT e OAuth (Google).

---

## 🔗 Links e deploy

| Ambiente | URL |
|----------|-----|
| **Aplicação (frontend)** | [https://personia.netlify.app/](https://personia.netlify.app/) |
| **API (backend)** | Repositório: [api-personia](https://github.com/richardmoraessouza/api-personia) |

- **Frontend:** Netlify (CI/CD a partir do repositório).
- **Backend:** hospedado em nuvem (ex.: Render), consumido via `VITE_API_URL`.

---

## 🛠 Stack tecnológica

### Frontend (este repositório)

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **React** | 19.x | UI, hooks, componentes funcionais |
| **TypeScript** | 4.9 | Tipagem estática e interfaces |
| **Vite** | 7.x | Build, dev server, HMR |
| **React Router** | 7.x | SPA, rotas aninhadas, `useParams` / `useNavigate` |
| **Axios** | 1.x | Cliente HTTP para a API REST |
| **Tailwind CSS** | 3.x | Estilos utilitários e responsividade |
| **@react-oauth/google** | 0.12.x | Login com Google OAuth 2.0 |
| **jwt-decode** | 4.x | Decodificação de JWT no cliente |
| **ESLint** | 8.x | Linting e padrão de código |

### Integração com backend

- **API REST** com autenticação **JWT** (Bearer token).
- **Google OAuth** para login social.
- Endpoints utilizados: autenticação, CRUD de personagens, chat com IA, likes, favoritos, perfis, busca, etc.

### Ferramentas e ambiente

- **Git** para versionamento.
- **Netlify** para build (`npm run build`), deploy e redirects SPA.
- **Variáveis de ambiente** (`VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID`) para configuração segura.

---

## 🏗 Arquitetura e fluxo de dados

### Rotas (React Router)

- **Layout principal (`/`):** Explorar, Procurar, Perfil, Criar/Editar personagem, Outro perfil. Rotas protegidas onde aplicável.
- **Sem layout (NoLayout):** `/personagem/:id` (chat), `/entrar`, `/cadastra`.  
- **Proteção:** componentes como `ProtectedRouter` e `PublicRoute` controlam acesso conforme autenticação.

### Estado e dados

- **AuthContext:** usuário logado, `usuarioId`, `token`, `estaLogado`, logout. Consumido em toda a aplicação.
- **Serviços (`personagemService.ts`):** funções assíncronas para API (buscar personagens, likes, favoritos, nome do criador, toggle like/favorito, etc.).
- **Hooks customizados:** ex.: `usePersonagensUsuario` (Explorar) para listar personagens, likes e favoritos com estado local.
- **Estado local por tela:** resultados de busca (PersonagemPesquisado), lista de favoritos no Menu, chat e personagem atual no App.

### Fluxo do chat

1. Usuário acessa `/personagem/:id` (por link, menu de favoritos ou card).
2. `App.tsx` lê `id` com `useParams()`, busca o personagem na API (`GET /personagens/:id`) e exibe o perfil + histórico.
3. Mensagens são enviadas com `POST /chat/:personagemId`; a resposta da IA é exibida no histórico.
4. Troca de personagem (ex.: pelo menu) atualiza a URL e o mesmo `App` reage ao novo `id`, refaz a busca e limpa o histórico.

---

## ✨ Funcionalidades

### Visitantes (não logados)

- Explorar personagens na galeria (Explorar).
- Buscar personagens por nome (Campo de pesquisa → PersonagemPesquisado).
- Abrir e conversar com qualquer personagem em `/personagem/:id`.
- Ver perfil do personagem (bio, criador) no modal.
- Ao tentar like/favorito, redirecionamento para login.

### Usuários autenticados

- Tudo acima +
- **Criar personagem** (pessoal ou fictício): nome, gênero, foto, bio, personalidade, comportamento, regras, história, figurinhas.
- **Editar** personagens próprios a partir do perfil.
- **Perfil:** foto, nome, descrição; lista de personagens criados; seguidores e seguindo (ModalSeguidores).
- **Favoritos:** favoritar/desfavoritar personagens; lista de favoritos no **Menu** (sidebar); ao clicar, navega para o chat do personagem (menu permanece aberto).
- **Likes:** curtir/descurtir; contagem de likes por personagem; estado persistido após refresh (via API).
- **Nome do criador:** exibido em cards (Explorar e PersonagemPesquisado), com fallbacks e chamada à API quando necessário.

### Detalhes de UX/UI

- Menu lateral com favoritos e busca interna; troca de personagem sem fechar o menu.
- Navegação por cards (Explorar, Procurar) para `/personagem/:id` com estado quando útil.
- Layout responsivo (Tailwind + CSS modules onde aplicável).
- Feedback visual de loading, erros e estados vazios.

---

## 📁 Estrutura do projeto

```
PersonIA/
├── frontend/
│   ├── public/
│   │   ├── _redirects          # SPA: todas as rotas → index.html (Netlify)
│   │   └── image/              # Imagens estáticas (logo, placeholder, etc.)
│   ├── src/
│   │   ├── components/         # Componentes reutilizáveis e de layout
│   │   │   ├── BloqueamentoLogin/     # Redireciona logado (ex.: não ver /entrar)
│   │   │   ├── BloqueamentoNoLogin/   # Exige login (ex.: perfil, criar personagem)
│   │   │   ├── Cadastra/              # Formulário de cadastro
│   │   │   ├── CampoDePesquisar/       # Busca por nome → navega para /procurar
│   │   │   ├── CardUsuario/            # Card de personagem no perfil (editar/chat)
│   │   │   ├── Entrar/                 # Login (email/senha + Google OAuth)
│   │   │   ├── Layout/                 # Layout com <Outlet /> (Explorar, Perfil, etc.)
│   │   │   ├── Menu/                   # Sidebar: favoritos, links, conta
│   │   │   ├── ModalSeguidores/        # Modal seguidores/seguindo
│   │   │   ├── NoLayout/               # Layout sem sidebar (chat, login, cadastro)
│   │   │   └── ...
│   │   ├── config/
│   │   │   └── api.ts                  # API_URL (env ou default)
│   │   ├── hooks/
│   │   │   ├── AuthContext/            # Provider de autenticação global
│   │   │   └── UserPerson/             # usePersonagensUsuario (Explorar)
│   │   ├── page/                       # Páginas por rota
│   │   │   ├── CriacaoPerson/          # Criar/editar personagem (pessoal)
│   │   │   ├── Explorar/                # Galeria de personagens
│   │   │   ├── OutroPerfil/             # Perfil de outro usuário
│   │   │   ├── Perfil/                  # Meu perfil
│   │   │   ├── Person_Ficticio/        # Criar/editar personagem fictício
│   │   │   └── PersonagemPesquisado/   # Resultados da busca
│   │   ├── services/
│   │   │   └── personagemService.ts    # Chamadas à API (personagens, likes, favoritos, etc.)
│   │   ├── utils/
│   │   │   └── CorverteImagem/         # Utilitário para conversão de imagem (base64, etc.)
│   │   ├── App.tsx                     # Tela do chat (/personagem/:id)
│   │   ├── main.tsx                    # createRoot, RouterProvider, AuthProvider
│   │   ├── types.ts                    # Tipos/interfaces globais
│   │   └── index.css / styles.css      # Estilos globais
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.*.json
├── netlify.toml                        # Build: frontend, publish: dist, redirects SPA
└── README.md
```

---

## 🚀 Como rodar localmente

### Pré-requisitos

- **Node.js** 18+
- **npm** (ou yarn/pnpm)
- Opcional: conta Google para OAuth (e `VITE_GOOGLE_CLIENT_ID`)

### Passos

1. **Clonar e entrar na pasta do frontend**
   ```bash
   git clone https://github.com/richardmoraessouza/PersonIA.git
   cd PersonIA/frontend
   ```

2. **Instalar dependências**
   ```bash
   npm install
   ```

3. **Variáveis de ambiente**  
   Crie `frontend/.env` (ou `.env.local`):
   ```env
   VITE_API_URL=https://api-personia.onrender.com
   VITE_GOOGLE_CLIENT_ID=seu_google_client_id
   ```
   Sem `VITE_API_URL`, o código usa o default (ex.: mesma API em produção). Sem `VITE_GOOGLE_CLIENT_ID`, o login com Google não funciona.

4. **Subir o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```
   Acesse **http://localhost:5173** (ou a porta indicada no terminal).

### Scripts úteis

| Comando | Descrição |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento (Vite, HMR) |
| `npm run build` | Build de produção (saída em `dist/`) |
| `npm run preview` | Servir o build localmente |
| `npm run lint` | ESLint no código |

### Possíveis problemas

- **API inacessível:** confira `VITE_API_URL` e se o backend está no ar (ex.: Render pode “acordar” lento).
- **Login Google não abre:** verifique `VITE_GOOGLE_CLIENT_ID` e origens autorizadas no console do Google Cloud.
- **Rotas quebram ao dar F5:** o `netlify.toml` já configura redirect SPA; em outro host, configure “todas as rotas → index.html”.

---

## 🧩 Decisões técnicas e desafios

- **Fonte da verdade do personagem no chat:** o ID vem da URL (`useParams()`). A busca do personagem e o envio das mensagens usam esse `id`, evitando race condition ao trocar de personagem pelo menu.
- **Likes e favoritos persistentes:** estado do usuário (likes/favoritos) é carregado ao logar e ao abrir listas (ex.: PersonagemPesquisado); toggles chamam a API e atualizam o estado local (otimisticamente, com rollback em erro).
- **Nome do criador:** a API pode devolver o nome em formatos diferentes; no frontend há tratamento (string, objeto `nome`/`name`, aninhado) no serviço e fallbacks na UI para evitar sempre “IA” ou “Desconhecido”.
- **Rotas protegidas:** componentes de rota que checam autenticação e redirecionam (ex.: para `/entrar`) mantêm a lógica centralizada e reutilizável.
- **Menu e navegação:** uso de `Link` para favoritos no menu garante que a troca de personagem seja uma navegação real (URL atualiza e o App reage ao novo `id`); o menu pode permanecer aberto após o clique.

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Ver [LICENSE](LICENSE) para detalhes.

---

## 🌍 Contato

- **LinkedIn:** [Richard Moraes Souza](https://www.linkedin.com/in/richard-moraes-souza-998539338/)
- **Portfólio:** [richardmoraes.netlify.app](https://richardmoraes.netlify.app/)
- **WhatsApp:** [5547999326217](https://wa.me/5547999326217?text=Olá%20Richard%2C%20encontrei%20seu%20perfil%20no%20GitHub!)
- **E-mail:** richardmoraessouza2006@gmail.com

---

**Se este README foi útil para você (recrutador ou desenvolvedor), considere dar uma estrela no repositório.**
