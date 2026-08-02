import { jsPDF } from 'jspdf'

/**
 * Renders a simple, clean label/value PDF for a single record —
 * used across Reports, Tickets, Bookings, and Contact Messages so
 * the admin can hand a formatted document to partner organizations
 * instead of raw exported JSON.
 *
 * @param {string} title       - e.g. "Cybercrime Report — #64f1a2"
 * @param {Array<{label: string, value: string}>} fields - ordered field list
 * @param {string} filename    - without extension, e.g. "report-64f1a2"
 */
export function exportRecordAsPDF(title, fields, filename) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageWidth  = doc.internal.pageSize.getWidth()
  const margin     = 48
  const usableWidth = pageWidth - margin * 2
  let y = 56

  // Header
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(13, 148, 136) // teal, matches site accent
  doc.text('WHTSIPA — We Help Track Scammers IP Address', margin, y)
  y += 28

  doc.setFontSize(17)
  doc.setTextColor(15, 23, 42)
  const titleLines = doc.splitTextToSize(title, usableWidth)
  doc.text(titleLines, margin, y)
  y += titleLines.length * 20 + 8

  doc.setDrawColor(226, 232, 240)
  doc.line(margin, y, pageWidth - margin, y)
  y += 24

  // Fields
  doc.setFont('helvetica', 'normal')
  fields.forEach(({ label, value }) => {
    if (y > 760) { doc.addPage(); y = 56 }

    doc.setFontSize(9)
    doc.setTextColor(107, 114, 128)
    doc.text(label.toUpperCase(), margin, y)
    y += 14

    doc.setFontSize(11)
    doc.setTextColor(15, 23, 42)
    const valueText  = (value === undefined || value === null || value === '') ? '—' : String(value)
    const valueLines = doc.splitTextToSize(valueText, usableWidth)
    doc.text(valueLines, margin, y)
    y += valueLines.length * 14 + 16
  })

  // Footer
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(156, 163, 175)
    doc.text(
      `Generated ${new Date().toLocaleString()} — Page ${i} of ${pageCount}`,
      margin,
      doc.internal.pageSize.getHeight() - 30
    )
  }

  doc.save(`${filename}.pdf`)
}
