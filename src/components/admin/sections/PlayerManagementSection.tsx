import { useState } from 'react'
import { IdCard, ShieldCheck, UserRound, Users } from 'lucide-react'
import { AdminPanel, AdminStatusPill } from '@/components/admin'
import { Button, Select, StatisticCard, Table, type TableColumn } from '@/components/ui'
import { PLAYER_LIST, POSITION_GROUPS, type PlayerProfile, type PositionGroup } from '@/config/players'
import type { AdminSectionProps } from './types'

const POSITION_OPTIONS = [
  { value: 'all', label: 'All positions' },
  ...POSITION_GROUPS.map((position) => ({ value: position, label: position })),
]

export function PlayerManagementSection({ search, onAction }: AdminSectionProps) {
  const [position, setPosition] = useState<PositionGroup | 'all'>('all')
  const rows = PLAYER_LIST.filter(
    (player) =>
      (position === 'all' || player.positionGroup === position) &&
      (!search ||
        player.name.toLowerCase().includes(search.toLowerCase()) ||
        player.club.name.toLowerCase().includes(search.toLowerCase()) ||
        player.position.toLowerCase().includes(search.toLowerCase())),
  ).slice(0, 40)

  const columns: TableColumn<PlayerProfile>[] = [
    {
      key: 'player',
      header: 'Player',
      cell: (row) => (
        <div className="flex min-w-0 items-center gap-2.5">
          <img src={row.photoUrl} alt="" className="size-8 shrink-0 rounded-full bg-surface-sunken object-cover" />
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink">{row.name}</p>
            <p className="caption truncate">#{row.number} · {row.id}</p>
          </div>
        </div>
      ),
    },
    { key: 'club', header: 'Club', cell: (row) => <span className="text-xs text-ink-muted">{row.club.name}</span> },
    { key: 'position', header: 'Position', cell: (row) => <span className="text-xs text-ink-muted">{row.position}</span> },
    { key: 'age', header: 'Age', cell: (row) => <span className="text-xs font-semibold text-ink">{row.age}</span> },
    { key: 'apps', header: 'Appearances', cell: (row) => <span className="text-xs font-semibold text-ink">{row.seasonStats.appearances}</span> },
    { key: 'goals', header: 'Goals', cell: (row) => <span className="text-xs font-semibold text-ink">{row.seasonStats.goals}</span> },
    { key: 'status', header: 'Registration', cell: (row) => <AdminStatusPill status={row.id.length % 7 === 0 ? 'Pending' : 'Verified'} /> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (row) => (
        <div className="flex justify-end gap-1.5">
          <Button variant="ghost" size="sm" onClick={() => onAction(`Viewing ${row.name} is a frontend preview.`)}>View</Button>
          <Button variant="outline" size="sm" onClick={() => onAction(`Registration review for ${row.name} is a frontend preview.`)}>Review</Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatisticCard label="Player records" value={PLAYER_LIST.length} icon={<Users className="size-5" aria-hidden />} />
        <StatisticCard label="Shown in table" value={rows.length} icon={<UserRound className="size-5" aria-hidden />} />
        <StatisticCard label="Verified sample" value={rows.filter((row) => row.id.length % 7 !== 0).length} icon={<ShieldCheck className="size-5" aria-hidden />} />
        <StatisticCard label="Pending sample" value={rows.filter((row) => row.id.length % 7 === 0).length} icon={<IdCard className="size-5" aria-hidden />} />
      </div>

      <AdminPanel
        title="Player registrations"
        description="Inspect player records, club affiliation and season statistics."
        actions={
          <Select
            options={POSITION_OPTIONS}
            value={position}
            onChange={(value) => setPosition(value as PositionGroup | 'all')}
            ariaLabel="Filter players by position"
            className="w-48"
          />
        }
        bodyClassName="p-0"
      >
        <Table columns={columns} rows={rows} rowKey={(row) => row.id} caption="Player registration records" compact />
      </AdminPanel>
    </>
  )
}
