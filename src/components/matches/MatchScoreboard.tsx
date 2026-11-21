import { CalendarDays, MapPin } from 'lucide-react'
import { ClubBadge, StatusBadge } from '@/components/ui'
import type { MatchDetail } from '@/config/matches'

interface MatchScoreboardProps {
  match: MatchDetail
}

export function MatchScoreboard({ match }: MatchScoreboardProps) {
  const isUpcoming = match.status === 'upcoming'

  return (
    <div className="overflow-hidden rounded-xl border border-navy-700 bg-elevated">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-700 px-4 py-3 sm:px-6">
        <p className="eyebrow text-navy-300">
          {match.competition} <span className="normal-case tracking-normal">· {match.round} · {match.season}</span>
        </p>
        <StatusBadge
          kind={match.status}
          label={match.status === 'live' && match.minute !== undefined ? `Live ${match.minute}'` : undefined}
        />
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-8 sm:gap-8 sm:px-6 sm:py-10">
        <div className="flex min-w-0 flex-col items-center gap-3 text-center">
          <ClubBadge
            name={match.home.name}
            shortName={match.home.shortName}
            color={match.home.color}
            size="lg"
            className="size-14 text-base sm:size-20 sm:text-xl"
          />
          <p className="team-name w-full truncate text-sm text-white sm:text-xl">{match.home.name}</p>
        </div>

        <div className="flex shrink-0 flex-col items-center gap-2">
          {isUpcoming ? (
            <p className="font-display text-3xl font-bold tabular-nums text-white">{match.kickoff ?? 'TBD'}</p>
          ) : (
            <p className="font-display text-4xl font-bold tabular-nums text-white sm:text-5xl">
              {match.homeScore ?? 0}
              <span className="mx-1 text-navy-500">–</span>
              {match.awayScore ?? 0}
            </p>
          )}
          {match.status === 'live' && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/40 bg-green-500/10 px-2.5 py-1 text-xs font-bold text-green-400">
              <span className="size-1.5 animate-live-dot rounded-full bg-live-bright" aria-hidden />
              {match.minute}'
            </span>
          )}
          {isUpcoming && <p className="caption text-navy-400">{match.date}</p>}
          {match.status === 'finished' && <p className="caption text-navy-400">Full time</p>}
        </div>

        <div className="flex min-w-0 flex-col items-center gap-3 text-center">
          <ClubBadge
            name={match.away.name}
            shortName={match.away.shortName}
            color={match.away.color}
            size="lg"
            className="size-14 text-base sm:size-20 sm:text-xl"
          />
          <p className="team-name w-full truncate text-sm text-white sm:text-xl">{match.away.name}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-navy-700 px-4 py-3 text-sm text-navy-300 sm:px-6">
        <span className="flex items-center gap-1.5">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          {match.venue}
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarDays className="size-3.5 shrink-0" aria-hidden />
          {match.date}
        </span>
      </div>
    </div>
  )
}
