import { Link } from 'react-router-dom'
import { PlayerCard } from '@/components/ui'
import type { ScorerEntry } from '@/config/scorers'

interface GoldenBootPodiumProps {
  scorers: ScorerEntry[]
}

const rankStyles: Record<number, string> = {
  1: 'bg-accent text-white',
  2: 'bg-navy-500 text-white',
  3: 'bg-orange-700 text-white',
}

export function GoldenBootPodium({ scorers }: GoldenBootPodiumProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {scorers.slice(0, 3).map((scorer) => (
        <Link key={scorer.id} to={scorer.to} className="group relative block">
          <span
            className={`absolute -top-2 -left-2 z-10 grid size-9 place-items-center rounded-full text-xs font-bold shadow-raised ${rankStyles[scorer.rank] ?? 'bg-navy-700 text-white'}`}
            aria-label={`Position ${scorer.rank}`}
          >
            {scorer.rank}
          </span>
          <PlayerCard
            name={scorer.name}
            position={scorer.position}
            number={scorer.rank}
            photoUrl={scorer.photoUrl}
            club={{
              name: scorer.clubName,
              shortName: scorer.clubShortName,
              color: scorer.clubColor,
            }}
            stats={[
              { label: 'Goals', value: scorer.goals },
              { label: 'Assists', value: scorer.assists ?? '—' },
              { label: 'Season', value: scorer.season },
            ]}
            className="h-full transition-transform duration-150 group-hover:-translate-y-0.5"
          />
        </Link>
      ))}
    </div>
  )
}
