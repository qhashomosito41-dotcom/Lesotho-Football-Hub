import {
  COMPETITION_PROFILES,
  COMPETITION_SEASONS,
  competitionResults,
  getCompetition,
  type CompetitionProfile,
  type CompetitionResult,
} from './competitions'
import { clubPath, type DemoTeam } from './homepage'
import { SEASON_CURRENT } from './league'
import { PLAYER_LIST, playerPath } from './players'

export const STAT_SEASONS = COMPETITION_SEASONS

export const CHART_COLORS = {
  primary: 'var(--color-primary)',
  live: 'var(--color-live)',
  accent: 'var(--color-accent)',
  danger: 'var(--color-danger)',
  navy: 'var(--color-navy-500)',
  muted: 'var(--color-navy-300)',
} as const

export type TeamStatCategory =
  | 'wins'
  | 'goals'
  | 'defence'
  | 'clean-sheets'
  | 'goal-difference'
  | 'unbeaten'
  | 'home'
  | 'away'

export type PlayerStatCategory =
  | 'scorers'
  | 'assists'
  | 'appearances'
  | 'minutes'
  | 'yellow-cards'
  | 'red-cards'
  | 'saves'

export interface StatCategory<Id extends string> {
  id: Id
  label: string
  description: string
}

export const TEAM_STAT_CATEGORIES: StatCategory<TeamStatCategory>[] = [
  { id: 'wins', label: 'Most wins', description: 'Clubs with the most victories.' },
  { id: 'goals', label: 'Most goals scored', description: 'Most productive attacks.' },
  { id: 'defence', label: 'Best defensive record', description: 'Fewest goals conceded.' },
  { id: 'clean-sheets', label: 'Most clean sheets', description: 'Most matches without conceding.' },
  { id: 'goal-difference', label: 'Highest goal difference', description: 'Goals scored minus goals conceded.' },
  { id: 'unbeaten', label: 'Longest unbeaten run', description: 'Consecutive matches without defeat.' },
  { id: 'home', label: 'Best home record', description: 'Most points earned at home.' },
  { id: 'away', label: 'Best away record', description: 'Most points earned on the road.' },
]

export const PLAYER_STAT_CATEGORIES: StatCategory<PlayerStatCategory>[] = [
  { id: 'scorers', label: 'Top scorers', description: 'Players with the most goals.' },
  { id: 'assists', label: 'Top assists', description: 'Players creating the most goals.' },
  { id: 'appearances', label: 'Most appearances', description: 'Most matches played.' },
  { id: 'minutes', label: 'Most minutes played', description: 'Total time on the pitch.' },
  { id: 'yellow-cards', label: 'Most yellow cards', description: 'Disciplinary record.' },
  { id: 'red-cards', label: 'Most red cards', description: 'Dismissals across the season.' },
  { id: 'saves', label: 'Most goalkeeper saves', description: 'Shot-stopping leaders.' },
]

export interface StatLeader {
  id: string
  rank: number
  name: string
  photoUrl?: string
  team: DemoTeam
  value: number
  displayValue: string
  detail: string
  to: string
}

export interface ChartDatum {
  name: string
  value: number
  detail?: string
}

export interface CompetitionSummary {
  matches: number
  goals: number
  averageGoals: string
  draws: number
  homeWins: number
  awayWins: number
  highestScoringMatch: string
  largestWinningMargin: string
  cards: { id: string; label: string; value: string | number; caption: string }[]
  byCompetition: ChartDatum[]
  byRound: ChartDatum[]
  outcomes: ChartDatum[]
}

interface StatResult extends CompetitionResult {
  competitionId: string
}

interface VenueRecord {
  won: number
  drawn: number
  lost: number
}

interface TeamAggregate {
  team: DemoTeam
  played: number
  won: number
  drawn: number
  lost: number
  goalFor: number
  goalAgainst: number
  cleanSheets: number
  home: VenueRecord
  away: VenueRecord
  form: { dateISO: string; outcome: 'win' | 'draw' | 'loss' }[]
}

const FEATURED_GOALS: Record<string, { goals: number; assists: number }> = {
  'Thabo Mokoena': { goals: 11, assists: 4 },
  'Tumelo Ramohapi': { goals: 9, assists: 2 },
  'Katleho Mofolo': { goals: 8, assists: 6 },
  'Mpho Thabantso': { goals: 7, assists: 1 },
  'Teboho Lekhooa': { goals: 6, assists: 5 },
}

