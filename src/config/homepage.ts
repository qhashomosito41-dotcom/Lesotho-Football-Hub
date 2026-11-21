import { ROUTES } from './app'

export interface DemoTeam {
  id: string
  name: string
  shortName: string
  color: string
}

export const DEMO_TEAMS: Record<string, DemoTeam> = {
  bantu: { id: 'bantu', name: 'Bantu FC', shortName: 'BAN', color: '#ca8a04' },
  matlama: { id: 'matlama', name: 'Matlama FC', shortName: 'MAT', color: '#1d4ed8' },
  lioli: { id: 'lioli', name: 'Lioli FC', shortName: 'LIO', color: '#dc2626' },
  lmps: { id: 'lmps', name: 'LMPS FC', shortName: 'LMP', color: '#1e3a8a' },
  lcs: { id: 'lcs', name: 'LCS FC', shortName: 'LCS', color: '#15803d' },
  linare: { id: 'linare', name: 'Linare FC', shortName: 'LIN', color: '#b91c1c' },
  ldf: { id: 'ldf', name: 'LDF FC', shortName: 'LDF', color: '#334155' },
  swallows: { id: 'swallows', name: 'Swallows FC', shortName: 'SWA', color: '#0f766e' },
  kick4life: { id: 'kick4life', name: 'Kick4Life FC', shortName: 'K4L', color: '#7c3aed' },
  lijabatho: { id: 'lijabatho', name: 'Lijabatho FC', shortName: 'LIJ', color: '#0e7490' },
  manonyane: { id: 'manonyane', name: 'Manonyane FC', shortName: 'MAN', color: '#4d7c0f' },
  ccx: { id: 'ccx', name: 'CCX FC', shortName: 'CCX', color: '#9f1239' },
  mphatlalatsane: { id: 'mphatlalatsane', name: 'Mphatlalatsane FC', shortName: 'MPH', color: '#c2410c' },
  lifofane: { id: 'lifofane', name: 'Lifofane FC', shortName: 'LIF', color: '#0891b2' },
}

export interface DemoGoalEvent {
  minute: number
  player: string
  side: 'home' | 'away'
}

export interface DemoLiveMatch {
  id: string
  competition: string
  round: string
  home: DemoTeam
  away: DemoTeam
  homeScore: number
  awayScore: number
  minute: number
  venue: string
  events: DemoGoalEvent[]
}

export const LIVE_MATCHES: DemoLiveMatch[] = [
  {
    id: 'matlama-bantu',
    competition: 'Vodacom Premier League',
    round: 'Matchweek 6',
    home: DEMO_TEAMS.matlama,
    away: DEMO_TEAMS.bantu,
    homeScore: 2,
    awayScore: 1,
    minute: 67,
    venue: 'Setsoto Stadium, Maseru',
    events: [
      { minute: 12, player: 'Thabo Mokoena', side: 'home' },
      { minute: 34, player: 'Tumelo Ramohapi', side: 'away' },
      { minute: 58, player: 'Katleho Mofolo', side: 'home' },
    ],
  },
  {
    id: 'lioli-lmps',
    competition: 'Vodacom Premier League',
    round: 'Matchweek 6',
    home: DEMO_TEAMS.lioli,
    away: DEMO_TEAMS.lmps,
    homeScore: 0,
    awayScore: 0,
    minute: 23,
    venue: 'Lifelong Stadium, Maseru',
    events: [],
  },
  {
    id: 'lcs-linare',
    competition: 'Vodacom Premier League',
    round: 'Matchweek 6',
    home: DEMO_TEAMS.lcs,
    away: DEMO_TEAMS.linare,
    homeScore: 1,
    awayScore: 1,
    minute: 45,
    venue: 'LCS Ground, Maseru',
    events: [
      { minute: 19, player: 'Teboho Lekhooa', side: 'home' },
      { minute: 41, player: 'Mpho Thabantso', side: 'away' },
    ],
  },
  {
    id: 'ccx-lijabatho',
    competition: 'LNFA Knockout Cup',
    round: 'Quarter-final',
    home: DEMO_TEAMS.ccx,
    away: DEMO_TEAMS.lijabatho,
    homeScore: 1,
    awayScore: 2,
    minute: 55,
    venue: 'CCX Ground, Maseru',
    events: [
      { minute: 8, player: 'Lerato Nkosi', side: 'away' },
      { minute: 27, player: 'Pule Molefe', side: 'home' },
      { minute: 52, player: 'Sello Dlamini', side: 'away' },
    ],
  },
  {
    id: 'kick4life-manonyane',
    competition: 'Lesotho Championship',
    round: 'Matchweek 4',
    home: DEMO_TEAMS.kick4life,
    away: DEMO_TEAMS.manonyane,
    homeScore: 0,
    awayScore: 1,
    minute: 38,
    venue: 'Kick4Life Centre, Maseru',
    events: [{ minute: 21, player: 'Kabelo Khoza', side: 'away' }],
  },
]

