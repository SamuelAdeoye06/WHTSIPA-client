export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', danger = false, onConfirm, onCancel, loading = false }) {
  if (!open) return null

  return (
    <div className="admin-confirm-overlay" onClick={onCancel}>
      <div className="admin-confirm-box" onClick={e => e.stopPropagation()}>
        <div className="admin-confirm-icon">
          <i className={`bi ${danger ? 'bi-exclamation-triangle-fill' : 'bi-question-circle-fill'}`}></i>
        </div>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="admin-confirm-actions">
          <button className="admin-btn admin-btn-ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button
            className={`admin-btn ${danger ? 'admin-btn-danger' : 'admin-btn-primary'}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Working…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
