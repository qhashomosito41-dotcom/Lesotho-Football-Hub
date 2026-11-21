import { useState, type FormEvent } from 'react'
import { Plus, Trophy } from 'lucide-react'
import { FormField } from '@/components/auth'
import { AdminPanel, AdminStatusPill } from '@/components/admin'
import { Button, Select, StatisticCard, Table, type TableColumn } from '@/components/ui'
import { COMPETITION_PROFILES, COMPETITION_SEASONS, type CompetitionProfile } from '@/config/competitions'
import type { AdminSectionProps } from './types'

const FORMAT_OPTIONS = [
  { value: 'league', label: 'League' },
  { value: 'group-stage', label: 'Group stage' },
  { value: 'knockout', label: 'Knockout' },
  { value: 'combined', label: 'Combined' },
]

const STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'Upcoming', label: 'Upcoming' },
  { value: 'Draft', label: 'Draft' },
]

export function CompetitionManagementSection({ search, onAction }: AdminSectionProps) {
  const [format, setFormat] = useState('league')
  const [season, setSeason] = useState(COMPETITION_SEASONS[0])
  const [status, setStatus] = useState('Draft')

  const rows = COMPETITION_PROFILES.filter(
    (competition) =>
      !search ||
      competition.name.toLowerCase().includes(search.toLowerCase()) ||
      competition.shortName.toLowerCase().includes(search.toLowerCase()) ||
      competition.format.toLowerCase().includes(search.toLowerCase()),
  )

  const columns: TableColumn<CompetitionProfile>[] = [
    { key: 'name', header: 'Competition', cell: (row) => <p className="font-semibold text-ink">{row.name}<span className="caption block">{row.id}</span></p> },
    { key: 'format', header: 'Format', cell: (row) => <span className="text-xs text-ink-muted">{row.typeLabel}</span> },
    { key: 'season', header: 'Season', cell: (row) => <span className="text-xs text-ink-muted">{row.season}</span> },
    { key: 'participants', header: 'Teams', cell: (row) => <span className="text-xs font-semibold text-ink">{row.participants.length}</span> },
    { key: 'round', header: 'Current round', cell: (row) => <span className="text-xs text-ink-muted">{row.currentRound}</span> },
    { key: 'status', header: 'Status', cell: (row) => <AdminStatusPill status={row.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (row) => (
        <div className="flex justify-end gap-1.5">
          <Button variant="ghost" size="sm" onClick={() => onAction(`Viewing ${row.name} is a frontend preview.`)}>View</Button>
          <Button variant="outline" size="sm" onClick={() => onAction(`Editing ${row.name} is a frontend preview.`)}>Edit</Button>
        </div>
      ),
    },
  ]

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onAction('Competition creation is a frontend preview; no competition was created.')
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatisticCard label="Competitions" value={COMPETITION_PROFILES.length} icon={<Trophy className="size-5" aria-hidden />} />
        <StatisticCard label="Active" value={COMPETITION_PROFILES.filter((item) => item.status === 'Active').length} icon={<Trophy className="size-5" aria-hidden />} />
        <StatisticCard label="Seasons available" value={COMPETITION_SEASONS.length} icon={<Trophy className="size-5" aria-hidden />} />
        <StatisticCard label="Formats supported" value={FORMAT_OPTIONS.length} icon={<Trophy className="size-5" aria-hidden />} />
      </div>

      <AdminPanel
        title="Competition creation"
        description="Preview the form used to add a new competition to the platform."
      >
        <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <FormField label="Competition name" name="competition-name" placeholder="e.g. Lesotho Super Cup" required />
          <FormField label="Short name" name="competition-short" placeholder="e.g. Super Cup" required />
          <div>
            <p className="mb-1.5 text-xs font-semibold text-ink">Format</p>
            <Select options={FORMAT_OPTIONS} value={format} onChange={setFormat} ariaLabel="Competition format" />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold text-ink">Season</p>
            <Select options={COMPETITION_SEASONS.map((value) => ({ value, label: value }))} value={season} onChange={setSeason} ariaLabel="Competition season" />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold text-ink">Initial status</p>
            <Select options={STATUS_OPTIONS} value={status} onChange={setStatus} ariaLabel="Competition status" />
          </div>
          <div className="sm:col-span-2 xl:col-span-3">
            <FormField label="Description" name="competition-description" placeholder="Short description of the competition" />
          </div>
          <div className="flex items-end">
            <Button type="submit" fullWidth iconLeft={<Plus className="size-4" aria-hidden />}>Preview competition</Button>
          </div>
        </form>
      </AdminPanel>

      <AdminPanel title="Competition portfolio" description="Existing competitions and their administrative status." bodyClassName="p-0">
        <Table columns={columns} rows={rows} rowKey={(row) => row.id} caption="Competition records" compact />
      </AdminPanel>
    </>
  )
}
