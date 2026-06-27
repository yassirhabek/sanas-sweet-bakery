-- Add icon column to categories for Lucide icon selection in admin
alter table categories
  add column if not exists icon text not null default 'wheat';

update categories set icon = 'wheat' where id = '11111111-1111-1111-1111-111111111111';
update categories set icon = 'croissant' where id = '22222222-2222-2222-2222-222222222222';
update categories set icon = 'cake-slice' where id = '33333333-3333-3333-3333-333333333333';
