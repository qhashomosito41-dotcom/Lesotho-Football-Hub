import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'

interface SectionHeadingProps {
  title: string
  description?: string
  to?: string
  linkLabel?: string
  badge?: ReactNode
  className?: string
}

export function SectionHeading({
  title,
  description,
  to,
  linkLabel = 'View all',
  badge,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('mb-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-2.5', className)}>
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <span className="h-5 w-1 shrink-0 rounded-full bg-live" aria-hidden />
          <h2 className="section-title text-white">{title}</h2>
          {badge}
        </div>
        {description && <p className="body-muted mt-1 text-navy-300">{description}</p>}
      </div>
      {to && (
        <Link
          to={to}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-navy-200 transition-colors duration-150 hover:text-white"
        >
          {linkLabel}
          <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
        </Link>
      )}
    </div>
  )
}
