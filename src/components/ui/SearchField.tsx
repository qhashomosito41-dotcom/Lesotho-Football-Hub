import { Loader2, Search, X } from 'lucide-react'
import type { ChangeEvent } from 'react'
import type { Size } from '@/types'
import { cn } from '@/utils/cn'

interface SearchFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  size?: Size
  loading?: boolean
  ariaLabel?: string
  className?: string
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 pl-8 pr-8 text-xs',
  md: 'h-10 pl-10 pr-9 text-sm',
  lg: 'h-12 pl-11 pr-10 text-base',
}

const iconClasses: Record<Size, string> = {
  sm: 'left-2.5 size-3.5',
  md: 'left-3 size-4',
  lg: 'left-3.5 size-5',
}

const trailingClasses: Record<Size, string> = {
  sm: 'right-1.5 size-6',
  md: 'right-1.5 size-7',
  lg: 'right-2 size-8',
}

export function SearchField({
  value,
  onChange,
  placeholder = 'Search…',
  size = 'md',
  loading = false,
  ariaLabel,
  className,
}: SearchFieldProps) {
  const handleClear = () => onChange('')

  return (
    <div className={cn('relative w-full', className)}>
      <span className={cn('pointer-events-none absolute top-1/2 -translate-y-1/2 text-ink-subtle', iconClasses[size])}>
        {loading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <Search className="size-full" aria-hidden />
        )}
      </span>
      <input
        type="text"
        role="searchbox"
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        className={cn(
          'w-full rounded-lg border border-line bg-white text-ink placeholder:text-ink-subtle transition-colors focus:border-primary focus:outline-none',
          sizeClasses[size],
        )}
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className={cn(
            'absolute top-1/2 grid -translate-y-1/2 place-items-center rounded-full text-ink-subtle transition-colors hover:bg-surface-muted hover:text-ink',
            trailingClasses[size],
          )}
        >
          <X className="size-3.5" aria-hidden />
        </button>
      )}
    </div>
  )
}
