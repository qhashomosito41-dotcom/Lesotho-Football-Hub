import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DemoNotice } from '@/components/home/DemoNotice'
import { Button, EmptyState, PlayerCard, SearchField, Select } from '@/components/ui'
import { CLUB_LIST } from '@/config/clubs'
import { filterPlayers, playerPath, POSITION_GROUPS } from '@/config/players'

export default function PlayerDirectoryPage() {
  const [query, setQuery] = useState('')
  const [position, setPosition] = useState('all')
  const [club, setClub] = useState('all')

  const players = useMemo(() => filterPlayers(query, position, club), [query, position, club])

  const positionOptions = [
    { value: 'all', label: 'All positions' },
    ...POSITION_GROUPS.map((group) => ({ value: group, label: `${group}s` })),
  ]
  const clubOptions = [
    { value: 'all', label: 'All clubs' },
    ...CLUB_LIST.slice()
      .sort((first, second) => first.name.localeCompare(second.name))
      .map((item) => ({ value: item.id, label: item.name })),
  ]

  return (
    <>
      <DemoNotice />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <p className="eyebrow text-green-400">Player directory</p>
        <h1 className="page-title mt-2 text-white">Players</h1>
        <p className="body-muted mt-3 max-w-2xl text-navy-200">
          Browse first-team squads by name, position or club. Select a player for career and season statistics.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_220px_220px]">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Search players or clubs…"
            ariaLabel="Search players"
            size="lg"
          />
          <Select
            options={positionOptions}
            value={position}
            onChange={setPosition}
            ariaLabel="Filter players by position"
            size="lg"
          />
          <Select
            options={clubOptions}
            value={club}
            onChange={setClub}
            ariaLabel="Filter players by club"
            size="lg"
          />
        </div>

        <p className="caption mt-5 text-navy-400">
          {players.length} {players.length === 1 ? 'player' : 'players'} · demonstration data
        </p>

        {players.length > 0 ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {players.map((player) => (
              <Link key={player.id} to={playerPath(player.id)} className="group">
                <PlayerCard
                  name={player.name}
                  position={player.position}
                  number={player.number}
                  photoUrl={player.photoUrl}
                  nationality={player.nationality}
                  club={player.club}
                  stats={[
                    { label: 'Apps', value: player.seasonStats.appearances },
                    { label: 'Goals', value: player.seasonStats.goals },
                    { label: 'Assists', value: player.seasonStats.assists },
                  ]}
                  className="h-full transition-transform duration-150 group-hover:-translate-y-0.5"
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-navy-700 bg-elevated">
            <EmptyState
              tone="dark"
              title="No players found"
              description="Try a different name, position or club."
              action={
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    setQuery('')
                    setPosition('all')
                    setClub('all')
                  }}
                >
                  Reset filters
                </Button>
              }
            />
          </div>
        )}
      </div>
    </>
  )
}
