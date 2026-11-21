create view public.standings with (security_barrier = true) as
with verified_fixtures as (
  select id, competition_id, season_id, home_club_id, away_club_id, home_score, away_score, kickoff_at
  from public.fixtures
  where status = 'verified' and is_verified
),
club_results as (
  select
    competition_id,
    season_id,
    home_club_id as club_id,
    home_score as goals_for,
    away_score as goals_against,
    case when home_score > away_score then 1 else 0 end as wins,
    case when home_score = away_score then 1 else 0 end as draws,
    case when home_score < away_score then 1 else 0 end as losses,
    case when home_score > away_score then 3 when home_score = away_score then 1 else 0 end as points,
    kickoff_at
  from verified_fixtures
  union all
  select
    competition_id,
    season_id,
    away_club_id as club_id,
    away_score as goals_for,
    home_score as goals_against,
    case when away_score > home_score then 1 else 0 end as wins,
    case when home_score = away_score then 1 else 0 end as draws,
    case when away_score < home_score then 1 else 0 end as losses,
    case when away_score > home_score then 3 when home_score = away_score then 1 else 0 end as points,
    kickoff_at
  from verified_fixtures
),
aggregated as (
  select
    competition_id,
    season_id,
    club_id,
    count(*)::integer as played,
    sum(wins)::integer as wins,
    sum(draws)::integer as draws,
    sum(losses)::integer as losses,
    sum(goals_for)::integer as goals_for,
    sum(goals_against)::integer as goals_against,
    sum(points)::integer as points,
    max(kickoff_at) as last_match_at
  from club_results
  group by competition_id, season_id, club_id
)
select
  ('standing:' || a.competition_id::text || ':' || a.season_id::text || ':' || a.club_id::text)::text as id,
  a.competition_id,
  a.season_id,
  a.club_id,
  c.name as club_name,
  c.short_name as club_short_name,
  a.played,
  a.wins,
  a.draws,
  a.losses,
  a.goals_for,
  a.goals_against,
  (a.goals_for - a.goals_against) as goal_difference,
  a.points,
  a.last_match_at,
  rank() over (
    partition by a.competition_id, a.season_id
    order by a.points desc, (a.goals_for - a.goals_against) desc, a.goals_for desc, c.name asc
  )::integer as position
from aggregated a
join public.clubs c on c.id = a.club_id;

create view public.player_statistics with (security_barrier = true) as
with verified_fixtures as (
  select id, competition_id, season_id, kickoff_at
  from public.fixtures
  where status = 'verified' and is_verified
),
verified_events as (
  select e.*, f.competition_id, f.season_id
  from public.match_events e
  join verified_fixtures f on f.id = e.fixture_id
  where e.verification_status = 'verified'
),
player_events as (
  select
    competition_id,
    season_id,
    player_id,
    count(*) filter (where event_type in ('goal', 'penalty_goal'))::integer as goals,
    count(*) filter (where event_type = 'own_goal')::integer as own_goals,
    count(*) filter (where event_type = 'penalty_missed')::integer as penalties_missed,
    count(*) filter (where event_type = 'yellow_card')::integer as yellow_cards,
    count(*) filter (where event_type = 'red_card')::integer as red_cards,
    max(created_at) as last_event_at
  from verified_events
  where player_id is not null
  group by competition_id, season_id, player_id
),
assist_events as (
  select
    competition_id,
    season_id,
    (metadata ->> 'assist_player_id')::uuid as player_id,
    count(*)::integer as assists
  from verified_events
  where metadata ? 'assist_player_id'
    and metadata ->> 'assist_player_id' ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
  group by competition_id, season_id, (metadata ->> 'assist_player_id')::uuid
),
appearances as (
  select
    vf.competition_id,
    vf.season_id,
    lp.player_id,
    l.club_id,
    count(distinct vf.id)::integer as appearances,
    count(distinct vf.id) filter (where lp.is_starter)::integer as starts
  from public.lineup_players lp
  join public.match_lineups l on l.id = lp.lineup_id
  join verified_fixtures vf on vf.id = l.fixture_id
  group by vf.competition_id, vf.season_id, lp.player_id, l.club_id
),
player_clubs as (
  select competition_id, season_id, player_id, club_id from appearances
  union
  select competition_id, season_id, player_id, club_id
  from public.player_registrations
  where status = 'verified' and competition_id is not null
),
club_matches as (
  select
    vf.competition_id,
    vf.season_id,
    l.club_id,
    max(vf.kickoff_at) as last_match_at
  from public.match_lineups l
  join verified_fixtures vf on vf.id = l.fixture_id
  group by vf.competition_id, vf.season_id, l.club_id
)
select
  (
    'player_stats:' || pc.competition_id::text || ':' || pc.season_id::text || ':' || pc.player_id::text || ':' || pc.club_id::text
  )::text as id,
  pc.competition_id,
  pc.season_id,
  pc.player_id,
  pc.club_id,
  p.display_name as player_name,
  c.name as club_name,
  coalesce(a.appearances, 0) as appearances,
  coalesce(a.starts, 0) as starts,
  coalesce(e.goals, 0) as goals,
  coalesce(e.own_goals, 0) as own_goals,
  coalesce(asst.assists, 0) as assists,
  coalesce(e.penalties_missed, 0) as penalties_missed,
  coalesce(e.yellow_cards, 0) as yellow_cards,
  coalesce(e.red_cards, 0) as red_cards,
  greatest(coalesce(e.last_event_at, to_timestamp(0)), coalesce(cm.last_match_at, to_timestamp(0))) as last_match_at
