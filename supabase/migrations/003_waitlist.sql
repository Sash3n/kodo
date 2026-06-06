-- ============================================================
-- 003_waitlist.sql
-- Drop waitlist — email sign-ups for upcoming drops
-- ============================================================

create table if not exists public.waitlist (
  id           uuid primary key default gen_random_uuid(),
  collection_id text not null,              -- Sanity collection _id
  email        text not null,
  confirmed    boolean not null default false,
  notified     boolean not null default false,
  created_at   timestamptz not null default now(),
  unique (collection_id, email)
);

create index if not exists waitlist_collection_idx on public.waitlist(collection_id);
create index if not exists waitlist_notified_idx on public.waitlist(notified);

alter table public.waitlist enable row level security;

-- Anyone can insert their own email; only admins can read/update
create policy "waitlist: insert" on public.waitlist for insert with check (true);
create policy "waitlist: admin read" on public.waitlist for select using (public.is_admin());
create policy "waitlist: admin update" on public.waitlist for update using (public.is_admin());
