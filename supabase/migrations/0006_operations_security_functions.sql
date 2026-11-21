create table public.transfers (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players (id) on delete restrict,
  from_club_id uuid not null references public.clubs (id) on delete restrict,
  to_club_id uuid references public.clubs (id) on delete restrict,
  season_id uuid not null references public.seasons (id) on delete cascade,
  competition_id uuid references public.competitions (id) on delete set null,
  transfer_type text not null check (transfer_type in ('permanent', 'loan', 'free_agent', 'retirement')),
  status public.transfer_status not null default 'draft',
  transfer_date date not null default current_date,
  fee_amount numeric(12, 2) check (fee_amount is null or fee_amount >= 0),
  currency text not null default 'LSL' check (currency = upper(currency) and char_length(currency) = 3),
  announced_at timestamptz,
  approved_by uuid references public.users (id) on delete set null,
  approved_at timestamptz,
  notes text check (notes is null or char_length(notes) <= 1000),
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint transfers_distinct_clubs check (to_club_id is null or from_club_id <> to_club_id),
  constraint transfers_approval check (
    (status in ('approved', 'completed') and approved_by is not null and approved_at is not null)
    or (status not in ('approved', 'completed') and approved_by is null and approved_at is null)
  )
);

create unique index transfers_unique_move on public.transfers (player_id, from_club_id, coalesce(to_club_id, '00000000-0000-0000-0000-000000000000'::uuid), season_id, transfer_type);
create index transfers_player_idx on public.transfers (player_id, transfer_date desc);
create index transfers_club_idx on public.transfers (from_club_id, to_club_id, status);
create index transfers_status_idx on public.transfers (status, transfer_date desc);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  record_id uuid not null,
  action public.audit_action not null,
  actor_id uuid references public.users (id) on delete set null,
  actor_email text,
  changes jsonb not null default '{}'::jsonb,
  reason text,
  ip_address inet,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index audit_logs_table_record_idx on public.audit_logs (table_name, record_id, created_at desc);
create index audit_logs_actor_idx on public.audit_logs (actor_id, created_at desc) where actor_id is not null;
create index audit_logs_created_at_idx on public.audit_logs (created_at desc);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  type public.notification_type not null,
  title text not null check (char_length(trim(title)) between 1 and 140),
  body text check (body is null or char_length(body) <= 1000),
  data jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index notifications_user_unread_idx on public.notifications (user_id, created_at desc) where read_at is null;
create index notifications_user_idx on public.notifications (user_id, created_at desc);

create table public.user_invitations (
  id uuid primary key default gen_random_uuid(),
  token text not null unique default encode(gen_random_bytes(24), 'hex'),
  email text not null check (email = lower(email) and char_length(email) between 5 and 254),
  full_name text not null check (char_length(trim(full_name)) between 1 and 120),
  role public.app_role not null,
  club_id uuid references public.clubs (id) on delete cascade,
  competition_id uuid references public.competitions (id) on delete cascade,
  invited_by uuid references public.users (id) on delete set null,
  message text check (message is null or char_length(message) <= 1000),
  expires_at timestamptz not null default (now() + interval '7 days'),
  accepted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_invitations_scope check (
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
  ),
  constraint user_invitations_lifecycle check (accepted_at is null or revoked_at is null),
  constraint user_invitations_expiry check (expires_at > created_at)
);

create unique index user_invitations_pending_unique on public.user_invitations (
  email,
  role,
  coalesce(club_id, '00000000-0000-0000-0000-000000000000'::uuid),
  coalesce(competition_id, '00000000-0000-0000-0000-000000000000'::uuid)
) where accepted_at is null and revoked_at is null;
create index user_invitations_email_idx on public.user_invitations (email, expires_at);
create index user_invitations_invited_by_idx on public.user_invitations (invited_by) where invited_by is not null;

create or replace function public.current_user_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select auth.uid();
$$;

create or replace function public.is_approved_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users u
    where u.id = auth.uid()
      and u.is_active
      and u.approval_status = 'approved'
  );
$$;

