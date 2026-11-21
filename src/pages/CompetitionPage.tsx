import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DemoNotice } from '@/components/home/DemoNotice'
import { MatchListRow } from '@/components/home/MatchListRow'
import { BracketView, CompetitionLogo, GroupTables } from '@/components/competitions'
import { ProfileSection, ProfileStatGrid } from '@/components/profile'
import { ClubBadge, EmptyState, LeagueTable, Select, Table, Tabs, type TableColumn } from '@/components/ui'
import { ROUTES } from '@/config/app'
import { clubPath, matchCentrePath, type DemoTopScorer } from '@/config/homepage'
import { formatDateLabel, formatDateShort } from '@/config/league'
import {
  COMPETITION_SEASONS,
  competitionFixtures,
  competitionResults,
  competitionStats,
  competitionTopScorers,
  competitionTypeName,
  getCompetition,
  groupsFor,
  historicalRecord,
  historicalTable,
  knockoutBracket,
  calculateCompetitionTable,
  type CompetitionTableRow,
} from '@/config/competitions'

type CompetitionTab =
  | 'overview'
  | 'standings'
  | 'fixtures'
  | 'results'
  | 'clubs'
  | 'scorers'
  | 'statistics'

const TABS: { id: CompetitionTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'standings', label: 'Standings' },
  { id: 'fixtures', label: 'Fixtures' },
  { id: 'results', label: 'Results' },
  { id: 'clubs', label: 'Clubs' },
  { id: 'scorers', label: 'Top scorers' },
  { id: 'statistics', label: 'Statistics' },
]

const scorerColumns: TableColumn<DemoTopScorer>[] = [
  {
    key: 'player',
    header: 'Player',
    cell: (row) => <span className="font-semibold text-ink">{row.name}</span>,
  },
  { key: 'club', header: 'Club', cell: (row) => row.club.name },
  { key: 'position', header: 'Position', cell: (row) => row.position },
  { key: 'goals', header: 'Goals', align: 'center', cell: (row) => row.goals },
  { key: 'assists', header: 'Assists', align: 'center', cell: (row) => row.assists },
]

function toLeagueRows(rows: CompetitionTableRow[]) {
  return rows.map((row) => ({ ...row, to: clubPath(row.team.id) }))
}

