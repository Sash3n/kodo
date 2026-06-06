-- ============================================================
-- 002_discount_codes.sql
-- ============================================================

create table if not exists public.discount_codes (
  id           uuid primary key default gen_random_uuid(),
  code         text not null unique,               -- e.g. LAUNCH20
  type         text not null check (type in ('percent', 'fixed')),
  value        int not null check (value > 0),     -- percent: 1–100 | fixed: ZAR cents
  min_order_cents bigint not null default 0,        -- minimum order to qualify
  max_uses     int,                                 -- null = unlimited
  uses         int not null default 0,
  active       boolean not null default true,
  expires_at   timestamptz,
  created_at   timestamptz not null default now()
);

-- Track which order used which code (one code per order)
alter table public.orders add column if not exists discount_code text;
alter table public.orders add column if not exists discount_cents bigint not null default 0;

-- RLS
alter table public.discount_codes enable row level security;

-- Only admins can manage codes; anonymous can validate (via API route — not direct table access)
create policy "discount_codes: admin all" on public.discount_codes
  using (public.is_admin())
  with check (public.is_admin());

-- Index for fast code lookup
create index if not exists discount_codes_code_idx on public.discount_codes(lower(code));

-- Atomic use increment (called before PayFast redirect)
create or replace function public.increment_discount_uses(code_id uuid)
returns void language sql security definer as $$
  update public.discount_codes set uses = uses + 1 where id = code_id;
$$;
