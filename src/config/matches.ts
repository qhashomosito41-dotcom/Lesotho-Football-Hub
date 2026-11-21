import type { MatchStatus } from '@/types'
import { DEMO_TEAMS, LATEST_RESULTS, LIVE_MATCHES, TODAY_FIXTURES, type DemoTeam } from './homepage'
import { competitionName, formatDateLabel, MATCH_RESULTS } from './league'

export type MatchEventType =
  | 'goal'
  | 'own-goal'
  | 'penalty'
  | 'yellow-card'
  | 'red-card'
  | 'substitution'
  | 'half-time'
  | 'full-time'

export interface MatchEvent {
  id: string
  minute: number
  type: MatchEventType
  team?: 'home' | 'away'
  title: string
  detail?: string
}

export interface MatchPlayer {
  id: string
  name: string
  number: number
  position: string
  captain?: boolean
}

export interface MatchLineup {
  formation: string
  coach: string
  starters: MatchPlayer[]
  substitutes: MatchPlayer[]
}

export interface MatchStat {
  label: string
  home: number
  away: number
  suffix?: string
}

export interface MatchDetail {
  id: string
  competition: string
  round: string
  season: string
  home: DemoTeam
  away: DemoTeam
  status: MatchStatus
  homeScore?: number
  awayScore?: number
  minute?: number
  kickoff?: string
  date: string
  venue: string
  city: string
  attendance: number | null
  referee: string
  events: MatchEvent[]
  homeLineup: MatchLineup
  awayLineup: MatchLineup
  stats: MatchStat[]
}

const SEASON = '2025/26'

const NAME_POOL = [
  'Thabo Mokoena',
  'Tumelo Ramohapi',
  'Katleho Mofolo',
  'Mpho Thabantso',
  'Teboho Lekhooa',
  'Sello Nkosi',
  'Kabelo Dlamini',
  'Pule Molefe',
  'Lerato Khoza',
  'Bongani Zulu',
  'Sipho Ndlovu',
  'Thabang Semoli',
  'Rantso Mokoena',
  'Motheo Sithole',
  'Tsepo Khumalo',
  'Thuso Mabaso',
  'Neo Phiri',
  'Kagiso Mbeki',
  'Lebohang Ntsane',
  'Makoena Mota',
  'Nape Lesaoana',
  'Tshepiso Rantso',
  'Sello Mokoena',
  'Mpho Khumalo',
  'Katleho Ntsane',
  'Thabo Phiri',
]

const EXTRA_NAMES = [
  'Teboho Mokhosi',
  'Thabo Makhele',
  'Moses Maliehe',
  'Lerato Molapo',
  'Katleho Ramosebetsa',
  'Sello Mokoena',
  'Mpho Khomotso',
  'Pule Thabane',
  'Bantu Mokoena',
  'Lioli Thabane',
  'Tsepo Lekhanya',
  'Nape Mohlomi',
  'Thabo Mpitsa',
  'Kabelo Mokhosi',
  'Rantso Nkosi',
  'Mpho Khumalo',
  'Sipho Mokoena',
  'Lerato Phiri',
  'Tumelo Zulu',
  'Neo Molefe',
]

const FULL_NAME_POOL = [...NAME_POOL, ...EXTRA_NAMES]

const POSITIONS = [
  'Goalkeeper',
  'Right back',
  'Centre back',
  'Centre back',
  'Left back',
  'Defensive midfielder',
  'Central midfielder',
  'Right winger',
  'Attacking midfielder',
  'Left winger',
  'Striker',
  'Goalkeeper',
  'Defender',
  'Defender',
  'Midfielder',
  'Forward',
]

const FEATURED_PLAYERS: Record<string, string[]> = {
  matlama: ['Thabo Mokoena', 'Katleho Mofolo'],
  bantu: ['Tumelo Ramohapi'],
  lcs: ['Teboho Lekhooa'],
  linare: ['Mpho Thabantso'],
}

