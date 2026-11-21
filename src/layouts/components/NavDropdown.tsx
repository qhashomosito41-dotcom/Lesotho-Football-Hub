import { ChevronDown } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useClickOutside, useEscapeKey } from '@/hooks'
import type { NavDropdownEntry } from '@/config/navigation'
import { cn } from '@/utils/cn'

interface NavDropdownProps {
  label: string
  items: NavDropdownEntry[]
}

const triggerBase =
  'nav-label inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-navy-200 transition-colors duration-150 hover:bg-white/10 hover:text-white'

function isItemActive(pathname: string, item: NavDropdownEntry): boolean {
  if (item.end) return pathname === item.to
  return pathname === item.to || pathname.startsWith(`${item.to}/`)
}

export function NavDropdown({ label, items }: NavDropdownProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const location = useLocation()

  const close = useCallback(() => setOpen(false), [])

  const closeAndFocus = useCallback(() => {
    setOpen(false)
    triggerRef.current?.focus()
  }, [])

  useClickOutside(rootRef, open, close)
  useEscapeKey(open, closeAndFocus)

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  const active = items.some((item) => isItemActive(location.pathname, item))

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={cn(triggerBase, active && 'bg-white/10 text-white')}
      >
        {label}
        <ChevronDown
          className={cn('size-3.5 transition-transform duration-150', open && 'rotate-180')}
          aria-hidden
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label={label}
          className="animate-fade-in absolute top-full left-0 z-50 mt-1.5 min-w-64 rounded-lg border border-line bg-surface p-1 shadow-raised"
        >
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              role="menuitem"
              onClick={close}
              className={({ isActive }) =>
                cn(
                  'flex flex-col gap-0.5 rounded-md px-3 py-2 text-sm transition-colors duration-150',
                  isActive
                    ? 'bg-primary-soft font-medium text-primary'
                    : 'text-ink hover:bg-surface-muted hover:text-ink',
                )
              }
            >
              <span>{item.label}</span>
              {item.caption && <span className="caption">{item.caption}</span>}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}
