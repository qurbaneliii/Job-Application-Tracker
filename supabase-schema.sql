create extension if not exists "pgcrypto";

create type application_status as enum (
  'Applied',
  'Screening',
  'Interview',
  'Technical',
  'Offer',
  'Rejected',
  'No Response'
);

create type work_type as enum ('Remote', 'Hybrid', 'Onsite');

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company text not null check (char_length(trim(company)) > 1),
  position text not null check (char_length(trim(position)) > 1),
  location text,
  work_type work_type not null default 'Remote',
  application_date date not null,
  status application_status not null default 'Applied',
  source text,
  contact_person text,
  contact_email text,
  cv_version text,
  interview_date date,
  follow_up_date date,
  notes text,
  job_post_link text,
  response_time_days integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint valid_contact_email check (
    contact_email is null or contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  ),
  constraint valid_job_post_link check (
    job_post_link is null or job_post_link ~* '^https?://'
  )
);

create index if not exists idx_applications_user_id on public.applications (user_id);
create index if not exists idx_applications_status on public.applications (status);
create index if not exists idx_applications_application_date on public.applications (application_date desc);
create index if not exists idx_applications_follow_up_date on public.applications (follow_up_date);
create index if not exists idx_applications_source on public.applications (source);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_response_time_days()
returns trigger
language plpgsql
as $$
begin
  if new.status in ('Rejected', 'Offer', 'No Response') then
    new.response_time_days := greatest(0, current_date - new.application_date);
  else
    new.response_time_days := null;
  end if;
  return new;
end;
$$;

drop trigger if exists applications_set_updated_at on public.applications;
create trigger applications_set_updated_at
before update on public.applications
for each row
execute function public.handle_updated_at();

drop trigger if exists applications_set_response_time_days on public.applications;
create trigger applications_set_response_time_days
before insert or update on public.applications
for each row
execute function public.handle_response_time_days();

alter table public.applications enable row level security;

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
