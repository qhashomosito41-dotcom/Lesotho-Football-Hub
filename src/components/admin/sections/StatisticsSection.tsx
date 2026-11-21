import { BarChart3, CheckCircle2, Database, RefreshCw } from 'lucide-react'
import { AdminPanel, AdminProgressBar, AdminStatusPill } from '@/components/admin'
import { Button, StatisticCard, Table, type TableColumn } from '@/components/ui'
import { COMPETITION_PROFILES, type CompetitionProfile } from '@/config/competitions'
import type { AdminSectionProps } from './types'

export function StatisticsSection({ search, onAction }: AdminSectionProps) {
  const rows = COMPETITION_PROFILES.filter(
    (competition) => !search || competition.name.toLowerCase().includes(search.toLowerCase()),
  )

  const columns: TableColumn<CompetitionProfile>[] = [
    { key: 'competition', header: 'Competition', cell: (row) => <p className="font-semibold text-ink">{row.name}<span className="caption block">{row.season}</span></p> },
    { key: 'format', header: 'Format', cell: (row) => <span className="text-xs text-ink-muted">{row.typeLabel}</span> },
    { key: 'participants', header: 'Teams', cell: (row) => <span className="text-xs font-semibold text-ink">{row.participants.length}</span> },
    { key: 'records', header: 'Result records', cell: () => <span className="text-xs font-semibold text-ink">112</span> },
    { key: 'complete', header: 'Complete', cell: () => <span className="text-xs font-semibold text-ink">96%</span> },
    { key: 'status', header: 'Status', cell: (row) => <AdminStatusPill status={row.status} /> },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      cell: (row) => (
        <Button variant="outline" size="sm" iconLeft={<RefreshCw className="size-3.5" aria-hidden />} onClick={() => onAction(`Recalculating statistics for ${row.name} is a frontend preview.`)}>
          Recalculate
        </Button>
      ),
    },
  ]

  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatisticCard label="Data sources" value={6} icon={<Database className="size-5" aria-hidden />} />
        <StatisticCard label="Competition feeds" value={COMPETITION_PROFILES.length} icon={<BarChart3 className="size-5" aria-hidden />} />
        <StatisticCard label="Verified records" value="96%" icon={<CheckCircle2 className="size-5" aria-hidden />} />
        <StatisticCard label="Last recalculation" value="08:10" unit="today" icon={<RefreshCw className="size-5" aria-hidden />} />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <AdminPanel title="Data completeness" description="Coverage of core football records across the platform.">
          <div className="space-y-5">
            <AdminProgressBar label="Club profiles" value={88} caption="District, stadium and coach fields" tone="live" />
            <AdminProgressBar label="Player profiles" value={94} caption="Photo, position and season statistics" tone="primary" />
            <AdminProgressBar label="Competition records" value={100} caption="Format, season and participants" tone="live" />
            <AdminProgressBar label="Match events" value={82} caption="Goals, cards and substitutions" tone="accent" />
          </div>
        </AdminPanel>

        <AdminPanel title="Data quality checks" description="Recent automated validation outcomes.">
          <div className="space-y-3">
            {[
              ['Duplicate player registrations', 'Passed', 'Verified'],
              ['Club competition mapping', 'Passed', 'Verified'],
              ['Fixture date conflicts', '3 warnings', 'Pending'],
              ['Transfer status consistency', 'Passed', 'Verified'],
            ].map(([label, result, status]) => (
              <div key={label} className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface-muted px-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-ink">{label}</p>
                  <p className="caption">{result}</p>
                </div>
                <AdminStatusPill status={status} />
              </div>
            ))}
          </div>
          <Button className="mt-5" variant="outline" size="sm" onClick={() => onAction('Running data quality checks is a frontend preview.')}>
            Run checks
          </Button>
        </AdminPanel>
      </div>

      <AdminPanel title="Competition statistics coverage" description="Record completeness by competition." bodyClassName="p-0">
        <Table columns={columns} rows={rows} rowKey={(row) => row.id} caption="Statistics coverage by competition" compact />
      </AdminPanel>
    </>
  )
}
