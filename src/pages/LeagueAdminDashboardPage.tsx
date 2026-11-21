import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LeagueAdminLayout } from '@/components/leagueAdmin'
import {
  ClubsSection,
  CompetitionsSection,
  DisputesSection,
  FixturesSection,
  OfficialsSection,
  OverviewSection,
  PlayersSection,
  ReportsSection,
  ResultsSection,
  SeasonsSection,
  StandingsSection,
  TransfersSection,
} from '@/components/leagueAdmin/sections'
import { useToast } from '@/components/ui'
import { LEAGUE_SECTION_META, isLeagueSection, type LeagueSectionId } from '@/config/leagueAdmin'

export default function LeagueAdminDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedSection = searchParams.get('section')
  const section: LeagueSectionId = isLeagueSection(requestedSection) ? requestedSection : 'overview'
  const [search, setSearch] = useState('')
  const { info } = useToast()
  const meta = LEAGUE_SECTION_META[section]

  const notify = (message: string) => {
    info('Frontend preview', message)
  }

  const changeSection = (next: LeagueSectionId) => {
    setSearchParams({ section: next })
    setSearch('')
  }

  const renderSection = () => {
    switch (section) {
      case 'competitions':
        return <CompetitionsSection search={search} onAction={notify} />
      case 'seasons':
        return <SeasonsSection search={search} onAction={notify} />
      case 'clubs':
        return <ClubsSection search={search} onAction={notify} />
      case 'players':
        return <PlayersSection search={search} onAction={notify} />
      case 'fixtures':
        return <FixturesSection search={search} onAction={notify} />
      case 'officials':
        return <OfficialsSection search={search} onAction={notify} />
      case 'results':
        return <ResultsSection search={search} onAction={notify} />
      case 'standings':
        return <StandingsSection search={search} onAction={notify} />
      case 'transfers':
        return <TransfersSection search={search} onAction={notify} />
      case 'disputes':
        return <DisputesSection search={search} onAction={notify} />
      case 'reports':
        return <ReportsSection search={search} onAction={notify} />
      case 'overview':
      default:
        return <OverviewSection onAction={notify} onNavigate={changeSection} />
    }
  }

  return (
    <LeagueAdminLayout
      section={section}
      onSectionChange={changeSection}
      title={meta.title}
      description={meta.description}
      searchValue={search}
      onSearchChange={section === 'overview' ? undefined : setSearch}
      searchPlaceholder={`Search ${meta.title.toLowerCase()}…`}
    >
      {renderSection()}
    </LeagueAdminLayout>
  )
}
