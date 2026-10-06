# GM • Studio de Treinos

Aplicativo mobile first para Gleybson Moura: cadastro de alunos, histórico de fichas, editor guiado em quatro etapas, biblioteca de exercícios anteriores e exportação de PDF A4.

## Fluxo

1. Cadastre nome, objetivo, gênero, idade opcional e data de início.
2. Crie uma ficha; adicione treinos e exercícios com séries, cadência e observação.
3. Vincule os treinos aos dias da semana, inclusive repetindo o mesmo treino.
4. Distribua faixas de repetições e intervalos por semana e finalize.
5. Exporte o PDF com a capa original e páginas internas com os fundos aprovados.

Rascunhos são salvos explicitamente. Saída com alterações pendentes pede confirmação. A cópia de uma ficha inicia um novo rascunho. A exclusão de um aluno remove suas fichas mediante confirmação. A biblioteca mantém os nomes usados mesmo depois de uma ficha ser removida.

## Persistência e acesso

Os dados ficam no Supabase (Postgres): alunos, fichas e nomes de exercícios. A ficha preserva um retrato dos dados do aluno; editar o cadastro não altera fichas anteriores. Nenhum registro real é inserido na instalação.

O acesso é protegido por uma senha única (`APP_PASSWORD`). Sem entrar em `/login`, páginas redirecionam e a API responde 401. O banco tem RLS ligado e sem policies: só o servidor, com a `SUPABASE_SERVICE_ROLE_KEY`, lê e grava. Nunca use essa chave no navegador.

## PDF

`lib/pdf.ts` monta o documento com jsPDF. Capa e fundos em `public/art`; textos selecionáveis com fontes embutidas em `public/fonts`. Novas páginas e cabeçalhos de tabela são incluídos conforme o conteúdo. Mais de oito semanas são divididas em blocos para manter a leitura. A diagramação dinâmica reproduz a identidade aprovada e adapta posições à quantidade de conteúdo.

## Desenvolvimento

1. No Supabase, abra SQL Editor e execute `supabase/schema.sql`.
2. Preencha `.env.local` (modelo em `.env.example`): `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (Project Settings → API), `APP_PASSWORD` e `SESSION_SECRET` (`openssl rand -base64 32`).
3. `npm install` e `npm run dev` (http://localhost:3000). Scripts: `dev`, `build`, `start`, `lint`.

Rota: `app/api/studio/route.ts`; validação compartilhada em `lib/model.ts`; `lib/storage.ts` cria o client do Supabase; `lib/session.ts` e `proxy.ts` cuidam da senha.

## Deploy na Vercel

Importe o projeto e cadastre em Settings → Environment Variables as quatro variáveis do `.env.local`. O build padrão (`next build`) já funciona.
