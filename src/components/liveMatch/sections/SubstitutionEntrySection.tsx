import { useState, type FormEvent } from 'react'
import { ArrowDownUp, ShieldCheck } from 'lucide-react'
import { AdminPanel } from '@/components/admin'
import { FormField } from '@/components/auth'
import { Button, Select } from '@/components/ui'
import {
  formatMinute,
  lineupForSide,
  playerNameFor,
  playerOptionsFor,
  teamNameForSide,
  teamOptionsFor,
} from '@/config/liveMatch'
import type { LiveMatchSectionProps } from './types'

export function SubstitutionEntrySection({ scope, minute, phase, onConfirm, onRecord }: LiveMatchSectionProps) {
  const teamOptions = teamOptionsFor(scope)
  const [side, setSide] = useState<'home' | 'away'>('home')
  const [playerOff, setPlayerOff] = useState('')
  const [playerOn, setPlayerOn] = useState('')
  const [entryMinute, setEntryMinute] = useState(String(minute))
  const [additionalTime, setAdditionalTime] = useState('0')

  const selectedSide = teamOptions.some((option) => option.value === side) ? side : 'home'
  const offOptions = playerOptionsFor(selectedSide, 'starters')
  const onOptions = playerOptionsFor(selectedSide, 'substitutes')
  const bench = lineupForSide(selectedSide).substitutes

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const offName = playerNameFor(selectedSide, playerOff)
    const onName = playerNameFor(selectedSide, playerOn)
    const minuteValue = Number(entryMinute)
    const extra = Number(additionalTime)

    onConfirm({
      title: 'Confirm substitution',
      description: 'Review the players and minute before recording this substitution.',
      confirmLabel: 'Record substitution',
      details: [
        { label: 'Team', value: teamNameForSide(selectedSide) },
        { label: 'Off', value: offName },
        { label: 'On', value: onName },
        { label: 'Minute', value: formatMinute(minuteValue, extra) },
        { label: 'Phase', value: phase },
      ],
      onConfirm: () => {
        onRecord({
          minute: minuteValue,
          additionalTime: extra,
          type: 'substitution',
          side: selectedSide,
          label: 'Substitution',
          detail: `${offName} off · ${onName} on`,
        })
      },
    })
  }

  return (
    <>
      <AdminPanel title="Substitution entry" description="Capture the player off, the player on and the exact minute.">
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-1.5 text-xs font-semibold text-ink">Team</p>
            <Select
              options={teamOptions}
              value={selectedSide}
              onChange={(value) => {
                setSide(value as 'home' | 'away')
                setPlayerOff('')
                setPlayerOn('')
              }}
              ariaLabel="Substitution team"
            />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold text-ink">Player coming off</p>
            <Select options={offOptions} value={playerOff} onChange={setPlayerOff} placeholder="Select player" ariaLabel="Player coming off" />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold text-ink">Player coming on</p>
            <Select options={onOptions} value={playerOn} onChange={setPlayerOn} placeholder="Select player" ariaLabel="Player coming on" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Match minute" name="substitution-minute" type="number" min={1} max={120} value={entryMinute} onChange={(event) => setEntryMinute(event.target.value)} required />
            <FormField label="Additional time" name="substitution-additional" type="number" min={0} max={20} value={additionalTime} onChange={(event) => setAdditionalTime(event.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" iconLeft={<ArrowDownUp className="size-4" aria-hidden />}>Review substitution</Button>
          </div>
        </form>
      </AdminPanel>

      <div className="grid gap-5 xl:grid-cols-3">
        <AdminPanel title="Current substitutes" description={`Available players for ${teamNameForSide(selectedSide)}.`} className="xl:col-span-2">
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {bench.map((player) => (
              <div key={player.id} className="rounded-lg border border-line bg-surface-muted px-3 py-2.5">
                <p className="truncate text-xs font-semibold text-ink">{player.number}. {player.name}</p>
                <p className="caption mt-1">{player.position}</p>
              </div>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel title="Recording authority" description="Team selection is scoped.">
          <div className="rounded-lg border border-green-200 bg-live-soft px-3 py-3">
            <div className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-live" aria-hidden />
              <div>
                <p className="text-xs font-bold text-live">{scope === 'official' ? 'Both teams selectable' : `${teamNameForSide('home')} only`}</p>
                <p className="caption mt-1">{scope === 'official' ? 'Designated officials may record for either team.' : 'Representatives cannot change opponent substitutions.'}</p>
              </div>
            </div>
          </div>
        </AdminPanel>
      </div>
    </>
  )
}
