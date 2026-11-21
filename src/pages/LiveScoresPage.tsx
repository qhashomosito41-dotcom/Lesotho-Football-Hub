import { useState } from 'react'
import { DemoNotice } from '@/components/home/DemoNotice'
import { Button, ButtonLink, EmptyState, MatchCard, type MatchCardEvent } from '@/components/ui'
import { matchCentrePath } from '@/config/homepage'
import { ALL_MATCHES, type MatchDetail } from '@/config/matches'
import type { MatchStatus as Status } from '@/types'
import { cn } from '@/utils/cn'

type StatusFilter = 'all' | Status

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'live', label: 'Live' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'finished', label: 'Finished' },
  { value: 'all', label: 'All matches' },
]

const STATUS_ORDER: Record<Status, number> = {
  live: 0,
  upcoming: 1,
  finished: 2,
  postponed: 3,
  cancelled: 4,
}

const COMPETITIONS = Array.from(new Set(ALL_MATCHES.map((match) => match.competition)))

function cardEvents(match: MatchDetail): MatchCardEvent[] {
  return match.events
    .filter((event) => event.type !== 'half-time' && event.type !== 'full-time')
    .map((event) => ({
      minute: event.minute,
      label: `${event.title}${event.detail ? ` · ${event.detail}` : ''}`,
      kind:
        event.type === 'yellow-card'
          ? 'yellow-card'
          : event.type === 'red-card'
            ? 'red-card'
            : 'goal',
    }))
}

function pillClasses(active: boolean): string {
  return cn(
    'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-150',
    active
      ? 'border-green-500/50 bg-green-500/15 text-green-300'
      : 'border-navy-700 bg-elevated text-navy-300 hover:border-navy-500 hover:text-white',
  )
}

export default function LiveScoresPage() {
  const [status, setStatus] = useState<StatusFilter>('live')
  const [competition, setCompetition] = useState('all')

  const countFor = (filter: StatusFilter) =>
    filter === 'all'
      ? ALL_MATCHES.length
      : ALL_MATCHES.filter((match) => match.status === filter).length

  const matches = ALL_MATCHES.filter(
    (match) =>
      (status === 'all' || match.status === status) &&
      (competition === 'all' || match.competition === competition),
  ).sort(
    (first, second) =>
      STATUS_ORDER[first.status] - STATUS_ORDER[second.status] ||
      (second.minute ?? 0) - (first.minute ?? 0) ||
      (first.kickoff ?? '').localeCompare(second.kickoff ?? ''),
  )

  return (
    <>
      <DemoNotice />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <p className="eyebrow text-green-400">Match centre</p>
        <h1 className="page-title mt-2 text-white">Live Scores</h1>
        <p className="body-muted mt-3 max-w-2xl text-navy-200">
          Follow scores, match minutes and recorded events from every competition in Lesotho.
        </p>

        <div className="mt-7 flex flex-wrap gap-2" role="group" aria-label="Filter by match status">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              aria-pressed={status === filter.value}
              onClick={() => setStatus(filter.value)}
              className={pillClasses(status === filter.value)}
            >
              {filter.label} <span className="ml-1 tabular-nums opacity-70">{countFor(filter.value)}</span>
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter by competition">
          <button
            type="button"
            aria-pressed={competition === 'all'}
            onClick={() => setCompetition('all')}
            className={pillClasses(competition === 'all')}
          >
            All competitions
          </button>
          {COMPETITIONS.map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={competition === name}
              onClick={() => setCompetition(name)}
              className={pillClasses(competition === name)}
            >
              {name}
            </button>
          ))}
        </div>

        {matches.length > 0 ? (
          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {matches.map((match) => (
              <MatchCard
                key={match.id}
                home={match.home}
                away={match.away}
                status={match.status}
                homeScore={match.homeScore}
                awayScore={match.awayScore}
                minute={match.minute}
                kickoff={match.kickoff}
                date={match.date}
                competition={{ name: match.competition, round: match.round }}
                venue={match.venue}
                events={cardEvents(match)}
                action={
                  <ButtonLink to={matchCentrePath(match.id)} size="sm" variant="primary">
                    View Match
                  </ButtonLink>
                }
              />
            ))}
          </div>
        ) : (
          <div className="mt-7 rounded-xl border border-navy-700 bg-elevated">
            <EmptyState
              tone="dark"
              title="No matches found"
              description="Try a different competition or match status."
              action={
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    setStatus('all')
                    setCompetition('all')
                  }}
                >
                  Show all matches
                </Button>
              }
            />
          </div>
        )}
      </div>
    </>
  )
}
