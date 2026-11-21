import { useMemo, useState, type ReactNode } from 'react'
import { ArrowRight, Download, Plus, Activity, Trophy, Users } from 'lucide-react'
import type { SortDirection } from '@/types'
import {
  Button,
  ButtonLink,
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ClubBadge,
  EmptyState,
  LeagueTable,
  MatchCard,
  Modal,
  NavNavLink,
  Pagination,
  PlayerCard,
  SearchField,
  Select,
  Skeleton,
  Spinner,
  StatisticCard,
  StatusBadge,
  Table,
  Tabs,
  useToast,
} from '@/components/ui'
import type { LeagueTableRow, StatusKind, TableColumn, TabItem } from '@/components/ui'
import { ROUTES } from '@/config/app'

function Section({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="section-title text-white">{title}</h2>
        <p className="body-muted mt-1 max-w-2xl text-navy-300">{description}</p>
      </div>
      <div className="rounded-xl border border-line bg-surface p-5 shadow-card sm:p-6">{children}</div>
    </section>
  )
}

function Swatch({ name, hex }: { name: string; hex: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line">
      <div className="h-14" style={{ backgroundColor: hex }} />
      <div className="bg-surface px-2.5 py-2">
        <p className="text-xs font-semibold text-ink">{name}</p>
        <p className="text-[11px] tracking-wide text-ink-muted uppercase">{hex}</p>
      </div>
    </div>
  )
}

function SwatchGroup({ label, colors }: { label: string; colors: [string, string][] }) {
  return (
    <div className="space-y-2.5">
      <p className="eyebrow">{label}</p>
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 lg:grid-cols-6">
        {colors.map(([name, hex]) => (
          <Swatch key={name} name={name} hex={hex} />
        ))}
      </div>
    </div>
  )
}

const navyScale: [string, string][] = [
  ['navy-950', '#070e1b'],
  ['navy-900', '#0b1526'],
  ['navy-800', '#14213b'],
  ['navy-700', '#1d3054'],
  ['navy-600', '#2a4270'],
  ['navy-500', '#3b5a96'],
  ['navy-400', '#5c7cbc'],
  ['navy-300', '#8aa3d4'],
  ['navy-200', '#b7c6e6'],
  ['navy-100', '#dce4f3'],
  ['navy-50', '#f0f4fb'],
]

const blueScale: [string, string][] = [
  ['blue-700', '#1d4ed8'],
  ['blue-600', '#2563eb'],
  ['blue-500', '#3b82f6'],
  ['blue-100', '#dbeafe'],
  ['blue-50', '#eff6ff'],
]

const greenScale: [string, string][] = [
  ['green-700', '#15803d'],
  ['green-600', '#16a34a'],
  ['green-500', '#22c55e'],
  ['green-100', '#dcfce7'],
  ['green-50', '#f0fdf4'],
]

const orangeScale: [string, string][] = [
  ['orange-700', '#c2410c'],
  ['orange-600', '#ea580c'],
  ['orange-500', '#f97316'],
  ['orange-100', '#ffedd5'],
  ['orange-50', '#fff7ed'],
]

const redScale: [string, string][] = [
  ['red-700', '#b91c1c'],
  ['red-600', '#dc2626'],
  ['red-500', '#ef4444'],
  ['red-100', '#fee2e2'],
  ['red-50', '#fef2f2'],
]

const neutralScale: [string, string][] = [
  ['surface', '#ffffff'],
  ['grey-50', '#f8fafc'],
  ['grey-100', '#f1f5f9'],
  ['grey-200', '#e2e8f0'],
  ['grey-300', '#cbd5e1'],
  ['grey-400', '#94a3b8'],
  ['grey-500', '#64748b'],
  ['grey-700', '#334155'],
]

const semanticTokens: [string, string][] = [
  ['canvas', '#070e1b'],
  ['header', '#0b1526'],
  ['elevated', '#14213b'],
  ['surface', '#ffffff'],
  ['surface-muted', '#f8fafc'],
  ['line', '#e2e8f0'],
  ['ink', '#070e1b'],
  ['ink-muted', '#64748b'],
  ['primary', '#2563eb'],
  ['live', '#16a34a'],
  ['accent', '#f97316'],
  ['danger', '#dc2626'],
]

