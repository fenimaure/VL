
-- Create the project_inquiries table
create table public.project_inquiries (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  services text[] default '{}',
  message text,
  status text default 'new', -- 'new', 'contacted', 'archived'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.project_inquiries enable row level security;

-- Policies
-- Allow anyone (public) to insert inquiries
create policy "Anyone can submit inquiries"
  on public.project_inquiries for insert
  with check (true);

-- Allow admins (authenticated) to view all inquiries
create policy "Admins can view inquiries"
  on public.project_inquiries for select
  using (auth.role() = 'authenticated');

-- Allow admins to update status
create policy "Admins can update inquiries"
  on public.project_inquiries for update
  using (auth.role() = 'authenticated');

-- Allow admins to delete
create policy "Admins can delete inquiries"
  on public.project_inquiries for delete
  using (auth.role() = 'authenticated');
