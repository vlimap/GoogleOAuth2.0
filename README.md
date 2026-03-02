# Projeto didático Fullstack: React + Express + PostgreSQL + Firebase Google Auth

Este repositório foi pensado para **aula/laboratório**: um exemplo simples, porém completo, de autenticação com Google no frontend e validação segura do token no backend.

## Objetivo pedagógico

Ao final do setup, o aluno consegue:
- autenticar com Google usando Firebase no frontend;
- enviar o `idToken` para o backend;
- validar token com Firebase Admin SDK;
- criar/atualizar usuário no PostgreSQL via Sequelize;
- entender a diferença entre **credenciais do app web** (frontend) e **Service Account** (backend).

---

## Stack usada

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Banco:** PostgreSQL
- **ORM:** Sequelize (`define`) + migrations
- **Auth:** Firebase Authentication (Google Provider)
- **Validação de token no server:** Firebase Admin SDK

---

## Estrutura de pastas

```bash
handlesbar/
├─ backend/
│  ├─ config/
│  │  └─ config.js
│  ├─ migrations/
│  │  └─ 20260302000100-create-users.js
│  ├─ models/
│  │  ├─ index.js
│  │  └─ user.js
│  └─ src/
│     ├─ config/firebaseAdmin.js
│     ├─ middleware/authMiddleware.js
│     ├─ routes/authRoutes.js
│     └─ server.js
├─ frontend/
│  ├─ src/
│  │  ├─ services/api.js
│  │  ├─ services/firebase.js
│  │  └─ App.jsx
│  └─ .env.example
└─ README.md
```

---

## Pré-requisitos

- Node.js 20+
- npm 10+
- PostgreSQL instalado e rodando
- Conta Google para login
- Projeto Firebase criado

---

## Conceito importante: existem 2 tipos de credenciais

### 1) Credenciais do App Web (frontend)
Usadas no navegador em `frontend/.env`:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

### 2) Credenciais da Service Account (backend)
Usadas no servidor em `backend/.env`:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

> As credenciais da Service Account vêm do arquivo JSON baixado em **Firebase > Project settings > Service accounts > Generate new private key**.

---

## Setup Firebase (passo a passo)

