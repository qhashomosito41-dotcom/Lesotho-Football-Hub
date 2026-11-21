import { ArrowRight, FileText, Search, Shield, Trophy, User, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ComponentType, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui'
import { useEscapeKey, useLockBodyScroll } from '@/hooks'
import { SEARCH_INDEX, searchIndex, type SearchEntryKind } from '@/config/search'

interface SearchDialogProps {
  open: boolean
  onClose: () => void
}

const kindIcons: Record<SearchEntryKind, ComponentType<{ className?: string }>> = {
  page: FileText,
  competition: Trophy,
  club: Shield,
  player: User,
}

const POPULAR_TITLES = ['Live Scores', 'Vodacom Premier League', 'Standings', 'Transfers']

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEscapeKey(open, onClose)
  useLockBodyScroll(open)

  useEffect(() => {
    if (!open) return
    setQuery('')
    requestAnimationFrame(() => inputRef.current?.focus())
  }, [open])

  const results = useMemo(() => searchIndex(query, 6), [query])

  const popular = useMemo(
    () => POPULAR_TITLES.map((title) => SEARCH_INDEX.find((entry) => entry.title === title)).filter(Boolean),
    [],
  )

  const trimmed = query.trim()

  const submit = () => {
    if (!trimmed) return
    navigate(`/search?q=${encodeURIComponent(trimmed)}`)
    onClose()
  }

  const goTo = (to: string) => {
    navigate(to)
    onClose()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      submit()
    }
  }

  if (!open) return null

  const entries = trimmed ? results : (popular as typeof results)

  return createPortal(
    <div
      className="animate-fade-in fixed inset-0 z-[95] bg-navy-950/70 px-4 pt-[12vh] backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search Lesotho Football Hub"
        className="animate-modal-in mx-auto w-full max-w-xl overflow-hidden rounded-xl border border-navy-700 bg-header shadow-overlay"
      >
        <div className="flex items-center gap-3 border-b border-navy-700 px-4">
          <Search className="size-4 shrink-0 text-navy-400" aria-hidden />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search clubs, players, matches, pages…"
            aria-label="Search query"
            className="h-12 min-w-0 flex-1 bg-transparent text-base text-white placeholder:text-navy-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="grid size-8 shrink-0 place-items-center rounded-md text-navy-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {!trimmed && <p className="eyebrow px-3 pt-1 pb-2 text-navy-500">Popular searches</p>}

          {trimmed && entries.length === 0 && (
            <p className="body-muted px-3 py-4 text-navy-400">No matches for “{trimmed}”.</p>
          )}

          {entries.map((entry) => {
            const Icon = kindIcons[entry.kind]

            return (
              <button
                key={entry.to}
                type="button"
                onClick={() => goTo(entry.to)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-150 hover:bg-white/5"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-md bg-white/5 text-navy-300">
                  <Icon className="size-4" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-white">{entry.title}</span>
                  {entry.caption && <span className="caption text-navy-500">{entry.caption}</span>}
                </span>
                <ArrowRight className="size-4 shrink-0 text-navy-600" aria-hidden />
              </button>
            )
          })}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-navy-700 bg-elevated px-4 py-3">
          <p className="caption text-navy-400">Pages, competitions and clubs</p>
          <div className="flex items-center gap-2">
            <kbd className="hidden rounded border border-navy-600 px-1.5 py-0.5 text-[10px] font-semibold text-navy-400 sm:block">
              Enter
            </kbd>
            <Button size="sm" onClick={submit} disabled={!trimmed}>
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
