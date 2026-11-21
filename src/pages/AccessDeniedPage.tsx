import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Check, Home, LogIn } from 'lucide-react'
import { AuthLayout, AuthStatusPanel, RoleEntryPoint } from '@/components/auth'
import { ButtonLink } from '@/components/ui'
import { ROUTES } from '@/config/app'
import { getRole, USER_ROLES } from '@/config/auth'

export default function AccessDeniedPage() {
  const [searchParams] = useSearchParams()
  const role = getRole(searchParams.get('role'))
  const requestedPath = searchParams.get('from')
  const displayRole = role ?? USER_ROLES[0]

  return (
    <AuthLayout
      eyebrow="Permission required"
      title="Access denied"
      subtitle="This area is restricted to users with the correct LFH role."
      footer={
        <p>
          Think this is a mistake? <Link to={ROUTES.accountInvitation} className="font-semibold text-white hover:underline">Request access</Link>
        </p>
      }
      aside={
        <div className="max-w-lg">
          <p className="eyebrow text-green-400">Role-aware permissions</p>
          <h2 className="font-display mt-3 text-4xl font-bold leading-tight text-white sm:text-5xl">
            Different areas require different access.
          </h2>
          <p className="body-muted mt-5 max-w-md text-navy-200">
            {role
              ? `You reached this page with the ${role.label} role preview. The entry point below shows the area available to that role.`
              : 'Choose a role on the sign-in page to preview the dashboard entry point available to that role.'}
          </p>
          <div className="mt-6">
            <RoleEntryPoint role={displayRole} />
          </div>
        </div>
      }
    >
      <AuthStatusPanel
        tone="denied"
        label="Restricted area"
        title={role ? `${role.label} access cannot open this area.` : 'You do not have permission to view this area.'}
        description={
          requestedPath
            ? `The requested page “${requestedPath}” is not available for this role. Ask an administrator to review your role if you believe access is required.`
            : 'Ask an administrator to review your role or return to a page available to your account.'
        }
      >
        <div className="rounded-lg border border-line bg-surface-muted p-4">
          <p className="text-xs font-semibold text-ink">Current preview role</p>
          <p className="mt-1 text-sm font-bold text-ink">{displayRole.label}</p>
          <p className="caption mt-1">{displayRole.accessLevel} access · {displayRole.dashboardLabel}</p>
          <ul className="mt-3 grid gap-1.5">
            {displayRole.capabilities.slice(0, 4).map((capability) => (
              <li key={capability} className="flex items-start gap-2 text-xs text-ink-muted">
                <Check className="mt-0.5 size-3 shrink-0 text-live" aria-hidden />
                <span>{capability}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <ButtonLink to={ROUTES.login} iconLeft={<LogIn className="size-4" aria-hidden />}>
            Sign in
          </ButtonLink>
          <ButtonLink to={ROUTES.home} variant="outline" iconLeft={<Home className="size-4" aria-hidden />}>
            Go home
          </ButtonLink>
        </div>
        <Link
          to={ROUTES.login}
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Back to sign-in options
        </Link>
      </AuthStatusPanel>
    </AuthLayout>
  )
}
