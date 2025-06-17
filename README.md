# SAM AI - Assistente de Inteligência Artificial

Uma aplicação ChatGPT-like completa desenvolvida com FastAPI (backend) e React (frontend), integrada com OpenAI GPT-3.5-turbo.

## 🚀 Funcionalidades

### ✅ Sistema de Autenticação
- **Registro restrito ao domínio @teddydigital.io**
- **Login sem senha** - Sistema baseado em token por email
- **Tokens temporários** com expiração de 15 minutos
- **JWT seguro** para autenticação de sessões

### ✅ Interface ChatGPT
- **Design idêntico ao ChatGPT** - Interface moderna e intuitiva
- **Sidebar com histórico** - Navegação entre conversas
- **Chat em tempo real** - Integração completa com OpenAI
- **Área de input responsiva** - Textarea que expande automaticamente
- **Timestamps e formatação** - UI/UX profissional

### ✅ Integração OpenAI
- **GPT-3.5-turbo** - Modelo de linguagem avançado
- **Histórico de conversas** - Persistência durante a sessão
- **Gerenciamento de contexto** - Mantém últimas 10 mensagens
- **Formatação de código** - Syntax highlighting e botões de cópia

### ✅ Branding Teddy Digital
- **Paleta de cores** - #EB6625 e #EA6323
- **Logo SAM AI** - Identidade visual consistente
- **Temas claro/escuro** - Compatibilidade total
- **Animações modernas** - Efeitos visuais profissionais

## 🏗️ Arquitetura

```
sam-ai-application/
├── chatgpt-auth-backend/     # FastAPI Backend
│   ├── app/
│   │   └── main.py          # Aplicação principal
│   ├── pyproject.toml       # Dependências Python
│   └── .env.example         # Variáveis de ambiente
└── chatgpt-auth-frontend/    # React Frontend
    ├── src/
    │   ├── App.tsx          # Componente principal
    │   ├── components/      # Componentes React
    │   └── index.css        # Estilos globais
    ├── package.json         # Dependências Node.js
    └── .env.example         # Variáveis de ambiente
```

## 🛠️ Tecnologias Utilizadas

### Backend
- **FastAPI** - Framework web moderno e rápido
- **OpenAI API** - Integração com GPT-3.5-turbo
- **JWT** - Autenticação segura
- **SMTP** - Envio de emails (configurável)
- **CORS** - Configuração para frontend

### Frontend
- **React + TypeScript** - Interface moderna
- **Tailwind CSS** - Estilização utilitária
- **shadcn/ui** - Componentes de UI
- **Lucide React** - Ícones modernos
- **Vite** - Build tool otimizado

## ⚙️ Configuração e Instalação

### Pré-requisitos
- Node.js 18+ e npm/yarn/pnpm
- Python 3.12+ e Poetry
- Chave da OpenAI API

### Backend (FastAPI)

1. **Navegue para o diretório do backend:**
   ```bash
   cd chatgpt-auth-backend
   ```

2. **Instale as dependências:**
   ```bash
   poetry install
   ```

3. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env`:
   ```env
   OPENAI_API_KEY=sua_chave_openai_aqui
   JWT_SECRET_KEY=sua_chave_jwt_secreta
   SMTP_USERNAME=seu_email_smtp (opcional)
   SMTP_PASSWORD=sua_senha_smtp (opcional)
   SMTP_SERVER=smtp.gmail.com (opcional)
   SMTP_PORT=587 (opcional)
   ```

4. **Execute o servidor:**
   ```bash
   poetry run fastapi dev app/main.py
   ```

   O backend estará disponível em: http://localhost:8000

### Frontend (React)

1. **Navegue para o diretório do frontend:**
   ```bash
   cd chatgpt-auth-frontend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env`:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. **Execute o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

   O frontend estará disponível em: http://localhost:5173

## 🚀 Deploy em Produção

### Backend (Fly.io)
```bash
cd chatgpt-auth-backend
# Configure as variáveis de ambiente no Fly.io
fly deploy
```

### Frontend (Vercel/Netlify)
```bash
cd chatgpt-auth-frontend
npm run build
# Deploy da pasta dist/
```

## 📋 Como Usar

1. **Acesse a aplicação** no navegador
2. **Clique em "Começar agora"** na página inicial
3. **Digite seu email @teddydigital.io** para registro
4. **Aguarde o token** (em desenvolvimento, aparece nos logs do servidor)
5. **Faça login** com o token recebido
6. **Comece a conversar** com a IA!

## 🔒 Segurança

- **Domínio restrito** - Apenas emails @teddydigital.io
- **Tokens temporários** - Expiração automática em 15 minutos
- **JWT seguro** - Autenticação baseada em Bearer tokens
- **CORS configurado** - Acesso controlado entre frontend e backend
- **Variáveis de ambiente** - Chaves protegidas

## 🎨 Personalização

### Cores Teddy Digital
```css
:root {
  --primary: #EB6625;
  --secondary: #EA6323;
}
```

### Logo
- Substitua `/public/sam-logo.png` pelo logo desejado
- Mantenha proporção retangular (mais largo que alto)

## 📝 Endpoints da API

### Autenticação
- `POST /register` - Registro de usuário
- `POST /login` - Login com token
- `GET /me` - Informações do usuário

### Chat
- `POST /chat` - Enviar mensagem
- `GET /conversations` - Listar conversas
- `GET /conversations/{id}` - Carregar conversa
- `DELETE /conversations/{id}` - Deletar conversa

## 🐛 Troubleshooting

### Backend não inicia
- Verifique se a chave OpenAI está configurada
- Confirme se o Poetry está instalado
- Execute `poetry install` novamente

### Frontend não conecta
- Verifique se o backend está rodando
- Confirme a URL da API no `.env`
- Verifique as configurações de CORS

### Emails não chegam
- Configure as credenciais SMTP no backend
- Em desenvolvimento, tokens aparecem nos logs
- Para produção, use Gmail App Passwords

## 📄 Licença

Desenvolvido pela **Teddy Digital** - Todos os direitos reservados.

## 🤝 Contribuição

Este projeto foi desenvolvido pelo **Devin AI** para a **Teddy Digital**.

Para suporte técnico, entre em contato com: flavio.vieira@teddydigital.io

---

**🚀 SAM AI - Seu assistente de inteligência artificial**
