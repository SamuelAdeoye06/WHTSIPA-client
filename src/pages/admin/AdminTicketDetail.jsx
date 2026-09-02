import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'
import StatusPill from './components/StatusPill'
import ConfirmDialog from './components/ConfirmDialog'
import SendEmailDialog from './components/SendEmailDialog'
import { useToast } from '../../context/ToastContext'
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

const CLOSING_MESSAGES = [
  { value: '', label: '— Select closing reason —' },
  { value: "Due to our chat becoming inactive, I'll go ahead and end this chat session. If you still need any assistance, feel free to contact us. Thanks for reaching out.", label: 'Inactivity (12h auto-close)' },
  { value: 'Your incident report has been successfully filed and assigned to an investigation unit. You can track progress on your dashboard.', label: 'Report Submitted' },
  { value: 'This case has been marked as resolved by our specialist team. Thank you for using WHTSIPA Support.', label: 'Case Solved / Resolved' },
  { value: 'Your case is actively under review by our senior investigation unit. Further updates will be communicated directly.', label: 'Still Under Investigation' },
  { value: 'Thank you for contacting WHTSIPA Active Support. If you need anything further, please reach out to us. Have a great day!', label: 'General Close' },
]

export default function AdminTicketDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [ticket, setTicket]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [savingStatus, setSavingStatus] = useState(false)
  const [confirmOpen, setConfirmOpen]   = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [closingMsg, setClosingMsg] = useState('')
  const [sendEmailOpen, setSendEmailOpen] = useState(false)
  const [sendingEmail, setSendingEmail]   = useState(false)

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
      const payload = { status }
      if (status === 'ended' && closingMsg) payload.closingSummary = closingMsg
      const { data } = await api.patch(`/tickets/${id}/status`, payload)
      setTicket(prev => ({ ...prev, status: data.status, closingSummary: data.closingSummary }))
    } catch {
      showToast('Could not update status. Please try again.', 'error')
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
      showToast('Could not delete this ticket. Please try again.', 'error')
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

  const handleSendEmail = async (to) => {
    setSendingEmail(true)
    try {
      await api.post('/admin/send-email', { recordType: 'ticket', recordId: id, to })
      setSendEmailOpen(false)
      showToast('Email sent.', 'success')
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not send this email. Please try again.', 'error')
    } finally {
      setSendingEmail(false)
    }
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
          <div className="d-flex flex-column gap-2">
            <select className="admin-status-select" value={ticket.status} onChange={handleStatusChange} disabled={savingStatus}>
              <option value="open">Open</option>
              <option value="in-progress">In progress</option>
              <option value="resolved">Resolved</option>
              <option value="ended">Ended</option>
            </select>
            {ticket.status !== 'ended' && (
              <select className="admin-status-select" value={closingMsg} onChange={e => setClosingMsg(e.target.value)} style={{ fontSize: '0.78rem' }}>
                {CLOSING_MESSAGES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            )}
          </div>
          <button className="admin-btn admin-btn-ghost" onClick={handleExportPDF}>
            <i className="bi bi-file-earmark-pdf"></i> Download PDF
          </button>
          <button className="admin-btn admin-btn-ghost" onClick={() => setSendEmailOpen(true)}>
            <i className="bi bi-envelope"></i> Send to Email
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
          {ticket.messageCount > 0 && (
            <div>
              <div className="admin-detail-field-label">Message Count</div>
              <div className="admin-detail-field-value">{ticket.messageCount}</div>
            </div>
          )}
          {ticket.hasHumanAgent && (
            <div>
              <div className="admin-detail-field-label">Agent Type</div>
              <div className="admin-detail-field-value">Active Representative</div>
            </div>
          )}
          {ticket.closingSummary && (
            <div className="admin-detail-field-full">
              <div className="admin-detail-field-label">Closing Summary</div>
              <div className="admin-detail-field-value" style={{ fontStyle: 'italic', color: '#0369a1' }}>{ticket.closingSummary}</div>
            </div>
          )}
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

      <SendEmailDialog
        open={sendEmailOpen}
        recordLabel="Ticket"
        loading={sendingEmail}
        onCancel={() => setSendEmailOpen(false)}
        onConfirm={handleSendEmail}
      />
    </div>
  )
}
