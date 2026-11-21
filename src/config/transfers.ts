import { COMPETITION_SEASONS } from './competitions'
import { CLUB_LIST } from './clubs'
import { getPlayer, PLAYER_LIST, playerPath } from './players'

export const TRANSFER_SEASONS = COMPETITION_SEASONS

export type TransferType = 'permanent' | 'loan' | 'free-agent'
export type TransferStatus = 'approved' | 'pending'
export type TransferDirection = 'arrival' | 'departure'

export interface TransferRecord {
  id: string
  playerId: string
  playerName: string
  photoUrl: string
  playerTo: string
  fromClub: string
  toClub: string
  type: TransferType
  status: TransferStatus
  direction: TransferDirection
  season: string
  dateISO: string
  feeLabel: string
}

export interface TransferFilters {
  season?: string
  direction?: TransferDirection | 'all'
  type?: TransferType | 'all'
  status?: TransferStatus | 'all'
}

export const TRANSFER_TYPE_OPTIONS: { value: TransferType | 'all'; label: string }[] = [
  { value: 'all', label: 'All transfer types' },
  { value: 'permanent', label: 'Permanent transfers' },
  { value: 'loan', label: 'Loan transfers' },
  { value: 'free-agent', label: 'Free agents' },
]

export const TRANSFER_STATUS_OPTIONS: { value: TransferStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'approved', label: 'Approved transfers' },
  { value: 'pending', label: 'Pending transfers' },
]

export const TRANSFER_DIRECTION_OPTIONS: { value: TransferDirection | 'all'; label: string }[] = [
  { value: 'all', label: 'All movements' },
  { value: 'arrival', label: 'Player arrivals' },
  { value: 'departure', label: 'Player departures' },
]

export const TRANSFER_TYPE_LABELS: Record<TransferType, string> = {
  permanent: 'Permanent',
  loan: 'Loan',
  'free-agent': 'Free agent',
}

function hash(input: string): number {
  let value = 0
  for (let index = 0; index < input.length; index += 1) {
    value = (value * 31 + input.charCodeAt(index)) >>> 0
  }
  return value
}

function photoFor(playerId: string, playerName: string): string {
  return getPlayer(playerId)?.photoUrl ?? PLAYER_LIST[0].photoUrl ?? playerName
}

