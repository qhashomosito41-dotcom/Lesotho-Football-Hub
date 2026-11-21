import { ArrowRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ClubBadge } from '@/components/ui'
import { ROUTES } from '@/config/app'
import { FEATURED_CLUBS, clubPath } from '@/config/homepage'
import { SectionHeading } from './SectionHeading'

interface FeaturedClubsSectionProps {
  className?: string
}

export function FeaturedClubsSection({ className }: FeaturedClubsSectionProps) {
  return (
    <section className={className} aria-label="Featured clubs">
      <SectionHeading
        title="Featured clubs"
        description="Profiles, squads and fixtures for clubs across Lesotho."
        to={ROUTES.clubs}
        linkLabel="Club directory"
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED_CLUBS.map(({ team, stadium, district }) => (
          <Link
            key={team.id}
            to={clubPath(team.id)}
            className="group rounded-xl border border-line bg-surface p-4 shadow-card transition-all duration-150 hover:-translate-y-0.5 hover:shadow-raised"
          >
            <div className="flex items-center gap-3">
              <ClubBadge name={team.name} shortName={team.shortName} color={team.color} size="lg" />
              <div className="min-w-0">
                <p className="team-name truncate text-sm text-ink">{team.name}</p>
                <p className="caption mt-0.5 truncate">{district} district</p>
              </div>
            </div>
            <div className="mt-3.5 flex items-center justify-between gap-3 border-t border-line pt-3">
              <span className="caption flex min-w-0 items-center gap-1 truncate">
                <MapPin className="size-3 shrink-0" aria-hidden />
                {stadium}
              </span>
              <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary">
                Profile
                <ArrowRight
                  className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
