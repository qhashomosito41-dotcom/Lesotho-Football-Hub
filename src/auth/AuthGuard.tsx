import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Spinner } from '@/components/ui'
import { ROUTES } from '@/config/app'
import { getRole } from '@/config/auth'
import type { DashboardKey } from '@/auth/AuthProvider'
import { useAuth } from '@/auth/AuthProvider'

interface AuthGuardProps {
  dashboard: DashboardKey
  children: ReactNode
}

export function AuthGuard({ dashboard, children }: AuthGuardProps) {
  const location = useLocation()
  const { configured, loading, session, isApproved, primaryRole, canAccessDashboard } = useAuth()
  const from = `${location.pathname}${location.search}`

  if (!configured) return <>{children}</>

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-canvas">
        <div className="flex flex-col items-center gap-3 text-ink-muted">
          <Spinner className="size-8" />
          <p className="text-sm font-semibold">Checking access…</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <Navigate to={`${ROUTES.login}?from=${encodeURIComponent(from)}`} replace />
  }

  if (!isApproved) {
    const role = getRole(primaryRole)?.id ?? primaryRole
    return <Navigate to={`${ROUTES.pendingApproval}?email=${encodeURIComponent(session.user.email ?? '')}&role=${role}`} replace />
  }

  if (!canAccessDashboard(dashboard)) {
    const role = getRole(primaryRole)?.id ?? primaryRole
    return <Navigate to={`${ROUTES.accessDenied}?from=${encodeURIComponent(from)}&role=${role}`} replace />
  }

  return <>{children}</>
}
