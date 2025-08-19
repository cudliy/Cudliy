-- Create the profiles table to store user role segmentation and name
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  segment text check (
    segment in (
      'casual_browser',
      'casual_customizer',
      'designer_hobbyist',
      'designer_entrepreneur',
      'printer_individual',
      'printer_small_business'
    )
  ),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone
);

-- Row Level Security
alter table public.profiles enable row level security;

create policy "Profiles are viewable by owners" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);


