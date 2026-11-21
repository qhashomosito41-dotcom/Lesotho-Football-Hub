import type { LeagueTableRow } from '@/components/ui'
import type { MatchOutcome } from '@/types'
import { clubPath, DEMO_TEAMS, TODAY_FIXTURES, type DemoTeam } from './homepage'

export const SEASON_CURRENT = '2025/26'
export const SEASONS = ['2025/26', '2024/25']

export const COMPETITIONS = [
  { id: 'premier-league', name: 'Vodacom Premier League', hasTable: true },
  { id: 'championship', name: 'Lesotho Championship', hasTable: true },
  { id: 'knockout-cup', name: 'LNFA Knockout Cup', hasTable: false },
] as const

export type CompetitionId = (typeof COMPETITIONS)[number]['id']

export function competitionName(id: string): string {
  return COMPETITIONS.find((competition) => competition.id === id)?.name ?? id
}

export function competitionById(id: string): (typeof COMPETITIONS)[number] | undefined {
  return COMPETITIONS.find((competition) => competition.id === id)
}

function competitionIdForName(name: string): CompetitionId {
  const found = COMPETITIONS.find((competition) => competition.name === name)
  return found?.id ?? 'premier-league'
}

const VENUES: Record<string, string> = {
  bantu: 'Makoanyane Square, Maseru',
  matlama: 'Setsoto Stadium, Maseru',
  lioli: 'Teyateyaneng Stadium, Berea',
  lmps: 'LMPS Ground, Maseru',
  lcs: 'LCS Ground, Maseru',
  linare: 'Hlotse Stadium, Leribe',
  ldf: 'LDF Ground, Maseru',
  swallows: 'Makoanyane Square, Maseru',
  kick4life: 'Kick4Life Centre, Maseru',
  lijabatho: 'Maputsoe Stadium, Leribe',
  manonyane: 'Manonyane Ground, Maseru',
  ccx: 'CCX Ground, Maseru',
  mphatlalatsane: 'Mphatlalatsane Ground, Maseru',
  lifofane: 'Lifofane Ground, Maseru',
}

function venueFor(team: DemoTeam): string {
  return VENUES[team.id] ?? `${team.name} Ground, Maseru`
}

export interface ScheduleFixture {
  id: string
  competitionId: CompetitionId
  season: string
  round: string
  home: DemoTeam
  away: DemoTeam
  dateISO: string
  kickoff: string
  venue: string
}

