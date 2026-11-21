import { useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  leadingIcon?: ReactNode
  trailing?: ReactNode
  containerClassName?: string
}

export function FormField({
  label,
  error,
  hint,
  leadingIcon,
  trailing,
  containerClassName,
  className,
  id,
  type = 'text',
  ...rest
}: FormFieldProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const describedBy = [error ? `${fieldId}-error` : null, hint ? `${fieldId}-hint` : null]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cn('min-w-0', containerClassName)}>
      <label htmlFor={fieldId} className="mb-1.5 block text-xs font-semibold text-ink">
        {label}
      </label>
      <div className="relative">
        {leadingIcon && (
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-subtle">
            {leadingIcon}
          </span>
        )}
        <input
          id={fieldId}
          type={type}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy || undefined}
          className={cn(
            'w-full rounded-lg border bg-white text-sm text-ink placeholder:text-ink-subtle transition-colors focus:outline-none',
            'h-11',
            leadingIcon ? 'pl-10' : 'pl-3',
            trailing ? 'pr-12' : 'pr-3',
            error ? 'border-danger focus:border-danger' : 'border-line-strong focus:border-primary',
            className,
          )}
          {...rest}
        />
        {trailing && <div className="absolute top-1/2 right-2 -translate-y-1/2">{trailing}</div>}
      </div>
      {error && (
        <p id={`${fieldId}-error`} role="alert" className="mt-1.5 text-xs font-medium text-danger">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${fieldId}-hint`} className="mt-1.5 text-xs text-ink-muted">
          {hint}
        </p>
      )}
    </div>
  )
}
