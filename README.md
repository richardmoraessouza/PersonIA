# PersonIA

<div align="center">

![PersonIA](frontend/public/image/PersonIA.png)

**Uma plataforma web inovadora para criação e interação com personagens virtuais através de inteligência artificial**

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/personia/deploys)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[🔗 Acesse o Site](https://personia.netlify.app/) • [📖 Documentação](#documentação) • [🚀 Começando](#instalação-e-configuração)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação e Configuração](#instalação-e-configuração)
- [Como Usar](#como-usar)
- [Rotas e Navegação](#rotas-e-navegação)
- [Sistema de Autenticação](#sistema-de-autenticação)
- [API e Backend](#api-e-backend)
- [Deploy](#deploy)
- [Desenvolvimento](#desenvolvimento)
- [Contribuindo](#contribuindo)
- [Licença](#licença)
- [Contato](#contato)

---

## 🎯 Sobre o Projeto

**PersonIA** é uma plataforma web completa que permite aos usuários criar, personalizar e interagir com personagens virtuais através de um sistema de chat inteligente. A plataforma oferece uma experiência imersiva onde cada personagem possui personalidade única, história própria e regras de interação personalizadas, gerando respostas contextuais e realistas através de inteligência artificial.

### Principais Características

- ✨ **Criação Personalizada**: Crie personagens únicos com aparência, personalidade e história próprias
- 💬 **Chat Inteligente**: Interaja com personagens através de um sistema de chat que gera respostas baseadas na personalidade definida
- 👥 **Rede Social**: Sistema de perfis, seguidores e seguindo
- 🔐 **Autenticação Segura**: Login via Google OAuth com gerenciamento de sessão
- 📱 **Design Responsivo**: Interface adaptada para desktop, tablet e mobile
- 🎨 **Interface Moderna**: UI/UX intuitiva com Tailwind CSS e CSS Modules

---

## ⚡ Funcionalidades

### 🎭 Criação de Personagens

#### Personagens Personalizados (`/criacao-person`)
- **Campos de Personalização:**
  - Nome do personagem
  - Gênero
  - Foto de perfil (upload de imagem em Base64)
  - Descrição breve
  - Personalidade detalhada
  - Comportamento
  - História/Background
  - Regras de interação
  - Estilo de comunicação
  - Tipo de personagem (person/fictício)

#### Personagens Fictícios (`/person-ficticio`)
- **Campos Específicos:**
  - Nome do personagem
  - Foto de perfil
  - Descrição
  - Personalidade
  - História
  - Regras de interação
  - Feitos e conquistas
  - Obra de origem (livro, filme, série, etc.)
  - Tipo: fictício

### 💬 Sistema de Chat

- **Funcionalidades:**
  - Chat em tempo real com personagens
  - Histórico de conversas
  - Indicador de digitação
  - Scroll automático para novas mensagens
  - Suporte para usuários logados e visitantes (modo anônimo)
  - Respostas contextuais baseadas na personalidade do personagem
  - Tratamento de erros com mensagens amigáveis

### 👤 Perfis de Usuário

- **Funcionalidades do Perfil:**
  - Visualização do próprio perfil (`/perfil/:usuario_id`)
  - Visualização de outros perfis (`/OutroPerfil/:id`)
  - Edição de perfil (nome, foto, descrição)
  - Lista de personagens criados pelo usuário
  - Sistema de seguidores e seguindo
  - Modal de seguidores/seguindo com navegação
  - Edição de personagens criados

### 🔐 Autenticação

- **Sistema de Login:**
  - Autenticação via Google OAuth
  - Cadastro de novos usuários
  - Login de usuários existentes
  - Gerenciamento de sessão com localStorage
  - Tokens JWT para autenticação de API
  - Proteção de rotas (públicas e privadas)
  - Logout com limpeza de dados

### 🎨 Interface e Navegação

- **Menu Lateral:**
  - Lista de todos os personagens disponíveis
  - Navegação rápida entre personagens
  - Acesso a criação de personagens
  - Informações da conta do usuário
  - Links para login/cadastro (usuários não logados)
  - Menu responsivo e colapsável

- **Layout Responsivo:**
  - Design adaptativo para diferentes tamanhos de tela
  - Menu lateral retrátil
  - Componentes modais para informações adicionais
  - Animações suaves e transições

---

## 🛠️ Tecnologias Utilizadas

### Frontend

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **React** | ^19.1.1 | Biblioteca principal para construção da UI |
| **TypeScript** | 4.9 | Tipagem estática e maior segurança de código |
| **Vite** | ^7.1.7 | Build tool e dev server ultra-rápido |
| **React Router DOM** | ^7.9.4 | Roteamento e navegação SPA |
| **Axios** | ^1.13.2 | Cliente HTTP para requisições à API |
| **Tailwind CSS** | ^3.4.18 | Framework CSS utility-first |
| **CSS Modules** | - | Estilização modular e componentizada |
| **@react-oauth/google** | ^0.12.2 | Integração com Google OAuth |
| **jwt-decode** | ^4.0.0 | Decodificação de tokens JWT |

### Ferramentas de Desenvolvimento

| Ferramenta | Versão | Uso |
|------------|--------|-----|
| **ESLint** | ^8.57.1 | Linter para qualidade de código |
| **TypeScript ESLint** | ^8.45.0 | Regras ESLint para TypeScript |
| **PostCSS** | ^8.5.6 | Processamento de CSS |
| **Autoprefixer** | ^10.4.21 | Prefixos CSS automáticos |

### Backend (API Externa)

- **Node.js** - Ambiente de execução
- **Express** - Framework web
- **Render** - Plataforma de hospedagem da API
- **Base URL**: `https://api-personia.onrender.com`

### Deploy e Hospedagem

- **Netlify** - Hospedagem do frontend
- **Render** - Hospedagem da API backend

---

## 📁 Estrutura do Projeto

```
PersonIA/
│
├── frontend/                    # Aplicação React
│   ├── public/                  # Arquivos estáticos
│   │   ├── image/              # Imagens públicas
│   │   └── _redirects          # Configuração de redirects Netlify
│   │
│   ├── src/                     # Código fonte
│   │   ├── components/          # Componentes React
│   │   │   ├── AuthContext/    # Context API para autenticação
│   │   │   ├── Authetication/  # Componente de login/cadastro
│   │   │   ├── BloqueamentoLogin/      # Proteção de rotas (usuários logados)
│   │   │   ├── BloqueamentoNoLogin/    # Proteção de rotas (usuários não logados)
│   │   │   ├── Cadastra/       # Página de cadastro
│   │   │   ├── CriacaoPerson/   # Criação de personagens personalizados
│   │   │   ├── Entrar/         # Página de login
│   │   │   ├── Layout/         # Layout principal com menu
│   │   │   ├── Menu/           # Menu lateral de navegação
│   │   │   ├── ModalSeguidores/ # Modal de seguidores/seguindo
│   │   │   ├── NoLayout/       # Layout sem menu (páginas públicas)
│   │   │   ├── OutroPerfil/    # Visualização de outros perfis
│   │   │   ├── Perfil/         # Página de perfil do usuário
│   │   │   └── Person_Ficticio/ # Criação de personagens fictícios
│   │   │
│   │   ├── App.tsx             # Componente principal do chat
│   │   ├── main.tsx            # Ponto de entrada da aplicação
│   │   ├── types.ts            # Definições de tipos TypeScript
│   │   ├── index.css           # Estilos globais
│   │   ├── styles.css          # Estilos adicionais
│   │   └── input.css           # Estilos Tailwind
│   │
│   ├── dist/                   # Build de produção
│   ├── node_modules/           # Dependências
│   ├── package.json            # Dependências e scripts
│   ├── vite.config.ts          # Configuração do Vite
│   ├── tailwind.config.js      # Configuração do Tailwind
│   ├── tsconfig.json           # Configuração TypeScript
│   └── eslint.config.js        # Configuração ESLint
│
├── netlify.toml                # Configuração de deploy Netlify
└── README.md                   # Este arquivo
```

### Componentes Principais

#### `App.tsx`
Componente principal que gerencia o chat com personagens:
- Estado do chat e histórico de mensagens
- Seleção de personagem
- Envio de mensagens
- Modal de perfil do personagem
- Integração com API de chat

#### `AuthContext.tsx`
Context API para gerenciamento global de autenticação:
- Estado do usuário logado
- Token de autenticação
- Funções de login/logout
- Persistência no localStorage

#### `Menu.tsx`
Menu lateral de navegação:
- Lista de personagens disponíveis
- Links de navegação
- Informações da conta
- Controle de abertura/fechamento

#### `CriacaoPerson.tsx` e `Person_Ficticio.tsx`
Formulários de criação de personagens:
- Validação de dados
- Upload de imagens (Base64)
- Modo de edição
- Integração com API

#### `Perfil.tsx`
Página de perfil do usuário:
- Visualização de dados
- Edição de perfil
- Lista de personagens criados
- Sistema de seguidores/seguindo

---

## 🚀 Instalação e Configuração

### Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- Conta no Google Cloud Console (para OAuth)
- Acesso à API backend (ou configuração local)

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/PersonIA.git
cd PersonIA
```

2. **Instale as dependências**
```bash
cd frontend
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na pasta `frontend/` (se necessário):
```env
VITE_API_URL=https://api-personia.onrender.com
VITE_GOOGLE_CLIENT_ID=seu-client-id-aqui
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

5. **Acesse a aplicação**
```
http://localhost:5173
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Cria build de produção na pasta dist/

# Preview
npm run preview      # Preview do build de produção

# Linting
npm run lint         # Executa ESLint para verificar código
```

---

## 📖 Como Usar

### Para Visitantes (Não Logados)

1. **Acesse a plataforma**: Navegue até [https://personia.netlify.app/](https://personia.netlify.app/)
2. **Explore personagens**: Use o menu lateral para ver todos os personagens disponíveis
3. **Converse com personagens**: Clique em um personagem e comece a conversar
4. **Visualize perfis**: Clique no perfil do personagem para ver mais informações

### Para Usuários Logados

1. **Cadastro/Login**:
   - Clique em "Cadastrar" ou "Entrar" no menu
   - Use o botão "Login com Google" para autenticação rápida
   - Ou preencha o formulário manualmente

2. **Criar Personagem**:
   - Acesse "Criar personagem" no menu
   - Escolha entre "Personagem Personalizado" ou "Personagem Fictício"
   - Preencha todos os campos:
     - **Nome**: Nome do personagem (sem caracteres especiais)
     - **Foto**: Upload de imagem (PNG ou JPEG)
     - **Descrição**: Breve descrição do personagem
     - **Personalidade**: Traços de personalidade detalhados
     - **História**: Background e história do personagem
     - **Regras**: Regras de interação e comportamento
   - Clique em "Criar" para salvar

3. **Editar Personagem**:
   - Acesse seu perfil
   - Encontre o personagem na lista
   - Clique em "Editar"
   - Modifique os campos desejados
   - Salve as alterações

4. **Gerenciar Perfil**:
   - Acesse seu perfil através do menu
   - Clique em "Editar Perfil"
   - Atualize nome, foto e descrição
   - Visualize seus seguidores e quem você segue

5. **Interagir com Personagens**:
   - Selecione um personagem no menu
   - Digite sua mensagem no campo de chat
   - Pressione Enter ou clique no botão de enviar
   - O personagem responderá baseado em sua personalidade

---

## 🗺️ Rotas e Navegação

### Rotas Públicas (Sem Autenticação)

| Rota | Componente | Descrição |
|------|------------|-----------|
| `/` | `App` | Página inicial com chat (acessível a todos) |
| `/personagem/:id` | `App` | Chat com personagem específico |
| `/cadastra` | `Cadastra` | Página de cadastro (redireciona se logado) |
| `/entrar` | `Entrar` | Página de login (redireciona se logado) |

### Rotas Protegidas (Requer Autenticação)

| Rota | Componente | Descrição |
|------|------------|-----------|
| `/perfil/:usuario_id` | `Perfil` | Perfil do usuário logado |
| `/criacao-person` | `CriacaoPerson` | Criação de personagem personalizado |
| `/person-ficticio` | `Person_Ficticio` | Criação de personagem fictício |
| `/OutroPerfil/:id` | `OutroPerfil` | Visualização de outro perfil |

### Proteção de Rotas

- **`BloqueamentoLogin`**: Impede acesso de usuários logados (ex: `/cadastra`, `/entrar`)
- **`BloqueamentoNoLogin`**: Impede acesso de usuários não logados (ex: `/perfil`, `/criacao-person`)

---

## 🔐 Sistema de Autenticação

### Fluxo de Autenticação

1. **Cadastro**:
   - Usuário preenche nome e email (ou usa Google OAuth)
   - Opcionalmente faz upload de foto de perfil
   - Sistema cria conta e redireciona para login

2. **Login**:
   - Usuário informa email (ou usa Google OAuth)
   - Sistema valida credenciais
   - Retorna token JWT e dados do usuário
   - Dados são salvos no localStorage

3. **Persistência**:
   - Token e dados do usuário são armazenados no localStorage
   - AuthContext verifica dados ao carregar a aplicação
   - Sessão persiste entre recarregamentos da página

4. **Logout**:
   - Limpa localStorage e sessionStorage
   - Remove dados do contexto
   - Redireciona para página inicial

### Google OAuth

- Integração com `@react-oauth/google`
- Client ID configurado no `main.tsx`
- Token JWT decodificado com `jwt-decode`
- Email extraído do token para autenticação

### Tokens e Segurança

- Tokens JWT armazenados no localStorage
- Tokens enviados no header `Authorization: Bearer <token>`
- Validação de token no backend
- Expiração de sessão tratada pelo backend

---

## 🌐 API e Backend

### Endpoints Principais

#### Autenticação
- `POST /cadastra` - Cadastro de novo usuário
- `POST /entrar` - Login de usuário
- `PUT /editar/:id` - Edição de perfil

#### Personagens
- `GET /personagens` - Lista todos os personagens
- `GET /personagens/:id` - Dados de um personagem específico
- `POST /criacao` - Criação de novo personagem
- `PUT /editarPerson/:id` - Edição de personagem
- `GET /dadosPersonagem/:id` - Dados completos de um personagem
- `GET /buscarPerson/:usuario_id` - Personagens de um usuário

#### Chat
- `POST /chat/:personId` - Enviar mensagem e receber resposta

#### Usuários
- `GET /usuario/:id` - Dados de um usuário
- `GET /nomeCriador/:id` - Nome do criador de um personagem
- `GET /seguidores/:id` - Lista de seguidores
- `GET /seguindo/:id` - Lista de seguindo

### Formato de Requisições

#### Criar Personagem
```json
{
  "nome": "Nome do Personagem",
  "fotoia": "data:image/png;base64,...",
  "descricao": "Descrição do personagem",
  "personalidade": "Traços de personalidade",
  "historia": "História do personagem",
  "regras": "Regras de interação",
  "tipo_personagem": "person" | "ficcional"
}
```

#### Enviar Mensagem no Chat
```json
{
  "message": "Mensagem do usuário",
  "userId": 123,  // Opcional (se logado)
  "anonId": "uuid"  // Opcional (se não logado)
}
```

### Resposta do Chat
```json
{
  "reply": "Resposta do personagem baseada na IA"
}
```

---

## 🚢 Deploy

### Deploy no Netlify

O projeto está configurado para deploy automático no Netlify:

1. **Configuração** (`netlify.toml`):
```toml
[build]
  base = "frontend"   
  publish = "dist"
  command = "npm ci && npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. **Processo de Deploy**:
   - Conecte o repositório ao Netlify
   - Configure o diretório base como `frontend`
   - O Netlify executará `npm ci && npm run build`
   - Publicará a pasta `dist/`
   - Configurará redirects para SPA

3. **Variáveis de Ambiente** (se necessário):
   - Configure no painel do Netlify
   - Variáveis acessíveis via `import.meta.env.VITE_*`

### Build de Produção

```bash
cd frontend
npm run build
```

O build será gerado em `frontend/dist/` e pode ser servido por qualquer servidor estático.

---

## 💻 Desenvolvimento

### Estrutura de Componentes

Os componentes seguem uma estrutura modular:
- Cada componente em sua própria pasta
- Arquivo principal `.tsx` com a lógica
- Arquivo `.module.css` para estilos (quando aplicável)
- Uso de CSS Modules para evitar conflitos de nomes

### Padrões de Código

- **TypeScript**: Tipagem forte em todos os componentes
- **Hooks**: Uso de hooks do React (useState, useEffect, useContext)
- **Async/Await**: Para requisições assíncronas
- **Error Handling**: Try/catch em todas as chamadas de API
- **Validação**: Validação de formulários antes do envio

### Estilização

- **Tailwind CSS**: Classes utilitárias para estilização rápida
- **CSS Modules**: Estilos específicos de componentes
- **Responsive Design**: Mobile-first approach
- **Animações**: Transições suaves e indicadores de loading

### Melhorias Futuras

- [ ] Modo escuro/claro
- [ ] Sistema de favoritos
- [ ] Histórico de conversas salvo


---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Contribuição

- Siga os padrões de código existentes
- Adicione comentários quando necessário
- Teste suas mudanças localmente
- Atualize a documentação se necessário

---

## 📞 Contato

**Richard Moraes Souza**

- 💼 [LinkedIn](https://www.linkedin.com/in/richard-moraes-souza-998539338/)
- 🌐 [Portfólio](https://richardmoraes.netlify.app/)
- 📱 [WhatsApp](https://wa.me/5547999326217?text=Olá%20Richard%2C%20encontrei%20seu%20perfil%20no%20GitHub!)
- 📧 richardmoraessouza2006@gmail.com

---

<div align="center">

**Desenvolvido com ❤️ por Richard Moraes Souza**

⭐ Se este projeto foi útil para você, considere dar uma estrela!

</div>
