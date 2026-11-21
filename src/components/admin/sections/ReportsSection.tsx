import { Download, FileBarChart, FileText, PlayCircle } from 'lucide-react'
import { AdminPanel } from '@/components/admin'
import { Button, StatisticCard, Table, type TableColumn } from '@/components/ui'
import { ADMIN_REPORTS, type AdminReport } from '@/config/admin'
import type { AdminSectionProps } from './types'

export function ReportsSection({ search, onAction }: AdminSectionProps) {
  const rows = ADMIN_REPORTS.filter(
    (report) => !search || report.name.toLowerCase().includes(search.toLowerCase()) || report.description.toLowerCase().includes(search.toLowerCase()),
  )

  const columns: TableColumn<AdminReport>[] = [
    { key: 'name', header: 'Report', cell: (row) => <p className="font-semibold text-ink">{row.name}<span className="caption block">{row.description}</span></p> },
    { key: 'schedule', header: 'Schedule', cell: (row) => <span className="text-xs text-ink-muted">{row.schedule}</span> },
    { key: 'last', header: 'Last run', cell: (row) => <span className="text-xs text-ink-muted">{row.lastRun}</span> },
    { key: 'format', header: 'Format', cell: (row) => <span className="text-xs font-semibold text-ink">{row.format}</span> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (row) => (
        <div className="flex justify-end gap-1.5">
          <Button variant="outline" size="sm" iconLeft={<PlayCircle className="size-3.5" aria-hidden />} onClick={() => onAction(`Generating ${row.name} is a frontend preview.`)}>
            Generate
          </Button>
          <Button variant="ghost" size="sm" iconLeft={<Download className="size-3.5" aria-hidden />} onClick={() => onAction(`Downloading ${row.name} is a frontend preview.`)}>
            Download
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatisticCard label="Report templates" value={ADMIN_REPORTS.length} icon={<FileText className="size-5" aria-hidden />} />
        <StatisticCard label="Scheduled" value={ADMIN_REPORTS.filter((report) => report.schedule !== 'On demand').length} icon={<FileBarChart className="size-5" aria-hidden />} />
        <StatisticCard label="On demand" value={ADMIN_REPORTS.filter((report) => report.schedule === 'On demand').length} icon={<FileBarChart className="size-5" aria-hidden />} />
        <StatisticCard label="Formats" value={new Set(ADMIN_REPORTS.map((report) => report.format)).size} icon={<FileBarChart className="size-5" aria-hidden />} />
      </div>

      <AdminPanel title="Report library" description="Generate operational and governance reports." bodyClassName="p-0">
        <Table columns={columns} rows={rows} rowKey={(row) => row.id} caption="Administrative reports" compact />
      </AdminPanel>
    </>
  )
}
