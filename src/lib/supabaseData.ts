import type { LeagueTableRow } from '@/components/ui'
import { ROUTES } from '@/config/app'
import type { ScorerEntry } from '@/config/scorers'
import type { Database } from '@/lib/database.types'

export type StandingRow = Database['public']['Views']['standings']['Row']
export type PlayerStatisticRow = Database['public']['Views']['player_statistics']['Row']

export const DB_COMPETITION_SLUGS: Record<string, string> = {
  'premier-league': 'vodacom-premier-league',
  championship: 'lesotho-championship',
  'knockout-cup': 'federation-cup',
}

export function dbSeasonFromUi(season: string): string {
  return season.replace('/', '-')
}

export function standingRowsToLeagueTable(rows: StandingRow[]): LeagueTableRow[] {
  return rows.map((row) => ({
    position: row.position,
    team: {
      id: row.club_id,
      name: row.club_name,
      shortName: row.club_short_name,
      color: 'var(--color-primary)',
    },
    played: row.played,
    won: row.wins,
    drawn: row.draws,
    lost: row.losses,
    goalFor: row.goals_for,
    goalAgainst: row.goals_against,
    goalDifference: row.goal_difference,
    points: row.points,
    to: `${ROUTES.clubs}/${row.club_id}`,
  }))
}

export function playerStatRowsToScorers(
  rows: PlayerStatisticRow[],
  competitionId: string,
  competitionName: string,
  season: string,
): ScorerEntry[] {
  return [...rows]
    .sort((left, right) => right.goals - left.goals || right.assists - left.assists || left.player_name.localeCompare(right.player_name))
    .map((row, index) => ({
      id: row.id,
      rank: index + 1,
      playerId: row.player_id,
      name: row.player_name,
      photoUrl: '',
      position: 'Forward',
      clubName: row.club_name,
      clubShortName: row.club_name.slice(0, 3).toUpperCase(),
      clubColor: 'var(--color-primary)',
      clubId: row.club_id,
      competitionId,
      competitionName,
      season,
      goals: row.goals,
      assists: row.assists,
      to: ROUTES.player.replace(':playerId', row.player_id),
    }))
}
