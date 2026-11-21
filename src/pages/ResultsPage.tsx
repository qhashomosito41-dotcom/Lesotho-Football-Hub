import { useMemo, useState } from 'react'
import { DemoNotice } from '@/components/home/DemoNotice'
import { MatchListRow } from '@/components/home/MatchListRow'
import { Button, EmptyState, Select } from '@/components/ui'
import { matchCentrePath } from '@/config/homepage'
import {
  COMPETITIONS,
  competitionName,
  formatDateLabel,
  formatDateShort,
  MATCH_RESULTS,
  SEASONS,
  SEASON_CURRENT,
} from '@/config/league'

const competitionOptions = [
  { value: 'all', label: 'All competitions' },
  ...COMPETITIONS.map((competition) => ({ value: competition.id, label: competition.name })),
]

const seasonOptions = SEASONS.map((season) => ({ value: season, label: season }))

export default function ResultsPage() {
  const [competition, setCompetition] = useState('all')
  const [season, setSeason] = useState(SEASON_CURRENT)

  const results = useMemo(
    () =>
      MATCH_RESULTS.filter(
        (result) =>
          (competition === 'all' || result.competitionId === competition) && result.season === season,
      ).sort((first, second) => second.dateISO.localeCompare(first.dateISO)),
    [competition, season],
  )

  return (
    <>
      <DemoNotice />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <p className="eyebrow text-green-400">Results archive</p>
        <h1 className="page-title mt-2 text-white">Results</h1>
        <p className="body-muted mt-3 max-w-2xl text-navy-200">
          Final scores, dates and stadiums from completed matches across every competition.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <div>
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-navy-300">
              Competition
            </span>
            <Select
              options={competitionOptions}
              value={competition}
              onChange={setCompetition}
              ariaLabel="Filter results by competition"
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
              ariaLabel="Filter results by season"
            />
          </div>
        </div>

        <p className="caption mt-5 text-navy-400">
          {results.length} {results.length === 1 ? 'result' : 'results'} · demonstration data
        </p>

        {results.length > 0 ? (
          <div className="mt-4 space-y-8">
            {Array.from(new Set(results.map((result) => result.dateISO))).map((value) => (
              <section key={value} aria-label={`Results on ${formatDateShort(value)}`}>
                <div className="mb-3 flex items-baseline justify-between border-b border-navy-700 pb-2">
                  <h2 className="font-display text-lg font-bold text-white">{formatDateShort(value)}</h2>
                  <span className="caption text-navy-400">
                    {results.filter((result) => result.dateISO === value).length} matches
                  </span>
                </div>
                <div className="grid gap-2 lg:grid-cols-2">
                  {results
                    .filter((result) => result.dateISO === value)
                    .map((result) => (
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
              </section>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-navy-700 bg-elevated">
            <EmptyState
              tone="dark"
              title="No results found"
              description="Try a different competition or season."
              action={
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    setCompetition('all')
                    setSeason(SEASON_CURRENT)
                  }}
                >
                  Reset filters
                </Button>
              }
            />
          </div>
        )}
      </div>
    </>
  )
}
