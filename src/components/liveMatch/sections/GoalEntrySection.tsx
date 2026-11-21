import { useEffect, useState, type FormEvent } from 'react'
import { CheckCircle2, Goal, ShieldCheck } from 'lucide-react'
import { AdminPanel } from '@/components/admin'
import { FormField } from '@/components/auth'
import { Button, Select } from '@/components/ui'
import {
  GOAL_TYPES,
  formatMinute,
  playerNameFor,
  playerOptionsFor,
  teamNameForSide,
  teamOptionsFor,
} from '@/config/liveMatch'
import type { LiveMatchSectionProps } from './types'

export function GoalEntrySection({ scope, score, minute, phase, goalPreset, onConfirm, onRecord }: LiveMatchSectionProps) {
  const teamOptions = teamOptionsFor(scope)
  const [side, setSide] = useState<'home' | 'away'>('home')
  const [scorer, setScorer] = useState('')
  const [entryMinute, setEntryMinute] = useState(String(minute))
  const [additionalTime, setAdditionalTime] = useState('0')
  const [assist, setAssist] = useState('')
  const [goalType, setGoalType] = useState<string>(goalPreset ?? GOAL_TYPES[0])

  useEffect(() => {
    if (goalPreset) setGoalType(goalPreset)
  }, [goalPreset])

  const selectedSide = teamOptions.some((option) => option.value === side) ? side : 'home'
  const playerOptions = playerOptionsFor(selectedSide, 'all')
  const assistOptions = [{ value: '', label: 'No assist' }, ...playerOptions]

  const changeSide = (value: string) => {
    setSide(value as 'home' | 'away')
    setScorer('')
    setAssist('')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const scorerName = playerNameFor(selectedSide, scorer)
    const assistName = assist ? playerNameFor(selectedSide, assist) : 'None'
    const minuteValue = Number(entryMinute)
    const extra = Number(additionalTime)
    const isOwnGoal = goalType === 'Own goal'
    const eventType = isOwnGoal ? 'own-goal' : goalType === 'Penalty' ? 'penalty-scored' : 'goal'

    onConfirm({
      title: `Confirm ${isOwnGoal ? 'own goal' : 'goal'}`,
      description: 'Review the scorer, minute and assist before adding this event to the live timeline.',
      confirmLabel: `Record ${isOwnGoal ? 'own goal' : 'goal'}`,
      tone: 'success',
      details: [
        { label: 'Team', value: teamNameForSide(selectedSide) },
        { label: 'Scorer', value: scorerName },
        { label: 'Minute', value: formatMinute(minuteValue, extra) },
        { label: 'Assist', value: assistName },
        { label: 'Goal type', value: goalType },
        { label: 'Phase', value: phase },
      ],
      onConfirm: () => {
        onRecord({
          minute: minuteValue,
          additionalTime: extra,
          type: eventType,
          side: selectedSide,
          label: `${goalType} — ${scorerName}`,
          detail: `${teamNameForSide(selectedSide)} · Assist: ${assistName}`,
        })
      },
    })
  }

  return (
    <>
      <AdminPanel title="Goal entry" description="Record a goal with full scorer and assist detail.">
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-1.5 text-xs font-semibold text-ink">Team</p>
            <Select options={teamOptions} value={selectedSide} onChange={changeSide} ariaLabel="Goal team" />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold text-ink">Goal scorer</p>
            <Select options={playerOptions} value={scorer} onChange={setScorer} placeholder="Select scorer" ariaLabel="Goal scorer" />
          </div>
          <FormField label="Match minute" name="goal-minute" type="number" min={1} max={120} value={entryMinute} onChange={(event) => setEntryMinute(event.target.value)} required />
          <FormField label="Additional time" name="goal-additional" type="number" min={0} max={20} value={additionalTime} onChange={(event) => setAdditionalTime(event.target.value)} />
          <div>
            <p className="mb-1.5 text-xs font-semibold text-ink">Assist</p>
            <Select options={assistOptions} value={assist} onChange={setAssist} ariaLabel="Goal assist" />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold text-ink">Goal type</p>
            <Select options={GOAL_TYPES.map((type) => ({ value: type, label: type }))} value={goalType} onChange={setGoalType} ariaLabel="Goal type" />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" iconLeft={<Goal className="size-4" aria-hidden />}>Review goal</Button>
          </div>
        </form>
      </AdminPanel>

      <div className="grid gap-5 xl:grid-cols-3">
        <AdminPanel title="Current score" description="Updated after confirmed goals only.">
          <div className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface-muted px-4 py-4">
            <div className="min-w-0">
              <p className="caption uppercase">{teamNameForSide('home')}</p>
              <p className="font-display text-2xl font-bold text-ink">{score.home}</p>
            </div>
            <span className="text-ink-subtle">–</span>
            <div className="min-w-0 text-right">
              <p className="caption uppercase">{teamNameForSide('away')}</p>
              <p className="font-display text-2xl font-bold text-ink">{score.away}</p>
            </div>
          </div>
        </AdminPanel>

        <AdminPanel title="Entry checklist" description="Required goal details.">
          <div className="space-y-2">
            {['Team', 'Goal scorer', 'Match minute', 'Additional time', 'Assist', 'Goal type'].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-lg border border-line bg-surface-muted px-3 py-2">
                <CheckCircle2 className="size-4 text-live" aria-hidden />
                <span className="text-xs font-semibold text-ink">{item}</span>
              </div>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel title="Recording authority" description="Scope check for this entry.">
          <div className="rounded-lg border border-green-200 bg-live-soft px-3 py-3">
            <div className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-live" aria-hidden />
              <div>
                <p className="text-xs font-bold text-live">{scope === 'official' ? 'Both teams selectable' : `${teamNameForSide('home')} only`}</p>
                <p className="caption mt-1">{scope === 'official' ? 'Assigned officials may record for either team.' : 'Club representatives cannot record opponent goals from this workspace.'}</p>
              </div>
            </div>
          </div>
        </AdminPanel>
      </div>
    </>
  )
}
