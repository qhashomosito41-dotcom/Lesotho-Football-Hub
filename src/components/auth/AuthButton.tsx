import { LogIn, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, ButtonLink } from '@/components/ui'
import { useToast } from '@/components/ui'
import { ROUTES } from '@/config/app'
import { useAuth } from '@/auth/AuthProvider'
import { cn } from '@/utils/cn'

interface AuthButtonProps {
  className?: string
  fullWidth?: boolean
  onComplete?: () => void
}

export function AuthButton({ className, fullWidth = false, onComplete }: AuthButtonProps) {
  const { configured, session, user, signOut } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  if (!configured || !session) {
    return (
      <ButtonLink
        to={ROUTES.login}
        size={fullWidth ? 'lg' : 'sm'}
        variant="primary"
        fullWidth={fullWidth}
        iconLeft={<LogIn className="size-4" aria-hidden />}
        className={className}
        onClick={onComplete}
      >
        Login
      </ButtonLink>
    )
  }

  const handleSignOut = async () => {
    const result = await signOut()
    if (result.success) {
      toast.success('Signed out', result.message)
      navigate(ROUTES.home)
    } else {
      toast.error('Sign out failed', result.message)
    }
    onComplete?.()
  }

  return (
    <div className={cn('flex items-center gap-2', fullWidth && 'w-full', className)}>
      <span className="hidden min-w-0 flex-1 truncate text-xs text-navy-300 xl:block" title={user?.email ?? ''}>
        {user?.email ?? 'Signed in'}
      </span>
      <Button
        type="button"
        size={fullWidth ? 'lg' : 'sm'}
        variant="outline"
        fullWidth={fullWidth}
        onClick={handleSignOut}
        aria-label="Sign out"
        iconLeft={<LogOut className="size-4" aria-hidden />}
      >
        Sign out
      </Button>
    </div>
  )
}
