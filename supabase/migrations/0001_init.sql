-- TJ Ibrahim Portfolio schema
-- Run in Supabase SQL editor. Idempotent-ish: uses IF NOT EXISTS where possible.

create extension if not exists "pgcrypto";

-- ============================================================
-- Tables
-- ============================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  cover_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  show_in_nav boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo_url text,
  website_url text,
  description text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  category_id uuid references public.categories(id) on delete set null,
  cover_url text,
  thumb_url text,
  youtube_url text,
  video_url text,
  year int,
  project_date date,
  tags text[] not null default '{}',
  featured boolean not null default false,
  published boolean not null default false,
  sort_order int not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_category_idx on public.projects(category_id);
create index if not exists projects_published_idx on public.projects(published);
create index if not exists projects_featured_idx on public.projects(featured);

create table if not exists public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  url text not null,
  type text not null default 'image', -- image | video | youtube
  caption text,
  alt text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists project_media_project_idx on public.project_media(project_id);

create table if not exists public.project_brands (
  project_id uuid not null references public.projects(id) on delete cascade,
  brand_id uuid not null references public.brands(id) on delete cascade,
  primary key (project_id, brand_id)
);

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  path text,
  type text not null default 'image',
  filename text,
  size_bytes bigint,
  alt text,
  created_at timestamptz not null default now()
);

-- Flexible key/value content store for all editable website text
create table if not exists public.site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null,
  label text,
  sort_order int not null default 0,
  published boolean not null default true
);

-- ============================================================
-- Updated-at trigger
-- ============================================================
create or replace function public.set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end; $$ language plpgsql;

drop trigger if exists trg_cat_updated on public.categories;
create trigger trg_cat_updated before update on public.categories
  for each row execute function public.set_updated_at();

drop trigger if exists trg_brand_updated on public.brands;
create trigger trg_brand_updated before update on public.brands
  for each row execute function public.set_updated_at();

drop trigger if exists trg_proj_updated on public.projects;
create trigger trg_proj_updated before update on public.projects
  for each row execute function public.set_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.projects enable row level security;
alter table public.project_media enable row level security;
alter table public.project_brands enable row level security;
alter table public.media enable row level security;
alter table public.site_content enable row level security;
alter table public.social_links enable row level security;

-- Helper: is caller an admin?
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin');
$$;

-- Public read of published content
drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories
  for select using (published = true);

drop policy if exists "public read brands" on public.brands;
create policy "public read brands" on public.brands
  for select using (published = true);

drop policy if exists "public read projects" on public.projects;
create policy "public read projects" on public.projects
  for select using (published = true);

drop policy if exists "public read project_media" on public.project_media;
create policy "public read project_media" on public.project_media
  for select using (
    exists (select 1 from public.projects p where p.id = project_id and p.published = true)
  );

drop policy if exists "public read project_brands" on public.project_brands;
create policy "public read project_brands" on public.project_brands
  for select using (
    exists (select 1 from public.projects p where p.id = project_id and p.published = true)
  );

drop policy if exists "public read site_content" on public.site_content;
create policy "public read site_content" on public.site_content for select using (true);

drop policy if exists "public read social_links" on public.social_links;
create policy "public read social_links" on public.social_links for select using (published = true);

-- Admin full access
do $$
declare t text;
begin
  for t in select unnest(array[
    'profiles','categories','brands','projects','project_media',
    'project_brands','media','site_content','social_links'
  ]) loop
    execute format('drop policy if exists "admin all %I" on public.%I;', t, t);
    execute format(
      'create policy "admin all %I" on public.%I for all using (public.is_admin()) with check (public.is_admin());',
      t, t
    );
  end loop;
end $$;

-- Profiles: a user can always read their own row (for auth checks)
drop policy if exists "self read profile" on public.profiles;
create policy "self read profile" on public.profiles
  for select using (auth.uid() = id);

-- ============================================================
-- Seed default content
-- ============================================================
insert into public.site_content (key, value) values
  ('hero', '{"name":"TJ IBRAHIM","role":"Content Creator / Photographer / Video Editor","tagline":"Crafting cinematic stories through light, motion and emotion.","cta":"View work","video_url":""}'::jsonb),
  ('about', '{"heading":"About","bio":"I''m a passionate Content Creator, Photographer & Video Editor with 6+ years of professional experience capturing compelling visuals that help brands and individuals tell their story across digital platforms.","specialties":["Photography","Videography","Content Creation","Video Editing"],"stats":[{"label":"Years","value":"6+"},{"label":"Projects","value":"—"},{"label":"Clients","value":"—"}]}'::jsonb),
  ('work', '{"heading":"Selected work","intro":"A curated selection of recent projects across brands, events and personal stories."}'::jsonb),
  ('brands', '{"heading":"Brands & collaborators","intro":"Trusted by teams that care about craft."}'::jsonb),
  ('contact', '{"heading":"Let''s create something","intro":"Available for commissions, collaborations and creative direction.","email":"","whatsapp_number":"","whatsapp_message":"Hello TJ, I would like to discuss a creative project with you."}'::jsonb),
  ('footer', '{"text":"© TJ Ibrahim. All rights reserved."}'::jsonb),
  ('seo', '{"title":"TJ Ibrahim — Content Creator, Photographer & Video Editor","description":"The portfolio of TJ Ibrahim — cinematic photography, videography and content for brands.","og_image":""}'::jsonb)
on conflict (key) do nothing;
