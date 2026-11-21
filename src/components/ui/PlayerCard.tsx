import { User } from 'lucide-react'
import { cn } from '@/utils/cn'
import { ClubBadge } from './ClubBadge'

export interface PlayerCardStat {
  label: string
  value: string | number
}

interface PlayerCardProps {
  name: string
  position: string
  number: number
  photoUrl?: string | null
  nationality?: string
  club?: {
    name: string
    shortName?: string
    logoUrl?: string | null
    color?: string
  }
  stats?: PlayerCardStat[]
  className?: string
}

export function PlayerCard({ name, position, number, photoUrl, nationality, club, stats, className }: PlayerCardProps) {
  return (
    <article className={cn('overflow-hidden rounded-xl border border-line bg-surface shadow-card', className)}>
      <div className="relative bg-gradient-to-br from-navy-800 to-navy-950 px-4 pb-5 pt-4">
        <span
          className="pointer-events-none absolute top-1 right-3 font-display text-6xl leading-none font-bold text-white/10"
          aria-hidden
        >
          {number}
        </span>

        <div className="relative">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={name}
              className="size-16 rounded-full object-cover ring-2 ring-white/20"
              loading="lazy"
            />
          ) : (
            <div className="grid size-16 place-items-center rounded-full bg-elevated ring-2 ring-white/10">
              <User className="size-7 text-navy-300" aria-hidden />
            </div>
          )}
        </div>

        <p className="player-name relative mt-3 text-white">{name}</p>
        <div className="relative mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-white uppercase">
            {position}
          </span>
          {nationality && <span className="text-xs text-navy-300">{nationality}</span>}
        </div>

        {club && (
          <div className="relative mt-3 flex items-center gap-2">
            <ClubBadge
              name={club.name}
              shortName={club.shortName}
              logoUrl={club.logoUrl}
              color={club.color}
              size="sm"
            />
            <span className="truncate text-xs font-medium text-navy-200">{club.name}</span>
          </div>
        )}
      </div>

      {stats && stats.length > 0 && (
        <div className="grid grid-cols-3 divide-x divide-line border-t border-line">
          {stats.slice(0, 3).map((stat) => (
            <div key={stat.label} className="px-2 py-3 text-center">
              <p className="stat-value text-lg">{stat.value}</p>
              <p className="caption mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      )}
    </article>
  )
}
