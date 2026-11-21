import { CalendarCheck, ClipboardList, ShieldCheck, UserRoundCheck } from 'lucide-react'
import { AdminPanel, AdminProgressBar, AdminStatusPill } from '@/components/admin'
import { Button, Table, type TableColumn } from '@/components/ui'
import { LEAGUE_FIXTURES, LEAGUE_OFFICIALS, type LeagueOfficialAssignment } from '@/config/leagueAdmin'
import type { LeagueSectionProps } from './types'

export function OfficialsSection({ search, onAction }: LeagueSectionProps) {
  const rows = LEAGUE_OFFICIALS.filter(
    (official) => !search || official.name.toLowerCase().includes(search.toLowerCase()) || official.role.toLowerCase().includes(search.toLowerCase()) || official.competition.toLowerCase().includes(search.toLowerCase()),
  )
  const fixtureRows = LEAGUE_FIXTURES.slice(0, 6).filter(
    (fixture) => !search || fixture.home.name.toLowerCase().includes(search.toLowerCase()) || fixture.away.name.toLowerCase().includes(search.toLowerCase()),
  )

  const columns: TableColumn<LeagueOfficialAssignment>[] = [
    { key: 'name', header: 'Official', cell: (row) => <p className="font-semibold text-ink">{row.name}</p> },
    { key: 'role', header: 'Role', cell: (row) => <span className="text-xs text-ink-muted">{row.role}</span> },
    { key: 'competition', header: 'Competition', cell: (row) => <span className="text-xs text-ink-muted">{row.competition}</span> },
    { key: 'fixtures', header: 'Assignments', cell: (row) => <span className="text-xs text-ink-muted">{row.fixtures}</span> },
    { key: 'status', header: 'Status', cell: (row) => <AdminStatusPill status={row.status} /> },
    { key: 'actions', header: 'Action', align: 'right', cell: () => <Button variant="outline" size="sm" onClick={() => onAction('Official assignment is a frontend preview; no fixture was changed.')}>Assign</Button> },
  ]

  return (
    <>
      <AdminPanel title="Official register" description="Match officials available for assigned competitions." bodyClassName="p-0">
        <Table columns={columns} rows={rows} rowKey={(row) => row.id} caption="Match officials" />
      </AdminPanel>

      <div className="grid gap-5 xl:grid-cols-3">
        <AdminPanel title="Assignment board" description="Upcoming fixtures needing an official team." className="xl:col-span-2">
          <div className="space-y-3">
            {fixtureRows.map((fixture) => (
              <div key={fixture.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface-muted px-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-ink">{fixture.home.name} vs {fixture.away.name}</p>
                  <p className="caption mt-1">{fixture.dateISO} · {fixture.kickoff} · {fixture.round}</p>
                </div>
                <Button variant="outline" size="sm" iconLeft={<UserRoundCheck className="size-3.5" aria-hidden />} onClick={() => onAction('Official assignment preview opened for this fixture.')}>
                  Assign officials
                </Button>
              </div>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel title="Coverage" description="Availability across the assigned portfolio.">
          <div className="space-y-4">
            <AdminProgressBar label="Referees confirmed" value={72} caption="Most fixtures covered" tone="live" />
            <AdminProgressBar label="Assistants confirmed" value={64} caption="Second official pending" tone="primary" />
            <AdminProgressBar label="Commissioners" value={58} caption="Cup fixtures prioritized" tone="accent" />
            <AdminProgressBar label="Fifth officials" value={34} caption="Premier fixtures only" tone="live" />
          </div>
        </AdminPanel>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        {[
          { icon: ShieldCheck, title: 'Referee', detail: 'Confirmed for each fixture before publication.' },
          { icon: ClipboardList, title: 'Assistant referees', detail: 'Two assistants recorded on the match sheet.' },
          { icon: CalendarCheck, title: 'Match commissioner', detail: 'Responsible for result submission and reports.' },
        ].map((item) => {
          const Icon = item.icon

          return (
            <AdminPanel key={item.title} title={item.title} description={item.detail}>
              <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                <Icon className="size-4" aria-hidden />
                Assignment available
              </div>
            </AdminPanel>
          )
        })}
      </div>
    </>
  )
}
