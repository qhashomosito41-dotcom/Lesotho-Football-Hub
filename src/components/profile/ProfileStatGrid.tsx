import { cn } from '@/utils/cn'

interface ProfileStatGridProps {
  stats: { label: string; value: string | number; unit?: string }[]
  columns?: 2 | 3 | 4 | 5
  className?: string
}

const columnClasses: Record<2 | 3 | 4 | 5, string> = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
  5: 'sm:grid-cols-3 lg:grid-cols-5',
}

export function ProfileStatGrid({ stats, columns = 3, className }: ProfileStatGridProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-3', columnClasses[columns], className)}>
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg border border-line bg-surface-muted px-3 py-3 text-center">
          <p className="stat-value text-xl">
            {stat.value}
            {stat.unit && <span className="ml-0.5 text-sm text-ink-muted">{stat.unit}</span>}
          </p>
          <p className="caption mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
