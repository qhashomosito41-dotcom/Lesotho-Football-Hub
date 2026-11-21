import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import type { ReactNode } from 'react'
import type { SortDirection } from '@/types'
import { cn } from '@/utils/cn'
import { EmptyState } from './EmptyState'
import { Skeleton } from './Skeleton'

export interface TableColumn<Row> {
  key: string
  header: ReactNode
  align?: 'left' | 'center' | 'right'
  width?: string
  sortable?: boolean
  cell?: (row: Row, index: number) => ReactNode
  headerClassName?: string
  cellClassName?: string
}

interface TableProps<Row> {
  columns: TableColumn<Row>[]
  rows: Row[]
  rowKey: (row: Row, index: number) => string
  sort?: { key: string; direction: SortDirection }
  onSortChange?: (key: string, direction: SortDirection) => void
  loading?: boolean
  dense?: boolean
  compact?: boolean
  caption?: string
  emptyState?: ReactNode
  className?: string
}

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const

export function Table<Row>({
  columns,
  rows,
  rowKey,
  sort,
  onSortChange,
  loading = false,
  dense = false,
  compact = false,
  caption,
  emptyState,
  className,
}: TableProps<Row>) {
  const handleSort = (column: TableColumn<Row>) => {
    if (!column.sortable || !onSortChange) return
    const direction: SortDirection =
      sort?.key === column.key && sort.direction === 'asc' ? 'desc' : 'asc'
    onSortChange(column.key, direction)
  }

  return (
    <div className={cn('w-full overflow-x-auto rounded-xl border border-line bg-surface', className)}>
      <table className={cn('data-table', dense && 'data-table--dense', compact && 'data-table--compact')}>
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr>
            {columns.map((column) => {
              const active = sort?.key === column.key

              return (
                <th
                  key={column.key}
                  scope="col"
                  style={column.width ? { width: column.width } : undefined}
                  className={cn(alignClasses[column.align ?? 'left'], column.headerClassName)}
                >
                  {column.sortable && onSortChange ? (
                    <button
                      type="button"
                      onClick={() => handleSort(column)}
                      className={cn(
                        'inline-flex items-center gap-1.5 uppercase transition-colors hover:text-ink',
                        active && 'text-primary',
                      )}
                    >
                      {column.header}
                      {active ? (
                        sort.direction === 'asc' ? (
                          <ArrowUp className="size-3" aria-hidden />
                        ) : (
                          <ArrowDown className="size-3" aria-hidden />
                        )
                      ) : (
                        <ArrowUpDown className="size-3 opacity-50" aria-hidden />
                      )}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {loading &&
            Array.from({ length: 5 }, (_, rowIndex) => (
              <tr key={`skeleton-${rowIndex}`}>
                {columns.map((column) => (
                  <td key={column.key}>
                    <Skeleton className="h-4" />
                  </td>
                ))}
              </tr>
            ))}

          {!loading &&
            rows.map((row, index) => (
              <tr key={rowKey(row, index)} className="transition-colors">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(alignClasses[column.align ?? 'left'], column.cellClassName)}
                  >
                    {column.cell ? column.cell(row, index) : null}
                  </td>
                ))}
              </tr>
            ))}

          {!loading && rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="!p-0">
                {emptyState ?? <EmptyState title="No records found" description="There is nothing to display yet." />}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