function hash(input: string): number {
  let value = 0
  for (let index = 0; index < input.length; index += 1) {
    value = (value * 31 + input.charCodeAt(index)) >>> 0
  }
  return value
}

function seasonFactor(season: string): number {
  if (season === '2025/26') return 1
  if (season === '2024/25') return 0.7
  return 0.45
}

function scaled(value: number, factor: number): number {
  return Math.round(value * factor)
}

function competitionWeight(playerId: string, competitionId: string): number {
  const seed = hash(`${playerId}-${competitionId}`) % 70
  return (30 + seed) / 100
}

function resultsForProfile(profile: CompetitionProfile, season: string): CompetitionResult[] {
  const direct = competitionResults(profile, season)
  if (direct.length > 0 || season === SEASON_CURRENT) return direct

  const offset = season === '2024/25' ? 1 : 2
  return competitionResults(profile, SEASON_CURRENT).map((result) => ({
    ...result,
    id: `${result.id}-${season.replace('/', '-')}`,
    season,
    homeScore: (result.homeScore + offset) % 4,
    awayScore: (result.awayScore + offset) % 3,
  }))
}

function statResults(competitionId: string, season: string): StatResult[] {
  return COMPETITION_PROFILES.filter(
    (profile) => competitionId === 'all' || profile.id === competitionId,
  ).flatMap((profile) =>
    resultsForProfile(profile, season).map((result) => ({ ...result, competitionId: profile.id })),
  )
}

function longestUnbeaten(form: TeamAggregate['form']): number {
  let current = 0
  let best = 0
  for (const entry of [...form].sort((first, second) => first.dateISO.localeCompare(second.dateISO))) {
    current = entry.outcome === 'loss' ? 0 : current + 1
    best = Math.max(best, current)
  }
  return best
}

function aggregateTeams(results: StatResult[]): TeamAggregate[] {
  const tallies = new Map<string, TeamAggregate>()

  const ensure = (team: DemoTeam): TeamAggregate => {
    const existing = tallies.get(team.id)
    if (existing) return existing
    const created: TeamAggregate = {
      team,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalFor: 0,
      goalAgainst: 0,
      cleanSheets: 0,
      home: { won: 0, drawn: 0, lost: 0 },
      away: { won: 0, drawn: 0, lost: 0 },
      form: [],
    }
    tallies.set(team.id, created)
    return created
  }

  for (const result of results) {
    const home = ensure(result.home)
    const away = ensure(result.away)

    home.played += 1
    away.played += 1
    home.goalFor += result.homeScore
    home.goalAgainst += result.awayScore
    away.goalFor += result.awayScore
    away.goalAgainst += result.homeScore

    if (result.awayScore === 0) home.cleanSheets += 1
    if (result.homeScore === 0) away.cleanSheets += 1

    const homeOutcome = result.homeScore > result.awayScore ? 'win' : result.homeScore === result.awayScore ? 'draw' : 'loss'
    const awayOutcome = homeOutcome === 'win' ? 'loss' : homeOutcome === 'loss' ? 'win' : 'draw'

    if (homeOutcome === 'win') {
      home.won += 1
      home.home.won += 1
      away.lost += 1
      away.away.lost += 1
    } else if (homeOutcome === 'loss') {
      home.lost += 1
      home.home.lost += 1
      away.won += 1
      away.away.won += 1
    } else {
      home.drawn += 1
      home.home.drawn += 1
      away.drawn += 1
      away.away.drawn += 1
    }

    home.form.push({ dateISO: result.dateISO, outcome: homeOutcome })
    away.form.push({ dateISO: result.dateISO, outcome: awayOutcome })
  }

  return Array.from(tallies.values())
}

function teamValue(aggregate: TeamAggregate, category: TeamStatCategory): number {
  switch (category) {
    case 'wins':
      return aggregate.won
    case 'goals':
      return aggregate.goalFor
    case 'defence':
      return aggregate.goalAgainst
    case 'clean-sheets':
      return aggregate.cleanSheets
    case 'goal-difference':
      return aggregate.goalFor - aggregate.goalAgainst
    case 'unbeaten':
      return longestUnbeaten(aggregate.form)
    case 'home':
      return aggregate.home.won * 3 + aggregate.home.drawn
    case 'away':
      return aggregate.away.won * 3 + aggregate.away.drawn
  }
}

