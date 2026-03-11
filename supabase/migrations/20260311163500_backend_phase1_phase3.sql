-- Phase 1 + Phase 3 skeleton for Nexora backend on Supabase
-- Includes schema, triggers, indexes, grants, and baseline RLS policies.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null,
  name text not null check (char_length(name) between 1 and 120),
  state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.project_versions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  owner_id text not null,
  snapshot jsonb not null,
  reason text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.ai_usage_logs (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null,
  provider text not null,
  kind text not null,
  tokens_used integer not null default 0 check (tokens_used >= 0),
  metadata jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at
before update on public.projects
for each row execute procedure public.set_updated_at();

create index if not exists idx_projects_owner_updated_at
  on public.projects (owner_id, updated_at desc);

create index if not exists idx_project_versions_project_created_at
  on public.project_versions (project_id, created_at desc);

create index if not exists idx_project_versions_owner_created_at
  on public.project_versions (owner_id, created_at desc);

create index if not exists idx_ai_usage_logs_owner_created_at
  on public.ai_usage_logs (owner_id, created_at desc);

grant usage on schema public to authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.projects to authenticated;
grant select, insert on public.project_versions to authenticated;
grant select, insert on public.ai_usage_logs to authenticated;

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_versions enable row level security;
alter table public.ai_usage_logs enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'profiles_select_own'
  ) then
    create policy profiles_select_own
      on public.profiles
      for select
      using (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'profiles_insert_own'
  ) then
    create policy profiles_insert_own
      on public.profiles
      for insert
      with check (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'profiles_update_own'
  ) then
    create policy profiles_update_own
      on public.profiles
      for update
      using (auth.uid() = id)
      with check (auth.uid() = id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'projects' and policyname = 'projects_select_own'
  ) then
    create policy projects_select_own
      on public.projects
      for select
      using (auth.uid()::text = owner_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'projects' and policyname = 'projects_insert_own'
  ) then
    create policy projects_insert_own
      on public.projects
      for insert
      with check (auth.uid()::text = owner_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'projects' and policyname = 'projects_update_own'
  ) then
    create policy projects_update_own
      on public.projects
      for update
      using (auth.uid()::text = owner_id)
      with check (auth.uid()::text = owner_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'projects' and policyname = 'projects_delete_own'
  ) then
    create policy projects_delete_own
      on public.projects
      for delete
      using (auth.uid()::text = owner_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'project_versions' and policyname = 'project_versions_select_own'
  ) then
    create policy project_versions_select_own
      on public.project_versions
      for select
      using (auth.uid()::text = owner_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'project_versions' and policyname = 'project_versions_insert_own'
  ) then
    create policy project_versions_insert_own
      on public.project_versions
      for insert
      with check (auth.uid()::text = owner_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'ai_usage_logs' and policyname = 'ai_usage_logs_select_own'
  ) then
    create policy ai_usage_logs_select_own
      on public.ai_usage_logs
      for select
      using (auth.uid()::text = owner_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'ai_usage_logs' and policyname = 'ai_usage_logs_insert_own'
  ) then
    create policy ai_usage_logs_insert_own
      on public.ai_usage_logs
      for insert
      with check (auth.uid()::text = owner_id);
  end if;
end
$$;
