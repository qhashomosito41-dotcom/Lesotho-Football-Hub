import type { TransferRecord } from '@/config/transfers'
import { TransferCard } from './TransferCard'

export interface TransferHistoryGroup {
  season: string
  transfers: TransferRecord[]
}

interface TransferTimelineProps {
  groups: TransferHistoryGroup[]
}

export function TransferTimeline({ groups }: TransferTimelineProps) {
  return (
    <div className="space-y-8">
      {groups.filter((group) => group.transfers.length > 0).map((group) => (
        <section key={group.season} className="relative pl-7">
          <span className="absolute top-1.5 left-0 size-3 rounded-full border-2 border-primary bg-white" aria-hidden />
          <span className="absolute top-4 bottom-0 left-[5px] w-px bg-line" aria-hidden />
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h3 className="font-display text-xl font-bold text-ink">Season {group.season}</h3>
            <p className="caption text-ink-muted">{group.transfers.length} transfers</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {group.transfers.map((transfer) => (
              <TransferCard key={transfer.id} transfer={transfer} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
