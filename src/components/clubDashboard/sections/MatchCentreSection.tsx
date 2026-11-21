import { useState } from 'react'
import { Activity, ClipboardCheck, Flag, Whistle } from 'lucide-react'
import { AdminPanel, AdminProgressBar, AdminStatusPill } from '@/components/admin'
import { Button, Select, Tabs, type TabItem } from '@/components/ui'
import { CLUB_FIXTURES, CLUB_RESULTS, opponentFor } from '@/config/clubDashboard'
import type { ClubSectionProps } from './types'

type MatchTab = 'lineups' | 'events' | 'report'

const tabs: TabItem<MatchTab>[] = [
  { id: 'lineups', label: 'Line-ups' },
  { id: 'events', label: 'Events' },
  { id: 'report', label: 'Report' },
]

const events = [
  { minute: '12’', type: 'Goal', detail: 'Opening goal scored from close range.', icon: Flag },
  { minute: '34’', type: 'Yellow card', detail: 'Tactical foul in midfield.', icon: Whistle },
  { minute: '58’', type: 'Substitution', detail: 'Fresh legs introduced up front.', icon: Activity },
  { minute: '76’', type: 'Goal', detail: 'Equaliser from a corner routine.', icon: Flag },
  { minute: '90+2’', type: 'Yellow card', detail: 'Late challenge near the touchline.', icon: Whistle },
]

export function MatchCentreSection({ search, onAction }: ClubSectionProps) {
  const [fixtureId, setFixtureId] = useState(CLUB_FIXTURES[0]?.id ?? '')
  const [tab, setTab] = useState<MatchTab>('lineups')
  const fixture = CLUB_FIXTURES.find((item) => item.id === fixtureId) ?? CLUB_FIXTURES[0]
  const latestResult = CLUB_RESULTS[0]
  const visibleEvents = events.filter((event) => !search || event.type.toLowerCase().includes(search.toLowerCase()) || event.detail.toLowerCase().includes(search.toLowerCase()))

  return (
    <>
      <AdminPanel title="Match selector" description="Choose a fixture to review its match centre.">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="mb-1.5 text-xs font-semibold text-ink">Fixture</p>
            <Select
              options={CLUB_FIXTURES.map((item) => ({ value: item.id, label: `${item.dateISO} · ${opponentFor(item)}` }))}
              value={fixtureId}
              onChange={setFixtureId}
              ariaLabel="Select club match"
            />
          </div>
          <div className="rounded-lg border border-line bg-surface-muted px-3 py-2.5">
            <p className="caption uppercase">Selected match</p>
            <p className="mt-1 truncate text-xs font-semibold text-ink">{fixture ? opponentFor(fixture) : 'No fixture'}</p>
          </div>
          <div className="rounded-lg border border-line bg-surface-muted px-3 py-2.5">
            <p className="caption uppercase">Venue</p>
            <p className="mt-1 truncate text-xs font-semibold text-ink">{fixture?.venue ?? '—'}</p>
          </div>
        </div>
      </AdminPanel>

      <AdminPanel title="Match operations" description="Line-ups, events and reporting for the selected match." bodyClassName="p-0">
        <div className="p-4 pb-0">
          <Tabs items={tabs} value={tab} onChange={setTab} ariaLabel="Match centre sections" />
        </div>
        <div className="p-5">
          {tab === 'lineups' && (
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-lg border border-line bg-surface-muted p-4">
                <p className="text-xs font-bold text-ink uppercase">Your club</p>
                <div className="mt-3 space-y-2">
                  {['1. Goalkeeper', '4. Right back', '5. Centre back', '6. Centre back', '3. Left back', '8. Midfield', '10. Midfield', '11. Wing', '9. Striker'].map((item) => (
                    <div key={item} className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2">
                      <Activity className="size-3.5 text-primary" aria-hidden />
                      <span className="text-xs font-semibold text-ink">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-line bg-surface-muted p-4">
                <p className="text-xs font-bold text-ink uppercase">Match officials</p>
                <div className="mt-3 space-y-2">
                  {['Referee · Teboho Khalo', 'Assistant 1 · Matšepo Ralebeka', 'Assistant 2 · Thabo Letsie', 'Commissioner · Palesa Mokhosi'].map((item) => (
                    <div key={item} className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2">
                      <Whistle className="size-3.5 text-primary" aria-hidden />
                      <span className="text-xs font-semibold text-ink">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {tab === 'events' && (
            <div className="space-y-2">
              {visibleEvents.map((event) => {
                const Icon = event.icon

                return (
                  <div key={event.minute} className="flex flex-wrap items-center gap-3 rounded-lg border border-line bg-surface-muted px-3 py-2.5">
                    <span className="grid size-8 place-items-center rounded-full bg-primary-soft text-[10px] font-bold text-primary">{event.minute}</span>
                    <Icon className="size-4 text-primary" aria-hidden />
                    <p className="text-xs font-semibold text-ink">{event.type}</p>
                    <p className="text-xs text-ink-muted">{event.detail}</p>
                  </div>
                )
              })}
            </div>
          )}
          {tab === 'report' && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-line bg-surface-muted p-4">
                <p className="text-xs font-bold text-ink uppercase">Report checklist</p>
                <div className="mt-3 space-y-3">
                  <AdminProgressBar label="Line-up confirmation" value={100} caption=" starters and substitutes confirmed" tone="live" />
                  <AdminProgressBar label="Incident log" value={72} caption="Goals and cards captured" tone="primary" />
                  <AdminProgressBar label="Commissioner sign-off" value={45} caption="Awaiting final confirmation" tone="accent" />
                </div>
              </div>
              <div className="rounded-lg border border-line bg-surface-muted p-4">
                <p className="text-xs font-bold text-ink uppercase">Actions</p>
                <div className="mt-3 space-y-3">
                  <Button variant="outline" fullWidth iconLeft={<ClipboardCheck className="size-4" aria-hidden />} onClick={() => onAction('Match report submission is a frontend preview.')}>
                    Submit match report
                  </Button>
                  <Button variant="ghost" fullWidth onClick={() => onAction('Result confirmation is a frontend preview.')}>
                    Confirm result
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminPanel>

      <div className="grid gap-5 xl:grid-cols-2">
        <AdminPanel title="Latest result" description="Most recent completed match for your club.">
          {latestResult && (
            <div className="rounded-lg border border-line bg-surface-muted p-4">
              <p className="font-display text-xl font-bold text-ink">{opponentFor({ ...latestResult, kickoff: '15:00' } as typeof CLUB_FIXTURES[number])}</p>
              <p className="caption mt-1">{latestResult.dateISO} · {latestResult.round}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-ink-muted">Final score</span>
                <span className="font-display text-2xl font-bold text-ink">
                  {latestResult.home.id === 'matlama' ? latestResult.homeGoals : latestResult.awayGoals}–{latestResult.home.id === 'matlama' ? latestResult.awayGoals : latestResult.homeGoals}
                </span>
              </div>
              <div className="mt-3">
                <AdminStatusPill status="Verified" />
              </div>
            </div>
          )}
        </AdminPanel>

        <AdminPanel title="Matchday tasks" description="Remaining work before kick-off.">
          <div className="space-y-3">
            {['Confirm travelling squad', 'Submit starting XI', 'Check kit and equipment', 'Update injury notes', 'Submit pre-match report'].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-lg border border-line bg-surface-muted px-3 py-2.5">
                <ClipboardCheck className="size-4 shrink-0 text-primary" aria-hidden />
                <span className="text-xs font-semibold text-ink">{item}</span>
              </div>
            ))}
          </div>
        </AdminPanel>
      </div>
    </>
  )
}
