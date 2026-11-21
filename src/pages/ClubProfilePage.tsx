import { Link, useParams } from 'react-router-dom'
import { DemoNotice } from '@/components/home/DemoNotice'
import { MatchListRow } from '@/components/home/MatchListRow'
import { PlayerRow, ProfileHeader, ProfileSection, ProfileStatGrid } from '@/components/profile'
import { ClubBadge, EmptyState } from '@/components/ui'
import { clubPath, matchCentrePath } from '@/config/homepage'
import {
  clubStatistics,
  getClub,
  recentResultsFor,
  upcomingFixturesFor,
} from '@/config/clubs'
import { competitionName, formatDateLabel, formatDateShort } from '@/config/league'
import { squadByPosition } from '@/config/players'
import { POSITION_GROUPS } from '@/config/players'
import { ROUTES } from '@/config/app'

export default function ClubProfilePage() {
  const { clubId } = useParams()
  const club = getClub(clubId)

  if (!club) {
    return (
      <>
        <DemoNotice />
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <h1 className="page-title text-white">Club not found</h1>
          <div className="mt-6 rounded-xl border border-navy-700 bg-elevated">
            <EmptyState
              tone="dark"
              title="No club with that ID"
              description="Return to the club directory to browse available clubs."
            />
          </div>
        </div>
      </>
    )
  }

  const stats = clubStatistics(club.id)
  const squad = squadByPosition(club.id)
  const results = recentResultsFor(club.id)
  const fixtures = upcomingFixturesFor(club.id)

  const info = [
    { label: 'Year established', value: String(club.established) },
    { label: 'District', value: club.district },
    { label: 'Home stadium', value: club.stadium },
    { label: 'Club colours', value: club.colors },
    { label: 'Head coach', value: club.coach },
    { label: 'Current competition', value: club.competition },
  ]

  return (
    <>
      <DemoNotice />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <h1 className="sr-only">{club.name}</h1>
        <ProfileHeader
          avatar={
            <ClubBadge name={club.name} shortName={club.shortName} color={club.color} size="lg" />
          }
          eyebrow="Club profile"
          title={club.name}
          subtitle={`${club.competition} · ${club.district}`}
          meta={[
            { label: 'Founded', value: String(club.established) },
            { label: 'Stadium', value: club.stadium },
            { label: 'Coach', value: club.coach },
          ]}
          backTo={ROUTES.clubs}
          backLabel="All clubs"
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="min-w-0 space-y-6 lg:col-span-2">
            <ProfileSection title="Club information" description="Public club details used across the hub.">
              <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                {info.map((item) => (
                  <div key={item.label} className="border-b border-line pb-3 last:border-0">
                    <dt className="eyebrow">{item.label}</dt>
                    <dd className="mt-1 text-sm font-semibold text-ink">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </ProfileSection>

            <ProfileSection title="Club statistics" description={`Season 2025/26 · ${club.competition}`}>
              <ProfileStatGrid
                columns={5}
                stats={[
                  { label: 'Position', value: stats.position ?? '—' },
                  { label: 'Played', value: stats.played },
                  { label: 'Won', value: stats.won },
                  { label: 'Drawn', value: stats.drawn },
                  { label: 'Lost', value: stats.lost },
                  { label: 'Goals for', value: stats.goalsFor },
                  { label: 'Goals against', value: stats.goalsAgainst },
                  { label: 'Goal difference', value: stats.goalDifference > 0 ? `+${stats.goalDifference}` : stats.goalDifference },
                  { label: 'Points', value: stats.points },
                  { label: 'Clean sheets', value: stats.cleanSheets },
                ]}
              />
            </ProfileSection>

            <ProfileSection title="First-team squad" description="Select a player to open their profile.">
          <div className="min-w-0 space-y-6">
                {POSITION_GROUPS.map((group) => (
                  <div key={group}>
                    <div className="mb-3 flex items-baseline justify-between border-b border-line pb-2">
                      <h3 className="text-sm font-bold text-ink">{group}s</h3>
                      <span className="caption">{squad[group].length} players</span>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {squad[group].map((player) => (
                        <PlayerRow key={player.id} player={player} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ProfileSection>
          </div>

          <div className="space-y-6">
            <ProfileSection title="Recent results" description="Last five completed matches.">
              <div className="grid gap-2">
                {results.map((result) => (
                  <MatchListRow
                    key={result.id}
                    to={matchCentrePath(result.id)}
                    home={result.home}
                    away={result.away}
                    competition={competitionName(result.competitionId)}
                    venue={result.venue}
                    date={formatDateLabel(result.dateISO)}
                    homeScore={result.homeGoals}
                    awayScore={result.awayGoals}
                  />
                ))}
              </div>
            </ProfileSection>

            <ProfileSection title="Upcoming fixtures" description="Next five scheduled matches.">
              <div className="grid gap-2">
                {fixtures.map((fixture) => (
                  <MatchListRow
                    key={fixture.id}
                    to={matchCentrePath(fixture.id)}
                    home={fixture.home}
                    away={fixture.away}
                    competition={competitionName(fixture.competitionId)}
                    venue={fixture.venue}
                    date={formatDateShort(fixture.dateISO)}
                    kickoff={fixture.kickoff}
                  />
                ))}
              </div>
            </ProfileSection>

            <ProfileSection title="More club links" description="Explore club data elsewhere in the hub.">
              <div className="flex flex-wrap gap-2">
                <Link
                  to={ROUTES.standings}
                  className="rounded-full bg-surface-muted px-3 py-1.5 text-xs font-semibold text-ink hover:bg-primary-soft"
                >
                  View league table
                </Link>
                <Link
                  to={clubPath(club.id)}
                  className="rounded-full bg-surface-muted px-3 py-1.5 text-xs font-semibold text-ink hover:bg-primary-soft"
                >
                  Club profile
                </Link>
              </div>
            </ProfileSection>
          </div>
        </div>
      </div>
    </>
  )
}
