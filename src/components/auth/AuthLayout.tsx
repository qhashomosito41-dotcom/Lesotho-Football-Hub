import type { ReactNode } from 'react'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AuthNotice } from '@/components/auth/AuthNotice'
import { Logo } from '@/layouts/components/Logo'
import { ROUTES } from '@/config/app'
import { USER_ROLES } from '@/config/auth'
import { cn } from '@/utils/cn'

interface AuthLayoutProps {
  eyebrow?: string
  title: string
  subtitle?: string
  children: ReactNode
  aside?: ReactNode
  footer?: ReactNode
  wide?: boolean
}

export default function AuthLayout({
  eyebrow = 'Account access',
  title,
  subtitle,
  children,
  aside,
  footer,
  wide = false,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="border-b border-navy-800 bg-header">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Logo />
          <Link
            to={ROUTES.home}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-200 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            Back to site
          </Link>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl flex-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:items-center lg:py-16">
        <section className="hidden min-w-0 lg:block">
          {aside ?? (
            <div className="max-w-lg">
              <p className="eyebrow text-green-400">Role-based access</p>
              <h2 className="font-display mt-3 text-4xl font-bold leading-tight text-white sm:text-5xl">
                One platform. Every level of the game.
              </h2>
              <p className="body-muted mt-5 max-w-md text-navy-200">
                Lesotho Football Hub gives supporters, teams, clubs and administrators a clear place to work with
                football information.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-2">
                {USER_ROLES.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center gap-2 rounded-lg border border-navy-700 bg-elevated px-3 py-2.5 text-xs font-semibold text-navy-100"
                  >
                    <ShieldCheck className="size-3.5 shrink-0 text-green-400" aria-hidden />
                    <span className="truncate">{role.label}</span>
                  </div>
                ))}
              </div>
              <p className="caption mt-6 text-navy-400">
                Dashboard access is role-aware. Authentication services are added in a later implementation chunk.
              </p>
            </div>
          )}
        </section>

        <section className="w-full min-w-0">
          <div
            className={cn(
              'mx-auto w-full rounded-2xl border border-line bg-surface p-6 shadow-raised sm:p-8',
              wide ? 'max-w-none' : 'max-w-lg',
            )}
          >
            <p className="eyebrow text-primary">{eyebrow}</p>
            <h1 className="font-display mt-2 text-3xl font-bold text-ink sm:text-4xl">{title}</h1>
            {subtitle && <p className="body-muted mt-3">{subtitle}</p>}
            <div className="mt-5">
              <AuthNotice />
            </div>
            <div className="mt-6">{children}</div>
          </div>
          {footer && <div className="mx-auto mt-5 max-w-lg text-center text-xs text-navy-300">{footer}</div>}
        </section>
      </main>
    </div>
  )
}
