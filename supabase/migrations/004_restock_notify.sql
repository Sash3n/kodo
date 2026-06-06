-- ============================================================
-- 004_restock_notify.sql
-- Restock notifications — "notify me" on OOS variants
-- ============================================================

create table if not exists public.restock_requests (
  id          uuid primary key default gen_random_uuid(),
  product_id  text not null,       -- Sanity _id
  variant_sku text not null,       -- full SKU e.g. KDO-HOD-BLK-L-001
  email       text not null,
  notified    boolean not null default false,
  notified_at timestamptz,
  created_at  timestamptz not null default now(),
  unique (variant_sku, email)
);

create index if not exists restock_sku_idx on public.restock_requests(variant_sku);
create index if not exists restock_notified_idx on public.restock_requests(notified);

alter table public.restock_requests enable row level security;

create policy "restock: insert" on public.restock_requests for insert with check (true);
create policy "restock: admin all" on public.restock_requests for all using (public.is_admin());
