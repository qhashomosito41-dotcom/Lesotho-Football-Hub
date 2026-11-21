import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/auth'
import { DemoNotice } from '@/components/home/DemoNotice'
import { GoldenBootPodium, ScorerLeaderboard } from '@/components/scorers'
import { Select, StatisticCard } from '@/components/ui'
import { competitionName } from '@/config/league'
import { filterScorers, goldenBootLeader, SCORER_COMPETITIONS, SCORER_SEASONS } from '@/config/scorers'
import { DB_COMPETITION_SLUGS, dbSeasonFromUi, playerStatRowsToScorers, type PlayerStatisticRow } from '@/lib/supabaseData'
import { supabase } from '@/lib/supabase'

export default function TopScorersPage() {
  const { configured } = useAuth()
  const [competitionId, setCompetitionId] = useState('all')
  const [season, setSeason] = useState(SCORER_SEASONS[0])
  const [supabaseRows, setSupabaseRows] = useState<PlayerStatisticRow[]>([])

  useEffect(() => {
    if (!configured) return

    void (async () => {
      const { data: seasonData } = await supabase
        .from('seasons')
        .select('id')
        .eq('name', dbSeasonFromUi(season))
        .maybeSingle()

      const seasonId = seasonData?.id
      if (!seasonId) {
        setSupabaseRows([])
        return
      }

      let query = supabase.from('player_statistics').select('*').eq('season_id', seasonId)

      if (competitionId !== 'all') {
        const slug = DB_COMPETITION_SLUGS[competitionId]
        const { data: competitionData } = await supabase
          .from('competitions')
          .select('id')
          .eq('slug', slug)
          .maybeSingle()

        if (!competitionData?.id) {
          setSupabaseRows([])
          return
        }
        query = query.eq('competition_id', competitionData.id)
      }

      const { data } = await query
      setSupabaseRows(data ?? [])
    })()
  }, [configured, competitionId, season])

  const scorers = useMemo(
    () =>
      configured
        ? playerStatRowsToScorers(
            supabaseRows,
            competitionId,
            competitionId === 'all' ? 'All competitions' : competitionName(competitionId),
            season,
          )
        : filterScorers(competitionId, season),
    [competitionId, configured, season, supabaseRows],
  )
  const leader = goldenBootLeader(scorers)
  const totalGoals = scorers.reduce((total, scorer) => total + scorer.goals, 0)
  const withAssists = scorers.filter((scorer) => typeof scorer.assists === 'number').length

  return (
    <>
      {!configured && <DemoNotice />}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <p className="eyebrow text-green-400">Golden Boot race</p>
        <h1 className="page-title mt-2 text-white">Top Scorers</h1>
        <p className="body-muted mt-3 max-w-2xl text-navy-200">
          Follow the leading goalscorers across competitions and seasons. Assists are shown where available.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <div>
            <p className="mb-1.5 text-[10px] font-semibold tracking-wider text-navy-300 uppercase">Competition</p>
            <Select
              options={SCORER_COMPETITIONS}
              value={competitionId}
              onChange={setCompetitionId}
              ariaLabel="Filter scorers by competition"
              size="lg"
            />
          </div>
          <div>
            <p className="mb-1.5 text-[10px] font-semibold tracking-wider text-navy-300 uppercase">Season</p>
            <Select
              options={SCORER_SEASONS.map((value) => ({ value, label: value }))}
              value={season}
              onChange={setSeason}
              ariaLabel="Filter scorers by season"
              size="lg"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatisticCard label="Leading scorer" value={leader?.name ?? '—'} caption={leader ? `${leader.goals} goals` : 'No records'} />
          <StatisticCard label="Goals in leaderboard" value={totalGoals} caption="Top 20 entries" />
          <StatisticCard label="Assists recorded" value={withAssists} caption="Players with assist data" />
        </div>

        {scorers.length > 0 ? (
          <div className="mt-6">
            <h2 className="font-display mb-3 text-xl font-bold text-white">Golden Boot podium</h2>
            <GoldenBootPodium scorers={scorers} />
          </div>
        ) : null}

        <div className="mt-8">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-xl font-bold text-white">Leaderboard</h2>
            <p className="caption text-navy-300">{scorers.length} players · {season}</p>
          </div>
          <ScorerLeaderboard scorers={scorers} />
          <p className="caption mt-2 text-navy-400">
            {configured
              ? 'Rankings are derived from verified match events, with assists used only as a tie-breaker.'
              : 'Rankings are calculated from demonstration goal totals, with assists used only as a tie-breaker.'}
          </p>
        </div>
      </div>
    </>
  )
}
