# SAM AI - Assistente de Inteligência Artificial

Uma aplicação ChatGPT-like completa desenvolvida com FastAPI (backend) e React (frontend), integrada com OpenAI GPT-4, containerizada com Docker para deploy fácil.

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
- **GPT-4** - Modelo de linguagem avançado
- **Histórico de conversas** - Persistência durante a sessão
- **Gerenciamento de contexto** - Mantém últimas 10 mensagens
- **Formatação de código** - Syntax highlighting e botões de cópia

### ✅ Branding Teddy Digital
- **Paleta de cores** - #EB6625 e #EA6323
- **Logo SAM AI** - Identidade visual consistente
- **Temas claro/escuro** - Compatibilidade total
- **Animações modernas** - Efeitos visuais profissionais

### ✅ Docker & Deploy
- **Containerização completa** - Docker para backend e frontend
- **Docker Compose** - Orquestração de serviços
- **Nginx** - Servidor web otimizado para produção
- **Multi-stage builds** - Imagens otimizadas

## 🏗️ Arquitetura

```
sam-ai-application/
├── chatgpt-auth-backend/     # FastAPI Backend
│   ├── app/
│   │   └── main.py          # Aplicação principal
│   ├── pyproject.toml       # Dependências Python
│   ├── Dockerfile           # Container backend
│   └── .env.example         # Variáveis de ambiente
├── chatgpt-auth-frontend/    # React Frontend
│   ├── src/
│   │   ├── App.tsx          # Componente principal
│   │   ├── components/      # Componentes React
│   │   └── index.css        # Estilos globais
│   ├── package.json         # Dependências Node.js
│   ├── Dockerfile           # Container frontend
│   ├── nginx.conf           # Configuração Nginx
│   └── .env.example         # Variáveis de ambiente
├── docker-compose.yml       # Orquestração de serviços
└── .env.example            # Configuração global
```

## 🛠️ Tecnologias Utilizadas

### Backend
- **FastAPI** - Framework web moderno e rápido
- **OpenAI API** - Integração com GPT-4
- **JWT** - Autenticação segura
- **SMTP** - Envio de emails (configurável)
- **CORS** - Configuração para frontend
- **Docker** - Containerização

### Frontend
- **React + TypeScript** - Interface moderna
- **Tailwind CSS** - Estilização utilitária
- **shadcn/ui** - Componentes de UI
- **Lucide React** - Ícones modernos
- **Vite** - Build tool otimizado
- **Nginx** - Servidor web de produção

## 🐳 Deploy com Docker (Recomendado)

### Pré-requisitos
- Docker e Docker Compose instalados
- Chave da OpenAI API

### 1. Clone o repositório
```bash
git clone https://github.com/svieira1985/gpt-webassist-sam.git
cd gpt-webassist-sam
```

### 2. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```env
# OpenAI Configuration
OPENAI_API_KEY=sua_chave_openai_aqui

# JWT Secret Key
SECRET_KEY=sua_chave_jwt_secreta_aqui

# SMTP Configuration (Opcional - para envio de emails)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=seu_email@gmail.com
SMTP_PASSWORD=sua_senha_app_gmail
```

### 3. Execute com Docker Compose
```bash
# Build e start dos serviços
docker-compose up --build

# Ou em background
docker-compose up --build -d
```

### 4. Acesse a aplicação
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Documentação API**: http://localhost:8000/docs

### 5. Parar os serviços
```bash
docker-compose down
```

## ⚙️ Desenvolvimento Local (Sem Docker)

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
   SECRET_KEY=sua_chave_jwt_secreta
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

### Opção 1: Docker (Recomendado)

1. **Configure o servidor de produção:**
   ```bash
   # Clone o repositório no servidor
   git clone https://github.com/svieira1985/gpt-webassist-sam.git
   cd gpt-webassist-sam
   
   # Configure as variáveis de ambiente
   cp .env.example .env
   # Edite .env com as configurações de produção
   
   # Execute em produção
   docker-compose up --build -d
   ```

2. **Configure proxy reverso (Nginx/Apache):**
   ```nginx
   server {
       listen 80;
       server_name seu-dominio.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
       
       location /api {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

### Opção 2: Deploy Separado

#### Backend (Fly.io/Railway/Heroku)
```bash
cd chatgpt-auth-backend
# Configure as variáveis de ambiente na plataforma
fly deploy  # ou railway deploy, etc.
```

#### Frontend (Vercel/Netlify)
```bash
cd chatgpt-auth-frontend
npm run build
# Deploy da pasta dist/
```

## 🐳 Comandos Docker Úteis

```bash
# Ver logs dos serviços
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild apenas um serviço
docker-compose up --build backend
docker-compose up --build frontend

# Executar comandos dentro dos containers
docker-compose exec backend bash
docker-compose exec frontend sh

# Limpar volumes e rebuild completo
docker-compose down -v
docker-compose up --build

# Ver status dos containers
docker-compose ps
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
