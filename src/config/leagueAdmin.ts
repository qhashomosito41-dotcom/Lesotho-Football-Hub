import { CLUB_LIST, type ClubProfile } from './clubs'
import { COMPETITION_PROFILES, COMPETITION_SEASONS, type CompetitionProfile } from './competitions'
import { MATCH_RESULTS, SCHEDULE, SEASON_CURRENT, calculateStandings, competitionName, type CompetitionId, type MatchResult, type ScheduleFixture, type StandingRow } from './league'
import { PLAYER_LIST, type PlayerProfile } from './players'
import { TRANSFERS, type TransferRecord } from './transfers'

export type LeagueSectionId =
  | 'overview'
  | 'competitions'
  | 'seasons'
  | 'clubs'
  | 'players'
  | 'fixtures'
  | 'officials'
  | 'results'
  | 'standings'
  | 'transfers'
  | 'disputes'
  | 'reports'

export type LeagueStatus =
  | 'Pending'
  | 'Approved'
  | 'Verified'
  | 'Published'
  | 'Draft'
  | 'Active'
  | 'Completed'
  | 'Open'
  | 'Under review'
  | 'Resolved'
  | 'Rejected'

export const ASSIGNED_COMPETITION_IDS: CompetitionId[] = ['premier-league', 'knockout-cup']

export function isAssignedCompetition(id: string): id is CompetitionId {
  return ASSIGNED_COMPETITION_IDS.some((competitionId) => competitionId === id)
}

const LEAGUE_SECTION_IDS: LeagueSectionId[] = [
  'overview',
  'competitions',
  'seasons',
  'clubs',
  'players',
  'fixtures',
  'officials',
  'results',
  'standings',
  'transfers',
  'disputes',
  'reports',
]

export function isLeagueSection(value: string | null): value is LeagueSectionId {
  return Boolean(value && LEAGUE_SECTION_IDS.some((section) => section === value))
}

export const LEAGUE_SECTION_META: Record<LeagueSectionId, { title: string; description: string }> = {
  overview: { title: 'League administrator dashboard', description: 'A focused control room for competitions assigned to this administrator.' },
  competitions: { title: 'Assigned competitions', description: 'Create and configure only the competitions in your assigned portfolio.' },
  seasons: { title: 'Season management', description: 'Manage competition seasons, milestones and publication status.' },
  clubs: { title: 'Club approvals', description: 'Review and approve club registrations for assigned competitions.' },
  players: { title: 'Player registrations', description: 'Verify player registrations and eligibility for assigned competitions.' },
  fixtures: { title: 'Fixtures', description: 'Create fixtures and manage reschedule requests within your competitions.' },
  officials: { title: 'Match officials', description: 'Assign referees, assistants and match commissioners to upcoming fixtures.' },
  results: { title: 'Match results', description: 'Verify submitted results before they are published to the public site.' },
  standings: { title: 'Standings', description: 'Review table positions calculated from verified results.' },
  transfers: { title: 'Transfers', description: 'Approve or reject transfer requests involving clubs in your competitions.' },
  disputes: { title: 'Disputes', description: 'Review disputed match reports and record resolutions.' },
  reports: { title: 'Reports', description: 'Generate operational reports for assigned competitions.' },
}

export type CompetitionProfileWithScope = CompetitionProfile & { id: CompetitionId }

export const LEAGUE_COMPETITIONS = COMPETITION_PROFILES.filter((profile) => isAssignedCompetition(profile.id)) as CompetitionProfileWithScope[]

export const LEAGUE_ASSIGNED_COMPETITION_OPTIONS = LEAGUE_COMPETITIONS.map((profile) => ({
  value: profile.id,
  label: profile.name,
}))

export const LEAGUE_CLUBS: ClubProfile[] = CLUB_LIST.filter((club) => isAssignedCompetition(club.competitionId))

export const LEAGUE_PLAYERS: PlayerProfile[] = PLAYER_LIST.filter((player) => isAssignedCompetition(player.club.competitionId))

export const LEAGUE_FIXTURES: ScheduleFixture[] = SCHEDULE.filter((fixture) => isAssignedCompetition(fixture.competitionId)).sort((first, second) =>
  first.dateISO.localeCompare(second.dateISO) || first.kickoff.localeCompare(second.kickoff),
)

export const LEAGUE_RESULTS: MatchResult[] = MATCH_RESULTS.filter((result) => isAssignedCompetition(result.competitionId))

export interface LeagueClubApproval {
  id: string
  club: ClubProfile
  submitted: string
  documents: number
  status: 'Pending' | 'Approved' | 'Rejected'
}

export const LEAGUE_CLUB_APPROVALS: LeagueClubApproval[] = LEAGUE_CLUBS.slice(0, 12).map((club, index) => ({
  id: `league-club-${club.id}`,
  club,
  submitted: `2026-11-${String(12 + index).padStart(2, '0')}`,
  documents: 4 + (index % 3),
  status: index % 4 === 1 ? 'Pending' : 'Approved',
}))