export interface DemoFixture {
  id: string
  competition: string
  round: string
  home: DemoTeam
  away: DemoTeam
  kickoff: string
  date: string
  venue: string
}

export const TODAY_FIXTURES: DemoFixture[] = [
  {
    id: 'kick4life-swallows',
    competition: 'Vodacom Premier League',
    round: 'Matchweek 6',
    home: DEMO_TEAMS.kick4life,
    away: DEMO_TEAMS.swallows,
    kickoff: '15:00',
    date: 'Sat 21 Nov',
    venue: 'Kick4Life Centre, Maseru',
  },
  {
    id: 'ldf-lijabatho',
    competition: 'Vodacom Premier League',
    round: 'Matchweek 6',
    home: DEMO_TEAMS.ldf,
    away: DEMO_TEAMS.lijabatho,
    kickoff: '15:00',
    date: 'Sat 21 Nov',
    venue: 'LDF Ground, Maseru',
  },
  {
    id: 'manonyane-ccx',
    competition: 'Vodacom Premier League',
    round: 'Matchweek 6',
    home: DEMO_TEAMS.manonyane,
    away: DEMO_TEAMS.ccx,
    kickoff: '16:30',
    date: 'Sat 21 Nov',
    venue: 'Maputsoe Stadium',
  },
  {
    id: 'mphatlalatsane-lifofane',
    competition: 'Vodacom Premier League',
    round: 'Matchweek 6',
    home: DEMO_TEAMS.mphatlalatsane,
    away: DEMO_TEAMS.lifofane,
    kickoff: '18:00',
    date: 'Sat 21 Nov',
    venue: 'Setsoto Stadium, Maseru',
  },
]

export interface DemoResult {
  id: string
  competition: string
  round: string
  home: DemoTeam
  away: DemoTeam
  homeScore: number
  awayScore: number
  date: string
  venue: string
}

export const LATEST_RESULTS: DemoResult[] = [
  {
    id: 'linare-ldf',
    competition: 'Vodacom Premier League',
    round: 'Matchweek 5',
    home: DEMO_TEAMS.linare,
    away: DEMO_TEAMS.ldf,
    homeScore: 1,
    awayScore: 0,
    date: 'Fri 20 Nov',
    venue: 'Hlotse Stadium, Leribe',
  },
  {
    id: 'swallows-kick4life',
    competition: 'Vodacom Premier League',
    round: 'Matchweek 5',
    home: DEMO_TEAMS.swallows,
    away: DEMO_TEAMS.kick4life,
    homeScore: 2,
    awayScore: 2,
    date: 'Fri 20 Nov',
    venue: 'Makoanyane Square, Maseru',
  },
  {
    id: 'lijabatho-bantu',
    competition: 'Vodacom Premier League',
    round: 'Matchweek 5',
    home: DEMO_TEAMS.lijabatho,
    away: DEMO_TEAMS.bantu,
    homeScore: 0,
    awayScore: 3,
    date: 'Thu 19 Nov',
    venue: 'Maputsoe Stadium',
  },
  {
    id: 'ccx-mphatlalatsane',
    competition: 'Vodacom Premier League',
    round: 'Matchweek 5',
    home: DEMO_TEAMS.ccx,
    away: DEMO_TEAMS.mphatlalatsane,
    homeScore: 1,
    awayScore: 1,
    date: 'Thu 19 Nov',
    venue: 'CCX Ground, Maseru',
  },
]

