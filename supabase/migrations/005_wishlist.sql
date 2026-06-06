-- ============================================================
-- 005_wishlist.sql
-- ============================================================

create table if not exists public.wishlists (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  product_id text not null,       -- Sanity _id
  slug       text not null,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create index if not exists wishlists_user_idx on public.wishlists(user_id);

alter table public.wishlists enable row level security;

create policy "wishlists: self all" on public.wishlists for all using (user_id = auth.uid());
