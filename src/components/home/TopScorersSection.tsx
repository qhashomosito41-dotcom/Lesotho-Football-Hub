import { ROUTES } from '@/config/app'
import { TOP_SCORERS } from '@/config/homepage'
import { SectionHeading } from './SectionHeading'

interface TopScorersSectionProps {
  className?: string
}

function playerInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function TopScorersSection({ className }: TopScorersSectionProps) {
  return (
    <section className={className} aria-label="Top scorers">
      <SectionHeading
        title="Top scorers"
        description="Leading goalscorers this season."
        to={ROUTES.topScorers}
        linkLabel="Full list"
      />
      <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-card">
        <ol>
          {TOP_SCORERS.map((player, index) => (
            <li
              key={player.id}
              className="flex items-center gap-3 border-b border-line px-4 py-3 last:border-b-0"
            >
              <span className="w-4 shrink-0 text-center font-display text-sm font-bold tabular-nums text-ink-subtle">
                {index + 1}
              </span>
              <span
                className="grid size-9 shrink-0 place-items-center rounded-full bg-navy-800 font-display text-xs font-semibold tracking-wide text-white"
                aria-hidden
              >
                {playerInitials(player.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{player.name}</p>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span
                    className="size-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: player.club.color }}
                    aria-hidden
                  />
                  <span className="caption truncate">{player.club.name}</span>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="stat-value text-xl">{player.goals}</p>
                <p className="caption text-[10px] uppercase tracking-wider">goals</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