function dateForSeason(season: string, seed: number): string {
  const year = Number(season.slice(0, 4))
  const month = String((seed % 3) + 7).padStart(2, '0')
  const day = String((seed % 24) + 1).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function feeFor(type: TransferType, seed: number): string {
  if (type === 'free-agent') return 'Free transfer'
  if (type === 'loan') return seed % 2 === 0 ? 'Season loan' : 'Six-month loan'
  return seed % 4 === 0 ? 'Undisclosed fee' : `L${(seed % 8) + 1}00k`
}

const FEATURED_TRANSFERS: TransferRecord[] = [
  {
    id: 'featured-thabo',
    playerId: 'matlama-1',
    playerName: 'Thabo Mokoena',
    photoUrl: photoFor('matlama-1', 'Thabo Mokoena'),
    playerTo: playerPath('matlama-1'),
    fromClub: 'Lioli FC',
    toClub: 'Matlama FC',
    type: 'permanent',
    status: 'approved',
    direction: 'arrival',
    season: '2025/26',
    dateISO: '2026-08-02',
    feeLabel: 'Undisclosed fee',
  },
  {
    id: 'featured-katleho',
    playerId: 'matlama-2',
    playerName: 'Katleho Mofolo',
    photoUrl: photoFor('matlama-2', 'Katleho Mofolo'),
    playerTo: playerPath('matlama-2'),
    fromClub: 'Bantu FC',
    toClub: 'Matlama FC',
    type: 'loan',
    status: 'approved',
    direction: 'arrival',
    season: '2025/26',
    dateISO: '2026-08-11',
    feeLabel: 'Season loan',
  },
  {
    id: 'featured-mpho',
    playerId: 'linare-1',
    playerName: 'Mpho Thabantso',
    photoUrl: photoFor('linare-1', 'Mpho Thabantso'),
    playerTo: playerPath('linare-1'),
    fromClub: 'Free agent',
    toClub: 'Linare FC',
    type: 'free-agent',
    status: 'approved',
    direction: 'arrival',
    season: '2025/26',
    dateISO: '2026-08-18',
    feeLabel: 'Free transfer',
  },
  {
    id: 'featured-teboho',
    playerId: 'lcs-1',
    playerName: 'Teboho Lekhooa',
    photoUrl: photoFor('lcs-1', 'Teboho Lekhooa'),
    playerTo: playerPath('lcs-1'),
    fromClub: 'LCS FC',
    toClub: 'LMPS FC',
    type: 'loan',
    status: 'pending',
    direction: 'departure',
    season: '2025/26',
    dateISO: '2026-09-05',
    feeLabel: 'Six-month loan',
  },
  {
    id: 'featured-tumelo',
    playerId: 'bantu-1',
    playerName: 'Tumelo Ramohapi',
    photoUrl: photoFor('bantu-1', 'Tumelo Ramohapi'),
    playerTo: playerPath('bantu-1'),
    fromClub: 'Bantu FC',
    toClub: 'Lioli FC',
    type: 'permanent',
    status: 'pending',
    direction: 'departure',
    season: '2025/26',
    dateISO: '2026-09-09',
    feeLabel: 'L800k',
  },
]

const GENERATED_TRANSFERS: TransferRecord[] = PLAYER_LIST.slice(0, 84).map((player, index) => {
  const seed = hash(`${player.id}-transfer`)
  const direction: TransferDirection = seed % 2 === 0 ? 'arrival' : 'departure'
  const type: TransferType = seed % 9 === 0 ? 'free-agent' : seed % 5 === 0 ? 'loan' : 'permanent'
  const status: TransferStatus = seed % 6 === 0 ? 'pending' : 'approved'
  const season = index % 7 === 0 ? COMPETITION_SEASONS[1] : index % 11 === 0 ? COMPETITION_SEASONS[2] : COMPETITION_SEASONS[0]
  const previousClub = player.transferHistory.at(-1)?.from ?? CLUB_LIST[(seed + 1) % CLUB_LIST.length].name
  const destinationClub = CLUB_LIST[(seed + 5) % CLUB_LIST.length].name
  const fromClub = type === 'free-agent' ? 'Free agent' : direction === 'arrival' ? previousClub : player.club.name
  const toClub = direction === 'arrival' ? player.club.name : destinationClub

  return {
    id: `generated-${player.id}`,
    playerId: player.id,
    playerName: player.name,
    photoUrl: player.photoUrl,
    playerTo: playerPath(player.id),
    fromClub,
    toClub,
    type,
    status,
    direction,
    season,
    dateISO: dateForSeason(season, seed),
    feeLabel: feeFor(type, seed),
  }
})

export const TRANSFERS: TransferRecord[] = [...FEATURED_TRANSFERS, ...GENERATED_TRANSFERS].sort((first, second) =>
  second.dateISO.localeCompare(first.dateISO),
)

export function filterTransfers(filters: TransferFilters = {}): TransferRecord[] {
  return TRANSFERS.filter((transfer) => {
    const seasonMatches = !filters.season || filters.season === 'all' || transfer.season === filters.season
    const directionMatches = !filters.direction || filters.direction === 'all' || transfer.direction === filters.direction
    const typeMatches = !filters.type || filters.type === 'all' || transfer.type === filters.type
    const statusMatches = !filters.status || filters.status === 'all' || transfer.status === filters.status
    return seasonMatches && directionMatches && typeMatches && statusMatches
  })
}

export function transferCounts(season = 'all') {
  const records = filterTransfers({ season })
  return {
    arrivals: records.filter((transfer) => transfer.direction === 'arrival').length,
    departures: records.filter((transfer) => transfer.direction === 'departure').length,
    approved: records.filter((transfer) => transfer.status === 'approved').length,
    pending: records.filter((transfer) => transfer.status === 'pending').length,
    permanent: records.filter((transfer) => transfer.type === 'permanent').length,
    loan: records.filter((transfer) => transfer.type === 'loan').length,
    freeAgents: records.filter((transfer) => transfer.type === 'free-agent').length,
  }
}

export function transferHistory(season = 'all'): { season: string; transfers: TransferRecord[] }[] {
  const seasons = season === 'all' ? TRANSFER_SEASONS : [season]
  return seasons.map((item) => ({
    season: item,
    transfers: filterTransfers({ season: item }),
  }))
}
