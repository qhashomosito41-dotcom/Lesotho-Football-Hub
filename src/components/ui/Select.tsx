import { Check, ChevronDown } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useClickOutside, useEscapeKey } from '@/hooks'
import type { Size } from '@/types'
import { cn } from '@/utils/cn'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps {
  options: SelectOption[]
  value?: string | null
  onChange: (value: string) => void
  placeholder?: string
  size?: Size
  ariaLabel?: string
  disabled?: boolean
  className?: string
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-2.5 text-xs',
  md: 'h-10 px-3 text-sm',
  lg: 'h-12 px-3.5 text-base',
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  size = 'md',
  ariaLabel,
  disabled = false,
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const selectedIndex = options.findIndex((option) => option.value === value)
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null

  const close = useCallback(() => setOpen(false), [])

  const closeAndFocus = useCallback(() => {
    setOpen(false)
    triggerRef.current?.focus()
  }, [])

  useClickOutside(rootRef, open, close)
  useEscapeKey(open, closeAndFocus)

  useEffect(() => {
    if (!open) return
    setActiveIndex(selectedIndex)
    requestAnimationFrame(() => listRef.current?.focus())
  }, [open, selectedIndex])

  const commit = (index: number) => {
    const option = options[index]
    if (!option || option.disabled) return
    onChange(option.value)
    closeAndFocus()
  }

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) setOpen(true)
    }
  }

  const handleListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => {
        let next = index
        for (let step = 0; step < options.length; step += 1) {
          next = (next + 1) % options.length
          if (!options[next]?.disabled) return next
        }
        return index
      })
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => {
        let next = index
        for (let step = 0; step < options.length; step += 1) {
          next = (next - 1 + options.length) % options.length
          if (!options[next]?.disabled) return next
        }
        return index
      })
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      commit(activeIndex)
    } else if (event.key === 'Home') {
      event.preventDefault()
      setActiveIndex(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      setActiveIndex(options.length - 1)
    }
  }

  return (
    <div ref={rootRef} className={cn('relative w-full', className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-lg border border-line bg-white text-left text-ink transition-colors hover:border-line-strong disabled:pointer-events-none disabled:opacity-50',
          sizeClasses[size],
          open && 'border-primary',
        )}
      >
        <span className={cn('truncate', !selected && 'text-ink-subtle')}>{selected?.label ?? placeholder}</span>
        <ChevronDown
          className={cn('size-4 shrink-0 text-ink-muted transition-transform duration-150', open && 'rotate-180')}
          aria-hidden
        />
      </button>

      {open && (
        <div
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          aria-label={ariaLabel}
          onKeyDown={handleListKeyDown}
          className="animate-fade-in absolute z-50 mt-1.5 max-h-60 w-full overflow-y-auto rounded-lg border border-line bg-white py-1 shadow-raised focus:outline-none"
        >
          {options.length === 0 && (
            <p className="body-muted px-3 py-2 text-ink-subtle">No options available</p>
          )}
          {options.map((option, index) => {
            const isSelected = option.value === value

            return (
              <div
                key={option.value}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled}
                onClick={() => commit(index)}
                onMouseEnter={() => !option.disabled && setActiveIndex(index)}
                className={cn(
                  'mx-1 flex cursor-pointer items-center justify-between gap-2 rounded-md px-2.5 py-2 text-sm transition-colors',
                  index === activeIndex && 'bg-surface-muted',
                  isSelected && 'font-semibold text-primary',
                  option.disabled && 'cursor-not-allowed opacity-40',
                )}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && <Check className="size-4 shrink-0" aria-hidden />}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
