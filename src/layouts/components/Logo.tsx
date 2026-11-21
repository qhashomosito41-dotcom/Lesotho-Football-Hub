import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { ROUTES } from '@/config/app'
import { cn } from '@/utils/cn'

interface LogoProps {
  to?: string
  showName?: true | false
  size?: 'md' | 'lg'
  className?: string
  children?: ReactNode
}

const markSizes = {
  md: 'size-9 text-[13px]',
  lg: 'size-11 text-sm',
}

export function Logo({ to = ROUTES.home, showName = true, size = 'md', className }: LogoProps) {
  return (
    <Link
      to={to}
      aria-label="Lesotho Football Hub — home"
      className={cn('group inline-flex min-w-0 items-center gap-2.5', className)}
    >
      <span
        className={cn(
          'grid shrink-0 place-items-center rounded-lg bg-gradient-to-br from-blue-600 via-navy-700 to-navy-900 font-display font-bold tracking-wider text-white ring-1 ring-white/15 transition-transform duration-150 group-hover:scale-105',
          markSizes[size],
        )}
      >
        LFH
      </span>
      {showName && (
        <span className="hidden min-w-0 truncate font-display text-lg font-semibold tracking-wide text-white sm:block lg:text-xl">
          Lesotho Football Hub
        </span>
      )}
    </Link>
  )
}
