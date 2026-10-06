-- GM • Studio de Treinos — schema do Supabase (Postgres)
-- Como usar: Supabase → SQL Editor → New query → cole este arquivo → Run.
-- É seguro rodar mais de uma vez (idempotente).

create table if not exists public.students (
  id         text primary key,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.plans (
  id         text primary key,
  student_id text not null references public.students (id) on delete cascade,
  data       jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_plans_student_created
  on public.plans (student_id, created_at desc);

create table if not exists public.exercise_library (
  name    text primary key,
  display text not null
);

-- Segurança: RLS ligado e nenhuma policy criada. As chaves públicas (anon /
-- publishable) NÃO conseguem ler nem gravar nada. Só o servidor do app, usando
-- a SUPABASE_SERVICE_ROLE_KEY (que ignora RLS), acessa as tabelas.
alter table public.students         enable row level security;
alter table public.plans            enable row level security;
alter table public.exercise_library enable row level security;
