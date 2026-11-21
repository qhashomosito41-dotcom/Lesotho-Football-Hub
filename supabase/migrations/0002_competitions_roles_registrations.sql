create table public.competitions (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  short_name text not null check (char_length(trim(short_name)) between 2 and 20),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  code text not null unique check (code = upper(code) and char_length(code) between 2 and 12),
  category text not null check (category in ('league', 'cup', 'super_cup', 'friendly')),
  format text check (format in ('league', 'knockout', 'group_knockout', 'round_robin')),
  status public.competition_status not null default 'draft',
  country text not null default 'Lesotho',
  governing_body text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index competitions_name_unique on public.competitions (lower(name));
create index competitions_status_idx on public.competitions (status, category);

create table public.seasons (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 4 and 20),
  start_date date not null,
  end_date date not null,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint seasons_dates check (end_date > start_date)
);

create unique index seasons_name_unique on public.seasons (lower(name));
create unique index seasons_active_unique on public.seasons ((is_active)) where is_active = true;
create index seasons_dates_idx on public.seasons (start_date, end_date);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  role public.app_role not null,
  club_id uuid references public.clubs (id) on delete cascade,
  competition_id uuid references public.competitions (id) on delete cascade,
  season_id uuid references public.seasons (id) on delete set null,
  assigned_by uuid references public.users (id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_roles_scope check (
    (
      role in ('club_administrator', 'coach', 'assistant_coach', 'team_manager')
      and club_id is not null
      and competition_id is null
    )
    or (
      role in ('league_administrator', 'match_official')
      and competition_id is not null
      and club_id is null
    )
    or (
      role in ('supporter', 'super_administrator')
      and club_id is null
      and competition_id is null
    )
  )
);

create unique index user_roles_scope_unique on public.user_roles (
  user_id,
  role,
  coalesce(club_id, '00000000-0000-0000-0000-000000000000'::uuid),
  coalesce(competition_id, '00000000-0000-0000-0000-000000000000'::uuid),
  coalesce(season_id, '00000000-0000-0000-0000-000000000000'::uuid)
);
create index user_roles_user_idx on public.user_roles (user_id, is_active);
create index user_roles_club_idx on public.user_roles (club_id, role) where club_id is not null;
create index user_roles_competition_idx on public.user_roles (competition_id, role) where competition_id is not null;

create table public.competition_teams (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references public.competitions (id) on delete cascade,
  season_id uuid not null references public.seasons (id) on delete cascade,
  club_id uuid not null references public.clubs (id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'withdrawn', 'suspended')),
  joined_at date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint competition_teams_unique unique (competition_id, season_id, club_id)
);

create index competition_teams_club_idx on public.competition_teams (club_id, status);
create index competition_teams_competition_idx on public.competition_teams (competition_id, season_id);

create table public.player_registrations (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players (id) on delete cascade,
  club_id uuid not null references public.clubs (id) on delete cascade,
  season_id uuid not null references public.seasons (id) on delete cascade,
  competition_id uuid references public.competitions (id) on delete cascade,
  registration_number text,
  position text not null check (position in ('goalkeeper', 'defender', 'midfielder', 'forward')),
  shirt_number integer check (shirt_number between 1 and 99),
  status public.registration_status not null default 'pending',
  registered_at date not null default current_date,
  verified_at timestamptz,
  verified_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint player_registrations_verified check (
    (status = 'verified' and verified_at is not null and verified_by is not null)
    or (status <> 'verified' and verified_at is null and verified_by is null)
  )
);

create unique index player_registrations_scope_unique on public.player_registrations (
  player_id,
  club_id,
  season_id,
  coalesce(competition_id, '00000000-0000-0000-0000-000000000000'::uuid)
);
create index player_registrations_club_idx on public.player_registrations (club_id, season_id, status);
create index player_registrations_player_idx on public.player_registrations (player_id, status);
create index player_registrations_competition_idx on public.player_registrations (competition_id, season_id) where competition_id is not null;
