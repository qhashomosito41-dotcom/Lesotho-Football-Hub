import { cn } from '@/utils/cn'

interface AdminProgressBarProps {
  label: string
  value: number
  caption?: string
  tone?: 'primary' | 'live' | 'accent'
  className?: string
}

const barTones = {
  primary: 'bg-primary',
  live: 'bg-live',
  accent: 'bg-accent',
}

export function AdminProgressBar({ label, value, caption, tone = 'primary', className }: AdminProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div className={cn('min-w-0', className)}>
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="truncate font-semibold text-ink">{label}</span>
        <span className="shrink-0 font-bold text-ink-muted">{clamped}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-sunken">
        <div className={cn('h-full rounded-full transition-all', barTones[tone])} style={{ width: `${clamped}%` }} />
      </div>
      {caption && <p className="caption mt-1.5">{caption}</p>}
    </div>
  )
}
