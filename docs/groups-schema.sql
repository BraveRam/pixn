-- Run this in your Supabase SQL editor.

create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  created_at timestamptz not null default now()
);

create table if not exists public.group_images (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  group_id uuid not null references public.groups(id) on delete cascade,
  image_path text not null,
  created_at timestamptz not null default now(),
  unique (user_id, group_id, image_path)
);

alter table public.groups enable row level security;
alter table public.group_images enable row level security;

drop policy if exists "groups_owner_all" on public.groups;
create policy "groups_owner_all" on public.groups
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "group_images_owner_all" on public.group_images;
create policy "group_images_owner_all" on public.group_images
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
