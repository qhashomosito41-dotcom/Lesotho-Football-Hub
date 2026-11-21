import { useMemo, useState } from 'react'
import { DemoNotice } from '@/components/home/DemoNotice'
import { MatchListRow } from '@/components/home/MatchListRow'
import { Button, EmptyState, Select } from '@/components/ui'
import { matchCentrePath } from '@/config/homepage'
import {
  COMPETITIONS,
  competitionName,
  formatDateShort,
  SCHEDULE,
  SEASONS,
  SEASON_CURRENT,
} from '@/config/league'
import { cn } from '@/utils/cn'

const competitionOptions = [
  { value: 'all', label: 'All competitions' },
  ...COMPETITIONS.map((competition) => ({ value: competition.id, label: competition.name })),
]

const seasonOptions = SEASONS.map((season) => ({ value: season, label: season }))

export default function FixturesPage() {
  const [competition, setCompetition] = useState('all')
  const [season, setSeason] = useState(SEASON_CURRENT)
  const [date, setDate] = useState('all')

  const dates = useMemo(
    () =>
      Array.from(
        new Set(
          SCHEDULE.filter(
            (fixture) =>
              (competition === 'all' || fixture.competitionId === competition) && fixture.season === season,
          ).map((fixture) => fixture.dateISO),
        ),
      ).sort(),
    [competition, season],
  )

  const fixtures = useMemo(
    () =>
      SCHEDULE.filter(
        (fixture) =>
          (competition === 'all' || fixture.competitionId === competition) &&
          fixture.season === season &&
          (date === 'all' || fixture.dateISO === date),
      ).sort(
        (first, second) =>
          first.dateISO.localeCompare(second.dateISO) || first.kickoff.localeCompare(second.kickoff),
      ),
    [competition, season, date],
  )

  const reset = () => {
    setCompetition('all')
    setSeason(SEASON_CURRENT)
    setDate('all')
  }

  return (
    <>
      <DemoNotice />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <p className="eyebrow text-green-400">Match schedule</p>
        <h1 className="page-title mt-2 text-white">Fixtures</h1>
        <p className="body-muted mt-3 max-w-2xl text-navy-200">
          Upcoming matches with kick-off times, venues and club badges across every competition.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-navy-300">
              Competition
            </span>
            <Select
              options={competitionOptions}
              value={competition}
              onChange={(value) => {
                setCompetition(value)
                setDate('all')
              }}
              ariaLabel="Filter fixtures by competition"
            />
          </div>
          <div>
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-navy-300">
              Season
            </span>
            <Select
              options={seasonOptions}
              value={season}
              onChange={(value) => {
                setSeason(value)
                setDate('all')
              }}
              ariaLabel="Filter fixtures by season"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter fixtures by date">
          <button
            type="button"
            aria-pressed={date === 'all'}
            onClick={() => setDate('all')}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-150',
              date === 'all'
                ? 'border-green-500/50 bg-green-500/15 text-green-300'
                : 'border-navy-700 bg-elevated text-navy-300 hover:border-navy-500 hover:text-white',
            )}
          >
            All dates
          </button>
          {dates.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={date === value}
              onClick={() => setDate(value)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-150',
                date === value
                  ? 'border-green-500/50 bg-green-500/15 text-green-300'
                  : 'border-navy-700 bg-elevated text-navy-300 hover:border-navy-500 hover:text-white',
              )}
            >
              {formatDateShort(value)}
            </button>
          ))}
        </div>

        <p className="caption mt-5 text-navy-400">
          {fixtures.length} {fixtures.length === 1 ? 'fixture' : 'fixtures'} · demonstration data
        </p>

        {fixtures.length > 0 ? (
          <div className="mt-4 space-y-8">
            {Array.from(new Set(fixtures.map((fixture) => fixture.dateISO))).map((value) => (
              <section key={value} aria-label={`Fixtures on ${formatDateShort(value)}`}>
                <div className="mb-3 flex items-baseline justify-between border-b border-navy-700 pb-2">
                  <h2 className="font-display text-lg font-bold text-white">{formatDateShort(value)}</h2>
                  <span className="caption text-navy-400">
                    {fixtures.filter((fixture) => fixture.dateISO === value).length} matches
                  </span>
                </div>
                <div className="grid gap-2 lg:grid-cols-2">
                  {fixtures
                    .filter((fixture) => fixture.dateISO === value)
                    .map((fixture) => (
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
              </section>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-navy-700 bg-elevated">
            <EmptyState
              tone="dark"
              title="No fixtures found"
              description="Try a different competition, season or date."
              action={
                <Button type="button" size="sm" variant="primary" onClick={reset}>
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