function teamDetail(aggregate: TeamAggregate, category: TeamStatCategory): string {
  switch (category) {
    case 'wins':
      return `${aggregate.won} wins in ${aggregate.played} matches`
    case 'goals':
      return `${aggregate.goalFor} goals in ${aggregate.played} matches`
    case 'defence':
      return `${aggregate.goalAgainst} conceded in ${aggregate.played} matches`
    case 'clean-sheets':
      return `${aggregate.cleanSheets} clean sheets in ${aggregate.played} matches`
    case 'goal-difference':
      return `${aggregate.goalFor} scored · ${aggregate.goalAgainst} conceded`
    case 'unbeaten':
      return `${longestUnbeaten(aggregate.form)} matches without defeat`
    case 'home':
      return `${aggregate.home.won}W ${aggregate.home.drawn}D ${aggregate.home.lost}L at home`
    case 'away':
      return `${aggregate.away.won}W ${aggregate.away.drawn}D ${aggregate.away.lost}L away`
  }
}

export function getTeamLeaders(
  category: TeamStatCategory,
  season: string,
  competitionId = 'all',
): StatLeader[] {
  const aggregates = aggregateTeams(statResults(competitionId, season))
  const ascending = category === 'defence'
  const tieBreak = (first: TeamAggregate, second: TeamAggregate) =>
    second.goalFor - second.goalAgainst - (first.goalFor - first.goalAgainst) ||
    second.goalFor - first.goalFor ||
    first.team.name.localeCompare(second.team.name)

  return [...aggregates]
    .sort((first, second) => {
      const difference = teamValue(first, category) - teamValue(second, category)
      return (ascending ? difference : -difference) || tieBreak(first, second)
    })
    .slice(0, 10)
    .map((aggregate, index) => {
      const value = teamValue(aggregate, category)
      return {
        id: `${aggregate.team.id}-${category}`,
        rank: index + 1,
        name: aggregate.team.name,
        team: aggregate.team,
        value,
        displayValue: category === 'goal-difference' && value > 0 ? `+${value}` : String(value),
        detail: teamDetail(aggregate, category),
        to: clubPath(aggregate.team.id),
      }
    })
}

function playerValue(
  playerId: string,
  category: PlayerStatCategory,
  season: string,
  competitionId: string,
  goals: number,
  assists: number,
): number {
  const factor = seasonFactor(season)
  const player = PLAYER_LIST.find((entry) => entry.id === playerId)!

  let value: number
  switch (category) {
    case 'scorers':
      value = goals
      break
    case 'assists':
      value = assists
      break
    case 'appearances':
      value = player.seasonStats.appearances
      break
    case 'minutes':
      value = player.seasonStats.minutes
      break
    case 'yellow-cards':
      value = player.seasonStats.yellowCards
      break
    case 'red-cards':
      value = player.seasonStats.redCards
      break
    case 'saves':
      value = player.seasonStats.saves
      break
  }

  if (competitionId !== 'all') {
    value = Math.max(category === 'red-cards' ? 0 : 1, Math.round(value * competitionWeight(playerId, competitionId)))
  }
  return scaled(value, factor)
}

function playerDetail(
  category: PlayerStatCategory,
  goals: number,
  assists: number,
  appearances: number,
  minutes: number,
): string {
  switch (category) {
    case 'scorers':
      return `${goals} goals · ${assists} assists`
    case 'assists':
      return `${assists} assists · ${goals} goals`
    case 'appearances':
      return `${appearances} appearances · ${minutes.toLocaleString('en-GB')} minutes`
    case 'minutes':
      return `${minutes.toLocaleString('en-GB')} minutes · ${appearances} appearances`
    case 'yellow-cards':
      return 'Yellow cards this season'
    case 'red-cards':
      return 'Red cards this season'
    case 'saves':
      return 'Goalkeeper saves this season'
  }
}

