import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, Lock } from 'lucide-react'
import { useAuth } from '@/auth'
import { AuthLayout, FormAlert, FormField, PasswordField } from '@/components/auth'
import { Button } from '@/components/ui'
import { ROUTES } from '@/config/app'
import type { ValidationErrors } from '@/utils/validation'
import { matchingPasswords, required, validPassword } from '@/utils/validation'

export default function ResetPasswordPage() {
  const { configured, updatePassword } = useAuth()
  const [searchParams] = useSearchParams()
  const [token, setToken] = useState(searchParams.get('token') ?? '')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [notice, setNotice] = useState<string | null>(null)
  const [noticeTone, setNoticeTone] = useState<'error' | 'info' | 'success'>('info')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: ValidationErrors = {}
    const tokenError = !configured ? required(token, 'Reset code') : null
    const passwordError = validPassword(password)
    const confirmationError = matchingPasswords(password, confirmation)
    if (tokenError) nextErrors.token = tokenError
    if (passwordError) nextErrors.password = passwordError
    if (confirmationError) nextErrors.confirmation = confirmationError

    setErrors(nextErrors)
    setNotice(null)
    if (Object.keys(nextErrors).length > 0) return

    if (!configured) {
      setNoticeTone('info')
      setNotice('Frontend preview: the reset code is not verified and no password is changed.')
      return
    }

    setBusy(true)
    const result = await updatePassword(password)
    setBusy(false)
    setNoticeTone(result.success ? 'success' : 'error')
    setNotice(result.message ?? (result.success ? 'Password updated.' : 'Unable to update password.'))
  }

  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Reset password"
      subtitle="Choose a new password for your Lesotho Football Hub account."
      footer={
        <p>
          Back to <Link to={ROUTES.login} className="font-semibold text-white hover:underline">sign in</Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {Object.keys(errors).length > 0 && (
          <FormAlert tone="error">Please correct the highlighted fields before continuing.</FormAlert>
        )}
        {notice && <FormAlert tone={noticeTone}>{notice}</FormAlert>}

        {!configured && (
          <FormField
            label="Reset code"
            name="token"
            autoComplete="off"
            placeholder="Paste the code from your reset link"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            error={errors.token}
            hint="The code is provided in the password reset link."
          />
        )}

        <PasswordField
          label="New password"
          name="new-password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          leadingIcon={<Lock className="size-4" aria-hidden />}
        />

        <PasswordField
          label="Confirm new password"
          name="confirm-password"
          autoComplete="new-password"
          placeholder="Repeat your new password"
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          error={errors.confirmation}
          leadingIcon={<Lock className="size-4" aria-hidden />}
        />

        <Button type="submit" fullWidth size="lg" loading={busy} iconRight={<ArrowRight className="size-4" aria-hidden />}>
          Set new password
        </Button>
      </form>
    </AuthLayout>
  )
}
