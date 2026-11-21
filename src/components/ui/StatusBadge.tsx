import type { MatchStatus, MatchOutcome, Size } from '@/types'
import { cn } from '@/utils/cn'

export type StatusKind = MatchStatus | MatchOutcome | 'yellow-card' | 'red-card' | 'at-break'

interface StatusConfig {
  label: string
  className: string
  dot?: boolean
}

const statusConfigs: Record<StatusKind, StatusConfig> = {
  live: {
    label: 'LIVE',
    className: 'bg-live-soft text-live border-green-200',
    dot: true,
  },
  upcoming: {
    label: 'Upcoming',
    className: 'bg-primary-soft text-primary border-blue-200',
  },
  finished: {
    label: 'Finished',
    className: 'bg-surface-sunken text-ink-muted border-line',
  },
  postponed: {
    label: 'Postponed',
    className: 'bg-accent-soft text-accent-ink border-orange-200',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-danger-soft text-danger border-red-200',
  },
  'at-break': {
    label: 'HT',
    className: 'bg-accent-soft text-accent-ink border-orange-200',
  },
  win: {
    label: 'W',
    className: 'bg-live text-white border-transparent',
  },
  draw: {
    label: 'D',
    className: 'bg-grey-400 text-white border-transparent',
  },
  loss: {
    label: 'L',
    className: 'bg-danger text-white border-transparent',
  },
  'yellow-card': {
    label: 'YC',
    className: 'bg-orange-400 text-white border-transparent',
  },
  'red-card': {
    label: 'RC',
    className: 'bg-danger text-white border-transparent',
  },
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-5 min-w-5 gap-1 px-1.5 text-[10px]',
  md: 'h-6 gap-1.5 px-2 text-[11px]',
  lg: 'h-7 gap-1.5 px-2.5 text-xs',
}

interface StatusBadgeProps {
  kind: StatusKind
  label?: string
  size?: Size
  className?: string
}

export function StatusBadge({ kind, label, size = 'md', className }: StatusBadgeProps) {
  const config = statusConfigs[kind]

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full border font-semibold tracking-wide whitespace-nowrap uppercase',
        config.className,
        sizeClasses[size],
        className,
      )}
    >
      {config.dot && <span className="size-1.5 animate-live-dot rounded-full bg-live" aria-hidden />}
      {label ?? config.label}
    </span>
  )
}
