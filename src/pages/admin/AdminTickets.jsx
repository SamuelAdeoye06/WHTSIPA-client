import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import StatusPill from './components/StatusPill'
import './AdminShared.css'

export default function AdminTickets() {
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [search, setSearch]   = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    api.get('/tickets/all')
      .then(({ data }) => setTickets(data))
      .catch(() => setError('Could not load tickets.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return tickets.filter(t => {
      if (typeFilter !== 'all' && t.type !== typeFilter) return false
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        t.name?.toLowerCase().includes(q) ||
        t.email?.toLowerCase().includes(q) ||
        t.ticketId?.toLowerCase().includes(q) ||
        t.threatTitle?.toLowerCase().includes(q)
      )
    })
  }, [tickets, search, typeFilter])

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Tickets</h1>
        <p className="admin-page-sub">Hire requests, tool requests, threat reports, and live-chat sessions.</p>
      </div>

      <div className="admin-card">
        <div className="admin-toolbar">
          <input
            className="admin-search-input"
            placeholder="Search by name, email, or ticket ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="admin-filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="all">All types</option>
            <option value="report">Report</option>
            <option value="hire">Hire</option>
            <option value="request">Request</option>
            <option value="livechat">Live Chat</option>
          </select>
        </div>

        {loading ? (
          <div className="admin-page-loading">Loading tickets…</div>
        ) : error ? (
          <div className="admin-page-error">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="admin-table-empty">No tickets match your filters.</div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="admin-table-wrap admin-desktop-table">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Submitted</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t => (
                    <tr key={t._id} className="admin-table-row-clickable" onClick={() => navigate(`/admin/tickets/${t._id}`)}>
                      <td>{t.ticketId}</td>
                      <td>{t.name}</td>
                      <td style={{ textTransform: 'capitalize' }}>{t.type}</td>
                      <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                      <td><StatusPill status={t.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="admin-mobile-cards">
              {filtered.map(t => (
                <div key={t._id} className="admin-mobile-card" onClick={() => navigate(`/admin/tickets/${t._id}`)}>
                  <div className="admin-mobile-card-top">
                    <div>
                      <div className="admin-mobile-card-title">#{t.ticketId}</div>
                      <div className="admin-mobile-card-sub">{t.name} ({t.email})</div>
                    </div>
                    <div className="admin-mobile-card-pills">
                      <StatusPill status={t.status} />
                    </div>
                  </div>
                  <div className="admin-mobile-card-body">
                    <strong>Request/Threat:</strong> {t.threatTitle || t.summary || 'General Ticket'}
                    {t.type && (
                      <div style={{ marginTop: '0.2rem', textTransform: 'capitalize', color: '#64748b', fontSize: '0.78rem' }}>
                        Category: {t.type} ticket
                      </div>
                    )}
                  </div>
                  <div className="admin-mobile-card-footer">
                    <span>{new Date(t.createdAt).toLocaleDateString()}</span>
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
