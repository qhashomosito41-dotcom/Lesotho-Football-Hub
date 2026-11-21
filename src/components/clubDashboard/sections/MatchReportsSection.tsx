import { useState, type FormEvent } from 'react'
import { ClipboardCheck, FileText, Upload } from 'lucide-react'
import { AdminPanel, AdminStatusPill } from '@/components/admin'
import { FormField } from '@/components/auth'
import { Button, Select, Table, type TableColumn } from '@/components/ui'
import { CLUB_MATCH_REPORTS, CLUB_RESULTS, type ClubMatchReport } from '@/config/clubDashboard'
import type { ClubSectionProps } from './types'

const categories = [
  { value: 'incident', label: 'Incident report' },
  { value: 'lineup', label: 'Line-up confirmation' },
  { value: 'result', label: 'Result confirmation' },
]

export function MatchReportsSection({ search, onAction }: ClubSectionProps) {
  const [matchId, setMatchId] = useState(CLUB_RESULTS[0]?.id ?? '')
  const [category, setCategory] = useState('incident')
  const [notes, setNotes] = useState('')

  const rows = CLUB_MATCH_REPORTS.filter(
    (report) => !search || report.fixture.toLowerCase().includes(search.toLowerCase()) || report.competition.toLowerCase().includes(search.toLowerCase()) || report.status.toLowerCase().includes(search.toLowerCase()),
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onAction('Match report submission is a frontend preview; nothing was sent.')
    setNotes('')
  }

  const columns: TableColumn<ClubMatchReport>[] = [
    { key: 'fixture', header: 'Match', cell: (row) => <p className="font-semibold text-ink">{row.fixture}</p> },
    { key: 'competition', header: 'Competition', cell: (row) => <span className="text-xs text-ink-muted">{row.competition}</span> },
    { key: 'date', header: 'Date', cell: (row) => <span className="text-xs text-ink-muted">{row.date}</span> },
    { key: 'referee', header: 'Referee', cell: (row) => <span className="text-xs text-ink-muted">{row.referee}</span> },
    { key: 'notes', header: 'Notes', cell: (row) => <span className="text-xs text-ink-muted">{row.notes} entries</span> },
    { key: 'status', header: 'Status', cell: (row) => <AdminStatusPill status={row.status === 'Submitted' ? 'Verified' : row.status} label={row.status} /> },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      cell: () => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => onAction('Match report view is a frontend preview.')}>View</Button>
          <Button variant="outline" size="sm" onClick={() => onAction('Draft editing is a frontend preview.')}>Edit</Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <AdminPanel title="Submit match report" description="Record incidents and confirm match information.">
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-1.5 text-xs font-semibold text-ink">Match</p>
            <Select
              options={CLUB_RESULTS.map((result) => ({ value: result.id, label: `${result.dateISO} · ${result.home.name} vs ${result.away.name}` }))}
              value={matchId}
              onChange={setMatchId}
              ariaLabel="Report match"
            />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold text-ink">Report category</p>
            <Select options={categories} value={category} onChange={setCategory} ariaLabel="Report category" />
          </div>
          <FormField label="Notes" name="match-report-notes" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Describe the incident or confirmation" required />
          <FormField label="Supporting image" name="match-report-image" type="file" accept="image/*" />
          <div className="md:col-span-2">
            <Button type="submit" iconLeft={<Upload className="size-4" aria-hidden />}>Preview report</Button>
          </div>
        </form>
      </AdminPanel>

      <AdminPanel title="Report register" description="Reports submitted for your club matches." bodyClassName="p-0">
        <Table columns={columns} rows={rows} rowKey={(row) => row.id} caption="Club match reports" />
      </AdminPanel>

      <div className="grid gap-5 xl:grid-cols-3">
        {[
          { icon: FileText, title: 'Line-up confirmation', detail: ' starters, substitutes and officials.' },
          { icon: ClipboardCheck, title: 'Incident record', detail: 'Goals, cards, substitutions and injuries.' },
          { icon: Upload, title: 'Supporting evidence', detail: 'Photo or document attachments when needed.' },
        ].map((item) => {
          const Icon = item.icon

          return (
            <AdminPanel key={item.title} title={item.title} description={item.detail}>
              <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                <Icon className="size-4" aria-hidden />
                Available in report builder
              </div>
            </AdminPanel>
          )
        })}
      </div>
    </>
  )
}
