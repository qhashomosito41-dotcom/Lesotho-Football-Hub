create table public.fixtures (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references public.competitions (id) on delete cascade,
  season_id uuid not null references public.seasons (id) on delete cascade,
  home_club_id uuid not null references public.clubs (id) on delete restrict,
  away_club_id uuid not null references public.clubs (id) on delete restrict,
  round_number integer check (round_number between 1 and 60),
  group_name text check (group_name is null or char_length(trim(group_name)) between 1 and 20),
  matchday integer check (matchday between 1 and 60),
  kickoff_at timestamptz not null,
  venue text,
  status public.fixture_status not null default 'scheduled',
  home_score integer not null default 0 check (home_score >= 0),
  away_score integer not null default 0 check (away_score >= 0),
  referee_user_id uuid references public.users (id) on delete set null,
  is_verified boolean not null default false,
  verified_at timestamptz,
  verified_by uuid references public.users (id) on delete set null,
  source text check (source is null or source in ('lfh', 'competition_feed', 'manual')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint fixtures_distinct_clubs check (home_club_id <> away_club_id),
  constraint fixtures_verified_consistency check (
    (status = 'verified' and is_verified and verified_at is not null and verified_by is not null)
    or (status <> 'verified' and not is_verified and verified_at is null and verified_by is null)
  )
);

create unique index fixtures_unique_kickoff on public.fixtures (competition_id, season_id, home_club_id, away_club_id, kickoff_at);
create unique index fixtures_unique_round_pair on public.fixtures (competition_id, season_id, round_number, home_club_id, away_club_id) where round_number is not null;
create index fixtures_status_kickoff_idx on public.fixtures (status, kickoff_at);
create index fixtures_competition_season_idx on public.fixtures (competition_id, season_id, kickoff_at);
create index fixtures_home_club_idx on public.fixtures (home_club_id, kickoff_at desc);
create index fixtures_away_club_idx on public.fixtures (away_club_id, kickoff_at desc);
create index fixtures_referee_idx on public.fixtures (referee_user_id) where referee_user_id is not null;
