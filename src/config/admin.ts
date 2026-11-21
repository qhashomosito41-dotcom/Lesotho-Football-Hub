import type { UserRoleId } from './auth'
import { CLUB_LIST } from './clubs'
import { COMPETITION_PROFILES, COMPETITION_SEASONS } from './competitions'
import { LIVE_MATCHES } from './homepage'
import { SCHEDULE } from './league'
import { PLAYER_LIST } from './players'
import { TRANSFERS } from './transfers'

export type AdminSectionId =
  | 'overview'
  | 'users'
  | 'clubs'
  | 'players'
  | 'competitions'
  | 'seasons'
  | 'fixtures'
  | 'matches'
  | 'transfers'
  | 'statistics'
  | 'reports'
  | 'audit'
  | 'settings'

export type AdminRecordStatus = 'Active' | 'Pending' | 'Suspended' | 'Verified' | 'Rejected' | 'Draft' | 'Archived' | 'Approved'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: UserRoleId
  organization: string
  status: 'Active' | 'Pending' | 'Suspended'
  lastActive: string
  joined: string
  mfa: boolean
}

export const ADMIN_USERS: AdminUser[] = [
  { id: 'usr-001', name: 'Nthabiseng Mota', email: 'nthabiseng@lfh.org.ls', role: 'super-administrator', organization: 'LFH Platform', status: 'Active', lastActive: '2026-11-21 08:42', joined: '2024-02-12', mfa: true },
  { id: 'usr-002', name: 'Thabiso Khene', email: 'thabiso.khene@lfh.org.ls', role: 'league-administrator', organization: 'LFH Competition Dept.', status: 'Active', lastActive: '2026-11-21 08:16', joined: '2024-03-04', mfa: true },
  { id: 'usr-003', name: 'Mpho Lerotholi', email: 'mpho@matlamafc.co.ls', role: 'club-administrator', organization: 'Matlama FC', status: 'Active', lastActive: '2026-11-20 19:24', joined: '2024-05-18', mfa: true },
  { id: 'usr-004', name: 'Lerato Ramohapi', email: 'lerato@bantufc.co.ls', role: 'team-manager', organization: 'Bantu FC', status: 'Active', lastActive: '2026-11-20 17:05', joined: '2024-07-02', mfa: false },
  { id: 'usr-005', name: 'Teboho Nkosi', email: 'teboho@liolifc.co.ls', role: 'coach', organization: 'Lioli FC', status: 'Active', lastActive: '2026-11-20 15:48', joined: '2024-08-11', mfa: true },
  { id: 'usr-006', name: 'Katleho Mokoena', email: 'katleho@lcs.co.ls', role: 'assistant-coach', organization: 'LCS', status: 'Pending', lastActive: 'Never', joined: '2026-11-19', mfa: false },
  { id: 'usr-007', name: 'Palesa Moloi', email: 'palesa@fan.ls', role: 'public-supporter', organization: 'Public supporter', status: 'Active', lastActive: '2026-11-21 07:55', joined: '2025-01-09', mfa: false },
  { id: 'usr-008', name: 'Sello Mabaso', email: 'sello@lifofane.co.ls', role: 'club-administrator', organization: 'Lifofane FC', status: 'Suspended', lastActive: '2026-10-30 12:12', joined: '2024-09-21', mfa: true },
  { id: 'usr-009', name: 'Naledi Thabane', email: 'naledi@lfh.org.ls', role: 'league-administrator', organization: 'LFH Competition Dept.', status: 'Active', lastActive: '2026-11-21 06:31', joined: '2025-02-17', mfa: true },
  { id: 'usr-010', name: 'Kagiso moshoeshoe', email: 'kagiso@linarefc.co.ls', role: 'coach', organization: 'Linare FC', status: 'Pending', lastActive: 'Never', joined: '2026-11-20', mfa: false },
  { id: 'usr-011', name: 'Refiloe Mokhosi', email: 'refiloe@swallowsfc.co.ls', role: 'team-manager', organization: 'Swallows FC', status: 'Active', lastActive: '2026-11-19 21:04', joined: '2025-04-23', mfa: false },
  { id: 'usr-012', name: 'Tsoanelo Phiri', email: 'tsoanelo@kick4life.org', role: 'club-administrator', organization: 'Kick4Life', status: 'Active', lastActive: '2026-11-18 14:37', joined: '2025-06-12', mfa: true },
]

export interface AdminAccessRequest {
  id: string
  name: string
  email: string
  requestedRole: UserRoleId
  organization: string
  submitted: string
  status: 'Pending' | 'Approved' | 'Rejected'
  note: string
}