export interface DemoTopScorer {
  id: string
  name: string
  position: string
  club: DemoTeam
  goals: number
  assists: number
}

export const TOP_SCORERS: DemoTopScorer[] = [
  { id: 'thabo-mokoena', name: 'Thabo Mokoena', position: 'Forward', club: DEMO_TEAMS.matlama, goals: 11, assists: 4 },
  { id: 'tumelo-ramohapi', name: 'Tumelo Ramohapi', position: 'Forward', club: DEMO_TEAMS.bantu, goals: 9, assists: 2 },
  { id: 'katleho-mofolo', name: 'Katleho Mofolo', position: 'Midfielder', club: DEMO_TEAMS.matlama, goals: 8, assists: 6 },
  { id: 'mpho-thabantso', name: 'Mpho Thabantso', position: 'Forward', club: DEMO_TEAMS.linare, goals: 7, assists: 1 },
  { id: 'teboho-lekhooa', name: 'Teboho Lekhooa', position: 'Midfielder', club: DEMO_TEAMS.lcs, goals: 6, assists: 5 },
]

export interface DemoFeaturedClub {
  team: DemoTeam
  stadium: string
  district: string
}

export const FEATURED_CLUBS: DemoFeaturedClub[] = [
  { team: DEMO_TEAMS.matlama, stadium: 'Setsoto Stadium', district: 'Maseru' },
  { team: DEMO_TEAMS.bantu, stadium: 'Makoanyane Square', district: 'Maseru' },
  { team: DEMO_TEAMS.lioli, stadium: 'Teyateyaneng Stadium', district: 'Berea' },
  { team: DEMO_TEAMS.lmps, stadium: 'LMPS Ground', district: 'Maseru' },
  { team: DEMO_TEAMS.lcs, stadium: 'LCS Ground', district: 'Maseru' },
  { team: DEMO_TEAMS.linare, stadium: 'Hlotse Stadium', district: 'Leribe' },
]

export interface DemoNewsItem {
  id: string
  title: string
  excerpt: string
  category: string
  date: string
  to: string
}

export const LATEST_NEWS: DemoNewsItem[] = [
  {
    id: 'matchweek-6-preview',
    title: 'Matchweek 6 preview: title race tightens at the top',
    excerpt:
      'Bantu and Matlama meet at Setsoto Stadium with top spot on the line, while Lioli look to close the gap.',
    category: 'Premier League',
    date: 'Today',
    to: ROUTES.news,
  },
  {
    id: 'knockout-cup-draw',
    title: 'LNFA Knockout Cup quarter-final draw confirmed',
    excerpt:
      'Eight clubs remain in the national cup, with two all-premier-league ties among the quarter-final fixtures.',
    category: 'Cup',
    date: 'Yesterday',
    to: ROUTES.news,
  },
  {
    id: 'transfer-window-update',
    title: 'Transfer window: clubs strengthen ahead of second round',
    excerpt:
      'Several clubs have completed registrations as the mid-season window approaches its closing date.',
    category: 'Transfers',
    date: '2 days ago',
    to: ROUTES.news,
  },
]

export interface DemoCompetition {
  id: string
  name: string
  status: 'In progress' | 'Upcoming'
  detail: string
  to: string
}

export const UPCOMING_COMPETITIONS: DemoCompetition[] = [
  {
    id: 'premier-league',
    name: 'Vodacom Premier League',
    status: 'In progress',
    detail: 'Matchweek 6 of 30',
    to: ROUTES.premierLeague,
  },
  {
    id: 'knockout-cup',
    name: 'LNFA Knockout Cup',
    status: 'Upcoming',
    detail: 'Quarter-finals',
    to: ROUTES.knockoutCup,
  },
  {
    id: 'championship',
    name: 'Lesotho Championship',
    status: 'Upcoming',
    detail: 'New season',
    to: ROUTES.championship,
  },
]

export function matchCentrePath(matchId: string): string {
  return `${ROUTES.matches}/${matchId}`
}

export function clubPath(clubId: string): string {
  return `${ROUTES.clubs}/${clubId}`
}
