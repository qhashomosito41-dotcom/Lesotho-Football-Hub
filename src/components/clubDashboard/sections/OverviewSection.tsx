import { ArrowRight, CalendarDays, CheckCircle2, Trophy, Users, UserCheck, ArrowLeftRight, ShieldCheck } from 'lucide-react'
import { AdminPanel, AdminProgressBar, AdminStatusPill } from '@/components/admin'
import { Button, ClubBadge, StatisticCard } from '@/components/ui'
import { CLUB_FIXTURES, CLUB_PROFILE, CLUB_RESULTS, CLUB_STATS, opponentFor, type ClubSectionId } from '@/config/clubDashboard'

interface OverviewSectionProps {
  onAction: (message: string) => void
  onNavigate: (section: ClubSectionId) => void
}

export function OverviewSection({ onAction, onNavigate }: OverviewSectionProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatisticCard label="Registered squad" value={CLUB_STATS.squadPlayers} icon={<Users className="size-5" aria-hidden />} trend={{ value: `${CLUB_STATS.availablePlayers} available`, direction: 'neutral' }} />
        <StatisticCard label="Upcoming matches" value={CLUB_STATS.upcomingMatches} icon={<CalendarDays className="size-5" aria-hidden />} trend={{ value: 'Scheduled', direction: 'neutral' }} />
        <StatisticCard label="Recent results" value={CLUB_STATS.recentResults} icon={<Trophy className="size-5" aria-hidden />} trend={{ value: 'This season', direction: 'neutral' }} />
        <StatisticCard label="Pending player registrations" value={CLUB_STATS.pendingRegistrations} icon={<UserCheck className="size-5" aria-hidden />} trend={{ value: 'Awaiting league review', direction: 'up' }} />
        <StatisticCard label="Transfer requests" value={CLUB_STATS.transferRequests} icon={<ArrowLeftRight className="size-5" aria-hidden />} trend={{ value: 'Open requests', direction: 'up' }} />
        <StatisticCard label="Matchday preparation status" value={`${CLUB_STATS.matchdayReadiness}%`} icon={<CheckCircle2 className="size-5" aria-hidden />} trend={{ value: 'Squad submitted', direction: 'up' }} />
        <StatisticCard label="Authorised clubs" value={CLUB_STATS.authorisedClubs} icon={<ShieldCheck className="size-5" aria-hidden />} trend={{ value: 'Scoped access', direction: 'neutral' }} />
        <StatisticCard label="Club staff" value={4} icon={<Users className="size-5" aria-hidden />} trend={{ value: '3 active', direction: 'neutral' }} />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <AdminPanel title="Club information" description="Your authorised club record." className="xl:col-span-2">
          <div className="flex flex-wrap items-start gap-4">
            <ClubBadge name={CLUB_PROFILE.name} shortName={CLUB_PROFILE.shortName} color={CLUB_PROFILE.color} size="lg" />
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-2xl font-bold text-ink">{CLUB_PROFILE.name}</h2>
              <p className="body-muted mt-1">{CLUB_PROFILE.competition} · Established {CLUB_PROFILE.established}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  { label: 'District', value: CLUB_PROFILE.district },
                  { label: 'Stadium', value: CLUB_PROFILE.stadium },
                  { label: 'Head coach', value: CLUB_PROFILE.coach },
                  { label: 'Club colours', value: CLUB_PROFILE.colors },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg border border-line bg-surface-muted px-3 py-2.5">
                    <p className="caption uppercase">{item.label}</p>
                    <p className="mt-1 truncate text-xs font-semibold text-ink">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => onNavigate('profile')}>View club profile</Button>
            <Button variant="ghost" size="sm" onClick={() => onAction('Club information is a frontend preview.')}>Share club details</Button>
          </div>
        </AdminPanel>

        <AdminPanel title="Matchday preparation status" description="Readiness for the next fixture.">
          <div className="space-y-4">
            <AdminProgressBar label="Starting XI" value={100} caption="Eleven players selected" tone="live" />
            <AdminProgressBar label="Substitutes" value={86} caption="Seven of seven named" tone="primary" />
            <AdminProgressBar label="Player availability" value={78} caption="Injury updates confirmed" tone="accent" />
            <AdminProgressBar label="Report submission" value={45} caption="Pre-match notes pending" tone="live" />
          </div>
          <Button variant="outline" fullWidth className="mt-5" iconRight={<ArrowRight className="size-4" aria-hidden />} onClick={() => onNavigate('matchday-squad')}>
            Open matchday squad
          </Button>
        </AdminPanel>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <AdminPanel
          title="Upcoming matches"
          description="Next fixtures for your club."
          actions={<Button variant="ghost" size="sm" onClick={() => onNavigate('fixtures')}>All fixtures</Button>}
          bodyClassName="p-0"
        >
          <div className="divide-y divide-line">
            {CLUB_FIXTURES.slice(0, 4).map((fixture) => (
              <div key={fixture.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{opponentFor(fixture)}</p>
                  <p className="caption mt-1">{fixture.dateISO} · {fixture.kickoff} · {fixture.round}</p>
                </div>
                <AdminStatusPill status="Scheduled" />
              </div>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel
          title="Recent results"
          description="Latest completed matches."
          actions={<Button variant="ghost" size="sm" onClick={() => onNavigate('match-centre')}>Match centre</Button>}
          bodyClassName="p-0"
        >
          <div className="divide-y divide-line">
            {CLUB_RESULTS.slice(0, 4).map((result) => {
              const clubScore = result.home.id === CLUB_PROFILE.id ? result.homeGoals : result.awayGoals
              const opponentScore = result.home.id === CLUB_PROFILE.id ? result.awayGoals : result.homeGoals
              const outcome = clubScore > opponentScore ? 'W' : clubScore === opponentScore ? 'D' : 'L'

              return (
                <div key={result.id} className="flex items-center justify-between gap-3 px-5 py-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{opponentFor({ ...result, kickoff: '15:00' } as typeof CLUB_FIXTURES[number])}</p>
                    <p className="caption mt-1">{result.dateISO} · {result.round}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-lg font-bold text-ink">{clubScore}–{opponentScore}</span>
                    <span className="grid size-7 place-items-center rounded-full bg-primary-soft text-xs font-bold text-primary">{outcome}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </AdminPanel>
      </div>
    </>
  )
}
