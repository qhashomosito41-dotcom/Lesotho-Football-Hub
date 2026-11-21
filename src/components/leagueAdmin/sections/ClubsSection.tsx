import { CheckCircle2, FileCheck2, Info } from 'lucide-react'
import { AdminPanel, AdminStatusPill } from '@/components/admin'
import { Button, Table, type TableColumn } from '@/components/ui'
import { LEAGUE_CLUB_APPROVALS, type LeagueClubApproval } from '@/config/leagueAdmin'
import type { LeagueSectionProps } from './types'

export function ClubsSection({ search, onAction }: LeagueSectionProps) {
  const rows = LEAGUE_CLUB_APPROVALS.filter(
    (item) => !search || item.club.name.toLowerCase().includes(search.toLowerCase()) || item.club.district.toLowerCase().includes(search.toLowerCase()) || item.club.competition.toLowerCase().includes(search.toLowerCase()),
  )

  const columns: TableColumn<LeagueClubApproval>[] = [
    { key: 'club', header: 'Club', cell: (row) => <p className="font-semibold text-ink">{row.club.name}</p> },
    { key: 'competition', header: 'Competition', cell: (row) => <span className="text-xs text-ink-muted">{row.club.competition}</span> },
    { key: 'district', header: 'District', cell: (row) => <span className="text-xs text-ink-muted">{row.club.district}</span> },
    { key: 'documents', header: 'Documents', cell: (row) => <span className="text-xs text-ink-muted">{row.documents} files</span> },
    { key: 'submitted', header: 'Submitted', cell: (row) => <span className="text-xs text-ink-muted">{row.submitted}</span> },
    { key: 'status', header: 'Status', cell: (row) => <AdminStatusPill status={row.status} /> },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => onAction(`Document review for ${row.club.name} is a frontend preview.`)}>
            Review
          </Button>
          <Button variant="outline" size="sm" disabled={row.status === 'Approved'} onClick={() => onAction(`Club approval for ${row.club.name} is a frontend preview; no status changed.`)}>
            Approve
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <AdminPanel title="Club approval queue" description="Registrations submitted by clubs in assigned competitions." bodyClassName="p-0">
        <Table columns={columns} rows={rows} rowKey={(row) => row.id} caption="Club approvals" />
      </AdminPanel>

      <div className="grid gap-5 xl:grid-cols-3">
        <AdminPanel title="Approval checklist" description="Required evidence before a club is approved.">
          <div className="space-y-3">
            {['Valid registration certificate', 'Stadium or venue confirmation', 'Current season squad list', 'Insurance and safety declaration'].map((item) => (
              <div key={item} className="flex items-start gap-2 rounded-lg border border-line bg-surface-muted px-3 py-2.5">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-live" aria-hidden />
                <span className="text-xs leading-relaxed text-ink-muted">{item}</span>
              </div>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel title="Verification evidence" description="Documents checked by the league office.">
          <div className="space-y-3">
            {['Constitution and committee list', 'Audited club accounts', 'Player registration register', 'Disciplinary compliance statement'].map((item) => (
              <div key={item} className="flex items-start gap-2 rounded-lg border border-line bg-surface-muted px-3 py-2.5">
                <FileCheck2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                <span className="text-xs leading-relaxed text-ink-muted">{item}</span>
              </div>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel title="Scope reminder" description="How club records are filtered in this workspace.">
          <div className="flex items-start gap-2 rounded-lg border border-orange-200 bg-accent-soft px-3 py-3">
            <Info className="mt-0.5 size-4 shrink-0 text-accent-ink" aria-hidden />
            <p className="text-xs leading-relaxed text-accent-ink">
              Only clubs affiliated with assigned competitions are shown. Clubs from other competitions remain in the platform but are hidden here.
            </p>
          </div>
        </AdminPanel>
      </div>
    </>
  )
}
