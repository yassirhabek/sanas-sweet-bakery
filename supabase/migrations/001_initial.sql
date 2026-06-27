-- Bakery schema: opening hours, special hours, categories, menu items

create table if not exists opening_hours (
  day_of_week int primary key check (day_of_week >= 0 and day_of_week <= 6),
  open_time time,
  close_time time,
  is_closed boolean not null default false
);

create table if not exists special_hours (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  open_time time,
  close_time time,
  is_closed boolean not null default false,
  note_nl text,
  note_en text
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name_nl text not null,
  name_en text not null,
  sort_order int not null default 0
);

create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete cascade,
  name_nl text not null,
  name_en text not null,
  description_nl text not null default '',
  description_en text not null default '',
  price decimal(10, 2),
  image_url text,
  sort_order int not null default 0,
  is_featured boolean not null default false
);

alter table opening_hours enable row level security;
alter table special_hours enable row level security;
alter table categories enable row level security;
alter table menu_items enable row level security;

create policy "Public read opening_hours" on opening_hours for select using (true);
create policy "Public read special_hours" on special_hours for select using (true);
create policy "Public read categories" on categories for select using (true);
create policy "Public read menu_items" on menu_items for select using (true);

-- Seed weekly hours (Mon–Sat 07:00–18:00, Sun closed)
insert into opening_hours (day_of_week, open_time, close_time, is_closed) values
  (0, '07:00', '18:00', false),
  (1, '07:00', '18:00', false),
  (2, '07:00', '18:00', false),
  (3, '07:00', '18:00', false),
  (4, '07:00', '18:00', false),
  (5, '07:00', '18:00', false),
  (6, null, null, true)
on conflict (day_of_week) do nothing;

-- Seed categories
insert into categories (id, name_nl, name_en, sort_order) values
  ('11111111-1111-1111-1111-111111111111', 'Brood', 'Bread', 0),
  ('22222222-2222-2222-2222-222222222222', 'Gebak', 'Pastries', 1),
  ('33333333-3333-3333-3333-333333333333', 'Taarten', 'Cakes', 2)
on conflict (id) do nothing;

-- Seed menu items
insert into menu_items (category_id, name_nl, name_en, description_nl, description_en, price, image_url, sort_order, is_featured) values
  (
    '11111111-1111-1111-1111-111111111111',
    'Khobz', 'Khobz',
    'Traditioneel Marokkaans rondbrood, dagelijks vers gebakken.',
    'Traditional Moroccan round bread, baked fresh daily.',
    2.50,
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600',
    0, true
  ),
  (
    '11111111-1111-1111-1111-111111111111',
    'Msemen', 'Msemen',
    'Gelaagd flatbrood, knapperig van buiten en zacht van binnen.',
    'Layered flatbread, crispy outside and soft inside.',
    3.00,
    'https://images.unsplash.com/photo-1619535854729-0b764f4cfc4e?w=600',
    1, true
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Chebakia', 'Chebakia',
    'Honingzoete bloemkoekjes met sesamzaad, een Ramadan-specialiteit.',
    'Honey-sweet flower cookies with sesame seeds, a Ramadan specialty.',
    1.50,
    'https://images.unsplash.com/photo-1558961363-fa8fdf0db814?w=600',
    0, true
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Briouat', 'Briouat',
    'Krokante filodeegpakketjes gevuld met amandelpasta.',
    'Crispy phyllo parcels filled with almond paste.',
    2.00,
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600',
    1, false
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Meskouta', 'Meskouta',
    'Lichte Marokkaanse citroencake, perfect bij de thee.',
    'Light Moroccan lemon cake, perfect with tea.',
    18.00,
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600',
    0, false
  );

-- Storage bucket (run in Supabase dashboard or via API):
-- insert into storage.buckets (id, name, public) values ('menu-images', 'menu-images', true);
