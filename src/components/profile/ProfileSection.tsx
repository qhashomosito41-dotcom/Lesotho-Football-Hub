import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface ProfileSectionProps {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function ProfileSection({ title, description, action, children, className }: ProfileSectionProps) {
  return (
    <section className={cn('overflow-hidden rounded-xl border border-line bg-surface shadow-card', className)}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4">
        <div>
          <h2 className="card-title">{title}</h2>
          {description && <p className="body-muted mt-1 text-xs">{description}</p>}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  )
}
