import { Info } from 'lucide-react'
import type { ComponentType } from 'react'
import { useParams } from 'react-router-dom'
import { Card } from '@/components/ui'

interface PlaceholderPageProps {
  title: string
  description: string
  icon: ComponentType<{ className?: string }>
  paramLabel?: string
}

function formatSlug(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function PlaceholderPage({ title, description, icon: Icon, paramLabel }: PlaceholderPageProps) {
  const params = useParams()
  const paramValue = paramLabel ? params[paramLabel] : undefined
  const displayTitle = paramValue ? `${title} — ${formatSlug(paramValue)}` : title

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-20">
      <div className="flex items-start gap-4 sm:gap-5">
        <span className="hidden size-12 shrink-0 place-items-center rounded-xl border border-navy-700 bg-elevated text-live sm:grid">
          <Icon className="size-6" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="eyebrow text-live">Lesotho Football Hub</p>
          <h1 className="page-title mt-2 text-white">{displayTitle}</h1>
          <p className="body-muted mt-3 max-w-2xl text-navy-200">{description}</p>
        </div>
      </div>

      <Card variant="dark" padding="default" className="mt-8 max-w-2xl">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 size-5 shrink-0 text-navy-400" aria-hidden />
          <div className="min-w-0">
            <p className="card-title text-white">Part of the LFH roadmap</p>
            <p className="body-muted mt-1 text-navy-300">
              This section will be built on the design system in a later chunk. The global layout, navigation
              and search around it are fully functional today.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
