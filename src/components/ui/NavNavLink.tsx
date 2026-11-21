import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import type { LinkProps } from 'react-router-dom'
import { cn } from '@/utils/cn'

export type NavNavLinkTone = 'dark' | 'light'

interface NavNavLinkProps extends Omit<LinkProps, 'className' | 'children'> {
  end?: boolean
  tone?: NavNavLinkTone
  className?: string
  children: ReactNode
}

const toneClasses: Record<NavNavLinkTone, { base: string; active: string }> = {
  dark: {
    base: 'text-navy-200 hover:bg-white/10 hover:text-white',
    active: 'bg-white/10 text-white',
  },
  light: {
    base: 'text-ink-muted hover:bg-surface-muted hover:text-ink',
    active: 'bg-primary-soft text-primary',
  },
}

export function NavNavLink({ tone = 'dark', className, children, ...rest }: NavNavLinkProps) {
  const tones = toneClasses[tone]

  return (
    <NavLink
      className={({ isActive }) =>
        cn(
          'nav-label inline-flex items-center gap-2 rounded-md px-3 py-2 transition-colors duration-150',
          tones.base,
          isActive && tones.active,
          className,
        )
      }
      {...rest}
    >
      {children}
    </NavLink>
  )
}
