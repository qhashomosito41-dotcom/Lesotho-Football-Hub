create table public.match_lineups (
  id uuid primary key default gen_random_uuid(),
  fixture_id uuid not null references public.fixtures (id) on delete cascade,
  club_id uuid not null references public.clubs (id) on delete restrict,
  formation text check (formation ~ '^[1-9]-[1-9](?:-[1-9]){1,3}$'),
  coach_user_id uuid references public.users (id) on delete set null,
  status public.lineup_status not null default 'draft',
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint match_lineups_unique unique (fixture_id, club_id)
);

create index match_lineups_fixture_idx on public.match_lineups (fixture_id, club_id);
create index match_lineups_club_idx on public.match_lineups (club_id, status);

create table public.lineup_players (
  id uuid primary key default gen_random_uuid(),
  lineup_id uuid not null references public.match_lineups (id) on delete cascade,
  player_id uuid not null references public.players (id) on delete restrict,
  registration_id uuid references public.player_registrations (id) on delete set null,
  position text not null check (position in ('goalkeeper', 'defender', 'midfielder', 'forward')),
  shirt_number integer check (shirt_number between 1 and 99),
  is_starter boolean not null default true,
  is_captain boolean not null default false,
  substitution_minute integer check (substitution_minute between 1 and 130),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lineup_players_unique unique (lineup_id, player_id)
);

create unique index lineup_players_captain_unique on public.lineup_players (lineup_id) where is_captain = true;
create index lineup_players_player_idx on public.lineup_players (player_id);
create index lineup_players_registration_idx on public.lineup_players (registration_id) where registration_id is not null;

create table public.match_events (
  id uuid primary key default gen_random_uuid(),
  fixture_id uuid not null references public.fixtures (id) on delete cascade,
  event_type public.event_type not null,
  team_id uuid references public.clubs (id) on delete restrict,
  player_id uuid references public.players (id) on delete restrict,
  related_player_id uuid references public.players (id) on delete restrict,
  minute integer not null check (minute between 0 and 130),
  additional_minute integer not null default 0 check (additional_minute between 0 and 20),
  event_sequence integer not null check (event_sequence > 0),
  period text not null default '1H' check (period in ('1H', '2H', 'ET1', 'ET2', 'SO')),
  description text check (description is null or char_length(description) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  verification_status public.event_verify_status not null default 'pending',
  verified_at timestamptz,
  verified_by uuid references public.users (id) on delete set null,
  source_event_id text unique check (source_event_id is null or char_length(source_event_id) between 1 and 120),
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint match_events_distinct_players check (related_player_id is null or related_player_id <> player_id),
  constraint match_events_verification check (
    (verification_status = 'verified' and verified_at is not null and verified_by is not null)
    or (verification_status <> 'verified' and verified_at is null and verified_by is null)
  )
);

create unique index match_events_sequence_unique on public.match_events (fixture_id, event_sequence);
create index match_events_fixture_minute_idx on public.match_events (fixture_id, minute, additional_minute, event_sequence);
create index match_events_fixture_type_idx on public.match_events (fixture_id, event_type);
create index match_events_team_idx on public.match_events (team_id, fixture_id) where team_id is not null;
create index match_events_player_idx on public.match_events (player_id, event_type) where player_id is not null;
create index match_events_verification_idx on public.match_events (verification_status, fixture_id);

create table public.substitutions (
  id uuid primary key default gen_random_uuid(),
  match_event_id uuid not null unique references public.match_events (id) on delete cascade,
  lineup_player_off_id uuid not null references public.lineup_players (id) on delete restrict,
  lineup_player_on_id uuid not null references public.lineup_players (id) on delete restrict,
  minute integer not null check (minute between 0 and 130),
  additional_minute integer not null default 0 check (additional_minute between 0 and 20),
  reason text check (reason is null or char_length(reason) <= 300),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint substitutions_distinct_players check (lineup_player_off_id <> lineup_player_on_id)
);

create index substitutions_off_idx on public.substitutions (lineup_player_off_id);
create index substitutions_on_idx on public.substitutions (lineup_player_on_id);
create index substitutions_minute_idx on public.substitutions (minute, additional_minute);
