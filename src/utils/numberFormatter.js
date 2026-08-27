/**
 * Formats a reaction count into a concise social-style string (e.g. 0, 950, 1.2K, 11.1K, 112.5K, 1.5M).
 */
export function formatReactionCount(num) {
  if (num === null || num === undefined || isNaN(num)) return '0'
  const n = Number(num)
  if (n <= 0) return '0'
  if (n < 1000) return n.toLocaleString()

  if (n < 1_000_000) {
    const k = n / 1000
    // If exact integer in thousands or large enough, keep 1 decimal if not ending with .0
    const str = k < 100 ? k.toFixed(1) : k.toFixed(1)
    return str.endsWith('.0') ? `${Math.round(k)}K` : `${str}K`
  }

  const m = n / 1_000_000
  const str = m.toFixed(1)
  return str.endsWith('.0') ? `${Math.round(m)}M` : `${str}M`
}