const COACHES: Record<string, string> = {
  matlama: 'Moses Maliehe',
  bantu: 'Halemakale Mahlaha',
  lioli: 'Teboho Mokoena',
  lmps: 'Thabo Makhele',
  lcs: 'Mpho Mokhosi',
  linare: 'Lehlohonolo Thabane',
}

function hash(input: string): number {
  let value = 0
  for (let index = 0; index < input.length; index += 1) {
    value = (value * 31 + input.charCodeAt(index)) >>> 0
  }
  return value
}

function buildLineup(team: DemoTeam): MatchLineup {
  const seed = hash(team.id)
  const names = [...(FEATURED_PLAYERS[team.id] ?? [])]
  let cursor = seed % FULL_NAME_POOL.length

  while (names.length < POSITIONS.length) {
    const candidate = FULL_NAME_POOL[cursor % FULL_NAME_POOL.length]
    if (!names.includes(candidate)) names.push(candidate)
    cursor += 1
  }

  const players = names.map((name, index) => ({
    id: `${team.id}-${index + 1}`,
    name,
    number: index + 1,
    position: POSITIONS[index],
    captain: index === 3,
  }))

  return {
    formation: ['4-3-3', '4-2-3-1', '3-5-2', '4-4-2'][seed % 4],
    coach: COACHES[team.id] ?? 'Coaching staff',
    starters: players.slice(0, 11),
    substitutes: players.slice(11),
  }
}

const lineupCache: Record<string, MatchLineup> = {}

function lineupFor(team: DemoTeam): MatchLineup {
  if (!lineupCache[team.id]) lineupCache[team.id] = buildLineup(team)
  return lineupCache[team.id]
}

export function getLineup(teamId: string): MatchLineup | undefined {
  const team = DEMO_TEAMS[teamId]
  return team ? lineupFor(team) : undefined
}

function buildStats(seed: number): MatchStat[] {
  const possession = 45 + (seed % 13)
  const shots = (offset: number) => 5 + ((seed + offset) % 9)

  return [
    { label: 'Possession', home: possession, away: 100 - possession, suffix: '%' },
    { label: 'Shots', home: shots(1), away: shots(4) },
    { label: 'Shots on target', home: 2 + ((seed + 2) % 5), away: 1 + ((seed + 5) % 4) },
    { label: 'Corners', home: 2 + ((seed + 3) % 6), away: 1 + ((seed + 7) % 5) },
    { label: 'Fouls', home: 7 + ((seed + 1) % 7), away: 8 + ((seed + 6) % 6) },
    { label: 'Pass accuracy', home: 70 + (seed % 14), away: 68 + ((seed + 5) % 15), suffix: '%' },
  ]
}

function goal(id: string, minute: number, team: 'home' | 'away', title: string, detail?: string): MatchEvent {
  return { id, minute, type: 'goal', team, title, detail }
}

function penalty(id: string, minute: number, team: 'home' | 'away', title: string): MatchEvent {
  return { id, minute, type: 'penalty', team, title, detail: 'Penalty scored' }
}

function card(
  id: string,
  minute: number,
  type: 'yellow-card' | 'red-card',
  team: 'home' | 'away',
  lineup: MatchLineup,
  index: number,
): MatchEvent {
  return {
    id,
    minute,
    type,
    team,
    title: type === 'yellow-card' ? 'Yellow card' : 'Red card',
    detail: lineup.starters[index].name,
  }
}

function substitution(
  id: string,
  minute: number,
  team: 'home' | 'away',
  lineup: MatchLineup,
  offIndex: number,
  onIndex: number,
): MatchEvent {
  return {
    id,
    minute,
    type: 'substitution',
    team,
    title: 'Substitution',
    detail: `${lineup.starters[offIndex].name} off · ${lineup.substitutes[onIndex].name} on`,
  }
}

function phase(id: string, minute: number, type: 'half-time' | 'full-time'): MatchEvent {
  return { id, minute, type, title: type === 'half-time' ? 'Half-time' : 'Full-time' }
}

