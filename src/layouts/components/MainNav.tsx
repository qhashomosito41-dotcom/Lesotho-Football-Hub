import { MAIN_NAV } from '@/config/navigation'
import { cn } from '@/utils/cn'
import { NavNavLink } from '@/components/ui'
import { NavDropdown } from './NavDropdown'

interface MainNavProps {
  className?: string
}

export function MainNav({ className }: MainNavProps) {
  return (
    <nav
      aria-label="Main navigation"
      className={cn(
        'flex h-11 items-center gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className,
      )}
    >
      {MAIN_NAV.map((entry) =>
        entry.kind === 'link' ? (
          <NavNavLink key={entry.to} to={entry.to} end={entry.end} tone="dark" className="shrink-0">
            {entry.label}
          </NavNavLink>
        ) : (
          <NavDropdown key={entry.label} label={entry.label} items={entry.items} />
        ),
      )}
    </nav>
  )
}
