import { cn } from '@/utils/cn'
import type { CompetitionProfile } from '@/config/competitions'

interface CompetitionLogoProps {
  competition: CompetitionProfile
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'size-10',
  md: 'size-14',
  lg: 'size-20',
}

export function CompetitionLogo({ competition, size = 'md', className }: CompetitionLogoProps) {
  return (
    <img
      src={competition.logoUrl}
      alt={`${competition.name} logo`}
      className={cn('shrink-0 rounded-xl object-cover ring-1 ring-white/10', sizeClasses[size], className)}
    />
  )
}
