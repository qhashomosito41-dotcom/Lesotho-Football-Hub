import { ROUTES } from '@/config/app'
import type { UserRoleId } from '@/config/auth'
import type { Database } from '@/lib/database.types'

export type DatabaseRole = Database['public']['Enums']['app_role']

export const DB_ROLE_TO_UI_ROLE: Record<DatabaseRole, UserRoleId> = {
  supporter: 'public-supporter',
  coach: 'coach',
  assistant_coach: 'assistant-coach',
  team_manager: 'team-manager',
  club_administrator: 'club-administrator',
  match_official: 'match-official',
  league_administrator: 'league-administrator',
  super_administrator: 'super-administrator',
}

export const UI_ROLE_TO_DB_ROLE: Record<UserRoleId, DatabaseRole> = {
  'public-supporter': 'supporter',
  coach: 'coach',
  'assistant-coach': 'assistant_coach',
  'team-manager': 'team_manager',
  'club-administrator': 'club_administrator',
  'match-official': 'match_official',
  'league-administrator': 'league_administrator',
  'super-administrator': 'super_administrator',
}

export function toDatabaseRole(role: UserRoleId): DatabaseRole {
  return UI_ROLE_TO_DB_ROLE[role]
}

export function toUiRole(role: DatabaseRole | null | undefined): UserRoleId | null {
  return role ? DB_ROLE_TO_UI_ROLE[role] : null
}

export function dashboardPathForRole(role: UserRoleId): string | null {
  if (role === 'super-administrator') return ROUTES.admin
  if (role === 'league-administrator') return ROUTES.leagueAdmin
  if (role === 'match-official') return `${ROUTES.liveMatch}?view=official`
  if (role === 'club-administrator' || role === 'coach' || role === 'assistant-coach' || role === 'team-manager') {
    return ROUTES.clubDashboard
  }
  return null
}
