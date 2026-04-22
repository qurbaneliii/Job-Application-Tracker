create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'application_work_type') then
    create type public.application_work_type as enum ('remote', 'hybrid', 'onsite');
  end if;

  if not exists (select 1 from pg_type where typname = 'application_status') then
    create type public.application_status as enum (
      'applied',
      'screening',
      'interview',
      'technical',
      'offer',
      'rejected',
      'no_response'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'application_source') then
    create type public.application_source as enum ('linkedin', 'site', 'referral', 'other');
  end if;
end $$;

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company text not null check (length(trim(company)) > 0),
  position text not null check (length(trim(position)) > 0),
  job_link text,
  location text,
  work_type public.application_work_type not null default 'remote',
  status public.application_status not null default 'applied',
  source public.application_source not null default 'other',
  application_date date not null,
  interview_date date,
  follow_up_date date,
  contact_person text,
  contact_email text,
  notes text,
  created_at timestamptz not null default now(),
  constraint applications_job_link_url check (job_link is null or job_link ~* '^https?://'),
  constraint applications_contact_email_format check (
    contact_email is null or contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  )
);

create index if not exists applications_user_id_idx on public.applications (user_id);
create index if not exists applications_user_id_status_idx on public.applications (user_id, status);
create index if not exists applications_user_id_source_idx on public.applications (user_id, source);
create index if not exists applications_user_id_application_date_idx on public.applications (user_id, application_date desc);
create index if not exists applications_user_id_follow_up_date_idx on public.applications (user_id, follow_up_date);

alter table public.applications enable row level security;

drop policy if exists "Users can read own applications" on public.applications;
drop policy if exists "Users can insert own applications" on public.applications;
drop policy if exists "Users can update own applications" on public.applications;
drop policy if exists "Users can delete own applications" on public.applications;

create policy "Users can read own applications"
on public.applications
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own applications"
on public.applications
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own applications"
on public.applications
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own applications"
on public.applications
for delete
to authenticated
using (auth.uid() = user_id);
