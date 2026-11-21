import { Check } from 'lucide-react'
import type { BracketRound, CompetitionTeam } from '@/config/competitions'
import { cn } from '@/utils/cn'

interface BracketViewProps {
  rounds: BracketRound[]
  championName?: string | null
}

function TeamSlot({ team, won }: { team: CompetitionTeam; won: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-md px-2 py-1.5 text-xs',
        won ? 'bg-live-soft text-live' : 'text-ink-muted',
      )}
    >
      <span
        className="grid size-6 shrink-0 place-items-center rounded text-[9px] font-bold text-white"
        style={{ backgroundColor: team.color }}
        aria-hidden
      >
        {team.shortName.slice(0, 3)}
      </span>
      <span className={cn('min-w-0 flex-1 truncate', won && 'font-bold')}>{team.name}</span>
      {won && <Check className="size-3.5 shrink-0" aria-label="Advanced to next round" />}
    </div>
  )
}

export function BracketView({ rounds, championName }: BracketViewProps) {
  return (
    <div>
      {championName && (
        <div className="mb-5 rounded-xl border border-live/30 bg-live-soft px-4 py-3">
          <p className="eyebrow text-live">Tournament winner</p>
          <p className="font-display mt-1 text-xl font-bold text-ink">{championName}</p>
        </div>
      )}
      <div className="overflow-x-auto rounded-xl border border-line bg-surface-muted p-4">
        <div className="flex min-w-max gap-5">
          {rounds.map((round, roundIndex) => (
            <section key={round.name} className="w-60 shrink-0">
              <div className="mb-3 flex items-baseline justify-between border-b border-line pb-2">
                <h3 className="text-sm font-bold text-ink">{round.name}</h3>
                <span className="caption">R{roundIndex + 1}</span>
              </div>
              <div className="space-y-3">
                {round.matches.map((match) => (
                  <article key={match.id} className="rounded-lg border border-line bg-surface p-2 shadow-card">
                    <TeamSlot team={match.home} won={match.winnerId === match.home.id} />
                    <TeamSlot team={match.away} won={match.winnerId === match.away.id} />
                    {match.dateISO && <p className="caption mt-1 px-2">{match.dateISO}</p>}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
