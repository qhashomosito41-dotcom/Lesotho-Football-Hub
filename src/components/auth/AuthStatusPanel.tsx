import type { ReactNode } from 'react'
import { AlertCircle, Check, Clock, Info } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface AuthStatusStep {
  title: string
  description: string
  state: 'done' | 'current' | 'upcoming'
}

interface AuthStatusPanelProps {
  tone: 'denied' | 'pending' | 'info'
  label: string
  title: string
  description: string
  steps?: AuthStatusStep[]
  children?: ReactNode
}

const tones = {
  denied: { icon: AlertCircle, wrapper: 'bg-red-50 text-danger', badge: 'bg-danger-soft text-danger' },
  pending: { icon: Clock, wrapper: 'bg-orange-50 text-accent-ink', badge: 'bg-accent-soft text-accent-ink' },
  info: { icon: Info, wrapper: 'bg-blue-50 text-primary', badge: 'bg-primary-soft text-primary' },
}

export function AuthStatusPanel({ tone, label, title, description, steps, children }: AuthStatusPanelProps) {
  const config = tones[tone]
  const Icon = config.icon

  return (
    <div>
      <div className="flex items-start gap-3">
        <span className={cn('grid size-11 shrink-0 place-items-center rounded-full', config.wrapper)}>
          <Icon className="size-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <span className={cn('inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase', config.badge)}>
            {label}
          </span>
          <h2 className="font-display mt-2 text-xl font-bold text-ink">{title}</h2>
        </div>
      </div>
      <p className="body-muted mt-4">{description}</p>

      {steps && steps.length > 0 && (
        <ol className="mt-5 space-y-3">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    'grid size-7 shrink-0 place-items-center rounded-full border text-xs font-bold',
                    step.state === 'done' && 'border-live bg-live text-white',
                    step.state === 'current' && 'border-accent bg-accent-soft text-accent-ink',
                    step.state === 'upcoming' && 'border-line bg-surface-muted text-ink-subtle',
                  )}
                >
                  {step.state === 'done' ? <Check className="size-3.5" aria-hidden /> : index + 1}
                </span>
                {index < steps.length - 1 && <span className="mt-1 h-6 w-px bg-line" aria-hidden />}
              </div>
              <div className="min-w-0 pb-1">
                <p className="text-sm font-semibold text-ink">{step.title}</p>
                <p className="caption mt-0.5">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      )}

      {children && <div className="mt-6">{children}</div>}
    </div>
  )
}
