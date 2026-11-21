import { useState } from 'react'
import { CalendarDays, ClipboardList, MapPin } from 'lucide-react'
import { AdminPanel, AdminProgressBar, AdminStatusPill } from '@/components/admin'
import { Button, Select, Table, type TableColumn } from '@/components/ui'
import { competitionName } from '@/config/league'
import { CLUB_FIXTURES, opponentFor } from '@/config/clubDashboard'
import type { ScheduleFixture } from '@/config/league'
import type { ClubSectionProps } from './types'

export function FixturesSection({ search, onAction }: ClubSectionProps) {
  const [competition, setCompetition] = useState('all')
  const competitionOptions = Array.from(new Set(CLUB_FIXTURES.map((fixture) => fixture.competitionId))).map((id) => ({ value: id, label: competitionName(id) }))
  const rows = CLUB_FIXTURES.filter(
    (fixture) =>
      (competition === 'all' || fixture.competitionId === competition) &&
      (!search || opponentFor(fixture).toLowerCase().includes(search.toLowerCase()) || fixture.round.toLowerCase().includes(search.toLowerCase()) || fixture.venue.toLowerCase().includes(search.toLowerCase())),
  )

  const columns: TableColumn<ScheduleFixture>[] = [
    { key: 'competition', header: 'Competition', cell: (row) => <span className="text-xs text-ink-muted">{competitionName(row.competitionId)}</span> },
    { key: 'opponent', header: 'Opponent', cell: (row) => <p className="font-semibold text-ink">{opponentFor(row)}</p> },
    { key: 'round', header: 'Round', cell: (row) => <span className="text-xs text-ink-muted">{row.round}</span> },
    { key: 'date', header: 'Date', cell: (row) => <span className="text-xs text-ink-muted">{row.dateISO}</span> },
    { key: 'kickoff', header: 'Kick-off', cell: (row) => <span className="text-xs text-ink-muted">{row.kickoff}</span> },
    { key: 'status', header: 'Preparation', cell: () => <AdminStatusPill status="Pending" label="In progress" /> },
    { key: 'actions', header: 'Action', align: 'right', cell: () => <Button variant="outline" size="sm" onClick={() => onAction('Fixture preparation is a frontend preview.')}>Prepare</Button> },
  ]

  return (
    <>
      <AdminPanel title="Fixture filter" description="Focus on a specific competition.">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="mb-1.5 text-xs font-semibold text-ink">Competition</p>
            <Select options={[{ value: 'all', label: 'All competitions' }, ...competitionOptions]} value={competition} onChange={setCompetition} ariaLabel="Filter club fixtures" />
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-line bg-surface-muted px-3 py-2.5">
            <CalendarDays className="size-4 text-primary" aria-hidden />
            <span className="text-xs font-semibold text-ink">{CLUB_FIXTURES.length} upcoming fixtures</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-line bg-surface-muted px-3 py-2.5">
            <ClipboardList className="size-4 text-primary" aria-hidden />
            <span className="text-xs font-semibold text-ink">Club-scoped schedule</span>
          </div>
        </div>
      </AdminPanel>

      <AdminPanel title="Upcoming fixtures" description="Matches involving your authorised club." bodyClassName="p-0">
        <Table columns={columns} rows={rows} rowKey={(row) => row.id} caption="Club fixtures" />
      </AdminPanel>

      <div className="grid gap-5 xl:grid-cols-2">
        <AdminPanel title="Preparation progress" description="Tasks completed for the next fixture.">
          <div className="space-y-4">
            <AdminProgressBar label="Matchday squad" value={100} caption="Squad submitted" tone="live" />
            <AdminProgressBar label="Starting XI" value={92} caption="Tactical selection almost complete" tone="primary" />
            <AdminProgressBar label="Availability" value={78} caption="Injury updates confirmed" tone="accent" />
            <AdminProgressBar label="Travel and venue" value={64} caption="Logistics being confirmed" tone="live" />
          </div>
        </AdminPanel>

        <AdminPanel title="Next fixture" description="Venue and kick-off details.">
          {CLUB_FIXTURES[0] && (
            <div className="space-y-3">
              <div className="rounded-lg border border-line bg-surface-muted p-4">
                <p className="font-display text-xl font-bold text-ink">{opponentFor(CLUB_FIXTURES[0])}</p>
                <p className="caption mt-1">{CLUB_FIXTURES[0].dateISO} · {CLUB_FIXTURES[0].kickoff}</p>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-line px-3 py-2.5">
                <MapPin className="size-4 text-primary" aria-hidden />
                <span className="text-xs font-semibold text-ink">{CLUB_FIXTURES[0].venue}</span>
              </div>
            </div>
          )}
        </AdminPanel>
      </div>
    </>
  )
}
