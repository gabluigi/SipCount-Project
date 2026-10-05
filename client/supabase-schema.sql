-- SipCount — Supabase schema
--
-- Run this once in the Supabase SQL Editor on a fresh project to recreate
-- every table, index, Row Level Security policy, and the built-in preset
-- seed data this app expects.
--
-- This file contains no secrets: no connection strings, API keys, or
-- credentials — only table structure, access rules, and generic seed data.
-- It is safe to commit and publish alongside the rest of the repository.

-- ---------- entries ----------
-- volume_ml was added after the table already existed in production, via a
-- separate `ALTER TABLE entries ADD COLUMN volume_ml NUMERIC;` statement.
-- It is folded directly into the table definition here so a fresh setup
-- only needs to run this file once.
create table if not exists entries (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  name text not null,
  size text,
  volume_ml numeric,
  abv numeric,
  calories integer not null,
  note text,
  created_at timestamptz default now()
);

create index if not exists entries_date_idx on entries (date);

-- ---------- presets ----------
create table if not exists presets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'other',
  calories integer not null,
  abv numeric,
  is_custom boolean not null default true,
  created_at timestamptz default now()
);

-- ---------- posse (Games page) ----------
create table if not exists posse (
  id bigserial primary key,
  name text not null,
  drinks integer not null default 0,
  created_at timestamptz default now()
);

-- ---------- Row Level Security ----------
-- This is a single-user app with no login, so we open read/write to anyone
-- holding the anon public key (never the service_role key, which stays
-- server-side only and is never used by this front-end-only app).
alter table entries enable row level security;
alter table presets enable row level security;
alter table posse enable row level security;

create policy "Allow all on entries" on entries
  for all using (true) with check (true);

create policy "Allow all on presets" on presets
  for all using (true) with check (true);

create policy "Allow all on posse" on posse
  for all using (true) with check (true);

-- ---------- seed the built-in presets ----------
-- Matches src/data/builtInPresets.js so the database starts with the same
-- reference list the app already ships with.
insert into presets (name, category, calories, abv, is_custom) values
  ('Lager', 'beer', 150, 4.5, false),
  ('IPA', 'beer', 210, 6.5, false),
  ('Stout', 'beer', 210, 5.0, false),
  ('Wheat beer', 'beer', 155, 5.0, false),
  ('Red wine', 'wine', 125, 13, false),
  ('White wine', 'wine', 120, 12, false),
  ('Rosé', 'wine', 120, 12, false),
  ('Sparkling wine', 'wine', 95, 12, false),
  ('Margarita', 'cocktail', 170, 15, false),
  ('Mojito', 'cocktail', 145, 10, false),
  ('Old fashioned', 'cocktail', 180, 32, false),
  ('Vodka soda', 'spirit', 100, 12, false),
  ('Whiskey shot', 'spirit', 105, 40, false),
  ('Orange juice', 'other', 110, null, false),
  ('Iced tea', 'other', 90, null, false),
  ('Soda', 'other', 140, null, false)
on conflict do nothing;
