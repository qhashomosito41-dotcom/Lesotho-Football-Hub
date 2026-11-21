import { Link } from 'react-router-dom'
import { Table, type TableColumn } from '@/components/ui'
import type { ScorerEntry } from '@/config/scorers'

interface ScorerLeaderboardProps {
  scorers: ScorerEntry[]
}

const columns: TableColumn<ScorerEntry>[] = [
  {
    key: 'position',
    header: 'Position',
    width: '90px',
    cell: (row) => (
      <span className="inline-grid size-7 place-items-center rounded-full bg-surface-muted text-xs font-bold text-ink">
        {row.rank}
      </span>
    ),
  },
  {
    key: 'player',
    header: 'Player',
    cell: (row) => (
      <Link to={row.to} className="flex min-w-0 items-center gap-3 transition-colors hover:text-primary">
        <img src={row.photoUrl} alt="" className="size-9 shrink-0 rounded-full object-cover" loading="lazy" />
        <span className="min-w-0">
          <span className="block truncate font-semibold text-ink">{row.name}</span>
          <span className="block truncate text-xs text-ink-muted">{row.position}</span>
        </span>
      </Link>
    ),
  },
  {
    key: 'club',
    header: 'Club',
    cell: (row) => (
      <span className="inline-flex items-center gap-2">
        <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: row.clubColor }} aria-hidden />
        <span className="truncate">{row.clubName}</span>
      </span>
    ),
  },
  { key: 'competition', header: 'Competition', cell: (row) => <span className="text-xs text-ink-muted">{row.competitionName}</span> },
  { key: 'goals', header: 'Goals', align: 'center', cell: (row) => <span className="text-base font-bold text-ink">{row.goals}</span> },
  { key: 'assists', header: 'Assists', align: 'center', cell: (row) => row.assists ?? '—' },
]

export function ScorerLeaderboard({ scorers }: ScorerLeaderboardProps) {
  return (
    <Table
      columns={columns}
      rows={scorers}
      rowKey={(row) => row.id}
      compact
      caption="Golden Boot leaderboard"
    />
  )
}