export const SCHEDULE: ScheduleFixture[] = [
  ...TODAY_FIXTURES.map((fixture) => ({
    id: fixture.id,
    competitionId: competitionIdForName(fixture.competition),
    season: SEASON_CURRENT,
    round: fixture.round,
    home: fixture.home,
    away: fixture.away,
    dateISO: '2026-11-21',
    kickoff: fixture.kickoff,
    venue: fixture.venue,
  })),
  {
    id: 'bantu-lcs-fixture',
    competitionId: 'premier-league',
    season: SEASON_CURRENT,
    round: 'Matchweek 7',
    home: DEMO_TEAMS.bantu,
    away: DEMO_TEAMS.lcs,
    dateISO: '2026-11-22',
    kickoff: '15:00',
    venue: venueFor(DEMO_TEAMS.bantu),
  },
  {
    id: 'matlama-lioli-fixture',
    competitionId: 'premier-league',
    season: SEASON_CURRENT,
    round: 'Matchweek 7',
    home: DEMO_TEAMS.matlama,
    away: DEMO_TEAMS.lioli,
    dateISO: '2026-11-22',
    kickoff: '17:00',
    venue: venueFor(DEMO_TEAMS.matlama),
  },
  {
    id: 'ccx-kick4life-cup',
    competitionId: 'knockout-cup',
    season: SEASON_CURRENT,
    round: 'Quarter-final',
    home: DEMO_TEAMS.ccx,
    away: DEMO_TEAMS.kick4life,
    dateISO: '2026-11-25',
    kickoff: '19:00',
    venue: venueFor(DEMO_TEAMS.ccx),
  },
  {
    id: 'swallows-manonyane-cup',
    competitionId: 'knockout-cup',
    season: SEASON_CURRENT,
    round: 'Quarter-final',
    home: DEMO_TEAMS.swallows,
    away: DEMO_TEAMS.manonyane,
    dateISO: '2026-11-25',
    kickoff: '19:00',
    venue: venueFor(DEMO_TEAMS.swallows),
  },
  {
    id: 'lifofane-mphatlalatsane',
    competitionId: 'championship',
    season: SEASON_CURRENT,
    round: 'Matchweek 5',
    home: DEMO_TEAMS.lifofane,
    away: DEMO_TEAMS.mphatlalatsane,
    dateISO: '2026-11-28',
    kickoff: '14:30',
    venue: venueFor(DEMO_TEAMS.lifofane),
  },
  {
    id: 'lijabatho-ldf-fixture',
    competitionId: 'premier-league',
    season: SEASON_CURRENT,
    round: 'Matchweek 7',
    home: DEMO_TEAMS.lijabatho,
    away: DEMO_TEAMS.ldf,
    dateISO: '2026-11-28',
    kickoff: '15:00',
    venue: venueFor(DEMO_TEAMS.lijabatho),
  },
  {
    id: 'lmps-bantu-archive',
    competitionId: 'premier-league',
    season: '2024/25',
    round: 'Matchweek 30',
    home: DEMO_TEAMS.lmps,
    away: DEMO_TEAMS.bantu,
    dateISO: '2025-11-22',
    kickoff: '15:00',
    venue: venueFor(DEMO_TEAMS.lmps),
  },
  {
    id: 'matlama-lioli-archive',
    competitionId: 'premier-league',
    season: '2024/25',
    round: 'Matchweek 30',
    home: DEMO_TEAMS.matlama,
    away: DEMO_TEAMS.lioli,
    dateISO: '2025-11-22',
    kickoff: '17:00',
    venue: venueFor(DEMO_TEAMS.matlama),
  },
  {
    id: 'ccx-lifofane-archive',
    competitionId: 'championship',
    season: '2024/25',
    round: 'Matchweek 22',
    home: DEMO_TEAMS.ccx,
    away: DEMO_TEAMS.lifofane,
    dateISO: '2025-11-23',
    kickoff: '14:30',
    venue: venueFor(DEMO_TEAMS.ccx),
  },
]

export interface MatchResult {
  id: string
  competitionId: CompetitionId
  season: string
  round: string
  home: DemoTeam
  away: DemoTeam
  homeGoals: number
  awayGoals: number
  dateISO: string
  venue: string
}

const PREMIER_TEAM_IDS = [
  'bantu',
  'matlama',
  'lioli',
  'lmps',
  'lcs',
  'linare',
  'ldf',
  'swallows',
  'kick4life',
  'lijabatho',
  'manonyane',
  'ccx',
]

const CHAMPIONSHIP_TEAM_IDS = [
  'mphatlalatsane',
  'lifofane',
  'kick4life',
  'lijabatho',
  'manonyane',
  'ccx',
  'ldf',
  'swallows',
]

function hash(value: string): number {
  let result = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    result = Math.imul(result ^ value.charCodeAt(index), 16777619)
  }
  return result >>> 0
}

function roll(key: string): number {
  return ((hash(key) % 10000) + 1) / 10001
}

