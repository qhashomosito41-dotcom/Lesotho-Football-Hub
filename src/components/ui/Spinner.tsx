import { Loader2 } from 'lucide-react'
import type { Size } from '@/types'
import { cn } from '@/utils/cn'

interface SpinnerProps {
  size?: Size
  label?: string
  className?: string
}

const sizeClasses: Record<Size, string> = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-10',
}

export function Spinner({ size = 'md', label, className }: SpinnerProps) {
  return (
    <span role="status" aria-label={label ?? 'Loading'} className={cn('inline-flex items-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-current', sizeClasses[size])} aria-hidden />
      {label && <span className="body-muted">{label}</span>}
    </span>
  )
}
