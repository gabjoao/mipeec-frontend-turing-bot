# Mipeec — Teste de Turing aplicado com postagens de redes sociais

Esse projeto foi apresentado na nona edição da MIPEEC realizada no IFPR - Campus União da Vitória como projeto de pesquisa.
É um protótipo da aplicação geral que está sendo realizada como trabalho de conclusão de curso.

Jogo da imitação onde o usuário recebe uma postagem em texto e precisa decidir se ela foi escrita por uma pessoa real ou gerada por IA.

Stack: Next.js 16.3.4 (App Router) · React 19 · Tailwind CSS v4 · TypeScript 5 · Prisma 6 (SQLite).

## Como funciona

1. Ao carregar a página, o app sorteia uma postagem aleatória da tabela `postagens` via Server Action `getNextPost()`.
2. O usuário escolhe entre **IA** e **REAL**.
3. O app compara a escolha com `post.origin` (mapeado do campo `origem` do banco: `modelo_ia` → `ia`, demais → `real`), exibe feedback e revela a verdade no botão "A postagem era IA/Real · Continuar".
4. Ao clicar em Continuar, uma nova postagem é sorteada.

Estados da UI (`lib/types.ts`): `loading` → `answering` → `answered` (ou `error` com botão "Tentar novamente").

## Arquitetura

```
Browser (app/page.tsx — Client Component)
  │  importa Server Action
  ▼
lib/posts.ts — getNextPost()  ("use server")
  │
  ▼
lib/db.ts — getRandomPost() / getPostById() / getPostCount()
  │  PrismaClient singleton (globalThis.__mipeecPrisma em dev)
  ▼
SQLite — tabela `postagens` (Prisma)
```

- **Camada de dados isolada:** `lib/db.ts` expõe apenas a tabela `postagens`. A tabela `postagens_candidatas` (ingestão/curadoria) nunca é acessada pelo frontend.
- **Sorteio:** `count()` + `skip = floor(random * count)` + `findMany({ take: 1, orderBy: { id: "asc" } })`.
- **Tipos:** `Origin = "ia" | "real"`, `Post { id, author, handle, text, origin }`, `Feedback`, `Status` em `lib/types.ts`.

## Estrutura de arquivos

```
.
├── app/
│   ├── page.tsx       # Tela principal (Client), state machine e orquestração
│   ├── layout.tsx     # Root layout, metadata "IA ou Real?", lang pt-BR, fonts Geist
│   └── globals.css    # Tema escuro, gradientes radiais, prefers-reduced-motion
├── components/
│   ├── PostCard.tsx       # Avatar placeholder, autor, handle, texto
│   ├── ChoiceButtons.tsx  # Botões IA/REAL + variantes idle/correct/wrong/dim
│   └── FeedbackBanner.tsx # Mensagem acerto/erro + botão Continuar
├── lib/
│   ├── db.ts     # Prisma singleton, mapeamento origem → Origin, acesso a postagens
│   ├── posts.ts  # Server Action getNextPost()
│   └── types.ts  # Tipos compartilhados
├── prisma/
│   └── schema.prisma  # Datasource SQLite + models postagens/postagens_candidatas
├── public/            # Assets estáticos
├── next.config.ts
├── tsconfig.json      # alias @/* → ./*
└── eslint.config.mjs
```

## Pré-requisitos

- Node.js 20+
- npm (ou yarn/pnpm/bun — scripts são `next dev/build/start`)
- Acesso ao banco SQLite do projeto [turing-bot](https://github.com/gabjoao/turing-bot) (`bd/database.db`) — este projeto **não** inclui um banco próprio.

## Como rodar

### 1. Clonar os dois repositórios

```bash
git clone https://github.com/gabjoao/turing-bot.git
git clone https://github.com/gabjoao/mipeec-frontend-turing-bot
```

> `turing-bot` precisa estar clonado porque o `DATABASE_URL` padrão aponta para `turing-bot/bd/database.db`. Veja o próximo passo para ajustar o caminho.

### 2. Instalar dependências

```bash
cd mipeec
npm install
```

### 3. Configurar variável de ambiente

Crie um arquivo `.env` na raiz (ele é ignorado pelo `.gitignore`):

```env
DATABASE_URL="file:/caminho/absoluto/para/turing-bot/bd/database.db"
```

Exemplo se os dois repos estão lado a lado:

```env
DATABASE_URL="file:/home/seu-usuario/code/turing-bot/bd/database.db"
```

### 4. Gerar o Prisma Client

```bash
npx prisma generate
```

> Não é necessário `prisma migrate`/`db push` porque o banco já existe no `turing-bot` e o schema é só leitura para este frontend. Se o banco estiver vazio, `getRandomPost()` lança `Nenhuma postagem encontrada em 'postagens'`.

### 5. Rodar em desenvolvimento

```bash
npm run dev
```

Abra <http://localhost:3000>.

### Outros scripts

| Comando         | Descrição                               |
| --------------- | --------------------------------------- |
| `npm run dev`   | Servidor de desenvolvimento (Turbopack) |
| `npm run build` | Build de produção                       |
| `npm start`     | Serve o build (`next start`)            |
| `npm run lint`  | ESLint (config `eslint-config-next`)    |

## Banco de dados

`prisma/schema.prisma`:

- `datasource db` — `provider = "sqlite"`, `url = env("DATABASE_URL")`
- `model postagens` — `id`, `texto`, `origem` (`bluesky`/`mastodon`/`modelo_ia`), `engajamento`, `artificial`, `candidata_id` (FK opcional para `postagens_candidatas`)
- `model postagens_candidatas` — dados brutos de ingestão (plataforma, texto bruto/anonimizado, métricas, flags de revisão). Não consumida pelo frontend.
