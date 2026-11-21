# LFH database architecture

## Scope

This database backs Lesotho Football Hub with identity, clubs, players, competitions, fixtures, verified match activity and derived statistics. Supabase Auth owns login credentials; `public` tables hold football domain data and authorisation metadata.

Migrations live in `supabase/migrations` and must run in numeric order. `supabase/seed.sql` is optional sample data for local environments.

## Entity relationships

```text
auth.users 1──1 public.users
public.users 1──N public.user_roles
public.users 1──N public.audit_logs
public.users 1──N public.notifications
public.users 1──N public.user_invitations (invited_by)

public.clubs 1──N public.club_staff
public.clubs 1──N public.player_registrations
public.clubs 1──N public.competition_teams
public.clubs 1──N public.fixtures (home_club_id / away_club_id)
public.clubs 1──N public.match_lineups
public.clubs 1──N public.match_events
public.clubs 1──N public.transfers (from_club_id / to_club_id)

public.players 1──N public.player_registrations
public.players 1──N public.lineup_players
public.players 1──N public.match_events
public.players 1──N public.substitutions
public.players 1──N public.transfers

public.competitions 1──N public.competition_teams
public.competitions 1──N public.player_registrations
public.competitions 1──N public.user_roles (league_administrator, match_official)
public.competitions 1──N public.fixtures
public.competitions 1──N public.standings
public.competitions 1──N public.team_statistics
public.competitions 1──N public.player_statistics

public.seasons 1──N public.competition_teams
public.seasons 1──N public.player_registrations
public.seasons 1──N public.fixtures
public.seasons 1──N public.transfers
public.seasons 1──N public.standings
public.seasons 1──N public.team_statistics
public.seasons 1──N public.player_statistics

public.fixtures 1──N public.match_lineups
public.fixtures 1──N public.lineup_players (through match_lineups)
public.fixtures 1──N public.match_events
public.fixtures 1──N public.substitutions
public.fixtures 1──N user_roles (match_official through referee_user_id)

public.match_lineups 1──N public.lineup_players
public.lineup_players 1──1 public.player_registrations (optional)
public.lineup_players 1──N public.substitutions (off / on player)
```

## Domain groups

### Identity and access

- `users` extends `auth.users` with profile data, approval state and activation.
- `user_roles` assigns an `app_role` with an optional club or competition scope.
- `user_invitations` supports invitation acceptance without exposing a service-role key.
- `audit_logs` records sensitive inserts, updates, deletes, approvals, verification and invitations.
- `notifications` records invitation, approval, fixture, transfer and system messages.

Role scope constraint in `user_roles`:

| Role | Scope |
| --- | --- |
| `club_administrator`, `coach`, `assistant_coach`, `team_manager` | `club_id` required, `competition_id` null |
| `league_administrator`, `match_official` | `competition_id` required, `club_id` null |
| `supporter`, `super_administrator` | both null |

`match_official` is retained for Chunk14 compatibility. Live match access also checks `fixtures.referee_user_id` through `is_match_official_for(fixture_id)`.

### Clubs and players

- `clubs` holds the club identity used across fixtures, tables, staff and registrations.
- `club_staff` links approved users to a club with a staff position and status.
- `players` holds player identity and position.
- `player_registrations` links a player to a club, optional competition, season, squad number and verification status.

Uniqueness rules prevent duplicate club names, duplicate player identities and duplicate registrations for the same player, club, competition and season.

### Competitions and fixtures

- `competitions` defines league/cup identity and category.
- `seasons` defines season windows; only one season may be active.
- `competition_teams` links clubs to competitions for a season.
- `fixtures` records competition, season, round, clubs, kickoff, venue, status, verification state and assigned referee.

Fixture indexes enforce no duplicate kickoff for the same competition/season/team pair and no duplicate team pairing within a round.

### Match activity

- `match_lineups` stores each club's lineup for a fixture.
- `lineup_players` stores starters, substitutes, captain and shirt number.
- `match_events` is the primary record for goals, cards, fouls, penalties, corners, saves and other event types.
- `substitutions` records off/on players and enforces that a substitution has a matching event.

Events carry `verification_status`; only verified fixtures and verified events feed derived statistics.

### Transfers

`transfers` records player movement between clubs with status, fee, season and approval metadata. A unique index prevents duplicate move records for the same player, from-club, to-club, season and transfer type.

## Derived views

All statistics are derived, never manually maintained.

| View | Grain | Source |
| --- | --- | --- |
| `standings` | club + competition + season | verified fixtures only |
| `team_statistics` | club + competition + season | verified fixtures and verified events |
| `player_statistics` | player + club + competition + season | verified fixtures, verified events, verified lineups and registrations |

`standings` calculates played, wins, draws, losses, goals for/against, goal difference, points, form, last match and rank.

`player_statistics` calculates appearances, starts, goals, own goals, assists, penalties missed, yellow/red cards and last match. Assists come from verified goal event metadata.

`team_statistics` calculates club totals and rankings for wins, draws, losses, goals, cards and discipline.

The frontend uses these views directly when Supabase is configured. In preview mode, it keeps the existing static demonstration data.

## Security model

- RLS is enabled on every base table.
- Views use `security_barrier = true`; RLS is applied on underlying tables.
- Helper functions are `security definer` with a fixed `search_path` and check approval, role and scope.
- `current_user_id()` reads the authenticated JWT subject.
- `is_approved_user()` blocks unapproved accounts from domain data.
- `has_role(role)`, `is_super_admin()`, `is_authorised_club(club_id)` and `is_assigned_competition(competition_id)` centralise role checks.
- `can_manage_fixture`, `can_manage_player`, `can_manage_lineup` and `can_manage_event` gate writes.
- `protect_user_approval` prevents non-super-admins from changing approval state by direct table update.
- `enforce_substitution_event` protects substitution integrity.

Write policies restrict fixtures to league admins/super admins, club-scoped records to authorised club staff, lineups/events to authorised club staff or assigned match officials, and sensitive operations to super admins.

## Function map

| Function | Purpose |
| --- | --- |
| `get_invitation(token)` | Read a valid pending invitation |
| `accept_invitation(token)` | Create/accept account access from an invitation |
| `assign_role(user_id, role, club_id, competition_id)` | Super-admin role assignment |
| `set_user_approval(user_id, status)` | Super-admin approval/suspension |
| `handle_new_user()` | Create `public.users` row on `auth.users` insert |
| `log_audit_event()` | Populate audit log |
| `update_updated_at()` | Maintain `updated_at` timestamps |

## Frontend mapping

`src/lib/database.types.ts` mirrors the database schema for typed Supabase queries.

`src/lib/supabase.ts` exports `supabase` and `isSupabaseConfigured`. Without `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, the app stays in preview mode.

`src/lib/authRoles.ts` maps UI roles to database roles:

| UI role | Database role |
| --- | --- |
| `super-admin` | `super_administrator` |
| `league-admin` | `league_administrator` |
| `club-admin` | `club_administrator` |
| `match-official` | `match_official` |
| `supporter` | `supporter` |

`src/auth/AuthProvider.tsx` supplies session, user profile, roles, approval state and permission helpers. `src/auth/AuthGuard.tsx` protects dashboard routes.

`src/lib/supabaseData.ts`, `src/pages/StandingsPage.tsx`, `src/pages/TopScorersPage.tsx` and `src/pages/SupabaseStatisticsPage.tsx` consume the derived views in configured mode while preserving preview data otherwise.
