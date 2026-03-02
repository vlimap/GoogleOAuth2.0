# Livraria Monolítica com Handlebars

Projeto monolítico de uma livraria fictícia com CRUD completo de livros, desenvolvido com **Node.js**, **Express** e **Handlebars**.

## Dados fictícios do projeto

- **Nome da empresa:** Universo dos Livros Livraria Ltda.
- **Site:** https://www.seudominio.tech
- **E-mail:** contato@seudominio.tech
- **Telefone:** +55 (11) 3000-1234
- **Endereço:** Rua dos Autores, 321 - São Paulo/SP

## Objetivo

Disponibilizar um sistema web simples para:

- Listar livros
- Cadastrar novos livros
- Visualizar detalhes de um livro
- Editar livro
- Excluir livro

## Stack utilizada

- Node.js
- Express
- Express Handlebars
- method-override
- CSS puro

## Estrutura do projeto

```text
src/
  app.js
  data/
    books.store.js
  routes/
    books.routes.js
  public/
    styles.css
  views/
    layouts/main.hbs
    books/index.hbs
    books/form.hbs
    books/show.hbs
    404.hbs
```

## Modelo de dados (em memória)

Os dados são mantidos em memória dentro de `src/data/books.store.js`.

Exemplo de objeto livro:

```json
{
  "id": 1,
  "title": "Dom Casmurro",
  "author": "Machado de Assis",
  "genre": "Romance",
  "price": 39.9,
  "stock": 12,
  "createdAt": "2026-03-01T20:00:00.000Z"
}
```

> Observação: por ser em memória, os dados são reiniciados a cada restart/deploy.

## Rotas principais

- `GET /livros` → lista livros
- `GET /livros/novo` → formulário de cadastro
- `POST /livros` → cria livro
- `GET /livros/:id` → detalhes do livro
- `GET /livros/:id/editar` → formulário de edição
- `PUT /livros/:id` → atualiza livro
- `DELETE /livros/:id` → remove livro

## Como executar localmente

### 1) Pré-requisitos

- Node.js 18+
- npm 9+

### 2) Instalar dependências

```bash
npm install
```

### 3) Executar em desenvolvimento

```bash
npm run dev
```

### 4) Executar em modo produção local

```bash
npm start
```

Aplicação disponível em `http://localhost:3000/livros`.

---

## Passo a passo correto para publicação na Vercel

### Opção A (recomendada): via GitHub

1. Suba o projeto para um repositório no GitHub.
2. Acesse https://vercel.com e clique em **Add New Project**.
3. Importe o repositório.
4. Em **Framework Preset**, selecione **Other**.
5. Em **Build and Output Settings**, mantenha padrão (Node server).
6. Clique em **Deploy**.
7. Após o deploy, valide a URL gerada pela Vercel.

### Opção B: via CLI da Vercel

1. Instale a CLI:

```bash
npm i -g vercel
```

2. Faça login:

```bash
vercel login
```

3. Na raiz do projeto, execute:

```bash
vercel
```

4. Para produção:

```bash
vercel --prod
```

---

## Passo a passo para domínio personalizado (.tech)

1. No projeto da Vercel, acesse **Settings > Domains**.
2. Adicione:
  - `seudominio.tech`
  - `www.seudominio.tech`
3. No provedor de DNS, crie/ajuste os registros:
  - Tipo **A**, Host **@**, valor conforme exibido pela Vercel
  - Tipo **CNAME**, Host **www**, valor conforme exibido pela Vercel
4. Remova registros conflitantes de `www` (A/CNAME antigos).
5. Aguarde propagação DNS e clique em **Refresh** na Vercel.
6. Confirme acesso em: https://www.seudominio.tech/livros

## Boas práticas de publicação

- Usar domínio canônico único (`www` ou raiz).
- Habilitar redirecionamento para evitar conteúdo duplicado.
- Não versionar `.env` e arquivos sensíveis.
- Validar links/rotas após cada deploy.
- Monitorar logs de execução no painel da Vercel.

## Próximos passos sugeridos

- Persistir dados em banco (PostgreSQL/MySQL/MongoDB).
- Adicionar validação de formulário no backend.
- Implementar autenticação para área administrativa.
- Criar testes de integração para rotas CRUD.

## Licença

Uso educacional e demonstrativo.
