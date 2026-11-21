# Supabase setup

## Prerequisites

- Supabase project with Email auth enabled.
- Local app dependencies installed with `npm install`.
- No Supabase CLI or `psql` is required to use the app; both are only needed for command-line setup/testing.
- Never place a Supabase service-role key in the frontend or in `VITE_*` variables.

## 1. Apply the schema

Run these files in the Supabase SQL Editor in numeric order:

1. `supabase/migrations/0001_identity_clubs_players.sql`
2. `supabase/migrations/0002_competitions_roles_registrations.sql`
3. `supabase/migrations/0003_fixtures.sql`
4. `supabase/migrations/0004_match_activity.sql`
5. `supabase/migrations/0005_derived_statistics.sql`
6. `supabase/migrations/0006_operations_security_functions.sql`
7. `supabase/migrations/0007_row_level_security.sql`

Optional sample data:

```sql
-- run after all migrations
\i supabase/seed.sql
```

If using the SQL Editor, paste the contents of `supabase/seed.sql` instead of `\i`.

If you have the Supabase CLI available, the equivalent is:

```bash
supabase link --project-ref <project-ref>
supabase db push
```

## 2. Configure frontend environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Set only these values:

```text
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

Then restart the dev server.

If either value is missing, `isSupabaseConfigured` is false and the app stays in preview mode with static demonstration data and unrestricted dashboard access for local frontend work.

## 3. Configure Supabase Auth

In Supabase dashboard → Authentication → Providers:

- Enable Email.
- Decide whether email confirmation is required for sign-up.
- Set the site URL and redirect URLs to your local and deployed origins.

The app uses these flows:

| Page | Flow |
| --- | --- |
| `/login` | `signInWithPassword` |
| `/forgot-password` | `resetPasswordForEmail` |
| `/reset-password` | `updateUser` |
| `/accept-invitation` | invitation lookup, account creation and acceptance |
| `/account-invitation` | invitation creation and supporter self-registration |
| `/pending-approval` | approval status and sign-out |

The `handle_new_user()` trigger creates the matching `public.users` row with `approval_status = 'pending'`. An account cannot access domain data until a super admin approves it.

## 4. Bootstrap the first super admin

Sign up once so the trigger creates the `public.users` row. Then run this in the Supabase SQL Editor, replacing the email:

```sql
update public.users
set approval_status = 'approved', approved_at = now(), updated_at = now()
where email = 'admin@example.com';

insert into public.user_roles (user_id, role, is_active)
select id, 'super_administrator', true
from public.users
where email = 'admin@example.com';
```

This direct insert is only needed for the first admin. Later role changes should use `assign_role(...)` or the Super Admin → Supabase controls panel.

## 5. Assign scoped roles

From the Super Admin → Supabase controls panel, approve users and assign scoped roles.

Equivalent SQL functions:

```sql
select public.set_user_approval('<user-uuid>', 'approved');

select public.assign_role(
  '<user-uuid>',
  'club_administrator',
  '<club-uuid>',
  null
);

select public.assign_role(
  '<user-uuid>',
  'league_administrator',
  null,
  '<competition-uuid>'
);
```

Role scope rules:

- club roles require `club_id`
- `league_administrator` and `match_official` require `competition_id`
- `super_administrator` and `supporter` require neither

`match_official` access to `/live-match?view=official` also requires the user to be the fixture's `referee_user_id` or hold a `match_official` role for that competition.

## 6. Create core data

Minimum setup order:

1. Create seasons.
2. Create clubs.
3. Create competitions.
4. Link clubs to competitions for a season through `competition_teams`.
5. Verify players/club registrations.
6. Create fixtures.
7. Submit lineups.
8. Record and verify match events.
9. Verify fixtures.
10. Derived views populate automatically.

Frontend competition and season labels map to database slugs/names in `src/lib/supabaseData.ts`:

| UI value | Database slug |
| --- | --- |
| `premier-league` | `vodacom-premier-league` |
| `championship` | `lesotho-championship` |
| `knockout-cup` | `federation-cup` |

A frontend season such as `2025/26` maps to database season name `2025-26`.

## 7. Verify role-based access

`supabase/tests/role_access.sql` checks supporter, club admin, league admin, match official and super admin scope behaviour. It expects these psql custom settings before running:

```text
test.supporter_id
test.club_admin_id
test.league_admin_id
test.match_official_id
test.super_admin_id
test.club_id
test.other_club_id
test.competition_id
test.other_competition_id
test.fixture_id
```

Example with `psql`:

```bash
psql "$DATABASE_URL" \
  -v test.supporter_id=<uuid> \
  -v test.club_admin_id=<uuid> \
  -v test.league_admin_id=<uuid> \
  -v test.match_official_id=<uuid> \
  -v test.super_admin_id=<uuid> \
  -v test.club_id=<uuid> \
  -v test.other_club_id=<uuid> \
  -v test.competition_id=<uuid> \
  -v test.other_competition_id=<uuid> \
  -v test.fixture_id=<uuid> \
  -f supabase/tests/role_access.sql
```

The script runs inside a transaction and rolls back.

## 8. Verify the app

With Supabase configured:

```bash
npm.cmd run typecheck
npm.cmd run build
```

Browser checks:

- `/login` signs in and routes by role.
- unapproved users land on `/pending-approval`.
- `/admin`, `/league-admin`, `/club-dashboard` and `/live-match` reject the wrong role.
- `/standings`, `/top-scorers` and `/statistics` show verified Supabase-derived records.
- header sign-out ends the session.

Without Supabase configured, the same routes must remain usable in preview mode for existing frontend regression tests.
