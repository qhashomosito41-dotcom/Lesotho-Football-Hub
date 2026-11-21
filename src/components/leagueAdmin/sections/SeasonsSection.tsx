import { useState } from 'react'
import { CalendarDays, CircleCheck, Clock3 } from 'lucide-react'
import { AdminPanel, AdminProgressBar, AdminStatusPill } from '@/components/admin'
import { Button, Table, type TableColumn } from '@/components/ui'
import { LEAGUE_SEASONS, LEAGUE_STATS } from '@/config/leagueAdmin'
import type { LeagueSectionProps } from './types'

interface SeasonRow {
  season: string
  status: string
  startDate: string
  endDate: string
}

export function SeasonsSection({ search, onAction }: LeagueSectionProps) {
  const [published, setPublished] = useState(true)
  const [notifications, setNotifications] = useState(false)

  const rows = LEAGUE_SEASONS.filter((season) => !search || season.season.toLowerCase().includes(search.toLowerCase()))

  const columns: TableColumn<SeasonRow>[] = [
    { key: 'season', header: 'Season', cell: (row) => <p className="font-semibold text-ink">{row.season}</p> },
    { key: 'scope', header: 'Scope', cell: () => <span className="text-xs text-ink-muted">{LEAGUE_STATS.assignedCompetitions} assigned competitions</span> },
    { key: 'start', header: 'Start date', cell: (row) => <span className="text-xs text-ink-muted">{row.startDate}</span> },
    { key: 'end', header: 'End date', cell: (row) => <span className="text-xs text-ink-muted">{row.endDate}</span> },
    { key: 'status', header: 'Status', cell: (row) => <AdminStatusPill status={row.status} /> },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      cell: (row) => (
        <Button variant="outline" size="sm" onClick={() => onAction(`Season ${row.season} is a frontend preview; no season was changed.`)}>
          Set current
        </Button>
      ),
    },
  ]

  return (
    <>
      <div className="grid gap-5 xl:grid-cols-3">
        <AdminPanel title="Season lifecycle" description="Current status of seasons in the assigned portfolio." className="xl:col-span-2" bodyClassName="p-0">
          <Table columns={columns} rows={rows} rowKey={(row) => row.season} caption="Competition seasons" />
        </AdminPanel>

        <AdminPanel title="Season controls" description="Publishing and notification behaviour.">
          <div className="space-y-4">
            <label className="flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-line bg-surface-muted p-3.5">
              <span className="min-w-0">
                <span className="block text-xs font-semibold text-ink">Publish fixtures automatically</span>
                <span className="caption mt-1 block">New fixtures appear on the public site after creation.</span>
              </span>
              <input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} aria-label="Publish fixtures automatically" className="mt-0.5 size-4 shrink-0 rounded border-line-strong text-primary" />
            </label>
            <label className="flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-line bg-surface-muted p-3.5">
              <span className="min-w-0">
                <span className="block text-xs font-semibold text-ink">Notify clubs on changes</span>
                <span className="caption mt-1 block">Send a preview notice when fixtures move.</span>
              </span>
              <input type="checkbox" checked={notifications} onChange={(event) => setNotifications(event.target.checked)} aria-label="Notify clubs on changes" className="mt-0.5 size-4 shrink-0 rounded border-line-strong text-primary" />
            </label>
            <Button fullWidth variant="outline" onClick={() => onAction('Season settings are a frontend preview; nothing was saved.')}>
              Save season settings
            </Button>
          </div>
        </AdminPanel>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <AdminPanel title="Milestones" description="Key dates managed by the league office.">
          <div className="space-y-3">
            {[
              { label: 'Registration window', detail: '15 Aug – 12 Sep 2026', icon: CircleCheck },
              { label: 'Fixture publication', detail: 'Matchweek 7 published', icon: CalendarDays },
              { label: 'Mid-season review', detail: 'Scheduled for January', icon: Clock3 },
              { label: 'Season close', detail: '30 May 2027', icon: CalendarDays },
            ].map((item) => {
              const Icon = item.icon

              return (
                <div key={item.label} className="flex items-center gap-3 rounded-lg border border-line bg-surface-muted px-3 py-2.5">
                  <Icon className="size-4 shrink-0 text-primary" aria-hidden />
                  <p className="text-xs font-semibold text-ink">{item.label}</p>
                  <p className="ml-auto text-xs text-ink-muted">{item.detail}</p>
                </div>
              )
            })}
          </div>
        </AdminPanel>

        <AdminPanel title="Season readiness" description="Progress across assigned competitions.">
          <div className="space-y-4">
            <AdminProgressBar label="Club registration" value={82} caption="Approvals nearly complete" tone="live" />
            <AdminProgressBar label="Player eligibility" value={74} caption="Registration checks underway" tone="primary" />
            <AdminProgressBar label="Fixture publication" value={91} caption="Matchweek 7 published" tone="accent" />
            <AdminProgressBar label="Official availability" value={68} caption="Officials confirmed for most fixtures" tone="live" />
          </div>
        </AdminPanel>
      </div>
    </>
  )
}