const statusKinds: StatusKind[] = [
  'live',
  'upcoming',
  'finished',
  'postponed',
  'cancelled',
  'at-break',
  'win',
  'draw',
  'loss',
  'yellow-card',
  'red-card',
]

const leagueRows: LeagueTableRow[] = [
  { position: 1, team: { id: 'matlama', name: 'Matlama FC', shortName: 'MAT', color: '#1d4ed8' }, played: 6, won: 4, drawn: 1, lost: 1, goalDifference: 5, points: 13, form: ['win', 'win', 'draw', 'win', 'loss', 'win'] },
  { position: 2, team: { id: 'bantu', name: 'Bantu FC', shortName: 'BAN', color: '#16a34a' }, played: 6, won: 4, drawn: 0, lost: 2, goalDifference: 5, points: 12, form: ['win', 'loss', 'win', 'win', 'loss', 'win'] },
  { position: 3, team: { id: 'lioli', name: 'Lioli FC', shortName: 'LIO', color: '#dc2626' }, played: 6, won: 3, drawn: 2, lost: 1, goalDifference: 3, points: 11, form: ['draw', 'win', 'win', 'draw', 'loss', 'win'] },
  { position: 4, team: { id: 'lmps', name: 'LMPS FC', shortName: 'LMPS', color: '#14213b' }, played: 6, won: 3, drawn: 1, lost: 2, goalDifference: 1, points: 10, form: ['win', 'loss', 'win', 'draw', 'loss', 'win'] },
  { position: 5, team: { id: 'lifofane', name: 'Lifofane FC', shortName: 'LIF', color: '#f97316' }, played: 6, won: 2, drawn: 3, lost: 1, goalDifference: 1, points: 9, form: ['draw', 'draw', 'win', 'loss', 'draw', 'win'] },
  { position: 6, team: { id: 'lcs', name: 'LCS FC', shortName: 'LCS', color: '#2a4270' }, played: 6, won: 2, drawn: 2, lost: 2, goalDifference: -1, points: 8, form: ['loss', 'draw', 'win', 'draw', 'loss', 'win'] },
  { position: 7, team: { id: 'swallows', name: 'Swallows FC', shortName: 'SWA', color: '#3b5a96' }, played: 6, won: 1, drawn: 2, lost: 3, goalDifference: -4, points: 5, form: ['draw', 'loss', 'draw', 'loss', 'win', 'loss'] },
  { position: 8, team: { id: 'mafolofolo', name: 'Mafolofolo FC', shortName: 'MAF', color: '#64748b' }, played: 6, won: 0, drawn: 1, lost: 5, goalDifference: -9, points: 1, form: ['loss', 'loss', 'draw', 'loss', 'loss', 'loss'] },
]

const leagueZones: Record<number, 'success' | 'primary' | 'danger'> = {
  1: 'success',
  2: 'primary',
  3: 'primary',
  7: 'danger',
  8: 'danger',
}

interface ScorerRow {
  id: string
  rank: number
  player: string
  club: string
  goals: number
  assists: number
}

const scorerRows: ScorerRow[] = [
  { id: 's1', rank: 1, player: 'Tšepang Moloi', club: 'Matlama FC', goals: 9, assists: 3 },
  { id: 's2', rank: 2, player: 'Retselisitsoe Khotle', club: 'Bantu FC', goals: 7, assists: 5 },
  { id: 's3', rank: 3, player: 'Mosa Lebese', club: 'Lioli FC', goals: 6, assists: 2 },
  { id: 's4', rank: 4, player: 'Nkosi Ramaema', club: 'LMPS FC', goals: 5, assists: 4 },
  { id: 's5', rank: 5, player: 'Tšeliso Mofolo', club: 'Lifofane FC', goals: 4, assists: 1 },
  { id: 's6', rank: 6, player: 'Boitumelo Sekgoma', club: 'LCS FC', goals: 3, assists: 3 },
]

const scorerColumns: TableColumn<ScorerRow>[] = [
  { key: 'rank', header: '#', align: 'center', width: '3.5rem' },
  { key: 'player', header: 'Player', cell: (row) => <span className="font-semibold text-ink">{row.player}</span> },
  { key: 'club', header: 'Club', cell: (row) => <span className="text-ink-muted">{row.club}</span> },
  { key: 'goals', header: 'Goals', align: 'center', sortable: true },
  { key: 'assists', header: 'Assists', align: 'center', sortable: true },
]

