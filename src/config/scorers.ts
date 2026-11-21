import { COMPETITION_PROFILES, COMPETITION_SEASONS, type CompetitionProfile } from './competitions'
import { playerPath, PLAYER_LIST } from './players'

export const SCORER_SEASONS = COMPETITION_SEASONS

export interface ScorerCompetitionOption {
  value: string
  label: string
}

export const SCORER_COMPETITIONS: ScorerCompetitionOption[] = [
  { value: 'all', label: 'All competitions' },
  ...COMPETITION_PROFILES.map((competition) => ({ value: competition.id, label: competition.name })),
]

export interface ScorerEntry {
  id: string
  rank: number
  playerId: string
  name: string
  photoUrl: string
  position: string
  clubName: string
  clubShortName: string
  clubColor: string
  clubId: string
  competitionId: string
  competitionName: string
  season: string
  goals: number
  assists?: number
  to: string
}

const FEATURED_SCORERS: Record<string, { goals: number; assists: number }> = {
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
  if (season === '2024/25') return 0.72
  return 0.48
}

function competitionFactor(playerId: string, competition: CompetitionProfile | undefined): number {
  if (!competition) return 1
  const seed = hash(`${playerId}-${competition.id}`) % 60
  return (40 + seed) / 100
}

export function filterScorers(competitionId: string, season: string): ScorerEntry[] {
  const competition = competitionId === 'all' ? undefined : COMPETITION_PROFILES.find((item) => item.id === competitionId)
  const allowedClubs = competition ? new Set(competition.participants.map((team) => team.id)) : null
  const factor = seasonFactor(season)

  const rows = PLAYER_LIST.filter((player) => !allowedClubs || allowedClubs.has(player.club.id))
    .map((player) => {
      const featured = FEATURED_SCORERS[player.name]
      const baseGoals = featured ? featured.goals : player.seasonStats.goals
      const baseAssists = featured ? featured.assists : player.seasonStats.assists
      const weight = competitionFactor(player.id, competition)
      const goals = Math.max(1, Math.round(baseGoals * weight * factor))
      const assists = season === '2025/26' && competitionId === 'all' && featured ? featured.assists : Math.round(baseAssists * weight * factor)

      return {
        id: `${player.id}-${competitionId}-${season}`,
        rank: 0,
        playerId: player.id,
        name: player.name,
        photoUrl: player.photoUrl,
        position: player.position,
        clubName: player.club.name,
        clubShortName: player.club.shortName,
        clubColor: player.club.color,
        clubId: player.club.id,
        competitionId: competitionId,
        competitionName: competition?.name ?? 'All competitions',
        season,
        goals,
        assists,
        to: playerPath(player.id),
      }
    })
    .sort((first, second) => second.goals - first.goals || (second.assists ?? 0) - (first.assists ?? 0) || first.name.localeCompare(second.name))
    .slice(0, 20)

  let lastGoals = -1
  let lastRank = 0
  return rows.map((row, index) => {
    if (row.goals !== lastGoals) {
      lastRank = index + 1
      lastGoals = row.goals
    }
    return { ...row, rank: lastRank }
  })
}

export function goldenBootLeader(scorers: ScorerEntry[]): ScorerEntry | undefined {
  return scorers[0]
}
