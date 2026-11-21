grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on all tables in schema public to authenticated;
revoke insert, update, delete on all tables in schema public from anon;

create or replace function public.protect_registration_verification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status is distinct from old.status
    or new.verified_at is distinct from old.verified_at
    or new.verified_by is distinct from old.verified_by
  then
    if not (
      public.is_super_admin()
      or (
        new.status = 'verified'
        and new.competition_id is not null
        and public.is_assigned_competition(new.competition_id)
      )
      or (
        new.status <> 'verified'
        and (
          public.is_assigned_competition(new.competition_id)
          or public.is_authorised_club(new.club_id)
        )
      )
    ) then
      raise exception 'Registration verification can only be changed by an authorised administrator';
    end if;
  end if;

  return new;
end;
$$;

create or replace function public.protect_fixture_verification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status is distinct from old.status
    or new.is_verified is distinct from old.is_verified
    or new.verified_at is distinct from old.verified_at
    or new.verified_by is distinct from old.verified_by
  then
    if not (
      public.is_super_admin()
      or exists (
        select 1
        from public.competitions c
        where c.id = new.competition_id
          and public.is_assigned_competition(c.id)
      )
    ) then
      raise exception 'Fixture verification can only be changed by an authorised league administrator';
    end if;
  end if;

  return new;
end;
$$;

create or replace function public.protect_event_verification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.verification_status is distinct from old.verification_status
    or new.verified_at is distinct from old.verified_at
    or new.verified_by is distinct from old.verified_by
  then
    if not (
      public.is_super_admin()
      or exists (
        select 1
        from public.fixtures f
        where f.id = new.fixture_id
          and public.is_assigned_competition(f.competition_id)
      )
    ) then
      raise exception 'Match event verification can only be changed by an authorised league administrator';
    end if;
  end if;

  return new;
end;
$$;

create or replace function public.protect_transfer_approval()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status is distinct from old.status
    or new.approved_by is distinct from old.approved_by
    or new.approved_at is distinct from old.approved_at
  then
    if not (
      public.is_super_admin()
      or (
        new.competition_id is not null
        and public.is_assigned_competition(new.competition_id)
      )
    ) then
      raise exception 'Transfer approval can only be changed by an authorised administrator';
    end if;
  end if;

  return new;
end;
$$;

create trigger protect_registration_verification before update on public.player_registrations
for each row execute function public.protect_registration_verification();
create trigger protect_fixture_verification before update on public.fixtures
for each row execute function public.protect_fixture_verification();
create trigger protect_event_verification before update on public.match_events
for each row execute function public.protect_event_verification();
create trigger protect_transfer_approval before update on public.transfers
for each row execute function public.protect_transfer_approval();

alter table public.users enable row level security;
alter table public.user_roles enable row level security;
alter table public.clubs enable row level security;
alter table public.club_staff enable row level security;
alter table public.players enable row level security;
alter table public.player_registrations enable row level security;
alter table public.competitions enable row level security;
alter table public.seasons enable row level security;
alter table public.competition_teams enable row level security;
alter table public.fixtures enable row level security;
alter table public.match_lineups enable row level security;
alter table public.lineup_players enable row level security;
alter table public.match_events enable row level security;
alter table public.substitutions enable row level security;
alter table public.transfers enable row level security;
alter table public.audit_logs enable row level security;
alter table public.notifications enable row level security;
alter table public.user_invitations enable row level security;

create policy "Users can view own profile" on public.users
for select to authenticated using (id = auth.uid());
create policy "Admins can view all profiles" on public.users
for select to authenticated using (public.is_super_admin());
create policy "Users can update own profile" on public.users
for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "Admins can update profiles" on public.users
for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

create policy "Users can view own roles" on public.user_roles
for select to authenticated using (user_id = auth.uid());
create policy "Admins can view all roles" on public.user_roles
for select to authenticated using (public.is_super_admin());
create policy "Admins can insert roles" on public.user_roles
for insert to authenticated with check (public.is_super_admin());
create policy "Admins can update roles" on public.user_roles
for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "Admins can delete roles" on public.user_roles
for delete to authenticated using (public.is_super_admin());

create policy "Clubs are public" on public.clubs
for select to anon, authenticated using (true);
create policy "Admins can insert clubs" on public.clubs
for insert to authenticated with check (public.is_super_admin());
create policy "Authorised club admins can update clubs" on public.clubs
for update to authenticated using (public.is_super_admin() or public.is_authorised_club(id))
with check (public.is_super_admin() or public.is_authorised_club(id));
create policy "Admins can delete clubs" on public.clubs
for delete to authenticated using (public.is_super_admin());

