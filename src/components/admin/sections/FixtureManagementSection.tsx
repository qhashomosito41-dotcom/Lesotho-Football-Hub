import { CalendarDays, CheckCircle2, ClipboardList, MapPin } from 'lucide-react'
import { AdminPanel, AdminStatusPill } from '@/components/admin'
import { Button, StatisticCard, Table, type TableColumn } from '@/components/ui'
import { competitionName, SCHEDULE, type ScheduleFixture } from '@/config/league'
import type { AdminSectionProps } from './types'

export function FixtureManagementSection({ search, onAction }: AdminSectionProps) {
  const rows = SCHEDULE.filter(
    (fixture) =>
      !search ||
      fixture.home.name.toLowerCase().includes(search.toLowerCase()) ||
      fixture.away.name.toLowerCase().includes(search.toLowerCase()) ||
      fixture.venue.toLowerCase().includes(search.toLowerCase()) ||
      fixture.round.toLowerCase().includes(search.toLowerCase()),
  ).slice(0, 30)

  const columns: TableColumn<ScheduleFixture>[] = [
    {
      key: 'date',
      header: 'Date',
      cell: (row) => (
        <div>
          <p className="text-xs font-semibold text-ink">{new Date(row.dateISO).toLocaleDateString('en-GB')}</p>
          <p className="caption">{row.kickoff}</p>
        </div>
      ),
    },
    { key: 'competition', header: 'Competition', cell: (row) => <span className="text-xs text-ink-muted">{competitionName(row.competitionId)}</span> },
    { key: 'round', header: 'Round', cell: (row) => <span className="text-xs text-ink-muted">{row.round}</span> },
    {
      key: 'fixture',
      header: 'Fixture',
      cell: (row) => <p className="text-xs font-semibold text-ink">{row.home.name} <span className="text-ink-muted">vs</span> {row.away.name}</p>,
    },
    { key: 'venue', header: 'Venue', cell: (row) => <span className="text-xs text-ink-muted">{row.venue}</span> },
    { key: 'status', header: 'Status', cell: (row) => <AdminStatusPill status={row.id.length % 5 === 0 ? 'Draft' : 'Published'} /> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (row) => (
        <div className="flex justify-end gap-1.5">
          <Button variant="outline" size="sm" iconLeft={<CheckCircle2 className="size-3.5" aria-hidden />} onClick={() => onAction(`Publishing ${row.home.shortName} vs ${row.away.shortName} is a frontend preview.`)}>
            Publish
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onAction(`Editing fixture ${row.id} is a frontend preview.`)}>Edit</Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatisticCard label="Scheduled fixtures" value={SCHEDULE.length} icon={<CalendarDays className="size-5" aria-hidden />} />
        <StatisticCard label="Shown" value={rows.length} icon={<ClipboardList className="size-5" aria-hidden />} />
        <StatisticCard label="Published sample" value={rows.filter((row) => row.id.length % 5 !== 0).length} icon={<CheckCircle2 className="size-5" aria-hidden />} />
        <StatisticCard label="Venues represented" value={new Set(SCHEDULE.map((row) => row.venue)).size} icon={<MapPin className="size-5" aria-hidden />} />
      </div>

      <AdminPanel title="Fixture publication" description="Review scheduled fixtures and control publication status." bodyClassName="p-0">
        <Table columns={columns} rows={rows} rowKey={(row) => row.id} caption="Fixture records" compact />
      </AdminPanel>
    </>
  )
}
