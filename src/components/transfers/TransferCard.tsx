import { ArrowRight, CalendarDays } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDateShort } from '@/config/league'
import type { TransferRecord } from '@/config/transfers'
import { TransferStatusIndicator, TransferTypeBadge } from './TransferStatusIndicator'

interface TransferCardProps {
  transfer: TransferRecord
}

export function TransferCard({ transfer }: TransferCardProps) {
  return (
    <article className="flex min-w-0 flex-col gap-4 rounded-xl border border-line bg-surface p-4 shadow-card">
      <div className="flex min-w-0 items-start gap-3">
        <img src={transfer.photoUrl} alt="" className="size-11 shrink-0 rounded-full object-cover" loading="lazy" />
        <div className="min-w-0 flex-1">
          <Link to={transfer.playerTo} className="block truncate font-semibold text-ink transition-colors hover:text-primary">
            {transfer.playerName}
          </Link>
          <p className="caption mt-0.5">{transfer.direction === 'arrival' ? 'Player arrival' : 'Player departure'}</p>
        </div>
        <TransferStatusIndicator status={transfer.status} />
      </div>

      <div className="flex min-w-0 items-center gap-2 rounded-lg bg-surface-muted px-3 py-2.5">
        <span className="min-w-0 flex-1 truncate text-xs font-semibold text-ink">{transfer.fromClub}</span>
        <ArrowRight className="size-4 shrink-0 text-ink-subtle" aria-hidden />
        <span className="min-w-0 flex-1 truncate text-right text-xs font-semibold text-ink">{transfer.toClub}</span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <TransferTypeBadge type={transfer.type} />
        <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="size-3.5" aria-hidden />
            {formatDateShort(transfer.dateISO)}
          </span>
          <span className="font-semibold text-ink">{transfer.feeLabel}</span>
        </div>
      </div>
    </article>
  )
}
