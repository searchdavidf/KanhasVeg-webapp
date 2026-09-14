-- Kanha's Veg Restaurant — Supabase Schema
-- Run this in Supabase SQL Editor

-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================
-- PROFILES
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  phone text unique,
  full_name text not null,
  email text,
  role text not null default 'customer' check (role in ('customer', 'staff', 'admin')),
  loyalty_points integer not null default 0,
  tier text not null default 'bronze' check (tier in ('bronze', 'silver', 'gold', 'platinum')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- MENU
-- ============================================
create table public.menu_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  icon text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.menu_items (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid not null references public.menu_categories(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  image_url text,
  is_available boolean not null default true,
  is_featured boolean not null default false,
  preparation_time_min integer,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- ORDERS
-- ============================================
create sequence order_id_seq start 1001;

create table public.orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text unique not null default ('KVR-' || nextval('order_id_seq')::text),
  customer_id uuid references public.profiles(id),
  customer_name text,
  customer_phone text,
  fulfillment text not null default 'pickup' check (fulfillment in ('pickup', 'delivery')),
  address text,
  notes text,
  subtotal numeric(10,2) not null default 0,
  tax numeric(10,2) not null default 0,
  discount numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  loyalty_points_earned integer not null default 0,
  loyalty_points_redeemed integer not null default 0,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'cod', 'refunded', 'failed')),
  payment_intent_id text,
  cancelled_reason text,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id uuid not null references public.menu_items(id),
  name text not null,
  price numeric(10,2) not null,
  quantity integer not null check (quantity > 0),
  line_total numeric(10,2) not null,
  special_instructions text,
  created_at timestamptz not null default now()
);

-- ============================================
-- LOYALTY LEDGER
-- ============================================
create table public.loyalty_ledger (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references public.profiles(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  points integer not null,
  type text not null check (type in ('purchase', 'referral', 'bonus', 'redemption', 'expiry')),
  description text,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============================================
-- PAYMENTS
-- ============================================
create table public.payments (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete set null,
  stripe_payment_intent_id text,
  amount numeric(10,2) not null,
  currency text not null default 'AED',
  status text not null default 'pending' check (status in ('pending', 'succeeded', 'failed', 'refunded')),
  payment_method text,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- SECTORS (for staff routing)
-- ============================================
create table public.sectors (
  id uuid primary key default uuid_generate_v4(),
  sector_code text unique not null,
  city_code text not null,
  city_name text not null,
  sector_name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================
-- STAFF
-- ============================================
create table public.staff (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade,
  phone text,
  full_name text not null,
  role text not null default 'staff' check (role in ('admin', 'manager', 'staff', 'kitchen')),
  assigned_sector_id uuid references public.sectors(id),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================
-- INDEXES
-- ============================================
create index idx_menu_items_category on public.menu_items(category_id);
create index idx_orders_customer on public.orders(customer_id);
create index idx_orders_status on public.orders(status);
create index idx_orders_created on public.orders(created_at desc);
create index idx_loyalty_customer on public.loyalty_ledger(customer_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Update timestamps
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();
create trigger menu_items_updated_at before update on public.menu_items
  for each row execute function public.handle_updated_at();
create trigger orders_updated_at before update on public.orders
  for each row execute function public.handle_updated_at();
create trigger payments_updated_at before update on public.payments
  for each row execute function public.handle_updated_at();

-- Loyalty tier calculation
create or replace function public.calculate_tier(points integer)
returns text language sql as $$
  select case
    when points >= 5000 then 'platinum'
    when points >= 2000 then 'gold'
    when points >= 500 then 'silver'
    else 'bronze'
  end;
$$;

-- On order delivered: award loyalty points
create or replace function public.award_loyalty_on_delivery()
returns trigger language plpgsql as $$
declare
  points_to_award integer;
begin
  if new.status = 'delivered' and old.status != 'delivered' then
    points_to_award := floor(new.total)::integer;
    
    insert into public.loyalty_ledger (customer_id, order_id, points, type, description)
    values (
      new.customer_id,
      new.id,
      points_to_award,
      'purchase',
      'Earned from order ' || new.order_number
    );
    
    update public.profiles
    set 
      loyalty_points = loyalty_points + points_to_award,
      tier = public.calculate_tier(loyalty_points + points_to_award)
    where id = new.customer_id;
  end if;
  
  return new;
end;
$$;

create trigger orders_loyalty after update on public.orders
  for each row execute function public.award_loyalty_on_delivery();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.profiles enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.loyalty_ledger enable row level security;
alter table public.payments enable row level security;
alter table public.sectors enable row level security;
alter table public.staff enable row level security;

-- Profiles: customers see own, staff see all
create policy "profiles_select_own" on public.profiles
  for select using (
    auth.uid() = id or
    exists (select 1 from public.staff where user_id = auth.uid() and is_active = true)
  );

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Menu: public read
create policy "menu_categories_select_public" on public.menu_categories
  for select using (true);

create policy "menu_items_select_public" on public.menu_items
  for select using (true);

-- Orders: customers see own, staff see all
create policy "orders_select_own" on public.orders
  for select using (
    auth.uid() = customer_id or
    exists (select 1 from public.staff where user_id = auth.uid() and is_active = true)
  );

create policy "orders_insert_customer" on public.orders
  for insert with check (auth.uid() = customer_id or customer_id is null);

create policy "orders_update_staff" on public.orders
  for update using (
    exists (select 1 from public.staff where user_id = auth.uid() and is_active = true)
  );

-- Order items: accessible via order
create policy "order_items_select" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
      and (o.customer_id = auth.uid() or exists (
        select 1 from public.staff s where s.user_id = auth.uid() and s.is_active = true
      ))
    )
  );

-- Loyalty: customers see own, staff see all
create policy "loyalty_select_own" on public.loyalty_ledger
  for select using (
    auth.uid() = customer_id or
    exists (select 1 from public.staff where user_id = auth.uid() and is_active = true)
  );

-- Sectors: staff only
create policy "sectors_select_staff" on public.sectors
  for select using (
    exists (select 1 from public.staff where user_id = auth.uid() and is_active = true)
  );

-- Staff: staff only
create policy "staff_select_staff" on public.staff
  for select using (
    exists (select 1 from public.staff where user_id = auth.uid() and is_active = true)
  );

-- Payments: customers see own order's payments, staff see all
create policy "payments_select" on public.payments
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = payments.order_id
      and (o.customer_id = auth.uid() or exists (
        select 1 from public.staff s where s.user_id = auth.uid() and s.is_active = true
      ))
    )
  );

-- ============================================
-- REALTIME
-- ============================================
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.order_items;
