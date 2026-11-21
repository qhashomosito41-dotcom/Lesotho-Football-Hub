import { CLUB_PROFILES, type ClubProfile } from './clubs'
import { competitionName, MATCH_RESULTS, SCHEDULE, type MatchResult, type ScheduleFixture } from './league'
import { getLineup } from './matches'
import { PLAYER_LIST, type PlayerProfile } from './players'
import { TRANSFERS, TRANSFER_TYPE_LABELS, type TransferRecord } from './transfers'

export type ClubSectionId =
  | 'overview'
  | 'profile'
  | 'squad'
  | 'registration'
  | 'matchday-squad'
  | 'starting-xi'
  | 'fixtures'
  | 'match-centre'
  | 'transfers'
  | 'match-reports'
  | 'staff'

export type ClubStatus = 'Pending' | 'Verified' | 'Approved' | 'Submitted' | 'Draft' | 'Active' | 'Available' | 'Injured' | 'Suspended'

export const AUTHORISED_CLUB_IDS = ['matlama'] as const

export const AUTHORISED_CLUB_ID = AUTHORISED_CLUB_IDS[0]

export function isAuthorisedClub(id: string): boolean {
  return AUTHORISED_CLUB_IDS.some((clubId) => clubId === id)
}

const CLUB_SECTION_IDS: ClubSectionId[] = [
  'overview',
  'profile',
  'squad',
  'registration',
  'matchday-squad',
  'starting-xi',
  'fixtures',
  'match-centre',
  'transfers',
  'match-reports',
  'staff',
]

export function isClubSection(value: string | null): value is ClubSectionId {
  return Boolean(value && CLUB_SECTION_IDS.some((section) => section === value))
}

export const CLUB_SECTION_META: Record<ClubSectionId, { title: string; description: string }> = {
  overview: { title: 'Club dashboard', description: 'Squad, matchday and administration activity for your authorised club.' },
  profile: { title: 'Club profile', description: 'Maintain club details and review authorised representation.' },
  squad: { title: 'Squad management', description: 'Register players, maintain profiles, shirt numbers, positions and availability.' },
  registration: { title: 'Player registration', description: 'Submit and track player registrations with the league office.' },
  'matchday-squad': { title: 'Matchday squad', description: 'Select the 18 players available for the next match.' },
  'starting-xi': { title: 'Starting XI', description: 'Choose formation, goalkeeper, captain and the starting eleven.' },
  fixtures: { title: 'Fixtures', description: 'Upcoming matches and preparation status for your club.' },
  'match-centre': { title: 'Match centre', description: 'Line-ups, events and reporting tools for club matches.' },
  transfers: { title: 'Transfers', description: 'Create and track transfer requests involving your club.' },
  'match-reports': { title: 'Match reports', description: 'Submit and review match reports for completed fixtures.' },
  staff: { title: 'Club staff', description: 'Manage staff access and club-based permissions.' },
}

export const CLUB_SCOPE_OPTIONS = AUTHORISED_CLUB_IDS.map((id) => ({
  value: id,
  label: CLUB_PROFILES[id].name,
}))

export const CLUB_PROFILE: ClubProfile = CLUB_PROFILES[AUTHORISED_CLUB_ID]

export interface ClubRepresentative {
  id: string
  name: string
  role: string
  email: string
  relationship: string
  status: 'Active' | 'Pending'
}

export const CLUB_REPRESENTATIVES: ClubRepresentative[] = [
  { id: 'rep-01', name: 'Mpho Lerotholi', role: 'Club administrator', email: 'mpho@matlamafc.co.ls', relationship: 'Club secretary', status: 'Active' },
  { id: 'rep-02', name: 'Teboho Nkosi', role: 'Coach', email: 'teboho@matlamafc.co.ls', relationship: 'First team coach', status: 'Active' },
  { id: 'rep-03', name: 'Refiloe Mokhosi', role: 'Team manager', email: 'refiloe@matlamafc.co.ls', relationship: 'Team operations', status: 'Active' },
]

export interface ClubPermissionModule {
  id: string
  label: string
  description: string
  roles: string[]
}

export const CLUB_PERMISSIONS: ClubPermissionModule[] = [
  { id: 'profile', label: 'Club profile', description: 'View and update club contact details.', roles: ['Club administrator'] },
  { id: 'squad', label: 'Squad management', description: 'Register players and maintain squad records.', roles: ['Club administrator', 'Team manager'] },
  { id: 'registration', label: 'Player registration', description: 'Submit registrations and view league status.', roles: ['Club administrator', 'Team manager'] },
  { id: 'matchday', label: 'Matchday squad', description: 'Select the matchday squad and starting XI.', roles: ['Club administrator', 'Coach', 'Team manager'] },
  { id: 'transfers', label: 'Transfers', description: 'Create and track transfer requests.', roles: ['Club administrator'] },
  { id: 'reports', label: 'Match reports', description: 'Submit reports and confirm match information.', roles: ['Club administrator', 'Coach', 'Team manager'] },
  { id: 'staff', label: 'Club staff', description: 'Manage representatives and their access.', roles: ['Club administrator'] },
]

export const CLUB_PLAYERS: PlayerProfile[] = PLAYER_LIST.filter((player) => player.club.id === AUTHORISED_CLUB_ID)

