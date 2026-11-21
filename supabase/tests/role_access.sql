begin;

set local role authenticated;

set local request.jwt.claim.sub = current_setting('test.supporter_id', true);

do $$
begin
  if not public.has_role('supporter') then
    raise exception 'Supporter role assertion failed';
  end if;

  if public.is_super_admin() then
    raise exception 'Supporter must not have platform access';
  end if;

  if public.is_authorised_club(current_setting('test.club_id', true)::uuid) then
    raise exception 'Supporter must not have club access';
  end if;
end $$;

do $$
begin
  insert into public.clubs (name, short_name, slug)
  values ('Unauthorised Club', 'UNA', 'unauthorised-club');
  raise exception 'Supporter must not insert clubs';
exception when insufficient_privilege then
  null;
end $$;

set local request.jwt.claim.sub = current_setting('test.club_admin_id', true);

do $$
begin
  if not public.is_authorised_club(current_setting('test.club_id', true)::uuid) then
    raise exception 'Club administrator club scope assertion failed';
  end if;

  if public.is_authorised_club(current_setting('test.other_club_id', true)::uuid) then
    raise exception 'Club administrator must not access another club';
  end if;
end $$;

update public.clubs set name = name where id = current_setting('test.club_id', true)::uuid;

do $$
begin
  update public.clubs set name = name where id = current_setting('test.other_club_id', true)::uuid;
  raise exception 'Club administrator must not update another club';
exception when insufficient_privilege then
  null;
end $$;

set local request.jwt.claim.sub = current_setting('test.league_admin_id', true);

do $$
begin
  if not public.is_assigned_competition(current_setting('test.competition_id', true)::uuid) then
    raise exception 'League administrator competition scope assertion failed';
  end if;

  if public.is_assigned_competition(current_setting('test.other_competition_id', true)::uuid) then
    raise exception 'League administrator must not access another competition';
  end if;
end $$;

update public.competitions set name = name where id = current_setting('test.competition_id', true)::uuid;

do $$
begin
  update public.competitions set name = name where id = current_setting('test.other_competition_id', true)::uuid;
  raise exception 'League administrator must not update another competition';
exception when insufficient_privilege then
  null;
end $$;

set local request.jwt.claim.sub = current_setting('test.match_official_id', true);

do $$
begin
  if not public.has_role('match_official') then
    raise exception 'Match official role assertion failed';
  end if;

  if not public.is_match_official_for(current_setting('test.fixture_id', true)::uuid) then
    raise exception 'Match official fixture assignment assertion failed';
  end if;
end $$;

set local request.jwt.claim.sub = current_setting('test.super_admin_id', true);

do $$
begin
  if not public.is_super_admin() then
    raise exception 'Super administrator role assertion failed';
  end if;

  perform 1 from public.audit_logs limit 1;
end $$;

reset role;
commit;
