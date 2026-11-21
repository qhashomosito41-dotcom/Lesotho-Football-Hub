import { useMemo, useState, type ReactNode } from 'react'
import { DemoNotice } from '@/components/home/DemoNotice'
import { TransferCard, TransferTimeline } from '@/components/transfers'
import { EmptyState, Select, Tabs } from '@/components/ui'
import {
  filterTransfers,
  TRANSFER_SEASONS,
  TRANSFER_STATUS_OPTIONS,
  TRANSFER_TYPE_OPTIONS,
  transferCounts,
  transferHistory,
  type TransferFilters,
  type TransferStatus,
  type TransferType,
} from '@/config/transfers'

type TransferTab = 'overview' | 'arrivals' | 'departures' | 'history'

const TABS: { id: TransferTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'arrivals', label: 'Arrivals' },
  { id: 'departures', label: 'Departures' },
  { id: 'history', label: 'Transfer history' },
]

export default function TransferCentrePage() {
  const [tab, setTab] = useState<TransferTab>('overview')
  const [season, setSeason] = useState('all')
  const [type, setType] = useState<TransferType | 'all'>('all')
  const [status, setStatus] = useState<TransferStatus | 'all'>('all')

  const direction: TransferFilters['direction'] = tab === 'arrivals' ? 'arrival' : tab === 'departures' ? 'departure' : 'all'

  const records = useMemo(
    () => filterTransfers({ season, direction, type, status }),
    [season, direction, type, status],
  )
  const counts = useMemo(() => transferCounts(season), [season])
  const approved = useMemo(
    () => filterTransfers({ season, direction, type, status: 'approved' }).slice(0, 6),
    [season, direction, type],
  )
  const pending = useMemo(
    () => filterTransfers({ season, direction, type, status: 'pending' }).slice(0, 6),
    [season, direction, type],
  )
  const historyGroups = useMemo(
    () =>
      transferHistory(season).map((group) => ({
        season: group.season,
        transfers: group.transfers.filter(
          (transfer) =>
            (direction === 'all' || transfer.direction === direction) &&
            (type === 'all' || transfer.type === type) &&
            (status === 'all' || transfer.status === status),
        ),
      })),
    [season, direction, type, status],
  )

  const cards = [
    { label: 'Player arrivals', value: counts.arrivals, tab: 'arrivals' as TransferTab, type: 'all' as TransferType | 'all' },
    { label: 'Player departures', value: counts.departures, tab: 'departures' as TransferTab, type: 'all' as TransferType | 'all' },
    { label: 'Permanent transfers', value: counts.permanent, tab: 'overview' as TransferTab, type: 'permanent' as TransferType | 'all' },
    { label: 'Loan transfers', value: counts.loan, tab: 'overview' as TransferTab, type: 'loan' as TransferType | 'all' },
    { label: 'Free agents', value: counts.freeAgents, tab: 'overview' as TransferTab, type: 'free-agent' as TransferType | 'all' },
    { label: 'Approved transfers', value: counts.approved, tab: 'overview' as TransferTab, type: 'all' as TransferType | 'all', status: 'approved' as TransferStatus | 'all' },
    { label: 'Pending transfers', value: counts.pending, tab: 'overview' as TransferTab, type: 'all' as TransferType | 'all', status: 'pending' as TransferStatus | 'all' },
    { label: 'Transfer history', value: counts.arrivals + counts.departures, tab: 'history' as TransferTab, type: 'all' as TransferType | 'all' },
  ]

  const showApproved = status === 'all' || status === 'approved'
  const showPending = status === 'all' || status === 'pending'

  const overview = (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <button
            key={card.label}
            type="button"
            onClick={() => {
              setTab(card.tab)
              setType(card.type)
              setStatus(card.status ?? 'all')
            }}
            className="rounded-xl border border-line bg-surface p-4 text-left shadow-card transition-colors hover:border-primary"
          >
            <p className="eyebrow">{card.label}</p>
            <p className="font-display mt-2 text-3xl font-bold text-ink">{card.value}</p>
            <p className="caption mt-1 text-ink-muted">View {card.label.toLowerCase()}</p>
          </button>
        ))}
      </div>

      <div className={`mt-6 grid gap-5 ${showApproved && showPending ? 'lg:grid-cols-2' : ''}`}>
        {showApproved && (
          <section className="min-w-0 rounded-xl border border-line bg-surface p-4 shadow-card sm:p-5">
            <h2 className="font-display text-xl font-bold text-ink">Approved transfers</h2>
            <p className="caption mt-1 text-ink-muted">Only approved transfers are presented as completed moves.</p>
            <div className="mt-4 grid gap-3">
              {approved.length > 0 ? (
                approved.map((transfer) => <TransferCard key={transfer.id} transfer={transfer} />)
              ) : (
                <EmptyState title="No approved transfers" description="No approved moves match these filters." />
              )}
            </div>
          </section>
        )}

        {showPending && (
          <section className="min-w-0 rounded-xl border border-line bg-surface p-4 shadow-card sm:p-5">
            <h2 className="font-display text-xl font-bold text-ink">Pending transfers</h2>
            <p className="caption mt-1 text-ink-muted">Pending moves remain labelled pending and are not completed.</p>
            <div className="mt-4 grid gap-3">
              {pending.length > 0 ? (
                pending.map((transfer) => <TransferCard key={transfer.id} transfer={transfer} />)
              ) : (
                <EmptyState title="No pending transfers" description="No pending moves match these filters." />
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  )

  const listView = (
    <div>
      <h2 className="font-display mb-4 text-xl font-bold text-ink">
        {tab === 'arrivals' ? 'Player arrivals' : 'Player departures'}
      </h2>
      {records.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {records.map((transfer) => (
            <TransferCard key={transfer.id} transfer={transfer} />
          ))}
        </div>
      ) : (
        <EmptyState title="No transfers found" description="Try changing the season, type or status filter." />
      )}
    </div>
  )

  const historyView = (
    <div>
      <h2 className="font-display mb-4 text-xl font-bold text-ink">Transfer history</h2>
      <TransferTimeline groups={historyGroups} />
    </div>
  )

  const panels: Record<TransferTab, ReactNode> = {
    overview,
    arrivals: listView,
    departures: listView,
    history: historyView,
  }

  return (
    <>
      <DemoNotice />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <p className="eyebrow text-green-400">Registration desk</p>
        <h1 className="page-title mt-2 text-white">Transfer centre</h1>
        <p className="body-muted mt-3 max-w-2xl text-navy-200">
          Browse arrivals, departures and registration history. Demonstration statuses clearly separate approved and pending moves.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="mb-1.5 text-[10px] font-semibold tracking-wider text-navy-300 uppercase">Season</p>
            <Select
              options={[
                { value: 'all', label: 'All seasons' },
                ...TRANSFER_SEASONS.map((value) => ({ value, label: value })),
              ]}
              value={season}
              onChange={setSeason}
              ariaLabel="Filter transfers by season"
              size="lg"
            />
          </div>
          <div>
            <p className="mb-1.5 text-[10px] font-semibold tracking-wider text-navy-300 uppercase">Transfer type</p>
            <Select
              options={TRANSFER_TYPE_OPTIONS}
              value={type}
              onChange={(value) => setType(value as TransferType | 'all')}
              ariaLabel="Filter transfers by type"
              size="lg"
            />
          </div>
          <div>
            <p className="mb-1.5 text-[10px] font-semibold tracking-wider text-navy-300 uppercase">Status</p>
            <Select
              options={TRANSFER_STATUS_OPTIONS}
              value={status}
              onChange={(value) => setStatus(value as TransferStatus | 'all')}
              ariaLabel="Filter transfers by status"
              size="lg"
            />
          </div>
        </div>
        <div className="mt-6 rounded-xl border border-line bg-surface p-2">
          <Tabs items={TABS} value={tab} onChange={setTab} ariaLabel="Transfer centre sections" />
          <div role="tabpanel" aria-label={TABS.find((item) => item.id === tab)?.label} className="p-4 sm:p-6">
            {panels[tab]}
          </div>
        </div>
      </div>
    </>
  )
}
