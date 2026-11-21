import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface ChartFrameProps {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function ChartFrame({ title, description, action, children, className }: ChartFrameProps) {
  return (
    <section className={cn('min-w-0 rounded-xl border border-line bg-surface p-4 shadow-card sm:p-5', className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
          {description && <p className="caption mt-1 text-ink-muted">{description}</p>}
        </div>
        {action}
      </div>
      <div className="mt-4 min-w-0">{children}</div>
    </section>
  )
}
