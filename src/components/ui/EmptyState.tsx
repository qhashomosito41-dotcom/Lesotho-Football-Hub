import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'
import { cn } from '@/utils/cn'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  tone?: 'light' | 'dark'
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  tone = 'light',
  className,
}: EmptyStateProps) {
  const isDark = tone === 'dark'

  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-12 text-center', className)}>
      <div
        className={cn(
          'grid size-14 place-items-center rounded-full border',
          isDark ? 'border-navy-700 bg-elevated text-navy-300' : 'border-line bg-surface-muted text-ink-subtle',
        )}
      >
        {icon ?? <Inbox className="size-6" aria-hidden />}
      </div>
      <p className={cn('section-title mt-4', isDark && 'text-white')}>{title}</p>
      {description && (
        <p className={cn('body-muted mt-1 max-w-sm', isDark && 'text-navy-300')}>{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
