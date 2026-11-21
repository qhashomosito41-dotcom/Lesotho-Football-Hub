import type { CSSProperties } from 'react'
import { cn } from '@/utils/cn'

type SkeletonVariant = 'block' | 'text' | 'circle'

interface SkeletonProps {
  variant?: SkeletonVariant
  width?: string
  height?: string
  lines?: number
  className?: string
  style?: CSSProperties
}

const shimmerClasses =
  'animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-grey-100 via-grey-200 to-grey-100'

export function Skeleton({ variant = 'block', width, height, lines = 3, className, style }: SkeletonProps) {
  if (variant === 'circle') {
    return (
      <span
        className={cn('block rounded-full', shimmerClasses, className)}
        style={{ width: width ?? '2.25rem', height: height ?? width ?? '2.25rem', ...style }}
        aria-hidden
      />
    )
  }

  if (variant === 'text') {
    return (
      <span className={cn('flex flex-col gap-2', className)} aria-hidden>
        {Array.from({ length: lines }, (_, index) => (
          <span
            key={index}
            className={cn('block h-3 rounded-md', shimmerClasses)}
            style={{ width: index === lines - 1 && lines > 1 ? '60%' : '100%', ...style }}
          />
        ))}
      </span>
    )
  }

  return (
    <span
      className={cn('block rounded-md', shimmerClasses, className)}
      style={{ width: width ?? '100%', height: height ?? '1rem', ...style }}
      aria-hidden
    />
  )
}
