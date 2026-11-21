import { Search, X } from 'lucide-react'
import { useEffect, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AuthButton } from '@/components/auth'
import { useEscapeKey, useLockBodyScroll } from '@/hooks'
import { ROUTES } from '@/config/app'
import { MAIN_NAV } from '@/config/navigation'
import { cn } from '@/utils/cn'
import { Logo } from './Logo'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  onSearch: () => void
}

const rowClasses = (isActive: boolean) =>
  cn(
    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150',
    isActive ? 'bg-white/10 text-white' : 'text-navy-200 hover:bg-white/5 hover:text-white',
  )

const childRowClasses = (isActive: boolean) =>
  cn(
    'flex flex-col gap-0.5 rounded-lg py-2 pr-3 pl-8 text-sm transition-colors duration-150',
    isActive ? 'bg-white/10 text-white' : 'text-navy-300 hover:bg-white/5 hover:text-white',
  )

export function MobileMenu({ open, onClose, onSearch }: MobileMenuProps) {
  const location = useLocation()

  useEscapeKey(open, onClose)
  useLockBodyScroll(open)

  useEffect(() => {
    onClose()
  }, [location.pathname, onClose])

  if (!open) return null

  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose()
  }

  return createPortal(
    <div className="animate-fade-in fixed inset-0 z-[80] bg-navy-950/70 backdrop-blur-sm lg:hidden" onMouseDown={handleMouseDown}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="animate-modal-in absolute inset-y-0 right-0 flex w-[min(22rem,88vw)] flex-col overflow-y-auto border-l border-navy-700 bg-header shadow-overlay"
      >
        <div className="flex items-center justify-between gap-3 border-b border-navy-700 px-4 py-3.5">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid size-9 shrink-0 place-items-center rounded-md text-navy-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <div className="px-4 pt-4">
          <button
            type="button"
            onClick={onSearch}
            className="flex w-full items-center gap-2.5 rounded-lg border border-navy-700 bg-elevated px-3 py-2.5 text-sm text-navy-400 transition-colors hover:border-navy-600 hover:text-navy-300"
          >
            <Search className="size-4" aria-hidden />
            Search LFH…
          </button>
        </div>

        <nav aria-label="Mobile navigation" className="flex flex-col gap-0.5 px-3 py-4">
          {MAIN_NAV.map((entry) =>
            entry.kind === 'link' ? (
              <NavLink
                key={entry.to}
                to={entry.to}
                end={entry.end}
                onClick={onClose}
                className={({ isActive }) => rowClasses(isActive)}
              >
                {entry.label}
              </NavLink>
            ) : (
              <div key={entry.label} className="mt-2 first:mt-0">
                <p className="eyebrow px-3 pb-1 text-navy-500">{entry.label}</p>
                {entry.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={onClose}
                    className={({ isActive }) => childRowClasses(isActive)}
                  >
                    <span className="text-[13px] font-medium">{item.label}</span>
                    {item.caption && <span className="caption text-navy-500">{item.caption}</span>}
                  </NavLink>
                ))}
              </div>
            ),
          )}
        </nav>

        <div className="mt-auto border-t border-navy-700 px-4 py-4">
          <AuthButton fullWidth onComplete={onClose} />
          <div className="mt-4 flex items-center justify-between">
            <Link to={ROUTES.privacy} onClick={onClose} className="caption text-navy-400 hover:text-white">
              Privacy Policy
            </Link>
            <Link to={ROUTES.terms} onClick={onClose} className="caption text-navy-400 hover:text-white">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </aside>
    </div>,
    document.body,
  )
}
