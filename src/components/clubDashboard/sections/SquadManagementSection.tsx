import { useState, type FormEvent } from 'react'
import { Camera, ClipboardCheck, Plus, Save, UserRoundCog } from 'lucide-react'
import { AdminPanel, AdminStatusPill } from '@/components/admin'
import { FormField } from '@/components/auth'
import { Button, Select, Table, type TableColumn } from '@/components/ui'
import { CLUB_PLAYER_RECORDS, type ClubPlayerRecord } from '@/config/clubDashboard'
import type { ClubSectionProps } from './types'

const positionOptions = [
  { value: 'Goalkeeper', label: 'Goalkeeper' },
  { value: 'Defender', label: 'Defender' },
  { value: 'Midfielder', label: 'Midfielder' },
  { value: 'Forward', label: 'Forward' },
]

const availabilityOptions = [
  { value: 'Available', label: 'Available' },
  { value: 'Injured', label: 'Injured' },
  { value: 'Suspended', label: 'Suspended' },
]

interface ProfileDraft {
  name: string
  shirtNumber: string
  position: string
  availability: ClubPlayerRecord['availability']
}

function draftFrom(record: ClubPlayerRecord | undefined): ProfileDraft {
  return {
    name: record?.player.name ?? '',
    shirtNumber: String(record?.shirtNumber ?? ''),
    position: record?.position ?? 'Midfielder',
    availability: record?.availability ?? 'Available',
  }
}

