-- Create the pricing_packages table
create table pricing_packages (
  id uuid default uuid_generate_v4() primary key,
  category text not null, -- 'Social Media Management', 'Web Development', 'Virtual Assistants', 'Talent Acquisition'
  title text not null, -- e.g., 'Starter', 'Pro', 'Enterprise'
  price text not null, -- e.g., '$1,000/mo', 'Custom'
  description text,
  features text[] default '{}',
  is_popular boolean default false,
  cta_text text default 'Get Started',
  cta_link text default '/contact',
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table pricing_packages enable row level security;

-- Create policies
create policy "Public packages are viewable by everyone."
  on pricing_packages for select
  using ( true );

create policy "Users can insert their own pricing packages."
  on pricing_packages for insert
  with check ( auth.role() = 'authenticated' );

create policy "Users can update their own pricing packages."
  on pricing_packages for update
  using ( auth.role() = 'authenticated' );

create policy "Users can delete their own pricing packages."
  on pricing_packages for delete
  using ( auth.role() = 'authenticated' );
