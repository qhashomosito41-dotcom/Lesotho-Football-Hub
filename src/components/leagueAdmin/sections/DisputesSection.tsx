import { useState } from 'react'
import { Gavel, MessageSquareWarning, ShieldAlert } from 'lucide-react'
import { AdminPanel, AdminStatusPill } from '@/components/admin'
import { Button, Table, Tabs, type TabItem, type TableColumn } from '@/components/ui'
import { LEAGUE_DISPUTES, type LeagueDispute } from '@/config/leagueAdmin'
import type { LeagueSectionProps } from './types'

type DisputeTab = 'all' | 'Open' | 'Under review' | 'Resolved'

const tabItems: TabItem<DisputeTab>[] = [
  { id: 'all', label: 'All disputes' },
  { id: 'Open', label: 'Open' },
  { id: 'Under review', label: 'Under review' },
  { id: 'Resolved', label: 'Resolved' },
]

export function DisputesSection({ search, onAction }: LeagueSectionProps) {
  const [tab, setTab] = useState<DisputeTab>('all')
  const rows = LEAGUE_DISPUTES.filter(
    (dispute) =>
      (tab === 'all' || dispute.status === tab) &&
      (!search || dispute.reference.toLowerCase().includes(search.toLowerCase()) || dispute.fixture.toLowerCase().includes(search.toLowerCase()) || dispute.raisedBy.toLowerCase().includes(search.toLowerCase()) || dispute.summary.toLowerCase().includes(search.toLowerCase())),
  )

  const columns: TableColumn<LeagueDispute>[] = [
    { key: 'reference', header: 'Reference', cell: (row) => <p className="font-semibold text-ink">{row.reference}</p> },
    { key: 'competition', header: 'Competition', cell: (row) => <span className="text-xs text-ink-muted">{row.competition}</span> },
    { key: 'fixture', header: 'Fixture', cell: (row) => <span className="text-xs text-ink-muted">{row.fixture}</span> },
    { key: 'raisedBy', header: 'Raised by', cell: (row) => <span className="text-xs text-ink-muted">{row.raisedBy}</span> },
    { key: 'category', header: 'Category', cell: (row) => <span className="text-xs text-ink-muted">{row.category}</span> },
    { key: 'submitted', header: 'Submitted', cell: (row) => <span className="text-xs text-ink-muted">{row.submitted}</span> },
    { key: 'status', header: 'Status', cell: (row) => <AdminStatusPill status={row.status === 'Under review' ? 'Review' : row.status} /> },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => onAction(`Review notes for ${row.reference} are a frontend preview.`)}>
            Review
          </Button>
          <Button variant="outline" size="sm" disabled={row.status === 'Resolved'} onClick={() => onAction(`Resolution for ${row.reference} is a frontend preview; no decision was recorded.`)}>
            Resolve
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <AdminPanel title="Dispute register" description="Disputed match reports in assigned competitions." bodyClassName="p-0">
        <div className="p-4 pb-0">
          <Tabs items={tabItems} value={tab} onChange={setTab} ariaLabel="Filter disputes by status" />
        </div>
        <Table columns={columns} rows={rows} rowKey={(row) => row.id} caption="Disputed match reports" />
      </AdminPanel>

      <div className="grid gap-5 xl:grid-cols-3">
        <AdminPanel title="Resolution workflow" description="Steps taken from submission to decision.">
          <div className="space-y-3">
            {['Log the dispute and assign a reference', 'Collect reports from both clubs', 'Review rule book and match evidence', 'Record the decision and notify clubs'].map((item, index) => (
              <div key={item} className="flex items-start gap-3 rounded-lg border border-line bg-surface-muted px-3 py-2.5">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary-soft text-[10px] font-bold text-primary">{index + 1}</span>
                <span className="text-xs leading-relaxed text-ink-muted">{item}</span>
              </div>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel title="Evidence checklist" description="Materials normally attached to a dispute.">
          <div className="space-y-3">
            {[
              { icon: MessageSquareWarning, label: 'Dispute form', detail: 'Submitted by the club or official.' },
              { icon: ShieldAlert, label: 'Referee report', detail: 'Match-day facts and incidents.' },
              { icon: Gavel, label: 'Rule extract', detail: 'Relevant competition regulation.' },
            ].map((item) => {
              const Icon = item.icon

              return (
                <div key={item.label} className="flex items-center gap-3 rounded-lg border border-line bg-surface-muted px-3 py-2.5">
                  <Icon className="size-4 shrink-0 text-primary" aria-hidden />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-ink">{item.label}</p>
                    <p className="caption">{item.detail}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </AdminPanel>

        <AdminPanel title="Summary" description="Current dispute workload.">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Open', value: LEAGUE_DISPUTES.filter((item) => item.status === 'Open').length },
              { label: 'Review', value: LEAGUE_DISPUTES.filter((item) => item.status === 'Under review').length },
              { label: 'Resolved', value: LEAGUE_DISPUTES.filter((item) => item.status === 'Resolved').length },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-line bg-surface-muted px-3 py-4 text-center">
                <p className="font-display text-2xl font-bold text-ink">{item.value}</p>
                <p className="caption mt-1 uppercase">{item.label}</p>
              </div>
            ))}
          </div>
        </AdminPanel>
      </div>
    </>
  )
}
