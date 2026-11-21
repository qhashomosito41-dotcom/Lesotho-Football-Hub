import { useEffect, useState } from 'react'
import { AlertTriangle, Clock3, Crosshair, Flag, PauseCircle, Play, PlayCircle, Timer, type LucideIcon } from 'lucide-react'
import { AdminPanel, AdminStatusPill } from '@/components/admin'
import { FormField } from '@/components/auth'
import { Button } from '@/components/ui'
import { formatMinute } from '@/config/liveMatch'
import type { LiveMatchSectionProps } from './types'

interface MatchControlDefinition {
  id: string
  label: string
  description: string
  icon: LucideIcon
  phase?: string
  eventType?: 'start' | 'half-time' | 'second-half' | 'extra-time' | 'shootout' | 'full-time'
  tone?: 'primary' | 'danger' | 'success'
}

const controls: MatchControlDefinition[] = [
  { id: 'start', label: 'Start match', description: 'Open the fixture and begin the first half.', icon: Play, phase: 'First half', eventType: 'start', tone: 'success' },
  { id: 'half-time', label: 'Record half-time', description: 'Close the first half at the current minute.', icon: PauseCircle, phase: 'Half-time', eventType: 'half-time' },
  { id: 'second-half', label: 'Start second half', description: 'Restart play for the second half.', icon: PlayCircle, phase: 'Second half', eventType: 'second-half', tone: 'success' },
  { id: 'extra-time', label: 'Record extra time', description: 'Move the match into extra time.', icon: Timer, phase: 'Extra time', eventType: 'extra-time' },
  { id: 'shootout', label: 'Record penalty shootout', description: 'Move the match to a penalty shootout.', icon: Crosshair, phase: 'Penalty shootout', eventType: 'shootout' },
  { id: 'full-time', label: 'Submit full-time', description: 'Close and submit the final match result.', icon: Flag, phase: 'Full-time', eventType: 'full-time', tone: 'danger' },
]

export function MatchControlSection({ minute, phase, onConfirm, onSetMinute, onSetPhase, onCorrection, onPreview }: LiveMatchSectionProps) {
  const [minuteInput, setMinuteInput] = useState(String(minute))

  useEffect(() => {
    setMinuteInput(String(minute))
  }, [minute])

  const updateMinute = () => {
    const nextMinute = Math.max(1, Math.min(120, Number(minuteInput) || 1))
    onSetMinute(nextMinute)
    setMinuteInput(String(nextMinute))
    onPreview(`Match clock set to ${formatMinute(nextMinute)} in this preview.`)
  }

  const handleControl = (control: MatchControlDefinition) => {
    if (!control.eventType || !control.phase) return

    onConfirm({
      title: control.label,
      description: control.description,
      confirmLabel: control.label,
      tone: control.tone ?? 'primary',
      details: [
        { label: 'Current phase', value: phase },
        { label: 'New phase', value: control.phase },
        { label: 'Match minute', value: formatMinute(minute) },
      ],
      onConfirm: () => {
        onSetPhase(control.phase ?? phase, control.eventType ?? 'start', control.description)
      },
    })
  }

  return (
    <>
      <AdminPanel title="Match status" description="Current official match state." actions={<AdminStatusPill status="Live" label={phase} />}>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-line bg-surface-muted px-3 py-3">
            <p className="caption uppercase">Match minute</p>
            <p className="font-display mt-1 text-2xl font-bold text-ink">{formatMinute(minute)}</p>
          </div>
          <div className="rounded-lg border border-line bg-surface-muted px-3 py-3">
            <p className="caption uppercase">Phase</p>
            <p className="mt-1 text-sm font-semibold text-ink">{phase}</p>
          </div>
          <div className="rounded-lg border border-line bg-surface-muted px-3 py-3">
            <p className="caption uppercase">Corrections</p>
            <p className="mt-1 text-sm font-semibold text-ink">Available</p>
          </div>
        </div>
      </AdminPanel>

      <AdminPanel title="Match clock" description="Update the official match minute.">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <FormField
            label="Match minute"
            name="match-control-minute"
            type="number"
            min={1}
            max={120}
            value={minuteInput}
            onChange={(event) => setMinuteInput(event.target.value)}
          />
          <Button variant="outline" iconLeft={<Clock3 className="size-4" aria-hidden />} onClick={updateMinute}>
            Update minute
          </Button>
        </div>
      </AdminPanel>

      <AdminPanel title="Match control" description="Phase changes require a clear confirmation.">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {controls.map((control) => {
            const Icon = control.icon

            return (
              <button
                key={control.id}
                type="button"
                aria-label={`Match control ${control.label}`}
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
          <button
            type="button"
            aria-label="Match control Request correction"
            onClick={onCorrection}
            className="flex min-w-0 items-start gap-3 rounded-xl border border-line bg-surface-muted px-4 py-4 text-left transition-colors hover:border-danger hover:bg-danger-soft"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-danger-soft text-danger">
              <AlertTriangle className="size-4" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-ink">Request correction</span>
              <span className="caption mt-1 block">Flag a recorded event for review.</span>
            </span>
          </button>
        </div>
      </AdminPanel>
    </>
  )
}
