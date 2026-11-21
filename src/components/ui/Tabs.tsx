import { useRef, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

export interface TabItem<T extends string = string> {
  id: T
  label: string
  icon?: ReactNode
  badge?: ReactNode
  disabled?: boolean
}

type TabVariant = 'underline' | 'pill'
type TabTone = 'light' | 'dark'

interface TabsProps<T extends string> {
  items: TabItem<T>[]
  value: T
  onChange: (id: T) => void
  variant?: TabVariant
  tone?: TabTone
  ariaLabel?: string
  className?: string
}

const listClasses: Record<TabVariant, string> = {
  underline: 'gap-1 border-b',
  pill: 'gap-1 rounded-lg bg-surface-muted p-1',
}

const toneClasses: Record<TabTone, Record<TabVariant, { item: string; active: string }>> = {
  light: {
    underline: {
      item: 'border-transparent text-ink-muted hover:text-ink',
      active: 'border-primary text-primary',
    },
    pill: {
      item: 'text-ink-muted hover:text-ink',
      active: 'bg-white text-primary shadow-card',
    },
  },
  dark: {
    underline: {
      item: 'border-transparent text-navy-300 hover:text-white',
      active: 'border-live-bright text-white',
    },
    pill: {
      item: 'text-navy-300 hover:text-white',
      active: 'bg-elevated text-white',
    },
  },
}

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  variant = 'underline',
  tone = 'light',
  ariaLabel,
  className,
}: TabsProps<T>) {
  const listRef = useRef<HTMLDivElement>(null)

  const enabledItems = items.filter((item) => !item.disabled)

  const focusTab = (id: T) => {
    onChange(id)
    requestAnimationFrame(() => {
      const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      const index = Array.from(buttons ?? []).findIndex((button) => button.dataset.tabId === id)
      if (index !== undefined && index >= 0) buttons?.[index]?.focus()
    })
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = enabledItems.findIndex((item) => item.id === value)
    if (currentIndex === -1) return

    let nextIndex: number | null = null

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % enabledItems.length
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + enabledItems.length) % enabledItems.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = enabledItems.length - 1
    }

    if (nextIndex !== null) {
      event.preventDefault()
      focusTab(enabledItems[nextIndex].id)
    }
  }

  const tones = toneClasses[tone][variant]

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={cn('flex items-center overflow-x-auto', listClasses[variant], variant === 'underline' && (tone === 'dark' ? 'border-navy-700' : 'border-line'), className)}
    >
      {items.map((item) => {
        const active = item.id === value

        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            data-tab-id={item.id}
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            disabled={item.disabled}
            onClick={() => onChange(item.id)}
            className={cn(
              'nav-label inline-flex items-center gap-2 whitespace-nowrap px-3.5 py-2.5 font-medium transition-colors disabled:opacity-40',
              variant === 'underline' && 'border-b-2 -mb-px rounded-none',
              active ? tones.active : tones.item,
            )}
          >
            {item.icon}
            {item.label}
            {item.badge}
          </button>
        )
      })}
    </div>
  )
}