export function SquadManagementSection({ search, onAction }: ClubSectionProps) {
  const [selectedId, setSelectedId] = useState(CLUB_PLAYER_RECORDS[0]?.id ?? '')
  const [draft, setDraft] = useState<ProfileDraft>(() => draftFrom(CLUB_PLAYER_RECORDS[0]))
  const [registerName, setRegisterName] = useState('')
  const [registerPosition, setRegisterPosition] = useState('Midfielder')
  const [registerNumber, setRegisterNumber] = useState('')

  const selectPlayer = (id: string) => {
    setSelectedId(id)
    setDraft(draftFrom(CLUB_PLAYER_RECORDS.find((record) => record.id === id)))
  }

  const rows = CLUB_PLAYER_RECORDS.filter(
    (record) => !search || record.player.name.toLowerCase().includes(search.toLowerCase()) || record.position.toLowerCase().includes(search.toLowerCase()) || record.registration.toLowerCase().includes(search.toLowerCase()),
  )

  const handleRegister = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onAction('Player registration is a frontend preview; no player was added to the squad.')
    setRegisterName('')
    setRegisterNumber('')
  }

  const columns: TableColumn<ClubPlayerRecord>[] = [
    { key: 'player', header: 'Player', cell: (row) => <p className="font-semibold text-ink">{row.player.name}</p> },
    { key: 'number', header: 'Shirt', cell: (row) => <span className="font-bold text-ink">{row.shirtNumber}</span> },
    { key: 'position', header: 'Position', cell: (row) => <span className="text-xs text-ink-muted">{row.position}</span> },
    { key: 'age', header: 'Age', cell: (row) => <span className="text-xs text-ink-muted">{row.player.age}</span> },
    { key: 'registration', header: 'Registration', cell: (row) => <AdminStatusPill status={row.registration} /> },
    { key: 'availability', header: 'Availability', cell: (row) => <AdminStatusPill status={row.availability === 'Available' ? 'Active' : row.availability} label={row.availability} /> },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      cell: () => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => onAction('Availability update is a frontend preview.')}>Availability</Button>
          <Button variant="outline" size="sm" onClick={() => onAction('Player profile edit is a frontend preview.')}>Edit</Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <div className="grid gap-5 xl:grid-cols-3">
        <AdminPanel title="Register player" description="Add a player to your authorised squad." className="xl:col-span-2">
          <form onSubmit={handleRegister} className="grid gap-4 md:grid-cols-2">
            <FormField label="Player name" name="squad-player-name" value={registerName} onChange={(event) => setRegisterName(event.target.value)} placeholder="Full name" required />
            <div>
              <p className="mb-1.5 text-xs font-semibold text-ink">Playing position</p>
              <Select options={positionOptions} value={registerPosition} onChange={setRegisterPosition} ariaLabel="New player position" />
            </div>
            <FormField label="Shirt number" name="squad-player-number" type="number" min={1} max={99} value={registerNumber} onChange={(event) => setRegisterNumber(event.target.value)} placeholder="e.g. 10" required />
            <FormField label="Player photograph" name="squad-player-photo" type="file" accept="image/*" />
            <div className="md:col-span-2">
              <Button type="submit" iconLeft={<Plus className="size-4" aria-hidden />}>Preview player</Button>
            </div>
          </form>
        </AdminPanel>

        <AdminPanel title="Squad overview" description="Registration and availability health.">
          <div className="space-y-3">
            {[
              { label: 'Squad players', value: CLUB_PLAYER_RECORDS.length, icon: UserRoundCog },
              { label: 'Verified registrations', value: CLUB_PLAYER_RECORDS.filter((record) => record.registration === 'Verified').length, icon: ClipboardCheck },
              { label: 'Available players', value: CLUB_PLAYER_RECORDS.filter((record) => record.availability === 'Available').length, icon: Camera },
            ].map((item) => {
              const Icon = item.icon

              return (
                <div key={item.label} className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface-muted px-3 py-3">
                  <div className="flex items-center gap-2.5">
                    <Icon className="size-4 text-primary" aria-hidden />
                    <span className="text-xs font-semibold text-ink">{item.label}</span>
                  </div>
                  <span className="font-display text-xl font-bold text-ink">{item.value}</span>
                </div>
              )
            })}
          </div>
        </AdminPanel>
      </div>

      <AdminPanel title="Squad register" description="Profiles, shirt numbers, positions and registration status." bodyClassName="p-0">
        <Table columns={columns} rows={rows} rowKey={(row) => row.id} caption="Club squad register" />
      </AdminPanel>

      <AdminPanel title="Update player profile" description="Maintain the selected player's profile and availability.">
        <div className="grid gap-5 lg:grid-cols-3">
          <div>
            <p className="mb-1.5 text-xs font-semibold text-ink">Select player</p>
            <Select
              options={CLUB_PLAYER_RECORDS.map((record) => ({ value: record.id, label: record.player.name }))}
              value={selectedId}
              onChange={selectPlayer}
              ariaLabel="Select squad player"
            />
            <div className="mt-4 rounded-lg border border-line bg-surface-muted p-4">
              <p className="font-display text-lg font-bold text-ink">{draft.name || 'No player selected'}</p>
              <p className="caption mt-1">Current shirt {draft.shirtNumber || '—'} · {draft.position}</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:col-span-2">
            <FormField label="Player name" name="profile-player-name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
            <FormField label="Shirt number" name="profile-shirt-number" type="number" min={1} max={99} value={draft.shirtNumber} onChange={(event) => setDraft({ ...draft, shirtNumber: event.target.value })} />
            <div>
              <p className="mb-1.5 text-xs font-semibold text-ink">Position</p>
              <Select options={positionOptions} value={draft.position} onChange={(value) => setDraft({ ...draft, position: value })} ariaLabel="Player position" />
            </div>
            <div>
              <p className="mb-1.5 text-xs font-semibold text-ink">Availability</p>
              <Select options={availabilityOptions} value={draft.availability} onChange={(value) => setDraft({ ...draft, availability: value as ClubPlayerRecord['availability'] })} ariaLabel="Player availability" />
            </div>
            <FormField label="Replace photograph" name="profile-player-photo" type="file" accept="image/*" />
            <div className="flex items-end">
              <Button variant="outline" iconLeft={<Save className="size-4" aria-hidden />} onClick={() => onAction('Profile changes are a frontend preview; nothing was saved.')}>
                Save profile preview
              </Button>
            </div>
          </div>
        </div>
      </AdminPanel>
    </>
  )
}
