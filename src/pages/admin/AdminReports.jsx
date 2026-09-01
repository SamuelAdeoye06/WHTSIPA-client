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
  // Public and Personal reports are kept as two entirely separate lists,
  // not merged with a "scope" column — matching the client's spec.
  const [activeTab, setActiveTab] = useState('personal')

  useEffect(() => {
    api.get('/reports/all')
      .then(({ data }) => setReports(data))
      .catch(() => setError('Could not load reports.'))
      .finally(() => setLoading(false))
  }, [])

  const scoped = useMemo(() => reports.filter(r => r.reportType === activeTab), [reports, activeTab])

  const filtered = useMemo(() => {
    return scoped.filter(r => {
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
  }, [scoped, search, statusFilter])

  const personalCount = useMemo(() => reports.filter(r => r.reportType === 'personal').length, [reports])
  const publicCount   = useMemo(() => reports.filter(r => r.reportType === 'public').length, [reports])

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Reports</h1>
        <p className="admin-page-sub">Cybercrime reports submitted through the Report page.</p>
      </div>

      <div className="admin-tabs">
        <button
          className={`admin-tab-btn${activeTab === 'personal' ? ' admin-tab-btn-active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          Personal Reports <span className="admin-tab-count">{personalCount}</span>
        </button>
        <button
          className={`admin-tab-btn${activeTab === 'public' ? ' admin-tab-btn-active' : ''}`}
          onClick={() => setActiveTab('public')}
        >
          Public Reports <span className="admin-tab-count">{publicCount}</span>
        </button>
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
          <div className="admin-table-empty">No {activeTab} reports match your filters.</div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="admin-table-wrap admin-desktop-table">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Reporter</th>
                    <th>Incident Type</th>
                    <th>Submitted</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r._id} className="admin-table-row-clickable" onClick={() => navigate(`/admin/reports/${r._id}`)}>
                      <td>{r.fullName || r.user?.firstName || 'Anonymous'}</td>
                      <td>{r.incidentType}</td>
                      <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                      <td><StatusPill status={r.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="admin-mobile-cards">
              {filtered.map(r => (
                <div key={r._id} className="admin-mobile-card" onClick={() => navigate(`/admin/reports/${r._id}`)}>
                  <div className="admin-mobile-card-top">
                    <div>
                      <div className="admin-mobile-card-title">{r.fullName || r.user?.firstName || 'Anonymous'}</div>
                      <div className="admin-mobile-card-sub">{r.email || 'No email provided'}</div>
                    </div>
                    <div className="admin-mobile-card-pills">
                      <StatusPill status={r.status} />
                    </div>
                  </div>
                  <div className="admin-mobile-card-body">
                    <strong>Incident:</strong> {r.incidentType || 'Not specified'}
                  </div>
                  <div className="admin-mobile-card-footer">
                    <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                    <span className="admin-mobile-card-action">View details &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
