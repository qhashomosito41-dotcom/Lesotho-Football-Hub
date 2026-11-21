import { Activity, CircleDot, Flag, Radio, Timer } from 'lucide-react'
import { AdminPanel, AdminStatusPill } from '@/components/admin'
import { Button, StatisticCard, Table, type TableColumn } from '@/components/ui'
import { LIVE_MATCHES, type DemoLiveMatch } from '@/config/homepage'
import type { AdminSectionProps } from './types'

export function MatchManagementSection({ search, onAction }: AdminSectionProps) {
  const rows = LIVE_MATCHES.filter(
    (match) =>
      !search ||
      match.home.name.toLowerCase().includes(search.toLowerCase()) ||
      match.away.name.toLowerCase().includes(search.toLowerCase()) ||
      match.competition.toLowerCase().includes(search.toLowerCase()),
  )

  const columns: TableColumn<DemoLiveMatch>[] = [
    {
      key: 'match',
      header: 'Match',
      cell: (row) => <p className="font-semibold text-ink">{row.home.name} <span className="text-ink-muted">vs</span> {row.away.name}</p>,
    },
    { key: 'competition', header: 'Competition', cell: (row) => <span className="text-xs text-ink-muted">{row.competition}</span> },
    { key: 'score', header: 'Score', cell: (row) => <span className="score-display text-xl">{row.homeScore}–{row.awayScore}</span> },
    { key: 'minute', header: 'Clock', cell: (row) => <AdminStatusPill status="Live" label={`${row.minute}'`} /> },
    { key: 'venue', header: 'Venue', cell: (row) => <span className="text-xs text-ink-muted">{row.venue}</span> },
    { key: 'events', header: 'Events', cell: (row) => <span className="text-xs font-semibold text-ink">{row.events.length}</span> },
    {
      key: 'actions',
      header: 'Match controls',
      align: 'right',
      cell: (row) => (
        <div className="flex justify-end gap-1.5">
          <Button variant="outline" size="sm" iconLeft={<Timer className="size-3.5" aria-hidden />} onClick={() => onAction(`Clock control for ${row.home.shortName} vs ${row.away.shortName} is a frontend preview.`)}>
            Clock
          </Button>
          <Button variant="ghost" size="sm" iconLeft={<CircleDot className="size-3.5" aria-hidden />} onClick={() => onAction(`Match event entry for ${row.id} is a frontend preview.`)}>
            Event
          </Button>
          <Button variant="ghost" size="sm" iconLeft={<Flag className="size-3.5" aria-hidden />} onClick={() => onAction(`Ending ${row.id} is a frontend preview.`)}>
            End
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatisticCard label="Live matches" value={LIVE_MATCHES.length} icon={<Radio className="size-5" aria-hidden />} />
        <StatisticCard label="Total events" value={LIVE_MATCHES.reduce((total, match) => total + match.events.length, 0)} icon={<Activity className="size-5" aria-hidden />} />
        <StatisticCard label="Competitions live" value={new Set(LIVE_MATCHES.map((match) => match.competition)).size} icon={<Activity className="size-5" aria-hidden />} />
        <StatisticCard label="Venues in use" value={new Set(LIVE_MATCHES.map((match) => match.venue)).size} icon={<Activity className="size-5" aria-hidden />} />
      </div>

      <AdminPanel title="Live match control room" description="Monitor active matches and preview match-day controls." bodyClassName="p-0">
        <Table columns={columns} rows={rows} rowKey={(row) => row.id} caption="Live match controls" compact />
      </AdminPanel>
    </>
  )
}