export default function CompetitionPage() {
  const { competitionId } = useParams()
  const competition = getCompetition(competitionId)
  const [season, setSeason] = useState(competition?.season ?? COMPETITION_SEASONS[0])
  const [tab, setTab] = useState<CompetitionTab>('overview')

  useEffect(() => {
    setSeason(competition?.season ?? COMPETITION_SEASONS[0])
    setTab('overview')
  }, [competition])

  const results = useMemo(
    () => (competition ? competitionResults(competition, season) : []),
    [competition, season],
  )
  const fixtures = useMemo(
    () => (competition ? competitionFixtures(competition, season) : []),
    [competition, season],
  )
  const groups = useMemo(() => (competition ? groupsFor(competition) : []), [competition])
  const stats = useMemo(
    () => (competition ? competitionStats(competition, season) : null),
    [competition, season],
  )
  const bracket = useMemo(
    () =>
      competition && (competition.format === 'knockout' || competition.format === 'combined')
        ? knockoutBracket(competition, season)
        : [],
    [competition, season],
  )

  if (!competition) {
    return (
      <>
        <DemoNotice />
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <h1 className="page-title text-white">Competition not found</h1>
          <div className="mt-6 rounded-xl border border-navy-700 bg-elevated">
            <EmptyState
              tone="dark"
              title="No competition with that ID"
              description="Return to the competition directory to browse available competitions."
            />
          </div>
        </div>
      </>
    )
  }

  const isHistorical = season !== competition.season
  const record = historicalRecord(competition, season)
  const tableRows = isHistorical
    ? historicalTable(competition, season)
    : calculateCompetitionTable(competition.participants, results)
  const leagueTable = toLeagueRows(tableRows)
  const championId = bracket.at(-1)?.matches[0]?.winnerId
  const champion =
    competition.participants.find((team) => team.id === championId)?.name ?? competition.participants[0]?.name
  const scorers = competitionTopScorers(competition)

  const overview = (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="min-w-0 space-y-6 lg:col-span-2">
        <ProfileSection title="About this competition" description={competitionTypeName(competition.format)}>
          <p className="text-sm leading-relaxed text-ink-muted">{competition.description}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              { label: 'Founded', value: String(competition.founded) },
              { label: 'Type', value: competition.typeLabel },
              { label: 'Current round', value: competition.currentRound },
              { label: 'Participants', value: String(competition.participants.length) },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-line bg-surface-muted px-3 py-2.5">
                <p className="eyebrow">{item.label}</p>
                <p className="mt-1 text-sm font-semibold text-ink">{item.value}</p>
              </div>
            ))}
          </div>
        </ProfileSection>

        {isHistorical && (
          <ProfileSection title={`${season} record`} description="Archived demonstration record.">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: 'Champion', value: record.champion },
                { label: 'Runner-up', value: record.runnerUp },
                { label: 'Top scorer', value: record.topScorer },
                { label: 'Matches', value: String(record.matches) },
                { label: 'Goals', value: String(record.goals) },
                { label: 'Season', value: record.season },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-line bg-surface-muted px-3 py-2.5">
                  <p className="eyebrow">{item.label}</p>
                  <p className="mt-1 text-sm font-semibold text-ink">{item.value}</p>
                </div>
              ))}
            </div>
          </ProfileSection>
        )}

        {bracket.length > 0 && (
          <ProfileSection
            title="Knockout bracket"
            description="Winners shown in green progress to the next round."
          >
            <BracketView rounds={bracket} championName={isHistorical ? record.champion : champion} />
          </ProfileSection>
        )}

        {groups.length > 0 && (
          <ProfileSection title="Group stage" description="Separate group tables for this season.">
            <GroupTables groups={groups} results={results} />
          </ProfileSection>
        )}
      </div>

      <div className="min-w-0 space-y-6">
        <ProfileSection title="Season snapshot" description={`Season ${season}`}>
          <ProfileStatGrid
            columns={2}
            stats={[
              { label: 'Matches', value: stats?.matches ?? 0 },
              { label: 'Goals', value: stats?.goals ?? 0 },
              { label: 'Goals / match', value: stats?.averageGoals ?? '0.0' },
              { label: 'Clean sheets', value: stats?.cleanSheets ?? 0 },
            ]}
          />
        </ProfileSection>

        <ProfileSection title="Participating clubs" description={`${competition.participants.length} clubs`}>
          <div className="grid gap-2">
            {competition.participants.slice(0, 8).map((team) => (
              <Link
                key={team.id}
                to={clubPath(team.id)}
                className="flex items-center gap-2.5 rounded-lg border border-line px-2.5 py-2 transition-colors hover:border-primary"
              >
                <ClubBadge name={team.name} shortName={team.shortName} color={team.color} size="sm" />
                <span className="truncate text-xs font-semibold text-ink">{team.name}</span>
              </Link>
            ))}
          </div>
        </ProfileSection>
      </div>
    </div>
  )

  const standings = (
    <div>
      {competition.format === 'knockout' ? (
        <div className="rounded-xl border border-line bg-surface">
          <EmptyState
            title="No league table"
            description="This is a knockout tournament. Open the Overview tab to follow the bracket and progressing winners."
          />
        </div>
      ) : groups.length > 0 && !isHistorical ? (
        <GroupTables groups={groups} results={results} />
      ) : (
        <>
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-xl font-bold text-ink">{competition.name} table</h2>
            <p className="caption">Season {season} · {leagueTable.length} clubs</p>
          </div>
          <LeagueTable
            rows={leagueTable}
            showGoals
            showForm={false}
            caption={`${competition.name} standings for ${season}`}
          />
          <p className="caption mt-2 text-ink-muted">
            {isHistorical ? 'Archived final table.' : 'Generated from recorded results.'}
          </p>
        </>
      )}
    </div>
  )

  const knownMatchCentre = competition.id === 'premier-league' || competition.id === 'championship'

  const fixturesView = (
    <div>
      <h2 className="font-display mb-4 text-xl font-bold text-ink">Upcoming fixtures</h2>
      {fixtures.length > 0 ? (
        <div className="grid gap-2 lg:grid-cols-2">
          {fixtures.map((fixture) => (
            <MatchListRow
              key={fixture.id}
              to={clubPath(fixture.home.id)}
              home={fixture.home}
              away={fixture.away}
              competition={competition.name}
              venue={fixture.venue}
              date={formatDateShort(fixture.dateISO)}
              kickoff={fixture.kickoff}
              className="shadow-none"
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No fixtures available" description="No scheduled matches for this season." />
      )}
    </div>
  )

  const resultsView = (
    <div>
      <h2 className="font-display mb-4 text-xl font-bold text-ink">Completed matches</h2>
      {results.length > 0 ? (
        <div className="grid gap-2 lg:grid-cols-2">
          {results.map((result) => (
            <MatchListRow
              key={result.id}
              to={knownMatchCentre ? matchCentrePath(result.id) : clubPath(result.home.id)}
              home={result.home}
              away={result.away}
              competition={competition.name}
              venue={result.venue}
              date={formatDateLabel(result.dateISO)}
              homeScore={result.homeScore}
              awayScore={result.awayScore}
              className="shadow-none"
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No results available" description="Results for this season have not been recorded." />
      )}
    </div>
  )

  const clubsView = (
    <div>
      <h2 className="font-display mb-4 text-xl font-bold text-ink">Participating clubs</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {competition.participants.map((team) => (
          <Link
            key={team.id}
            to={clubPath(team.id)}
            className="flex flex-col items-center gap-2 rounded-xl border border-line bg-surface p-4 text-center transition-colors hover:border-primary"
          >
            <ClubBadge name={team.name} shortName={team.shortName} color={team.color} size="md" />
            <span className="text-xs font-semibold text-ink">{team.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )

  const scorersView = (
    <div>
      <h2 className="font-display mb-4 text-xl font-bold text-ink">Top scorers</h2>
      <Table columns={scorerColumns} rows={scorers} rowKey={(row) => row.id} compact caption="Competition top scorers" />
    </div>
  )

  const statisticsView = (
    <div>
      <h2 className="font-display mb-4 text-xl font-bold text-ink">Competition statistics</h2>
      <ProfileStatGrid
        columns={5}
        stats={[
          { label: 'Matches', value: stats?.matches ?? 0 },
          { label: 'Goals', value: stats?.goals ?? 0 },
          { label: 'Goals per match', value: stats?.averageGoals ?? '0.0' },
          { label: 'Clean sheets', value: stats?.cleanSheets ?? 0 },
          { label: 'Clubs', value: stats?.clubs ?? 0 },
        ]}
      />
    </div>
  )

  const panels: Record<CompetitionTab, ReactNode> = {
    overview,
    standings,
    fixtures: fixturesView,
    results: resultsView,
    clubs: clubsView,
    scorers: scorersView,
    statistics: statisticsView,
  }

  return (
    <>
      <DemoNotice />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <h1 className="sr-only">{competition.name}</h1>
        <div className="rounded-2xl border border-navy-700 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 p-6 shadow-raised sm:p-8">
          <Link
            to={ROUTES.competitions}
            className="text-xs font-semibold text-navy-200 transition-colors hover:text-white"
          >
            ← All competitions
          </Link>
          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
            <CompetitionLogo competition={competition} size="lg" />
            <div className="min-w-0">
              <p className="eyebrow text-green-400">{competitionTypeName(competition.format)}</p>
              <h2 className="font-display mt-2 text-3xl font-bold text-white sm:text-4xl">{competition.name}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  { label: 'Season', value: season },
                  { label: 'Status', value: competition.status },
                  { label: 'Clubs', value: String(competition.participants.length) },
                  { label: 'Round', value: competition.currentRound },
                ].map((item) => (
                  <span
                    key={item.label}
                    className="rounded-full border border-navy-600 bg-navy-800 px-3 py-1 text-xs text-navy-100"
                  >
                    <span className="text-navy-400">{item.label}: </span>
                    <span className="font-semibold">{item.value}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-[260px_1fr] sm:items-center">
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-navy-300">Season</p>
            <Select
              options={COMPETITION_SEASONS.map((value) => ({ value, label: value }))}
              value={season}
              onChange={setSeason}
              ariaLabel="Select competition season"
            />
          </div>
          <p className="caption text-navy-400 sm:text-right">
            {isHistorical ? 'Viewing archived demonstration records' : 'Viewing current demonstration data'}
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-line bg-surface p-2">
          <Tabs
            items={TABS}
            value={tab}
            onChange={setTab}
            tone="light"
            variant="underline"
            ariaLabel="Competition sections"
          />
          <div role="tabpanel" aria-label={TABS.find((item) => item.id === tab)?.label} className="p-4 sm:p-6">
            {panels[tab]}
          </div>
        </div>
      </div>
    </>
  )
}
