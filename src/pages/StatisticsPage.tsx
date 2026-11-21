import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/auth'
import { DemoNotice } from '@/components/home/DemoNotice'
import { ChartFrame, GoalsBarChart, GoalsLineChart, OutcomePieChart, RankingBarChart } from '@/components/stats'
import { Select, StatisticCard, Table, Tabs, type TableColumn } from '@/components/ui'
import { ROUTES } from '@/config/app'
import { COMPETITION_PROFILES } from '@/config/competitions'
import {
  getCompetitionSummary,
  getPlayerLeaders,
  getTeamLeaders,
  PLAYER_STAT_CATEGORIES,
  STAT_SEASONS,
  TEAM_STAT_CATEGORIES,
  type PlayerStatCategory,
  type StatLeader,
  type TeamStatCategory,
} from '@/config/statistics'
import SupabaseStatisticsPage from '@/pages/SupabaseStatisticsPage'

type StatisticsTab = 'overview' | 'teams' | 'players' | 'competition'

const TABS: { id: StatisticsTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'teams', label: 'Team statistics' },
  { id: 'players', label: 'Player statistics' },
  { id: 'competition', label: 'Competition statistics' },
]

const competitionOptions = [
  { value: 'all', label: 'All competitions' },
  ...COMPETITION_PROFILES.map((competition) => ({ value: competition.id, label: competition.name })),
]

const seasonOptions = STAT_SEASONS.map((season) => ({ value: season, label: season }))

function chartName(name: string): string {
  return name.split(' ').slice(0, 2).join(' ')
}

const leaderColumns: TableColumn<StatLeader>[] = [
  {
    key: 'rank',
    header: '#',
    width: '56px',
    cell: (row) => <span className="font-display text-lg font-bold text-ink">{row.rank}</span>,
  },
  {
    key: 'leader',
    header: 'Leader',
    cell: (row) => (
      <Link to={row.to} className="flex min-w-0 items-center gap-2.5 transition-colors hover:text-primary">
        {row.photoUrl ? (
          <img src={row.photoUrl} alt="" className="size-8 shrink-0 rounded-full object-cover" loading="lazy" />
        ) : (
          <span
            className="size-8 shrink-0 rounded-full"
            style={{ backgroundColor: row.team.color }}
            aria-hidden
          />
        )}
        <span className="min-w-0">
          <span className="block truncate font-semibold text-ink">{row.name}</span>
          <span className="block truncate text-xs text-ink-muted">{row.team.name}</span>
        </span>
      </Link>
    ),
  },
  { key: 'value', header: 'Value', align: 'center', cell: (row) => <span className="text-base font-bold text-ink">{row.displayValue}</span> },
  { key: 'detail', header: 'Detail', cell: (row) => <span className="text-xs text-ink-muted">{row.detail}</span> },
]

interface LeaderPanelProps<Category extends string> {
  title: string
  categories: { id: Category; label: string; description: string }[]
  category: Category
  onCategoryChange: (category: Category) => void
  leaders: StatLeader[]
}

function LeaderPanel<Category extends string>({
  title,
  categories,
  category,
  onCategoryChange,
  leaders,
}: LeaderPanelProps<Category>) {
  const active = categories.find((item) => item.id === category)
  const chartData = leaders.map((leader) => ({ name: chartName(leader.name), value: leader.value, detail: leader.detail }))

  return (
    <ChartFrame title={title} description={active?.description}>
      <Tabs
        items={categories.map((item) => ({ id: item.id, label: item.label }))}
        value={category}
        onChange={onCategoryChange}
        variant="pill"
        ariaLabel={`${title} categories`}
      />
      <div className="mt-5 grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        {chartData.length > 0 ? (
          <RankingBarChart data={chartData} height={320} />
        ) : (
          <p className="caption text-ink-muted">No records for these filters.</p>
        )}
        <Table
          columns={leaderColumns}
          rows={leaders}
          rowKey={(row) => row.id}
          compact
          caption={`${title} leaderboard`}
        />
      </div>
    </ChartFrame>
  )
}

