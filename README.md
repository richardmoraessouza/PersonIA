# PersonIA

Plataforma web para criar e conversar com personagens virtuais usando inteligência artificial.

🔗 Links

- 🌐 **Site**: [https://personia.netlify.app/](https://personia.netlify.app/)
- 🔧 **API Backend**: [https://github.com/richardmoraessouza/api-personia](https://github.com/richardmoraessouza/api-personia)

## O que é?

PersonIA é um site onde você pode:
- **Criar personagens** com personalidade, história e aparência próprias
- **Conversar com personagens** através de um chat inteligente
- **Explorar personagens** criados por outros usuários
- **Gerenciar seu perfil** e seus personagens

## O que faz?

### Para Visitantes
- Ver todos os personagens disponíveis
- Conversar com qualquer personagem
- Visualizar perfis e informações dos personagens

### Para Usuários Logados
- Criar seus próprios personagens (personalizados ou fictícios)
- Editar personagens criados
- Gerenciar perfil (nome, foto, descrição)
- Ver seguidores e quem você segue
- Salvar e organizar seus personagens

## Funcionalidades Principais

- ✨ **Criação de Personagens**: Defina nome, foto, personalidade, história e regras de comportamento
- 💬 **Chat Inteligente**: Converse com personagens que respondem baseado em sua personalidade
- 👤 **Perfis de Usuário**: Sistema de perfis com seguidores e seguindo
- 🔐 **Autenticação**: Login via Google OAuth ou cadastro tradicional
- 📱 **Design Responsivo**: Funciona em desktop, tablet e mobile

## Tecnologias Utilizadas

### Frontend
- **React** + **TypeScript** - Interface do usuário
- **Vite** - Build tool
- **React Router** - Navegação
- **Axios** - Requisições HTTP
- **Tailwind CSS** - Estilização
- **Google OAuth** - Autenticação

### Backend
- API hospedada no Render
- Node.js + Express
- PostgreSQL hospedado no Neon
- api OpenAi
- 🔗 [Repositório da API](https://github.com/richardmoraessouza/api-personia)

### Deploy
- **Netlify** - Frontend
- **Render** - Backend

## Como Rodar Localmente

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/PersonIA.git
cd PersonIA
```

2. Instale as dependências
```bash
cd frontend
npm install
```

3. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

4. Acesse `http://localhost:5173`

## Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run preview  # Preview do build
npm run lint     # Verificar código
```

## Estrutura do Projeto

```
PersonIA/
├── frontend/           # Aplicação React
│   ├── src/
│   │   ├── components/ # Componentes React
│   │   ├── App.tsx     # Componente principal do chat
│   │   └── main.tsx    # Ponto de entrada
│   └── package.json
├── netlify.toml        # Configuração de deploy
└── README.md
```

## 🌍 Contato

- 💼 [LinkedIn](https://www.linkedin.com/in/richard-moraes-souza-998539338/)
- 🌐 [Portfólio](https://richardmoraes.netlify.app/)
- 📱 [WhatsApp](https://wa.me/5547999326217?text=Olá%20Richard%2C%20encontrei%20seu%20perfil%20no%20GitHub!)
- 📧 richardmoraessouza2006@gmail.com