## 1. Criar projeto no Firebase
1. Acesse [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Clique em **Add project** e finalize.

## 2. Habilitar login Google
1. Vá em **Authentication** > **Sign-in method**
2. Ative o provider **Google**.

## 3. Criar app Web (frontend)
1. Na home do projeto, clique em **Add app** > **Web**
2. Copie as credenciais exibidas no snippet.
3. Use esses valores no arquivo `frontend/.env`.

## 4. Baixar Service Account (backend)
1. Vá em **Project settings** > **Service accounts**
2. Clique em **Generate new private key**
3. Salve o JSON em local seguro (não subir para o Git).

### Mapeamento do JSON para `.env` do backend

Se o JSON contém:

```json
{
  "project_id": "meu-projeto",
  "client_email": "firebase-adminsdk-xxxx@meu-projeto.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\nABC...\n-----END PRIVATE KEY-----\n"
}
```

Então no `backend/.env` fica:

```env
FIREBASE_PROJECT_ID=meu-projeto
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxx@meu-projeto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nABC...\n-----END PRIVATE KEY-----\n"
```

> Sim, são exatamente essas variáveis. A ideia é: você **não usa o JSON diretamente no código** neste projeto; você extrai os campos para variáveis de ambiente.

---

## Configuração do backend

No diretório `backend`:

## 1. Criar `.env`

Linux/macOS:
```bash
cp .env.example .env
```

Windows PowerShell:
```powershell
Copy-Item .env.example .env
```

## 2. Preencher `backend/.env`

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=handlesbar_db
DB_NAME_TEST=handlesbar_test_db
DB_SSL=false

# Service Account Firebase Admin SDK
FIREBASE_PROJECT_ID=seu-projeto-firebase
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@seu-projeto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_AQUI\n-----END PRIVATE KEY-----\n"
```

## 3. Criar banco no PostgreSQL

```sql
CREATE DATABASE handlesbar_db;
CREATE DATABASE handlesbar_test_db;
```

## 4. Rodar migration

```bash
npm run db:migrate
```

Essa migration cria a tabela `users`.

## 5. Subir backend

```bash
npm run dev
```

Endpoints principais:
- `GET /api/health`
- `POST /api/auth/google`
- `GET /api/auth/me`

---

## Configuração do frontend

No diretório `frontend`:

## 1. Criar `.env`

Linux/macOS:
```bash
cp .env.example .env
```

Windows PowerShell:
```powershell
Copy-Item .env.example .env
```

## 2. Preencher `frontend/.env`

```env
VITE_API_URL=http://localhost:3000/api

VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000000000000:web:xxxxxxxxxxxxxxxx
```

## 3. Subir frontend

```bash
npm run dev
```

Abra a URL mostrada no terminal (geralmente `http://localhost:5173`).

---

## Fluxo completo do Google Auth (didático)

### Visão narrativa
1. Usuário clica em **Entrar com Google** no frontend.
2. Firebase abre popup e autentica o usuário.
3. Frontend recebe usuário autenticado e pede `idToken`.
4. Frontend chama `POST /api/auth/google` com `Authorization: Bearer <idToken>`.
5. Middleware do backend valida token com `admin.auth().verifyIdToken(...)`.
6. Se válido, backend usa `uid/email/name/picture` do token.
7. Backend faz `findOrCreate` no PostgreSQL (Sequelize).
8. Backend retorna usuário persistido.
9. Frontend exibe dados do usuário na tela.

### Fluxo em diagrama (sequência)

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend (React)
    participant FA as Firebase Auth
    participant B as Backend (Express)
    participant FAS as Firebase Admin SDK
    participant DB as PostgreSQL

    U->>F: Clica em Entrar com Google
    F->>FA: signInWithPopup(GoogleProvider)
    FA-->>F: Usuário autenticado + idToken
    F->>B: POST /api/auth/google (Bearer idToken)
    B->>FAS: verifyIdToken(idToken)
    FAS-->>B: Token válido + claims (uid, email...)
    B->>DB: findOrCreate / update usuário
    DB-->>B: Usuário persistido
    B-->>F: 200 + dados do usuário
    F-->>U: Exibe perfil logado
```

---

## Sequelize: define + migration (o que observar em aula)

- O model usa `sequelize.define(...)` em `backend/models/user.js`.
- A migration cria a estrutura da tabela em `backend/migrations/...-create-users.js`.
- Esse padrão separa:
  - **Model:** comportamento/validação da entidade no código.
  - **Migration:** histórico versionado da estrutura do banco.

---

## Scripts úteis

### Backend

```bash
npm run dev              # sobe com nodemon
npm run start            # sobe sem nodemon
npm run db:migrate       # aplica migrations
npm run db:migrate:undo  # desfaz última migration
npm run db:create        # tenta criar DB com sequelize-cli
```

### Frontend

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

---

## Checklist rápido de execução em sala

1. Configurar Firebase (Google provider + app web + service account)
2. Preencher `backend/.env`
3. Preencher `frontend/.env`
4. Criar DB no Postgres
5. Rodar `npm run db:migrate` no backend
6. Subir backend (`npm run dev`)
7. Subir frontend (`npm run dev`)
8. Testar login e validar registro na tabela `users`

---

## Troubleshooting (erros comuns)

### Erro: `Token inválido`
- Verifique se o frontend está enviando `Authorization: Bearer <idToken>`.
- Verifique se `FIREBASE_PROJECT_ID` do backend é do mesmo projeto do frontend.

### Erro de `private key`
- Confirme que `FIREBASE_PRIVATE_KEY` está com `\n` e entre aspas.
- Não remover `-----BEGIN PRIVATE KEY-----` e `-----END PRIVATE KEY-----`.

### Erro de conexão com Postgres
- Validar `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
- Confirmar serviço PostgreSQL ativo.

### Migration não executa
- Conferir se o banco `handlesbar_db` foi criado.
- Rodar comando dentro da pasta `backend`.

---

## Segurança (boas práticas)

- Nunca subir `.env` no Git.
- Nunca compartilhar o JSON da Service Account em sala/grupo.
- Em produção, restringir CORS e usar HTTPS.
- Tratar logs sem expor token/chaves.

---

## Próximos passos sugeridos para evolução

- Criar rota protegida de exemplo (`/api/private`).
- Adicionar autorização por perfil (`student`, `teacher`, `admin`).
- Criar refresh de sessão no frontend.
- Adicionar testes automatizados (API e fluxo de login).
