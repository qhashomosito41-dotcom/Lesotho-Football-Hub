import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import type { LinkProps } from 'react-router-dom'
import { Link } from 'react-router-dom'
import type { Size } from '@/types'
import { cn } from '@/utils/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'

const baseClasses =
  'inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-hover active:bg-primary-active',
  secondary: 'bg-navy-900 text-white hover:bg-navy-800 active:bg-navy-700',
  outline: 'border border-line-strong bg-white text-ink hover:bg-surface-muted active:bg-surface-sunken',
  ghost: 'text-ink-muted hover:bg-surface-muted hover:text-ink',
  danger: 'bg-danger text-white hover:bg-danger-hover active:bg-red-800',
  success: 'bg-live text-white hover:bg-green-700 active:bg-green-800',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 gap-1.5 rounded-md px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 gap-2.5 px-6 text-base',
}

const iconSizeClasses: Record<Size, string> = {
  sm: 'size-3.5',
  md: 'size-4',
  lg: 'size-5',
}

export function buttonClassName(
  variant: ButtonVariant = 'primary',
  size: Size = 'md',
  fullWidth = false,
  className?: string,
): string {
  return cn(baseClasses, variantClasses[variant], sizeClasses[size], fullWidth && 'w-full', className)
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  iconLeft,
  iconRight,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  const iconSize = iconSizeClasses[size]

  return (
    <button
      type={type}
      className={buttonClassName(variant, size, fullWidth, className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Loader2 className={cn(iconSize, 'animate-spin')} aria-hidden /> : iconLeft}
      {children}
      {!loading && iconRight}
    </button>
  )
}

interface ButtonLinkProps extends LinkProps {
  variant?: ButtonVariant
  size?: Size
  fullWidth?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  iconLeft,
  iconRight,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link className={buttonClassName(variant, size, fullWidth, className)} {...rest}>
      {iconLeft}
      {children}
      {iconRight}
    </Link>
  )
}
