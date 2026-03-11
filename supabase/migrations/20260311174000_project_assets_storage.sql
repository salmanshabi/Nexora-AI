-- Project image asset storage bucket + baseline policies.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-assets',
  'project-assets',
  true,
  10485760,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml'
  ]::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'project_assets_public_read'
  ) then
    create policy project_assets_public_read
      on storage.objects
      for select
      to public
      using (bucket_id = 'project-assets');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'project_assets_owner_insert'
  ) then
    create policy project_assets_owner_insert
      on storage.objects
      for insert
      to authenticated
      with check (
        bucket_id = 'project-assets'
        and (storage.foldername(name))[1] = auth.uid()::text
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'project_assets_owner_update'
  ) then
    create policy project_assets_owner_update
      on storage.objects
      for update
      to authenticated
      using (
        bucket_id = 'project-assets'
        and (storage.foldername(name))[1] = auth.uid()::text
      )
      with check (
        bucket_id = 'project-assets'
        and (storage.foldername(name))[1] = auth.uid()::text
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'project_assets_owner_delete'
  ) then
    create policy project_assets_owner_delete
      on storage.objects
      for delete
      to authenticated
      using (
        bucket_id = 'project-assets'
        and (storage.foldername(name))[1] = auth.uid()::text
      );
  end if;
end
$$;
