import { Card, ClubBadge, EmptyState } from '@/components/ui'
import type { MatchDetail, MatchLineup } from '@/config/matches'
import type { DemoTeam } from '@/config/homepage'

interface MatchLineupsProps {
  match: MatchDetail
}

function TeamLineup({ team, lineup }: { team: DemoTeam; lineup: MatchLineup }) {
  return (
    <Card variant="dark">
      <div className="flex items-center justify-between gap-3 border-b border-navy-700 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <ClubBadge name={team.name} shortName={team.shortName} color={team.color} size="md" />
          <div className="min-w-0">
            <p className="team-name truncate text-sm text-white">{team.name}</p>
            <p className="caption truncate text-navy-400">Coach: {lineup.coach}</p>
          </div>
        </div>
        <span className="shrink-0 rounded-lg bg-white/5 px-2 py-1 font-display text-sm font-bold text-green-400">
          {lineup.formation}
        </span>
      </div>

      <div className="p-4">
        <p className="eyebrow mb-2 text-navy-400">Starting XI</p>
        <ul className="space-y-0.5">
          {lineup.starters.map((player) => (
            <li key={player.id} className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-white/5">
              <span className="grid size-6 shrink-0 place-items-center rounded bg-white/10 font-display text-xs font-bold text-white">
                {player.number}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-navy-100">{player.name}</span>
              {player.captain && (
                <span className="rounded bg-green-500/15 px-1 text-[10px] font-bold text-green-400">C</span>
              )}
              <span className="caption hidden text-navy-400 sm:block">{player.position}</span>
            </li>
          ))}
        </ul>

        <p className="eyebrow mt-5 mb-2 text-navy-400">Substitute bench</p>
        <ul className="grid gap-0.5 sm:grid-cols-2">
          {lineup.substitutes.map((player) => (
            <li key={player.id} className="flex items-center gap-2 rounded-lg px-2 py-1 text-xs text-navy-300">
              <span className="w-5 shrink-0 text-right font-display font-bold text-navy-400">{player.number}</span>
              <span className="truncate">{player.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}

export function MatchLineups({ match }: MatchLineupsProps) {
  if (match.status === 'upcoming') {
    return (
      <Card variant="dark" padding="default">
        <h2 className="section-title text-white">Line-ups</h2>
        <EmptyState
          tone="dark"
          title="Line-ups not submitted yet"
          description="Starting XIs and substitute benches will appear here once teams submit their matchday squads."
          className="py-8"
        />
      </Card>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <TeamLineup team={match.home} lineup={match.homeLineup} />
      <TeamLineup team={match.away} lineup={match.awayLineup} />
    </div>
  )
}
