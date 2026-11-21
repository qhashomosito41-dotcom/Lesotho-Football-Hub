import { Activity, AlertTriangle, Building2, CalendarDays, CheckCircle2, Clock3, Trophy, Users, UserCheck, ArrowLeftRight } from 'lucide-react'
import { AdminPanel, AdminProgressBar, AdminStatusPill } from '@/components/admin'
import { Button, StatisticCard } from '@/components/ui'
import { LEAGUE_ASSIGNED_COMPETITION_OPTIONS, LEAGUE_COMPETITIONS, LEAGUE_STATS, type LeagueSectionId } from '@/config/leagueAdmin'

interface OverviewSectionProps {
  onAction: (message: string) => void
  onNavigate: (section: LeagueSectionId) => void
}

export function OverviewSection({ onAction, onNavigate }: OverviewSectionProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatisticCard label="Assigned competitions" value={LEAGUE_STATS.assignedCompetitions} icon={<Trophy className="size-5" aria-hidden />} trend={{ value: 'Scoped portfolio', direction: 'neutral' }} />
        <StatisticCard label="Registered clubs" value={LEAGUE_STATS.registeredClubs} icon={<Building2 className="size-5" aria-hidden />} trend={{ value: 'Assigned competitions', direction: 'neutral' }} />
        <StatisticCard label="Registered players" value={LEAGUE_STATS.registeredPlayers} icon={<Users className="size-5" aria-hidden />} trend={{ value: 'Current registrations', direction: 'neutral' }} />
        <StatisticCard label="Upcoming fixtures" value={LEAGUE_STATS.upcomingFixtures} icon={<CalendarDays className="size-5" aria-hidden />} trend={{ value: 'Scheduled', direction: 'neutral' }} />
        <StatisticCard label="Completed matches" value={LEAGUE_STATS.completedMatches} icon={<CheckCircle2 className="size-5" aria-hidden />} trend={{ value: 'In scope', direction: 'neutral' }} />
        <StatisticCard label="Pending results" value={LEAGUE_STATS.pendingResults} icon={<Activity className="size-5" aria-hidden />} trend={{ value: 'Awaiting verification', direction: 'up' }} />
        <StatisticCard label="Pending transfers" value={LEAGUE_STATS.pendingTransfers} icon={<ArrowLeftRight className="size-5" aria-hidden />} trend={{ value: 'Awaiting review', direction: 'up' }} />
        <StatisticCard label="Disputed reports" value={LEAGUE_STATS.disputedReports} icon={<AlertTriangle className="size-5" aria-hidden />} trend={{ value: 'Open or under review', direction: 'up' }} />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <AdminPanel
          title="Assigned competition scope"
          description="Only these competitions appear in this workspace."
          className="xl:col-span-2"
          actions={
            <Button variant="outline" size="sm" onClick={() => onNavigate('competitions')}>
              Manage competitions
            </Button>
          }
          bodyClassName="p-0"
        >
          <div className="divide-y divide-line">
            {LEAGUE_COMPETITIONS.map((competition) => (
              <div key={competition.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div className="min-w-0">
                  <p className="font-semibold text-ink">{competition.name}</p>
                  <p className="caption mt-1">
                    {competition.format.replace(/-/g, ' ')} · {competition.currentRound} · {competition.participants.length} participants
                  </p>
                </div>
                <AdminStatusPill status={competition.status} />
              </div>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel title="Priority queue" description="Items needing league office attention.">
          <div className="space-y-3">
            {[
              { label: 'Pending results', value: LEAGUE_STATS.pendingResults, section: 'results' as const, icon: Activity },
              { label: 'Pending transfers', value: LEAGUE_STATS.pendingTransfers, section: 'transfers' as const, icon: ArrowLeftRight },
              { label: 'Disputed reports', value: LEAGUE_STATS.disputedReports, section: 'disputes' as const, icon: AlertTriangle },
              { label: 'Club approvals', value: 3, section: 'clubs' as const, icon: Building2 },
            ].map((item) => {
              const Icon = item.icon

              return (
                <div key={item.label} className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface-muted px-3 py-2.5">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Icon className="size-4 shrink-0 text-primary" aria-hidden />
                    <span className="truncate text-xs font-semibold text-ink">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-ink">{item.value}</span>
                    <Button variant="ghost" size="sm" onClick={() => onNavigate(item.section)}>
                      Open
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </AdminPanel>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <AdminPanel title="Operational readiness" description="Completeness of scoped competition records.">
          <div className="space-y-4">
            <AdminProgressBar label="Club approvals" value={78} caption="Most club records approved" tone="live" />
            <AdminProgressBar label="Player registrations" value={86} caption="Eligibility checks in progress" tone="primary" />
            <AdminProgressBar label="Result verification" value={Math.max(20, 100 - LEAGUE_STATS.pendingResults * 12)} caption="Submitted results checked" tone="accent" />
            <AdminProgressBar label="Official assignments" value={64} caption="Upcoming fixtures covered" tone="live" />
          </div>
        </AdminPanel>

        <AdminPanel
          title="Scope snapshot"
          description="Competition options available to this administrator."
          actions={
            <Button variant="ghost" size="sm" onClick={() => onAction('Competition scope is a frontend preview.')}>
              Review scope
            </Button>
          }
        >
          <div className="space-y-3">
            {LEAGUE_ASSIGNED_COMPETITION_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center gap-2 rounded-lg border border-line bg-surface-muted px-3 py-2.5">
                <UserCheck className="size-4 shrink-0 text-live" aria-hidden />
                <span className="truncate text-xs font-semibold text-ink">{option.label}</span>
                <Clock3 className="ml-auto size-3.5 shrink-0 text-ink-muted" aria-hidden />
              </div>
            ))}
            <p className="body-muted pt-1">Competitions outside this list are hidden from the league administrator workspace.</p>
          </div>
        </AdminPanel>
      </div>
    </>
  )
}
