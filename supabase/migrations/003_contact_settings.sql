-- Singleton contact details editable from admin
create table if not exists contact_settings (
  id int primary key default 1 check (id = 1),
  address_nl text not null default 'Goudse Rijweg 20, 3061 DD Rotterdam',
  address_en text not null default 'Goudse Rijweg 20, 3061 DD Rotterdam',
  phone text not null default '+31 20 123 4567',
  email text not null default 'info@alandalus.nl',
  maps_query text not null default 'Goudse Rijweg 20, 3061 DD Rotterdam'
);

insert into contact_settings (id) values (1)
on conflict (id) do nothing;

alter table contact_settings enable row level security;

create policy "Public read contact_settings" on contact_settings for select using (true);
