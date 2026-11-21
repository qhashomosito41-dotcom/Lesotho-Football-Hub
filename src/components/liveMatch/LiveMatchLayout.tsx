import type { ReactNode } from 'react'
import { Activity, ClipboardList, Goal, ListOrdered, Radio, SlidersHorizontal, UserRound, type LucideIcon } from 'lucide-react'
import { AdminPreviewNotice } from '@/components/admin'
import { WorkspaceLayout, type WorkspaceNavGroup } from '@/components/workspace'
import { APP_SHORT_NAME } from '@/config/app'
import { SCOPE_COPY, type AccessScope, type LiveMatchSectionId } from '@/config/liveMatch'

interface LiveMatchNavItem {
  id: LiveMatchSectionId
  label: string
  icon: LucideIcon
}

const NAV_ITEMS: LiveMatchNavItem[] = [
  { id: 'overview', label: 'Match Overview', icon: Radio },
  { id: 'events', label: 'Event Controls', icon: Activity },
  { id: 'goal', label: 'Goal Entry', icon: Goal },
  { id: 'substitution', label: 'Substitution Entry', icon: UserRound },
  { id: 'control', label: 'Match Control', icon: SlidersHorizontal },
  { id: 'timeline', label: 'Event Timeline', icon: ListOrdered },
]

const NAV_GROUPS: WorkspaceNavGroup<LiveMatchSectionId>[] = [
  { label: 'Live match', items: NAV_ITEMS },
]

interface LiveMatchLayoutProps {
  section: LiveMatchSectionId
  onSectionChange: (section: LiveMatchSectionId) => void
  scope: AccessScope
  title: string
  description: string
  children: ReactNode
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
}

export function LiveMatchLayout({
  section,
  onSectionChange,
  scope,
  title,
  description,
  children,
  searchValue,
  onSearchChange,
  searchPlaceholder,
}: LiveMatchLayoutProps) {
  const scopeCopy = SCOPE_COPY[scope]

  return (
    <WorkspaceLayout
      section={section}
      onSectionChange={onSectionChange}
      groups={NAV_GROUPS}
      title={title}
      description={description}
      actions={
        <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-2 shadow-card">
          <ClipboardList className="size-3.5 shrink-0 text-primary" aria-hidden />
          <span className="max-w-[180px] truncate text-[10px] font-bold tracking-wide text-ink uppercase">{scopeCopy.label}</span>
        </div>
      }
      notice={<AdminPreviewNotice />}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      searchPlaceholder={searchPlaceholder}
      navAriaLabel="Live match sections"
      sectionSelectAriaLabel="Select live match section"
      searchAriaLabel="Search live events"
      roleLabel={scopeCopy.label}
      roleCaption="Authorised live match workspace"
      badgeLabel="Match authorised"
      workspaceLabel="Match office"
      footerTitle={`${APP_SHORT_NAME} match office`}
      footerText={scopeCopy.note}
      mainId="live-match-main"
    >
      {children}
    </WorkspaceLayout>
  )
}
