import { MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ClubBadge } from '@/components/ui'
import type { DemoTeam } from '@/config/homepage'
import { cn } from '@/utils/cn'

interface MatchListRowProps {
  to: string
  home: DemoTeam
  away: DemoTeam
  competition: string
  venue: string
  date: string
  kickoff?: string
  homeScore?: number
  awayScore?: number
  className?: string
}

export function MatchListRow({
  to,
  home,
  away,
  competition,
  venue,
  date,
  kickoff,
  homeScore,
  awayScore,
  className,
}: MatchListRowProps) {
  const finished = homeScore !== undefined && awayScore !== undefined

  return (
    <Link
      to={to}
      className={cn(
        'grid grid-cols-[3.5rem_1fr_auto] items-center gap-3 rounded-xl border border-line bg-surface px-3 py-3 shadow-card transition-all duration-150 hover:-translate-y-0.5 hover:shadow-raised sm:px-4',
        className,
      )}
    >
      <div className="border-r border-line pr-3 text-center">
        {finished ? (
          <>
            <p className="font-display text-base font-bold tabular-nums text-ink">
              {homeScore}
              <span className="mx-0.5 text-ink-subtle">–</span>
              {awayScore}
            </p>
            <p className="caption text-[10px] font-semibold uppercase tracking-wider">FT</p>
          </>
        ) : (
          <>
            <p className="font-display text-base font-bold tabular-nums text-ink">{kickoff ?? 'TBD'}</p>
            <p className="caption text-[10px]">{date}</p>
          </>
        )}
      </div>

      <div className="min-w-0 space-y-1.5">
        <div className="flex items-center gap-2">
          <ClubBadge name={home.name} shortName={home.shortName} color={home.color} size="sm" />
          <span className="team-name truncate text-xs text-ink">{home.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <ClubBadge name={away.name} shortName={away.shortName} color={away.color} size="sm" />
          <span className="team-name truncate text-xs text-ink">{away.name}</span>
        </div>
        <p className="caption flex items-center gap-1 truncate pt-0.5 md:hidden">
          <MapPin className="size-3 shrink-0" aria-hidden />
          {competition} · {venue}
        </p>
      </div>

      <div className="hidden max-w-44 shrink-0 text-right md:block">
        <p className="eyebrow truncate text-[10px]">{competition}</p>
        <p className="caption mt-1 flex items-center justify-end gap-1 truncate">
          <MapPin className="size-3 shrink-0" aria-hidden />
          {venue}
        </p>
        {finished && <p className="caption mt-1 text-[10px]">{date}</p>}
      </div>
    </Link>
  )
}