export interface ClubPlayerRecord {
  id: string
  player: PlayerProfile
  shirtNumber: number
  position: string
  registration: 'Verified' | 'Pending' | 'Rejected'
  availability: 'Available' | 'Injured' | 'Suspended'
}

export const CLUB_PLAYER_RECORDS: ClubPlayerRecord[] = CLUB_PLAYERS.map((player, index) => ({
  id: `club-player-${player.id}`,
  player,
  shirtNumber: player.number || index + 1,
  position: player.position,
  registration: index % 5 === 3 ? 'Pending' : 'Verified',
  availability: index % 7 === 4 ? 'Injured' : 'Available',
}))

export interface ClubRegistration {
  id: string
  playerName: string
  position: string
  submitted: string
  competition: string
  documents: number
  status: 'Pending' | 'Verified' | 'Rejected'
}

export const CLUB_REGISTRATIONS: ClubRegistration[] = CLUB_PLAYER_RECORDS.slice(0, 10).map((record, index) => ({
  id: `club-reg-${record.player.id}`,
  playerName: record.player.name,
  position: record.position,
  submitted: `2026-11-${String(8 + index).padStart(2, '0')}`,
  competition: CLUB_PROFILE.competition,
  documents: 3 + (index % 3),
  status: record.registration,
}))

export const CLUB_FIXTURES: ScheduleFixture[] = SCHEDULE.filter(
  (fixture) => fixture.home.id === AUTHORISED_CLUB_ID || fixture.away.id === AUTHORISED_CLUB_ID,
).sort((first, second) => first.dateISO.localeCompare(second.dateISO) || first.kickoff.localeCompare(second.kickoff))

export const CLUB_RESULTS: MatchResult[] = MATCH_RESULTS.filter(
  (result) => result.home.id === AUTHORISED_CLUB_ID || result.away.id === AUTHORISED_CLUB_ID,
).sort((first, second) => second.dateISO.localeCompare(first.dateISO))

const lineup = getLineup(AUTHORISED_CLUB_ID)

export const CLUB_MATCHDAY = {
  formation: lineup?.formation ?? '4-3-3',
  starters: lineup?.starters ?? [],
  substitutes: lineup?.substitutes ?? [],
  coach: lineup?.coach ?? CLUB_PROFILE.coach,
}

export const CLUB_TRANSFERS: TransferRecord[] = TRANSFERS.filter(
  (transfer) => transfer.fromClub === CLUB_PROFILE.name || transfer.toClub === CLUB_PROFILE.name,
)

export interface ClubMatchReport {
  id: string
  fixture: string
  competition: string
  date: string
  referee: string
  status: 'Submitted' | 'Draft' | 'Requested'
  notes: number
}

export const CLUB_MATCH_REPORTS: ClubMatchReport[] = CLUB_RESULTS.slice(0, 6).map((result, index) => ({
  id: `club-report-${result.id}`,
  fixture: `${result.home.name} vs ${result.away.name}`,
  competition: competitionName(result.competitionId),
  date: result.dateISO,
  referee: ['Teboho Khalo', 'Palesa Mokhosi', 'Thabo Letsie'][index % 3],
  status: index % 3 === 1 ? 'Draft' : 'Submitted',
  notes: 2 + (index % 4),
}))

export interface ClubStaffMember {
  id: string
  name: string
  role: string
  email: string
  phone: string
  access: string
  status: 'Active' | 'Pending'
}

export const CLUB_STAFF: ClubStaffMember[] = [
  { id: 'staff-01', name: 'Mpho Lerotholi', role: 'Club administrator', email: 'mpho@matlamafc.co.ls', phone: '+266 5880 1122', access: 'Full club access', status: 'Active' },
  { id: 'staff-02', name: 'Teboho Nkosi', role: 'Coach', email: 'teboho@matlamafc.co.ls', phone: '+266 5880 3344', access: 'Matchday and reports', status: 'Active' },
  { id: 'staff-03', name: 'Refiloe Mokhosi', role: 'Team manager', email: 'refiloe@matlamafc.co.ls', phone: '+266 5880 5566', access: 'Squad and registration', status: 'Active' },
  { id: 'staff-04', name: 'Lerato Ramohapi', role: 'Kit manager', email: 'lerato@matlamafc.co.ls', phone: '+266 5880 7788', access: 'Squad read only', status: 'Pending' },
]

export const CLUB_STATS = {
  squadPlayers: CLUB_PLAYER_RECORDS.length,
  upcomingMatches: CLUB_FIXTURES.length,
  recentResults: CLUB_RESULTS.length,
  pendingRegistrations: CLUB_REGISTRATIONS.filter((registration) => registration.status === 'Pending').length,
  transferRequests: CLUB_TRANSFERS.filter((transfer) => transfer.status === 'pending').length,
  availablePlayers: CLUB_PLAYER_RECORDS.filter((record) => record.availability === 'Available').length,
  matchdayReadiness: 82,
  authorisedClubs: AUTHORISED_CLUB_IDS.length,
}

export function opponentFor(fixture: ScheduleFixture): string {
  const opponent = fixture.home.id === AUTHORISED_CLUB_ID ? fixture.away : fixture.home
  const prefix = fixture.home.id === AUTHORISED_CLUB_ID ? 'vs' : 'at'
  return `${prefix} ${opponent.name}`
}

export function transferLabel(transfer: TransferRecord): string {
  return TRANSFER_TYPE_LABELS[transfer.type] ?? transfer.type
}