export default function StatisticsPage() {
  const { configured } = useAuth()
  const location = useLocation()
  const tabFromPath = (): StatisticsTab => {
    if (location.pathname === ROUTES.playerStatistics) return 'players'
    if (location.pathname === ROUTES.teamStatistics) return 'teams'
    return 'overview'
  }

  const [tab, setTab] = useState<StatisticsTab>(tabFromPath)
  const [season, setSeason] = useState(STAT_SEASONS[0])
  const [competitionId, setCompetitionId] = useState('all')
  const [teamCategory, setTeamCategory] = useState<TeamStatCategory>('wins')
  const [playerCategory, setPlayerCategory] = useState<PlayerStatCategory>('scorers')

  useEffect(() => {
    setTab(tabFromPath())
  }, [location.pathname])

  const summary = useMemo(() => getCompetitionSummary(season, competitionId), [season, competitionId])
  const teamLeaders = useMemo(
    () => getTeamLeaders(teamCategory, season, competitionId),
    [teamCategory, season, competitionId],
  )
  const playerLeaders = useMemo(
    () => getPlayerLeaders(playerCategory, season, competitionId),
    [playerCategory, season, competitionId],
  )
  const overviewTeams = useMemo(() => getTeamLeaders('wins', season, competitionId).slice(0, 6), [season, competitionId])
  const overviewPlayers = useMemo(
    () => getPlayerLeaders('scorers', season, competitionId).slice(0, 6),
    [season, competitionId],
  )

  const panels: Record<StatisticsTab, ReactNode> = {
    overview: (
      <div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatisticCard label="Matches played" value={summary.matches} caption="Recorded results" />
          <StatisticCard label="Total goals" value={summary.goals} caption="Across selected scope" />
          <StatisticCard label="Average goals per match" value={summary.averageGoals} caption="Goals per fixture" />
          <StatisticCard label="Draws" value={summary.draws} caption="Level at full time" />
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <ChartFrame title="Goals by competition" description="Total goals in the selected season">
            <GoalsBarChart data={summary.byCompetition} />
          </ChartFrame>
          <ChartFrame title="Match outcomes" description="Home wins, draws and away wins">
            <OutcomePieChart data={summary.outcomes} />
          </ChartFrame>
          <ChartFrame title="Goals by round" description="Scoring pattern across rounds">
            <GoalsLineChart data={summary.byRound} />
          </ChartFrame>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <ChartFrame title="Club wins" description="Top six by victories">
            <RankingBarChart
              data={overviewTeams.map((leader) => ({ name: leader.team.shortName, value: leader.value }))}
              height={240}
            />
          </ChartFrame>
          <ChartFrame title="Golden Boot race" description="Top six by goals">
            <RankingBarChart
              data={overviewPlayers.map((leader) => ({ name: chartName(leader.name), value: leader.value }))}
              height={240}
            />
          </ChartFrame>
          <section className="rounded-xl border border-line bg-surface p-5 shadow-card">
            <h3 className="font-display text-lg font-bold text-ink">Explore the data</h3>
            <p className="caption mt-1 text-ink-muted">Jump to a detailed leaderboard.</p>
            <div className="mt-4 grid gap-2">
              <Link
                to={ROUTES.topScorers}
                className="rounded-lg border border-line px-3 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
              >
                Golden Boot leaderboard →
              </Link>
              <Link
                to={ROUTES.teamStatistics}
                className="rounded-lg border border-line px-3 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
              >
                Detailed team records →
              </Link>
              <Link
                to={ROUTES.playerStatistics}
                className="rounded-lg border border-line px-3 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
              >
                Player discipline and workload →
              </Link>
            </div>
          </section>
        </div>
      </div>
    ),
    teams: (
      <LeaderPanel
        title="Team leaders"
        categories={TEAM_STAT_CATEGORIES}
        category={teamCategory}
        onCategoryChange={setTeamCategory}
        leaders={teamLeaders}
      />
    ),
    players: (
      <LeaderPanel
        title="Player leaders"
        categories={PLAYER_STAT_CATEGORIES}
        category={playerCategory}
        onCategoryChange={setPlayerCategory}
        leaders={playerLeaders}
      />
    ),
    competition: (
      <div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summary.cards.map((item) => (
            <div key={item.id} className="min-w-0 rounded-xl border border-line bg-surface p-4 shadow-card">
              <p className="eyebrow">{item.label}</p>
              <p className="font-display mt-2 break-words text-xl font-bold text-ink">{item.value}</p>
              <p className="caption mt-1 text-ink-muted">{item.caption}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <ChartFrame title="Goals by competition" description="Attacking output across competitions">
            <GoalsBarChart data={summary.byCompetition} />
          </ChartFrame>
          <ChartFrame title="Goals by round" description="Goals scored in each round">
            <GoalsLineChart data={summary.byRound} />
          </ChartFrame>
        </div>
      </div>
    ),
  }

  const content = (
    <>
      <DemoNotice />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <p className="eyebrow text-green-400">Football data</p>
        <h1 className="page-title mt-2 text-white">Statistics centre</h1>
        <p className="body-muted mt-3 max-w-2xl text-navy-200">
          Explore team, player and competition leaders for the selected season using demonstration data.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <div>
            <p className="mb-1.5 text-[10px] font-semibold tracking-wider text-navy-300 uppercase">Season</p>
            <Select options={seasonOptions} value={season} onChange={setSeason} ariaLabel="Select statistics season" size="lg" />
          </div>
          <div>
            <p className="mb-1.5 text-[10px] font-semibold tracking-wider text-navy-300 uppercase">Competition</p>
            <Select
              options={competitionOptions}
              value={competitionId}
              onChange={setCompetitionId}
              ariaLabel="Filter statistics by competition"
              size="lg"
            />
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-line bg-surface p-2">
          <Tabs items={TABS} value={tab} onChange={setTab} ariaLabel="Statistics sections" />
          <div role="tabpanel" aria-label={TABS.find((item) => item.id === tab)?.label} className="p-4 sm:p-6">
            {panels[tab]}
          </div>
        </div>
      </div>
    </>
  )

  return configured ? <SupabaseStatisticsPage /> : content
}
