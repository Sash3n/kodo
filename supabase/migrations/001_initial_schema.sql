-- ============================================================
-- 001_initial_schema.sql
-- Core tables: profiles, orders, order_items, reviews
-- ============================================================

-- ── Profiles ─────────────────────────────────────────────────
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  role       text not null default 'user' check (role in ('user', 'admin')),
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile row on new user sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Orders ────────────────────────────────────────────────────
create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete set null,
  m_payment_id    text unique,           -- PayFast payment reference
  payment_id      text,                  -- PayFast pf_payment_id
  status          text not null default 'pending'
                  check (status in ('pending','paid','processing','shipped','delivered','cancelled','refunded')),
  email           text not null,
  total_cents     bigint not null,        -- total in ZAR cents
  shipping_name   text,
  shipping_address jsonb,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ── Order Items ───────────────────────────────────────────────
create table if not exists public.order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  sku         text not null,
  product_id  text not null,             -- Sanity _id
  variant_id  text not null,
  name        text not null,
  price_cents bigint not null,
  quantity    int not null check (quantity > 0)
);

-- ── Reviews ───────────────────────────────────────────────────
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  product_id  text not null,             -- Sanity _id
  user_id     uuid references auth.users(id) on delete set null,
  display_name text not null,
  rating      int not null check (rating between 1 and 5),
  body        text not null check (char_length(body) between 10 and 2000),
  status      text not null default 'pending'
              check (status in ('pending','approved','rejected')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Updated_at triggers ───────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();
create trigger orders_updated_at before update on public.orders
  for each row execute procedure public.set_updated_at();
create trigger reviews_updated_at before update on public.reviews
  for each row execute procedure public.set_updated_at();

-- ── Indexes ───────────────────────────────────────────────────
create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists order_items_order_id_idx on public.order_items(order_id);
create index if not exists reviews_product_id_idx on public.reviews(product_id);
create index if not exists reviews_status_idx on public.reviews(status);

-- ── Row-Level Security ────────────────────────────────────────
alter table public.profiles  enable row level security;
alter table public.orders     enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews    enable row level security;

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Profiles: user reads own row; admin reads all
create policy "profiles: self read"   on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles: self update" on public.profiles for update using (id = auth.uid()) with check (
  -- prevent self-promotion to admin
  role = (select role from public.profiles where id = auth.uid())
);
create policy "profiles: admin update" on public.profiles for update using (public.is_admin());

-- Orders: user reads own; admin reads/writes all
create policy "orders: self read"   on public.orders for select using (user_id = auth.uid() or public.is_admin());
create policy "orders: insert"      on public.orders for insert with check (true); -- service role inserts from ITN
create policy "orders: admin update" on public.orders for update using (public.is_admin());

-- Order items: follow parent order visibility
create policy "order_items: self read" on public.order_items for select using (
  exists (
    select 1 from public.orders o
    where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())
  )
);
create policy "order_items: insert" on public.order_items for insert with check (true);

-- Reviews: anyone reads approved; owner reads own pending; admin reads all
create policy "reviews: public read"   on public.reviews for select using (
  status = 'approved' or user_id = auth.uid() or public.is_admin()
);
create policy "reviews: authenticated insert" on public.reviews for insert
  with check (auth.uid() is not null);
create policy "reviews: admin update" on public.reviews for update using (public.is_admin());
create policy "reviews: admin delete" on public.reviews for delete using (public.is_admin());
