import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import StatusPill from './components/StatusPill'
import './AdminShared.css'

export default function AdminReports() {
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [search, setSearch]   = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    api.get('/reports/all')
      .then(({ data }) => setReports(data))
      .catch(() => setError('Could not load reports.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return reports.filter(r => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        r.fullName?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q) ||
        r.incidentType?.toLowerCase().includes(q) ||
        r.targetedName?.toLowerCase().includes(q)
      )
    })
  }, [reports, search, statusFilter])

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Reports</h1>
        <p className="admin-page-sub">Cybercrime reports submitted through the Report page.</p>
      </div>

      <div className="admin-card">
        <div className="admin-toolbar">
          <input
            className="admin-search-input"
            placeholder="Search by name, email, or incident type…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="admin-filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="open">Open</option>
            <option value="in-review">In review</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {loading ? (
          <div className="admin-page-loading">Loading reports…</div>
        ) : error ? (
          <div className="admin-page-error">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="admin-table-empty">No reports match your filters.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Reporter</th>
                  <th>Incident Type</th>
                  <th>Type</th>
                  <th>Submitted</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r._id} className="admin-table-row-clickable" onClick={() => navigate(`/admin/reports/${r._id}`)}>
                    <td>{r.fullName || r.user?.firstName || 'Anonymous'}</td>
                    <td>{r.incidentType}</td>
                    <td style={{ textTransform: 'capitalize' }}>{r.reportType}</td>
                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td><StatusPill status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
