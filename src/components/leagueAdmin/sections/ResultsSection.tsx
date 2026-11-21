import { CheckCircle2, Flag, ListChecks } from 'lucide-react'
import { AdminPanel, AdminStatusPill } from '@/components/admin'
import { Button, Table, type TableColumn } from '@/components/ui'
import { LEAGUE_RESULT_REVIEWS, type LeagueResultReview } from '@/config/leagueAdmin'
import type { LeagueSectionProps } from './types'

export function ResultsSection({ search, onAction }: LeagueSectionProps) {
  const rows = LEAGUE_RESULT_REVIEWS.filter(
    (review) => !search || review.result.home.name.toLowerCase().includes(search.toLowerCase()) || review.result.away.name.toLowerCase().includes(search.toLowerCase()) || review.competition.toLowerCase().includes(search.toLowerCase()) || review.submittedBy.toLowerCase().includes(search.toLowerCase()),
  )

  const columns: TableColumn<LeagueResultReview>[] = [
    { key: 'fixture', header: 'Fixture', cell: (row) => <p className="font-semibold text-ink">{row.result.home.name} vs {row.result.away.name}</p> },
    { key: 'competition', header: 'Competition', cell: (row) => <span className="text-xs text-ink-muted">{row.competition}</span> },
    { key: 'score', header: 'Score', cell: (row) => <span className="font-bold text-ink">{row.result.homeGoals}–{row.result.awayGoals}</span> },
    { key: 'submittedBy', header: 'Submitted by', cell: (row) => <span className="text-xs text-ink-muted">{row.submittedBy}</span> },
    { key: 'submitted', header: 'Submitted', cell: (row) => <span className="text-xs text-ink-muted">{row.submitted}</span> },
    { key: 'status', header: 'Status', cell: (row) => <AdminStatusPill status={row.status} /> },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => onAction(`Result flag for ${row.result.home.name} vs ${row.result.away.name} is a frontend preview.`)}>
            Flag
          </Button>
          <Button variant="outline" size="sm" disabled={row.status === 'Verified'} onClick={() => onAction('Result verification is a frontend preview; the public table was not updated.')}>
            Verify
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <AdminPanel title="Match result verification" description="Submitted results waiting for league office confirmation." bodyClassName="p-0">
        <Table columns={columns} rows={rows} rowKey={(row) => row.id} caption="Match result reviews" />
      </AdminPanel>

      <div className="grid gap-5 xl:grid-cols-3">
        <AdminPanel title="Verification checklist" description="Confirm before a result is published.">
          <div className="space-y-3">
            {['Score agrees with referee report', 'Line-ups and substitutions captured', 'Disciplinary incidents recorded', 'Match commissioner signature received'].map((item) => (
              <div key={item} className="flex items-start gap-2 rounded-lg border border-line bg-surface-muted px-3 py-2.5">
                <ListChecks className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                <span className="text-xs leading-relaxed text-ink-muted">{item}</span>
              </div>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel title="Verification outcomes" description="What happens after review.">
          <div className="space-y-3">
            {[
              { icon: CheckCircle2, label: 'Verified', detail: 'Publishes score and updates table.' },
              { icon: Flag, label: 'Flagged', detail: 'Holds result and opens a review note.' },
              { icon: ListChecks, label: 'Returned', detail: 'Sent back to the submitting club.' },
            ].map((item) => {
              const Icon = item.icon

              return (
                <div key={item.label} className="flex items-center gap-3 rounded-lg border border-line bg-surface-muted px-3 py-2.5">
                  <Icon className="size-4 shrink-0 text-live" aria-hidden />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-ink">{item.label}</p>
                    <p className="caption">{item.detail}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </AdminPanel>

        <AdminPanel title="Publication control" description="Result visibility on the public site.">
          <p className="body-muted">
            Results remain hidden from public pages until they are verified. This preview does not connect to the results service.
          </p>
          <Button variant="outline" fullWidth className="mt-4" onClick={() => onAction('Bulk verification is a frontend preview; no results changed.')}>
            Review all pending
          </Button>
        </AdminPanel>
      </div>
    </>
  )
}