const BASE_MATCHES: MatchDetail[] = [
  ...LIVE_MATCHES.map((match) => ({
    id: match.id,
    competition: match.competition,
    round: match.round,
    season: SEASON,
    home: match.home,
    away: match.away,
    status: 'live' as MatchStatus,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    minute: match.minute,
    date: 'Sat 21 Nov 2026',
    venue: match.venue,
    city: match.venue.split(', ').at(-1) ?? 'Maseru',
    attendance: null,
    referee: 'Match official',
    events: match.events.map((event, index) => ({
      id: `${match.id}-g${index}`,
      minute: event.minute,
      type: 'goal' as MatchEventType,
      team: event.side,
      title: `Goal — ${event.player}`,
      detail: 'Regular goal',
    })),
    stats: buildStats(hash(match.id)),
    homeLineup: lineupFor(match.home),
    awayLineup: lineupFor(match.away),
  })),
  ...TODAY_FIXTURES.map((fixture) => ({
    id: fixture.id,
    competition: fixture.competition,
    round: fixture.round,
    season: SEASON,
    home: fixture.home,
    away: fixture.away,
    status: 'upcoming' as MatchStatus,
    kickoff: fixture.kickoff,
    date: `${fixture.date} 2026`,
    venue: fixture.venue,
    city: fixture.venue.split(', ').at(-1) ?? 'Maseru',
    attendance: null,
    referee: 'To be confirmed',
    events: [],
    stats: buildStats(hash(fixture.id)),
    homeLineup: lineupFor(fixture.home),
    awayLineup: lineupFor(fixture.away),
  })),
  ...LATEST_RESULTS.map((result) => ({
    id: result.id,
    competition: result.competition,
    round: result.round,
    season: SEASON,
    home: result.home,
    away: result.away,
    status: 'finished' as MatchStatus,
    homeScore: result.homeScore,
    awayScore: result.awayScore,
    date: `${result.date} 2026`,
    venue: result.venue,
    city: result.venue.split(', ').at(-1) ?? 'Maseru',
    attendance: 3200 + (hash(result.id) % 5000),
    referee: 'Match official',
    events: [phase(`${result.id}-ft`, 90, 'full-time')],
    stats: buildStats(hash(result.id)),
    homeLineup: lineupFor(result.home),
    awayLineup: lineupFor(result.away),
  })),
  ...MATCH_RESULTS.map((result) => ({
    id: result.id,
    competition: competitionName(result.competitionId),
    round: result.round,
    season: result.season,
    home: result.home,
    away: result.away,
    status: 'finished' as MatchStatus,
    homeScore: result.homeGoals,
    awayScore: result.awayGoals,
    date: formatDateLabel(result.dateISO),
    venue: result.venue,
    city: result.venue.split(', ').at(-1) ?? 'Maseru',
    attendance: 2400 + (hash(result.id) % 4200),
    referee: 'Match official',
    events: [phase(`${result.id}-ft`, 90, 'full-time')],
    stats: buildStats(hash(result.id)),
    homeLineup: lineupFor(result.home),
    awayLineup: lineupFor(result.away),
  })),
]

