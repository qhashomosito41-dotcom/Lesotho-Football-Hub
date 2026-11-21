import { DEMO_TEAMS, type DemoTeam } from './homepage'
import {
  calculateStandings,
  COMPETITIONS,
  competitionName,
  MATCH_RESULTS,
  SCHEDULE,
  SEASON_CURRENT,
  type CompetitionId,
} from './league'
import { getLineup } from './matches'

export interface ClubProfile extends DemoTeam {
  established: number
  district: string
  stadium: string
  colors: string
  coach: string
  competitionId: CompetitionId
  competition: string
}

interface ClubSeed {
  established: number
  district: string
  stadium: string
  coach: string
  competitionId: CompetitionId
}

const CLUB_SEEDS: Record<string, ClubSeed> = {
  bantu: { established: 1932, district: 'Maseru', stadium: 'Makoanyane Square', coach: 'Halemakale Mahlaha', competitionId: 'premier-league' },
  matlama: { established: 1932, district: 'Maseru', stadium: 'Setsoto Stadium', coach: 'Moses Maliehe', competitionId: 'premier-league' },
  lioli: { established: 1938, district: 'Berea', stadium: 'Teyateyaneng Stadium', coach: 'Teboho Mokoena', competitionId: 'premier-league' },
  lmps: { established: 1935, district: 'Maseru', stadium: 'LMPS Ground', coach: 'Thabo Makhele', competitionId: 'premier-league' },
  lcs: { established: 1965, district: 'Maseru', stadium: 'LCS Ground', coach: 'Mpho Mokhosi', competitionId: 'premier-league' },
  linare: { established: 1934, district: 'Leribe', stadium: 'Hlotse Stadium', coach: 'Lehlohonolo Thabane', competitionId: 'premier-league' },
  ldf: { established: 1937, district: 'Maseru', stadium: 'LDF Ground', coach: 'Thabo Mokoena', competitionId: 'premier-league' },
  swallows: { established: 1959, district: 'Maseru', stadium: 'Makoanyane Square', coach: 'Kagiso Mbeki', competitionId: 'premier-league' },
  kick4life: { established: 2005, district: 'Maseru', stadium: 'Kick4Life Centre', coach: 'Neo Phiri', competitionId: 'premier-league' },
  lijabatho: { established: 1969, district: 'Leribe', stadium: 'Maputsoe Stadium', coach: 'Sello Nkosi', competitionId: 'premier-league' },
  manonyane: { established: 1978, district: 'Maseru', stadium: 'Manonyane Ground', coach: 'Pule Thabane', competitionId: 'premier-league' },
  ccx: { established: 1982, district: 'Maseru', stadium: 'CCX Ground', coach: 'Mpho Khumalo', competitionId: 'premier-league' },
  mphatlalatsane: { established: 1974, district: 'Maseru', stadium: 'Mphatlalatsane Ground', coach: 'Lebohang Ntsane', competitionId: 'championship' },
  lifofane: { established: 1988, district: 'Berea', stadium: 'Lifofane Ground', coach: 'Bongani Zulu', competitionId: 'championship' },
}

function buildClub(team: DemoTeam, seed: ClubSeed): ClubProfile {
  return {
    ...team,
    ...seed,
    colors: `${team.name} primary colour with white trim`,
    competition: competitionName(seed.competitionId),
  }
}

export const CLUB_PROFILES: Record<string, ClubProfile> = Object.fromEntries(
  Object.entries(DEMO_TEAMS).map(([id, team]) => [id, buildClub(team, CLUB_SEEDS[id])]),
)

export const CLUB_LIST: ClubProfile[] = Object.values(CLUB_PROFILES)

export function getClub(clubId: string | undefined): ClubProfile | undefined {
  return clubId ? CLUB_PROFILES[clubId] : undefined
}

export function clubSquad(clubId: string) {
  return getLineup(clubId)?.starters ?? []
}

export function clubBench(clubId: string) {
  return getLineup(clubId)?.substitutes ?? []
}

export function recentResultsFor(clubId: string, limit = 5) {
  return MATCH_RESULTS.filter((match) => match.home.id === clubId || match.away.id === clubId)
    .sort((first, second) => second.dateISO.localeCompare(first.dateISO))
    .slice(0, limit)
}

export function upcomingFixturesFor(clubId: string, limit = 5) {
  return SCHEDULE.filter((fixture) => fixture.home.id === clubId || fixture.away.id === clubId)
    .sort((first, second) => first.dateISO.localeCompare(second.dateISO) || first.kickoff.localeCompare(second.kickoff))
    .slice(0, limit)
}

export function clubStatistics(clubId: string) {
  const club = getClub(clubId)
  const standing = club
    ? calculateStandings(club.competitionId, SEASON_CURRENT).find((row) => row.team.id === clubId)
    : undefined
  const matches = MATCH_RESULTS.filter(
    (match) =>
      match.season === SEASON_CURRENT &&
      (match.home.id === clubId || match.away.id === clubId),
  )
  const cleanSheets = matches.filter((match) =>
    match.home.id === clubId ? match.awayGoals === 0 : match.homeGoals === 0,
  ).length

  return {
    position: standing?.position ?? null,
    played: standing?.played ?? matches.length,
    won: standing?.won ?? 0,
    drawn: standing?.drawn ?? 0,
    lost: standing?.lost ?? 0,
    goalsFor: standing?.goalFor ?? 0,
    goalsAgainst: standing?.goalAgainst ?? 0,
    goalDifference: standing?.goalDifference ?? 0,
    points: standing?.points ?? 0,
    cleanSheets,
    form: standing?.form ?? [],
  }
}

export function clubCompetitionOptions() {
  return COMPETITIONS.map((competition) => ({ value: competition.id, label: competition.name }))
}
