-- LOVELLI DIGITAL BOUTIQUE - FULL SUPABASE SCHEMA
-- This script sets up all tables, security policies, and initial structures.

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. PROJECTS TABLE
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  category text not null,
  description text,
  challenge text, -- New field for specific challenge text
  content text,   -- Core narrative / full content
  client text,
  role text,
  duration text,
  live_url text,
  contact_email text,
  image_url text,
  tags text[] default '{}',
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. SERVICES TABLE
create table if not exists services (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  description text,
  icon_name text,
  icon_url text,
  color_theme text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. ABOUT CONTENT (Dynamic sections like Hero, Team, Story)
create table if not exists about_content (
  id uuid primary key default uuid_generate_v4(),
  section_key text unique not null, -- 'hero', 'story', 'beliefs', 'team', etc.
  title text,
  subtitle text,
  content text,
  image_url text,
  media_type text default 'image', -- 'image' or 'video'
  items jsonb default '[]', -- For lists like team members or values
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. CAREERS TABLE
create table if not exists careers (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  department text not null,
  location text not null,
  type text not null, -- 'Full-time', 'Contract', etc.
  description text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. BLOGS TABLE
create table if not exists blogs (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  image_url text,
  author text,
  published_at timestamp with time zone default timezone('utc'::text, now()),
  published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. TESTIMONIALS TABLE
create table if not exists testimonials (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  role text,
  content text not null,
  rating integer default 5,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. FOOTER CONTENT
create table if not exists footer_content (
  id uuid primary key default uuid_generate_v4(),
  key_name text unique not null, -- 'linkedin_url', 'instagram_url', etc.
  value text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
alter table projects enable row level security;
alter table services enable row level security;
alter table about_content enable row level security;
alter table careers enable row level security;
alter table blogs enable row level security;
alter table testimonials enable row level security;
alter table footer_content enable row level security;

-- PUBLIC SELECT POLICIES (Anyone can see content)
create policy "Public allowed to view projects" on projects for select using (true);
create policy "Public allowed to view services" on services for select using (true);
create policy "Public allowed to view about_content" on about_content for select using (true);
create policy "Public allowed to view careers" on careers for select using (true);
create policy "Public allowed to view blogs" on blogs for select using (true);
create policy "Public allowed to view testimonials" on testimonials for select using (true);
create policy "Public allowed to view footer_content" on footer_content for select using (true);

-- AUTHENTICATED ADMIN POLICIES (Only logged in admins can modify)
-- These allow all operations (insert, update, delete) for authenticated users.

create policy "Admin manages projects" on projects for all to authenticated using (true) with check (true);
create policy "Admin manages services" on services for all to authenticated using (true) with check (true);
create policy "Admin manages about_content" on about_content for all to authenticated using (true) with check (true);
create policy "Admin manages careers" on careers for all to authenticated using (true) with check (true);
create policy "Admin manages blogs" on blogs for all to authenticated using (true) with check (true);
create policy "Admin manages testimonials" on testimonials for all to authenticated using (true) with check (true);
create policy "Admin manages footer_content" on footer_content for all to authenticated using (true) with check (true);

-- ==========================================
-- STORAGE SETUP (Reference instructions)
-- ==========================================
-- Note: Create a public storage bucket named 'assets' in the Supabase Dashboard
-- No SQL is required to create buckets usually, but policies can be set:
-- insert into storage.buckets (id, name, public) values ('assets', 'assets', true);
