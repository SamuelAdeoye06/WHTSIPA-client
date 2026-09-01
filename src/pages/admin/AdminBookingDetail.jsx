import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'
import StatusPill from './components/StatusPill'
import ConfirmDialog from './components/ConfirmDialog'
import SendEmailDialog from './components/SendEmailDialog'
import { exportRecordAsPDF } from '../../utils/pdfExport'
import './AdminShared.css'

const FIELD_LABELS = [
  ['name', 'Name'],
  ['email', 'Email'],
  ['phone', 'Phone'],
  ['preferredDate', 'Preferred Date'],
  ['preferredTime', 'Preferred Time'],
  ['notes', 'Notes'],
]

export default function AdminBookingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [savingStatus, setSavingStatus] = useState(false)
  const [confirmOpen, setConfirmOpen]   = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [sendEmailOpen, setSendEmailOpen] = useState(false)
  const [sendingEmail, setSendingEmail]   = useState(false)

  useEffect(() => {
    api.get('/booking/all')
      .then(({ data }) => {
        const found = data.find(b => b._id === id)
        if (!found) setError('Booking not found.')
        else setBooking(found)
      })
      .catch(() => setError('Could not load this booking.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleStatusChange = async (e) => {
    const status = e.target.value
    setSavingStatus(true)
    try {
      const { data } = await api.patch(`/booking/${id}/status`, { status })
      setBooking(prev => ({ ...prev, status: data.status }))
    } catch {
      alert('Could not update status. Please try again.')
    } finally {
      setSavingStatus(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/booking/${id}`)
      navigate('/admin/bookings', { replace: true })
    } catch {
      alert('Could not delete this booking. Please try again.')
      setDeleting(false)
    }
  }

  const handleExportPDF = () => {
    const fields = FIELD_LABELS
      .filter(([key]) => booking[key])
      .map(([key, label]) => ({ label, value: booking[key] }))
    fields.push({ label: 'Submitted', value: new Date(booking.createdAt).toLocaleString() })
    exportRecordAsPDF(`Call Booking — ${booking.name}`, fields, `booking-${booking._id}`)
  }

  const handleSendEmail = async (to) => {
    setSendingEmail(true)
    try {
      await api.post('/admin/send-email', { recordType: 'booking', recordId: id, to })
      setSendEmailOpen(false)
    } catch (err) {
      alert(err.response?.data?.message || 'Could not send this email. Please try again.')
    } finally {
      setSendingEmail(false)
    }
  }

  if (loading) return <div className="admin-page-loading">Loading booking…</div>
  if (error)   return <div className="admin-page-error">{error}</div>
  if (!booking) return null

  return (
    <div>
      <Link to="/admin/bookings" className="admin-back-link"><i className="bi bi-arrow-left"></i> Back to Bookings</Link>

      <div className="admin-detail-header">
        <div>
          <h1 className="admin-page-title">{booking.name}</h1>
          <p className="admin-page-sub">{booking.preferredDate} at {booking.preferredTime} · Submitted {new Date(booking.createdAt).toLocaleString()}</p>
        </div>
        <div className="admin-detail-actions">
          <select className="admin-status-select" value={booking.status} onChange={handleStatusChange} disabled={savingStatus}>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
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
            if (!booking[key]) return null
            return (
              <div key={key} className={key === 'notes' ? 'admin-detail-field-full' : ''}>
                <div className="admin-detail-field-label">{label}</div>
                <div className="admin-detail-field-value">{booking[key]}</div>
              </div>
            )
          })}
          <div>
            <div className="admin-detail-field-label">Status</div>
            <div className="admin-detail-field-value"><StatusPill status={booking.status} /></div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        danger
        title="Delete this booking?"
        message="This permanently deletes the booking record. This cannot be undone — make sure you've downloaded a copy first if you need one."
        confirmLabel="Delete Permanently"
        loading={deleting}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />

      <SendEmailDialog
        open={sendEmailOpen}
        recordLabel="Booking"
        loading={sendingEmail}
        onCancel={() => setSendEmailOpen(false)}
        onConfirm={handleSendEmail}
      />
    </div>
  )
}
