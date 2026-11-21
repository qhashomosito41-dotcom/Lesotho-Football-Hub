import { useState, type FormEvent } from 'react'
import { Download, FileBarChart2, Send } from 'lucide-react'
import { AdminPanel, AdminStatusPill } from '@/components/admin'
import { FormField } from '@/components/auth'
import { Button, Select, Table, type TableColumn } from '@/components/ui'
import type { CompetitionId } from '@/config/league'
import { LEAGUE_ASSIGNED_COMPETITION_OPTIONS, LEAGUE_REPORTS, type LeagueReport } from '@/config/leagueAdmin'
import type { LeagueSectionProps } from './types'

const reportTypes = [
  { value: 'operations', label: 'Operations summary' },
  { value: 'registrations', label: 'Registration audit' },
  { value: 'results', label: 'Result verification' },
  { value: 'disputes', label: 'Dispute register' },
]

const formats = [
  { value: 'PDF', label: 'PDF' },
  { value: 'CSV', label: 'CSV' },
  { value: 'XLSX', label: 'XLSX' },
]

export function ReportsSection({ search, onAction }: LeagueSectionProps) {
  const [competition, setCompetition] = useState(LEAGUE_ASSIGNED_COMPETITION_OPTIONS[0]?.value ?? '')
  const [reportType, setReportType] = useState('operations')
  const [format, setFormat] = useState('PDF')
  const [from, setFrom] = useState('2026-08-01')
  const [to, setTo] = useState('2026-11-21')

  const handleBuild = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onAction('Report generation is a frontend preview; no file was created.')
  }

  const rows = LEAGUE_REPORTS.filter(
    (report) => !search || report.title.toLowerCase().includes(search.toLowerCase()) || report.competition.toLowerCase().includes(search.toLowerCase()) || report.description.toLowerCase().includes(search.toLowerCase()),
  )

  const columns: TableColumn<LeagueReport>[] = [
    { key: 'title', header: 'Report', cell: (row) => <p className="font-semibold text-ink">{row.title}</p> },
    { key: 'description', header: 'Description', cell: (row) => <span className="text-xs text-ink-muted">{row.description}</span> },
    { key: 'competition', header: 'Competition', cell: (row) => <span className="text-xs text-ink-muted">{row.competition}</span> },
    { key: 'format', header: 'Format', cell: (row) => <AdminStatusPill status="Confirmed" label={row.format} /> },
    { key: 'schedule', header: 'Schedule', cell: (row) => <span className="text-xs text-ink-muted">{row.schedule}</span> },
    { key: 'status', header: 'Status', cell: (row) => <AdminStatusPill status={row.status === 'Ready' ? 'Active' : 'Pending'} label={row.status} /> },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      cell: () => (
        <Button variant="outline" size="sm" iconLeft={<Download className="size-3.5" aria-hidden />} onClick={() => onAction('Report download is a frontend preview.')}>
          Generate
        </Button>
      ),
    },
  ]

  return (
    <>
      <AdminPanel title="Report builder" description="Create a scoped report for one assigned competition.">
        <form onSubmit={handleBuild} className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div>
            <p className="mb-1.5 text-xs font-semibold text-ink">Competition</p>
            <Select options={LEAGUE_ASSIGNED_COMPETITION_OPTIONS} value={competition} onChange={(value) => setCompetition(value as CompetitionId)} ariaLabel="Report competition" />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold text-ink">Report type</p>
            <Select options={reportTypes} value={reportType} onChange={setReportType} ariaLabel="Report type" />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold text-ink">Format</p>
            <Select options={formats} value={format} onChange={setFormat} ariaLabel="Report format" />
          </div>
          <FormField label="From" name="report-from" type="date" value={from} onChange={(event) => setFrom(event.target.value)} required />
          <FormField label="To" name="report-to" type="date" value={to} onChange={(event) => setTo(event.target.value)} required />
          <div className="md:col-span-2 xl:col-span-5">
            <Button type="submit" iconLeft={<FileBarChart2 className="size-4" aria-hidden />}>Preview report</Button>
          </div>
        </form>
      </AdminPanel>

      <AdminPanel title="Report library" description="Reports available for assigned competitions." bodyClassName="p-0">
        <Table columns={columns} rows={rows} rowKey={(row) => row.id} caption="League reports" />
      </AdminPanel>

      <AdminPanel title="Delivery options" description="How reports are shared with the competition office.">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { icon: Download, title: 'Download now', detail: 'Generate a file in the selected format.' },
            { icon: Send, title: 'Email report', detail: 'Send to the competition office distribution list.' },
            { icon: FileBarChart2, title: 'Schedule', detail: 'Add a recurring weekly or monthly report.' },
          ].map((item) => {
            const Icon = item.icon

            return (
              <div key={item.title} className="rounded-lg border border-line bg-surface-muted px-4 py-3">
                <Icon className="size-4 text-primary" aria-hidden />
                <p className="mt-2 text-xs font-semibold text-ink">{item.title}</p>
                <p className="caption mt-1">{item.detail}</p>
              </div>
            )
          })}
        </div>
      </AdminPanel>
    </>
  )
}
