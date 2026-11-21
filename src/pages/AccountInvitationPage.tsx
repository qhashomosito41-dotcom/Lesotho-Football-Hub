import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Send, User } from 'lucide-react'
import { useAuth } from '@/auth'
import { AuthLayout, FormAlert, FormField, PasswordField, RoleEntryPoint } from '@/components/auth'
import { Button, Select, type SelectOption } from '@/components/ui'
import { ROUTES } from '@/config/app'
import { getRole, ROLE_OPTIONS, USER_ROLES, type UserRoleId } from '@/config/auth'
import { supabase } from '@/lib/supabase'
import type { ValidationErrors } from '@/utils/validation'
import { required, validEmail, validPassword } from '@/utils/validation'

export default function AccountInvitationPage() {
  const { configured, createInvitation, signUp } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<UserRoleId>(USER_ROLES[0].id)
  const [club, setClub] = useState('')
  const [clubId, setClubId] = useState('')
  const [competitionId, setCompetitionId] = useState('')
  const [clubs, setClubs] = useState<SelectOption[]>([])
  const [competitions, setCompetitions] = useState<SelectOption[]>([])
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [notice, setNotice] = useState<string | null>(null)
  const [noticeTone, setNoticeTone] = useState<'error' | 'info' | 'success'>('info')
  const [busy, setBusy] = useState(false)
  const [registrationName, setRegistrationName] = useState('')
  const [registrationEmail, setRegistrationEmail] = useState('')
  const [registrationPassword, setRegistrationPassword] = useState('')
  const [registrationErrors, setRegistrationErrors] = useState<ValidationErrors>({})
  const [registrationNotice, setRegistrationNotice] = useState<string | null>(null)
  const [registrationBusy, setRegistrationBusy] = useState(false)
  const selectedRole = getRole(role) ?? USER_ROLES[0]
  const needsClub = ['club-administrator', 'coach', 'assistant-coach', 'team-manager'].includes(role)
  const needsCompetition = ['league-administrator', 'match-official'].includes(role)

  useEffect(() => {
    if (!configured) return

    void Promise.all([
      supabase.from('clubs').select('id, name').order('name'),
      supabase.from('competitions').select('id, name').order('name'),
    ]).then(([clubResult, competitionResult]) => {
      setClubs(
        (clubResult.data ?? []).map((item) => ({ value: item.id, label: item.name })),
      )
      setCompetitions(
        (competitionResult.data ?? []).map((item) => ({ value: item.id, label: item.name })),
      )
    })
  }, [configured])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: ValidationErrors = {}
    const nameError = required(fullName, 'Full name')
    const emailError = validEmail(email)
    if (nameError) nextErrors.fullName = nameError
    if (emailError) nextErrors.email = emailError

    setErrors(nextErrors)
    setNotice(null)
    if (Object.keys(nextErrors).length > 0) return

    if (!configured) {
      setNoticeTone('info')
      setNotice('Frontend preview: no invitation is created or sent. User management is added in a later chunk.')
      return
    }

    if (needsClub && !clubId) {
      setNoticeTone('error')
      setNotice('Select the club this invitation is scoped to.')
      return
    }

    if (needsCompetition && !competitionId) {
      setNoticeTone('error')
      setNotice('Select the competition this invitation is scoped to.')
      return
    }

    setBusy(true)
    const result = await createInvitation({
      fullName,
      email,
      role,
      clubId: needsClub ? clubId : null,
      competitionId: needsCompetition ? competitionId : null,
      message: note || null,
    })
    setBusy(false)
    setNoticeTone(result.success ? 'success' : 'error')
    setNotice(
      result.success
        ? `Invitation created. Share token: ${result.token ?? 'check the invitations list'}.`
        : result.message ?? 'Unable to create the invitation.',
    )
  }

  const handleSupporterSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: ValidationErrors = {}
    const nameError = required(registrationName, 'Full name')
    const emailError = validEmail(registrationEmail)
    const passwordError = validPassword(registrationPassword)
    if (nameError) nextErrors.fullName = nameError
    if (emailError) nextErrors.email = emailError
    if (passwordError) nextErrors.password = passwordError

    setRegistrationErrors(nextErrors)
    setRegistrationNotice(null)
    if (Object.keys(nextErrors).length > 0) return

    setRegistrationBusy(true)
    const result = await signUp(registrationName, registrationEmail, registrationPassword)
    setRegistrationBusy(false)
    setRegistrationNotice(result.message ?? (result.success ? 'Account created.' : 'Unable to create the account.'))
  }

  return (
    <AuthLayout
      eyebrow="User management"
      title="Account invitation"
      subtitle="Preview the invitation workflow for adding a new LFH user."
      wide
      footer={
        <p>
          Already invited? <Link to={ROUTES.acceptInvitation} className="font-semibold text-white hover:underline">Accept invitation</Link>
        </p>
      }
      aside={
        <div className="max-w-lg">
          <p className="eyebrow text-green-400">Assign the right access</p>
          <h2 className="font-display mt-3 text-4xl font-bold leading-tight text-white sm:text-5xl">
            Invitations carry role-aware permissions.
          </h2>
          <p className="body-muted mt-5 max-w-md text-navy-200">
            Select a role to preview the dashboard entry point the invited user will see after approval.
          </p>
          <div className="mt-6">
            <RoleEntryPoint role={selectedRole} />
          </div>
        </div>
      }
    >
      <>
        <form onSubmit={handleSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
        {Object.keys(errors).length > 0 && (
          <FormAlert tone="error" className="sm:col-span-2">
            Please correct the highlighted fields before continuing.
          </FormAlert>
        )}
        {notice && <FormAlert tone={noticeTone} className="sm:col-span-2">{notice}</FormAlert>}

        <FormField
          label="Full name"
          name="fullName"
          autoComplete="name"
          placeholder="e.g. Thabo Mokoena"
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

        <div className="sm:col-span-2">
          <p className="mb-1.5 text-xs font-semibold text-ink">Role</p>
          <Select options={ROLE_OPTIONS} value={role} onChange={(value) => setRole(value as typeof role)} ariaLabel="Invite role" />
        </div>

        {!configured && (
          <FormField
            label="Club or team (optional)"
            name="club"
            placeholder="e.g. Matlama FC"
            value={club}
            onChange={(event) => setClub(event.target.value)}
            className="sm:col-span-2"
          />
        )}

        {configured && needsClub && (
          <div className="sm:col-span-2">
            <p className="mb-1.5 text-xs font-semibold text-ink">Authorised club</p>
            <Select
              options={clubs}
              value={clubId}
              onChange={setClubId}
              placeholder="Select a club"
              ariaLabel="Invitation club"
            />
          </div>
        )}

        {configured && needsCompetition && (
          <div className="sm:col-span-2">
            <p className="mb-1.5 text-xs font-semibold text-ink">Assigned competition</p>
            <Select
              options={competitions}
              value={competitionId}
              onChange={setCompetitionId}
              placeholder="Select a competition"
              ariaLabel="Invitation competition"
            />
          </div>
        )}

        <div className="sm:col-span-2">
          <label htmlFor="invitation-note" className="mb-1.5 block text-xs font-semibold text-ink">
            Personal note (optional)
          </label>
          <textarea
            id="invitation-note"
            rows={4}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Add context for the invited user…"
            className="w-full rounded-lg border border-line-strong bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-subtle focus:border-primary focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <Button type="submit" fullWidth size="lg" loading={busy} iconLeft={<Send className="size-4" aria-hidden />}>
            {configured ? 'Create invitation' : 'Preview invitation'}
          </Button>
        </div>
        </form>

        {configured && (
          <form onSubmit={handleSupporterSignUp} noValidate className="mt-6 grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <p className="eyebrow text-primary">Supporter registration</p>
              <h2 className="font-display mt-1 text-xl font-bold text-ink">Create a supporter account</h2>
              <p className="caption mt-1">Supporter accounts are self-service. All other roles require an administrator invitation.</p>
            </div>

            {Object.keys(registrationErrors).length > 0 && (
              <FormAlert tone="error" className="sm:col-span-2">
                Please correct the highlighted fields before continuing.
              </FormAlert>
            )}
            {registrationNotice && (
              <FormAlert tone="info" className="sm:col-span-2">
                {registrationNotice}
              </FormAlert>
            )}

            <FormField
              label="Full name"
              name="registrationName"
              autoComplete="name"
              value={registrationName}
              onChange={(event) => setRegistrationName(event.target.value)}
              error={registrationErrors.fullName}
            />
            <FormField
              label="Email address"
              type="email"
              name="registrationEmail"
              autoComplete="email"
              value={registrationEmail}
              onChange={(event) => setRegistrationEmail(event.target.value)}
              error={registrationErrors.email}
            />
            <PasswordField
              label="Password"
              name="registrationPassword"
              autoComplete="new-password"
              value={registrationPassword}
              onChange={(event) => setRegistrationPassword(event.target.value)}
              error={registrationErrors.password}
              hint="At least 8 characters with a letter and a number."
            />
            <div className="sm:col-span-2">
              <Button type="submit" fullWidth size="lg" loading={registrationBusy}>
                Create supporter account
              </Button>
            </div>
          </form>
        )}
      </>
    </AuthLayout>
  )
}
