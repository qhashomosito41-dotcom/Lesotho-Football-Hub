import { useParams } from 'react-router-dom'
import { DemoNotice } from '@/components/home/DemoNotice'
import { ProfileHeader, ProfileSection, ProfileStatGrid } from '@/components/profile'
import { EmptyState, Table, type TableColumn } from '@/components/ui'
import { ROUTES } from '@/config/app'
import { formatDateShort } from '@/config/league'
import { getPlayer, playerPath, type PlayerCareerEntry, type PlayerMatchHistory, type PlayerTransfer } from '@/config/players'
import { clubPath } from '@/config/homepage'
import { Link } from 'react-router-dom'

const careerColumns: TableColumn<PlayerCareerEntry>[] = [
  { key: 'club', header: 'Club', cell: (row) => <span className="font-semibold text-ink">{row.club}</span> },
  { key: 'season', header: 'Season', cell: (row) => row.season },
  { key: 'apps', header: 'Apps', align: 'center', cell: (row) => row.appearances },
  { key: 'goals', header: 'Goals', align: 'center', cell: (row) => row.goals },
]

const transferColumns: TableColumn<PlayerTransfer>[] = [
  { key: 'season', header: 'Season', cell: (row) => <span className="font-semibold text-ink">{row.season}</span> },
  { key: 'from', header: 'From', cell: (row) => row.from },
  { key: 'to', header: 'To', cell: (row) => row.to },
]

const matchColumns: TableColumn<PlayerMatchHistory>[] = [
  { key: 'date', header: 'Date', cell: (row) => formatDateShort(row.date) },
  { key: 'competition', header: 'Competition', cell: (row) => row.competition },
  { key: 'opponent', header: 'Opponent', cell: (row) => <span className="font-semibold text-ink">{row.opponent}</span> },
  {
    key: 'result',
    header: 'Result',
    align: 'center',
    cell: (row) => (
      <span
        className={`inline-grid size-6 place-items-center rounded-full text-xs font-bold ${
          row.result === 'W' ? 'bg-live-soft text-live' : row.result === 'D' ? 'bg-surface-muted text-ink-muted' : 'bg-danger-soft text-danger'
        }`}
      >
        {row.result}
      </span>
    ),
  },
  { key: 'score', header: 'Score', align: 'center', cell: (row) => <span className="tabular-nums">{row.score}</span> },
]

export default function PlayerProfilePage() {
  const { playerId } = useParams()
  const player = getPlayer(playerId)

  if (!player) {
    return (
      <>
        <DemoNotice />
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <h1 className="page-title text-white">Player not found</h1>
          <div className="mt-6 rounded-xl border border-navy-700 bg-elevated">
            <EmptyState
              tone="dark"
              title="No player with that ID"
              description="Return to the player directory to browse available profiles."
            />
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <DemoNotice />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <h1 className="sr-only">{player.name}</h1>
        <ProfileHeader
          avatar={
            <img
              src={player.photoUrl}
              alt={`${player.name} portrait`}
              className="size-28 rounded-2xl object-cover ring-4 ring-white/10 sm:size-36"
            />
          }
          eyebrow="Player profile"
          title={player.name}
          subtitle={`${player.position} · Shirt #${player.number}`}
          meta={[
            { label: 'Club', value: player.club.name },
            { label: 'Age', value: String(player.age) },
            { label: 'Nationality', value: player.nationality },
            { label: 'Preferred foot', value: player.preferredFoot },
          ]}
          backTo={ROUTES.players}
          backLabel="All players"
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="min-w-0 space-y-6 lg:col-span-2">
            <ProfileSection title="Season statistics" description="Public statistics for 2025/26.">
              <ProfileStatGrid
                columns={3}
                stats={[
                  { label: 'Appearances', value: player.seasonStats.appearances },
                  { label: 'Goals', value: player.seasonStats.goals },
                  { label: 'Assists', value: player.seasonStats.assists },
                  { label: 'Yellow cards', value: player.seasonStats.yellowCards },
                  { label: 'Red cards', value: player.seasonStats.redCards },
                  { label: 'Minutes', value: player.seasonStats.minutes },
                ]}
              />
            </ProfileSection>

            <ProfileSection title="Match history" description="Recent appearances recorded in the results archive.">
              <Table
                columns={matchColumns}
                rows={player.matchHistory}
                rowKey={(row) => row.id}
                compact
                caption={`Recent matches for ${player.name}`}
              />
            </ProfileSection>
          </div>

          <div className="min-w-0 space-y-6">
            <ProfileSection title="Player details" description="Non-private profile information.">
              <dl className="space-y-3">
                {[
                  { label: 'Full name', value: player.name },
                  { label: 'Shirt number', value: `#${player.number}` },
                  { label: 'Position', value: player.position },
                  { label: 'Current club', value: player.club.name },
                  { label: 'Age', value: String(player.age) },
                  { label: 'Nationality', value: player.nationality },
                  { label: 'Preferred foot', value: player.preferredFoot },
                ].map((item) => (
                  <div key={item.label} className="flex items-baseline justify-between gap-3 border-b border-line pb-2">
                    <dt className="eyebrow">{item.label}</dt>
                    <dd className="text-right text-sm font-semibold text-ink">{item.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to={clubPath(player.club.id)}
                  className="rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary"
                >
                  View club profile
                </Link>
                <Link
                  to={playerPath(player.id)}
                  className="rounded-full bg-surface-muted px-3 py-1.5 text-xs font-semibold text-ink"
                >
                  Public profile
                </Link>
              </div>
            </ProfileSection>

            <ProfileSection title="Career history" description="Season-by-season appearances and goals.">
              <Table
                columns={careerColumns}
                rows={player.careerHistory}
                rowKey={(row) => `${row.season}-${row.club}`}
                compact
                caption={`Career history for ${player.name}`}
              />
            </ProfileSection>

            <ProfileSection title="Transfer history" description="Demonstration registrations from public records.">
              <Table
                columns={transferColumns}
                rows={player.transferHistory}
                rowKey={(row) => row.season}
                compact
                caption={`Transfer history for ${player.name}`}
              />
            </ProfileSection>
          </div>
        </div>
      </div>
    </>
  )
}
