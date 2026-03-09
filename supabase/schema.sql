create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nombre text not null,
  empresa text,
  correo text not null,
  telefono text not null,
  tipo text not null,
  mensaje text not null,
  source text not null default 'web_form',
  page_url text,
  user_agent text,
  ip_address text,
  status text not null default 'nuevo'
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);
