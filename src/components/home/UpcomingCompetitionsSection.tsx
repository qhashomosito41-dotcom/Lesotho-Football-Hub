import { ArrowRight, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { UPCOMING_COMPETITIONS } from '@/config/homepage'
import { cn } from '@/utils/cn'
import { SectionHeading } from './SectionHeading'

interface UpcomingCompetitionsSectionProps {
  className?: string
}

export function UpcomingCompetitionsSection({ className }: UpcomingCompetitionsSectionProps) {
  return (
    <section className={className} aria-label="Upcoming competitions">
      <SectionHeading title="Competitions" description="National leagues and cup competitions." />
      <ul className="space-y-2.5">
        {UPCOMING_COMPETITIONS.map((competition) => (
          <li key={competition.id}>
            <Link
              to={competition.to}
              className="group flex items-center gap-3 rounded-xl border border-navy-700 bg-elevated p-4 transition-colors duration-150 hover:border-navy-500"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white/5 text-green-400">
                <Trophy className="size-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-base font-semibold uppercase tracking-wide text-white">
                  {competition.name}
                </p>
                <p className="body-muted mt-0.5 truncate text-navy-300">{competition.detail}</p>
              </div>
              <span
                className={cn(
                  'shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase',
                  competition.status === 'In progress'
                    ? 'border-green-500/40 bg-green-500/10 text-green-400'
                    : 'border-blue-500/40 bg-blue-500/10 text-blue-300',
                )}
              >
                {competition.status}
              </span>
              <ArrowRight
                className="size-4 shrink-0 text-navy-400 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-white"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
