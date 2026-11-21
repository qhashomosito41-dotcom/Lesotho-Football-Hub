import { useState } from 'react'
import { Download, Trophy } from 'lucide-react'
import { AdminPanel, AdminProgressBar } from '@/components/admin'
import { Button, EmptyState, LeagueTable, Select } from '@/components/ui'
import type { CompetitionId } from '@/config/league'
import { LEAGUE_STANDINGS } from '@/config/leagueAdmin'
import type { LeagueSectionProps } from './types'

export function StandingsSection({ search, onAction }: LeagueSectionProps) {
  const [competitionId, setCompetitionId] = useState(LEAGUE_STANDINGS[0]?.competitionId ?? '')
  const selected = LEAGUE_STANDINGS.find((item) => item.competitionId === competitionId) ?? LEAGUE_STANDINGS[0]
  const rows = (selected?.rows ?? []).filter((row) => !search || row.team.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <>
      <div className="grid gap-5 xl:grid-cols-3">
        <AdminPanel
          title="Competition table"
          description={selected ? `${selected.competition} · current season` : 'No assigned competition selected.'}
          className="xl:col-span-2"
          actions={
            <>
              <Select
                options={LEAGUE_STANDINGS.map((item) => ({ value: item.competitionId, label: item.competition }))}
                value={competitionId}
                onChange={(value) => setCompetitionId(value as CompetitionId)}
                ariaLabel="Select standings competition"
                size="sm"
              />
              <Button variant="outline" size="sm" iconLeft={<Download className="size-3.5" aria-hidden />} onClick={() => onAction('Standings export is a frontend preview.')}>
                Export
              </Button>
            </>
          }
        >
          {rows.length > 0 ? (
            <LeagueTable rows={rows} showGoals showForm caption={`${selected?.competition ?? ''} standings`} />
          ) : (
            <EmptyState title="No table rows" description="No verified results are available for this view." />
          )}
        </AdminPanel>

        <div className="space-y-5">
          <AdminPanel title="Qualification zones" description="Positions used for qualification and relegation.">
            <div className="space-y-3">
              {[
                { label: 'Champions zone', detail: 'Top position', className: 'border-l-live' },
                { label: 'Continental places', detail: 'Next two positions', className: 'border-l-primary' },
                { label: 'Relegation zone', detail: 'Bottom two positions', className: 'border-l-danger' },
              ].map((zone) => (
                <div key={zone.label} className={`rounded-lg border border-line border-l-[3px] bg-surface-muted px-3 py-2.5 ${zone.className}`}>
                  <p className="text-xs font-semibold text-ink">{zone.label}</p>
                  <p className="caption mt-1">{zone.detail}</p>
                </div>
              ))}
            </div>
          </AdminPanel>

          <AdminPanel title="Table health" description="Data used to calculate the standings.">
            <div className="space-y-4">
              <AdminProgressBar label="Verified results" value={88} caption="Most submitted results confirmed" tone="live" />
              <AdminProgressBar label="Club coverage" value={100} caption="All participating clubs included" tone="primary" />
              <AdminProgressBar label="Tie-break data" value={76} caption="Head-to-head records available" tone="accent" />
            </div>
          </AdminPanel>
        </div>
      </div>

      <AdminPanel title="Table publication" description="Control when this standings view is published publicly.">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-surface-muted px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Trophy className="size-5 shrink-0 text-primary" aria-hidden />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">{selected?.competition ?? 'Assigned competition'}</p>
              <p className="caption">Publishes after each verified result when automatic updates are enabled.</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => onAction('Table publication is a frontend preview; nothing was published.')}>
            Publish table preview
          </Button>
        </div>
      </AdminPanel>
    </>
  )
}
