import { createContext, useContext, type HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

export type CardVariant = 'default' | 'muted' | 'dark'
export type CardPadding = 'none' | 'default'

interface CardContextValue {
  variant: CardVariant
}

const CardContext = createContext<CardContextValue>({ variant: 'default' })

const surfaceClasses: Record<CardVariant, string> = {
  default: 'border-line bg-surface',
  muted: 'border-transparent bg-surface-muted',
  dark: 'border-navy-700 bg-elevated',
}

const dividerClasses: Record<CardVariant, string> = {
  default: 'border-line',
  muted: 'border-line/70',
  dark: 'border-navy-700',
}

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  padding?: CardPadding
  raised?: boolean
}

export function Card({
  variant = 'default',
  padding = 'none',
  raised = false,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <CardContext.Provider value={{ variant }}>
      <div
        className={cn(
          'overflow-hidden rounded-xl border shadow-card',
          surfaceClasses[variant],
          raised && 'shadow-raised',
          padding === 'default' && 'p-5',
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    </CardContext.Provider>
  )
}

export function CardHeader({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const { variant } = useContext(CardContext)

  return (
    <div
      className={cn('flex items-start justify-between gap-4 border-b px-5 py-4', dividerClasses[variant], className)}
      {...rest}
    >
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('card-title', className)} {...rest}>
      {children}
    </h3>
  )
}

export function CardDescription({ className, children, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('body-muted mt-1', className)} {...rest}>
      {children}
    </p>
  )
}

export function CardBody({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-5', className)} {...rest}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const { variant } = useContext(CardContext)

  return (
    <div
      className={cn('flex items-center justify-between gap-3 border-t px-5 py-4', dividerClasses[variant], className)}
      {...rest}
    >
      {children}
    </div>
  )
}
