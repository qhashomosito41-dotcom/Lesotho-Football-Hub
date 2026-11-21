import { useEffect, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Lock, Mail, User } from 'lucide-react'
import { useAuth } from '@/auth'
import { AuthLayout, FormAlert, FormField, PasswordField, RoleEntryPoint } from '@/components/auth'
import { Button } from '@/components/ui'
import { ROUTES } from '@/config/app'
import { getRole, USER_ROLES, type UserRoleId } from '@/config/auth'
import { toUiRole } from '@/lib/authRoles'
import { supabase } from '@/lib/supabase'
import type { ValidationErrors } from '@/utils/validation'
import { matchingPasswords, required, requiredCheckbox, validEmail, validPassword } from '@/utils/validation'

export default function AcceptInvitationPage() {
  const { configured, signUp, acceptInvitation } = useAuth()
  const [searchParams] = useSearchParams()
  const [invitationRole, setInvitationRole] = useState<UserRoleId | null>(null)
  const invitedRole = getRole(invitationRole ?? searchParams.get('role')) ?? USER_ROLES[0]

  const [token, setToken] = useState(searchParams.get('token') ?? '')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState(searchParams.get('email') ?? '')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [notice, setNotice] = useState<string | null>(null)
  const [noticeTone, setNoticeTone] = useState<'error' | 'info' | 'success'>('info')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!configured || !token) return

    void supabase
      .rpc('get_invitation', { p_token: token })
      .then(({ data }) => {
        const invitation = data?.[0]
        if (!invitation) return
        setEmail(invitation.email)
        setFullName(invitation.full_name)
        setInvitationRole(toUiRole(invitation.role))
      })
  }, [configured, token])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: ValidationErrors = {}
    const tokenError = required(token, 'Invitation token')
    const nameError = required(fullName, 'Full name')
    const emailError = validEmail(email)
    const passwordError = validPassword(password)
    const confirmationError = matchingPasswords(password, confirmation)
    const agreementError = requiredCheckbox(agreed, 'Accept the terms to continue.')

    if (tokenError) nextErrors.token = tokenError
    if (nameError) nextErrors.fullName = nameError
    if (emailError) nextErrors.email = emailError
    if (passwordError) nextErrors.password = passwordError
    if (confirmationError) nextErrors.confirmation = confirmationError
    if (agreementError) nextErrors.agreement = agreementError

    setErrors(nextErrors)
    setNotice(null)
    if (Object.keys(nextErrors).length > 0) return

    if (!configured) {
      setNoticeTone('info')
      setNotice('Frontend preview: the invitation token is not verified and no account is created.')
      return
    }

    setBusy(true)
    const created = await signUp(fullName, email, password)
    if (!created.success) {
      setBusy(false)
      setNoticeTone('error')
      setNotice(created.message ?? 'Unable to create the account.')
      return
    }

    const { data } = await supabase.auth.getSession()
    if (!data.session) {
      setBusy(false)
      setNoticeTone('success')
      setNotice('Account created. Confirm your email, sign in, then return here to accept the invitation.')
      return
    }

    const accepted = await acceptInvitation(token)
    setBusy(false)
    setNoticeTone(accepted.success ? 'success' : 'error')
    setNotice(
      accepted.success
        ? 'Invitation accepted. An administrator must approve the account before dashboard access is enabled.'
        : accepted.message ?? 'Account created, but the invitation could not be accepted.',
    )
  }

  return (
    <AuthLayout
      eyebrow="Invitation"
      title="Accept invitation"
      subtitle="Review your assigned role and set up your account details."
      footer={
        <p>
          Need help? <Link to={ROUTES.login} className="font-semibold text-white hover:underline">Return to sign in</Link>
        </p>
      }
      aside={
        <div className="max-w-lg">
          <p className="eyebrow text-green-400">Invited role</p>
          <h2 className="font-display mt-3 text-4xl font-bold leading-tight text-white sm:text-5xl">
            Your access is prepared.
          </h2>
          <p className="body-muted mt-5 max-w-md text-navy-200">
            This invitation is configured for <span className="font-semibold text-white">{invitedRole.label}</span>. Confirm
            the details below to preview the acceptance flow.
          </p>
          <div className="mt-6">
            <RoleEntryPoint role={invitedRole} />
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {Object.keys(errors).length > 0 && (
          <FormAlert tone="error">Please correct the highlighted fields before continuing.</FormAlert>
        )}
        {notice && <FormAlert tone={noticeTone}>{notice}</FormAlert>}

        <div className="rounded-lg border border-line bg-surface-muted px-3 py-2.5 text-xs text-ink-muted">
          Invited role: <span className="font-semibold text-ink">{invitedRole.label}</span> · {invitedRole.accessLevel} access
        </div>

        <FormField
          label="Invitation token"
          name="token"
          autoComplete="off"
          placeholder="Paste your invitation token"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          error={errors.token}
        />

        <FormField
          label="Full name"
          name="fullName"
          autoComplete="name"
          placeholder="Your full name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          error={errors.fullName}
          leadingIcon={<User className="size-4" aria-hidden />}
        />

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
          label="Create password"
          name="new-password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          leadingIcon={<Lock className="size-4" aria-hidden />}
        />

        <PasswordField
          label="Confirm password"
          name="confirm-password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          error={errors.confirmation}
          leadingIcon={<Lock className="size-4" aria-hidden />}
        />

        <div>
          <label className="flex items-start gap-2 text-xs text-ink-muted">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
              className="mt-0.5 size-4 rounded border-line-strong text-primary"
            />
            <span>I accept the platform terms and confirm that these details are accurate.</span>
          </label>
          {errors.agreement && (
            <p role="alert" className="mt-1.5 text-xs font-medium text-danger">
              {errors.agreement}
            </p>
          )}
        </div>

        <Button type="submit" fullWidth size="lg" loading={busy} iconLeft={<CheckCircle2 className="size-4" aria-hidden />}>
          Accept invitation
        </Button>
      </form>
    </AuthLayout>
  )
}
