import { useState, type FormEvent } from 'react'
import { ArrowLeftRight, FilePlus2, LockKeyhole } from 'lucide-react'
import { AdminPanel, AdminStatusPill } from '@/components/admin'
import { FormField } from '@/components/auth'
import { Button, Select, Table, type TableColumn } from '@/components/ui'
import { CLUB_PLAYER_RECORDS, CLUB_PROFILE, CLUB_TRANSFERS, transferLabel } from '@/config/clubDashboard'
import { TRANSFER_TYPE_OPTIONS, type TransferRecord } from '@/config/transfers'
import type { ClubSectionProps } from './types'

const clubTypeOptions = TRANSFER_TYPE_OPTIONS.filter((option) => option.value !== 'all')

export function TransfersSection({ search, onAction }: ClubSectionProps) {
  const [playerId, setPlayerId] = useState(CLUB_PLAYER_RECORDS[0]?.id ?? '')
  const [destination, setDestination] = useState('')
  const [type, setType] = useState('permanent')

  const rows = CLUB_TRANSFERS.filter(
    (transfer) => !search || transfer.playerName.toLowerCase().includes(search.toLowerCase()) || transfer.fromClub.toLowerCase().includes(search.toLowerCase()) || transfer.toClub.toLowerCase().includes(search.toLowerCase()),
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onAction('Transfer request is a frontend preview; no request was submitted.')
    setDestination('')
  }

  const columns: TableColumn<TransferRecord>[] = [
    { key: 'player', header: 'Player', cell: (row) => <p className="font-semibold text-ink">{row.playerName}</p> },
    { key: 'movement', header: 'Movement', cell: (row) => <span className="text-xs text-ink-muted">{row.fromClub} → {row.toClub}</span> },
    { key: 'type', header: 'Type', cell: (row) => <span className="text-xs text-ink-muted">{transferLabel(row)}</span> },
    { key: 'date', header: 'Date', cell: (row) => <span className="text-xs text-ink-muted">{row.dateISO}</span> },
    { key: 'fee', header: 'Fee', cell: (row) => <span className="text-xs text-ink-muted">{row.feeLabel}</span> },
    { key: 'status', header: 'Status', cell: (row) => <AdminStatusPill status={row.status === 'pending' ? 'Pending' : 'Approved'} /> },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => onAction('Transfer tracking is a frontend preview.')}>Track</Button>
          <Button variant="outline" size="sm" disabled={row.status !== 'pending'} onClick={() => onAction(`Request for ${row.playerName} would be cancelled in a live service.`)}>Cancel</Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <div className="grid gap-5 xl:grid-cols-3">
        <AdminPanel title="New transfer request" description={`Submit a movement involving ${CLUB_PROFILE.name}.`} className="xl:col-span-2">
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-1.5 text-xs font-semibold text-ink">Player</p>
              <Select
                options={CLUB_PLAYER_RECORDS.map((record) => ({ value: record.id, label: record.player.name }))}
                value={playerId}
                onChange={setPlayerId}
                ariaLabel="Transfer player"
              />
            </div>
            <div>
              <p className="mb-1.5 text-xs font-semibold text-ink">Transfer type</p>
              <Select options={clubTypeOptions} value={type} onChange={setType} ariaLabel="Transfer type" />
            </div>
            <FormField label="Destination club" name="transfer-destination" value={destination} onChange={(event) => setDestination(event.target.value)} placeholder="Club name" required />
            <FormField label="Agreement document" name="transfer-document" type="file" accept="image/*,.pdf" />
            <div className="md:col-span-2">
              <Button type="submit" iconLeft={<FilePlus2 className="size-4" aria-hidden />}>Preview request</Button>
            </div>
          </form>
        </AdminPanel>

        <AdminPanel title="Transfer authority" description="Club-based permission check.">
          <div className="rounded-lg border border-green-200 bg-live-soft px-3 py-3">
            <div className="flex items-start gap-2">
              <LockKeyhole className="mt-0.5 size-4 shrink-0 text-live" aria-hidden />
              <div>
                <p className="text-xs font-bold text-live">{CLUB_PROFILE.name} only</p>
                <p className="caption mt-1">Transfer requests can be created only for players registered to your authorised club.</p>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-line bg-surface-muted px-3 py-3">
            <ArrowLeftRight className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            <p className="text-xs leading-relaxed text-ink-muted">League approval is required before a transfer becomes active. This preview does not send requests.</p>
          </div>
        </AdminPanel>
      </div>

      <AdminPanel title="Transfer history" description="Movements involving your club." bodyClassName="p-0">
        <Table columns={columns} rows={rows} rowKey={(row) => row.id} caption="Club transfers" />
      </AdminPanel>
    </>
  )
}
