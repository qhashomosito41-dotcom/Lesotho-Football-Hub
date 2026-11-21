import { ArrowLeftRight, CircleDot, Flag, Goal, Timer } from 'lucide-react'
import { Card } from '@/components/ui'
import type { MatchDetail, MatchEventType } from '@/config/matches'

interface MatchTimelineProps {
  match: MatchDetail
}

function EventIcon({ type }: { type: MatchEventType }) {
  if (type === 'goal') {
    return (
      <span className="grid size-9 place-items-center rounded-full border border-green-500/30 bg-green-500/10 text-live">
        <Goal className="size-4" aria-hidden />
      </span>
    )
  }

  if (type === 'own-goal') {
    return (
      <span className="grid size-9 place-items-center rounded-full border border-orange-400/30 bg-orange-400/10 text-orange-300">
        <CircleDot className="size-4" aria-hidden />
      </span>
    )
  }

  if (type === 'penalty') {
    return (
      <span className="grid size-9 place-items-center rounded-full border border-green-500/30 bg-green-500/10 text-green-400">
        <Flag className="size-4" aria-hidden />
      </span>
    )
  }

  if (type === 'yellow-card' || type === 'red-card') {
    return (
      <span className="grid size-9 place-items-center rounded-full border border-navy-600 bg-navy-800">
        <span
          className={`size-3 rounded-sm ${type === 'yellow-card' ? 'bg-orange-400' : 'bg-danger'}`}
          aria-hidden
        />
      </span>
    )
  }

  if (type === 'substitution') {
    return (
      <span className="grid size-9 place-items-center rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300">
        <ArrowLeftRight className="size-4" aria-hidden />
      </span>
    )
  }

  return (
    <span className="grid size-9 place-items-center rounded-full border border-navy-600 bg-navy-800 text-navy-300">
      <Timer className="size-4" aria-hidden />
    </span>
  )
}

export function MatchTimeline({ match }: MatchTimelineProps) {
  const events = [...match.events].sort((first, second) => first.minute - second.minute)

  return (
    <Card variant="dark" padding="default">
      <h2 className="section-title text-white">Match timeline</h2>
      {events.length === 0 ? (
        <p className="body-muted mt-4 text-navy-300">
          No events have been recorded for this match yet.
        </p>
      ) : (
        <ol className="mt-5">
          {events.map((event, index) => (
            <li key={event.id} className="relative flex gap-4 pb-5 last:pb-0">
              <div className="relative flex w-9 shrink-0 flex-col items-center">
                <EventIcon type={event.type} />
                {index < events.length - 1 && (
                  <span className="absolute top-9 bottom-0 left-1/2 w-px -translate-x-1/2 bg-navy-700" aria-hidden />
                )}
              </div>
              <div className="min-w-0 flex-1 pt-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-display text-sm font-bold tabular-nums text-green-400">{event.minute}'</span>
                  <span className="text-sm font-semibold text-white">{event.title}</span>
                  {event.team && (
                    <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-navy-300 uppercase">
                      {event.team === 'home' ? match.home.shortName : match.away.shortName}
                    </span>
                  )}
                </div>
                {event.detail && <p className="body-muted mt-0.5 text-navy-300">{event.detail}</p>}
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  )
}
