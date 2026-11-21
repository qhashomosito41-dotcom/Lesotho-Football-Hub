import {
  Activity,
  Circle,
  CornerDownLeft,
  Crosshair,
  Flag,
  Goal,
  HeartPulse,
  PauseCircle,
  Repeat2,
  Square,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { AdminPanel, AdminStatusPill } from '@/components/admin'
import { EmptyState } from '@/components/ui'
import { formatMinute, teamNameForSide, timelineLabel, type LiveEventType } from '@/config/liveMatch'
import type { LiveMatchSectionProps } from './types'

const eventIcons: Record<LiveEventType, LucideIcon> = {
  goal: Goal,
  'own-goal': CornerDownLeft,
  penalty: Crosshair,
  'yellow-card': Circle,
  'red-card': Square,
  substitution: Repeat2,
  'half-time': PauseCircle,
  'full-time': Flag,
  assist: Sparkles,
  'penalty-awarded': Crosshair,
  'penalty-scored': Crosshair,
  'penalty-missed': Crosshair,
  injury: HeartPulse,
  start: Flag,
  'second-half': Activity,
  'extra-time': Activity,
  shootout: Crosshair,
  correction: Activity,
}

export function TimelineSection({ events, search, onNavigate }: LiveMatchSectionProps) {
  const query = search.trim().toLowerCase()
  const visibleEvents = [...events]
    .sort((first, second) => first.minute - second.minute || (first.additionalTime ?? 0) - (second.additionalTime ?? 0))
    .filter((event) => {
      if (!query) return true
      const haystack = `${timelineLabel(event.type)} ${event.label} ${event.detail ?? ''} ${event.side ? teamNameForSide(event.side) : ''}`.toLowerCase()
      return haystack.includes(query)
    })

  return (
    <>
      <AdminPanel title="Live event timeline" description="All match events in chronological order.">
        {visibleEvents.length === 0 ? (
          <EmptyState title="No matching events" description="Try a different search or record a new match event." />
        ) : (
          <ol className="space-y-3">
            {visibleEvents.map((event) => {
              const Icon = eventIcons[event.type] ?? Activity

              return (
                <li key={event.id} className="flex gap-3 rounded-xl border border-line bg-surface-muted p-4">
                  <div className="flex w-12 shrink-0 flex-col items-center">
                    <span className="font-display text-lg font-bold tabular-nums text-ink">{formatMinute(event.minute, event.additionalTime)}</span>
                    <span className="mt-2 grid size-8 place-items-center rounded-full bg-primary-soft text-primary">
                      <Icon className="size-4" aria-hidden />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-bold text-ink">{event.label}</p>
                      <AdminStatusPill status={event.origin === 'live' ? 'Live' : 'Confirmed'} />
                    </div>
                    <p className="caption mt-1">{timelineLabel(event.type)}{event.side ? ` · ${teamNameForSide(event.side)}` : ''}</p>
                    {event.detail && <p className="body-muted mt-2">{event.detail}</p>}
                  </div>
                </li>
              )
            })}
          </ol>
        )}
      </AdminPanel>

      <div className="grid gap-5 xl:grid-cols-3">
        <AdminPanel title="Timeline summary" description="Recorded event breakdown.">
          <div className="space-y-3">
            {[
              { label: 'Total events', value: events.length },
              { label: 'Published events', value: events.filter((event) => event.origin === 'published').length },
              { label: 'Live entries', value: events.filter((event) => event.origin === 'live').length },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface-muted px-3 py-2.5">
                <span className="text-xs font-semibold text-ink">{item.label}</span>
                <span className="font-display text-lg font-bold text-ink">{item.value}</span>
              </div>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel title="Chronology rule" description="How events are ordered.">
          <p className="body-muted">Events are sorted by match minute and additional time. Newly recorded entries are added to this live timeline immediately.</p>
        </AdminPanel>

        <AdminPanel title="Add an event" description="Open the relevant entry form.">
          <div className="grid gap-2">
            <button type="button" onClick={() => onNavigate('events')} className="rounded-lg border border-line bg-surface-muted px-3 py-2.5 text-left text-xs font-semibold text-ink hover:border-primary">
              Open event controls
            </button>
            <button type="button" onClick={() => onNavigate('goal')} className="rounded-lg border border-line bg-surface-muted px-3 py-2.5 text-left text-xs font-semibold text-ink hover:border-primary">
              Open goal entry
            </button>
            <button type="button" onClick={() => onNavigate('substitution')} className="rounded-lg border border-line bg-surface-muted px-3 py-2.5 text-left text-xs font-semibold text-ink hover:border-primary">
              Open substitution entry
            </button>
          </div>
        </AdminPanel>
      </div>
    </>
  )
}
