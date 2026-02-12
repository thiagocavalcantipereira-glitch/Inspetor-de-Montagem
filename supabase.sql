create extension if not exists pgcrypto;

create table if not exists lotes (
  id uuid primary key default gen_random_uuid(),
  invoice varchar(50) not null,
  modelo varchar(100) not null,
  quantidade integer not null check (quantidade >= 0),
  status varchar(30) default 'Pendente',
  data_importacao timestamp with time zone default now()
);
create unique index if not exists lotes_invoice_uk on lotes(invoice);

create table if not exists motos (
  id uuid primary key default gen_random_uuid(),
  lote_id uuid references lotes(id) on delete cascade,
  chassi varchar(100) unique not null,
  modelo varchar(100),
  status_inspecao varchar(30) default 'Nao Iniciada',
  status_nacionalizacao varchar(30) default 'Pendente',
  data_nacionalizacao timestamp with time zone
);
create index if not exists motos_lote_idx on motos(lote_id);

create table if not exists inspecoes_offline_inbox (
  id uuid primary key,
  moto_id uuid not null references motos(id) on delete cascade,
  started_at timestamp with time zone,
  finished_at timestamp with time zone,
  status varchar(30),
  tempo_total_segundos integer,
  payload jsonb,
  received_at timestamp with time zone default now()
);

alter table lotes enable row level security;
alter table motos enable row level security;
alter table inspecoes_offline_inbox enable row level security;

drop policy if exists "auth read lotes" on lotes;
create policy "auth read lotes" on lotes for select to authenticated using (true);
drop policy if exists "auth write lotes" on lotes;
create policy "auth write lotes" on lotes for insert to authenticated with check (true);
drop policy if exists "auth update lotes" on lotes;
create policy "auth update lotes" on lotes for update to authenticated using (true) with check (true);

drop policy if exists "auth read motos" on motos;
create policy "auth read motos" on motos for select to authenticated using (true);
drop policy if exists "auth write motos" on motos;
create policy "auth write motos" on motos for insert to authenticated with check (true);
drop policy if exists "auth update motos" on motos;
create policy "auth update motos" on motos for update to authenticated using (true) with check (true);

drop policy if exists "auth read inbox" on inspecoes_offline_inbox;
create policy "auth read inbox" on inspecoes_offline_inbox for select to authenticated using (true);
drop policy if exists "auth write inbox" on inspecoes_offline_inbox;
create policy "auth write inbox" on inspecoes_offline_inbox for insert to authenticated with check (true);
