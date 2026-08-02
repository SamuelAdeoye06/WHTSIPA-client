import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'
import StatusPill from './components/StatusPill'
import ConfirmDialog from './components/ConfirmDialog'
import { exportRecordAsPDF } from '../../utils/pdfExport'
import './AdminShared.css'

const FIELD_LABELS = [
  ['ticketId', 'Ticket ID'],
  ['type', 'Type'],
  ['name', 'Name'],
  ['email', 'Email'],
  ['phone', 'Phone'],
  ['contactMethod', 'Preferred Contact Method'],
  ['threatTitle', 'Related Tool / Threat'],
  ['summary', 'Summary'],
  ['goals', 'Goals'],
  ['services', 'Services Requested'],
  ['duration', 'Duration'],
]

export default function AdminTicketDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ticket, setTicket]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [savingStatus, setSavingStatus] = useState(false)
  const [confirmOpen, setConfirmOpen]   = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    api.get('/tickets/all')
      .then(({ data }) => {
        const found = data.find(t => t._id === id)
        if (!found) setError('Ticket not found.')
        else setTicket(found)
      })
      .catch(() => setError('Could not load this ticket.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleStatusChange = async (e) => {
    const status = e.target.value
    setSavingStatus(true)
    try {
      const { data } = await api.patch(`/tickets/${id}/status`, { status })
      setTicket(prev => ({ ...prev, status: data.status }))
    } catch {
      alert('Could not update status. Please try again.')
    } finally {
      setSavingStatus(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/tickets/${id}`)
      navigate('/admin/tickets', { replace: true })
    } catch {
      alert('Could not delete this ticket. Please try again.')
      setDeleting(false)
    }
  }

  const handleExportPDF = () => {
    const fields = FIELD_LABELS
      .filter(([key]) => ticket[key] !== undefined && ticket[key] !== '')
      .map(([key, label]) => ({
        label,
        value: Array.isArray(ticket[key]) ? ticket[key].join(', ') : ticket[key],
      }))
    fields.push({ label: 'Submitted', value: new Date(ticket.createdAt).toLocaleString() })
    exportRecordAsPDF(`Ticket — ${ticket.ticketId}`, fields, `ticket-${ticket.ticketId}`)
  }

  if (loading) return <div className="admin-page-loading">Loading ticket…</div>
  if (error)   return <div className="admin-page-error">{error}</div>
  if (!ticket) return null

  return (
    <div>
      <Link to="/admin/tickets" className="admin-back-link"><i className="bi bi-arrow-left"></i> Back to Tickets</Link>

      <div className="admin-detail-header">
        <div>
          <h1 className="admin-page-title">{ticket.ticketId}</h1>
          <p className="admin-page-sub">{ticket.name} · {new Date(ticket.createdAt).toLocaleString()}</p>
        </div>
        <div className="admin-detail-actions">
          <select className="admin-status-select" value={ticket.status} onChange={handleStatusChange} disabled={savingStatus}>
            <option value="open">Open</option>
            <option value="in-progress">In progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <button className="admin-btn admin-btn-ghost" onClick={handleExportPDF}>
            <i className="bi bi-file-earmark-pdf"></i> Download PDF
          </button>
          <button className="admin-btn admin-btn-danger" onClick={() => setConfirmOpen(true)}>
            <i className="bi bi-trash"></i> Delete Permanently
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-detail-grid">
          {FIELD_LABELS.map(([key, label]) => {
            const val = ticket[key]
            if (val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0)) return null
            const isLong = key === 'summary' || key === 'goals'
            return (
              <div key={key} className={isLong ? 'admin-detail-field-full' : ''}>
                <div className="admin-detail-field-label">{label}</div>
                <div className="admin-detail-field-value">{Array.isArray(val) ? val.join(', ') : val}</div>
              </div>
            )
          })}
          {ticket.evidenceFiles?.length > 0 && (
            <div className="admin-detail-field-full">
              <div className="admin-detail-field-label">Evidence Files</div>
              <div className="admin-detail-field-value">
                {ticket.evidenceFiles.map((f, i) => (
                  <div key={i}><a href={f} target="_blank" rel="noopener noreferrer">{f}</a></div>
                ))}
              </div>
            </div>
          )}
          <div>
            <div className="admin-detail-field-label">Status</div>
            <div className="admin-detail-field-value"><StatusPill status={ticket.status} /></div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        danger
        title="Delete this ticket?"
        message="This permanently deletes the ticket and all its details. This cannot be undone — make sure you've downloaded a copy first if you need one."
        confirmLabel="Delete Permanently"
        loading={deleting}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
