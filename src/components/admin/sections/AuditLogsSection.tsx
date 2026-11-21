import { useState } from 'react'
import { Download, Search, ShieldCheck } from 'lucide-react'
import { AdminPanel } from '@/components/admin'
import { Button, StatisticCard, Table, type TableColumn } from '@/components/ui'
import { ADMIN_AUDIT_LOGS, type AdminAuditLog } from '@/config/admin'
import type { AdminSectionProps } from './types'

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All categories' },
  ...Array.from(new Set(ADMIN_AUDIT_LOGS.map((log) => log.category))).map((category) => ({ value: category, label: category })),
]

export function AuditLogsSection({ search, onAction }: AdminSectionProps) {
  const [category, setCategory] = useState('all')
  const rows = ADMIN_AUDIT_LOGS.filter(
    (log) =>
      (category === 'all' || log.category === category) &&
      (!search ||
        log.user.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.affectedRecord.toLowerCase().includes(search.toLowerCase()) ||
        log.previousValue.toLowerCase().includes(search.toLowerCase()) ||
        log.newValue.toLowerCase().includes(search.toLowerCase())),
  )

  const columns: TableColumn<AdminAuditLog>[] = [
    { key: 'user', header: 'User', cell: (row) => <p className="font-semibold text-ink">{row.user}<span className="caption block">{row.category}</span></p> },
    { key: 'action', header: 'Action', cell: (row) => <span className="text-xs text-ink-muted">{row.action}</span> },
    { key: 'record', header: 'Affected record', cell: (row) => <span className="text-xs text-ink-muted">{row.affectedRecord}</span> },
    { key: 'date', header: 'Date and time', cell: (row) => <span className="text-xs font-semibold text-ink">{row.dateTime}</span> },
    { key: 'previous', header: 'Previous value', cell: (row) => <span className="text-xs text-ink-muted">{row.previousValue}</span> },
    { key: 'new', header: 'New value', cell: (row) => <span className="text-xs font-semibold text-ink">{row.newValue}</span> },
  ]

  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatisticCard label="Audit events" value={ADMIN_AUDIT_LOGS.length} icon={<ShieldCheck className="size-5" aria-hidden />} />
        <StatisticCard label="Categories" value={CATEGORY_OPTIONS.length - 1} icon={<Search className="size-5" aria-hidden />} />
        <StatisticCard label="Filtered results" value={rows.length} icon={<Search className="size-5" aria-hidden />} />
        <StatisticCard label="Retention" value="365" unit="days" icon={<ShieldCheck className="size-5" aria-hidden />} />
      </div>

      <AdminPanel
        title="Administrative audit trail"
        description="Every displayed entry includes the user, action, affected record, timestamp and value change."
        actions={
          <>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Filter audit logs by category"
              className="h-9 rounded-lg border border-line-strong bg-white px-3 text-xs font-semibold text-ink focus:border-primary focus:outline-none"
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <Button variant="outline" size="sm" iconLeft={<Download className="size-3.5" aria-hidden />} onClick={() => onAction('Audit log export is a frontend preview.')}>
              Export
            </Button>
          </>
        }
        bodyClassName="p-0"
      >
        <Table columns={columns} rows={rows} rowKey={(row) => row.id} caption="Administrative audit logs" compact />
      </AdminPanel>
    </>
  )
}
