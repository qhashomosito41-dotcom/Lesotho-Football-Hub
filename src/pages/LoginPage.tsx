import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LockKeyhole, LogIn, Mail } from 'lucide-react'
import { useAuth } from '@/auth'
import { AuthLayout, FormAlert, FormField, PasswordField, RoleEntryPoint } from '@/components/auth'
import { Button, Select } from '@/components/ui'
import { ROUTES } from '@/config/app'
import { getRole, ROLE_OPTIONS, USER_ROLES } from '@/config/auth'
import { dashboardPathForRole } from '@/lib/authRoles'
import type { ValidationErrors } from '@/utils/validation'
import { validEmail, validPassword } from '@/utils/validation'

export default function LoginPage() {
  const { configured, primaryRole, signIn } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState(USER_ROLES[0].id)
  const [remember, setRemember] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [notice, setNotice] = useState<string | null>(null)
  const [noticeTone, setNoticeTone] = useState<'error' | 'info' | 'success'>('info')
  const [busy, setBusy] = useState(false)
  const selectedRole = getRole(role) ?? USER_ROLES[0]

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: ValidationErrors = {}
    const emailError = validEmail(email)
    const passwordError = validPassword(password)
    if (emailError) nextErrors.email = emailError
    if (passwordError) nextErrors.password = passwordError

    setErrors(nextErrors)
    setNotice(null)
    if (Object.keys(nextErrors).length > 0) return

    if (!configured) {
      setNoticeTone('info')
      setNotice('Frontend preview: sign-in is not connected. No credentials were submitted or stored.')
      return
    }

    setBusy(true)
    const result = await signIn(email, password)
    setBusy(false)

    if (!result.success) {
      setNoticeTone('error')
      setNotice(result.message ?? 'Unable to sign in.')
      return
    }

    setNoticeTone('success')
    setNotice(result.message ?? 'Signed in successfully.')
    const requestedFrom = new URLSearchParams(location.search).get('from')
    const destination = requestedFrom ?? dashboardPathForRole(primaryRole) ?? ROUTES.home
    window.setTimeout(() => navigate(destination, { replace: true }), 250)
  }

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to LFH"
      subtitle="Access the tools and information relevant to your role."
      footer={
        <p>
          New to the platform? <Link to={ROUTES.accountInvitation} className="font-semibold text-white hover:underline">Request an invitation</Link>
        </p>
      }
      aside={
        <div className="max-w-lg">
          <p className="eyebrow text-green-400">Role-aware access</p>
          <h2 className="font-display mt-3 text-4xl font-bold leading-tight text-white sm:text-5xl">
            The right dashboard for every role.
          </h2>
          <p className="body-muted mt-5 max-w-md text-navy-200">
            Choose a role to preview the dashboard entry point designed for that level of access.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {USER_ROLES.map((item) => (
              <span
                key={item.id}
                className="rounded-full border border-navy-700 bg-elevated px-2.5 py-1 text-[10px] font-semibold text-navy-100"
              >
                {item.label}
              </span>
            ))}
          </div>
          <div className="mt-6">
            <RoleEntryPoint role={selectedRole} />
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {Object.keys(errors).length > 0 && (
          <FormAlert tone="error">Please correct the highlighted fields before continuing.</FormAlert>
        )}
        {notice && <FormAlert tone={noticeTone}>{notice}</FormAlert>}

        <FormField
          label="Email address"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
          leadingIcon={<Mail className="size-4" aria-hidden />}
        />

        <PasswordField
          label="Password"
          name="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          hint="At least 8 characters with a letter and a number."
          leadingIcon={<LockKeyhole className="size-4" aria-hidden />}
        />

        {!configured && (
          <div>
            <p className="mb-1.5 text-xs font-semibold text-ink">Account role</p>
            <Select
              options={ROLE_OPTIONS}
              value={role}
              onChange={(value) => setRole(value as typeof role)}
              ariaLabel="Select account role"
            />
            <p className="caption mt-1.5">Demonstration only — real roles are assigned by an administrator.</p>
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-xs text-ink-muted">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="size-4 rounded border-line-strong text-primary"
            />
            Keep me signed in
          </label>
          <Link to={ROUTES.forgotPassword} className="text-xs font-semibold text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth size="lg" loading={busy} iconLeft={<LogIn className="size-4" aria-hidden />}>
          Sign in
        </Button>
      </form>

      <div className="mt-6 grid gap-2 border-t border-line pt-5 text-xs">
        <Link to={ROUTES.acceptInvitation} className="flex items-center justify-between rounded-lg bg-surface-muted px-3 py-2.5 font-semibold text-ink hover:bg-surface-sunken">
          Accept an invitation <span aria-hidden>→</span>
        </Link>
        <Link to={ROUTES.pendingApproval} className="flex items-center justify-between rounded-lg bg-surface-muted px-3 py-2.5 font-semibold text-ink hover:bg-surface-sunken">
          Check approval status <span aria-hidden>→</span>
        </Link>
        <Link to={ROUTES.accessDenied} className="flex items-center justify-between rounded-lg bg-surface-muted px-3 py-2.5 font-semibold text-ink hover:bg-surface-sunken">
          Access denied example <span aria-hidden>→</span>
        </Link>
      </div>
    </AuthLayout>
  )
}
