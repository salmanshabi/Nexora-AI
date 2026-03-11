-- Published sites table + policies for public reads and owner management.

create table if not exists public.published_sites (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade unique,
  owner_id text not null,
  slug text not null unique,
  site_state jsonb not null,
  is_active boolean not null default true,
  published_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists trg_published_sites_updated_at on public.published_sites;
create trigger trg_published_sites_updated_at
before update on public.published_sites
for each row execute procedure public.set_updated_at();

create index if not exists idx_published_sites_owner_updated_at
  on public.published_sites (owner_id, updated_at desc);

grant select on public.published_sites to anon, authenticated;
grant insert, update, delete on public.published_sites to authenticated;

alter table public.published_sites enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'published_sites' and policyname = 'published_sites_public_read_active'
  ) then
    create policy published_sites_public_read_active
      on public.published_sites
      for select
      to anon, authenticated
      using (is_active = true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'published_sites' and policyname = 'published_sites_owner_insert'
  ) then
    create policy published_sites_owner_insert
      on public.published_sites
      for insert
      to authenticated
      with check (auth.uid()::text = owner_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'published_sites' and policyname = 'published_sites_owner_update'
  ) then
    create policy published_sites_owner_update
      on public.published_sites
      for update
      to authenticated
      using (auth.uid()::text = owner_id)
      with check (auth.uid()::text = owner_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'published_sites' and policyname = 'published_sites_owner_delete'
  ) then
    create policy published_sites_owner_delete
      on public.published_sites
      for delete
      to authenticated
      using (auth.uid()::text = owner_id);
  end if;
end
$$;
