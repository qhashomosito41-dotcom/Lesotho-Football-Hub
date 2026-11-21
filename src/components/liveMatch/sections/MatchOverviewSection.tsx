import { Activity, ArrowRight, CalendarDays, MapPin, Radio, ShieldCheck, Users } from 'lucide-react'
import { AdminPanel, AdminStatusPill } from '@/components/admin'
import { Button, ClubBadge } from '@/components/ui'
import { LIVE_MATCH, SCOPE_COPY, lineupForSide } from '@/config/liveMatch'
import type { LiveMatchSectionProps } from './types'

interface LineupListProps {
  side: 'home' | 'away'
  pool: 'starters' | 'substitutes'
  title: string
}

function LineupList({ side, pool, title }: LineupListProps) {
  const lineup = lineupForSide(side)

  return (
    <div className="rounded-lg border border-line bg-surface-muted p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold text-ink uppercase">{title}</p>
        <span className="text-[10px] font-bold text-ink-muted uppercase">{side}</span>
      </div>
      <div className="mt-3 space-y-1.5">
        {lineup[pool].map((player) => (
          <div key={player.id} className="flex items-center justify-between gap-3 rounded-md border border-line bg-surface px-2.5 py-2">
            <span className="min-w-0 truncate text-xs font-semibold text-ink">{player.number}. {player.name}</span>
            <span className="shrink-0 text-[10px] text-ink-muted">{player.position}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function MatchOverviewSection({ scope, score, minute, phase, events, onNavigate }: LiveMatchSectionProps) {
  const scopeCopy = SCOPE_COPY[scope]

  return (
    <>
      <AdminPanel title="Match overview" description="Live official record for the assigned fixture." actions={<AdminStatusPill status="Live" label={`${phase} · ${minute}'`} />}>
        <div className="grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <div className="flex min-w-0 items-center gap-3">
            <ClubBadge name={LIVE_MATCH.home.name} shortName={LIVE_MATCH.home.shortName} color={LIVE_MATCH.home.color} size="lg" />
            <div className="min-w-0">
              <p className="caption uppercase">Home team</p>
              <p className="truncate font-display text-lg font-bold text-ink">{LIVE_MATCH.home.name}</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <p className="caption uppercase">Current score</p>
            <p className="font-display mt-1 text-4xl font-bold tabular-nums text-ink sm:text-5xl">
              {score.home} <span className="text-ink-subtle">–</span> {score.away}
            </p>
            <div className="mt-2 flex items-center gap-2 rounded-full bg-live-soft px-3 py-1 text-xs font-bold text-live">
              <Radio className="size-3.5" aria-hidden />
              Match minute {minute}'
            </div>
          </div>

          <div className="flex min-w-0 items-center justify-end gap-3 text-right">
            <div className="min-w-0">
              <p className="caption uppercase">Away team</p>
              <p className="truncate font-display text-lg font-bold text-ink">{LIVE_MATCH.away.name}</p>
            </div>
            <ClubBadge name={LIVE_MATCH.away.name} shortName={LIVE_MATCH.away.shortName} color={LIVE_MATCH.away.color} size="lg" />
          </div>
        </div>

        <div className="mt-5 grid gap-3 border-t border-line pt-5 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border border-line bg-surface-muted px-3 py-2.5">
            <p className="caption uppercase">Competition</p>
            <p className="mt-1 truncate text-xs font-semibold text-ink">{LIVE_MATCH.competition}</p>
          </div>
          <div className="rounded-lg border border-line bg-surface-muted px-3 py-2.5">
            <p className="caption uppercase">Round</p>
            <p className="mt-1 truncate text-xs font-semibold text-ink">{LIVE_MATCH.round}</p>
          </div>
          <div className="rounded-lg border border-line bg-surface-muted px-3 py-2.5">
            <p className="caption uppercase">Venue</p>
            <p className="mt-1 truncate text-xs font-semibold text-ink">{LIVE_MATCH.venue}</p>
          </div>
          <div className="rounded-lg border border-line bg-surface-muted px-3 py-2.5">
            <p className="caption uppercase">Match status</p>
            <p className="mt-1 truncate text-xs font-semibold text-ink">{phase}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button variant="outline" iconLeft={<Activity className="size-4" aria-hidden />} onClick={() => onNavigate('events')}>
            Open event controls
          </Button>
          <Button variant="ghost" iconLeft={<CalendarDays className="size-4" aria-hidden />} onClick={() => onNavigate('timeline')}>
            View live timeline
          </Button>
        </div>
      </AdminPanel>

      <div className="grid gap-5 xl:grid-cols-3">
        <AdminPanel title="Authorised scope" description="Who may record into this match.">
          <div className="rounded-lg border border-green-200 bg-live-soft px-3 py-3">
            <div className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-live" aria-hidden />
              <div>
                <p className="text-xs font-bold text-live">{scopeCopy.label}</p>
                <p className="caption mt-1">{scopeCopy.note}</p>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-line bg-surface-muted px-3 py-2.5">
            <MapPin className="size-4 shrink-0 text-primary" aria-hidden />
            <span className="text-xs font-semibold text-ink">{LIVE_MATCH.referee} · Match referee</span>
          </div>
        </AdminPanel>

        <AdminPanel title="Match activity" description="Current event counts.">
          <div className="space-y-3">
            {[
              { label: 'Recorded events', value: events.length, icon: Activity },
              { label: 'Live entries', value: events.filter((event) => event.origin === 'live').length, icon: Radio },
              { label: 'Squad players listed', value: LIVE_MATCH.homeLineup.starters.length + LIVE_MATCH.awayLineup.starters.length, icon: Users },
            ].map((item) => {
              const Icon = item.icon

              return (
                <div key={item.label} className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface-muted px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 text-primary" aria-hidden />
                    <span className="text-xs font-semibold text-ink">{item.label}</span>
                  </div>
                  <span className="font-display text-lg font-bold text-ink">{item.value}</span>
                </div>
              )
            })}
          </div>
        </AdminPanel>

        <AdminPanel title="Match control shortcut" description="Clock and phase management.">
          <p className="body-muted">Current phase: <span className="font-semibold text-ink">{phase}</span></p>
          <p className="body-muted mt-1">Match minute: <span className="font-semibold text-ink">{minute}'</span></p>
          <Button variant="outline" fullWidth className="mt-4" iconRight={<ArrowRight className="size-4" aria-hidden />} onClick={() => onNavigate('control')}>
            Open match control
          </Button>
        </AdminPanel>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <AdminPanel title="Home starting XI" description={`${LIVE_MATCH.home.name} match day line-up.`}>
          <LineupList side="home" pool="starters" title="Starting XI" />
        </AdminPanel>
        <AdminPanel title="Away starting XI" description={`${LIVE_MATCH.away.name} match day line-up.`}>
          <LineupList side="away" pool="starters" title="Starting XI" />
        </AdminPanel>
        <AdminPanel title="Home substitutes" description="Available replacements for the home team.">
          <LineupList side="home" pool="substitutes" title="Substitutes" />
        </AdminPanel>
        <AdminPanel title="Away substitutes" description="Available replacements for the away team.">
          <LineupList side="away" pool="substitutes" title="Substitutes" />
        </AdminPanel>
      </div>
    </>
  )
}
