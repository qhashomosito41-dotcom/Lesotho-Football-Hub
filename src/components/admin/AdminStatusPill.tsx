import { cn } from '@/utils/cn'

interface AdminStatusPillProps {
  status: string
  label?: string
  className?: string
}

const statuses: Record<string, string> = {
  Active: 'bg-live-soft text-live border-green-200',
  Verified: 'bg-live-soft text-live border-green-200',
  Approved: 'bg-live-soft text-live border-green-200',
  Current: 'bg-live-soft text-live border-green-200',
  Published: 'bg-live-soft text-live border-green-200',
  Live: 'bg-live-soft text-live border-green-200',
  Pending: 'bg-accent-soft text-accent-ink border-orange-200',
  Draft: 'bg-accent-soft text-accent-ink border-orange-200',
  Review: 'bg-accent-soft text-accent-ink border-orange-200',
  Suspended: 'bg-danger-soft text-danger border-red-200',
  Rejected: 'bg-danger-soft text-danger border-red-200',
  Archived: 'bg-surface-sunken text-ink-muted border-line',
  Completed: 'bg-surface-sunken text-ink-muted border-line',
  Confirmed: 'bg-primary-soft text-primary border-blue-200',
}

export function AdminStatusPill({ status, label, className }: AdminStatusPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wide whitespace-nowrap uppercase',
        statuses[status] ?? 'bg-surface-sunken text-ink-muted border-line',
        className,
      )}
    >
      {label ?? status}
    </span>
  )
}
