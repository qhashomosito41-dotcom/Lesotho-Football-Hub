import { useState } from 'react'
import { Compass, Save, Star, UserRound } from 'lucide-react'
import { AdminPanel, AdminStatusPill } from '@/components/admin'
import { Button, Select } from '@/components/ui'
import { CLUB_MATCHDAY, CLUB_PLAYER_RECORDS, CLUB_FIXTURES, opponentFor } from '@/config/clubDashboard'
import type { ClubSectionProps } from './types'

interface Slot {
  id: string
  zone: 'Goalkeeper' | 'Defence' | 'Midfield' | 'Attack'
  label: string
}

const formationSlots: Record<string, Slot[]> = {
  '4-3-3': [
    { id: 'gk', zone: 'Goalkeeper', label: 'Goalkeeper' },
    { id: 'def-1', zone: 'Defence', label: 'Right back' },
    { id: 'def-2', zone: 'Defence', label: 'Centre back' },
    { id: 'def-3', zone: 'Defence', label: 'Centre back' },
    { id: 'def-4', zone: 'Defence', label: 'Left back' },
    { id: 'mid-1', zone: 'Midfield', label: 'Central midfield' },
    { id: 'mid-2', zone: 'Midfield', label: 'Central midfield' },
    { id: 'mid-3', zone: 'Midfield', label: 'Attacking midfield' },
    { id: 'att-1', zone: 'Attack', label: 'Right wing' },
    { id: 'att-2', zone: 'Attack', label: 'Centre forward' },
    { id: 'att-3', zone: 'Attack', label: 'Left wing' },
  ],
  '4-2-3-1': [
    { id: 'gk', zone: 'Goalkeeper', label: 'Goalkeeper' },
    { id: 'def-1', zone: 'Defence', label: 'Right back' },
    { id: 'def-2', zone: 'Defence', label: 'Centre back' },
    { id: 'def-3', zone: 'Defence', label: 'Centre back' },
    { id: 'def-4', zone: 'Defence', label: 'Left back' },
    { id: 'mid-1', zone: 'Midfield', label: 'Defensive midfield' },
    { id: 'mid-2', zone: 'Midfield', label: 'Defensive midfield' },
    { id: 'mid-3', zone: 'Midfield', label: 'Attacking midfield' },
    { id: 'att-1', zone: 'Attack', label: 'Right wing' },
    { id: 'att-2', zone: 'Attack', label: 'Centre forward' },
    { id: 'att-3', zone: 'Attack', label: 'Left wing' },
  ],
  '3-5-2': [
    { id: 'gk', zone: 'Goalkeeper', label: 'Goalkeeper' },
    { id: 'def-1', zone: 'Defence', label: 'Right centre back' },
    { id: 'def-2', zone: 'Defence', label: 'Centre back' },
    { id: 'def-3', zone: 'Defence', label: 'Left centre back' },
    { id: 'mid-1', zone: 'Midfield', label: 'Right wing back' },
    { id: 'mid-2', zone: 'Midfield', label: 'Central midfield' },
    { id: 'mid-3', zone: 'Midfield', label: 'Central midfield' },
    { id: 'mid-4', zone: 'Midfield', label: 'Central midfield' },
    { id: 'mid-5', zone: 'Midfield', label: 'Left wing back' },
    { id: 'att-1', zone: 'Attack', label: 'Centre forward' },
    { id: 'att-2', zone: 'Attack', label: 'Centre forward' },
  ],
  '4-4-2': [
    { id: 'gk', zone: 'Goalkeeper', label: 'Goalkeeper' },
    { id: 'def-1', zone: 'Defence', label: 'Right back' },
    { id: 'def-2', zone: 'Defence', label: 'Centre back' },
    { id: 'def-3', zone: 'Defence', label: 'Centre back' },
    { id: 'def-4', zone: 'Defence', label: 'Left back' },
    { id: 'mid-1', zone: 'Midfield', label: 'Right midfield' },
    { id: 'mid-2', zone: 'Midfield', label: 'Central midfield' },
    { id: 'mid-3', zone: 'Midfield', label: 'Central midfield' },
    { id: 'mid-4', zone: 'Midfield', label: 'Left midfield' },
    { id: 'att-1', zone: 'Attack', label: 'Centre forward' },
    { id: 'att-2', zone: 'Attack', label: 'Centre forward' },
  ],
}

function initialSelections(): Record<string, string> {
  const slots = formationSlots[CLUB_MATCHDAY.formation] ?? formationSlots['4-3-3']
  const selections: Record<string, string> = {}

  slots.forEach((slot, index) => {
    const lineupPlayer = CLUB_MATCHDAY.starters[index]
    const match = lineupPlayer ? CLUB_PLAYER_RECORDS.find((record) => record.player.name === lineupPlayer.name) : undefined
    const fallback = CLUB_PLAYER_RECORDS[index] ?? CLUB_PLAYER_RECORDS[0]
    selections[slot.id] = match?.id ?? fallback?.id ?? ''
  })

  return selections
}

