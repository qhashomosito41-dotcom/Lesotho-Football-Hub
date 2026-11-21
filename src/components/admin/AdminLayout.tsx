import type { ReactNode } from 'react'
import {
  Activity,
  ArrowLeftRight,
  BarChart3,
  Building2,
  CalendarDays,
  ClipboardList,
  FileText,
  LayoutDashboard,
  ScrollText,
  Settings,
  Trophy,
  User,
  Users,
} from 'lucide-react'
import { AdminPreviewNotice } from './AdminPreviewNotice'
import type { AdminSectionId } from '@/config/admin'
import { APP_SHORT_NAME } from '@/config/app'
import { WorkspaceLayout, type WorkspaceNavGroup } from '@/components/workspace'

const ADMIN_NAV_GROUPS: WorkspaceNavGroup<AdminSectionId>[] = [
  {
    label: 'Workspace',
    items: [
      { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'users', label: 'User Management', icon: Users },
      { id: 'clubs', label: 'Club Management', icon: Building2 },
      { id: 'players', label: 'Player Management', icon: User },
    ],
  },
  {
    label: 'Competition operations',
    items: [
      { id: 'competitions', label: 'Competitions', icon: Trophy },
      { id: 'seasons', label: 'Seasons', icon: CalendarDays },
      { id: 'fixtures', label: 'Fixtures', icon: ClipboardList },
      { id: 'matches', label: 'Match Management', icon: Activity },
      { id: 'transfers', label: 'Transfers', icon: ArrowLeftRight },
      { id: 'statistics', label: 'Statistics', icon: BarChart3 },
    ],
  },
  {
    label: 'Governance',
    items: [
      { id: 'reports', label: 'Reports', icon: FileText },
      { id: 'audit', label: 'Audit Logs', icon: ScrollText },
      { id: 'settings', label: 'Website Settings', icon: Settings },
    ],
  },
]

interface AdminLayoutProps {
  section: AdminSectionId
  onSectionChange: (section: AdminSectionId) => void
  title: string
  description: string
  children: ReactNode
  actions?: ReactNode
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
}

export function AdminLayout({
  section,
  onSectionChange,
  title,
  description,
  children,
  actions,
  searchValue,
  onSearchChange,
  searchPlaceholder,
}: AdminLayoutProps) {
  return (
    <WorkspaceLayout
      section={section}
      onSectionChange={onSectionChange}
      groups={ADMIN_NAV_GROUPS}
      title={title}
      description={description}
      actions={actions}
      notice={<AdminPreviewNotice />}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      searchPlaceholder={searchPlaceholder}
      navAriaLabel="Admin sections"
      sectionSelectAriaLabel="Select admin section"
      searchAriaLabel="Search admin records"
      roleLabel="Super administrator"
      roleCaption="Full platform access"
      badgeLabel="Super admin"
      workspaceLabel="Administration"
      footerTitle={`${APP_SHORT_NAME} control room`}
      footerText="Frontend preview only. Administrative services are not connected."
      mainId="admin-main"
    >
      {children}
    </WorkspaceLayout>
  )
}
