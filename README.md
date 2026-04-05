# 📨 CRUD de Mensagens — Frontend (React + N8N + Supabase)
<img width="725" height="432" alt="image" src="https://github.com/user-attachments/assets/7f2c9de9-0105-45fd-97ae-3d03b2f8a5ef" />
<img width="706" height="540" alt="image" src="https://github.com/user-attachments/assets/ec5ef3dd-46f4-4167-8eef-01c1528b6744" />
<img width="713" height="930" alt="image" src="https://github.com/user-attachments/assets/7d67ee1c-7d84-4530-8a23-80e31fd51870" />

Uma aplicação frontend que consome uma API **RESTful do n8n** (com Supabase como banco de dados).  

---

## 🚀 Tecnologias Utilizadas

- ⚛️ **React + Vite + TypeScript**
- 🎯 **React Query** — gerenciamento de dados assíncronos
- 🧩 **Zod** — validação de payloads e formulários
- 🔐 **JWT Auth** — autenticação de login
- 🧪 **Jest + React Testing Library** — testes unitários e de integração
- 🗄️ **Supabase** — banco de dados Postgres
- ⚙️ **n8n** — automação e backend sem servidor

---

## 🧰 Pré-requisitos

- Node.js **v18+**
- npm **v9+**
- Um endpoint do **n8n** com fluxos configurados para CRUD (GET/POST/PATCH/DELETE)
- Supabase configurado com a tabela `messages`

---

## ⚙️ Setup

### 1️⃣ Instalação de dependências
```bash
npm install
```

### 2️⃣ Variáveis de ambiente
Crie um arquivo .env na raiz do projeto com
```json
VITE_API_BASE_URL=http:"https://automation-n8n.zwlu6z.easypanel.host/webhook"
VITE_API_KEY="crud_msgs_token"
VITE_JWT_STORAGE_KEY="crud_msgs_token"
```

### 3️⃣ Rodar o frontend
```bash
npm run dev
```

### 🧪 Testes Automatizados
```bash
npm test
```

#### Os testes cobrem:
✅ Renderização da lista de mensagens com dados mockados
📨 Criação de nova mensagem (formulário → API)
🚫 Tratamento de erro do servidor (problemas RFC 7807)

### Requisições Postman
https://www.postman.com/digital-2277/crud-mensagens-teste/request/xvy4sdu/auth-login?action=share&creator=29030235

```bash
GET    /messages
GET    /messages?id={id}
POST   /messages
PATCH  /messages?id={id}
DELETE /messages?id={id}
POST   /auth/login
POST   /auth/register
```

### N8N
Arquivo /n8n.json -> Fluxo do N8N que está sendo utilizado para o backend
