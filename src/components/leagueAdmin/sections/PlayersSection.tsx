import { BadgeCheck, ClipboardCheck, UserCheck } from 'lucide-react'
import { AdminPanel, AdminStatusPill } from '@/components/admin'
import { Button, Table, type TableColumn } from '@/components/ui'
import { LEAGUE_PLAYER_REGISTRATIONS, type LeaguePlayerRegistration } from '@/config/leagueAdmin'
import type { LeagueSectionProps } from './types'

export function PlayersSection({ search, onAction }: LeagueSectionProps) {
  const rows = LEAGUE_PLAYER_REGISTRATIONS.filter(
    (item) => !search || item.player.name.toLowerCase().includes(search.toLowerCase()) || item.player.club.name.toLowerCase().includes(search.toLowerCase()) || item.competition.toLowerCase().includes(search.toLowerCase()),
  )

  const columns: TableColumn<LeaguePlayerRegistration>[] = [
    { key: 'player', header: 'Player', cell: (row) => <p className="font-semibold text-ink">{row.player.name}</p> },
    { key: 'club', header: 'Club', cell: (row) => <span className="text-xs text-ink-muted">{row.player.club.name}</span> },
    { key: 'competition', header: 'Competition', cell: (row) => <span className="text-xs text-ink-muted">{row.competition}</span> },
    { key: 'position', header: 'Position', cell: (row) => <span className="text-xs text-ink-muted">{row.player.position}</span> },
    { key: 'submitted', header: 'Submitted', cell: (row) => <span className="text-xs text-ink-muted">{row.submitted}</span> },
    { key: 'status', header: 'Status', cell: (row) => <AdminStatusPill status={row.status} /> },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => onAction(`Registration file for ${row.player.name} is a frontend preview.`)}>
            View file
          </Button>
          <Button variant="outline" size="sm" disabled={row.status === 'Verified'} onClick={() => onAction(`Registration verification for ${row.player.name} is a frontend preview.`)}>
            Verify
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <AdminPanel title="Player registration queue" description="Registrations for clubs inside assigned competitions." bodyClassName="p-0">
        <Table columns={columns} rows={rows} rowKey={(row) => row.id} caption="Player registrations" />
      </AdminPanel>

      <div className="grid gap-5 xl:grid-cols-3">
        <AdminPanel title="Eligibility checks" description="Checks completed before verification.">
          <div className="space-y-3">
            {['Identity and date of birth confirmed', 'Club affiliation matches competition', 'Previous club clearance recorded', 'Medical declaration on file'].map((item) => (
              <div key={item} className="flex items-start gap-2 rounded-lg border border-line bg-surface-muted px-3 py-2.5">
                <ClipboardCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                <span className="text-xs leading-relaxed text-ink-muted">{item}</span>
              </div>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel title="Registration outcomes" description="Decisions available to the league office.">
          <div className="space-y-3">
            {[
              { label: 'Verified', detail: 'Player is eligible', icon: BadgeCheck },
              { label: 'Pending', detail: 'Evidence still required', icon: UserCheck },
              { label: 'Rejected', detail: 'Does not meet criteria', icon: ClipboardCheck },
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

        <AdminPanel title="Privacy note" description="Handling registration records.">
          <p className="body-muted">
            Player records shown here are limited to the assigned competition scope. Personal data is illustrative in this frontend preview and no registration service is connected.
          </p>
        </AdminPanel>
      </div>
    </>
  )
}
