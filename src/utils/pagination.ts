export type PaginationItem = number | 'ellipsis'

export function buildPaginationRange(
  page: number,
  pageCount: number,
  siblingCount = 1,
): PaginationItem[] {
  const first = 1
  const last = Math.max(pageCount, 1)
  const current = Math.min(Math.max(page, 1), last)

  const start = Math.max(first + 1, current - siblingCount)
  const end = Math.min(last - 1, current + siblingCount)

  const items: PaginationItem[] = [first]

  if (start > first + 1) {
    items.push('ellipsis')
  }

  for (let index = start; index <= end; index += 1) {
    items.push(index)
  }

  if (end < last - 1) {
    items.push('ellipsis')
  }

  if (last > first) {
    items.push(last)
  }

  return items
}