export interface LeaguePlayerRegistration {
  id: string
  player: PlayerProfile
  competition: string
  submitted: string
  status: 'Pending' | 'Verified' | 'Rejected'
}

export const LEAGUE_PLAYER_REGISTRATIONS: LeaguePlayerRegistration[] = LEAGUE_PLAYERS.slice(0, 12).map((player, index) => ({
  id: `league-reg-${player.id}`,
  player,
  competition: competitionName(player.club.competitionId),
  submitted: `2026-11-${String(10 + index).padStart(2, '0')}`,
  status: index % 3 === 0 ? 'Pending' : 'Verified',
}))

export interface LeagueRescheduleRequest {
  id: string
  fixture: ScheduleFixture
  requestedBy: string
  reason: string
  proposedDate: string
  proposedKickoff: string
  status: 'Pending' | 'Approved' | 'Rejected'
}

export const LEAGUE_RESCHEDULES: LeagueRescheduleRequest[] = LEAGUE_FIXTURES.slice(0, 5).map((fixture, index) => ({
  id: `reschedule-${fixture.id}`,
  fixture,
  requestedBy: index % 2 === 0 ? fixture.home.name : fixture.away.name,
  reason: ['Venue conflict', 'Broadcast scheduling', 'Cup fixture clash', 'Travel arrangement', 'Pitch condition'][index],
  proposedDate: `2026-11-${String(23 + index).padStart(2, '0')}`,
  proposedKickoff: index % 2 === 0 ? '16:00' : '18:30',
  status: index === 4 ? 'Approved' : 'Pending',
}))

export interface LeagueOfficialAssignment {
  id: string
  name: string
  role: 'Referee' | 'Assistant referee' | 'Fourth official' | 'Match commissioner'
  competitionId: CompetitionId
  competition: string
  fixtures: number
  status: 'Active' | 'Pending'
}

export const LEAGUE_OFFICIALS: LeagueOfficialAssignment[] = [
  { id: 'off-01', name: 'Teboho Khalo', role: 'Referee', competitionId: 'premier-league', competition: competitionName('premier-league'), fixtures: 8, status: 'Active' },
  { id: 'off-02', name: 'Matšepo Ralebeka', role: 'Assistant referee', competitionId: 'premier-league', competition: competitionName('premier-league'), fixtures: 6, status: 'Active' },
  { id: 'off-03', name: 'Thabo Letsie', role: 'Match commissioner', competitionId: 'knockout-cup', competition: competitionName('knockout-cup'), fixtures: 4, status: 'Active' },
  { id: 'off-04', name: 'Palesa Mokhosi', role: 'Fourth official', competitionId: 'knockout-cup', competition: competitionName('knockout-cup'), fixtures: 3, status: 'Pending' },
  { id: 'off-05', name: "Rants'o Thabane", role: 'Referee', competitionId: 'knockout-cup', competition: competitionName('knockout-cup'), fixtures: 2, status: 'Active' },
]

export interface LeagueResultReview {
  id: string
  result: MatchResult
  competition: string
  submittedBy: string
  submitted: string
  status: 'Pending verification' | 'Verified' | 'Flagged'
}

export const LEAGUE_RESULT_REVIEWS: LeagueResultReview[] = LEAGUE_RESULTS.slice(0, 12).map((result, index) => ({
  id: `result-review-${result.id}`,
  result,
  competition: competitionName(result.competitionId),
  submittedBy: index % 2 === 0 ? result.home.name : result.away.name,
  submitted: `2026-11-${String(14 + index).padStart(2, '0')} 18:${String(10 + index).padStart(2, '0')}`,
  status: index % 4 === 0 ? 'Pending verification' : index % 5 === 0 ? 'Flagged' : 'Verified',
}))

export const LEAGUE_STANDINGS: { competitionId: CompetitionId; competition: string; rows: StandingRow[] }[] = LEAGUE_COMPETITIONS.map((profile) => ({
  competitionId: profile.id,
  competition: profile.name,
  rows: calculateStandings(profile.id, SEASON_CURRENT),
}))

export const LEAGUE_TRANSFERS: TransferRecord[] = TRANSFERS.filter((transfer) => {
  const from = CLUB_LIST.find((club) => club.name === transfer.fromClub)
  const to = CLUB_LIST.find((club) => club.name === transfer.toClub)
  return (from && isAssignedCompetition(from.competitionId)) || (to && isAssignedCompetition(to.competitionId))
})

export interface LeagueDispute {
  id: string
  reference: string
  competitionId: CompetitionId
  competition: string
  fixture: string
  raisedBy: string
  category: 'Eligibility' | 'Match report' | 'Venue' | 'Result'
  submitted: string
  status: 'Open' | 'Under review' | 'Resolved'
  summary: string
}

