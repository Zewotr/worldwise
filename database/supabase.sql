-- Run this in the Supabase SQL editor
create extension if not exists pgcrypto;

create table if not exists public.cities (
    id uuid primary key default gen_random_uuid(),
    city_name text not null,
    country text not null,
    emoji text not null,
    visited_at date not null,
    notes text default '',
    lat double precision not null,
    lng double precision not null,
    created_at timestamptz not null default now()
);

alter table public.cities enable row level security;

drop policy if exists "Public can read cities" on public.cities;
drop policy if exists "Public can insert cities" on public.cities;
drop policy if exists "Public can delete cities" on public.cities;

create policy "Public can read cities"
on public.cities
for select
to anon, authenticated
using (true);

create policy "Public can insert cities"
on public.cities
for insert
to anon, authenticated
with check (true);

create policy "Public can delete cities"
on public.cities
for delete
to anon, authenticated
using (true);

insert into public.cities (city_name, country, emoji, visited_at, notes, lat, lng)
values
    ('Lisbon', 'Portugal', '🇵🇹', '2026-02-09', '', 38.71980474264239, -9.146118164062502),
    ('Mora', 'Spain', '🇪🇸', '2026-03-11', 'dgfhgjhkj', 39.7240885773337, -3.7133789062500004),
    ('Nelas', 'Portugal', '🇵🇹', '2026-03-11', 'hgv', 40.463666324587685, -7.910156250000001)
on conflict do nothing;
