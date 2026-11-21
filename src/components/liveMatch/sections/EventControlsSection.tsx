import { useState } from 'react'
import {
  Circle,
  CornerDownLeft,
  Crosshair,
  Flag,
  Goal,
  HeartPulse,
  PauseCircle,
  Repeat2,
  ShieldCheck,
  Sparkles,
  Square,
  type LucideIcon,
} from 'lucide-react'
import { AdminPanel } from '@/components/admin'
import { Button, Select } from '@/components/ui'
import {
  EVENT_CONTROLS,
  SCOPE_COPY,
  formatMinute,
  teamNameForSide,
  teamOptionsFor,
  timelineLabel,
  type EventControlDefinition,
} from '@/config/liveMatch'
import type { LiveMatchSectionProps } from './types'

const controlIcons: Record<string, LucideIcon> = {
  goal: Goal,
  'own-goal': CornerDownLeft,
  assist: Sparkles,
  'yellow-card': Circle,
  'red-card': Square,
  substitution: Repeat2,
  penalty: Crosshair,
  injury: HeartPulse,
  'half-time': PauseCircle,
  'full-time': Flag,
}

export function EventControlsSection({ scope, minute, phase, onNavigate, onConfirm, onRecord, onSetPhase }: LiveMatchSectionProps) {
  const [side, setSide] = useState<'home' | 'away'>('home')
  const teamOptions = teamOptionsFor(scope)
  const selectedSide = teamOptions.some((option) => option.value === side) ? side : 'home'
  const scopeCopy = SCOPE_COPY[scope]

  const handleControl = (control: EventControlDefinition) => {
    if (control.mode === 'goal') {
      onNavigate('goal')
      return
    }
    if (control.mode === 'own-goal') {
      onNavigate('goal', 'Own goal')
      return
    }
    if (control.mode === 'substitution') {
      onNavigate('substitution')
      return
    }
    const eventType = control.eventType
    if (!eventType) return

    const team = teamNameForSide(selectedSide)
    const detail = `${team} · ${control.detail ?? timelineLabel(eventType)}`
    const action = {
      title: `Confirm ${control.label.toLowerCase()}`,
      description: `Record this ${control.label.toLowerCase()} in the live event timeline at ${formatMinute(minute)}.`,
      confirmLabel: `Record ${control.label}`,
      tone: eventType === 'red-card' ? ('danger' as const) : 'primary' as const,
      details: [
        { label: 'Event', value: control.label },
        { label: 'Team', value: team },
        { label: 'Minute', value: formatMinute(minute) },
        { label: 'Phase', value: phase },
      ],
      onConfirm: () => {
        if (eventType === 'half-time') {
          onSetPhase('Half-time', 'half-time', detail)
          return
        }
        if (eventType === 'full-time') {
          onSetPhase('Full-time', 'full-time', detail)
          return
        }
        onRecord({
          minute,
          type: eventType,
          side: selectedSide,
          label: timelineLabel(eventType),
          detail,
        })
      },
    }

    onConfirm(action)
  }

  return (
    <>
      <AdminPanel title="Event team" description="Choose the team for quick event recording.">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="mb-1.5 text-xs font-semibold text-ink">Team</p>
            <Select options={teamOptions} value={selectedSide} onChange={(value) => setSide(value as 'home' | 'away')} ariaLabel="Select event team" />
          </div>
          <div className="rounded-lg border border-line bg-surface-muted px-3 py-2.5">
            <p className="caption uppercase">Current minute</p>
            <p className="mt-1 font-display text-lg font-bold text-ink">{formatMinute(minute)}</p>
          </div>
          <div className="rounded-lg border border-line bg-surface-muted px-3 py-2.5">
            <p className="caption uppercase">Match phase</p>
            <p className="mt-1 truncate text-xs font-semibold text-ink">{phase}</p>
          </div>
        </div>
      </AdminPanel>

      <AdminPanel title="Match event controls" description="Twelve standard live match controls. Important actions require confirmation.">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {EVENT_CONTROLS.map((control) => {
            const Icon = controlIcons[control.icon] ?? Circle

            return (
              <button
                key={control.id}
                type="button"
                aria-label={`Event control ${control.label}`}
                onClick={() => handleControl(control)}
                className="flex min-w-0 items-start gap-3 rounded-xl border border-line bg-surface-muted px-4 py-4 text-left transition-colors hover:border-primary hover:bg-primary-soft"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                  <Icon className="size-4" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-ink">{control.label}</span>
                  <span className="caption mt-1 block">{control.description}</span>
                </span>
              </button>
            )
          })}
        </div>
      </AdminPanel>

      <AdminPanel title="Recording authority" description="Club-based and official permissions are represented in the interface.">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-green-200 bg-live-soft px-3 py-3">
            <div className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-live" aria-hidden />
              <div>
                <p className="text-xs font-bold text-live">{scopeCopy.label}</p>
                <p className="caption mt-1">{scopeCopy.note}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-line bg-surface-muted px-3 py-3">
            <Button variant="outline" fullWidth onClick={() => onNavigate('timeline')}>Review event timeline</Button>
          </div>
        </div>
      </AdminPanel>
    </>
  )
}
