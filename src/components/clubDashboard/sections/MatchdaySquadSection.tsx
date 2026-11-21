import { useState } from 'react'
import { Check, CircleCheck, ListChecks, ShieldCheck, Users } from 'lucide-react'
import { AdminPanel, AdminProgressBar, AdminStatusPill } from '@/components/admin'
import { Button, Select } from '@/components/ui'
import { CLUB_FIXTURES, CLUB_MATCHDAY, CLUB_PLAYER_RECORDS, opponentFor } from '@/config/clubDashboard'
import type { ClubSectionProps } from './types'

const formationOptions = [
  { value: '4-3-3', label: '4-3-3' },
  { value: '4-2-3-1', label: '4-2-3-1' },
  { value: '3-5-2', label: '3-5-2' },
  { value: '4-4-2', label: '4-4-2' },
]

function idsForNames(names: string[]): string[] {
  return names
    .map((name) => CLUB_PLAYER_RECORDS.find((record) => record.player.name === name)?.id)
    .filter((id): id is string => Boolean(id))
}

const initialStarters = (() => {
  const ids = idsForNames(CLUB_MATCHDAY.starters.map((player) => player.name))
  return ids.length >= 11 ? ids.slice(0, 11) : CLUB_PLAYER_RECORDS.slice(0, 11).map((record) => record.id)
})()

const initialSubstitutes = (() => {
  const ids = idsForNames(CLUB_MATCHDAY.substitutes.map((player) => player.name)).filter((id) => !initialStarters.includes(id))
  return ids.length > 0 ? ids.slice(0, 7) : CLUB_PLAYER_RECORDS.slice(11, 18).map((record) => record.id)
})()