function isoDate(start: string, days: number): string {
  const date = new Date(`${start}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

function generateResults(
  teamIds: string[],
  competitionId: CompetitionId,
  season: string,
  startDate: string,
  roundCount: number,
  seed: number,
): MatchResult[] {
  const teams = teamIds.map((id) => DEMO_TEAMS[id])
  const rotation = [...teams]
  const results: MatchResult[] = []
  const roundPrefix = competitionId === 'premier-league' ? 'Matchweek' : 'Round'

  for (let round = 0; round < roundCount; round += 1) {
    for (let index = 0; index < rotation.length / 2; index += 1) {
      const home = rotation[index]
      const away = rotation[rotation.length - 1 - index]
      const key = `${seed}-${competitionId}-${season}-${round}-${home.id}-${away.id}`
      const strength = (team: DemoTeam) => (teamIds.length - teamIds.indexOf(team.id)) / teamIds.length
      const homeMean = 0.55 + strength(home) * 1.9 - strength(away) * 0.75 + roll(`${key}-h`) * 0.6
      const awayMean = 0.45 + strength(away) * 1.6 - strength(home) * 0.65 + roll(`${key}-a`) * 0.6
      const homeGoals = Math.max(0, Math.min(5, Math.floor(homeMean * (0.55 + roll(`${key}-x`) * 0.9))))
      const awayGoals = Math.max(0, Math.min(5, Math.floor(awayMean * (0.55 + roll(`${key}-y`) * 0.9))))

      results.push({
        id: `${competitionId}-${season.replace('/', '-')}-${round + 1}-${home.id}-${away.id}`,
        competitionId,
        season,
        round: `${roundPrefix} ${round + 1}`,
        home,
        away,
        homeGoals,
        awayGoals,
        dateISO: isoDate(startDate, round * 7 + (index % 2)),
        venue: venueFor(home),
      })
    }
    rotation.splice(1, 0, rotation.pop()!)
  }

  return results
}

export const MATCH_RESULTS: MatchResult[] = [
  ...generateResults(PREMIER_TEAM_IDS, 'premier-league', SEASON_CURRENT, '2026-09-12', 5, 1),
  ...generateResults(CHAMPIONSHIP_TEAM_IDS, 'championship', SEASON_CURRENT, '2026-09-13', 4, 2),
  ...generateResults(PREMIER_TEAM_IDS, 'premier-league', '2024/25', '2025-09-13', 5, 3),
]

export interface StandingRow extends LeagueTableRow {
  goalFor: number
  goalAgainst: number
  form: MatchOutcome[]
  to: string
}

interface Tally {
  team: DemoTeam
  played: number
  won: number
  drawn: number
  lost: number
  goalFor: number
  goalAgainst: number
  form: { dateISO: string; outcome: MatchOutcome }[]
}

export function calculateStandings(
  competitionId: CompetitionId,
  season: string,
  results: MatchResult[] = MATCH_RESULTS,
): StandingRow[] {
  const matches = results
    .filter((result) => result.competitionId === competitionId && result.season === season)
    .sort((first, second) => first.dateISO.localeCompare(second.dateISO))
  const teamIds = Array.from(new Set(matches.flatMap((match) => [match.home.id, match.away.id])))
  const tallies = new Map<string, Tally>(
    teamIds.map((id) => [
      id,
      {
        team: DEMO_TEAMS[id],
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalFor: 0,
        goalAgainst: 0,
        form: [],
      },
    ]),
  )

  for (const match of matches) {
    const home = tallies.get(match.home.id)!
    const away = tallies.get(match.away.id)!
    home.played += 1
    away.played += 1
    home.goalFor += match.homeGoals
    home.goalAgainst += match.awayGoals
    away.goalFor += match.awayGoals
    away.goalAgainst += match.homeGoals

    const homeOutcome: MatchOutcome =
      match.homeGoals > match.awayGoals ? 'win' : match.homeGoals === match.awayGoals ? 'draw' : 'loss'
    const awayOutcome: MatchOutcome = homeOutcome === 'win' ? 'loss' : homeOutcome === 'loss' ? 'win' : 'draw'

    if (homeOutcome === 'win') home.won += 1
    else if (homeOutcome === 'draw') home.drawn += 1
    else home.lost += 1

    if (awayOutcome === 'win') away.won += 1
    else if (awayOutcome === 'draw') away.drawn += 1
    else away.lost += 1

    home.form.push({ dateISO: match.dateISO, outcome: homeOutcome })
    away.form.push({ dateISO: match.dateISO, outcome: awayOutcome })
  }

  const sorted = Array.from(tallies.values()).sort(
    (first, second) =>
      second.won * 3 + second.drawn - (first.won * 3 + first.drawn) ||
      second.goalFor - second.goalAgainst - (first.goalFor - first.goalAgainst) ||
      second.goalFor - first.goalFor ||
      first.team.name.localeCompare(second.team.name),
  )

  return sorted.map((tally, index) => ({
    position: index + 1,
    team: tally.team,
    played: tally.played,
    won: tally.won,
    drawn: tally.drawn,
    lost: tally.lost,
    goalFor: tally.goalFor,
    goalAgainst: tally.goalAgainst,
    goalDifference: tally.goalFor - tally.goalAgainst,
    points: tally.won * 3 + tally.drawn,
    form: tally.form
      .sort((first, second) => second.dateISO.localeCompare(first.dateISO))
      .slice(0, 5)
      .map((entry) => entry.outcome),
    to: clubPath(tally.team.id),
  }))
}

export function formatDateLabel(dateISO: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${dateISO}T12:00:00Z`))
}

export function formatDateShort(dateISO: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(new Date(`${dateISO}T12:00:00Z`))
}
