import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { DemoNotice } from '@/components/home/DemoNotice'
import { MatchInfo, MatchLineups, MatchScoreboard, MatchStats, MatchTimeline } from '@/components/matches'
import { ButtonLink, EmptyState } from '@/components/ui'
import { ROUTES } from '@/config/app'
import { getMatch } from '@/config/matches'

export default function MatchCentrePage() {
  const { matchId } = useParams()
  const match = getMatch(matchId)

  if (!match) {
    return (
      <>
        <DemoNotice />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="rounded-xl border border-navy-700 bg-elevated">
            <EmptyState
              tone="dark"
              title="Match not found"
              description="This match is not part of the demonstration dataset."
              action={
                <ButtonLink to={ROUTES.liveScores} size="sm" variant="primary">
                  Back to live scores
                </ButtonLink>
              }
            />
          </div>
        </div>
      </>
    )
  }

  const backTo = match.status === 'upcoming' ? ROUTES.fixtures : ROUTES.liveScores
  const backLabel = match.status === 'upcoming' ? 'fixtures' : 'live scores'

  return (
    <>
      <DemoNotice />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <Link
          to={backTo}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-300 transition-colors hover:text-white"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to {backLabel}
        </Link>

        <h1 className="page-title mt-3 text-white">
          {match.home.name} <span className="text-navy-400">vs</span> {match.away.name}
        </h1>

        <div className="mt-4">
          <MatchScoreboard match={match} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <MatchTimeline match={match} />
            <MatchLineups match={match} />
          </div>
          <div className="space-y-6 lg:col-span-4">
            <MatchStats match={match} />
            <MatchInfo match={match} />
          </div>
        </div>
      </div>
    </>
  )
}
