import { ArrowRight, FileText, Shield, Trophy, User } from 'lucide-react'
import type { ComponentType } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { EmptyState } from '@/components/ui'
import { searchIndex, type SearchEntryKind } from '@/config/search'

const kindMeta: Record<SearchEntryKind, { label: string; icon: ComponentType<{ className?: string }> }> = {
  page: { label: 'Page', icon: FileText },
  competition: { label: 'Competition', icon: Trophy },
  club: { label: 'Club', icon: Shield },
  player: { label: 'Player', icon: User },
}

export default function SearchResultsPage() {
  const [params] = useSearchParams()
  const query = params.get('q')?.trim() ?? ''
  const results = query ? searchIndex(query, 24) : []

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
      <p className="eyebrow text-live">Search</p>
      <h1 className="page-title mt-2 text-white">
        {query ? `Results for “${query}”` : 'Search LFH'}
      </h1>

      {!query && (
        <p className="body-muted mt-3 max-w-2xl text-navy-200">
          Open the search bar with <span className="font-semibold text-white">Ctrl + K</span> and type a club,
          competition or page name.
        </p>
      )}

      {query && results.length > 0 && (
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((entry) => {
            const meta = kindMeta[entry.kind]
            const Icon = meta.icon

            return (
              <li key={entry.to}>
                <Link
                  to={entry.to}
                  className="group flex items-center gap-3 rounded-xl border border-navy-700 bg-elevated p-4 transition-colors duration-150 hover:border-navy-500"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/5 text-navy-300 transition-colors group-hover:text-live">
                    <Icon className="size-4.5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-white">{entry.title}</span>
                    <span className="caption text-navy-400">{entry.caption ?? meta.label}</span>
                  </span>
                  <ArrowRight
                    className="size-4 shrink-0 text-navy-500 transition-transform duration-150 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </li>
            )
          })}
        </ul>
      )}

      {query && results.length === 0 && (
        <div className="mt-8 rounded-xl border border-navy-700 bg-elevated">
          <EmptyState
            tone="dark"
            title="No matches found"
            description={`Nothing matched “${query}”. Try a club name, a competition or a page.`}
          />
        </div>
      )}
    </div>
  )
}