create policy "Club staff visible to authorised users" on public.club_staff
for select to authenticated using (
  public.is_super_admin()
  or user_id = auth.uid()
  or public.is_authorised_club(club_id)
);
create policy "Admins can insert club staff" on public.club_staff
for insert to authenticated with check (public.is_super_admin() or public.is_authorised_club(club_id));
create policy "Authorised club admins can update club staff" on public.club_staff
for update to authenticated using (public.is_super_admin() or public.is_authorised_club(club_id))
with check (public.is_super_admin() or public.is_authorised_club(club_id));
create policy "Admins can delete club staff" on public.club_staff
for delete to authenticated using (public.is_super_admin() or public.is_authorised_club(club_id));

create policy "Players are public" on public.players
for select to anon, authenticated using (true);
create policy "Admins can insert players" on public.players
for insert to authenticated with check (public.is_super_admin());
create policy "Authorised club staff can update players" on public.players
for update to authenticated using (public.is_super_admin() or public.can_manage_player(id))
with check (public.is_super_admin() or public.can_manage_player(id));
create policy "Admins can delete players" on public.players
for delete to authenticated using (public.is_super_admin());

create policy "Registrations are public" on public.player_registrations
for select to anon, authenticated using (true);
create policy "Authorised clubs can insert registrations" on public.player_registrations
for insert to authenticated with check (
  public.is_super_admin()
  or public.is_authorised_club(club_id)
  or public.is_assigned_competition(competition_id)
);
create policy "Authorised admins can update registrations" on public.player_registrations
for update to authenticated using (
  public.is_super_admin()
  or public.is_authorised_club(club_id)
  or public.is_assigned_competition(competition_id)
)
with check (
  public.is_super_admin()
  or public.is_authorised_club(club_id)
  or public.is_assigned_competition(competition_id)
);
create policy "Admins can delete registrations" on public.player_registrations
for delete to authenticated using (public.is_super_admin());

create policy "Competitions are public" on public.competitions
for select to anon, authenticated using (true);
create policy "Admins can insert competitions" on public.competitions
for insert to authenticated with check (public.is_super_admin());
create policy "Assigned league admins can update competitions" on public.competitions
for update to authenticated using (public.is_super_admin() or public.is_assigned_competition(id))
with check (public.is_super_admin() or public.is_assigned_competition(id));
create policy "Admins can delete competitions" on public.competitions
for delete to authenticated using (public.is_super_admin());

create policy "Seasons are public" on public.seasons
for select to anon, authenticated using (true);
create policy "Admins can manage seasons" on public.seasons
for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

create policy "Competition teams are public" on public.competition_teams
for select to anon, authenticated using (true);
create policy "Assigned admins can manage competition teams" on public.competition_teams
for all to authenticated using (public.is_super_admin() or public.is_assigned_competition(competition_id))
with check (public.is_super_admin() or public.is_assigned_competition(competition_id));

create policy "Fixtures are public" on public.fixtures
for select to anon, authenticated using (true);
create policy "Authorised users can insert fixtures" on public.fixtures
for insert to authenticated with check (
  public.is_super_admin()
  or public.is_assigned_competition(competition_id)
  or (
    status <> 'verified'
    and (public.is_authorised_club(home_club_id) or public.is_authorised_club(away_club_id))
  )
);
create policy "Authorised users can update fixtures" on public.fixtures
for update to authenticated using (public.can_manage_fixture(id))
with check (
  public.can_manage_fixture(id)
  and (
    public.is_super_admin()
    or public.is_assigned_competition(competition_id)
    or (status <> 'verified' and not is_verified)
  )
);
create policy "Admins can delete fixtures" on public.fixtures
for delete to authenticated using (
  public.is_super_admin()
  or exists (select 1 from public.competitions c where c.id = competition_id and public.is_assigned_competition(c.id))
);

create policy "Lineups are public" on public.match_lineups
for select to anon, authenticated using (true);
create policy "Fixture maintainers can insert lineups" on public.match_lineups
for insert to authenticated with check (public.can_manage_fixture(fixture_id));
create policy "Fixture maintainers can update lineups" on public.match_lineups
for update to authenticated using (public.can_manage_fixture(fixture_id))
with check (public.can_manage_fixture(fixture_id));
create policy "Admins can delete lineups" on public.match_lineups
for delete to authenticated using (public.is_super_admin());

create policy "Lineup players are public" on public.lineup_players
for select to anon, authenticated using (true);
create policy "Lineup maintainers can insert players" on public.lineup_players
for insert to authenticated with check (public.can_manage_lineup(lineup_id));
create policy "Lineup maintainers can update players" on public.lineup_players
for update to authenticated using (public.can_manage_lineup(lineup_id))
with check (public.can_manage_lineup(lineup_id));
create policy "Lineup maintainers can delete players" on public.lineup_players
for delete to authenticated using (public.can_manage_lineup(lineup_id));

