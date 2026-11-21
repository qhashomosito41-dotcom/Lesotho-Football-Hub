export type UserRoleId =
  | 'public-supporter'
  | 'coach'
  | 'assistant-coach'
  | 'team-manager'
  | 'club-administrator'
  | 'match-official'
  | 'league-administrator'
  | 'super-administrator'

export type AccessLevel = 'Public' | 'Team' | 'Club' | 'Match' | 'League' | 'Platform'

export interface UserRole {
  id: UserRoleId
  label: string
  shortLabel: string
  description: string
  dashboardLabel: string
  accessLevel: AccessLevel
  capabilities: string[]
}

export const USER_ROLES: UserRole[] = [
  {
    id: 'public-supporter',
    label: 'Public supporter',
    shortLabel: 'Supporter',
    description: 'Follow scores, fixtures, tables and player profiles across Lesotho football.',
    dashboardLabel: 'Supporter home',
    accessLevel: 'Public',
    capabilities: ['Live scores', 'Club profiles', 'Player profiles', 'Competition tables'],
  },
  {
    id: 'coach',
    label: 'Coach',
    shortLabel: 'Coach',
    description: 'Manage team selections, match preparations and squad availability.',
    dashboardLabel: 'Coach dashboard',
    accessLevel: 'Team',
    capabilities: ['Squad selection', 'Match preparation', 'Training plans', 'Team notes'],
  },
  {
    id: 'assistant-coach',
    label: 'Assistant coach',
    shortLabel: 'Assistant',
    description: 'Support session planning, player availability and match analysis.',
    dashboardLabel: 'Assistant coach dashboard',
    accessLevel: 'Team',
    capabilities: ['Session plans', 'Availability tracking', 'Match analysis', 'Shared squad notes'],
  },
  {
    id: 'team-manager',
    label: 'Team manager',
    shortLabel: 'Manager',
    description: 'Coordinate logistics, registrations and day-to-day team operations.',
    dashboardLabel: 'Team manager dashboard',
    accessLevel: 'Team',
    capabilities: ['Travel plans', 'Registration checks', 'Equipment lists', 'Team calendar'],
  },
  {
    id: 'club-administrator',
    label: 'Club administrator',
    shortLabel: 'Club admin',
    description: 'Oversee club records, staff access, fixtures and player registrations.',
    dashboardLabel: 'Club administration',
    accessLevel: 'Club',
    capabilities: ['Club profile', 'Staff invitations', 'Squad records', 'Fixture requests'],
  },
  {
    id: 'match-official',
    label: 'Match official',
    shortLabel: 'Official',
    description: 'Record live match events, phases and results for an assigned fixture.',
    dashboardLabel: 'Live match management',
    accessLevel: 'Match',
    capabilities: ['Live event recording', 'Match clock', 'Half-time and full-time', 'Correction requests'],
  },
  {
    id: 'league-administrator',
    label: 'League administrator',
    shortLabel: 'League admin',
    description: 'Manage competitions, fixtures, results and club participation league-wide.',
    dashboardLabel: 'League operations',
    accessLevel: 'League',
    capabilities: ['Fixtures & results', 'Standings control', 'Competition setup', 'Club oversight'],
  },
  {
    id: 'super-administrator',
    label: 'Super administrator',
    shortLabel: 'Super admin',
    description: 'Full platform configuration, user management and role governance.',
    dashboardLabel: 'Platform control centre',
    accessLevel: 'Platform',
    capabilities: ['User management', 'Role governance', 'System settings', 'Audit overview'],
  },
]

export const ROLE_OPTIONS = USER_ROLES.map((role) => ({ value: role.id, label: role.label }))

export function getRole(roleId: string | null | undefined): UserRole | undefined {
  return USER_ROLES.find((role) => role.id === roleId)
}
