import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'
import StatusPill from './components/StatusPill'
import ConfirmDialog from './components/ConfirmDialog'
import SendEmailDialog from './components/SendEmailDialog'
import { exportRecordAsPDF } from '../../utils/pdfExport'
import './AdminShared.css'

export default function AdminContactMessageDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [savingStatus, setSavingStatus] = useState(false)
  const [confirmOpen, setConfirmOpen]   = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [sendEmailOpen, setSendEmailOpen] = useState(false)
  const [sendingEmail, setSendingEmail]   = useState(false)

  useEffect(() => {
    api.get('/contact/all')
      .then(({ data }) => {
        const found = data.find(m => m._id === id)
        if (!found) { setError('Message not found.'); return }
        setMessage(found)
        // Auto-mark as read the first time it's opened
        if (found.status === 'unread') {
          api.patch(`/contact/${id}/status`, { status: 'read' })
            .then(({ data }) => setMessage(prev => ({ ...prev, status: data.status })))
            .catch(() => { /* non-critical, ignore */ })
        }
      })
      .catch(() => setError('Could not load this message.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleStatusChange = async (e) => {
    const status = e.target.value
    setSavingStatus(true)
    try {
      const { data } = await api.patch(`/contact/${id}/status`, { status })
      setMessage(prev => ({ ...prev, status: data.status }))
    } catch {
      alert('Could not update status. Please try again.')
    } finally {
      setSavingStatus(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/contact/${id}`)
      navigate('/admin/contact-messages', { replace: true })
    } catch {
      alert('Could not delete this message. Please try again.')
      setDeleting(false)
    }
  }

  const handleExportPDF = () => {
    exportRecordAsPDF(
      `Contact Message — ${message.subject}`,
      [
        { label: 'Name', value: message.name },
        { label: 'Email', value: message.email },
        { label: 'Subject', value: message.subject },
        { label: 'Message', value: message.message },
        { label: 'Received', value: new Date(message.createdAt).toLocaleString() },
      ],
      `contact-message-${message._id}`
    )
  }

  const handleSendEmail = async (to) => {
    setSendingEmail(true)
    try {
      await api.post('/admin/send-email', { recordType: 'contact', recordId: id, to })
      setSendEmailOpen(false)
    } catch (err) {
      alert(err.response?.data?.message || 'Could not send this email. Please try again.')
    } finally {
      setSendingEmail(false)
    }
  }

  if (loading)  return <div className="admin-page-loading">Loading message…</div>
  if (error)    return <div className="admin-page-error">{error}</div>
  if (!message) return null

  return (
    <div>
      <Link to="/admin/contact-messages" className="admin-back-link"><i className="bi bi-arrow-left"></i> Back to Contact Messages</Link>

      <div className="admin-detail-header">
        <div>
          <h1 className="admin-page-title">{message.subject}</h1>
          <p className="admin-page-sub">{message.name} · {message.email} · {new Date(message.createdAt).toLocaleString()}</p>
        </div>
        <div className="admin-detail-actions">
          <select className="admin-status-select" value={message.status} onChange={handleStatusChange} disabled={savingStatus}>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
          <a className="admin-btn admin-btn-ghost" href={`mailto:${message.email}?subject=Re: ${message.subject}`}>
            <i className="bi bi-reply-fill"></i> Reply by Email
          </a>
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
          <div>
            <div className="admin-detail-field-label">Name</div>
            <div className="admin-detail-field-value">{message.name}</div>
          </div>
          <div>
            <div className="admin-detail-field-label">Email</div>
            <div className="admin-detail-field-value">{message.email}</div>
          </div>
          <div>
            <div className="admin-detail-field-label">Status</div>
            <div className="admin-detail-field-value"><StatusPill status={message.status} /></div>
          </div>
          <div className="admin-detail-field-full">
            <div className="admin-detail-field-label">Message</div>
            <div className="admin-detail-field-value">{message.message}</div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        danger
        title="Delete this message?"
        message="This permanently deletes the contact message. This cannot be undone — make sure you've downloaded a copy first if you need one."
        confirmLabel="Delete Permanently"
        loading={deleting}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />

      <SendEmailDialog
        open={sendEmailOpen}
        recordLabel="Message"
        loading={sendingEmail}
        onCancel={() => setSendEmailOpen(false)}
        onConfirm={handleSendEmail}
      />
    </div>
  )
}