export const ADMIN_REQUESTS: AdminAccessRequest[] = [
  { id: 'req-301', name: 'Kagiso Moshoeshoe', email: 'kagiso@linarefc.co.ls', requestedRole: 'coach', organization: 'Linare FC', submitted: '2026-11-20 16:12', status: 'Pending', note: 'Head coach appointment confirmed by club secretary.' },
  { id: 'req-302', name: 'Mamello Sithole', email: 'mamello@lmps.co.ls', requestedRole: 'club-administrator', organization: 'LMPS', submitted: '2026-11-20 10:44', status: 'Pending', note: 'Replacing outgoing club administrator.' },
  { id: 'req-303', name: 'Rethabile Molemohi', email: 'rethabile@championship.ls', requestedRole: 'league-administrator', organization: 'Championship office', submitted: '2026-11-19 14:02', status: 'Pending', note: 'Needs results-entry access for Championship.' },
  { id: 'req-304', name: 'Itumeleng Ralebeloa', email: 'itumeleng@fan.ls', requestedRole: 'public-supporter', organization: 'Public supporter', submitted: '2026-11-18 09:21', status: 'Approved', note: 'Standard supporter account.' },
  { id: 'req-305', name: 'Thato Mbele', email: 'thato@academy.ls', requestedRole: 'assistant-coach', organization: 'Kick4Life Academy', submitted: '2026-11-17 17:38', status: 'Rejected', note: 'Organization could not be verified.' },
]

export interface AdminPermissionModule {
  id: string
  label: string
  description: string
}

export const ADMIN_PERMISSION_MODULES: AdminPermissionModule[] = [
  { id: 'users', label: 'Users & roles', description: 'Create accounts, assign roles and manage access.' },
  { id: 'clubs', label: 'Clubs', description: 'Verify clubs and maintain club records.' },
  { id: 'players', label: 'Players', description: 'Maintain registrations and player profiles.' },
  { id: 'competitions', label: 'Competitions', description: 'Create competitions and manage formats.' },
  { id: 'fixtures', label: 'Fixtures & results', description: 'Publish fixtures and confirm results.' },
  { id: 'transfers', label: 'Transfers', description: 'Review and approve transfer records.' },
  { id: 'statistics', label: 'Statistics', description: 'Maintain season and player statistics.' },
  { id: 'settings', label: 'System settings', description: 'Configure platform-wide options.' },
]

export interface AdminAppointment {
  id: string
  name: string
  email: string
  role: UserRoleId
  scope: string
  nominatedBy: string
  status: 'Pending' | 'Active'
}

export const ADMIN_APPOINTMENTS: AdminAppointment[] = [
  { id: 'app-401', name: 'Mamello Sithole', email: 'mamello@lmps.co.ls', role: 'club-administrator', scope: 'LMPS', nominatedBy: 'Nthabiseng Mota', status: 'Pending' },
  { id: 'app-402', name: 'Rethabile Molemohi', email: 'rethabile@championship.ls', role: 'league-administrator', scope: 'Championship', nominatedBy: 'Thabiso Khene', status: 'Pending' },
  { id: 'app-403', name: 'Naledi Thabane', email: 'naledi@lfh.org.ls', role: 'league-administrator', scope: 'All competitions', nominatedBy: 'Nthabiseng Mota', status: 'Active' },
  { id: 'app-404', name: 'Tsoanelo Phiri', email: 'tsoanelo@kick4life.org', role: 'club-administrator', scope: 'Kick4Life', nominatedBy: 'Naledi Thabane', status: 'Active' },
]

export interface AdminClubVerification {
  id: string
  name: string
  district: string
  competition: string
  verification: 'Verified' | 'Pending' | 'Rejected'
  submitted: string
  documents: number
}

export const ADMIN_CLUB_VERIFICATIONS: AdminClubVerification[] = CLUB_LIST.slice(0, 10).map((club, index) => ({
  id: club.id,
  name: club.name,
  district: club.district,
  competition: club.competition,
  verification: index === 4 ? 'Pending' : index === 7 ? 'Rejected' : 'Verified',
  submitted: index === 4 ? '2026-11-20' : '2026-10-12',
  documents: index === 4 ? 2 : 4,
}))

export interface AdminSeasonRecord {
  id: string
  season: string
  status: 'Current' | 'Draft' | 'Archived'
  competitions: number
  fixtures: number
  registeredPlayers: number
  opened: string
}