export function StartingXISection({ search, onAction }: ClubSectionProps) {
  const [formation, setFormation] = useState(CLUB_MATCHDAY.formation in formationSlots ? CLUB_MATCHDAY.formation : '4-3-3')
  const [selections, setSelections] = useState<Record<string, string>>(initialSelections)
  const [captain, setCaptain] = useState(initialSelections()['mid-2'] ?? CLUB_PLAYER_RECORDS[0]?.id ?? '')
  const slots = formationSlots[formation] ?? formationSlots['4-3-3']
  const fixture = CLUB_FIXTURES[0]
  const selectedIds = Object.values(selections).filter(Boolean)
  const playerOptions = CLUB_PLAYER_RECORDS.filter((record) => !search || record.player.name.toLowerCase().includes(search.toLowerCase())).map((record) => ({
    value: record.id,
    label: `${record.shirtNumber}. ${record.player.name}`,
  }))

  const changeFormation = (value: string) => {
    setFormation(value)
    const nextSlots = formationSlots[value] ?? formationSlots['4-3-3']
    setSelections((current) => {
      const values = Object.values(current)
      return Object.fromEntries(nextSlots.map((slot, index) => [slot.id, values[index] ?? values[0] ?? '']))
    })
  }

  const zones: Slot['zone'][] = ['Goalkeeper', 'Defence', 'Midfield', 'Attack']

  return (
    <>
      <AdminPanel title="Starting XI builder" description={`Tactical selection for ${fixture ? opponentFor(fixture) : 'the next fixture'}.`}>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="mb-1.5 text-xs font-semibold text-ink">Formation</p>
            <Select
              options={Object.keys(formationSlots).map((value) => ({ value, label: value }))}
              value={formation}
              onChange={changeFormation}
              ariaLabel="Select starting formation"
            />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold text-ink">Captain</p>
            <Select
              options={CLUB_PLAYER_RECORDS.filter((record) => selectedIds.includes(record.id)).map((record) => ({ value: record.id, label: record.player.name }))}
              value={captain}
              onChange={setCaptain}
              ariaLabel="Select starting captain"
            />
          </div>
          <div className="flex items-end">
            <AdminStatusPill status={selectedIds.length === slots.length ? 'Active' : 'Pending'} label={`${selectedIds.length}/${slots.length} positions filled`} />
          </div>
        </div>
      </AdminPanel>

      <div className="grid gap-5 xl:grid-cols-2">
        {zones.map((zone) => (
          <AdminPanel key={zone} title={zone} description={`Select players for the ${zone.toLowerCase()} positions.`}>
            <div className="space-y-3">
              {slots.filter((slot) => slot.zone === zone).map((slot) => (
                <div key={slot.id} className="grid gap-2 sm:grid-cols-[140px_1fr] sm:items-center">
                  <div>
                    <p className="text-xs font-semibold text-ink">{slot.label}</p>
                    <p className="caption">{slot.zone}</p>
                  </div>
                  <Select
                    options={playerOptions}
                    value={selections[slot.id] ?? ''}
                    onChange={(value) => setSelections((current) => ({ ...current, [slot.id]: value }))}
                    ariaLabel={`Select ${slot.label}`}
                    size="sm"
                  />
                </div>
              ))}
            </div>
          </AdminPanel>
        ))}
      </div>

      <AdminPanel title="Confirm starting eleven" description="Review leadership choices before saving the XI.">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { icon: Compass, label: 'Formation', value: formation },
            { icon: Star, label: 'Captain', value: CLUB_PLAYER_RECORDS.find((record) => record.id === captain)?.player.name ?? 'Not selected' },
            { icon: UserRound, label: 'Goalkeeper', value: CLUB_PLAYER_RECORDS.find((record) => record.id === selections.gk)?.player.name ?? 'Not selected' },
          ].map((item) => {
            const Icon = item.icon

            return (
              <div key={item.label} className="rounded-lg border border-line bg-surface-muted px-4 py-3">
                <Icon className="size-4 text-primary" aria-hidden />
                <p className="caption mt-2 uppercase">{item.label}</p>
                <p className="mt-1 text-sm font-semibold text-ink">{item.value}</p>
              </div>
            )
          })}
        </div>
        <Button className="mt-5" variant="outline" iconLeft={<Save className="size-4" aria-hidden />} onClick={() => onAction('Starting XI changes are a frontend preview; nothing was saved.')}>
          Save starting XI
        </Button>
      </AdminPanel>
    </>
  )
}
