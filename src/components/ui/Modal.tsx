import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useEscapeKey, useLockBodyScroll } from '@/hooks'
import { cn } from '@/utils/cn'

type ModalSize = 'sm' | 'md' | 'lg'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children?: ReactNode
  footer?: ReactNode
  size?: ModalSize
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export function Modal({ open, onClose, title, description, children, footer, size = 'md' }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEscapeKey(open, onClose)
  useLockBodyScroll(open)

  useEffect(() => {
    if (!open) return
    requestAnimationFrame(() => {
      panelRef.current?.focus()
    })
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      className="animate-fade-in fixed inset-0 z-[90] flex items-end justify-center bg-navy-950/70 p-4 backdrop-blur-sm sm:items-center"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          'animate-modal-in max-h-[calc(100vh-2rem)] w-full overflow-y-auto rounded-xl border border-line bg-surface shadow-overlay focus:outline-none',
          sizeClasses[size],
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <h2 className="section-title">{title}</h2>
            {description && <p className="body-muted mt-1">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="grid size-8 shrink-0 place-items-center rounded-md text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        {children && <div className="px-5 py-5">{children}</div>}

        {footer && <div className="flex justify-end gap-3 border-t border-line bg-surface-muted px-5 py-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
