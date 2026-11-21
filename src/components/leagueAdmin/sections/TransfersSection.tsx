import { CheckCircle2, FileCheck2, XCircle } from 'lucide-react'
import { AdminPanel, AdminStatusPill } from '@/components/admin'
import { Button, Table, type TableColumn } from '@/components/ui'
import { TRANSFER_TYPE_LABELS, type TransferRecord } from '@/config/transfers'
import { LEAGUE_TRANSFERS } from '@/config/leagueAdmin'
import type { LeagueSectionProps } from './types'

export function TransfersSection({ search, onAction }: LeagueSectionProps) {
  const rows = LEAGUE_TRANSFERS.filter(
    (transfer) => !search || transfer.playerName.toLowerCase().includes(search.toLowerCase()) || transfer.fromClub.toLowerCase().includes(search.toLowerCase()) || transfer.toClub.toLowerCase().includes(search.toLowerCase()),
  )

  const columns: TableColumn<TransferRecord>[] = [
    { key: 'player', header: 'Player', cell: (row) => <p className="font-semibold text-ink">{row.playerName}</p> },
    { key: 'movement', header: 'Movement', cell: (row) => <span className="text-xs text-ink-muted">{row.fromClub} → {row.toClub}</span> },
    { key: 'type', header: 'Type', cell: (row) => <span className="text-xs text-ink-muted capitalize">{TRANSFER_TYPE_LABELS[row.type] ?? row.type}</span> },
    { key: 'date', header: 'Date', cell: (row) => <span className="text-xs text-ink-muted">{row.dateISO}</span> },
    { key: 'fee', header: 'Fee', cell: (row) => <span className="text-xs text-ink-muted">{row.feeLabel}</span> },
    { key: 'status', header: 'Status', cell: (row) => <AdminStatusPill status={row.status === 'pending' ? 'Pending' : 'Approved'} /> },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" disabled={row.status !== 'pending'} onClick={() => onAction(`Transfer rejection for ${row.playerName} is a frontend preview.`)}>
            Reject
          </Button>
          <Button variant="outline" size="sm" disabled={row.status !== 'pending'} onClick={() => onAction(`Transfer approval for ${row.playerName} is a frontend preview; no status changed.`)}>
            Approve
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <AdminPanel title="Transfer approvals" description="Movements involving clubs in assigned competitions." bodyClassName="p-0">
        <Table columns={columns} rows={rows} rowKey={(row) => row.id} caption="League transfer reviews" />
      </AdminPanel>

      <div className="grid gap-5 xl:grid-cols-3">
        <AdminPanel title="Approval conditions" description="Checks applied before a transfer is approved.">
          <div className="space-y-3">
            {['Registration window is open', 'Receiving club is in assigned scope', 'Player clearance is available', 'Contract or loan papers are complete'].map((item) => (
              <div key={item} className="flex items-start gap-2 rounded-lg border border-line bg-surface-muted px-3 py-2.5">
                <FileCheck2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                <span className="text-xs leading-relaxed text-ink-muted">{item}</span>
              </div>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel title="Decision outcomes" description="Available decisions for the league office.">
          <div className="space-y-3">
            {[
              { icon: CheckCircle2, label: 'Approve', detail: 'Registration moves to the new club.' },
              { icon: XCircle, label: 'Reject', detail: 'Transfer stays pending with a reason.' },
              { icon: FileCheck2, label: 'Request evidence', detail: 'Returns the record for more documents.' },
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

        <AdminPanel title="Scope note" description="How transfer records are filtered.">
          <p className="body-muted">
            A transfer appears when either the originating or receiving club belongs to an assigned competition. Records involving only unassigned competitions are hidden.
          </p>
        </AdminPanel>
      </div>
    </>
  )
}
