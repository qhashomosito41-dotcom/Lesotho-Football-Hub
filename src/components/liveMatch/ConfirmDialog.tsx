import { AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import { Button, Modal } from '@/components/ui'
import type { ConfirmAction } from './sections/types'

interface ConfirmDialogProps {
  action: ConfirmAction | null
  onClose: () => void
}

const icons = {
  primary: Info,
  danger: AlertTriangle,
  success: CheckCircle2,
}

export function ConfirmDialog({ action, onClose }: ConfirmDialogProps) {
  const Icon = icons[action?.tone ?? 'primary']

  return (
    <Modal
      open={Boolean(action)}
      onClose={onClose}
      title={action?.title ?? 'Confirm action'}
      description={action?.description}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={action?.tone === 'danger' ? 'danger' : action?.tone === 'success' ? 'success' : 'primary'}
            onClick={() => {
              action?.onConfirm()
              onClose()
            }}
          >
            {action?.confirmLabel ?? 'Confirm'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg border border-line bg-surface-muted px-3 py-3">
          <Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
          <p className="text-xs leading-relaxed text-ink-muted">This is a frontend-only confirmation. No live match feed is updated.</p>
        </div>
        {action?.details && action.details.length > 0 && (
          <dl className="space-y-2 rounded-lg border border-line px-3 py-3">
            {action.details.map((detail) => (
              <div key={detail.label} className="flex flex-wrap items-center justify-between gap-2">
                <dt className="text-[10px] font-bold tracking-wide text-ink-muted uppercase">{detail.label}</dt>
                <dd className="text-xs font-semibold text-ink">{detail.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </Modal>
  )
}
