import { ChevronLeft, ChevronRight } from 'lucide-react'
import { buildPaginationRange } from '@/utils/pagination'
import { cn } from '@/utils/cn'

interface PaginationProps {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  siblingCount?: number
  totalItems?: number
  pageSize?: number
  className?: string
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  siblingCount = 1,
  totalItems,
  pageSize,
  className,
}: PaginationProps) {
  if (pageCount <= 1 && !totalItems) return null

  const items = buildPaginationRange(page, pageCount, siblingCount)
  const firstItem = totalItems && pageSize ? (page - 1) * pageSize + 1 : null
  const lastItem = totalItems && pageSize ? Math.min(page * pageSize, totalItems) : null

  const goTo = (nextPage: number) => {
    if (nextPage < 1 || nextPage > pageCount || nextPage === page) return
    onPageChange(nextPage)
  }

  return (
    <nav aria-label="Pagination" className={cn('flex flex-wrap items-center justify-between gap-3', className)}>
      {totalItems !== undefined && pageSize !== undefined && firstItem !== null && lastItem !== null ? (
        <p className="caption">
          Showing <span className="font-semibold text-ink">{firstItem}</span>–
          <span className="font-semibold text-ink">{lastItem}</span> of{' '}
          <span className="font-semibold text-ink">{totalItems}</span>
        </p>
      ) : (
        <span />
      )}

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => goTo(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="grid size-9 place-items-center rounded-md border border-line bg-white text-ink-muted transition-colors hover:border-line-strong hover:text-ink disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft className="size-4" aria-hidden />
        </button>

        {items.map((item, index) =>
          item === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="px-1 text-ink-subtle" aria-hidden>
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => goTo(item)}
              aria-current={item === page ? 'page' : undefined}
              className={cn(
                'grid size-9 min-w-9 place-items-center rounded-md border text-sm font-semibold transition-colors',
                item === page
                  ? 'border-primary bg-primary text-white'
                  : 'border-line bg-white text-ink-muted hover:border-line-strong hover:text-ink',
              )}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => goTo(page + 1)}
          disabled={page >= pageCount}
          aria-label="Next page"
          className="grid size-9 place-items-center rounded-md border border-line bg-white text-ink-muted transition-colors hover:border-line-strong hover:text-ink disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>
    </nav>
  )
}
