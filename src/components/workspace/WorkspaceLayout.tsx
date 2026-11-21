import type { ReactNode } from 'react'
import { ArrowLeft, Shield, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SearchField, Select } from '@/components/ui'
import { ROUTES } from '@/config/app'
import { Logo } from '@/layouts/components/Logo'
import { cn } from '@/utils/cn'

export interface WorkspaceNavItem<Id extends string> {
  id: Id
  label: string
  icon: LucideIcon
}

export interface WorkspaceNavGroup<Id extends string> {
  label: string
  items: WorkspaceNavItem<Id>[]
}

interface WorkspaceLayoutProps<Id extends string> {
  section: Id
  onSectionChange: (section: Id) => void
  groups: WorkspaceNavGroup<Id>[]
  title: string
  description: string
  children: ReactNode
  actions?: ReactNode
  notice?: ReactNode
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  navAriaLabel: string
  sectionSelectAriaLabel: string
  searchAriaLabel: string
  roleLabel: string
  roleCaption: string
  badgeLabel: string
  workspaceLabel: string
  footerTitle: string
  footerText: string
  mainId: string
}

export function WorkspaceLayout<Id extends string>({
  section,
  onSectionChange,
  groups,
  title,
  description,
  children,
  actions,
  notice,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search records…',
  navAriaLabel,
  sectionSelectAriaLabel,
  searchAriaLabel,
  roleLabel,
  roleCaption,
  badgeLabel,
  workspaceLabel,
  footerTitle,
  footerText,
  mainId,
}: WorkspaceLayoutProps<Id>) {
  const items = groups.flatMap((group) => group.items)
  const activeItem = items.find((item) => item.id === section) ?? items[0]

  return (
    <div className="min-h-screen bg-canvas">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-navy-800 bg-header lg:flex">
          <div className="border-b border-navy-800 px-5 py-5">
            <Logo to={ROUTES.home} />
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-navy-700 bg-elevated px-3 py-2">
              <Shield className="size-4 shrink-0 text-green-400" aria-hidden />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white">{roleLabel}</p>
                <p className="text-[10px] text-navy-300">{roleCaption}</p>
              </div>
            </div>
          </div>

          <nav aria-label={navAriaLabel} className="flex-1 overflow-y-auto px-3 py-4">
            {groups.map((group) => (
              <div key={group.label} className="mb-5">
                <p className="px-3 pb-2 text-[10px] font-bold tracking-wider text-navy-400 uppercase">{group.label}</p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const active = item.id === section

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onSectionChange(item.id)}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-semibold transition-colors',
                          active
                            ? 'bg-primary text-white shadow-card'
                            : 'text-navy-200 hover:bg-elevated hover:text-white',
                        )}
                      >
                        <Icon className="size-4 shrink-0" aria-hidden />
                        <span className="truncate">{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="border-t border-navy-800 px-5 py-4">
            <p className="text-[10px] font-bold tracking-wider text-green-400 uppercase">{footerTitle}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-navy-300">{footerText}</p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-navy-800 bg-header">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="lg:hidden">
                  <Select
                    options={items.map((item) => ({ value: item.id, label: item.label }))}
                    value={section}
                    onChange={(value) => onSectionChange(value as Id)}
                    ariaLabel={sectionSelectAriaLabel}
                    size="sm"
                    className="w-48"
                  />
                </div>
                <div className="hidden min-w-0 lg:block">
                  <p className="text-[10px] font-bold tracking-wider text-navy-400 uppercase">
                    {workspaceLabel} / {activeItem.label}
                  </p>
                  <p className="truncate text-sm font-semibold text-white">{title}</p>
                </div>
              </div>

              <div className="flex min-w-0 flex-1 items-center justify-end gap-3 sm:flex-none">
                {onSearchChange && (
                  <SearchField
                    value={searchValue ?? ''}
                    onChange={onSearchChange}
                    ariaLabel={searchAriaLabel}
                    placeholder={searchPlaceholder}
                    size="sm"
                    className="w-full sm:w-64"
                  />
                )}
                <span className="hidden items-center gap-1.5 rounded-full border border-navy-700 bg-elevated px-2.5 py-1.5 text-[10px] font-bold tracking-wide text-green-400 uppercase sm:inline-flex">
                  <Shield className="size-3" aria-hidden />
                  {badgeLabel}
                </span>
                <Link
                  to={ROUTES.home}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-200 transition-colors hover:text-white"
                >
                  <ArrowLeft className="size-3.5" aria-hidden />
                  <span className="hidden sm:inline">Site</span>
                </Link>
              </div>
            </div>
          </header>

          <main id={mainId} className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-[1600px]">
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="eyebrow text-primary">{activeItem.label}</p>
                  <h1 className="font-display mt-1 text-3xl font-bold text-ink sm:text-4xl">{title}</h1>
                  <p className="body-muted mt-2 max-w-3xl">{description}</p>
                </div>
                {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
              </div>

              {notice}
              <div className="mt-5 space-y-5">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
