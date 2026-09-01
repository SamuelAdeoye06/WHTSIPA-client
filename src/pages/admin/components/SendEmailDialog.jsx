import { useState, useEffect } from 'react'

/* Manual "Send to Email" action — a deliberate admin choice, separate
   from the automatic notification emails. Sends the full record
   content to a chosen address as a boxed HTML layout (never a PDF). */
export default function SendEmailDialog({ open, defaultEmail = '', recordLabel, loading, onCancel, onConfirm }) {
  const [to, setTo] = useState('')
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (open) {
      setTo(defaultEmail || '')
      setTouched(false)
    }
  }, [open, defaultEmail])

  if (!open) return null

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to.trim())

  const handleConfirm = () => {
    setTouched(true)
    if (!isValid) return
    onConfirm(to.trim())
  }

  return (
    <div className="admin-confirm-overlay" onClick={onCancel}>
      <div className="admin-confirm-box" onClick={e => e.stopPropagation()}>
        <div className="admin-confirm-icon">
          <i className="bi bi-envelope-fill"></i>
        </div>
        <h3>Send {recordLabel} to Email</h3>
        <p>
          Sends the full details of this record as an email — not a PDF. Use this to hand a copy
          off to someone directly, separate from the automatic panel notifications.
        </p>
        <input
          type="email"
          className="admin-search-input"
          style={{ width: '100%', marginBottom: touched && !isValid ? '0.4rem' : '1rem' }}
          placeholder="recipient@example.com"
          value={to}
          onChange={e => setTo(e.target.value)}
          autoFocus
        />
        {touched && !isValid && (
          <div style={{ color: '#dc2626', fontSize: '0.82rem', marginBottom: '1rem' }}>
            Enter a valid email address.
          </div>
        )}
        <div className="admin-confirm-actions">
          <button className="admin-btn admin-btn-ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button className="admin-btn admin-btn-primary" onClick={handleConfirm} disabled={loading}>
            {loading ? 'Sending…' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}
