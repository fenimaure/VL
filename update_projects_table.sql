-- Run this SQL in your Supabase SQL Editor to add the missing columns

alter table projects 
add column if not exists challenge text,
add column if not exists content text,
add column if not exists client text,
add column if not exists role text,
add column if not exists duration text,
add column if not exists live_url text,
add column if not exists contact_email text;
