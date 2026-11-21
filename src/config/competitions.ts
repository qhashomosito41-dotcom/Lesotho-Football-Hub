import { DEMO_TEAMS, TOP_SCORERS, type DemoTeam } from './homepage'
import { MATCH_RESULTS, SCHEDULE, SEASON_CURRENT } from './league'
import { competitionName } from './league'

export type CompetitionFormat = 'league' | 'group-stage' | 'knockout' | 'combined'

export interface CompetitionTeam {
  id: string
  name: string
  shortName: string
  color: string
  isPlaceholder?: boolean
}

export interface CompetitionProfile {
  id: string
  slug: string
  name: string
  shortName: string
  format: CompetitionFormat
  typeLabel: string
  status: 'Active' | 'Upcoming' | 'Completed'
  season: string
  founded: number
  description: string
  currentRound: string
  participants: DemoTeam[]
  groupNames?: string[]
  color: string
  logoUrl: string
}

export interface Group {
  name: string
  teams: DemoTeam[]
}

export interface CompetitionResult {
  id: string
  season: string
  round: string
  home: DemoTeam
  away: DemoTeam
  homeScore: number
  awayScore: number
  dateISO: string
  venue: string
  group?: string
}

export interface CompetitionFixture {
  id: string
  season: string
  round: string
  home: DemoTeam
  away: DemoTeam
  dateISO: string
  kickoff: string
  venue: string
  group?: string
}

export interface BracketMatch {
  id: string
  home: CompetitionTeam
  away: CompetitionTeam
  winnerId: string | null
  dateISO?: string
}

export interface BracketRound {
  name: string
  matches: BracketMatch[]
}

export interface HistoricalRecord {
  season: string
  champion: string
  runnerUp: string
  topScorer: string
  matches: number
  goals: number
}

export interface CompetitionTableRow {
  position: number
  team: DemoTeam
  played: number
  won: number
  drawn: number
  lost: number
  goalFor: number
  goalAgainst: number
  goalDifference: number
  points: number
}

