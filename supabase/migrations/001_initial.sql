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

-- Storage bucket (run in Supabase dashboard or via API):
-- insert into storage.buckets (id, name, public) values ('menu-images', 'menu-images', true);
