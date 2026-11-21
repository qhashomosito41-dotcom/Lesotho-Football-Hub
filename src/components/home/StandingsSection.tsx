import { LeagueTable } from '@/components/ui'
import { ROUTES } from '@/config/app'
import { calculateStandings, SEASON_CURRENT } from '@/config/league'
import { SectionHeading } from './SectionHeading'

interface StandingsSectionProps {
  className?: string
}

export function StandingsSection({ className }: StandingsSectionProps) {
  return (
    <section className={className} aria-label="Premier League table">
      <SectionHeading
        title="Premier League table"
        description="Vodacom Premier League · after matchweek 5"
        to={ROUTES.standings}
        linkLabel="View full table"
      />
      <LeagueTable
        rows={calculateStandings('premier-league', SEASON_CURRENT).slice(0, 8)}
        caption="Vodacom Premier League standings — top 8 of 12 clubs"
      />
      <p className="caption mt-2 text-navy-400">Showing the top 8 of 12 clubs · demonstration data</p>
    </section>
  )
}
