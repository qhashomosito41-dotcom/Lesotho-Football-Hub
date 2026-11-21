import { Link } from 'react-router-dom'
import { useLiveStatus } from '@/hooks'
import { ROUTES } from '@/config/app'
import { cn } from '@/utils/cn'

interface LiveIndicatorProps {
  className?: string
}

export function LiveIndicator({ className }: LiveIndicatorProps) {
  const { liveCount, hasLiveMatches } = useLiveStatus()

  if (!hasLiveMatches) return null

  return (
    <Link
      to={ROUTES.liveScores}
      aria-label={`Live scores — ${liveCount} matches in progress`}
      className={cn(
        'inline-flex h-8 items-center gap-1.5 rounded-full border border-green-500/40 bg-green-500/10 px-3 text-[11px] font-bold tracking-[0.08em] text-green-400 uppercase transition-colors duration-150 hover:border-green-400/60 hover:bg-green-500/20 hover:text-green-300',
        className,
      )}
    >
      <span className="size-1.5 animate-live-dot rounded-full bg-live-bright" aria-hidden />
      Live
      <span className="hidden font-semibold text-green-300/90 sm:inline">· {liveCount}</span>
    </Link>
  )
}
