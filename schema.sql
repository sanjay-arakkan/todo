-- Drop existing tables if needed (WARNING: This destroys data)
-- For cleaner testing, we might want to drop everything.
drop table if exists todo_status;
drop table if exists todos;
drop table if exists allowed_users;
drop type if exists recurrence_type;

-- Create Enum for Recurrence
create type recurrence_type as enum ('once', 'daily', 'weekdays', 'weekends');

-- 1. Allowed Users Table (Modified)
create table allowed_users (
  email text primary key,
  display_name text not null -- New column for the user's name
);

-- Enable RLS for allowed_users
alter table allowed_users enable row level security;

-- Policy: Anyone can read allowed_users (needed for the auth check/layout)
create policy "Allow read access to everyone"
on allowed_users for select
using (true);

-- 2. Todos Table (Definitions)
create table todos (
  id uuid not null default gen_random_uuid(),
  user_id uuid default auth.uid(),
  title text not null,
  recurrence recurrence_type not null default 'once',
  start_date date not null default current_date,
  created_at timestamptz default now(),
  primary key (id)
);

-- Enable RLS for todos
alter table todos enable row level security;

create policy "Enable all for authenticated users"
on todos for all
to authenticated
using (true)
with check (true);

-- 3. Todo Status Table (Overrides/Completions)
create table todo_status (
  todo_id uuid references todos(id) on delete cascade,
  date date not null,
  is_complete boolean default false,
  is_deleted boolean default false,
  primary key (todo_id, date)
);

-- Enable RLS for todo_status
alter table todo_status enable row level security;

create policy "Enable all for authenticated users"
on todo_status for all
to authenticated
using (true)
with check (true);
