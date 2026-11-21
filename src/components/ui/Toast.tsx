import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { ToastType } from '@/types'
import { cn } from '@/utils/cn'

export interface ToastItem {
  id: number
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastContextValue {
  toasts: ToastItem[]
  notify: (toast: Omit<ToastItem, 'id'>) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
  dismiss: (id: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const DEFAULT_DURATION = 5000

const typeStyles: Record<ToastType, { icon: ReactNode; iconBox: string; accent: string }> = {
  success: {
    icon: <CheckCircle2 className="size-5" aria-hidden />,
    iconBox: 'bg-live-soft text-live',
    accent: 'border-l-live',
  },
  error: {
    icon: <AlertCircle className="size-5" aria-hidden />,
    iconBox: 'bg-danger-soft text-danger',
    accent: 'border-l-danger',
  },
  warning: {
    icon: <AlertTriangle className="size-5" aria-hidden />,
    iconBox: 'bg-accent-soft text-accent-ink',
    accent: 'border-l-accent',
  },
  info: {
    icon: <Info className="size-5" aria-hidden />,
    iconBox: 'bg-primary-soft text-primary',
    accent: 'border-l-primary',
  },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(0)
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>())

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const notify = useCallback(
    (toast: Omit<ToastItem, 'id'>) => {
      const id = nextId.current
      nextId.current += 1

      const item: ToastItem = {
        id,
        duration: DEFAULT_DURATION,
        ...toast,
      }

      setToasts((current) => [...current, item])

      const duration = item.duration ?? DEFAULT_DURATION
      if (duration > 0) {
        timers.current.set(
          id,
          setTimeout(() => dismiss(id), duration),
        )
      }
    },
    [dismiss],
  )

  const pushOfType = useCallback(
    (type: ToastType) => (title: string, message?: string) => notify({ type, title, message }),
    [notify],
  )

  const value = useMemo<ToastContextValue>(
    () => ({
      toasts,
      notify,
      dismiss,
      success: pushOfType('success'),
      error: pushOfType('error'),
      warning: pushOfType('warning'),
      info: pushOfType('info'),
    }),
    [toasts, notify, dismiss, pushOfType],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed top-4 right-4 z-[100] flex w-[calc(100vw-2rem)] flex-col items-end gap-2 sm:w-96"
        role="region"
        aria-label="Notifications"
      >
        {toasts.map((toast) => {
          const style = typeStyles[toast.type]

          return (
            <div
              key={toast.id}
              role="status"
              aria-live="polite"
              className={cn(
                'animate-toast-in pointer-events-auto flex w-full items-start gap-3 rounded-xl border border-line border-l-4 bg-surface p-3.5 shadow-raised',
                style.accent,
              )}
            >
              <span className={cn('grid size-8 shrink-0 place-items-center rounded-lg', style.iconBox)}>
                {style.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="card-title">{toast.title}</p>
                {toast.message && <p className="body-muted mt-0.5">{toast.message}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
                className="grid size-6 shrink-0 place-items-center rounded text-ink-subtle transition-colors hover:bg-surface-muted hover:text-ink"
              >
                <X className="size-3.5" aria-hidden />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
