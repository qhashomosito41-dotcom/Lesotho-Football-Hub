import { ROUTES } from '@/config/app'
import { LATEST_RESULTS, matchCentrePath } from '@/config/homepage'
import { MatchListRow } from './MatchListRow'
import { SectionHeading } from './SectionHeading'

interface ResultsSectionProps {
  className?: string
}

export function ResultsSection({ className }: ResultsSectionProps) {
  return (
    <section className={className} aria-label="Latest results">
      <SectionHeading
        title="Latest results"
        description="Verified final scores from the Vodacom Premier League."
        to={ROUTES.results}
        linkLabel="All results"
      />
      <ul className="space-y-2.5">
        {LATEST_RESULTS.map((result) => (
          <li key={result.id}>
            <MatchListRow
              to={matchCentrePath(result.id)}
              home={result.home}
              away={result.away}
              competition={result.competition}
              venue={result.venue}
              date={result.date}
              homeScore={result.homeScore}
              awayScore={result.awayScore}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
