import { Link } from 'react-router-dom'
import type { MatchOutcome } from '@/types'
import { cn } from '@/utils/cn'
import { ClubBadge } from './ClubBadge'
import { StatusBadge } from './StatusBadge'

export interface LeagueTableRow {
  position: number
  team: {
    id: string
    name: string
    shortName?: string
    logoUrl?: string | null
    color?: string
  }
  played: number
  won: number
  drawn: number
  lost: number
  goalFor?: number
  goalAgainst?: number
  goalDifference: number
  points: number
  form?: MatchOutcome[]
  to?: string
}

export type LeagueZoneTone = 'success' | 'primary' | 'danger'

interface LeagueTableProps {
  rows: LeagueTableRow[]
  zoneMap?: Record<number, LeagueZoneTone>
  showForm?: boolean
  showGoals?: boolean
  caption?: string
  className?: string
}

const zoneClasses: Record<LeagueZoneTone, string> = {
  success: 'border-l-live',
  primary: 'border-l-primary',
  danger: 'border-l-danger',
}

export function LeagueTable({
  rows,
  zoneMap,
  showForm = false,
  showGoals = false,
  caption,
  className,
}: LeagueTableProps) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-xl border border-line bg-surface', className)}>
      <table className="data-table">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr>
            <th scope="col" className="w-12 text-center">
              #
            </th>
            <th scope="col">Club</th>
            <th scope="col" className="text-center">
              P
            </th>
            <th scope="col" className="hidden text-center sm:table-cell">
              W
            </th>
            <th scope="col" className="hidden text-center sm:table-cell">
              D
            </th>
            <th scope="col" className="hidden text-center sm:table-cell">
              L
            </th>
            {showGoals && (
              <>
                <th scope="col" className="hidden text-center sm:table-cell">
                  GF
                </th>
                <th scope="col" className="hidden text-center sm:table-cell">
                  GA
                </th>
              </>
            )}
            <th scope="col" className="text-center">
              GD
            </th>
            <th scope="col" className="text-center">
              Pts
            </th>
            {showForm && (
              <th scope="col" className="hidden text-center lg:table-cell">
                Form
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const zone = zoneMap?.[row.position]

            return (
              <tr key={row.team.id} className="transition-colors">
                <td
                  className={cn(
                    'text-center font-semibold',
                    zone && 'border-l-[3px]',
                    zone && zoneClasses[zone],
                  )}
                >
                  {row.position}
                </td>
                <td>
                  <div className="flex min-w-0 items-center gap-2.5">
                    <ClubBadge
                      name={row.team.name}
                      shortName={row.team.shortName}
                      logoUrl={row.team.logoUrl}
                      color={row.team.color}
                      size="sm"
                    />
                    {row.to ? (
                      <Link
                        to={row.to}
                        className="truncate text-[13px] font-semibold text-ink transition-colors hover:text-primary"
                      >
                        {row.team.name}
                      </Link>
                    ) : (
                      <span className="truncate text-[13px] font-semibold text-ink">{row.team.name}</span>
                    )}
                  </div>
                </td>
                <td className="text-center text-ink-muted">{row.played}</td>
                <td className="hidden text-center sm:table-cell">{row.won}</td>
                <td className="hidden text-center sm:table-cell">{row.drawn}</td>
                <td className="hidden text-center sm:table-cell">{row.lost}</td>
                {showGoals && (
                  <>
                    <td className="hidden text-center text-ink-muted sm:table-cell">{row.goalFor ?? '—'}</td>
                    <td className="hidden text-center text-ink-muted sm:table-cell">{row.goalAgainst ?? '—'}</td>
                  </>
                )}
                <td className={cn('text-center', row.goalDifference > 0 ? 'text-live' : row.goalDifference < 0 ? 'text-danger' : 'text-ink-muted')}>
                  {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                </td>
                <td className="text-center font-bold">{row.points}</td>
                {showForm && (
                  <td className="hidden lg:table-cell">
                    <div className="flex items-center justify-center gap-1">
                      {(row.form ?? []).map((outcome, index) => (
                        <StatusBadge key={index} kind={outcome} size="sm" />
                      ))}
                      {(!row.form || row.form.length === 0) && <span className="caption">—</span>}
                    </div>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