const PREMIER_IDS = [
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

const CHAMPIONSHIP_IDS = [
  'mphatlalatsane',
  'lifofane',
  'kick4life',
  'lijabatho',
  'manonyane',
  'ccx',
  'ldf',
  'swallows',
]

const CUP_IDS = [...PREMIER_IDS, 'mphatlalatsane', 'lifofane']
const CHARITY_IDS = ['bantu', 'matlama', 'lioli', 'lmps', 'lcs', 'linare', 'ldf', 'swallows']
const DISTRICT_IDS = ['kick4life', 'lijabatho', 'manonyane', 'ccx', 'mphatlalatsane', 'lifofane', 'ldf', 'swallows']

export const COMPETITION_SEASONS = ['2025/26', '2024/25', '2023/24']

function teams(ids: string[]): DemoTeam[] {
  return ids.map((id) => DEMO_TEAMS[id])
}

function logo(name: string, color: string): string {
  const label = name
    .split(' ')
    .filter((word) => word.length > 2)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0f1d33"/><path d="M20 12h24v8c0 9-5 15-12 15S20 29 20 20z" fill="${color}"/><path d="M20 15h-6v4c0 5 3 8 7 8m23-12h6v4c0 5-3 8-7 8" fill="none" stroke="${color}" stroke-width="3"/><path d="M32 35v9m-8 8h16l-3-8H27z" fill="${color}"/><text x="32" y="28" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" font-weight="bold" fill="#fff">${label}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

function profile(
  config: Omit<CompetitionProfile, 'logoUrl' | 'participants'> & { participants: string[] },
): CompetitionProfile {
  return {
    ...config,
    participants: teams(config.participants),
    logoUrl: logo(config.shortName, config.color),
  }
}

export const COMPETITION_PROFILES: CompetitionProfile[] = [
  profile({
    id: 'premier-league',
    slug: 'vodacom-premier-league',
    name: 'Vodacom Premier League',
    shortName: 'VPL',
    format: 'league',
    typeLabel: 'League competition',
    status: 'Active',
    season: SEASON_CURRENT,
    founded: 1966,
    description:
      'Lesotho’s top-flight league. Twelve clubs play a double round-robin, with points awarded for wins and draws.',
    currentRound: 'Matchweek 6',
    participants: PREMIER_IDS,
    color: '#facc15',
  }),
  profile({
    id: 'championship',
    slug: 'championship',
    name: 'Lesotho Championship',
    shortName: 'LCH',
    format: 'league',
    typeLabel: 'League competition',
    status: 'Active',
    season: SEASON_CURRENT,
    founded: 1970,
    description:
      'The second tier of Lesotho football, with promotion places available to the leading clubs at the end of the season.',
    currentRound: 'Matchweek 5',
    participants: CHAMPIONSHIP_IDS,
    color: '#38bdf8',
  }),
  profile({
    id: 'knockout-cup',
    slug: 'knockout-cup',
    name: 'LNFA Knockout Cup',
    shortName: 'LNC',
    format: 'knockout',
    typeLabel: 'Knockout tournament',
    status: 'Active',
    season: SEASON_CURRENT,
    founded: 1978,
    description:
      'The national cup. Every tie is a single match, with winners advancing through the rounds to the final.',
    currentRound: 'Quarter-finals',
    participants: CUP_IDS,
    color: '#a78bfa',
  }),
  profile({
    id: 'charity-cup',
    slug: 'charity-cup',
    name: 'Lesotho Charity Cup',
    shortName: 'LCC',
    format: 'combined',
    typeLabel: 'Group stage + knockout',
    status: 'Active',
    season: SEASON_CURRENT,
    founded: 1994,
    description:
      'A combined-format tournament: eight clubs play two groups, then the group winners and runners-up enter the knockout phase.',
    currentRound: 'Group stage',
    participants: CHARITY_IDS,
    groupNames: ['Group A', 'Group B'],
    color: '#fb7185',
  }),
  profile({
    id: 'district-cup',
    slug: 'district-cup',
    name: 'Maseru District Cup',
    shortName: 'MDC',
    format: 'group-stage',
    typeLabel: 'Group-stage tournament',
    status: 'Upcoming',
    season: SEASON_CURRENT,
    founded: 2002,
    description:
      'A regional group-stage competition with two groups of four. Group positions decide the final placement order.',
    currentRound: 'Group stage',
    participants: DISTRICT_IDS,
    groupNames: ['Group A', 'Group B'],
    color: '#34d399',
  }),
]

export function getCompetition(slugOrId: string | undefined): CompetitionProfile | undefined {
  return COMPETITION_PROFILES.find(
    (competition) => competition.slug === slugOrId || competition.id === slugOrId,
  )
}

export function competitionPath(competition: CompetitionProfile): string {
  return `/competitions/${competition.slug}`
}

export function groupsFor(competition: CompetitionProfile): Group[] {
  if (!competition.groupNames) return []
  return competition.groupNames.map((name, index) => ({
    name,
    teams: competition.participants.filter(
      (_, teamIndex) => teamIndex % competition.groupNames!.length === index,
    ),
  }))
}

function hash(input: string): number {
  let value = 0
  for (let index = 0; index < input.length; index += 1) {
    value = (value * 31 + input.charCodeAt(index)) >>> 0
  }
  return value
}

function isoDate(start: string, days: number): string {
  const date = new Date(`${start}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

export function competitionResults(competition: CompetitionProfile, season: string): CompetitionResult[] {
  if (competition.id === 'premier-league' || competition.id === 'championship') {
    return MATCH_RESULTS.filter(
      (result) =>
        (competition.id === 'premier-league' ? result.competitionId === 'premier-league' : result.competitionId === 'championship') &&
        result.season === season,
    ).map((result) => ({
      id: result.id,
      season: result.season,
      round: result.round,
      home: result.home,
      away: result.away,
      homeScore: result.homeGoals,
      awayScore: result.awayGoals,
      dateISO: result.dateISO,
      venue: result.venue,
    }))
  }

  if (season !== SEASON_CURRENT) return []
  const groups = groupsFor(competition)
  const source = groups.length > 0 ? groups.flatMap((group) => group.teams) : competition.participants
  const kickoff = competition.format === 'knockout' ? '2026-09-05' : '2026-09-12'
  const results: CompetitionResult[] = []

  for (let round = 0; round < 3; round += 1) {
    source.forEach((home, homeIndex) => {
      const away = source[(homeIndex + round + 1) % source.length]
      if (home.id === away.id || round > 1) return
      const seed = hash(`${competition.id}-${season}-${home.id}-${away.id}-${round}`)
      results.push({
        id: `${competition.id}-${season}-r${round}-${home.id}-${away.id}`,
        season,
        round: `Round ${round + 1}`,
        home,
        away,
        homeScore: seed % 4,
        awayScore: (seed >> 3) % 3,
        dateISO: isoDate(kickoff, round * 7 + (homeIndex % 2)),
        venue: `${home.name} Ground, Maseru`,
        group: groups.find((group) => group.teams.some((team) => team.id === home.id))?.name,
      })
    })
  }
  return results
}

export function competitionFixtures(competition: CompetitionProfile, season: string): CompetitionFixture[] {
  if (competition.id === 'premier-league' || competition.id === 'championship') {
    return SCHEDULE.filter(
      (fixture) =>
        (competition.id === 'premier-league'
          ? fixture.competitionId === 'premier-league'
          : fixture.competitionId === 'championship') && fixture.season === season,
    ).map((fixture) => ({
      id: fixture.id,
      season: fixture.season,
      round: fixture.round,
      home: fixture.home,
      away: fixture.away,
      dateISO: fixture.dateISO,
      kickoff: fixture.kickoff,
      venue: fixture.venue,
    }))
  }

  const results = competitionResults(competition, season)
  return results.slice(0, 6).map((result, index) => ({
    id: `fixture-${result.id}`,
    season: result.season,
    round: `Matchday ${index + 1}`,
    home: result.home,
    away: result.away,
    dateISO: isoDate('2026-11-28', index * 3),
    kickoff: index % 2 === 0 ? '15:00' : '19:00',
    venue: result.venue,
    group: result.group,
  }))
}

export function calculateCompetitionTable(
  teams: DemoTeam[],
  results: CompetitionResult[],
): CompetitionTableRow[] {
  const tallies = new Map<string, CompetitionTableRow>(
    teams.map((team) => [
      team.id,
      {
        position: 0,
        team,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalFor: 0,
        goalAgainst: 0,
        goalDifference: 0,
        points: 0,
      },
    ]),
  )

  for (const result of results) {
    const home = tallies.get(result.home.id)
    const away = tallies.get(result.away.id)
    if (!home || !away) continue
    home.played += 1
    away.played += 1
    home.goalFor += result.homeScore
    home.goalAgainst += result.awayScore
    away.goalFor += result.awayScore
    away.goalAgainst += result.homeScore
    if (result.homeScore > result.awayScore) {
      home.won += 1
      away.lost += 1
    } else if (result.homeScore < result.awayScore) {
      away.won += 1
      home.lost += 1
    } else {
      home.drawn += 1
      away.drawn += 1
    }
  }

  return Array.from(tallies.values())
    .map((row) => ({
      ...row,
      goalDifference: row.goalFor - row.goalAgainst,
      points: row.won * 3 + row.drawn,
    }))
    .sort(
      (first, second) =>
        second.points - first.points || second.goalDifference - first.goalDifference || second.goalFor - first.goalFor,
    )
    .map((row, index) => ({ ...row, position: index + 1 }))
}

export function knockoutBracket(competition: CompetitionProfile, season: string): BracketRound[] {
  const base = competition.participants.map<CompetitionTeam>((team) => ({ ...team }))
  while (base.length < 16) {
    base.push({
      id: `tbd-${base.length}`,
      name: 'To be confirmed',
      shortName: 'TBD',
      color: '#475569',
      isPlaceholder: true,
    })
  }

  const shuffled = base
    .map((team) => ({ team, seed: hash(`${competition.id}-${season}-${team.id}`) }))
    .sort((first, second) => first.seed - second.seed)
    .map((entry) => entry.team)

  const rounds: { name: string; size: number }[] =
    competition.format === 'knockout'
      ? [
          { name: 'Round of 16', size: 16 },
          { name: 'Quarter-finals', size: 8 },
          { name: 'Semi-finals', size: 4 },
          { name: 'Final', size: 2 },
        ]
      : [
          { name: 'Quarter-finals', size: 8 },
          { name: 'Semi-finals', size: 4 },
          { name: 'Final', size: 2 },
        ]

  const startingTeams = competition.format === 'knockout' ? shuffled : shuffled.slice(0, 8)
  let current = startingTeams
  const bracket: BracketRound[] = []

  for (const round of rounds) {
    const matches: BracketMatch[] = []
    for (let index = 0; index < current.length; index += 2) {
      const home = current[index]
      const away = current[index + 1]
      const homeSeed = hash(`${competition.id}-${season}-${round.name}-${home.id}-${away.id}-h`)
      const awaySeed = hash(`${competition.id}-${season}-${round.name}-${home.id}-${away.id}-a`)
      const winner = home.isPlaceholder && !away.isPlaceholder ? away : away.isPlaceholder && !home.isPlaceholder ? home : homeSeed >= awaySeed ? home : away
      matches.push({
        id: `${competition.id}-${season}-${round.name.replace(/\s/g, '-')}-${index / 2}`,
        home,
        away,
        winnerId: winner.isPlaceholder ? null : winner.id,
      })
    }
    bracket.push({ name: round.name, matches })
    current = matches.map((match) =>
      match.winnerId
        ? ({ ...base.find((team) => team.id === match.winnerId)! } as CompetitionTeam)
        : { id: `tbd-next-${round.name}`, name: 'To be confirmed', shortName: 'TBD', color: '#475569', isPlaceholder: true },
    )
  }

  return bracket
}

export function historicalTable(competition: CompetitionProfile, season: string): CompetitionTableRow[] {
  const results: CompetitionResult[] = []
  competition.participants.forEach((home, index) => {
    const away = competition.participants[(index + 3) % competition.participants.length]
    if (home.id === away.id) return
    const seed = hash(`${competition.id}-${season}-archive-${home.id}-${away.id}`)
    results.push({
      id: `${competition.id}-${season}-archive-${home.id}-${away.id}`,
      season,
      round: 'Final table',
      home,
      away,
      homeScore: seed % 4,
      awayScore: (seed >> 4) % 3,
      dateISO: `${season.slice(0, 4)}-11-01`,
      venue: `${home.name} Ground, Maseru`,
    })
  })
  return calculateCompetitionTable(competition.participants, results)
}

export function historicalRecord(competition: CompetitionProfile, season: string): HistoricalRecord {
  const sorted = COMPETITION_SEASONS.filter((value) => value !== SEASON_CURRENT)
  const index = sorted.indexOf(season)
  const participants = competition.participants
  const champion = index >= 0 ? participants[index % participants.length].name : 'In progress'
  const runnerUp = index >= 0 ? participants[(index + 3) % participants.length].name : 'To be decided'
  const topScorer = index >= 0 ? TOP_SCORERS[index % TOP_SCORERS.length].name : 'Season in progress'
  const seed = hash(`${competition.id}-${season}`)
  return {
    season,
    champion,
    runnerUp,
    topScorer,
    matches: 30 + (seed % 40),
    goals: 70 + (seed % 60),
  }
}

export function competitionTopScorers(competition: CompetitionProfile) {
  const ids = new Set(competition.participants.map((team) => team.id))
  const related = TOP_SCORERS.filter((player) => ids.has(player.club.id))
  return related.length > 0 ? related : TOP_SCORERS.slice(0, 3)
}

export function competitionStats(competition: CompetitionProfile, season: string) {
  const results = competitionResults(competition, season)
  const goals = results.reduce((total, result) => total + result.homeScore + result.awayScore, 0)
  const cleanSheets = results.filter(
    (result) => result.homeScore === 0 || result.awayScore === 0,
  ).length
  return {
    matches: results.length,
    goals,
    averageGoals: results.length ? (goals / results.length).toFixed(1) : '0.0',
    cleanSheets,
    clubs: competition.participants.length,
  }
}

export function competitionTypeName(format: CompetitionFormat): string {
  const labels: Record<CompetitionFormat, string> = {
    league: 'League competition',
    'group-stage': 'Group-stage tournament',
    knockout: 'Knockout tournament',
    combined: 'Group + knockout',
  }
  return labels[format]
}

export function competitionDisplayName(id: string): string {
  return COMPETITION_PROFILES.find((competition) => competition.id === id)?.name ?? competitionName(id)
}
