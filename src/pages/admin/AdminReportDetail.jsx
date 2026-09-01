import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'
import StatusPill from './components/StatusPill'
import ConfirmDialog from './components/ConfirmDialog'
import SendEmailDialog from './components/SendEmailDialog'
import { exportRecordAsPDF } from '../../utils/pdfExport'
import './AdminShared.css'

const FIELD_LABELS = [
  ['fullName', 'Full Name'],
  ['email', 'Email'],
  ['phone', 'Phone'],
  ['country', 'Country'],
  ['organization', 'Organization'],
  ['reportType', 'Report Type'],
  ['incidentType', 'Incident Type'],
  ['targetedName', 'Targeted Name / Entity'],
  ['socialHandles', 'Social Handles'],
  ['communicationMethod', 'Communication Method'],
  ['communicationValue', 'Communication Value'],
  ['financialLoss', 'Financial Loss'],
  ['contactedAuthorities', 'Contacted Authorities'],
  ['incidentStatus', 'Incident Status'],
  ['effectsOfIncident', 'Effects of Incident'],
  ['linksImposterDetails', 'Imposter Links / Details'],
  ['consentShareAnonymized', 'Consent to Share (Anonymized)'],
  ['detail', 'Full Detail'],
]

export default function AdminReportDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [report, setReport]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [savingStatus, setSavingStatus] = useState(false)
  const [confirmOpen, setConfirmOpen]   = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [sendEmailOpen, setSendEmailOpen] = useState(false)
  const [sendingEmail, setSendingEmail]   = useState(false)

  useEffect(() => {
    api.get('/reports/all')
      .then(({ data }) => {
        const found = data.find(r => r._id === id)
        if (!found) setError('Report not found.')
        else setReport(found)
      })
      .catch(() => setError('Could not load this report.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleStatusChange = async (e) => {
    const status = e.target.value
    setSavingStatus(true)
    try {
      const { data } = await api.patch(`/reports/${id}/status`, { status })
      setReport(prev => ({ ...prev, status: data.status }))
    } catch {
      alert('Could not update status. Please try again.')
    } finally {
      setSavingStatus(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/reports/${id}`)
      navigate('/admin/reports', { replace: true })
    } catch {
      alert('Could not delete this report. Please try again.')
      setDeleting(false)
    }
  }

  const handleExportPDF = () => {
    const fields = FIELD_LABELS
      .filter(([key]) => report[key] !== undefined)
      .map(([key, label]) => ({
        label,
        value: key === 'consentShareAnonymized' ? (report[key] ? 'Yes' : 'No') : report[key],
      }))
    fields.push({ label: 'Submitted', value: new Date(report.createdAt).toLocaleString() })
    exportRecordAsPDF(
      `Cybercrime Report — ${report.incidentType}`,
      fields,
      `report-${report._id}`
    )
  }

  const handleSendEmail = async (to) => {
    setSendingEmail(true)
    try {
      await api.post('/admin/send-email', { recordType: 'report', recordId: id, to })
      setSendEmailOpen(false)
    } catch (err) {
      alert(err.response?.data?.message || 'Could not send this email. Please try again.')
    } finally {
      setSendingEmail(false)
    }
  }

  if (loading) return <div className="admin-page-loading">Loading report…</div>
  if (error)   return <div className="admin-page-error">{error}</div>
  if (!report) return null

  return (
    <div>
      <Link to="/admin/reports" className="admin-back-link"><i className="bi bi-arrow-left"></i> Back to Reports</Link>

      <div className="admin-detail-header">
        <div>
          <h1 className="admin-page-title">{report.incidentType}</h1>
          <p className="admin-page-sub">Reported by {report.fullName || 'Anonymous'} · {new Date(report.createdAt).toLocaleString()}</p>
        </div>
        <div className="admin-detail-actions">
          <select className="admin-status-select" value={report.status} onChange={handleStatusChange} disabled={savingStatus}>
            <option value="open">Open</option>
            <option value="in-review">In review</option>
            <option value="resolved">Resolved</option>
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
            if (report[key] === undefined || report[key] === null || report[key] === '') return null
            const isLong = key === 'detail' || key === 'effectsOfIncident'
            return (
              <div key={key} className={isLong ? 'admin-detail-field-full' : ''}>
                <div className="admin-detail-field-label">{label}</div>
                <div className="admin-detail-field-value">
                  {key === 'consentShareAnonymized' ? (report[key] ? 'Yes' : 'No') : report[key]}
                </div>
              </div>
            )
          })}
          {report.evidenceFiles?.length > 0 && (
            <div className="admin-detail-field-full">
              <div className="admin-detail-field-label">Evidence Files</div>
              <div className="admin-detail-field-value">
                {report.evidenceFiles.map((f, i) => (
                  <div key={i}><a href={f} target="_blank" rel="noopener noreferrer">{f}</a></div>
                ))}
              </div>
            </div>
          )}
          <div>
            <div className="admin-detail-field-label">Status</div>
            <div className="admin-detail-field-value"><StatusPill status={report.status} /></div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        danger
        title="Delete this report?"
        message="This permanently deletes the report and all its details. This cannot be undone — make sure you've downloaded a copy first if you need one."
        confirmLabel="Delete Permanently"
        loading={deleting}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />

      <SendEmailDialog
        open={sendEmailOpen}
        recordLabel="Report"
        loading={sendingEmail}
        onCancel={() => setSendEmailOpen(false)}
        onConfirm={handleSendEmail}
      />
    </div>
  )
}
