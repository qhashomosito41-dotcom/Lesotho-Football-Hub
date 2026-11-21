insert into public.clubs (id, name, short_name, slug, primary_color, secondary_color, stadium, district, status)
values
  ('11111111-1111-4111-8111-111111111111', 'Matlama FC', 'MAT', 'matlama-fc', '#006B3F', '#FFFFFF', 'Setsoto Stadium', 'Maseru', 'active'),
  ('22222222-2222-4222-8222-222222222222', 'Bantu FC', 'BAN', 'bantu-fc', '#B91C1C', '#FFFFFF', 'Hlotse Stadium', 'Leribe', 'active'),
  ('33333333-3333-4333-8333-333333333333', 'LCS FC', 'LCS', 'lcs-fc', '#1D4ED8', '#FFFFFF', 'Maseru Stadium', 'Maseru', 'active'),
  ('44444444-4444-4444-8444-444444444444', 'LDF FC', 'LDF', 'ldf-fc', '#15803D', '#FACC15', 'Maseru Stadium', 'Maseru', 'active'),
  ('55555555-5555-4555-8555-555555555555', 'LMPS FC', 'LMP', 'lmps-fc', '#0F172A', '#F97316', 'Maseru Stadium', 'Maseru', 'active'),
  ('66666666-6666-4666-8666-666666666666', 'Marumo Gallants Lesotho', 'MGL', 'marumo-gallants-lesotho', '#7C3AED', '#FFFFFF', 'Setsoto Stadium', 'Maseru', 'active')
on conflict (id) do nothing;

insert into public.seasons (id, name, start_date, end_date, is_active)
values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '2025-26', date '2025-08-01', date '2026-05-31', true)
on conflict (id) do nothing;

insert into public.competitions (id, name, short_name, slug, code, category, format, status, country, governing_body)
values
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'Vodacom Premier League', 'VPL', 'vodacom-premier-league', 'VPL', 'league', 'league', 'active', 'Lesotho', 'Lesotho Football Association'),
  ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'Federation Cup', 'FED', 'federation-cup', 'FED', 'cup', 'knockout', 'active', 'Lesotho', 'Lesotho Football Association'),
  ('dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'Lesotho Championship', 'CHAMP', 'lesotho-championship', 'CHAMP', 'league', 'league', 'active', 'Lesotho', 'Lesotho Football Association')
on conflict (id) do nothing;

insert into public.competition_teams (competition_id, season_id, club_id, status)
select 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', c.id, 'active'
from public.clubs c
where c.status = 'active'
on conflict do nothing;