from player_clubs pc
join public.players p on p.id = pc.player_id
join public.clubs c on c.id = pc.club_id
left join appearances a
  on a.competition_id = pc.competition_id
  and a.season_id = pc.season_id
  and a.player_id = pc.player_id
  and a.club_id = pc.club_id
left join player_events e
  on e.competition_id = pc.competition_id
  and e.season_id = pc.season_id
  and e.player_id = pc.player_id
left join assist_events asst
  on asst.competition_id = pc.competition_id
  and asst.season_id = pc.season_id
  and asst.player_id = pc.player_id
left join club_matches cm
  on cm.competition_id = pc.competition_id
  and cm.season_id = pc.season_id
  and cm.club_id = pc.club_id;

create view public.team_statistics with (security_barrier = true) as
with verified_fixtures as (
  select *
  from public.fixtures
  where status = 'verified' and is_verified
),
club_results as (
  select
    competition_id,
    season_id,
    home_club_id as club_id,
    home_score as goals_for,
    away_score as goals_against,
    case when home_score > away_score then 1 else 0 end as wins,
    case when home_score = away_score then 1 else 0 end as draws,
    case when home_score < away_score then 1 else 0 end as losses,
    case when home_score = 0 then 1 else 0 end as clean_sheets,
    kickoff_at
  from verified_fixtures
  union all
  select
    competition_id,
    season_id,
    away_club_id as club_id,
    away_score as goals_for,
    home_score as goals_against,
    case when away_score > home_score then 1 else 0 end as wins,
    case when home_score = away_score then 1 else 0 end as draws,
    case when away_score < home_score then 1 else 0 end as losses,
    case when away_score = 0 then 1 else 0 end as clean_sheets,
    kickoff_at
  from verified_fixtures
),
result_totals as (
  select
    competition_id,
    season_id,
    club_id,
    count(*)::integer as played,
    sum(wins)::integer as wins,
    sum(draws)::integer as draws,
    sum(losses)::integer as losses,
    sum(goals_for)::integer as goals_for,
    sum(goals_against)::integer as goals_against,
    sum(clean_sheets)::integer as clean_sheets,
    max(kickoff_at) as last_match_at
  from club_results
  group by competition_id, season_id, club_id
),
event_totals as (
  select
    f.competition_id,
    f.season_id,
    e.team_id as club_id,
    count(*) filter (where e.event_type in ('goal', 'penalty_goal'))::integer as goals_from_events,
    count(*) filter (where e.event_type = 'own_goal')::integer as own_goals,
    count(*) filter (where e.event_type = 'yellow_card')::integer as yellow_cards,
    count(*) filter (where e.event_type = 'red_card')::integer as red_cards
  from public.match_events e
  join verified_fixtures f on f.id = e.fixture_id
  where e.verification_status = 'verified' and e.team_id is not null
  group by f.competition_id, f.season_id, e.team_id
)
select
  ('team_stats:' || r.competition_id::text || ':' || r.season_id::text || ':' || r.club_id::text)::text as id,
  r.competition_id,
  r.season_id,
  r.club_id,
  c.name as club_name,
  c.short_name as club_short_name,
  r.played,
  r.wins,
  r.draws,
  r.losses,
  r.goals_for,
  r.goals_against,
  (r.goals_for - r.goals_against) as goal_difference,
  r.clean_sheets,
  coalesce(e.goals_from_events, 0) as goals_from_events,
  coalesce(e.own_goals, 0) as own_goals,
  coalesce(e.yellow_cards, 0) as yellow_cards,
  coalesce(e.red_cards, 0) as red_cards,
  r.last_match_at
from result_totals r
join public.clubs c on c.id = r.club_id
left join event_totals e
  on e.competition_id = r.competition_id
  and e.season_id = r.season_id
  and e.club_id = r.club_id;
