-- ================================================================
-- LOVELLI DIGITAL BOUTIQUE — COMPLETE SUPABASE SCHEMA
-- ================================================================
-- This is the SINGLE consolidated SQL file for the entire project.
-- Run this in your Supabase SQL Editor to set up everything.
-- Safe to re-run: uses "IF NOT EXISTS" and "IF EXISTS" throughout.
--
-- Last updated: 2026-03-03
-- ================================================================

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";


-- ================================================================
-- TABLES
-- ================================================================

-- 2. PROJECTS
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  category text not null,
  description text,
  challenge text,
  content text,
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

-- Add columns that may be missing from older schema
alter table projects add column if not exists challenge text;
alter table projects add column if not exists content text;
alter table projects add column if not exists client text;
alter table projects add column if not exists role text;
alter table projects add column if not exists duration text;
alter table projects add column if not exists live_url text;
alter table projects add column if not exists contact_email text;


-- 3. SERVICES
create table if not exists services (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  description text,
  icon_name text,
  icon_url text,
  color_theme text,
  content text,
  image_url text,
  features text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add columns that may be missing from older schema
alter table services add column if not exists content text;
alter table services add column if not exists image_url text;
alter table services add column if not exists features text[] default '{}';
alter table services add column if not exists icon_url text;


-- 4. ABOUT CONTENT
create table if not exists about_content (
  id uuid primary key default uuid_generate_v4(),
  section_key text unique not null,
  title text,
  subtitle text,
  content text,
  image_url text,
  media_type text default 'image',
  items jsonb default '[]',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- 5. CAREERS
create table if not exists careers (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  department text not null,
  location text not null,
  type text not null,
  description text,
  content text,
  salary_range text,
  benefits text[] default '{}',
  application_email text,
  requirements text[] default '{}',
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add columns that may be missing from older schema
alter table careers add column if not exists content text;
alter table careers add column if not exists salary_range text;
alter table careers add column if not exists benefits text[] default '{}';
alter table careers add column if not exists application_email text;
alter table careers add column if not exists requirements text[] default '{}';


-- 6. BLOGS
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


-- 7. TESTIMONIALS
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
  key_name text unique not null,
  value text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- 9. PRICING PACKAGES
create table if not exists pricing_packages (
  id uuid primary key default uuid_generate_v4(),
  category text not null,
  title text not null,
  price text not null,
  description text,
  features text[] default '{}',
  is_popular boolean default false,
  cta_text text default 'Get Started',
  cta_link text default '/contact',
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- 10. PROJECT INQUIRIES
create table if not exists project_inquiries (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  services text[] default '{}',
  message text,
  status text default 'new',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- ================================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================================

-- Enable RLS on all tables
alter table projects enable row level security;
alter table services enable row level security;
alter table about_content enable row level security;
alter table careers enable row level security;
alter table blogs enable row level security;
alter table testimonials enable row level security;
alter table footer_content enable row level security;
alter table pricing_packages enable row level security;
alter table project_inquiries enable row level security;


-- ================================================================
-- PUBLIC SELECT POLICIES (Anyone can read content)
-- ================================================================

-- Drop existing policies first to avoid conflicts (safe if they don't exist)
drop policy if exists "Public allowed to view projects" on projects;
drop policy if exists "Public allowed to view services" on services;
drop policy if exists "Public allowed to view about_content" on about_content;
drop policy if exists "Public allowed to view careers" on careers;
drop policy if exists "Public allowed to view blogs" on blogs;
drop policy if exists "Public allowed to view testimonials" on testimonials;
drop policy if exists "Public allowed to view footer_content" on footer_content;
drop policy if exists "Public packages are viewable by everyone." on pricing_packages;
drop policy if exists "Anyone can submit inquiries" on project_inquiries;
drop policy if exists "Admins can view inquiries" on project_inquiries;

-- Recreate public read policies
create policy "Public read projects" on projects for select using (true);
create policy "Public read services" on services for select using (true);
create policy "Public read about_content" on about_content for select using (true);
create policy "Public read careers" on careers for select using (true);
create policy "Public read blogs" on blogs for select using (true);
create policy "Public read testimonials" on testimonials for select using (true);
create policy "Public read footer_content" on footer_content for select using (true);
create policy "Public read pricing_packages" on pricing_packages for select using (true);

-- Inquiries: anyone can submit (insert), only admins can read
create policy "Public submit inquiries" on project_inquiries for insert with check (true);
create policy "Admin read inquiries" on project_inquiries for select to authenticated using (true);


-- ================================================================
-- AUTHENTICATED ADMIN POLICIES (INSERT, UPDATE, DELETE)
-- ================================================================
-- Using explicit per-operation policies for maximum compatibility.

-- Drop any old "for all" policies that might conflict
drop policy if exists "Admin manages projects" on projects;
drop policy if exists "Admin manages services" on services;
drop policy if exists "Admin manages about_content" on about_content;
drop policy if exists "Admin manages careers" on careers;
drop policy if exists "Admin manages blogs" on blogs;
drop policy if exists "Admin manages testimonials" on testimonials;
drop policy if exists "Admin manages footer_content" on footer_content;
drop policy if exists "Users can insert their own pricing packages." on pricing_packages;
drop policy if exists "Users can update their own pricing packages." on pricing_packages;
drop policy if exists "Users can delete their own pricing packages." on pricing_packages;
drop policy if exists "Admins can update inquiries" on project_inquiries;
drop policy if exists "Admins can delete inquiries" on project_inquiries;

-- Also drop any policies we may have created in previous iterations
drop policy if exists "Auth delete careers" on careers;
drop policy if exists "Auth delete blogs" on blogs;
drop policy if exists "Auth delete testimonials" on testimonials;
drop policy if exists "Auth delete services" on services;
drop policy if exists "Auth delete projects" on projects;
drop policy if exists "Auth delete pricing_packages" on pricing_packages;
drop policy if exists "Auth delete project_inquiries" on project_inquiries;
drop policy if exists "Authenticated can delete careers" on careers;
drop policy if exists "Authenticated can delete blogs" on blogs;
drop policy if exists "Authenticated can delete testimonials" on testimonials;

-- ---- PROJECTS ----
create policy "Admin insert projects" on projects for insert to authenticated with check (true);
create policy "Admin update projects" on projects for update to authenticated using (true) with check (true);
create policy "Admin delete projects" on projects for delete to authenticated using (true);

-- ---- SERVICES ----
create policy "Admin insert services" on services for insert to authenticated with check (true);
create policy "Admin update services" on services for update to authenticated using (true) with check (true);
create policy "Admin delete services" on services for delete to authenticated using (true);

-- ---- ABOUT CONTENT ----
create policy "Admin insert about_content" on about_content for insert to authenticated with check (true);
create policy "Admin update about_content" on about_content for update to authenticated using (true) with check (true);
create policy "Admin delete about_content" on about_content for delete to authenticated using (true);

-- ---- CAREERS ----
create policy "Admin insert careers" on careers for insert to authenticated with check (true);
create policy "Admin update careers" on careers for update to authenticated using (true) with check (true);
create policy "Admin delete careers" on careers for delete to authenticated using (true);

-- ---- BLOGS ----
create policy "Admin insert blogs" on blogs for insert to authenticated with check (true);
create policy "Admin update blogs" on blogs for update to authenticated using (true) with check (true);
create policy "Admin delete blogs" on blogs for delete to authenticated using (true);

-- ---- TESTIMONIALS ----
create policy "Admin insert testimonials" on testimonials for insert to authenticated with check (true);
create policy "Admin update testimonials" on testimonials for update to authenticated using (true) with check (true);
create policy "Admin delete testimonials" on testimonials for delete to authenticated using (true);

-- ---- FOOTER CONTENT ----
create policy "Admin insert footer_content" on footer_content for insert to authenticated with check (true);
create policy "Admin update footer_content" on footer_content for update to authenticated using (true) with check (true);
create policy "Admin delete footer_content" on footer_content for delete to authenticated using (true);

-- ---- PRICING PACKAGES ----
create policy "Admin insert pricing_packages" on pricing_packages for insert to authenticated with check (true);
create policy "Admin update pricing_packages" on pricing_packages for update to authenticated using (true) with check (true);
create policy "Admin delete pricing_packages" on pricing_packages for delete to authenticated using (true);

-- ---- PROJECT INQUIRIES ----
create policy "Admin update inquiries" on project_inquiries for update to authenticated using (true) with check (true);
create policy "Admin delete inquiries" on project_inquiries for delete to authenticated using (true);


-- ================================================================
-- STORAGE SETUP (Manual step in Supabase Dashboard)
-- ================================================================
-- Create a public storage bucket named 'assets' in the Supabase Dashboard.
-- Go to Storage → New Bucket → Name: "assets" → Check "Public bucket"
-- Or run: insert into storage.buckets (id, name, public) values ('assets', 'assets', true);
