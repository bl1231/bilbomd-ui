// src/utils/dates.ts
export function parseDateSafe(input?: unknown): Date | null {
  if (input === null || input === undefined) return null
  if (input instanceof Date) return isNaN(input.getTime()) ? null : input
  if (typeof input === 'number') {
    const d = new Date(input)
    return isNaN(d.getTime()) ? null : d
  }
  const raw = String(input).trim()
  if (!raw) return null
  // "YYYY-MM-DD HH:mm:ss" -> "YYYY-MM-DDTHH:mm:ss"
  const normalized = raw.replace(' ', 'T')
  const hasTime = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(normalized)
  const hasTZ = /[Zz]|[+-]\d{2}:\d{2}$/.test(normalized)
  const candidate = hasTime && !hasTZ ? `${normalized}Z` : normalized
  const d = new Date(candidate)
  return isNaN(d.getTime()) ? null : d
}
