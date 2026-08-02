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
          <div className="admin-table-wrap">
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
        )}
      </div>
    </div>
  )
}
