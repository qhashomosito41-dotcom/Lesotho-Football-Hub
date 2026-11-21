import { Link, useSearchParams } from 'react-router-dom'
import { Home, LogOut, Mail } from 'lucide-react'
import { useAuth } from '@/auth'
import { AuthLayout, AuthStatusPanel, FormAlert, type AuthStatusStep } from '@/components/auth'
import { Button, ButtonLink } from '@/components/ui'
import { ROUTES } from '@/config/app'
import { getRole, USER_ROLES } from '@/config/auth'

const steps: AuthStatusStep[] = [
  { title: 'Account details submitted', description: 'Your invitation details have been recorded.', state: 'done' },
  { title: 'Email address confirmed', description: 'Your account email has been verified.', state: 'done' },
  { title: 'Administrator review', description: 'An LFH administrator is checking your assigned role.', state: 'current' },
  { title: 'Dashboard access enabled', description: 'Role-specific tools become available after approval.', state: 'upcoming' },
]

export default function PendingApprovalPage() {
  const { configured, profile, session, signOut } = useAuth()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') ?? profile?.email ?? null
  const role = getRole(searchParams.get('role')) ?? USER_ROLES[0]
  const currentStatus = profile?.approval_status ?? 'pending'

  return (
    <AuthLayout
      eyebrow="Account status"
      title="Pending approval"
      subtitle="Your account is in the review stage of the LFH onboarding flow."
      footer={
        <p>
          Already approved? <Link to={ROUTES.login} className="font-semibold text-white hover:underline">Sign in</Link>
        </p>
      }
      aside={
        <div className="max-w-lg">
          <p className="eyebrow text-green-400">Onboarding status</p>
          <h2 className="font-display mt-3 text-4xl font-bold leading-tight text-white sm:text-5xl">
            Access is enabled after review.
          </h2>
          <p className="body-muted mt-5 max-w-md text-navy-200">
            Pending approval is a status preview only. No application or administrator workflow is connected in this
            frontend chunk.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-2">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-lg border border-navy-700 bg-elevated px-3 py-2.5 text-xs text-navy-100">
                <span className="font-bold text-green-400">0{index + 1}</span> {step.title}
              </div>
            ))}
          </div>
        </div>
      }
    >
      <AuthStatusPanel
        tone="pending"
        label="Under review"
        title="Your account is awaiting approval."
        description={
          configured
            ? `Your account status is ${currentStatus}. Dashboard access is enabled only after a super administrator approves the account.`
            : email
              ? `We are showing the approval status for ${email}. Your ${role.label} role will be activated after an administrator reviews the request.`
              : `Your ${role.label} role will be activated after an administrator reviews the request.`
        }
        steps={steps}
      >
        {configured ? (
          <FormAlert tone="info">
            Stored approval status: <span className="font-semibold uppercase">{currentStatus}</span>. Request an administrator review if this is unexpected.
          </FormAlert>
        ) : (
          <FormAlert tone="info">
            This is a frontend status preview. No approval request is sent and no account record is created.
          </FormAlert>
        )}

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <ButtonLink to={ROUTES.login} iconLeft={<Mail className="size-4" aria-hidden />}>
            Check sign-in
          </ButtonLink>
          <ButtonLink to={ROUTES.home} variant="outline" iconLeft={<Home className="size-4" aria-hidden />}>
            Return home
          </ButtonLink>
          {configured && session && (
            <Button variant="ghost" iconLeft={<LogOut className="size-4" aria-hidden />} onClick={() => void signOut()}>
              Sign out
            </Button>
          )}
        </div>
      </AuthStatusPanel>
    </AuthLayout>
  )
}
