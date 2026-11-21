create extension if not exists pgcrypto;

create type public.app_role as enum (
  'supporter',
  'coach',
  'assistant_coach',
  'team_manager',
  'club_administrator',
  'match_official',
  'league_administrator',
  'super_administrator'
);

create type public.approval_status as enum ('pending', 'approved', 'rejected', 'suspended');
create type public.club_status as enum ('active', 'inactive');
create type public.staff_status as enum ('active', 'inactive');
create type public.registration_status as enum ('pending', 'verified', 'rejected');
create type public.competition_status as enum ('draft', 'active', 'completed', 'archived');
create type public.fixture_status as enum ('scheduled', 'live', 'completed', 'verified', 'postponed', 'cancelled');
create type public.lineup_status as enum ('draft', 'submitted', 'confirmed');
create type public.event_type as enum (
  'goal',
  'own_goal',
  'penalty_goal',
  'penalty_missed',
  'yellow_card',
  'red_card',
  'substitution',
  'injury',
  'corner',
  'foul',
  'var_review',
  'period_start',
  'period_end',
  'match_end'
);
create type public.event_verify_status as enum ('pending', 'verified', 'disputed');
create type public.transfer_status as enum ('draft', 'pending', 'approved', 'rejected', 'completed', 'cancelled');
create type public.notification_type as enum ('invitation', 'approval', 'fixture', 'match_event', 'transfer', 'system');
create type public.audit_action as enum ('insert', 'update', 'delete', 'approve', 'reject', 'invite', 'accept', 'verify', 'sign_in', 'sign_out');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (char_length(trim(full_name)) between 1 and 120),
  email text not null unique check (email = lower(email) and char_length(email) between 5 and 254),
  phone text check (phone is null or char_length(phone) between 5 and 30),
  avatar_url text,
  approval_status public.approval_status not null default 'pending',
  approved_by uuid references public.users (id) on delete set null,
  approved_at timestamptz,
  is_active boolean not null default true,
  last_sign_in_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint users_approval_consistency check (
    (approval_status = 'approved' and approved_at is not null)
    or (approval_status <> 'approved' and approved_at is null)
  )
);

create index users_approval_status_idx on public.users (approval_status, is_active);
create index users_created_at_idx on public.users (created_at desc);

create table public.clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  short_name text not null check (char_length(trim(short_name)) between 2 and 12),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  primary_color text check (primary_color ~ '^#[0-9A-Fa-f]{6}$'),
  secondary_color text check (secondary_color ~ '^#[0-9A-Fa-f]{6}$'),
  logo_url text,
  stadium text,
  country text not null default 'Lesotho',
  district text,
  founded_year integer check (founded_year between 1900 and extract(year from now())::integer),
  status public.club_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index clubs_name_unique on public.clubs (lower(name));
create index clubs_status_idx on public.clubs (status, name);

create table public.club_staff (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  position text not null check (char_length(trim(position)) between 2 and 80),
  department text,
  status public.staff_status not null default 'active',
  started_at date not null default current_date,
  ended_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint club_staff_unique_membership unique (club_id, user_id),
  constraint club_staff_dates check (ended_at is null or ended_at >= started_at)
);

create index club_staff_user_idx on public.club_staff (user_id, status);
create index club_staff_club_idx on public.club_staff (club_id, status);

create table public.players (
  id uuid primary key default gen_random_uuid(),
  first_name text not null check (char_length(trim(first_name)) between 1 and 80),
  last_name text not null check (char_length(trim(last_name)) between 1 and 80),
  display_name text generated always as (first_name || ' ' || last_name) stored,
  common_name text,
  date_of_birth date not null check (date_of_birth <= current_date),
  nationality text not null default 'Lesotho',
  position text not null check (position in ('goalkeeper', 'defender', 'midfielder', 'forward')),
  shirt_number integer check (shirt_number between 1 and 99),
  preferred_foot text check (preferred_foot in ('left', 'right', 'both')),
  height_cm integer check (height_cm between 120 and 230),
  photo_url text,
  status text not null default 'active' check (status in ('active', 'injured', 'suspended', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index players_identity_unique on public.players (lower(first_name), lower(last_name), date_of_birth);
create index players_position_idx on public.players (position, status);
create index players_display_name_idx on public.players (lower(display_name));