export function MatchdaySquadSection({ search, onAction }: ClubSectionProps) {
  const [fixtureId, setFixtureId] = useState(CLUB_FIXTURES[0]?.id ?? '')
  const [starters, setStarters] = useState<string[]>(initialStarters)
  const [substitutes, setSubstitutes] = useState<string[]>(initialSubstitutes)
  const [formation, setFormation] = useState(CLUB_MATCHDAY.formation)
  const [captain, setCaptain] = useState(initialStarters[0] ?? '')
  const [goalkeeper, setGoalkeeper] = useState(
    CLUB_PLAYER_RECORDS.find((record) => initialStarters.includes(record.id) && record.position === 'Goalkeeper')?.id ?? initialStarters[0] ?? '',
  )
  const fixture = CLUB_FIXTURES.find((item) => item.id === fixtureId) ?? CLUB_FIXTURES[0]

  const query = search.toLowerCase()
  const visiblePlayers = CLUB_PLAYER_RECORDS.filter((record) => !query || record.player.name.toLowerCase().includes(query) || record.position.toLowerCase().includes(query))

  const moveToStarters = (id: string) => {
    if (starters.includes(id) || starters.length >= 11) return
    setSubstitutes((current) => current.filter((item) => item !== id))
    setStarters((current) => [...current, id])
  }

  const moveToSubstitutes = (id: string) => {
    if (substitutes.includes(id) || substitutes.length >= 7) return
    setStarters((current) => current.filter((item) => item !== id))
    setSubstitutes((current) => [...current, id])
    if (captain === id) setCaptain(starters.find((item) => item !== id) ?? '')
    if (goalkeeper === id) setGoalkeeper(starters.find((item) => item !== id) ?? '')
  }

  const starterOptions = CLUB_PLAYER_RECORDS.filter((record) => starters.includes(record.id)).map((record) => ({ value: record.id, label: record.player.name }))

  return (
    <>
      <AdminPanel title="Matchday squad board" description={`Select 11 starters and 7 substitutes for ${fixture ? opponentFor(fixture) : 'the next fixture'}.`}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <p className="mb-1.5 text-xs font-semibold text-ink">Fixture</p>
            <Select
              options={CLUB_FIXTURES.map((item) => ({ value: item.id, label: `${item.dateISO} · ${opponentFor(item)}` }))}
              value={fixtureId}
              onChange={setFixtureId}
              ariaLabel="Select matchday fixture"
            />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold text-ink">Formation</p>
            <Select options={formationOptions} value={formation} onChange={setFormation} ariaLabel="Select formation" />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold text-ink">Captain</p>
            <Select options={starterOptions} value={captain} onChange={setCaptain} ariaLabel="Select captain" />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold text-ink">Goalkeeper</p>
            <Select options={starterOptions} value={goalkeeper} onChange={setGoalkeeper} ariaLabel="Select goalkeeper" />
          </div>
        </div>
      </AdminPanel>

      <div className="grid gap-5 xl:grid-cols-2">
        <AdminPanel
          title={`Starting XI (${starters.length}/11)`}
          description="Players who will start the match."
          actions={<ShieldCheck className="size-4 text-live" aria-hidden />}
        >
          <div className="space-y-2">
            {CLUB_PLAYER_RECORDS.filter((record) => starters.includes(record.id)).map((record) => (
              <div key={record.id} className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface-muted px-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-ink">{record.shirtNumber}. {record.player.name}</p>
                  <p className="caption">{record.position}{record.id === captain ? ' · Captain' : ''}{record.id === goalkeeper ? ' · Goalkeeper' : ''}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => moveToSubstitutes(record.id)}>Bench</Button>
              </div>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel title={`Substitutes (${substitutes.length}/7)`} description="Players available from the bench.">
          <div className="space-y-2">
            {CLUB_PLAYER_RECORDS.filter((record) => substitutes.includes(record.id)).map((record) => (
              <div key={record.id} className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface-muted px-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-ink">{record.shirtNumber}. {record.player.name}</p>
                  <p className="caption">{record.position}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => moveToStarters(record.id)}>Start</Button>
              </div>
            ))}
          </div>
        </AdminPanel>
      </div>

      <AdminPanel title="Available player pool" description="Move players into the starting XI or substitutes.">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {visiblePlayers.map((record) => {
            const inStarters = starters.includes(record.id)
            const inSubstitutes = substitutes.includes(record.id)
            const status = inStarters ? 'Starting XI' : inSubstitutes ? 'Substitute' : 'Not selected'

            return (
              <div key={record.id} className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface-muted px-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-ink">{record.player.name}</p>
                  <p className="caption">{record.position} · {status}</p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <Button variant="ghost" size="sm" disabled={inStarters} onClick={() => moveToStarters(record.id)} aria-label={`Add ${record.player.name} to starting XI`}>
                    <Check className="size-3.5" aria-hidden />
                  </Button>
                  <Button variant="ghost" size="sm" disabled={inSubstitutes} onClick={() => moveToSubstitutes(record.id)} aria-label={`Add ${record.player.name} to substitutes`}>
                    <Users className="size-3.5" aria-hidden />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </AdminPanel>

      <div className="grid gap-5 xl:grid-cols-2">
        <AdminPanel title="Submission checklist" description="Requirements before the squad can be submitted.">
          <div className="space-y-4">
            <AdminProgressBar label="Starting XI" value={Math.min(100, starters.length * 9)} caption={`${starters.length} of 11 selected`} tone="live" />
            <AdminProgressBar label="Substitutes" value={Math.min(100, substitutes.length * 14)} caption={`${substitutes.length} of 7 selected`} tone="primary" />
            <AdminProgressBar label="Captain and goalkeeper" value={captain && goalkeeper ? 100 : 50} caption="Leadership roles confirmed" tone="accent" />
            <AdminProgressBar label="Availability updates" value={78} caption="Injury status confirmed" tone="live" />
          </div>
        </AdminPanel>

        <AdminPanel title="Submit matchday squad" description="Confirm the selection for the chosen fixture.">
          <div className="space-y-3">
            {[
              `${starters.length}/11 starters`,
              `${substitutes.length}/7 substitutes`,
              formation,
              captain ? 'Captain selected' : 'Captain required',
              goalkeeper ? 'Goalkeeper selected' : 'Goalkeeper required',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-lg border border-line bg-surface-muted px-3 py-2.5">
                <CircleCheck className="size-4 shrink-0 text-live" aria-hidden />
                <span className="text-xs font-semibold text-ink">{item}</span>
              </div>
            ))}
            <Button
              fullWidth
              iconLeft={<ListChecks className="size-4" aria-hidden />}
              onClick={() => onAction('Matchday squad submission is a frontend preview; nothing was submitted.')}
            >
              Submit matchday squad
            </Button>
            <div className="flex justify-center">
              <AdminStatusPill status={starters.length === 11 && substitutes.length === 7 ? 'Active' : 'Pending'} label={starters.length === 11 && substitutes.length === 7 ? 'Ready to submit' : 'Selection in progress'} />
            </div>
          </div>
        </AdminPanel>
      </div>
    </>
  )
}
