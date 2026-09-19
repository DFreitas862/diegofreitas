# Agenda Pessoal - Versão 1

Sistema pessoal de cartões com Modo História, Agenda e Financeiro.

## Tecnologias
- HTML + CSS + JavaScript (puro)
- Supabase (Auth + Banco de dados)
- GitHub

## Como configurar

### 1. Crie um projeto no Supabase
- Acesse https://supabase.com
- Crie um novo projeto
- Vá em **Project Settings → API** e copie:
  - Project URL
  - `anon` `public` key

### 2. Cole as chaves
Abra o arquivo `js/supabase.js` e substitua:

```js
const SUPABASE_URL = 'COLE_SUA_URL_AQUI';
const SUPABASE_ANON_KEY = 'COLE_SUA_ANON_KEY_AQUI';
```

### 3. Crie as tabelas
No Supabase, vá em **SQL Editor** e execute:

```sql
-- Tabela principal de cartões
create table cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  parent_id uuid references cards(id),
  title text not null,
  description text,
  type text not null,
  status text default 'pendente',
  start_time timestamptz,
  end_time timestamptz,
  value numeric,
  order_number text,
  tags text[],
  color text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Fotos dos cartões (preparado para versão futura)
create table card_photos (
  id uuid primary key default gen_random_uuid(),
  card_id uuid references cards(id) on delete cascade,
  user_id uuid references auth.users not null,
  url text not null,
  created_at timestamptz default now()
);

-- Ativar RLS
alter table cards enable row level security;
alter table card_photos enable row level security;

-- Políticas de segurança
create policy "Users can manage own cards"
  on cards for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage own photos"
  on card_photos for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

### 4. Como rodar
- Você pode abrir o `login.html` direto no navegador
- Ou subir no GitHub Pages

## Funcionalidades da Versão 1
- Login / Cadastro
- Criar, editar e excluir cartões
- Cartões filhos
- Marcar como concluído
- Modo História (linha do tempo)
- Módulo Agenda
- Módulo Financeiro (com resumo do mês)
- Visão "Hoje"
- Busca
- Botão flutuante de novo cartão

## Próximas versões
- Módulo Pedido completo
- Mapa + localização
- Módulo Jogo
- Módulo Música
- Fotos nos cartões
- Cartões recorrentes
- Perguntas inteligentes
