export default function StatusPill({ status }) {
  const slug = String(status || '').toLowerCase().replace(/\s+/g, '-')
  return <span className={`admin-pill admin-pill-${slug}`}>{status || '—'}</span>
}
