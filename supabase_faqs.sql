-- ================================================================
-- FAQ TABLE & POLICIES
-- ================================================================
-- Run this in your Supabase SQL Editor to create the FAQs table.
-- Safe to re-run: uses "IF NOT EXISTS" and "IF EXISTS" throughout.
-- ================================================================

-- 1. Create FAQs table
create table if not exists faqs (
  id uuid primary key default uuid_generate_v4(),
  question text not null,
  answer text not null,
  category text default 'General',
  order_index integer default 0,
  is_published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable RLS
alter table faqs enable row level security;

-- 3. Public read policy (anyone can view published FAQs)
drop policy if exists "Public read faqs" on faqs;
create policy "Public read faqs" on faqs for select using (true);

-- 4. Admin policies (authenticated users can manage)
drop policy if exists "Admin insert faqs" on faqs;
drop policy if exists "Admin update faqs" on faqs;
drop policy if exists "Admin delete faqs" on faqs;

create policy "Admin insert faqs" on faqs for insert to authenticated with check (true);
create policy "Admin update faqs" on faqs for update to authenticated using (true) with check (true);
create policy "Admin delete faqs" on faqs for delete to authenticated using (true);
