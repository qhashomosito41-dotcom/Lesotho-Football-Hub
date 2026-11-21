import { ArrowLeftRight, CheckCircle2, Clock3, ListChecks } from 'lucide-react'
import { AdminPanel, AdminStatusPill } from '@/components/admin'
import { Button, StatisticCard, Table, type TableColumn } from '@/components/ui'
import { TRANSFERS, TRANSFER_TYPE_LABELS, type TransferRecord } from '@/config/transfers'
import type { AdminSectionProps } from './types'

export function TransferManagementSection({ search, onAction }: AdminSectionProps) {
  const rows = TRANSFERS.filter(
    (transfer) =>
      !search ||
      transfer.playerName.toLowerCase().includes(search.toLowerCase()) ||
      transfer.fromClub.toLowerCase().includes(search.toLowerCase()) ||
      transfer.toClub.toLowerCase().includes(search.toLowerCase()),
  ).slice(0, 30)

  const columns: TableColumn<TransferRecord>[] = [
    { key: 'player', header: 'Player', cell: (row) => <p className="font-semibold text-ink">{row.playerName}<span className="caption block">{row.id}</span></p> },
    { key: 'from', header: 'From', cell: (row) => <span className="text-xs text-ink-muted">{row.fromClub}</span> },
    { key: 'to', header: 'To', cell: (row) => <span className="text-xs text-ink-muted">{row.toClub}</span> },
    { key: 'type', header: 'Type', cell: (row) => <span className="text-xs text-ink-muted">{TRANSFER_TYPE_LABELS[row.type]}</span> },
    { key: 'season', header: 'Season', cell: (row) => <span className="text-xs text-ink-muted">{row.season}</span> },
    { key: 'date', header: 'Date', cell: (row) => <span className="text-xs text-ink-muted">{new Date(row.dateISO).toLocaleDateString('en-GB')}</span> },
    { key: 'status', header: 'Status', cell: (row) => <AdminStatusPill status={row.status === 'approved' ? 'Approved' : 'Pending'} /> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (row) => (
        <div className="flex justify-end gap-1.5">
          <Button variant="outline" size="sm" iconLeft={<CheckCircle2 className="size-3.5" aria-hidden />} onClick={() => onAction(`Transfer approval for ${row.playerName} is a frontend preview.`)}>
            Approve
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onAction(`Transfer review for ${row.playerName} is a frontend preview.`)}>Review</Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatisticCard label="Transfer records" value={TRANSFERS.length} icon={<ArrowLeftRight className="size-5" aria-hidden />} />
        <StatisticCard label="Approved" value={TRANSFERS.filter((transfer) => transfer.status === 'approved').length} icon={<CheckCircle2 className="size-5" aria-hidden />} />
        <StatisticCard label="Pending" value={TRANSFERS.filter((transfer) => transfer.status === 'pending').length} icon={<Clock3 className="size-5" aria-hidden />} />
        <StatisticCard label="Shown" value={rows.length} icon={<ListChecks className="size-5" aria-hidden />} />
      </div>

      <AdminPanel title="Transfer approvals" description="Review player movement and administrative approval status." bodyClassName="p-0">
        <Table columns={columns} rows={rows} rowKey={(row) => row.id} caption="Transfer records" compact />
      </AdminPanel>
    </>
  )
}
