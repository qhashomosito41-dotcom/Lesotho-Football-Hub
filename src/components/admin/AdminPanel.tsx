import type { ReactNode } from 'react'
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { cn } from '@/utils/cn'

interface AdminPanelProps {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  bodyClassName?: string
  className?: string
}

export function AdminPanel({ title, description, actions, children, bodyClassName, className }: AdminPanelProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="min-w-0">
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">{actions}</div>}
      </CardHeader>
      <CardBody className={cn('min-w-0', bodyClassName)}>{children}</CardBody>
    </Card>
  )
}
