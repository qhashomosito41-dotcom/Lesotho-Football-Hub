import type { Size } from '@/types'
import { cn } from '@/utils/cn'

interface ClubBadgeProps {
  name: string
  shortName?: string
  logoUrl?: string | null
  color?: string
  size?: Size
  className?: string
}

const sizeClasses: Record<Size, string> = {
  sm: 'size-7 text-[9px]',
  md: 'size-9 text-[11px]',
  lg: 'size-12 text-sm',
}

function initials(name: string, shortName?: string): string {
  const source = (shortName ?? name).trim()
  if (!source) return 'FC'

  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length === 1) return source.length <= 4 ? source.toUpperCase() : source.slice(0, 3).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

export function ClubBadge({ name, shortName, logoUrl, color, size = 'md', className }: ClubBadgeProps) {
  const label = initials(name, shortName)

  return (
    <span
      className={cn(
        'inline-grid shrink-0 place-items-center overflow-hidden rounded-full font-display font-semibold tracking-wide text-white ring-1 ring-black/10',
        sizeClasses[size],
        className,
      )}
      style={{ backgroundColor: color ?? '#14213b' }}
      title={name}
    >
      {logoUrl ? (
        <img src={logoUrl} alt={`${name} badge`} className="size-full object-cover" loading="lazy" />
      ) : (
        <span aria-hidden>{label}</span>
      )}
      {logoUrl && <span className="sr-only">{name}</span>}
    </span>
  )
}
