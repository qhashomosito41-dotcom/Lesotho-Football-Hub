import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '@/auth'
import { AdminLayout, SupabaseAdminPanel } from '@/components/admin'
import {
  AuditLogsSection,
  ClubManagementSection,
  CompetitionManagementSection,
  FixtureManagementSection,
  MatchManagementSection,
  OverviewSection,
  PlayerManagementSection,
  ReportsSection,
  SeasonManagementSection,
  SettingsSection,
  StatisticsSection,
  TransferManagementSection,
  UserManagementSection,
} from '@/components/admin/sections'
import { useToast } from '@/components/ui'
import { ADMIN_SECTION_META, isAdminSection, type AdminSectionId } from '@/config/admin'

export default function SuperAdminDashboardPage() {
  const { configured } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedSection = searchParams.get('section')
  const section: AdminSectionId = isAdminSection(requestedSection) ? requestedSection : 'overview'
  const [search, setSearch] = useState('')
  const { info } = useToast()
  const meta = ADMIN_SECTION_META[section]

  const notify = (message: string) => {
    info('Frontend preview', message)
  }

  const changeSection = (next: AdminSectionId) => {
    setSearchParams({ section: next })
    setSearch('')
  }

  const renderSection = () => {
    switch (section) {
      case 'users':
        return <UserManagementSection search={search} onAction={notify} />
      case 'clubs':
        return <ClubManagementSection search={search} onAction={notify} />
      case 'players':
        return <PlayerManagementSection search={search} onAction={notify} />
      case 'competitions':
        return <CompetitionManagementSection search={search} onAction={notify} />
      case 'seasons':
        return <SeasonManagementSection search={search} onAction={notify} />
      case 'fixtures':
        return <FixtureManagementSection search={search} onAction={notify} />
      case 'matches':
        return <MatchManagementSection search={search} onAction={notify} />
      case 'transfers':
        return <TransferManagementSection search={search} onAction={notify} />
      case 'statistics':
        return <StatisticsSection search={search} onAction={notify} />
      case 'reports':
        return <ReportsSection search={search} onAction={notify} />
      case 'audit':
        return <AuditLogsSection search={search} onAction={notify} />
      case 'settings':
        return <SettingsSection search={search} onAction={notify} />
      case 'overview':
      default:
        return <OverviewSection onAction={notify} onNavigate={changeSection} />
    }
  }

  return (
    <AdminLayout
      section={section}
      onSectionChange={changeSection}
      title={meta.title}
      description={meta.description}
      searchValue={search}
      onSearchChange={section === 'overview' ? undefined : setSearch}
      searchPlaceholder={`Search ${meta.title.toLowerCase()}…`}
    >
      {configured && section === 'overview' && <SupabaseAdminPanel />}
      {renderSection()}
    </AdminLayout>
  )
}