type DemoTab = 'overview' | 'fixtures' | 'stats' | 'squad'

const demoTabs: TabItem<DemoTab>[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'fixtures', label: 'Fixtures' },
  { id: 'stats', label: 'Statistics' },
  { id: 'squad', label: 'Squad' },
]

const leagueOptions = [
  { value: 'vodacom', label: 'Vodacom Premier League' },
  { value: 'championship', label: 'Lesotho Championship' },
  { value: 'cup', label: 'LNFA Knockout Cup' },
  { value: 'u20', label: 'National U-20 League' },
]

export default function DesignSystemPage() {
  const toast = useToast()
  const [tab, setTab] = useState<DemoTab>('overview')
  const [search, setSearch] = useState('')
  const [league, setLeague] = useState<string | null>('vodacom')
  const [sort, setSort] = useState<{ key: string; direction: SortDirection } | undefined>(undefined)
  const [page, setPage] = useState(3)
  const [modalOpen, setModalOpen] = useState(false)

  const sortedScorers = useMemo(() => {
    if (!sort) return scorerRows
    const rows = [...scorerRows]
    rows.sort((a, b) => {
      const key = sort.key as keyof ScorerRow
      const aValue = a[key]
      const bValue = b[key]
      const result =
        typeof aValue === 'number' && typeof bValue === 'number'
          ? aValue - bValue
          : String(aValue).localeCompare(String(bValue))
      return sort.direction === 'asc' ? result : -result
    })
    return rows
  }, [sort])

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <header className="border-b border-navy-800 pb-10">
          <p className="eyebrow text-live">Lesotho Football Hub · Design System</p>
          <h1 className="page-title mt-2 text-white">LFH Design System</h1>
          <p className="body-muted mt-3 max-w-2xl text-navy-200">
            Global tokens, typography rules, reusable components and styling conventions for Lesotho Football Hub.
            Every public page and dashboard must be composed from this system — no one-off colours or ad-hoc styles.
          </p>
        </header>

        <div className="mt-10 space-y-10">
          <Section
            title="Colour palette"
            description="Deep navy anchors backgrounds and navigation. Blue drives primary actions, green marks live and positive data, orange highlights notifications, red signals errors. Never introduce colours outside this system."
          >
            <div className="space-y-6">
              <SwatchGroup label="Navy — background & navigation" colors={navyScale} />
              <SwatchGroup label="Blue — primary actions" colors={blueScale} />
              <SwatchGroup label="Green — live & positive" colors={greenScale} />
              <SwatchGroup label="Orange — highlights & notifications" colors={orangeScale} />
              <SwatchGroup label="Red — errors & destructive" colors={redScale} />
              <SwatchGroup label="Neutral — content surfaces" colors={neutralScale} />
              <SwatchGroup label="Semantic tokens" colors={semanticTokens} />
            </div>
          </Section>

          <Section
            title="Typography"
            description="Barlow Condensed carries display moments — titles, scores, team names and statistics. Inter handles interface and body copy. Use these semantic classes instead of ad-hoc font sizes."
          >
            <div className="divide-y divide-line">
              {(
                [
                  ['Page title', <p key="1" className="page-title">Premier League</p>, '.page-title'],
                  ['Section heading', <p key="2" className="section-title">Matchweek 6 Review</p>, '.section-title'],
                  ['Card title', <p key="3" className="card-title">Top scorers</p>, '.card-title'],
                  ['Match score', <p key="4" className="score-display">2 – 1</p>, '.score-display'],
                  ['Team name', <p key="5" className="team-name text-lg">Matlama FC</p>, '.team-name'],
                  ['Player name', <p key="6" className="player-name">Tšepang Moloi</p>, '.player-name'],
                  ['Statistic value', <p key="7" className="stat-value text-3xl">13</p>, '.stat-value'],
                  ['Navigation label', <p key="8" className="nav-label">Fixtures</p>, '.nav-label'],
                  ['Supporting description', <p key="9" className="body-muted">Live standings update after every full-time whistle.</p>, '.body-muted'],
                  ['Caption / metadata', <p key="10" className="caption">Sat 21 Nov 2026 · 15:00 · Setsoto Stadium</p>, '.caption'],
                  ['Eyebrow / label', <p key="11" className="eyebrow">Matchweek 6</p>, '.eyebrow'],
                ] as [string, ReactNode, string][]
              ).map(([label, preview, className]) => (
                <div key={label} className="flex flex-wrap items-baseline justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold tracking-wide text-ink-muted uppercase">{label}</p>
                    <div className="mt-1.5">{preview}</div>
                  </div>
                  <code className="rounded bg-surface-muted px-2 py-1 font-mono text-xs text-ink-muted">{className}</code>
                </div>
              ))}
            </div>
          </Section>

          <Section
            title="Buttons"
            description="Six variants cover every action: primary (blue) for main flows, secondary (navy), outline, ghost, danger (red) for destructive confirmations and success for positive confirmations."
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="eyebrow">Variants</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="success">Success</Button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="eyebrow">Sizes</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="eyebrow">With icons, loading & disabled</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button iconLeft={<Plus className="size-4" />}>New fixture</Button>
                  <Button variant="outline" iconRight={<Download className="size-4" />}>
                    Export
                  </Button>
                  <Button loading>Saving</Button>
                  <Button variant="outline" disabled>
                    Disabled
                  </Button>
                  <ButtonLink to={ROUTES.designSystem} variant="secondary" iconRight={<ArrowRight className="size-4" />}>
                    Link button
                  </ButtonLink>
                </div>
              </div>
            </div>
          </Section>

          <Section
            title="Status indicators"
            description="Consistent badges for match states, results, cards and form. Live badges pulse to communicate real-time activity."
          >
            <div className="flex flex-wrap items-center gap-3">
              {statusKinds.map((kind) => (
                <StatusBadge key={kind} kind={kind} size="md" />
              ))}
              <StatusBadge kind="live" label="67'" />
            </div>
          </Section>

          <Section
            title="Cards, badges & statistics"
            description="Cards are the primary content container. Club badges, player cards and statistic cards give teams, players and KPIs a consistent presence."
          >
            <div className="space-y-8">
              <div className="space-y-3">
                <p className="eyebrow">Card anatomy</p>
                <Card className="max-w-md">
                  <CardHeader>
                    <div>
                      <CardTitle>Matchweek 6 report</CardTitle>
                      <CardDescription>Attendance and goal averages for the round.</CardDescription>
                    </div>
                    <StatusBadge kind="finished" />
                  </CardHeader>
                  <CardBody>
                    <p className="body-muted">
                      Twelve matches produced 31 goals, averaging 2.6 per fixture — the highest return this season.
                    </p>
                  </CardBody>
                  <CardFooter>
                    <span className="caption">Updated 21 Nov 2026</span>
                    <Button size="sm" variant="outline">
                      View details
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="space-y-3">
                <p className="eyebrow">Statistic cards</p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <StatisticCard label="Goals scored" value="148" icon={<Trophy className="size-5" />} trend={{ value: '+12%', direction: 'up' }} caption="vs last season" />
                  <StatisticCard label="Avg. attendance" value="4,120" icon={<Users className="size-5" />} trend={{ value: '+318', direction: 'up' }} caption="per match" />
                  <StatisticCard label="Matches live" value="3" icon={<Activity className="size-5" />} trend={{ value: 'On track', direction: 'neutral' }} caption="this weekend" />
                </div>
              </div>

              <div className="space-y-3">
                <p className="eyebrow">Club badges</p>
                <div className="flex flex-wrap items-center gap-4">
                  <ClubBadge name="Matlama FC" shortName="MAT" color="#1d4ed8" size="sm" />
                  <ClubBadge name="Bantu FC" shortName="BAN" color="#16a34a" size="md" />
                  <ClubBadge name="Lioli FC" shortName="LIO" color="#dc2626" size="lg" />
                  <ClubBadge name="LMPS FC" shortName="LMPS" color="#14213b" size="lg" />
                </div>
              </div>

              <div className="space-y-3">
                <p className="eyebrow">Player card</p>
                <div className="max-w-xs">
                  <PlayerCard
                    name="Tšepang Moloi"
                    position="Forward"
                    number={9}
                    nationality="Lesotho"
                    club={{ name: 'Matlama FC', shortName: 'MAT', color: '#1d4ed8' }}
                    stats={[
                      { label: 'Goals', value: 9 },
                      { label: 'Assists', value: 3 },
                      { label: 'Apps', value: 6 },
                    ]}
                  />
                </div>
              </div>
            </div>
          </Section>

          <Section
            title="Match cards"
            description="The core unit of the platform. Default variant for detail views, compact for lists. Live, upcoming and finished states share one structure."
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <MatchCard
                home={{ id: 'matlama', name: 'Matlama FC', shortName: 'MAT', color: '#1d4ed8' }}
                away={{ id: 'bantu', name: 'Bantu FC', shortName: 'BAN', color: '#16a34a' }}
                status="live"
                homeScore={2}
                awayScore={1}
                minute={67}
                competition={{ name: 'Vodacom Premier League', round: 'Matchweek 6' }}
                venue="Setsoto Stadium"
                date="Sat 21 Nov 2026"
              />
              <MatchCard
                home={{ id: 'lioli', name: 'Lioli FC', shortName: 'LIO', color: '#dc2626' }}
                away={{ id: 'lmps', name: 'LMPS FC', shortName: 'LMPS', color: '#14213b' }}
                status="upcoming"
                kickoff="15:00"
                date="Sun 22 Nov 2026"
                competition={{ name: 'Vodacom Premier League', round: 'Matchweek 6' }}
                venue="Lifelong Stadium"
              />
              <MatchCard
                home={{ id: 'lifofane', name: 'Lifofane FC', shortName: 'LIF', color: '#f97316' }}
                away={{ id: 'lcs', name: 'LCS FC', shortName: 'LCS', color: '#2a4270' }}
                status="finished"
                homeScore={0}
                awayScore={0}
                competition={{ name: 'Vodacom Premier League', round: 'Matchweek 6' }}
                venue='Thamae Stadium'
                date="Full time · Sat 21 Nov"
              />
              <div className="space-y-3">
                <p className="eyebrow">Compact variant</p>
                <MatchCard
                  home={{ id: 'swallows', name: 'Swallows FC', shortName: 'SWA', color: '#3b5a96' }}
                  away={{ id: 'mafolofolo', name: 'Mafolofolo FC', shortName: 'MAF', color: '#64748b' }}
                  status="finished"
                  homeScore={3}
                  awayScore={1}
                  variant="compact"
                />
                <MatchCard
                  home={{ id: 'bantu', name: 'Bantu FC', shortName: 'BAN', color: '#16a34a' }}
                  away={{ id: 'lioli', name: 'Lioli FC', shortName: 'LIO', color: '#dc2626' }}
                  status="upcoming"
                  kickoff="18:00"
                  date="Tue 24 Nov"
                  variant="compact"
                />
              </div>
            </div>
          </Section>

          <Section
            title="Navigation & tabs"
            description="Navigation links come in dark (on navy) and light (on white) tones with clear active states. Tabs support underline and pill variants plus keyboard navigation."
          >
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-1 rounded-lg bg-header p-2">
                <span className="mr-auto px-2 font-display text-lg font-bold tracking-wide text-white">LFH</span>
                <NavNavLink to={ROUTES.designSystem} end>
                  Design system
                </NavNavLink>
                <NavNavLink to="/tables">Tables</NavNavLink>
                <NavNavLink to="/live">Live</NavNavLink>
              </div>

              <div className="space-y-4">
                <Tabs items={demoTabs} value={tab} onChange={setTab} ariaLabel="Underline tabs" />
                <Tabs items={demoTabs} value={tab} onChange={setTab} variant="pill" ariaLabel="Pill tabs" />
                <div className="rounded-lg bg-surface-muted p-4">
                  <p className="body-muted">Active panel: <span className="font-semibold text-ink">{tab}</span></p>
                </div>
              </div>
            </div>
          </Section>

          <Section
            title="Search, dropdowns & forms"
            description="Form controls share one height, border and focus treatment. Search supports clear and loading states; the dropdown is keyboard accessible."
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="demo-search" className="eyebrow block">
                  Search field
                </label>
                <SearchField value={search} onChange={setSearch} placeholder="Search clubs, players, matches…" />
                <p className="caption">Value: {search ? search : 'empty'}</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="demo-select" className="eyebrow block">
                  Dropdown
                </label>
                <Select
                  options={leagueOptions}
                  value={league}
                  onChange={setLeague}
                  ariaLabel="Select competition"
                  placeholder="Select competition"
                />
                <p className="caption">Value: {league ?? 'none'}</p>
              </div>
            </div>
          </Section>

          <Section
            title="League table & data table"
            description="LeagueTable handles standings with zone indicators and form pills. Table is the generic data grid with sorting, loading and empty states."
          >
            <div className="space-y-8">
              <div className="space-y-3">
                <p className="eyebrow">Vodacom Premier League · standings</p>
                <LeagueTable rows={leagueRows} zoneMap={leagueZones} showForm caption="Premier League standings" />
                <div className="flex flex-wrap gap-4">
                  <span className="caption flex items-center gap-1.5">
                    <span className="size-2.5 rounded-sm bg-live" /> Champion
                  </span>
                  <span className="caption flex items-center gap-1.5">
                    <span className="size-2.5 rounded-sm bg-primary" /> Continental
                  </span>
                  <span className="caption flex items-center gap-1.5">
                    <span className="size-2.5 rounded-sm bg-danger" /> Relegation
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="eyebrow">Sortable data table · top scorers</p>
                <Table
                  columns={scorerColumns}
                  rows={sortedScorers}
                  rowKey={(row) => row.id}
                  sort={sort}
                  onSortChange={(key, direction) => setSort({ key, direction })}
                  caption="Top scorers"
                />
              </div>

              <div className="space-y-3">
                <p className="eyebrow">Table · loading state</p>
                <Table columns={scorerColumns} rows={[]} rowKey={(row) => row.id} loading caption="Loading top scorers" />
              </div>

              <Pagination page={page} pageCount={8} onPageChange={setPage} totalItems={96} pageSize={12} />
            </div>
          </Section>

          <Section
            title="Feedback & system states"
            description="Notifications, modals, empty states and loading states keep users informed. Every async surface must have a loading and an empty treatment."
          >
            <div className="space-y-8">
              <div className="space-y-3">
                <p className="eyebrow">Notifications</p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="success" onClick={() => toast.success('Fixture saved', 'Matlama vs Bantu was added to Matchweek 7.')}>
                    Success toast
                  </Button>
                  <Button variant="danger" onClick={() => toast.error('Submission failed', 'Please check the required fields and try again.')}>
                    Error toast
                  </Button>
                  <Button variant="outline" onClick={() => toast.warning('Match postponed', 'Kickoff time is still being confirmed.')}>
                    Warning toast
                  </Button>
                  <Button variant="outline" onClick={() => toast.info('New table data', 'Standings were refreshed a moment ago.')}>
                    Info toast
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <p className="eyebrow">Modal</p>
                <Button variant="primary" onClick={() => setModalOpen(true)}>
                  Open confirmation modal
                </Button>
                <Modal
                  open={modalOpen}
                  onClose={() => setModalOpen(false)}
                  title="Postpone this fixture?"
                  description="Players and officials will be notified. The match moves to the pending list."
                  footer={
                    <>
                      <Button variant="outline" onClick={() => setModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button variant="danger" onClick={() => setModalOpen(false)}>
                        Postpone match
                      </Button>
                    </>
                  }
                >
                  <div className="space-y-3">
                    <div className="rounded-lg border border-line bg-surface-muted p-3">
                      <p className="card-title">Matlama FC vs Bantu FC</p>
                      <p className="caption mt-0.5">Sat 21 Nov 2026 · 15:00 · Setsoto Stadium</p>
                    </div>
                    <p className="body-muted">This action can be reverted by an administrator from the fixtures module.</p>
                  </div>
                </Modal>
              </div>

              <div className="space-y-3">
                <p className="eyebrow">Empty state</p>
                <div className="rounded-lg border border-dashed border-line">
                  <EmptyState
                    title="No matches scheduled"
                    description="There are no fixtures for this competition yet. Create a fixture to get started."
                    action={<Button iconLeft={<Plus className="size-4" />}>Create fixture</Button>}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <p className="eyebrow">Loading states</p>
                <div className="flex flex-wrap items-center gap-6 text-ink-muted">
                  <Spinner size="sm" />
                  <Spinner size="md" />
                  <Spinner size="lg" label="Loading statistics…" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3 rounded-xl border border-line p-4">
                    <div className="flex items-center gap-3">
                      <Skeleton variant="circle" width="2.5rem" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    </div>
                    <Skeleton variant="text" lines={3} />
                  </div>
                  <div className="space-y-3 rounded-xl border border-line p-4">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}
