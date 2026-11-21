import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Mail } from 'lucide-react'
import { useAuth } from '@/auth'
import { AuthLayout, FormAlert, FormField } from '@/components/auth'
import { Button } from '@/components/ui'
import { ROUTES } from '@/config/app'
import type { ValidationErrors } from '@/utils/validation'
import { validEmail } from '@/utils/validation'

export default function ForgotPasswordPage() {
  const { configured, resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [notice, setNotice] = useState<string | null>(null)
  const [noticeTone, setNoticeTone] = useState<'error' | 'info' | 'success'>('info')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const emailError = validEmail(email)
    const nextErrors: ValidationErrors = {}
    if (emailError) nextErrors.email = emailError

    setErrors(nextErrors)
    setNotice(null)
    if (Object.keys(nextErrors).length > 0) return

    if (!configured) {
      setNoticeTone('info')
      setNotice('Frontend preview: no reset email is sent. Authentication services are added in a later chunk.')
      return
    }

    setBusy(true)
    const result = await resetPassword(email)
    setBusy(false)
    setNoticeTone(result.success ? 'success' : 'error')
    setNotice(result.message ?? (result.success ? 'Reset instructions sent.' : 'Unable to send reset instructions.'))
  }

  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Forgot password"
      subtitle="Enter your account email to preview the password recovery flow."
      footer={
        <p>
          Remembered it? <Link to={ROUTES.login} className="font-semibold text-white hover:underline">Back to sign in</Link>
        </p>
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
          hint="Use the address registered for your LFH account."
        />

        <Button type="submit" fullWidth size="lg" loading={busy} iconRight={<ArrowRight className="size-4" aria-hidden />}>
          Continue
        </Button>
      </form>

      <div className="mt-6 border-t border-line pt-5 text-xs text-ink-muted">
        <p>
          Have a reset link already?{' '}
          <Link to={ROUTES.resetPassword} className="font-semibold text-primary hover:underline">
            Reset password
          </Link>
        </p>
        <p className="mt-2">
          Need an account?{' '}
          <Link to={ROUTES.accountInvitation} className="font-semibold text-primary hover:underline">
            Request an invitation
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
