# PersonIA

Plataforma web para criar e conversar com personagens virtuais usando inteligência artificial.

[![Netlify Status](https://api.netlify.com/api/v1/badges/.../deploy-status)](https://app.netlify.com/sites/personia/deploys) <!-- Add actual badge if possible -->

🔗 Links

- 🌐 **Site**: [https://personia.netlify.app/](https://personia.netlify.app/)
- 🔧 **API Backend**: [https://github.com/richardmoraessouza/api-personia](https://github.com/richardmoraessouza/api-personia)

# PersonIA

Plataforma web para criar e conversar com personagens virtuais usando inteligência artificial.

[![Netlify Status](https://api.netlify.com/api/v1/badges/.../deploy-status)](https://app.netlify.com/sites/personia/deploys) <!-- Add actual badge if possible -->

🔗 Links

- 🌐 **Site**: [https://personia.netlify.app/](https://personia.netlify.app/)
- 🔧 **API Backend**: [https://github.com/richardmoraessouza/api-personia](https://github.com/richardmoraessouza/api-personia)

## 📖 Sobre o Projeto

PersonIA é uma plataforma de chat inteligente que permite aos usuários criar personagens virtuais personalizados e manter conversas naturais com eles usando tecnologia de inteligência artificial. Cada personagem possui sua própria personalidade, história e regras de comportamento, criando experiências de diálogo únicas e envolventes.

### 🎯 Objetivo

Tornar a interação com IA mais pessoal e acessível, permitindo que qualquer pessoa crie e compartilhe personagens virtuais para conversas, desde figuras históricas e celebridades até seres fictícios de universos imaginários.

## 🛠️ Tecnologias e Habilidades Demonstradas

Este projeto foi desenvolvido para demonstrar proficiência em tecnologias modernas de desenvolvimento web full-stack:

### Frontend Skills
- **React 19** com Hooks e Context API para gerenciamento de estado
- **TypeScript** para tipagem forte e melhor DX
- **Vite** para build otimizado e desenvolvimento rápido
- **Tailwind CSS** para design system consistente e responsivo
- **React Router** para navegação SPA
- **Axios** para integração com APIs REST
- **Google OAuth 2.0** para autenticação social

### Backend Skills (Integração)
- **RESTful APIs** com autenticação JWT
- **PostgreSQL** para persistência de dados
- **Integração com OpenAI API** para geração de respostas IA
- **Deploy em nuvem** (Render, Netlify)

### DevOps & Tools
- **Git** para controle de versão
- **ESLint** para qualidade de código
- **Netlify** para CI/CD e deploy automático
- **Environment Variables** para configuração segura

## 🎨 Design e UX

- **Interface Intuitiva**: Design focado na experiência do usuário
- **Responsividade**: Funciona perfeitamente em todos os dispositivos
- **Acessibilidade**: Considerações de usabilidade para todos os usuários
- **Performance**: Otimização de carregamento e interações

## 🚀 Desafios Técnicos e Soluções

Durante o desenvolvimento, enfrentei e resolvi diversos desafios técnicos:

- **Gerenciamento de Estado Complexo**: Implementação de Context API para autenticação global
- **Integração com IA**: Tratamento de respostas assíncronas da OpenAI API
- **Autenticação Segura**: Implementação de OAuth 2.0 com Google
- **Otimização de Performance**: Lazy loading e code splitting com Vite
- **Deploy Automático**: Configuração CI/CD com Netlify

## 📊 Impacto e Resultados

- **Personagens Criados**: Sistema que permite criação ilimitada de personagens
- **Conversas Geradas**: Integração real com IA para respostas dinâmicas
- **Código Open Source**: Disponível no GitHub para comunidade

## 🔮 Próximos Passos

- Implementação de internacionalização (i18n)
- Sistema de avaliações e comentários
- Integração com outras APIs de IA
- Analytics e métricas de uso

### Para Visitantes
- 🔍 **Explorar Personagens**: Navegue por uma galeria de personagens criados por outros usuários
- 💬 **Conversar Anonimamente**: Inicie chats com qualquer personagem disponível
- 👀 **Visualizar Perfis**: Veja detalhes completos dos personagens e seus criadores

### Para Usuários Registrados
- 🛠️ **Criação de Personagens**: 
  - **Personagens Personalizados**: Defina nome, gênero, descrição, foto, personalidade, comportamento, regras e história
  - **Personagens Fictícios**: Crie seres de ficção com obra de origem, personalidade e regras específicas
- ✏️ **Edição**: Modifique seus personagens a qualquer momento
- 👤 **Perfil Pessoal**: Gerencie seu perfil com foto, nome e descrição
- 📊 **Rede Social**: Sistema de seguidores e seguindo
- 💾 **Organização**: Salve e organize seus personagens favoritos

### 🛠️ Funcionalidades Técnicas
- 🔐 **Autenticação Segura**: Login via Google OAuth ou cadastro tradicional
- 📱 **Design Responsivo**: Interface otimizada para desktop, tablet e mobile
- ⚡ **Performance**: Carregamento rápido com Vite e otimização de assets
- 🌐 **Internacionalização**: Suporte para múltiplos idiomas (planejado)

## 🏗️ Arquitetura do Projeto

### Frontend
- **React 19** + **TypeScript**: Componentes modernos e tipagem forte
- **Vite**: Build tool ultra-rápido para desenvolvimento
- **React Router**: Navegação SPA
- **Axios**: Cliente HTTP para integração com API
- **Tailwind CSS**: Framework CSS utilitário para design responsivo
- **Google OAuth**: Autenticação social

### Backend
- **Node.js + Express**: API RESTful
- **PostgreSQL**: Banco de dados relacional hospedado no Neon
- **JWT**: Autenticação e autorização
- **OpenAI API**: Geração de respostas inteligentes
- **Hospedagem**: Render

### Deploy
- **Netlify**: Frontend com CI/CD automático
- **Render**: Backend com auto-scaling

## 📁 Estrutura do Projeto

```
PersonIA/
├── frontend/                    # Aplicação React
│   ├── public/
│   │   ├── _redirects          # Configurações SPA Netlify
│   │   └── image/              # Assets estáticos
│   ├── src/
│   │   ├── components/         # Componentes React
│   │   │   ├── AuthContext/    # Contexto de autenticação
│   │   │   ├── Authetication/  # Páginas de login/cadastro
│   │   │   ├── BloqueamentoLogin/    # Restrições para logados
│   │   │   ├── BloqueamentoNoLogin/  # Restrições para não logados
│   │   │   ├── Cadastra/       # Formulário de cadastro
│   │   │   ├── CriacaoPerson/  # Criação de personagens personalizados
│   │   │   ├── Entrar/         # Página de login
│   │   │   ├── Layout/         # Layout principal
│   │   │   ├── Menu/           # Menu lateral
│   │   │   ├── ModalSeguidores/ # Modal de seguidores
│   │   │   ├── NoLayout/       # Layout alternativo
│   │   │   ├── OutroPerfil/    # Visualização de outros perfis
│   │   │   ├── Perfil/         # Perfil do usuário
│   │   │   └── Person_Ficticio/ # Criação de personagens fictícios
│   │   ├── App.tsx             # Componente principal do chat
│   │   ├── main.tsx            # Ponto de entrada da aplicação
│   │   ├── types.ts            # Definições de tipos TypeScript
│   │   └── styles.css          # Estilos globais
│   ├── package.json
│   ├── vite.config.ts          # Configuração Vite
│   └── tailwind.config.js      # Configuração Tailwind
├── netlify.toml                # Configuração deploy Netlify
└── README.md
```

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn
- Conta Google (para OAuth, opcional para desenvolvimento)

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/richardmoraessouza/PersonIA.git
   cd PersonIA
   ```

2. **Instale as dependências do frontend**
   ```bash
   cd frontend
   npm install
   ```

3. **Configure variáveis de ambiente** (se necessário)
   - Crie um arquivo `.env` na pasta `frontend/` com:
     ```
     VITE_API_URL=https://api-personia.onrender.com
     VITE_GOOGLE_CLIENT_ID=your_google_client_id
     ```

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**
   - Abra [http://localhost:5173](http://localhost:5173) no navegador

### Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento com hot reload
npm run build    # Build otimizado para produção
npm run preview  # Preview do build local
npm run lint     # Verificação de código com ESLint
```

## 🤝 Como Contribuir

Contribuições são bem-vindas! Siga estes passos:

1. **Fork** o projeto
2. **Crie uma branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra um Pull Request**

### Diretrizes de Contribuição
- Mantenha o código limpo e bem documentado
- Adicione testes para novas funcionalidades
- Siga as convenções de nomenclatura existentes
- Atualize a documentação conforme necessário

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🌍 Contato

- 💼 [LinkedIn](https://www.linkedin.com/in/richard-moraes-souza-998539338/)
- 🌐 [Portfólio](https://richardmoraes.netlify.app/)
- 📱 [WhatsApp](https://wa.me/5547999326217?text=Olá%20Richard%2C%20encontrei%20seu%20perfil%20no%20GitHub!)
- 📧 richardmoraessouza2006@gmail.com

---

⭐ **Dê uma estrela se gostou do projeto!**
