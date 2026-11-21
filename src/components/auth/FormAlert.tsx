import type { ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { cn } from '@/utils/cn'

interface FormAlertProps {
  tone?: 'error' | 'info' | 'success'
  children: ReactNode
  className?: string
}

const tones = {
  error: { wrapper: 'border-red-200 bg-red-50 text-red-800', icon: AlertCircle, role: 'alert' as const },
  info: { wrapper: 'border-blue-200 bg-blue-50 text-blue-900', icon: Info, role: 'status' as const },
  success: { wrapper: 'border-green-200 bg-green-50 text-green-900', icon: CheckCircle2, role: 'status' as const },
}

export function FormAlert({ tone = 'info', children, className }: FormAlertProps) {
  const config = tones[tone]
  const Icon = config.icon

  return (
    <div
      role={config.role}
      className={cn('flex items-start gap-2 rounded-lg border px-3 py-2.5 text-xs leading-relaxed', config.wrapper, className)}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div>{children}</div>
    </div>
  )
}
