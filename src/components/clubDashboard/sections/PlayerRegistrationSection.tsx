import { useState, type FormEvent } from 'react'
import { ClipboardCheck, FileUp, SearchCheck } from 'lucide-react'
import { AdminPanel, AdminProgressBar, AdminStatusPill } from '@/components/admin'
import { FormField } from '@/components/auth'
import { Button, Select, Table, type TableColumn } from '@/components/ui'
import { CLUB_PLAYER_RECORDS, CLUB_REGISTRATIONS, type ClubRegistration } from '@/config/clubDashboard'
import type { ClubSectionProps } from './types'

export function PlayerRegistrationSection({ search, onAction }: ClubSectionProps) {
  const [playerId, setPlayerId] = useState(CLUB_PLAYER_RECORDS[0]?.id ?? '')
  const [position, setPosition] = useState(CLUB_PLAYER_RECORDS[0]?.position ?? 'Midfielder')
  const player = CLUB_PLAYER_RECORDS.find((record) => record.id === playerId) ?? CLUB_PLAYER_RECORDS[0]

  const rows = CLUB_REGISTRATIONS.filter(
    (registration) => !search || registration.playerName.toLowerCase().includes(search.toLowerCase()) || registration.status.toLowerCase().includes(search.toLowerCase()) || registration.position.toLowerCase().includes(search.toLowerCase()),
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onAction('Registration submission is a frontend preview; nothing was sent to the league office.')
  }

  const columns: TableColumn<ClubRegistration>[] = [
    { key: 'player', header: 'Player', cell: (row) => <p className="font-semibold text-ink">{row.playerName}</p> },
    { key: 'position', header: 'Position', cell: (row) => <span className="text-xs text-ink-muted">{row.position}</span> },
    { key: 'competition', header: 'Competition', cell: (row) => <span className="text-xs text-ink-muted">{row.competition}</span> },
    { key: 'documents', header: 'Documents', cell: (row) => <span className="text-xs text-ink-muted">{row.documents} files</span> },
    { key: 'submitted', header: 'Submitted', cell: (row) => <span className="text-xs text-ink-muted">{row.submitted}</span> },
    { key: 'status', header: 'Status', cell: (row) => <AdminStatusPill status={row.status} /> },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      cell: () => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => onAction('Registration file is a frontend preview.')}>View file</Button>
          <Button variant="outline" size="sm" onClick={() => onAction('Registration tracking is a frontend preview.')}>Track</Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <div className="grid gap-5 xl:grid-cols-3">
        <AdminPanel title="Submit registration" description="Send a player registration for league review." className="xl:col-span-2">
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-1.5 text-xs font-semibold text-ink">Squad player</p>
              <Select
                options={CLUB_PLAYER_RECORDS.map((record) => ({ value: record.id, label: record.player.name }))}
                value={playerId}
                onChange={(value) => {
                  setPlayerId(value)
                  const record = CLUB_PLAYER_RECORDS.find((item) => item.id === value)
                  setPosition(record?.position ?? 'Midfielder')
                }}
                ariaLabel="Registration player"
              />
            </div>
            <div>
              <p className="mb-1.5 text-xs font-semibold text-ink">Registered position</p>
              <Select
                options={[{ value: position, label: position }]}
                value={position}
                onChange={setPosition}
                ariaLabel="Registered position"
              />
            </div>
            <FormField label="National ID or passport" name="registration-id" placeholder="Enter document number" required />
            <FormField label="Supporting documents" name="registration-documents" type="file" accept="image/*,.pdf" multiple />
            <div className="md:col-span-2">
              <Button type="submit" iconLeft={<FileUp className="size-4" aria-hidden />}>Preview submission</Button>
            </div>
          </form>
        </AdminPanel>

        <AdminPanel title="Registration status" description="Progress of submissions for your club.">
          <div className="space-y-4">
            <AdminProgressBar label="Verified players" value={80} caption="Most squad registrations confirmed" tone="live" />
            <AdminProgressBar label="Pending review" value={35} caption="League office reviewing files" tone="accent" />
            <AdminProgressBar label="Documents complete" value={72} caption="Some files need follow-up" tone="primary" />
          </div>
          <div className="mt-5 flex items-start gap-2 rounded-lg border border-line bg-surface-muted px-3 py-3">
            <ClipboardCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            <p className="text-xs leading-relaxed text-ink-muted">Selected for: {player?.player.name ?? '—'}. Submissions are preview-only in this frontend.</p>
          </div>
        </AdminPanel>
      </div>

      <AdminPanel title="Registration records" description="Player registrations submitted by your club." bodyClassName="p-0">
        <Table columns={columns} rows={rows} rowKey={(row) => row.id} caption="Club player registrations" />
      </AdminPanel>

      <AdminPanel title="Status guide" description="What each registration status means.">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { icon: SearchCheck, label: 'Pending', detail: 'Submitted and awaiting league review.' },
            { icon: ClipboardCheck, label: 'Verified', detail: 'Player is eligible for selection.' },
            { icon: FileUp, label: 'Rejected', detail: 'Documents need correction and resubmission.' },
          ].map((item) => {
            const Icon = item.icon

            return (
              <div key={item.label} className="rounded-lg border border-line bg-surface-muted px-4 py-3">
                <Icon className="size-4 text-primary" aria-hidden />
                <p className="mt-2 text-xs font-semibold text-ink">{item.label}</p>
                <p className="caption mt-1">{item.detail}</p>
              </div>
            )
          })}
        </div>
      </AdminPanel>
    </>
  )
}