export const ADMIN_SEASONS: AdminSeasonRecord[] = COMPETITION_SEASONS.map((season, index) => ({
  id: `season-${season.replace('/', '-')}`,
  season,
  status: index === 0 ? 'Current' : index === 1 ? 'Draft' : 'Archived',
  competitions: COMPETITION_PROFILES.length,
  fixtures: SCHEDULE.filter((fixture) => fixture.season === season).length || 132 - index * 8,
  registeredPlayers: PLAYER_LIST.length - index * 18,
  opened: index === 0 ? '2026-08-01' : index === 1 ? '2025-08-02' : '2024-08-03',
}))

export interface AdminAuditLog {
  id: string
  user: string
  action: string
  affectedRecord: string
  dateTime: string
  previousValue: string
  newValue: string
  category: string
}

export const ADMIN_AUDIT_LOGS: AdminAuditLog[] = [
  { id: 'log-001', user: 'Nthabiseng Mota', action: 'Role assigned', affectedRecord: 'Rethabile Molemohi', dateTime: '2026-11-21 08:42', previousValue: 'No access', newValue: 'League administrator', category: 'Users' },
  { id: 'log-002', user: 'Thabiso Khene', action: 'Fixture published', affectedRecord: 'Matchweek 7 — Matlama vs Bantu', dateTime: '2026-11-21 08:16', previousValue: 'Draft', newValue: 'Published', category: 'Fixtures' },
  { id: 'log-003', user: 'Naledi Thabane', action: 'Result confirmed', affectedRecord: 'LDF 2–1 LCS', dateTime: '2026-11-21 07:58', previousValue: 'Pending', newValue: 'Confirmed', category: 'Results' },
  { id: 'log-004', user: 'Mpho Lerotholi', action: 'Player registration updated', affectedRecord: 'Player #1042', dateTime: '2026-11-20 19:24', previousValue: 'Squad number 17', newValue: 'Squad number 9', category: 'Players' },
  { id: 'log-005', user: 'Nthabiseng Mota', action: 'Account suspended', affectedRecord: 'Sello Mabaso', dateTime: '2026-11-20 16:50', previousValue: 'Active', newValue: 'Suspended', category: 'Users' },
  { id: 'log-006', user: 'System', action: 'Backup completed', affectedRecord: 'LFH production snapshot', dateTime: '2026-11-20 02:00', previousValue: '—', newValue: 'Snapshot 2026-11-20', category: 'System' },
  { id: 'log-007', user: 'Thabiso Khene', action: 'Competition updated', affectedRecord: 'LNFA Knockout Cup', dateTime: '2026-11-19 15:12', previousValue: 'Round of 16', newValue: 'Quarter-finals', category: 'Competitions' },
  { id: 'log-008', user: 'Naledi Thabane', action: 'Transfer approved', affectedRecord: 'Thabo Seshweni → Lioli', dateTime: '2026-11-19 11:34', previousValue: 'Pending', newValue: 'Approved', category: 'Transfers' },
  { id: 'log-009', user: 'Nthabiseng Mota', action: 'Setting changed', affectedRecord: 'Registration open', dateTime: '2026-11-18 09:05', previousValue: 'Closed', newValue: 'Open', category: 'Settings' },
  { id: 'log-010', user: 'Mpho Lerotholi', action: 'Club profile submitted', affectedRecord: 'Matlama FC', dateTime: '2026-11-17 13:21', previousValue: 'Not submitted', newValue: 'Pending review', category: 'Clubs' },
]

export interface AdminReport {
  id: string
  name: string
  description: string
  schedule: string
  lastRun: string
  format: 'PDF' | 'CSV' | 'XLSX'
}

export const ADMIN_REPORTS: AdminReport[] = [
  { id: 'rep-01', name: 'Registration audit', description: 'Club and player registrations by competition and district.', schedule: 'Weekly', lastRun: '2026-11-17', format: 'PDF' },
  { id: 'rep-02', name: 'Fixture compliance', description: 'Published, postponed and unconfirmed fixtures by matchweek.', schedule: 'Daily', lastRun: '2026-11-21', format: 'CSV' },
  { id: 'rep-03', name: 'User access review', description: 'Active, suspended and pending accounts by role.', schedule: 'Monthly', lastRun: '2026-11-01', format: 'XLSX' },
  { id: 'rep-04', name: 'Transfer activity', description: 'Approved and pending transfers by season and club.', schedule: 'Weekly', lastRun: '2026-11-18', format: 'PDF' },
  { id: 'rep-05', name: 'Statistics completeness', description: 'Missing or incomplete season statistics across competitions.', schedule: 'On demand', lastRun: '2026-11-14', format: 'CSV' },
  { id: 'rep-06', name: 'Audit trail export', description: 'Administrative actions with previous and new values.', schedule: 'Monthly', lastRun: '2026-11-01', format: 'XLSX' },
]

