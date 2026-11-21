export type ClassValue = string | false | null | undefined | ClassValue[]

export function cn(...values: ClassValue[]): string {
  const out: string[] = []

  const walk = (value: ClassValue): void => {
    if (!value) return
    if (Array.isArray(value)) {
      value.forEach(walk)
      return
    }
    out.push(value)
  }

  values.forEach(walk)
  return out.join(' ')
}
