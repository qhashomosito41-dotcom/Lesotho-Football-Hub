import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'

interface ProfileHeaderProps {
  avatar: ReactNode
  eyebrow: string
  title: string
  subtitle?: string
  meta?: { label: string; value: string }[]
  backTo?: string
  backLabel?: string
  className?: string
}

export function ProfileHeader({
  avatar,
  eyebrow,
  title,
  subtitle,
  meta = [],
  backTo,
  backLabel,
  className,
}: ProfileHeaderProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-navy-700 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 p-6 shadow-raised sm:p-8',
        className,
      )}
    >
      {backTo && (
        <Link
          to={backTo}
          className="mb-5 inline-flex items-center gap-1.5 text-xs font-semibold text-navy-200 transition-colors hover:text-white"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          {backLabel ?? 'Back'}
        </Link>
      )}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="shrink-0">{avatar}</div>
        <div className="min-w-0">
          <p className="eyebrow text-green-400">{eyebrow}</p>
          <h2 className="font-display mt-2 text-3xl font-bold text-white sm:text-4xl">{title}</h2>
          {subtitle && <p className="mt-2 text-sm text-navy-200">{subtitle}</p>}
          {meta.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {meta.map((item) => (
                <span
                  key={`${item.label}-${item.value}`}
                  className="rounded-full border border-navy-600 bg-navy-800 px-3 py-1 text-xs text-navy-100"
                >
                  <span className="text-navy-400">{item.label}: </span>
                  <span className="font-semibold">{item.value}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