const ENRICHERS: Record<string, (match: MatchDetail) => Partial<MatchDetail>> = {
  'matlama-bantu': (match) => ({
    attendance: 8400,
    referee: 'Mojalefa Mokoena',
    events: [
      goal('mb-1', 12, 'home', 'Goal — Thabo Mokoena', 'Assist: Katleho Mofolo'),
      card('mb-2', 28, 'yellow-card', 'away', match.awayLineup, 5),
      goal('mb-3', 34, 'away', 'Goal — Tumelo Ramohapi'),
      phase('mb-4', 45, 'half-time'),
      substitution('mb-5', 46, 'away', match.awayLineup, 9, 1),
      goal('mb-6', 58, 'home', 'Goal — Katleho Mofolo', 'Assist: Thabo Mokoena'),
      card('mb-7', 63, 'yellow-card', 'home', match.homeLineup, 6),
    ],
    stats: [
      { label: 'Possession', home: 58, away: 42, suffix: '%' },
      { label: 'Shots', home: 11, away: 7 },
      { label: 'Shots on target', home: 5, away: 3 },
      { label: 'Corners', home: 6, away: 2 },
      { label: 'Fouls', home: 9, away: 12 },
      { label: 'Pass accuracy', home: 81, away: 74, suffix: '%' },
    ],
  }),
  'lioli-lmps': (match) => ({
    attendance: 5100,
    events: [
      card('ll-1', 18, 'yellow-card', 'home', match.homeLineup, 4),
      substitution('ll-2', 21, 'away', match.awayLineup, 10, 3),
    ],
    stats: [
      { label: 'Possession', home: 52, away: 48, suffix: '%' },
      { label: 'Shots', home: 4, away: 5 },
      { label: 'Shots on target', home: 1, away: 2 },
      { label: 'Corners', home: 3, away: 4 },
      { label: 'Fouls', home: 8, away: 7 },
      { label: 'Pass accuracy', home: 76, away: 78, suffix: '%' },
    ],
  }),
  'lcs-linare': (match) => ({
    attendance: 3800,
    events: [
      goal('cl-1', 19, 'home', 'Goal — Teboho Lekhooa'),
      card('cl-2', 31, 'yellow-card', 'away', match.awayLineup, 6),
      goal('cl-3', 41, 'away', 'Goal — Mpho Thabantso', 'Assist: Sello Nkosi'),
      phase('cl-4', 45, 'half-time'),
    ],
  }),
  'ccx-lijabatho': (match) => ({
    events: [
      goal('cj-1', 8, 'away', 'Goal — Lerato Nkosi'),
      card('cj-2', 22, 'yellow-card', 'home', match.homeLineup, 2),
      goal('cj-3', 27, 'home', 'Goal — Pule Molefe'),
      phase('cj-4', 45, 'half-time'),
      penalty('cj-5', 52, 'away', 'Penalty — Sello Dlamini'),
    ],
  }),
  'kick4life-manonyane': (match) => ({
    events: [
      goal('ml-1', 21, 'away', 'Goal — Kabelo Khoza'),
      card('ml-2', 33, 'yellow-card', 'home', match.homeLineup, 7),
    ],
  }),
  'ccx-mphatlalatsane': (match) => ({
    events: [
      penalty('cm-1', 22, 'home', 'Penalty — Pule Molefe'),
      {
        id: 'cm-2',
        minute: 55,
        type: 'own-goal',
        team: 'away',
        title: 'Own goal',
        detail: `${match.awayLineup.starters[3].name} (Mphatlalatsane)`,
      },
      substitution('cm-3', 60, 'home', match.homeLineup, 10, 2),
      card('cm-4', 76, 'red-card', 'away', match.awayLineup, 8),
      phase('cm-5', 90, 'full-time'),
    ],
  }),
}

export const MATCH_DETAILS: Record<string, MatchDetail> = Object.fromEntries(
  BASE_MATCHES.map((match) => [match.id, { ...match, ...(ENRICHERS[match.id]?.(match) ?? {}) }]),
)

const FEATURED_MATCH_IDS = new Set(
  [...LIVE_MATCHES, ...TODAY_FIXTURES, ...LATEST_RESULTS].map((match) => match.id),
)

export const ALL_MATCHES: MatchDetail[] = Object.values(MATCH_DETAILS).filter((match) =>
  FEATURED_MATCH_IDS.has(match.id),
)

export function getMatch(id: string | undefined): MatchDetail | undefined {
  return id ? MATCH_DETAILS[id] : undefined
}

export function eventKindLabel(type: MatchEventType): string {
  const labels: Record<MatchEventType, string> = {
    goal: 'Goal',
    'own-goal': 'Own goal',
    penalty: 'Penalty',
    'yellow-card': 'Yellow card',
    'red-card': 'Red card',
    substitution: 'Substitution',
    'half-time': 'Half-time',
    'full-time': 'Full-time',
  }
  return labels[type]
}
