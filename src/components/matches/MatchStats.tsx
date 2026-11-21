import { Card } from '@/components/ui'
import type { MatchDetail } from '@/config/matches'

interface MatchStatsProps {
  match: MatchDetail
}

export function MatchStats({ match }: MatchStatsProps) {
  return (
    <Card variant="dark" padding="default">
      <h2 className="section-title text-white">Match statistics</h2>
      {match.status === 'upcoming' ? (
        <p className="body-muted mt-4 text-navy-300">
          Statistics will be available once this match kicks off.
        </p>
      ) : (
        <ul className="mt-5 space-y-4">
          {match.stats.map((stat) => {
            const total = stat.home + stat.away
            const homeShare = total === 0 ? 50 : Math.round((stat.home / total) * 100)

            return (
              <li key={stat.label}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-display font-bold tabular-nums text-white">
                    {stat.home}
                    {stat.suffix}
                  </span>
                  <span className="caption text-navy-300">{stat.label}</span>
                  <span className="font-display font-bold tabular-nums text-white">
                    {stat.away}
                    {stat.suffix}
                  </span>
                </div>
                <div className="mt-1.5 flex h-1.5 overflow-hidden rounded-full bg-navy-700">
                  <span className="bg-live" style={{ width: `${homeShare}%` }} aria-hidden />
                  <span className="bg-primary" style={{ width: `${100 - homeShare}%` }} aria-hidden />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
