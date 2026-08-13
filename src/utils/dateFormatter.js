/**
 * Date formatting helper following WHTSIPA Live Chat specs (Page 11-12):
 * - Recent (current year): "Jul 02" (short month + 2-digit day)
 * - Multi-year / older: "02-07-2026" (DD-MM-YYYY)
 */
export function formatChatDate(dateInput) {
  if (!dateInput) return ''
  const date = new Date(dateInput)
  if (isNaN(date.getTime())) return ''

  const currentYear = new Date().getFullYear()
  const dateYear = date.getFullYear()

  if (dateYear === currentYear) {
    const month = date.toLocaleString('en-US', { month: 'short' })
    const day = String(date.getDate()).padStart(2, '0')
    return `${month} ${day}`
  } else {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    return `${day}-${month}-${dateYear}`
  }
}
