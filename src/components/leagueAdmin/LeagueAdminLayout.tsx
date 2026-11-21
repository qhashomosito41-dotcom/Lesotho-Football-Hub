import type { ReactNode } from 'react'
import {
  Activity,
  ArrowLeftRight,
  CalendarDays,
  ClipboardList,
  FileText,
  LayoutDashboard,
  ShieldCheck,
  Table2,
  Trophy,
  Users,
  UserCheck,
  AlertTriangle,
} from 'lucide-react'
import { AdminPreviewNotice } from '@/components/admin'
import { WorkspaceLayout, type WorkspaceNavGroup } from '@/components/workspace'
import type { LeagueSectionId } from '@/config/leagueAdmin'
import { APP_SHORT_NAME } from '@/config/app'

const LEAGUE_NAV_GROUPS: WorkspaceNavGroup<LeagueSectionId>[] = [
  {
    label: 'Overview',
    items: [{ id: 'overview', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Competition setup',
    items: [
      { id: 'competitions', label: 'Competitions', icon: Trophy },
      { id: 'seasons', label: 'Seasons', icon: CalendarDays },
      { id: 'clubs', label: 'Clubs', icon: Users },
      { id: 'players', label: 'Players', icon: UserCheck },
    ],
  },
  {
    label: 'Match operations',
    items: [
      { id: 'fixtures', label: 'Fixtures', icon: ClipboardList },
      { id: 'officials', label: 'Match Officials', icon: ShieldCheck },
      { id: 'results', label: 'Match Results', icon: Activity },
      { id: 'standings', label: 'Standings', icon: Table2 },
    ],
  },
  {
    label: 'Governance',
    items: [
      { id: 'transfers', label: 'Transfers', icon: ArrowLeftRight },
      { id: 'disputes', label: 'Disputes', icon: AlertTriangle },
      { id: 'reports', label: 'Reports', icon: FileText },
    ],
  },
]

interface LeagueAdminLayoutProps {
  section: LeagueSectionId
  onSectionChange: (section: LeagueSectionId) => void
  title: string
  description: string
  children: ReactNode
  actions?: ReactNode
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
}

export function LeagueAdminLayout({
  section,
  onSectionChange,
  title,
  description,
  children,
  actions,
  searchValue,
  onSearchChange,
  searchPlaceholder,
}: LeagueAdminLayoutProps) {
  return (
    <WorkspaceLayout
      section={section}
      onSectionChange={onSectionChange}
      groups={LEAGUE_NAV_GROUPS}
      title={title}
      description={description}
      actions={actions}
      notice={<AdminPreviewNotice />}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      searchPlaceholder={searchPlaceholder}
      navAriaLabel="League sections"
      sectionSelectAriaLabel="Select league section"
      searchAriaLabel="Search league records"
      roleLabel="League administrator"
      roleCaption="Assigned competitions"
      badgeLabel="League admin"
      workspaceLabel="Competition control"
      footerTitle={`${APP_SHORT_NAME} competition office`}
      footerText="Assigned competitions only. Frontend design preview."
      mainId="league-admin-main"
    >
      {children}
    </WorkspaceLayout>
  )
}