create or replace function public.has_role(p_role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_approved_user()
    and exists (
      select 1
      from public.user_roles ur
      where ur.user_id = auth.uid()
        and ur.role = p_role
        and ur.is_active
    );
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role('super_administrator');
$$;

create or replace function public.is_authorised_club(p_club_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_approved_user()
    and (
      exists (
        select 1
        from public.club_staff cs
        where cs.club_id = p_club_id
          and cs.user_id = auth.uid()
          and cs.status = 'active'
      )
      or exists (
        select 1
        from public.user_roles ur
        where ur.club_id = p_club_id
          and ur.user_id = auth.uid()
          and ur.is_active
          and ur.role in ('club_administrator', 'coach', 'assistant_coach', 'team_manager')
      )
    );
$$;

create or replace function public.is_assigned_competition(p_competition_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_super_admin()
    or (
      public.is_approved_user()
      and exists (
        select 1
        from public.user_roles ur
        where ur.competition_id = p_competition_id
          and ur.user_id = auth.uid()
          and ur.is_active
          and ur.role in ('league_administrator', 'match_official')
      )
    );
$$;

create or replace function public.is_match_official_for(p_fixture_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_approved_user()
    and exists (
      select 1
      from public.fixtures f
      join public.user_roles ur on ur.competition_id = f.competition_id
      where f.id = p_fixture_id
        and ur.user_id = auth.uid()
        and ur.role = 'match_official'
        and ur.is_active
    );
$$;

create or replace function public.can_manage_fixture(p_fixture_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_super_admin()
    or exists (
      select 1
      from public.fixtures f
      where f.id = p_fixture_id
        and (
          public.is_assigned_competition(f.competition_id)
          or (
            f.status <> 'verified'
            and (
              public.is_authorised_club(f.home_club_id)
              or public.is_authorised_club(f.away_club_id)
              or public.is_match_official_for(f.id)
            )
          )
        )
    );
$$;

create or replace function public.can_manage_player(p_player_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_super_admin()
    or (
      public.is_approved_user()
      and exists (
        select 1
        from public.player_registrations pr
        join public.club_staff cs on cs.club_id = pr.club_id
        where pr.player_id = p_player_id
          and cs.user_id = auth.uid()
          and cs.status = 'active'
      )
    );
$$;

create or replace function public.can_manage_lineup(p_lineup_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.match_lineups ml
    where ml.id = p_lineup_id
      and public.can_manage_fixture(ml.fixture_id)
  );
$$;

create or replace function public.can_manage_event(p_event_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.match_events me
    where me.id = p_event_id
      and public.can_manage_fixture(me.fixture_id)
  );
$$;

create or replace function public.get_invitation(p_token text)
returns table (
  token text,
  email text,
  full_name text,
  role public.app_role,
  club_id uuid,
  competition_id uuid,
  message text,
  expires_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select i.token, i.email, i.full_name, i.role, i.club_id, i.competition_id, i.message, i.expires_at
  from public.user_invitations i
  where i.token = p_token
    and i.accepted_at is null
    and i.revoked_at is null
    and i.expires_at > now();
$$;

create or replace function public.accept_invitation(p_token text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  invitation public.user_invitations%rowtype;
  signed_in_email text;
begin
  if auth.uid() is null then
    raise exception 'Authentication is required to accept an invitation';
  end if;

  select lower(u.email) into signed_in_email from auth.users u where u.id = auth.uid();

  select i.* into invitation
  from public.user_invitations i
  where i.token = p_token
    and i.accepted_at is null
    and i.revoked_at is null
    and i.expires_at > now();

  if not found then
    raise exception 'Invitation is invalid, revoked or expired';
  end if;

  if signed_in_email is null or signed_in_email <> lower(invitation.email) then
    raise exception 'Invitation email does not match the signed-in account';
  end if;

  insert into public.user_roles (user_id, role, club_id, competition_id, assigned_by, is_active)
  values (auth.uid(), invitation.role, invitation.club_id, invitation.competition_id, invitation.invited_by, true)
  on conflict do nothing;

  update public.user_invitations
  set accepted_at = now(), updated_at = now()
  where id = invitation.id;

  update public.users
  set full_name = coalesce(nullif(trim(invitation.full_name), ''), full_name), updated_at = now()
  where id = auth.uid();

  insert into public.notifications (user_id, type, title, body, data)
  values (
    auth.uid(),
    'approval',
    'Invitation accepted',
    'Your role assignment is recorded. Dashboard access becomes available after approval.',
    jsonb_build_object('role', invitation.role, 'invitationId', invitation.id)
  );

  return true;
end;
$$;

create or replace function public.assign_role(
  p_user_id uuid,
  p_role public.app_role,
  p_club_id uuid default null,
  p_competition_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  role_id uuid;
begin
  if not public.is_super_admin() then
    raise exception 'Only super administrators can assign roles';
  end if;

  select ur.id into role_id
  from public.user_roles ur
  where ur.user_id = p_user_id
    and ur.role = p_role
    and coalesce(ur.club_id, '00000000-0000-0000-0000-000000000000'::uuid) = coalesce(p_club_id, '00000000-0000-0000-0000-000000000000'::uuid)
    and coalesce(ur.competition_id, '00000000-0000-0000-0000-000000000000'::uuid) = coalesce(p_competition_id, '00000000-0000-0000-0000-000000000000'::uuid);

  if role_id is null then
    insert into public.user_roles (user_id, role, club_id, competition_id, assigned_by, is_active)
    values (p_user_id, p_role, p_club_id, p_competition_id, auth.uid(), true)
    returning id into role_id;
  else
    update public.user_roles
    set is_active = true, assigned_by = auth.uid(), updated_at = now()
    where id = role_id;
  end if;

  return role_id;
end;
$$;

create or replace function public.set_user_approval(p_user_id uuid, p_status public.approval_status)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_super_admin() then
    raise exception 'Only super administrators can approve accounts';
  end if;

  update public.users u
  set
    approval_status = p_status,
    approved_by = case when p_status = 'approved' then auth.uid() else null end,
    approved_at = case when p_status = 'approved' then now() else null end,
    updated_at = now()
  where u.id = p_user_id;

  insert into public.notifications (user_id, type, title, body, data)
  values (
    p_user_id,
    'approval',
    case when p_status = 'approved' then 'Account approved' else 'Account status updated' end,
    case when p_status = 'approved' then 'Your LFH role is now active.' else 'An administrator updated your account status.' end,
    jsonb_build_object('approvalStatus', p_status)
  );
end;
$$;

create or replace function public.protect_user_approval()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.approval_status is distinct from old.approval_status
    or new.approved_by is distinct from old.approved_by
    or new.approved_at is distinct from old.approved_at
  then
    if not public.is_super_admin() then
      raise exception 'Approval fields can only be changed by a super administrator';
    end if;
  end if;

  return new;
end;
$$;

create or replace function public.enforce_substitution_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  valid_player_count integer;
begin
  if not exists (select 1 from public.match_events me where me.id = new.match_event_id and me.event_type = 'substitution') then
    raise exception 'Substitution records must reference a substitution match event';
  end if;

  select count(distinct lp.id) into valid_player_count
  from public.lineup_players lp
  join public.match_lineups ml on ml.id = lp.lineup_id
  join public.match_events me on me.fixture_id = ml.fixture_id
  where me.id = new.match_event_id
    and ml.club_id = me.team_id
    and lp.id in (new.lineup_player_off_id, new.lineup_player_on_id);

  if valid_player_count <> 2 then
    raise exception 'Substitution players must belong to the event team lineup';
  end if;

  return new;
end;
$$;

create or replace function public.record_audit_log()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  action_value public.audit_action;
  record_id uuid;
  changes jsonb;
begin
  if tg_op = 'INSERT' then
    action_value := 'insert';
    record_id := (to_jsonb(new) ->> 'id')::uuid;
    changes := jsonb_build_object('new', to_jsonb(new));
  elsif tg_op = 'DELETE' then
    action_value := 'delete';
    record_id := (to_jsonb(old) ->> 'id')::uuid;
    changes := jsonb_build_object('old', to_jsonb(old));
  else
    action_value := 'update';
    record_id := (to_jsonb(new) ->> 'id')::uuid;
    changes := jsonb_build_object('old', to_jsonb(old), 'new', to_jsonb(new));
  end if;

  insert into public.audit_logs (table_name, record_id, action, actor_id, actor_email, changes)
  values (tg_table_name, record_id, action_value, auth.uid(), auth.jwt() ->> 'email', changes);

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, full_name, email, approval_status)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(new.email, '@', 1)),
    lower(new.email),
    'pending'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'users', 'clubs', 'club_staff', 'players', 'competitions', 'seasons', 'user_roles',
    'competition_teams', 'player_registrations', 'fixtures', 'match_lineups', 'lineup_players',
    'match_events', 'substitutions', 'transfers', 'audit_logs', 'notifications', 'user_invitations'
  ]
  loop
    execute format(
      'create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      table_name
    );
  end loop;
end;
$$;

create trigger protect_user_approval before update on public.users
for each row execute function public.protect_user_approval();

create trigger enforce_substitution_event before insert or update on public.substitutions
for each row execute function public.enforce_substitution_event();

create trigger audit_users after insert or update or delete on public.users
for each row execute function public.record_audit_log();
create trigger audit_user_roles after insert or update or delete on public.user_roles
for each row execute function public.record_audit_log();
create trigger audit_clubs after insert or update or delete on public.clubs
for each row execute function public.record_audit_log();
create trigger audit_fixtures after insert or update or delete on public.fixtures
for each row execute function public.record_audit_log();
create trigger audit_match_events after insert or update or delete on public.match_events
for each row execute function public.record_audit_log();
create trigger audit_transfers after insert or update or delete on public.transfers
for each row execute function public.record_audit_log();

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

revoke all on function public.get_invitation(text) from public;
revoke all on function public.accept_invitation(text) from public;
revoke all on function public.assign_role(uuid, public.app_role, uuid, uuid) from public;
revoke all on function public.set_user_approval(uuid, public.approval_status) from public;

grant execute on function public.get_invitation(text) to anon, authenticated;
grant execute on function public.accept_invitation(text) to authenticated;
grant execute on function public.assign_role(uuid, public.app_role, uuid, uuid) to authenticated;
grant execute on function public.set_user_approval(uuid, public.approval_status) to authenticated;
