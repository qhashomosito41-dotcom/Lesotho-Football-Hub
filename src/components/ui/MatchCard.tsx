import { Goal, MapPin } from 'lucide-react'
import type { KeyboardEvent, ReactNode } from 'react'
import type { MatchStatus } from '@/types'
import { cn } from '@/utils/cn'
import { ClubBadge } from './ClubBadge'
import { StatusBadge } from './StatusBadge'

export interface MatchCardTeam {
  id: string
  name: string
  shortName?: string
  logoUrl?: string | null
  color?: string
}

export interface MatchCardEvent {
  minute: number
  label: string
  kind?: 'goal' | 'yellow-card' | 'red-card'
}

interface MatchCardProps {
  home: MatchCardTeam
  away: MatchCardTeam
  status: MatchStatus
  homeScore?: number
  awayScore?: number
  minute?: number
  kickoff?: string
  date?: string
  competition?: { name: string; round?: string }
  venue?: string
  events?: MatchCardEvent[]
  action?: ReactNode
  variant?: 'default' | 'compact'
  onClick?: () => void
  className?: string
}

export function MatchCard({
  home,
  away,
  status,
  homeScore,
  awayScore,
  minute,
  kickoff,
  date,
  competition,
  venue,
  events,
  action,
  variant = 'default',
  onClick,
  className,
}: MatchCardProps) {
  const interactive = Boolean(onClick)

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!onClick) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick()
    }
  }

  const wrapperClasses = cn(
    'overflow-hidden rounded-xl border border-line bg-surface shadow-card transition-all duration-150',
    interactive && 'cursor-pointer hover:-translate-y-0.5 hover:shadow-raised',
    className,
  )

  if (variant === 'compact') {
    return (
      <div
        className={cn(wrapperClasses, 'flex items-center gap-3 px-4 py-3')}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <ClubBadge name={home.name} shortName={home.shortName} logoUrl={home.logoUrl} color={home.color} size="sm" />
          <span className="team-name truncate text-xs text-ink">{home.name}</span>
        </div>

        <div className="flex shrink-0 flex-col items-center">
          {status === 'upcoming' ? (
            <span className="font-display text-lg font-semibold tabular-nums text-ink">{kickoff ?? 'TBD'}</span>
          ) : (
            <span className="font-display text-lg font-bold tabular-nums text-ink">
              {homeScore ?? 0} <span className="text-ink-subtle">–</span> {awayScore ?? 0}
            </span>
          )}
          {status === 'live' && <span className="text-[10px] font-bold text-live tabular-nums">{minute ?? 0}'</span>}
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
          <span className="team-name truncate text-right text-xs text-ink">{away.name}</span>
          <ClubBadge name={away.name} shortName={away.shortName} logoUrl={away.logoUrl} color={away.color} size="sm" />
        </div>
      </div>
    )
  }

  return (
    <article
      className={wrapperClasses}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
        <p className="eyebrow truncate">
          {competition?.name}
          {competition?.round && <span className="normal-case tracking-normal"> · {competition.round}</span>}
        </p>
        <StatusBadge kind={status} />
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-5 sm:gap-6">
        <div className="flex min-w-0 flex-col items-center gap-2.5 text-center">
          <ClubBadge name={home.name} shortName={home.shortName} logoUrl={home.logoUrl} color={home.color} size="lg" />
          <span className="team-name w-full truncate text-sm sm:text-base">{home.name}</span>
        </div>

        <div className="flex min-w-20 flex-col items-center gap-1.5 sm:min-w-28">
          {status === 'upcoming' || status === 'postponed' || status === 'cancelled' ? (
            <>
              <span className="font-display text-2xl font-semibold tabular-nums text-ink sm:text-3xl">
                {kickoff ?? 'TBD'}
              </span>
              {date && <span className="caption whitespace-nowrap">{date}</span>}
            </>
          ) : (
            <>
              <span className="score-display text-2xl sm:text-4xl">
                {homeScore ?? 0} <span className="mx-0.5 text-ink-subtle">–</span> {awayScore ?? 0}
              </span>
              {status === 'live' ? (
                <span className="text-xs font-bold text-live tabular-nums">{minute ?? 0}'</span>
              ) : (
                <span className="caption">{date ?? 'Full time'}</span>
              )}
            </>
          )}
        </div>

        <div className="flex min-w-0 flex-col items-center gap-2.5 text-center">
          <ClubBadge name={away.name} shortName={away.shortName} logoUrl={away.logoUrl} color={away.color} size="lg" />
          <span className="team-name w-full truncate text-sm sm:text-base">{away.name}</span>
        </div>
      </div>

      {events && events.length > 0 && (
        <ul className="space-y-1.5 border-t border-line px-4 py-3">
          {events.map((event, index) => (
            <li key={`${event.minute}-${index}`} className="flex items-center gap-2.5 text-xs">
              <span className="w-8 shrink-0 text-right font-semibold tabular-nums text-ink-muted">{event.minute}'</span>
              {event.kind === 'yellow-card' ? (
                <span className="size-2.5 shrink-0 rounded-sm bg-orange-400" aria-hidden />
              ) : event.kind === 'red-card' ? (
                <span className="size-2.5 shrink-0 rounded-sm bg-danger" aria-hidden />
              ) : (
                <Goal className="size-3.5 shrink-0 text-live" aria-hidden />
              )}
              <span className="truncate text-ink">{event.label}</span>
            </li>
          ))}
        </ul>
      )}

      {(venue || date || action) && (
        <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-2.5">
          <span className="caption flex min-w-0 items-center gap-1.5 truncate">
            {venue ? (
              <>
                <MapPin className="size-3 shrink-0" aria-hidden />
                {venue}
              </>
            ) : (
              date
            )}
          </span>
          <div className="flex shrink-0 items-center gap-3">
            {venue && date && status !== 'upcoming' && (
              <span className="caption hidden whitespace-nowrap sm:inline">{date}</span>
            )}
            {action}
          </div>
        </div>
      )}
    </article>
  )
}
