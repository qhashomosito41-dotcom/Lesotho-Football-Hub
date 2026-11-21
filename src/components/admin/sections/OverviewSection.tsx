import { Activity, Building2, Clock3, Trophy, UserPlus, Users } from 'lucide-react'
import { AdminPanel, AdminProgressBar, AdminStatusPill } from '@/components/admin'
import { Button, StatisticCard, Table, type TableColumn } from '@/components/ui'
import {
  ADMIN_AUDIT_LOGS,
  ADMIN_REQUESTS,
  ADMIN_STATS,
  type AdminAccessRequest,
  type AdminAuditLog,
  type AdminSectionId,
} from '@/config/admin'
import { LIVE_MATCHES } from '@/config/homepage'

interface OverviewSectionProps {
  onAction: (message: string) => void
  onNavigate: (section: AdminSectionId) => void
}

const buildRequestColumns = (onAction: (message: string) => void): TableColumn<AdminAccessRequest>[] => [
  {
    key: 'name',
    header: 'Applicant',
    cell: (row) => (
      <div className="min-w-0">
        <p className="font-semibold text-ink">{row.name}</p>
        <p className="caption truncate">{row.email}</p>
      </div>
    ),
  },
  { key: 'role', header: 'Requested role', cell: (row) => <span className="text-xs text-ink-muted">{row.requestedRole.replace(/-/g, ' ')}</span> },
  { key: 'submitted', header: 'Submitted', cell: (row) => <span className="text-xs text-ink-muted">{row.submitted}</span> },
  { key: 'status', header: 'Status', cell: (row) => <AdminStatusPill status={row.status} /> },
  {
    key: 'actions',
    header: 'Action',
    align: 'right',
    cell: () => (
      <Button
        variant="outline"
        size="sm"
        onClick={(event) => {
          event.stopPropagation()
          onAction('Account request review is a frontend preview.')
        }}
      >
        Review
      </Button>
    ),
  },
]

const auditColumns: TableColumn<AdminAuditLog>[] = [
  { key: 'user', header: 'User', cell: (row) => <span className="font-semibold text-ink">{row.user}</span> },
  { key: 'action', header: 'Action', cell: (row) => <span className="text-xs text-ink-muted">{row.action}</span> },
  { key: 'record', header: 'Affected record', cell: (row) => <span className="text-xs text-ink-muted">{row.affectedRecord}</span> },
  { key: 'date', header: 'Date and time', cell: (row) => <span className="text-xs text-ink-muted">{row.dateTime}</span> },
  { key: 'previous', header: 'Previous value', cell: (row) => <span className="text-xs text-ink-muted">{row.previousValue}</span> },
  { key: 'new', header: 'New value', cell: (row) => <span className="text-xs font-semibold text-ink">{row.newValue}</span> },
]

export function OverviewSection({ onAction, onNavigate }: OverviewSectionProps) {
  const pendingRequests = ADMIN_REQUESTS.filter((request) => request.status === 'Pending')
  const requestColumns = buildRequestColumns(onAction)

  return (
    <>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-3 2xl:grid-cols-6">
        <StatisticCard label="Total registered clubs" value={ADMIN_STATS.clubs} icon={<Building2 className="size-5" aria-hidden />} trend={{ value: '+2 this season', direction: 'up' }} />
        <StatisticCard label="Total players" value={ADMIN_STATS.players} icon={<Users className="size-5" aria-hidden />} trend={{ value: '+18 this month', direction: 'up' }} />
        <StatisticCard label="Total competitions" value={ADMIN_STATS.competitions} icon={<Trophy className="size-5" aria-hidden />} trend={{ value: '3 active', direction: 'neutral' }} />
        <StatisticCard label="Total registered users" value={ADMIN_STATS.users} icon={<UserPlus className="size-5" aria-hidden />} trend={{ value: `${ADMIN_STATS.pendingApprovals} awaiting review`, direction: 'up' }} />
        <StatisticCard label="Active matches" value={ADMIN_STATS.activeMatches} icon={<Activity className="size-5" aria-hidden />} trend={{ value: 'live now', direction: 'neutral' }} />
        <StatisticCard label="Pending approvals" value={ADMIN_STATS.pendingApprovals} icon={<Clock3 className="size-5" aria-hidden />} trend={{ value: `${ADMIN_STATS.pendingTransfers} pending transfers`, direction: 'up' }} />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <AdminPanel
          title="Approval queue"
          description="Account requests waiting for administrative review."
          className="xl:col-span-2"
          actions={
            <Button variant="outline" size="sm" onClick={() => onNavigate('users')}>
              Open user management
            </Button>
          }
          bodyClassName="p-0"
        >
          <Table
            columns={requestColumns}
            rows={pendingRequests}
            rowKey={(row) => row.id}
            caption="Pending account requests"
            compact
          />
        </AdminPanel>

        <div className="space-y-5">
          <AdminPanel title="Platform health" description="Completeness of core administrative records.">
            <div className="space-y-4">
              <AdminProgressBar label="Club verification" value={80} caption="8 of 10 sampled clubs verified" tone="live" />
              <AdminProgressBar label="Player registration" value={94} caption="Profiles with current-season stats" tone="primary" />
              <AdminProgressBar label="Fixture publication" value={87} caption="Matchweek 7 fixtures published" tone="accent" />
              <AdminProgressBar label="Audit coverage" value={100} caption="Administrative actions tracked" tone="live" />
            </div>
          </AdminPanel>

          <AdminPanel
            title="Live match control"
            description="Matches currently marked active on the platform."
            actions={
              <Button variant="ghost" size="sm" onClick={() => onNavigate('matches')}>
                Manage
              </Button>
            }
          >
            <div className="space-y-3">
              {LIVE_MATCHES.map((match) => (
                <div key={match.id} className="rounded-lg border border-line bg-surface-muted px-3 py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs font-semibold text-ink">
                      {match.home.shortName} {match.homeScore}–{match.awayScore} {match.away.shortName}
                    </p>
                    <AdminStatusPill status="Live" label={`${match.minute}'`} />
                  </div>
                  <p className="caption mt-1 truncate">{match.competition} · {match.venue}</p>
                </div>
              ))}
            </div>
          </AdminPanel>
        </div>
      </div>

      <AdminPanel
        title="Recent administrative activities"
        description="Latest actions recorded across users, competitions, results and settings."
        actions={
          <Button variant="outline" size="sm" onClick={() => onNavigate('audit')}>
            View all audit logs
          </Button>
        }
        bodyClassName="p-0"
      >
        <Table
          columns={auditColumns}
          rows={ADMIN_AUDIT_LOGS.slice(0, 6)}
          rowKey={(row) => row.id}
          caption="Recent administrative activities"
          compact
        />
      </AdminPanel>
    </>
  )
}