export const LEAGUE_DISPUTES: LeagueDispute[] = [
  { id: 'dispute-01', reference: 'DSP-2026-118', competitionId: 'premier-league', competition: competitionName('premier-league'), fixture: 'Bantu FC vs LCS', raisedBy: 'LCS', category: 'Eligibility', submitted: '2026-11-20 12:18', status: 'Open', summary: 'Question raised over an unregistered substitute listed on the match sheet.' },
  { id: 'dispute-02', reference: 'DSP-2026-117', competitionId: 'knockout-cup', competition: competitionName('knockout-cup'), fixture: 'CCX vs Kick4Life', raisedBy: 'CCX', category: 'Match report', submitted: '2026-11-19 17:42', status: 'Under review', summary: 'Referee report and assistant notes disagree on the ordering of two second-half events.' },
  { id: 'dispute-03', reference: 'DSP-2026-115', competitionId: 'premier-league', competition: competitionName('premier-league'), fixture: 'Matlama FC vs Lioli FC', raisedBy: 'Lioli FC', category: 'Venue', submitted: '2026-11-18 09:05', status: 'Resolved', summary: 'Kick-off was delayed while floodlight availability was confirmed.' },
  { id: 'dispute-04', reference: 'DSP-2026-112', competitionId: 'knockout-cup', competition: competitionName('knockout-cup'), fixture: 'Swallows FC vs Manonyane', raisedBy: 'Manonyane', category: 'Result', submitted: '2026-11-16 20:31', status: 'Open', summary: 'Club contests the final score entered by the match commissioner.' },
]

export interface LeagueRuleGroup {
  id: string
  competitionId: CompetitionId
  competition: string
  title: string
  settings: { id: string; label: string; value: string | boolean; description: string; options?: string[] }[]
}

export const LEAGUE_RULES: LeagueRuleGroup[] = LEAGUE_COMPETITIONS.map((profile, index) => ({
  id: `rules-${profile.id}`,
  competitionId: profile.id,
  competition: profile.name,
  title: `${profile.shortName} rules`,
  settings: [
    { id: `${profile.id}-points`, label: 'Points for a win', value: '3', description: 'Points awarded for a regulation win.', options: ['2', '3'] },
    { id: `${profile.id}-substitutions`, label: 'Maximum substitutions', value: '5', description: 'Substitutions permitted per match.', options: ['3', '4', '5'] },
    { id: `${profile.id}-squad`, label: 'Matchday squad size', value: index === 0 ? '20' : '18', description: 'Players named on the official match sheet.', options: ['16', '18', '20'] },
    { id: `${profile.id}-card-suspension`, label: 'Suspension after yellow cards', value: '4', description: 'Accumulated yellow cards that trigger a suspension.', options: ['3', '4', '5'] },
    { id: `${profile.id}-var`, label: 'Video assistant referee', value: index === 0, description: 'Use video review for selected matches.' },
    { id: `${profile.id}-publish`, label: 'Publish table automatically', value: true, description: 'Update the public table after result verification.' },
  ],
}))

export interface LeagueReport {
  id: string
  title: string
  description: string
  competitionId: CompetitionId
  competition: string
  format: 'PDF' | 'CSV' | 'XLSX'
  schedule: string
  status: 'Ready' | 'Scheduled'
}

export const LEAGUE_REPORTS: LeagueReport[] = [
  { id: 'rep-01', title: 'Competition operations summary', description: 'Fixtures, results and approval activity for the current season.', competitionId: 'premier-league', competition: competitionName('premier-league'), format: 'PDF', schedule: 'On demand', status: 'Ready' },
  { id: 'rep-02', title: 'Registration audit', description: 'Club and player registration status by competition.', competitionId: 'premier-league', competition: competitionName('premier-league'), format: 'XLSX', schedule: 'Weekly', status: 'Scheduled' },
  { id: 'rep-03', title: 'Dispute register', description: 'Open, reviewed and resolved disputed match reports.', competitionId: 'knockout-cup', competition: competitionName('knockout-cup'), format: 'CSV', schedule: 'On demand', status: 'Ready' },
  { id: 'rep-04', title: 'Official appointments', description: 'Referees and commissioners assigned during the season.', competitionId: 'knockout-cup', competition: competitionName('knockout-cup'), format: 'PDF', schedule: 'Monthly', status: 'Scheduled' },
]

export const LEAGUE_SEASONS = COMPETITION_SEASONS.map((season, index) => ({
  season,
  status: index === 0 ? 'Active' : 'Completed',
  startDate: `${season.slice(0, 4)}-08-15`,
  endDate: `${season.slice(5)}-05-30`,
}))

export const LEAGUE_STATS = {
  assignedCompetitions: LEAGUE_COMPETITIONS.length,
  registeredClubs: LEAGUE_CLUBS.length,
  registeredPlayers: LEAGUE_PLAYERS.length,
  upcomingFixtures: LEAGUE_FIXTURES.filter((fixture) => fixture.dateISO >= '2026-11-21').length,
  completedMatches: LEAGUE_RESULTS.length,
  pendingResults: LEAGUE_RESULT_REVIEWS.filter((review) => review.status === 'Pending verification').length,
  pendingTransfers: LEAGUE_TRANSFERS.filter((transfer) => transfer.status === 'pending').length,
  disputedReports: LEAGUE_DISPUTES.filter((dispute) => dispute.status !== 'Resolved').length,
}
