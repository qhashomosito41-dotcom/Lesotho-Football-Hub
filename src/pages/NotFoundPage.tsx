import { ButtonLink } from '@/components/ui'
import { ROUTES } from '@/config/app'

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center">
      <p className="eyebrow text-live">404</p>
      <h1 className="page-title mt-2 text-white">Page not found</h1>
      <p className="body-muted mt-3 max-w-md text-navy-200">
        The page you are looking for does not exist or has moved. Head back to the platform.
      </p>
      <ButtonLink to={ROUTES.home} variant="primary" className="mt-6">
        Back to home
      </ButtonLink>
    </div>
  )
}
