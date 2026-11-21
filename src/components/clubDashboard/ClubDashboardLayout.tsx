import type { ReactNode } from 'react'
import {
  Activity,
  ArrowLeftRight,
  Building2,
  ClipboardCheck,
  ClipboardList,
  FileText,
  LayoutDashboard,
  ShieldCheck,
  Trophy,
  UserCheck,
  Users,
} from 'lucide-react'
import { AdminPreviewNotice } from '@/components/admin'
import { WorkspaceLayout, type WorkspaceNavGroup } from '@/components/workspace'
import { APP_SHORT_NAME } from '@/config/app'
import { CLUB_PROFILE, type ClubSectionId } from '@/config/clubDashboard'

const CLUB_NAV_GROUPS: WorkspaceNavGroup<ClubSectionId>[] = [
  {
    label: 'Club',
    items: [
      { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'profile', label: 'Club Profile', icon: Building2 },
      { id: 'staff', label: 'Club Staff', icon: ShieldCheck },
    ],
  },
  {
    label: 'Players',
    items: [
      { id: 'squad', label: 'Squad Management', icon: Users },
      { id: 'registration', label: 'Player Registration', icon: ClipboardCheck },
      { id: 'matchday-squad', label: 'Matchday Squad', icon: UserCheck },
      { id: 'starting-xi', label: 'Starting XI', icon: Trophy },
    ],
  },
  {
    label: 'Matches',
    items: [
      { id: 'fixtures', label: 'Fixtures', icon: ClipboardList },
      { id: 'match-centre', label: 'Match Centre', icon: Activity },
      { id: 'match-reports', label: 'Match Reports', icon: FileText },
    ],
  },
  {
    label: 'Administration',
    items: [{ id: 'transfers', label: 'Transfers', icon: ArrowLeftRight }],
  },
]

interface ClubDashboardLayoutProps {
  section: ClubSectionId
  onSectionChange: (section: ClubSectionId) => void
  title: string
  description: string
  children: ReactNode
  actions?: ReactNode
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
}

export function ClubDashboardLayout({
  section,
  onSectionChange,
  title,
  description,
  children,
  actions,
  searchValue,
  onSearchChange,
  searchPlaceholder,
}: ClubDashboardLayoutProps) {
  return (
    <WorkspaceLayout
      section={section}
      onSectionChange={onSectionChange}
      groups={CLUB_NAV_GROUPS}
      title={title}
      description={description}
      actions={
        <>
          {actions}
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-2 shadow-card">
            <ShieldCheck className="size-3.5 shrink-0 text-primary" aria-hidden />
            <span className="text-[10px] font-bold tracking-wide text-ink uppercase">{CLUB_PROFILE.name} only</span>
          </div>
        </>
      }
      notice={<AdminPreviewNotice />}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      searchPlaceholder={searchPlaceholder}
      navAriaLabel="Club sections"
      sectionSelectAriaLabel="Select club section"
      searchAriaLabel="Search club records"
      roleLabel={CLUB_PROFILE.name}
      roleCaption="Authorised club workspace"
      badgeLabel="Club authorised"
      workspaceLabel="Club office"
      footerTitle={`${APP_SHORT_NAME} club office`}
      footerText={`Only ${CLUB_PROFILE.name} records can be managed here.`}
      mainId="club-main"
    >
      {children}
    </WorkspaceLayout>
  )
}