export function getPlayerLeaders(
  category: PlayerStatCategory,
  season: string,
  competitionId = 'all',
): StatLeader[] {
  const allowedClubs = competitionId === 'all' ? null : new Set(getCompetition(competitionId)?.participants.map((team) => team.id))
  const factor = seasonFactor(season)

  const rows = PLAYER_LIST.filter((player) => {
    const clubMatches = !allowedClubs || allowedClubs.has(player.club.id)
    const positionMatches = category !== 'saves' || player.positionGroup === 'Goalkeeper'
    return clubMatches && positionMatches
  })
    .map((player) => {
      const featured = FEATURED_GOALS[player.name]
      const goals = featured ? featured.goals : player.seasonStats.goals
      const assists = featured ? featured.assists : player.seasonStats.assists
      const value = playerValue(player.id, category, season, competitionId, goals, assists)
      return {
        id: `${player.id}-${category}`,
        rank: 0,
        name: player.name,
        photoUrl: player.photoUrl,
        team: player.club,
        value,
        displayValue: category === 'minutes' ? value.toLocaleString('en-GB') : String(value),
        detail: playerDetail(
          category,
          scaled(goals, factor),
          scaled(assists, factor),
          scaled(player.seasonStats.appearances, factor),
          scaled(player.seasonStats.minutes, factor),
        ),
        to: playerPath(player.id),
      }
    })
    .sort((first, second) => second.value - first.value || first.name.localeCompare(second.name))
    .slice(0, 10)

  return rows.map((row, index) => ({ ...row, rank: index + 1 }))
}

function groupGoals(results: StatResult[], key: (result: StatResult) => string): ChartDatum[] {
  const groups = new Map<string, { goals: number; matches: number }>()
  for (const result of results) {
    const name = key(result)
    const entry = groups.get(name) ?? { goals: 0, matches: 0 }
    entry.goals += result.homeScore + result.awayScore
    entry.matches += 1
    groups.set(name, entry)
  }
  return Array.from(groups.entries()).map(([name, entry]) => ({
    name,
    value: entry.goals,
    detail: `${entry.goals} goals in ${entry.matches} matches`,
  }))
}

export function getCompetitionSummary(season: string, competitionId = 'all'): CompetitionSummary {
  const results = statResults(competitionId, season)
  const goals = results.reduce((total, result) => total + result.homeScore + result.awayScore, 0)
  const draws = results.filter((result) => result.homeScore === result.awayScore).length
  const homeWins = results.filter((result) => result.homeScore > result.awayScore).length
  const awayWins = results.filter((result) => result.homeScore < result.awayScore).length

  const highest = [...results].sort(
    (first, second) =>
      second.homeScore + second.awayScore - (first.homeScore + first.awayScore) ||
      second.dateISO.localeCompare(first.dateISO),
  )[0]
  const widest = [...results].sort(
    (first, second) =>
      Math.abs(second.homeScore - second.awayScore) - Math.abs(first.homeScore - first.awayScore) ||
      second.homeScore + second.awayScore - (first.homeScore + first.awayScore),
  )[0]

  const highestScoringMatch = highest
    ? `${highest.home.shortName} ${highest.homeScore}–${highest.awayScore} ${highest.away.shortName}`
    : 'No matches recorded'
  const largestWinningMargin = widest
    ? `${Math.abs(widest.homeScore - widest.awayScore)} goals · ${widest.home.shortName} ${widest.homeScore}–${widest.awayScore} ${widest.away.shortName}`
    : 'No matches recorded'

  return {
    matches: results.length,
    goals,
    averageGoals: results.length ? (goals / results.length).toFixed(1) : '0.0',
    draws,
    homeWins,
    awayWins,
    highestScoringMatch,
    largestWinningMargin,
    cards: [
      { id: 'matches', label: 'Matches played', value: results.length, caption: 'Recorded results' },
      { id: 'goals', label: 'Total goals', value: goals, caption: 'Both sides combined' },
      { id: 'average', label: 'Average goals per match', value: results.length ? (goals / results.length).toFixed(1) : '0.0', caption: 'Goals per fixture' },
      { id: 'draws', label: 'Draws', value: draws, caption: 'Level at full time' },
      { id: 'home', label: 'Home wins', value: homeWins, caption: 'Hosts took three points' },
      { id: 'away', label: 'Away wins', value: awayWins, caption: 'Visitors took three points' },
      { id: 'highest', label: 'Highest-scoring match', value: highestScoringMatch, caption: 'Most goals in one fixture' },
      { id: 'margin', label: 'Largest winning margin', value: largestWinningMargin, caption: 'Widest winning scoreline' },
    ],
    byCompetition: groupGoals(results, (result) => {
      const profile = COMPETITION_PROFILES.find((item) => item.id === result.competitionId)
      return profile?.shortName ?? result.competitionId
    }),
    byRound: groupGoals(results, (result) => result.round.replace('Matchweek', 'MW').replace('Round', 'R')),
    outcomes: [
      { name: 'Home wins', value: homeWins, detail: `${homeWins} matches` },
      { name: 'Draws', value: draws, detail: `${draws} matches` },
      { name: 'Away wins', value: awayWins, detail: `${awayWins} matches` },
    ],
  }
}
