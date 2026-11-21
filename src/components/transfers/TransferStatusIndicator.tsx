import { StatusBadge } from '@/components/ui'
import { TRANSFER_TYPE_LABELS, type TransferStatus, type TransferType } from '@/config/transfers'

interface TransferStatusIndicatorProps {
  status: TransferStatus
}

export function TransferStatusIndicator({ status }: TransferStatusIndicatorProps) {
  return status === 'approved' ? (
    <StatusBadge kind="finished" label="Approved" size="sm" />
  ) : (
    <StatusBadge kind="upcoming" label="Pending" size="sm" />
  )
}

interface TransferTypeBadgeProps {
  type: TransferType
}

export function TransferTypeBadge({ type }: TransferTypeBadgeProps) {
  const classes: Record<TransferType, string> = {
    permanent: 'bg-primary-soft text-primary',
    loan: 'bg-accent-soft text-accent-ink',
    'free-agent': 'bg-live-soft text-live',
  }

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase ${classes[type]}`}>
      {TRANSFER_TYPE_LABELS[type]}
    </span>
  )
}
