import { useState } from 'react'
import { Activity, ArrowRight, Check, FileText, Shield, User, Users, Whistle, type LucideIcon } from 'lucide-react'
import { Button, ButtonLink } from '@/components/ui'
import { FormAlert } from '@/components/auth/FormAlert'
import type { UserRole } from '@/config/auth'
import { ROUTES } from '@/config/app'

interface RoleEntryPointProps {
  role: UserRole
}

const ROLE_ICONS: Record<string, LucideIcon> = {
  'public-supporter': User,
  coach: Activity,
  'assistant-coach': FileText,
  'team-manager': FileText,
  'club-administrator': Shield,
  'match-official': Whistle,
  'league-administrator': Users,
  'super-administrator': Shield,
}

export function RoleEntryPoint({ role }: RoleEntryPointProps) {
  const [previewed, setPreviewed] = useState(false)
  const Icon = ROLE_ICONS[role.id] ?? User
  const isClubRole = ['club-administrator', 'coach', 'team-manager', 'assistant-coach'].some((id) => id === role.id)
  const isMatchOfficial = role.id === 'match-official'
  const dashboardPath =
    role.id === 'super-administrator'
      ? ROUTES.admin
      : role.id === 'league-administrator'
        ? ROUTES.leagueAdmin
        : isMatchOfficial
          ? `${ROUTES.liveMatch}?view=official`
          : isClubRole
            ? ROUTES.clubDashboard
            : null
  const dashboardLabel =
    role.id === 'super-administrator'
      ? 'super admin'
      : role.id === 'league-administrator'
        ? 'league admin'
        : isMatchOfficial
          ? 'live match'
          : 'club'
  const showLiveMatchLink = isClubRole && !isMatchOfficial

  return (
    <div className="rounded-xl border border-line bg-surface-muted p-4">
      <div className="flex min-w-0 items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
          <Icon className="size-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="eyebrow text-primary">Dashboard entry point</p>
          <p className="font-display mt-1 text-lg font-bold text-ink">{role.dashboardLabel}</p>
          <p className="caption mt-0.5">{role.accessLevel} access · {role.label}</p>
        </div>
      </div>

      <p className="body-muted mt-3">{role.description}</p>

      <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5">
        {role.capabilities.map((capability) => (
          <li key={capability} className="flex items-start gap-1.5 text-xs text-ink-muted">
            <Check className="mt-0.5 size-3 shrink-0 text-live" aria-hidden />
            <span>{capability}</span>
          </li>
        ))}
      </ul>

      {dashboardPath ? (
        <>
          <ButtonLink
            to={dashboardPath}
            variant="secondary"
            fullWidth
            className="mt-4"
            iconRight={<ArrowRight className="size-4" aria-hidden />}
          >
            Open {dashboardLabel} preview
          </ButtonLink>
          {showLiveMatchLink && (
            <ButtonLink
              to={ROUTES.liveMatch}
              variant="outline"
              fullWidth
              className="mt-2"
              iconRight={<ArrowRight className="size-4" aria-hidden />}
            >
              Open live match preview
            </ButtonLink>
          )}
        </>
      ) : (
        <Button
          type="button"
          variant="secondary"
          fullWidth
          className="mt-4"
          onClick={() => setPreviewed(true)}
          iconRight={<ArrowRight className="size-4" aria-hidden />}
        >
          Preview {role.shortLabel} area
        </Button>
      )}

      {previewed && !dashboardPath && (
        <FormAlert tone="info" className="mt-3">
          Dashboard screens for this role are not part of this frontend chunk. Authentication and protected areas are
          added later.
        </FormAlert>
      )}
    </div>
  )
}
