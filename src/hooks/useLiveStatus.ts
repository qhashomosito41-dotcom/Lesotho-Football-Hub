import { useMemo } from 'react'

const MATCHES_IN_PROGRESS = 5

export interface LiveStatus {
  liveCount: number
  hasLiveMatches: boolean
}

export function useLiveStatus(): LiveStatus {
  return useMemo(() => {
    const liveCount = MATCHES_IN_PROGRESS
    return { liveCount, hasLiveMatches: liveCount > 0 }
  }, [])
}
