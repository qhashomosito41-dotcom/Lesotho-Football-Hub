import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/auth'
import { DemoNotice } from '@/components/home/DemoNotice'
import { EmptyState, LeagueTable, Select, type LeagueZoneTone } from '@/components/ui'
import {
  COMPETITIONS,
  competitionById,
  calculateStandings,
  SEASONS,
  SEASON_CURRENT,
  type CompetitionId,
} from '@/config/league'
import { DB_COMPETITION_SLUGS, dbSeasonFromUi, standingRowsToLeagueTable, type StandingRow } from '@/lib/supabaseData'
import { supabase } from '@/lib/supabase'

const competitionOptions = COMPETITIONS.map((competition) => ({
  value: competition.id,
  label: competition.name,
}))

const seasonOptions = SEASONS.map((season) => ({ value: season, label: season }))

const zoneStyles: Record<LeagueZoneTone, string> = {
  success: 'bg-live',
  primary: 'bg-primary',
  danger: 'bg-danger',
}

function zonesFor(competition: CompetitionId): { tone: LeagueZoneTone; label: string }[] {
  if (competition === 'premier-league') {
    return [
      { tone: 'success', label: 'Champions League qualification' },
      { tone: 'primary', label: 'Confederation Cup qualification' },
      { tone: 'danger', label: 'Relegation places' },
    ]
  }
  if (competition === 'championship') {
    return [
      { tone: 'success', label: 'Promotion places' },
      { tone: 'danger', label: 'Relegation places' },
    ]
  }
  return []
}

function zoneMapFor(competition: CompetitionId): Record<number, LeagueZoneTone> {
  if (competition === 'premier-league') {
    return { 1: 'success', 2: 'success', 3: 'primary', 11: 'danger', 12: 'danger' }
  }
  if (competition === 'championship') {
    return { 1: 'success', 2: 'success', 7: 'danger', 8: 'danger' }
  }
  return {}
}

export default function StandingsPage() {
  const { configured } = useAuth()
  const [competition, setCompetition] = useState<CompetitionId>('premier-league')
  const [season, setSeason] = useState(SEASON_CURRENT)
  const [supabaseRows, setSupabaseRows] = useState<StandingRow[]>([])

  useEffect(() => {
    if (!configured) return

    const slug = DB_COMPETITION_SLUGS[competition]
    const seasonName = dbSeasonFromUi(season)

    void (async () => {
      const [competitionResult, seasonResult] = await Promise.all([
        supabase.from('competitions').select('id').eq('slug', slug).maybeSingle(),
        supabase.from('seasons').select('id').eq('name', seasonName).maybeSingle(),
      ])

      const competitionId = competitionResult.data?.id
      const seasonId = seasonResult.data?.id
      if (!competitionId || !seasonId) {
        setSupabaseRows([])
        return
      }

      const { data } = await supabase
        .from('standings')
        .select('*')
        .eq('competition_id', competitionId)
        .eq('season_id', seasonId)
        .order('position')

      setSupabaseRows(data ?? [])
    })()
  }, [configured, competition, season])

  const activeCompetition = competitionById(competition)
  const rows = useMemo(() => {
    if (!configured) return activeCompetition?.hasTable ? calculateStandings(competition, season) : []
    return standingRowsToLeagueTable(supabaseRows)
  }, [activeCompetition, competition, configured, season, supabaseRows])

  return (
    <>
      {!configured && <DemoNotice />}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <p className="eyebrow text-green-400">League table</p>
        <h1 className="page-title mt-2 text-white">Standings</h1>
        <p className="body-muted mt-3 max-w-2xl text-navy-200">
          Positions, points and form calculated from the results below — no positions are entered manually.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <div>
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-navy-300">
              Competition
            </span>
            <Select
              options={competitionOptions}
              value={competition}
              onChange={(value) => setCompetition(value as CompetitionId)}
              ariaLabel="Select competition for standings"
            />
          </div>
          <div>
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-navy-300">
              Season
            </span>
            <Select
              options={seasonOptions}
              value={season}
              onChange={setSeason}
              ariaLabel="Select season for standings"
            />
          </div>
        </div>

        <div className="mt-7">
          {rows.length > 0 ? (
            <>
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h2 className="font-display text-xl font-bold text-white">{activeCompetition?.name}</h2>
                  <p className="caption mt-1 text-navy-400">
                    Season {season} · table generated from {rows[0]?.played ?? 0} recorded matches per club
                  </p>
                </div>
                <p className="caption text-navy-400">{rows.length} clubs</p>
              </div>

              <LeagueTable
                rows={rows}
                showGoals
                showForm
                zoneMap={zoneMapFor(competition)}
                caption={`${activeCompetition?.name} standings for ${season}`}
              />

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {zonesFor(competition).map((zone) => (
                  <span key={zone.label} className="caption flex items-center gap-2 text-navy-200">
                    <span className={`size-2.5 rounded-full ${zoneStyles[zone.tone]}`} aria-hidden />
                    {zone.label}
                  </span>
                ))}
              </div>
              <p className="caption mt-3 text-navy-400">
                 Form shows the last five matches, most recent first · W win, D draw, L loss · select a club name
                 for club details · {configured ? 'verified match records' : 'demonstration data'}
              </p>
            </>
          ) : (
            <div className="rounded-xl border border-navy-700 bg-elevated">
              <EmptyState
                tone="dark"
                title="Standings are not available"
                 description={
                   configured
                     ? 'No verified match records are available for this competition and season yet.'
                     : 'This is a knockout competition, so there is no league table. Choose a league instead.'
                 }
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
