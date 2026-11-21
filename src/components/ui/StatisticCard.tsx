import { TrendingDown, TrendingUp } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface StatisticCardProps {
  label: string
  value: string | number
  unit?: string
  icon?: ReactNode
  trend?: {
    value: string
    direction: 'up' | 'down' | 'neutral'
  }
  caption?: string
  className?: string
}

const trendClasses = {
  up: 'text-live',
  down: 'text-danger',
  neutral: 'text-ink-muted',
} as const

export function StatisticCard({ label, value, unit, icon, trend, caption, className }: StatisticCardProps) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4 rounded-xl border border-line bg-surface p-4 shadow-card',
        className,
      )}
    >
      <div className="min-w-0">
        <p className="eyebrow">{label}</p>
        <p className="stat-value mt-2 text-3xl">
          {value}
          {unit && <span className="ml-0.5 text-lg text-ink-muted">{unit}</span>}
        </p>
        {trend && (
          <p className={cn('mt-2 flex items-center gap-1 text-xs font-semibold', trendClasses[trend.direction])}>
            {trend.direction === 'up' && <TrendingUp className="size-3.5" aria-hidden />}
            {trend.direction === 'down' && <TrendingDown className="size-3.5" aria-hidden />}
            {trend.value}
            {caption && <span className="font-normal text-ink-muted"> {caption}</span>}
          </p>
        )}
      </div>
      {icon && (
        <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">{icon}</div>
      )}
    </div>
  )
}