create policy "Verified events are public" on public.match_events
for select to anon, authenticated using (verification_status = 'verified');
create policy "Fixture maintainers can view events" on public.match_events
for select to authenticated using (public.can_manage_fixture(fixture_id) or created_by = auth.uid());
create policy "Fixture maintainers can insert events" on public.match_events
for insert to authenticated with check (
  public.can_manage_fixture(fixture_id)
  and (
    verification_status = 'pending'
    or public.is_super_admin()
    or exists (
      select 1 from public.fixtures f
      where f.id = fixture_id and public.is_assigned_competition(f.competition_id)
    )
  )
);
create policy "Fixture maintainers can update events" on public.match_events
for update to authenticated using (public.can_manage_fixture(fixture_id) or created_by = auth.uid())
with check (
  public.can_manage_fixture(fixture_id)
  and (
    verification_status = 'pending'
    or public.is_super_admin()
    or exists (
      select 1 from public.fixtures f
      where f.id = fixture_id and public.is_assigned_competition(f.competition_id)
    )
  )
);
create policy "Admins can delete events" on public.match_events
for delete to authenticated using (
  public.is_super_admin()
  or exists (
    select 1 from public.fixtures f
    where f.id = fixture_id
      and verification_status <> 'verified'
      and public.is_assigned_competition(f.competition_id)
  )
);

create policy "Substitutions follow event visibility" on public.substitutions
for select to anon, authenticated using (
  exists (
    select 1 from public.match_events me
    where me.id = match_event_id
      and (me.verification_status = 'verified' or public.can_manage_fixture(me.fixture_id))
  )
);
create policy "Event maintainers can insert substitutions" on public.substitutions
for insert to authenticated with check (public.can_manage_event(match_event_id));
create policy "Event maintainers can update substitutions" on public.substitutions
for update to authenticated using (public.can_manage_event(match_event_id))
with check (public.can_manage_event(match_event_id));
create policy "Event maintainers can delete substitutions" on public.substitutions
for delete to authenticated using (public.can_manage_event(match_event_id));

create policy "Approved transfers are public" on public.transfers
for select to anon, authenticated using (status in ('approved', 'completed'));
create policy "Related clubs can view transfers" on public.transfers
for select to authenticated using (
  public.is_super_admin()
  or public.is_authorised_club(from_club_id)
  or public.is_authorised_club(to_club_id)
  or public.is_assigned_competition(competition_id)
);
create policy "Authorised users can insert transfers" on public.transfers
for insert to authenticated with check (
  public.is_super_admin()
  or public.is_assigned_competition(competition_id)
  or (
    status in ('draft', 'pending')
    and public.is_authorised_club(from_club_id)
  )
);
create policy "Authorised users can update transfers" on public.transfers
for update to authenticated using (
  public.is_super_admin()
  or public.is_assigned_competition(competition_id)
  or public.is_authorised_club(from_club_id)
  or public.is_authorised_club(to_club_id)
)
with check (
  public.is_super_admin()
  or public.is_assigned_competition(competition_id)
  or public.is_authorised_club(from_club_id)
  or public.is_authorised_club(to_club_id)
);
create policy "Admins can delete transfers" on public.transfers
for delete to authenticated using (public.is_super_admin());

create policy "Admins can view audit logs" on public.audit_logs
for select to authenticated using (public.is_super_admin());

create policy "Users can view own notifications" on public.notifications
for select to authenticated using (user_id = auth.uid());
create policy "Admins can view notifications" on public.notifications
for select to authenticated using (public.is_super_admin());
create policy "Admins can insert notifications" on public.notifications
for insert to authenticated with check (public.is_super_admin());
create policy "Users can mark own notifications read" on public.notifications
for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "Admins can view invitations" on public.user_invitations
for select to authenticated using (public.is_super_admin());
create policy "Invited users can view own invitation" on public.user_invitations
for select to authenticated using (
  exists (select 1 from public.users u where u.id = auth.uid() and u.email = user_invitations.email)
);
create policy "Authorised admins can insert invitations" on public.user_invitations
for insert to authenticated with check (
  public.is_super_admin()
  or (
    has_role('club_administrator')
    and role in ('club_administrator', 'coach', 'assistant_coach', 'team_manager')
    and public.is_authorised_club(club_id)
  )
  or (
    role in ('league_administrator', 'match_official')
    and public.is_assigned_competition(competition_id)
  )
);
create policy "Authorised admins can update invitations" on public.user_invitations
for update to authenticated using (
  public.is_super_admin()
  or public.is_authorised_club(club_id)
  or public.is_assigned_competition(competition_id)
)
with check (
  public.is_super_admin()
  or public.is_authorised_club(club_id)
  or public.is_assigned_competition(competition_id)
);
create policy "Admins can delete invitations" on public.user_invitations
for delete to authenticated using (public.is_super_admin());
