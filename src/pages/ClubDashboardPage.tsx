import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ClubDashboardLayout } from '@/components/clubDashboard'
import {
  ClubProfileSection,
  ClubStaffSection,
  FixturesSection,
  MatchCentreSection,
  MatchReportsSection,
  MatchdaySquadSection,
  OverviewSection,
  PlayerRegistrationSection,
  SquadManagementSection,
  StartingXISection,
  TransfersSection,
} from '@/components/clubDashboard/sections'
import { useToast } from '@/components/ui'
import { CLUB_SECTION_META, isClubSection, type ClubSectionId } from '@/config/clubDashboard'

export default function ClubDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedSection = searchParams.get('section')
  const section: ClubSectionId = isClubSection(requestedSection) ? requestedSection : 'overview'
  const [search, setSearch] = useState('')
  const { info } = useToast()
  const meta = CLUB_SECTION_META[section]

  const notify = (message: string) => {
    info('Frontend preview', message)
  }

  const changeSection = (next: ClubSectionId) => {
    setSearchParams({ section: next })
    setSearch('')
  }

  const renderSection = () => {
    switch (section) {
      case 'profile':
        return <ClubProfileSection search={search} onAction={notify} />
      case 'squad':
        return <SquadManagementSection search={search} onAction={notify} />
      case 'registration':
        return <PlayerRegistrationSection search={search} onAction={notify} />
      case 'matchday-squad':
        return <MatchdaySquadSection search={search} onAction={notify} />
      case 'starting-xi':
        return <StartingXISection search={search} onAction={notify} />
      case 'fixtures':
        return <FixturesSection search={search} onAction={notify} />
      case 'match-centre':
        return <MatchCentreSection search={search} onAction={notify} />
      case 'transfers':
        return <TransfersSection search={search} onAction={notify} />
      case 'match-reports':
        return <MatchReportsSection search={search} onAction={notify} />
      case 'staff':
        return <ClubStaffSection search={search} onAction={notify} />
      case 'overview':
      default:
        return <OverviewSection onAction={notify} onNavigate={changeSection} />
    }
  }

  return (
    <ClubDashboardLayout
      section={section}
      onSectionChange={changeSection}
      title={meta.title}
      description={meta.description}
      searchValue={search}
      onSearchChange={section === 'overview' ? undefined : setSearch}
      searchPlaceholder={`Search ${meta.title.toLowerCase()}…`}
    >
      {renderSection()}
    </ClubDashboardLayout>
  )
}
