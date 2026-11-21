import { useState, type FormEvent } from 'react'
import { CalendarClock, Plus } from 'lucide-react'
import { AdminPanel, AdminStatusPill } from '@/components/admin'
import { FormField } from '@/components/auth'
import { Button, Select, Table, type TableColumn } from '@/components/ui'
import { competitionName } from '@/config/league'
import { LEAGUE_CLUBS, LEAGUE_COMPETITIONS, LEAGUE_FIXTURES, LEAGUE_RESCHEDULES, type LeagueRescheduleRequest } from '@/config/leagueAdmin'
import type { CompetitionId, ScheduleFixture } from '@/config/league'
import type { LeagueSectionProps } from './types'

export function FixturesSection({ search, onAction }: LeagueSectionProps) {
  const [competition, setCompetition] = useState(LEAGUE_COMPETITIONS[0]?.id ?? '')
  const [home, setHome] = useState(LEAGUE_CLUBS[0]?.id ?? '')
  const [away, setAway] = useState(LEAGUE_CLUBS[1]?.id ?? '')
  const [date, setDate] = useState('2026-11-28')
  const [kickoff, setKickoff] = useState('15:00')
  const [venue, setVenue] = useState('')

  const clubOptions = LEAGUE_CLUBS.map((club) => ({ value: club.id, label: club.name }))

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onAction('Fixture creation is a frontend preview; no fixture was saved.')
  }

  const rows = LEAGUE_FIXTURES.filter(
    (fixture) => !search || fixture.home.name.toLowerCase().includes(search.toLowerCase()) || fixture.away.name.toLowerCase().includes(search.toLowerCase()) || competitionName(fixture.competitionId).toLowerCase().includes(search.toLowerCase()) || fixture.round.toLowerCase().includes(search.toLowerCase()),
  )
  const rescheduleRows = LEAGUE_RESCHEDULES.filter(
    (request) => !search || request.fixture.home.name.toLowerCase().includes(search.toLowerCase()) || request.fixture.away.name.toLowerCase().includes(search.toLowerCase()) || request.reason.toLowerCase().includes(search.toLowerCase()),
  )

  const columns: TableColumn<ScheduleFixture>[] = [
    { key: 'competition', header: 'Competition', cell: (row) => <span className="text-xs text-ink-muted">{competitionName(row.competitionId)}</span> },
    { key: 'fixture', header: 'Fixture', cell: (row) => <p className="font-semibold text-ink">{row.home.name} vs {row.away.name}</p> },
    { key: 'round', header: 'Round', cell: (row) => <span className="text-xs text-ink-muted">{row.round}</span> },
    { key: 'date', header: 'Date', cell: (row) => <span className="text-xs text-ink-muted">{row.dateISO}</span> },
    { key: 'kickoff', header: 'Kick-off', cell: (row) => <span className="text-xs text-ink-muted">{row.kickoff}</span> },
    { key: 'venue', header: 'Venue', cell: (row) => <span className="text-xs text-ink-muted">{row.venue}</span> },
    { key: 'actions', header: 'Action', align: 'right', cell: () => <Button variant="outline" size="sm" onClick={() => onAction('Fixture management is a frontend preview.')}>Manage</Button> },
  ]

  const rescheduleColumns: TableColumn<LeagueRescheduleRequest>[] = [
    { key: 'fixture', header: 'Fixture', cell: (row) => <p className="font-semibold text-ink">{row.fixture.home.name} vs {row.fixture.away.name}</p> },
    { key: 'requestedBy', header: 'Requested by', cell: (row) => <span className="text-xs text-ink-muted">{row.requestedBy}</span> },
    { key: 'reason', header: 'Reason', cell: (row) => <span className="text-xs text-ink-muted">{row.reason}</span> },
    { key: 'proposed', header: 'Proposed', cell: (row) => <span className="text-xs text-ink-muted">{row.proposedDate} · {row.proposedKickoff}</span> },
    { key: 'status', header: 'Status', cell: (row) => <AdminStatusPill status={row.status} /> },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      cell: () => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => onAction('Reschedule rejection is a frontend preview.')}>Reject</Button>
          <Button variant="outline" size="sm" onClick={() => onAction('Reschedule approval is a frontend preview; the fixture was not moved.')}>Approve</Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <AdminPanel title="Create fixture" description="Add a fixture to one of your assigned competitions.">
        <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <p className="mb-1.5 text-xs font-semibold text-ink">Competition</p>
            <Select options={LEAGUE_COMPETITIONS.map((item) => ({ value: item.id, label: item.name }))} value={competition} onChange={(value) => setCompetition(value as CompetitionId)} ariaLabel="Fixture competition" />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold text-ink">Home club</p>
            <Select options={clubOptions} value={home} onChange={setHome} ariaLabel="Fixture home club" />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold text-ink">Away club</p>
            <Select options={clubOptions} value={away} onChange={setAway} ariaLabel="Fixture away club" />
          </div>
          <FormField label="Venue" name="fixture-venue" value={venue} onChange={(event) => setVenue(event.target.value)} placeholder="Venue name" required />
          <FormField label="Date" name="fixture-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
          <FormField label="Kick-off" name="fixture-kickoff" type="time" value={kickoff} onChange={(event) => setKickoff(event.target.value)} required />
          <div className="flex items-end md:col-span-2 xl:col-span-2">
            <Button type="submit" iconLeft={<Plus className="size-4" aria-hidden />}>Preview fixture</Button>
          </div>
        </form>
      </AdminPanel>

      <AdminPanel title="Fixture register" description="Fixtures currently scheduled in assigned competitions." bodyClassName="p-0">
        <Table columns={columns} rows={rows} rowKey={(row) => row.id} caption="League fixtures" />
      </AdminPanel>

      <AdminPanel
        title="Reschedule requests"
        description="Club requests to move scheduled matches."
        actions={<span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted"><CalendarClock className="size-4" aria-hidden />Preview actions only</span>}
        bodyClassName="p-0"
      >
        <Table columns={rescheduleColumns} rows={rescheduleRows} rowKey={(row) => row.id} caption="Reschedule requests" />
      </AdminPanel>
    </>
  )
}
