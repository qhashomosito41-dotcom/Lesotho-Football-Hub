import { CalendarDays, CheckCircle2, Database, FileClock } from 'lucide-react'
import { AdminPanel, AdminStatusPill } from '@/components/admin'
import { Button, StatisticCard, Table, type TableColumn } from '@/components/ui'
import { ADMIN_SEASONS, type AdminSeasonRecord } from '@/config/admin'
import type { AdminSectionProps } from './types'

export function SeasonManagementSection({ search, onAction }: AdminSectionProps) {
  const rows = ADMIN_SEASONS.filter(
    (season) => !search || season.season.includes(search) || season.status.toLowerCase().includes(search.toLowerCase()),
  )

  const columns: TableColumn<AdminSeasonRecord>[] = [
    { key: 'season', header: 'Season', cell: (row) => <p className="font-semibold text-ink">{row.season}<span className="caption block">{row.id}</span></p> },
    { key: 'status', header: 'Status', cell: (row) => <AdminStatusPill status={row.status} /> },
    { key: 'competitions', header: 'Competitions', cell: (row) => <span className="text-xs font-semibold text-ink">{row.competitions}</span> },
    { key: 'fixtures', header: 'Fixtures', cell: (row) => <span className="text-xs font-semibold text-ink">{row.fixtures}</span> },
    { key: 'players', header: 'Registered players', cell: (row) => <span className="text-xs font-semibold text-ink">{row.registeredPlayers}</span> },
    { key: 'opened', header: 'Opened', cell: (row) => <span className="text-xs text-ink-muted">{row.opened}</span> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (row) => (
        <div className="flex justify-end gap-1.5">
          <Button variant="outline" size="sm" iconLeft={<CheckCircle2 className="size-3.5" aria-hidden />} onClick={() => onAction(`Setting ${row.season} as current is a frontend preview.`)}>
            Set current
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onAction(`Archiving ${row.season} is a frontend preview.`)}>Archive</Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatisticCard label="Seasons" value={ADMIN_SEASONS.length} icon={<CalendarDays className="size-5" aria-hidden />} />
        <StatisticCard label="Current" value={ADMIN_SEASONS.filter((season) => season.status === 'Current').length} icon={<CheckCircle2 className="size-5" aria-hidden />} />
        <StatisticCard label="Draft" value={ADMIN_SEASONS.filter((season) => season.status === 'Draft').length} icon={<FileClock className="size-5" aria-hidden />} />
        <StatisticCard label="Archived" value={ADMIN_SEASONS.filter((season) => season.status === 'Archived').length} icon={<Database className="size-5" aria-hidden />} />
      </div>

      <AdminPanel title="Season lifecycle" description="Activate, publish and archive season records." bodyClassName="p-0">
        <Table columns={columns} rows={rows} rowKey={(row) => row.id} caption="Season records" compact />
      </AdminPanel>
    </>
  )
}
