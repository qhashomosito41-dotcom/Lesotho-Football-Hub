import { CLUB_LIST, CLUB_PROFILES, type ClubProfile } from './clubs'
import { competitionName, MATCH_RESULTS } from './league'
import { getLineup, type MatchPlayer } from './matches'

export type PositionGroup = 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward'

export const POSITION_GROUPS: PositionGroup[] = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward']

export interface PlayerCareerEntry {
  club: string
  season: string
  appearances: number
  goals: number
}

export interface PlayerTransfer {
  season: string
  from: string
  to: string
}

export interface PlayerMatchHistory {
  id: string
  date: string
  competition: string
  opponent: string
  score: string
  result: 'W' | 'D' | 'L'
}

export interface PlayerSeasonStats {
  season: string
  appearances: number
  goals: number
  assists: number
  yellowCards: number
  redCards: number
  minutes: number
  saves: number
}

export interface PlayerProfile {
  id: string
  name: string
  number: number
  position: string
  positionGroup: PositionGroup
  club: ClubProfile
  age: number
  nationality: string
  preferredFoot: 'Right' | 'Left'
  photoUrl: string
  seasonStats: PlayerSeasonStats
  careerHistory: PlayerCareerEntry[]
  transferHistory: PlayerTransfer[]
  matchHistory: PlayerMatchHistory[]
}

const NATIONALITIES = ['Lesotho', 'Lesotho', 'Lesotho', 'South Africa', 'Zimbabwe', 'Botswana']

function hash(input: string): number {
  let value = 0
  for (let index = 0; index < input.length; index += 1) {
    value = (value * 31 + input.charCodeAt(index)) >>> 0
  }
  return value
}

function positionGroup(position: string): PositionGroup {
  if (position === 'Goalkeeper') return 'Goalkeeper'
  if (position === 'Defender' || position.includes('back')) return 'Defender'
  if (position === 'Midfielder' || position.includes('midfielder')) return 'Midfielder'
  return 'Forward'
}

function photoUrl(name: string, color: string, seed: number): string {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
  const shift = seed % 4
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="14" fill="#101d33"/><circle cx="48" cy="37" r="18" fill="${color}"/><path d="M12 96c3-21 17-32 36-32s33 11 36 32z" fill="${color}" opacity="0.75"/><circle cx="${41 + shift}" cy="37" r="2.2" fill="#fff" opacity="0.7"/><circle cx="${55 - shift}" cy="37" r="2.2" fill="#fff" opacity="0.7"/><text x="48" y="89" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="bold" fill="#fff">${initials}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

function matchHistoryFor(clubId: string, playerName: string): PlayerMatchHistory[] {
  return MATCH_RESULTS.filter(
    (match) =>
      match.season === '2025/26' && (match.home.id === clubId || match.away.id === clubId),
  )
    .sort((first, second) => second.dateISO.localeCompare(first.dateISO))
    .slice(0, 5)
    .map((match) => {
      const isHome = match.home.id === clubId
      const score = `${isHome ? match.homeGoals : match.awayGoals}–${isHome ? match.awayGoals : match.homeGoals}`
      const outcome = isHome
        ? match.homeGoals > match.awayGoals
          ? 'W'
          : match.homeGoals === match.awayGoals
            ? 'D'
            : 'L'
        : match.awayGoals > match.homeGoals
          ? 'W'
          : match.awayGoals === match.homeGoals
            ? 'D'
            : 'L'
      return {
        id: `${match.id}-${playerName}`,
        date: match.dateISO,
        competition: competitionName(match.competitionId),
        opponent: (isHome ? match.away : match.home).name,
        score,
        result: outcome,
      }
    })
}

function buildPlayer(club: ClubProfile, lineupPlayer: MatchPlayer): PlayerProfile {
  const seed = hash(`${club.id}-${lineupPlayer.id}-${lineupPlayer.name}`)
  const group = positionGroup(lineupPlayer.position)
  const attackingBoost = group === 'Forward' ? 5 : group === 'Midfielder' ? 2 : 0
  const appearances = 8 + (seed % 21)
  const goals = Math.max(0, (seed % 4) + attackingBoost + (group === 'Goalkeeper' ? -4 : 0))
  const assists = group === 'Goalkeeper' ? 0 : (seed % 6)
  const previousClub = CLUB_LIST[(seed + 3) % CLUB_LIST.length]
  const olderClub = CLUB_LIST[(seed + 7) % CLUB_LIST.length]
  const career: PlayerCareerEntry[] = [
    { club: olderClub.name, season: '2023/24', appearances: 4 + (seed % 15), goals: seed % 3 },
    { club: previousClub.name, season: '2024/25', appearances: 10 + (seed % 17), goals: 1 + (seed % 6) },
    { club: club.name, season: '2025/26', appearances, goals },
  ]

  return {
    id: lineupPlayer.id,
    name: lineupPlayer.name,
    number: lineupPlayer.number,
    position: lineupPlayer.position,
    positionGroup: group,
    club,
    age: 19 + (seed % 18),
    nationality: NATIONALITIES[seed % NATIONALITIES.length],
    preferredFoot: seed % 5 === 0 ? 'Left' : 'Right',
    photoUrl: photoUrl(lineupPlayer.name, club.color, seed),
    seasonStats: {
      season: '2025/26',
      appearances,
      goals,
      assists,
      yellowCards: seed % 5,
      redCards: seed % 11 === 0 ? 1 : 0,
      minutes: appearances * 90 + (seed % 20),
      saves: group === 'Goalkeeper' ? 18 + (seed % 42) : 0,
    },
    careerHistory: career,
    transferHistory: [
      { season: '2024/25', from: olderClub.name, to: previousClub.name },
      { season: '2025/26', from: previousClub.name, to: club.name },
    ],
    matchHistory: matchHistoryFor(club.id, lineupPlayer.name),
  }
}

export const PLAYER_LIST: PlayerProfile[] = Object.values(CLUB_PROFILES).flatMap((club) => {
  const lineup = getLineup(club.id)
  if (!lineup) return []
  return [...lineup.starters, ...lineup.substitutes].map((player) => buildPlayer(club, player))
})

const PLAYERS_BY_ID = new Map(PLAYER_LIST.map((player) => [player.id, player]))

export function getPlayer(playerId: string | undefined): PlayerProfile | undefined {
  return playerId ? PLAYERS_BY_ID.get(playerId) : undefined
}

export function playerPath(playerId: string): string {
  return `/players/${playerId}`
}

export function filterPlayers(query: string, position: string, club: string): PlayerProfile[] {
  const normalized = query.trim().toLowerCase()
  return PLAYER_LIST.filter((player) => {
    const matchesQuery =
      normalized.length === 0 ||
      player.name.toLowerCase().includes(normalized) ||
      player.club.name.toLowerCase().includes(normalized)
    return matchesQuery && (position === 'all' || player.positionGroup === position) && (club === 'all' || player.club.id === club)
  }).sort((first, second) => first.name.localeCompare(second.name))
}

export function squadByPosition(clubId: string): Record<PositionGroup, PlayerProfile[]> {
  const squad = PLAYER_LIST.filter((player) => player.club.id === clubId)
  return {
    Goalkeeper: squad.filter((player) => player.positionGroup === 'Goalkeeper').sort((a, b) => a.number - b.number),
    Defender: squad.filter((player) => player.positionGroup === 'Defender').sort((a, b) => a.number - b.number),
    Midfielder: squad.filter((player) => player.positionGroup === 'Midfielder').sort((a, b) => a.number - b.number),
    Forward: squad.filter((player) => player.positionGroup === 'Forward').sort((a, b) => a.number - b.number),
  }
}
