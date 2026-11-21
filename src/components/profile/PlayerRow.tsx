import { Link } from 'react-router-dom'
import { playerPath, type PlayerProfile } from '@/config/players'

interface PlayerRowProps {
  player: PlayerProfile
}

export function PlayerRow({ player }: PlayerRowProps) {
  return (
    <Link
      to={playerPath(player.id)}
      className="flex items-center gap-3 rounded-lg border border-line bg-surface px-3 py-2.5 transition-colors hover:border-primary hover:bg-surface-muted"
    >
      <img src={player.photoUrl} alt="" className="size-10 shrink-0 rounded-full object-cover" loading="lazy" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">{player.name}</p>
        <p className="caption truncate">{player.position}</p>
      </div>
      <span className="font-display text-sm font-bold tabular-nums text-ink-muted">#{player.number}</span>
    </Link>
  )
}
