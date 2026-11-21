import { Radio } from 'lucide-react'
import { ButtonLink, EmptyState, MatchCard } from '@/components/ui'
import { LIVE_MATCHES, matchCentrePath } from '@/config/homepage'
import { ROUTES } from '@/config/app'
import { useLiveStatus } from '@/hooks'
import { SectionHeading } from './SectionHeading'

interface LiveMatchesSectionProps {
  className?: string
}

export function LiveMatchesSection({ className }: LiveMatchesSectionProps) {
  const { liveCount, hasLiveMatches } = useLiveStatus()

  return (
    <section className={className} aria-label="Live matches">
      <SectionHeading
        title="Live matches"
        description="Scores update as match events are recorded."
        to={ROUTES.liveScores}
        linkLabel="All live scores"
        badge={
          hasLiveMatches ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/40 bg-green-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-green-400 uppercase">
              <span className="size-1.5 animate-live-dot rounded-full bg-live-bright" aria-hidden />
              {liveCount} live
            </span>
          ) : undefined
        }
      />

      {hasLiveMatches ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {LIVE_MATCHES.map((match) => (
            <MatchCard
              key={match.id}
              home={match.home}
              away={match.away}
              status="live"
              homeScore={match.homeScore}
              awayScore={match.awayScore}
              minute={match.minute}
              competition={{ name: match.competition, round: match.round }}
              venue={match.venue}
              events={match.events.map((event) => ({
                minute: event.minute,
                label: `${event.player} · ${event.side === 'home' ? match.home.shortName : match.away.shortName}`,
              }))}
              action={
                <ButtonLink to={matchCentrePath(match.id)} size="sm" variant="primary">
                  View Match
                </ButtonLink>
              }
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-navy-700 bg-elevated">
          <EmptyState
            tone="dark"
            icon={<Radio className="size-6" aria-hidden />}
            title="No matches are live right now"
            description="Check today's fixtures or browse the latest results below."
            action={
              <ButtonLink to={ROUTES.fixtures} size="sm" variant="primary">
                View fixtures
              </ButtonLink>
            }
          />
        </div>
      )}
    </section>
  )
}
