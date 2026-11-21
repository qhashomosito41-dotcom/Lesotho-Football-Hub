import { useEffect } from 'react'

export function useEscapeKey(enabled: boolean, callback: () => void): void {
  useEffect(() => {
    if (!enabled) return

    const listener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') callback()
    }

    document.addEventListener('keydown', listener)
    return () => document.removeEventListener('keydown', listener)
  }, [enabled, callback])
}
