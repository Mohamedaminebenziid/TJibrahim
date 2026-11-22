-- Storage buckets for media
insert into storage.buckets (id, name, public) values ('media', 'media', true)
on conflict (id) do nothing;

-- Public read
drop policy if exists "public read media bucket" on storage.objects;
create policy "public read media bucket" on storage.objects
  for select using (bucket_id = 'media');

-- Admin write
drop policy if exists "admin write media bucket" on storage.objects;
create policy "admin write media bucket" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "admin update media bucket" on storage.objects;
create policy "admin update media bucket" on storage.objects
  for update using (bucket_id = 'media' and public.is_admin());

drop policy if exists "admin delete media bucket" on storage.objects;
create policy "admin delete media bucket" on storage.objects
  for delete using (bucket_id = 'media' and public.is_admin());