export interface AdminSetting {
  id: string
  label: string
  description: string
  type: 'toggle' | 'text' | 'select'
  value: string | boolean
  options?: string[]
}

export interface AdminSettingGroup {
  id: string
  title: string
  description: string
  settings: AdminSetting[]
}

export const ADMIN_SETTING_GROUPS: AdminSettingGroup[] = [
  {
    id: 'platform',
    title: 'Platform configuration',
    description: 'Global availability and public-facing platform details.',
    settings: [
      { id: 'site-name', label: 'Site name', description: 'Displayed across public pages and notifications.', type: 'text', value: 'Lesotho Football Hub' },
      { id: 'registration', label: 'Open registration', description: 'Allow supporters to create public supporter accounts.', type: 'toggle', value: true },
      { id: 'maintenance', label: 'Maintenance mode', description: 'Temporarily hide public pages behind a maintenance notice.', type: 'toggle', value: false },
      { id: 'timezone', label: 'Default timezone', description: 'Used for fixture kick-off times and audit timestamps.', type: 'select', value: 'Africa/Maseru', options: ['Africa/Maseru', 'UTC'] },
    ],
  },
  {
    id: 'workflow',
    title: 'Administration workflow',
    description: 'Defaults for approvals and record management.',
    settings: [
      { id: 'auto-approve-supporters', label: 'Auto-approve supporters', description: 'Approve public supporter accounts without review.', type: 'toggle', value: true },
      { id: 'club-verification', label: 'Club verification requirement', description: 'Require documents before a club profile is published.', type: 'toggle', value: true },
      { id: 'session-timeout', label: 'Session timeout', description: 'Administrative session expiry window.', type: 'select', value: '30 minutes', options: ['15 minutes', '30 minutes', '60 minutes'] },
    ],
  },
]

export const ADMIN_SECTION_IDS: AdminSectionId[] = [
  'overview',
  'users',
  'clubs',
  'players',
  'competitions',
  'seasons',
  'fixtures',
  'matches',
  'transfers',
  'statistics',
  'reports',
  'audit',
  'settings',
]

export function isAdminSection(value: string | null | undefined): value is AdminSectionId {
  return ADMIN_SECTION_IDS.includes(value as AdminSectionId)
}

export const ADMIN_SECTION_META: Record<AdminSectionId, { title: string; description: string }> = {
  overview: {
    title: 'Super administrator dashboard',
    description: 'Platform-wide health, registrations and the latest administrative activity.',
  },
  users: {
    title: 'User management',
    description: 'Review accounts, assign roles, manage permissions and process access requests.',
  },
  clubs: {
    title: 'Club management',
    description: 'Verify club records and manage submission status across all clubs.',
  },
  players: {
    title: 'Player management',
    description: 'Monitor player registrations and profile completeness across the platform.',
  },
  competitions: {
    title: 'Competitions',
    description: 'Create competitions and maintain the competition portfolio.',
  },
  seasons: {
    title: 'Seasons',
    description: 'Manage season lifecycles from draft through current to archived.',
  },
  fixtures: {
    title: 'Fixtures',
    description: 'Review scheduled matches and publication status by competition.',
  },
  matches: {
    title: 'Match management',
    description: 'Monitor live matches and match-day controls.',
  },
  transfers: {
    title: 'Transfers',
    description: 'Review player movement and approval status across clubs.',
  },
  statistics: {
    title: 'Statistics',
    description: 'Platform data quality and completeness across core football records.',
  },
  reports: {
    title: 'Reports',
    description: 'Generate operational and governance reports for LFH administrators.',
  },
  audit: {
    title: 'Audit logs',
    description: 'Track administrative actions with before-and-after values.',
  },
  settings: {
    title: 'Website settings',
    description: 'Configure platform-wide options and administration workflow defaults.',
  },
}

export const ADMIN_STATS = {
  clubs: CLUB_LIST.length,
  players: PLAYER_LIST.length,
  competitions: COMPETITION_PROFILES.length,
  users: ADMIN_USERS.length + ADMIN_REQUESTS.filter((request) => request.status === 'Pending').length,
  activeMatches: LIVE_MATCHES.length,
  pendingApprovals: ADMIN_REQUESTS.filter((request) => request.status === 'Pending').length,
  pendingTransfers: TRANSFERS.filter((transfer) => transfer.status === 'pending').length,
  suspendedAccounts: ADMIN_USERS.filter((user) => user.status === 'Suspended').length,
}
