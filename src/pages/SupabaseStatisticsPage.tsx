import { useEffect, useMemo, useState } from 'react'
import { Select, StatisticCard, Table, type TableColumn } from '@/components/ui'
import { COMPETITION_PROFILES } from '@/config/competitions'
import { STAT_SEASONS } from '@/config/statistics'
import type { Database } from '@/lib/database.types'
import { DB_COMPETITION_SLUGS, dbSeasonFromUi } from '@/lib/supabaseData'
import { supabase } from '@/lib/supabase'

type TeamStatistic = Database['public']['Views']['team_statistics']['Row']
type PlayerStatistic = Database['public']['Views']['player_statistics']['Row']

const competitionOptions = [
  { value: 'all', label: 'All competitions' },
  ...COMPETITION_PROFILES.map((competition) => ({ value: competition.id, label: competition.name })),
]

const teamColumns: TableColumn<TeamStatistic>[] = [
  {
    key: 'club',
    header: 'Club',
    cell: (row) => (
      <div>
        <p className="font-semibold text-ink">{row.club_name}</p>
        <p className="caption">{row.club_short_name}</p>
      </div>
    ),
  },
  { key: 'played', header: 'P', align: 'center' },
  { key: 'wins', header: 'W', align: 'center' },
  { key: 'draws', header: 'D', align: 'center' },
  { key: 'losses', header: 'L', align: 'center' },
  { key: 'goals_for', header: 'GF', align: 'center' },
  { key: 'goals_against', header: 'GA', align: 'center' },
  { key: 'goal_difference', header: 'GD', align: 'center' },
  { key: 'points', header: 'Pts', align: 'center' },
]

const playerColumns: TableColumn<PlayerStatistic>[] = [
  { key: 'player', header: 'Player', cell: (row) => <p className="font-semibold text-ink">{row.player_name}</p> },
  { key: 'club', header: 'Club', cell: (row) => <span className="text-xs text-ink-muted">{row.club_name}</span> },
  { key: 'appearances', header: 'Apps', align: 'center' },
  { key: 'goals', header: 'Goals', align: 'center' },
  { key: 'assists', header: 'Assists', align: 'center' },
  { key: 'yellow_cards', header: 'YC', align: 'center' },
  { key: 'red_cards', header: 'RC', align: 'center' },
]

export default function SupabaseStatisticsPage() {
  const [season, setSeason] = useState(STAT_SEASONS[0])
  const [competitionId, setCompetitionId] = useState('all')
  const [teamRows, setTeamRows] = useState<TeamStatistic[]>([])
  const [playerRows, setPlayerRows] = useState<PlayerStatistic[]>([])

  useEffect(() => {
    void (async () => {
      const { data: seasonData } = await supabase
        .from('seasons')
        .select('id')
        .eq('name', dbSeasonFromUi(season))
        .maybeSingle()

      const seasonId = seasonData?.id
      if (!seasonId) {
        setTeamRows([])
        setPlayerRows([])
        return
      }

      const [teamResult, playerResult] = await Promise.all([
        supabase.from('team_statistics').select('*').eq('season_id', seasonId),
        supabase.from('player_statistics').select('*').eq('season_id', seasonId),
      ])

      let teams = teamResult.data ?? []
      let players = playerResult.data ?? []

      if (competitionId !== 'all') {
        const slug = DB_COMPETITION_SLUGS[competitionId]
        const { data: competitionData } = await supabase
          .from('competitions')
          .select('id')
          .eq('slug', slug)
          .maybeSingle()
        const scopedCompetitionId = competitionData?.id

        teams = teams.filter((row) => row.competition_id === scopedCompetitionId)
        players = players.filter((row) => row.competition_id === scopedCompetitionId)
      }

      setTeamRows(teams)
      setPlayerRows(players)
    })()
  }, [competitionId, season])

  const totals = useMemo(
    () => ({
      matches: teamRows.reduce((sum, row) => sum + row.played, 0) / 2,
      goals: teamRows.reduce((sum, row) => sum + row.goals_for, 0),
      cards: teamRows.reduce((sum, row) => sum + row.yellow_cards + row.red_cards, 0),
      players: playerRows.length,
    }),
    [playerRows, teamRows],
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <p className="eyebrow text-green-400">Football data</p>
      <h1 className="page-title mt-2 text-white">Statistics centre</h1>
      <p className="body-muted mt-3 max-w-2xl text-navy-200">
        Standings and statistics are derived from verified match records in Supabase. No totals are maintained manually.
      </p>

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-1.5 text-[10px] font-semibold tracking-wider text-navy-300 uppercase">Season</p>
          <Select
            options={STAT_SEASONS.map((value) => ({ value, label: value }))}
            value={season}
            onChange={setSeason}
            ariaLabel="Select statistics season"
            size="lg"
          />
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

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatisticCard label="Verified matches" value={totals.matches} caption="Completed both sides" />
        <StatisticCard label="Goals" value={totals.goals} caption="From verified fixtures" />
        <StatisticCard label="Cards" value={totals.cards} caption="From verified events" />
        <StatisticCard label="Players with records" value={totals.players} caption="Scoped to filters" />
      </div>

      <section className="mt-6 rounded-xl border border-line bg-surface p-4 shadow-card">
        <h2 className="font-display text-xl font-bold text-ink">Team statistics</h2>
        <div className="mt-4">
          <Table columns={teamColumns} rows={teamRows} rowKey={(row) => row.id} caption="Derived team statistics" compact />
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-line bg-surface p-4 shadow-card">
        <h2 className="font-display text-xl font-bold text-ink">Player statistics</h2>
        <div className="mt-4">
          <Table columns={playerColumns} rows={playerRows} rowKey={(row) => row.id} caption="Derived player statistics" compact />
        </div>
      </section>
    </div>
  )
}
