import { ROUTES } from '@/config/app'
import { TODAY_FIXTURES, matchCentrePath } from '@/config/homepage'
import { MatchListRow } from './MatchListRow'
import { SectionHeading } from './SectionHeading'

interface FixturesSectionProps {
  className?: string
}

export function FixturesSection({ className }: FixturesSectionProps) {
  return (
    <section className={className} aria-label="Today's fixtures">
      <SectionHeading
        title="Today's fixtures"
        description="Saturday 21 November 2026"
        to={ROUTES.fixtures}
        linkLabel="All fixtures"
      />
      <ul className="space-y-2.5">
        {TODAY_FIXTURES.map((fixture) => (
          <li key={fixture.id}>
            <MatchListRow
              to={matchCentrePath(fixture.id)}
              home={fixture.home}
              away={fixture.away}
              competition={fixture.competition}
              venue={fixture.venue}
              date={fixture.date}
              kickoff={fixture.kickoff}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
