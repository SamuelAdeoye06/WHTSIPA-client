import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import StatusPill from './components/StatusPill'
import './AdminShared.css'

export default function AdminContactMessages() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [search, setSearch]     = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    api.get('/contact/all')
      .then(({ data }) => setMessages(data))
      .catch(() => setError('Could not load contact messages.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return messages.filter(m => {
      if (statusFilter !== 'all' && m.status !== statusFilter) return false
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return m.name?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q) || m.subject?.toLowerCase().includes(q)
    })
  }, [messages, search, statusFilter])

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Contact Messages</h1>
        <p className="admin-page-sub">Messages submitted through the public Contact page.</p>
      </div>

      <div className="admin-card">
        <div className="admin-toolbar">
          <input
            className="admin-search-input"
            placeholder="Search by name, email, or subject…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="admin-filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
        </div>

        {loading ? (
          <div className="admin-page-loading">Loading messages…</div>
        ) : error ? (
          <div className="admin-page-error">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="admin-table-empty">No messages match your filters.</div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="admin-table-wrap admin-desktop-table">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Subject</th>
                    <th>Received</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(m => (
                    <tr key={m._id} className="admin-table-row-clickable" onClick={() => navigate(`/admin/contact-messages/${m._id}`)}>
                      <td style={{ fontWeight: m.status === 'unread' ? 700 : 400 }}>{m.name}</td>
                      <td>{m.subject}</td>
                      <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                      <td><StatusPill status={m.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="admin-mobile-cards">
              {filtered.map(m => (
                <div key={m._id} className="admin-mobile-card" onClick={() => navigate(`/admin/contact-messages/${m._id}`)}>
                  <div className="admin-mobile-card-top">
                    <div>
                      <div className="admin-mobile-card-title" style={{ fontWeight: m.status === 'unread' ? 800 : 600 }}>{m.name}</div>
                      <div className="admin-mobile-card-sub">{m.email}</div>
                    </div>
                    <div className="admin-mobile-card-pills">
                      <StatusPill status={m.status} />
                    </div>
                  </div>
                  <div className="admin-mobile-card-body">
                    <strong>Subject:</strong> {m.subject || 'General Enquiry'}
                  </div>
                  <div className="admin-mobile-card-footer">
                    <span>Received: {new Date(m.createdAt).toLocaleDateString()}</span>
                    <span className="admin-mobile-card-action">Read message &rarr;</span>
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
