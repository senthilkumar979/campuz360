-- Optional demo org units (run after migrations)
insert into public.org_units (name) values
  ('School of Engineering'),
  ('Robotics Club'),
  ('Housing Office')
on conflict do nothing;
