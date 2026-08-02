import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import StatusPill from './components/StatusPill'
import './AdminShared.css'

export default function AdminBookings() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [search, setSearch]     = useState('')

  useEffect(() => {
    api.get('/booking/all')
      .then(({ data }) => setBookings(data))
      .catch(() => setError('Could not load bookings.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return bookings
    const q = search.toLowerCase()
    return bookings.filter(b => b.name?.toLowerCase().includes(q) || b.email?.toLowerCase().includes(q))
  }, [bookings, search])

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Call Bookings</h1>
        <p className="admin-page-sub">Scheduled callback sessions submitted through the site.</p>
      </div>

      <div className="admin-card">
        <div className="admin-toolbar">
          <input
            className="admin-search-input"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="admin-page-loading">Loading bookings…</div>
        ) : error ? (
          <div className="admin-page-error">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="admin-table-empty">No bookings match your search.</div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="admin-table-wrap admin-desktop-table">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Preferred Date</th>
                    <th>Preferred Time</th>
                    <th>Submitted</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(b => (
                    <tr key={b._id} className="admin-table-row-clickable" onClick={() => navigate(`/admin/bookings/${b._id}`)}>
                      <td>{b.name}</td>
                      <td>{b.preferredDate}</td>
                      <td>{b.preferredTime}</td>
                      <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                      <td><StatusPill status={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="admin-mobile-cards">
              {filtered.map(b => (
                <div key={b._id} className="admin-mobile-card" onClick={() => navigate(`/admin/bookings/${b._id}`)}>
                  <div className="admin-mobile-card-top">
                    <div>
                      <div className="admin-mobile-card-title">{b.name}</div>
                      <div className="admin-mobile-card-sub">{b.email} {b.phone ? `• ${b.phone}` : ''}</div>
                    </div>
                    <div className="admin-mobile-card-pills">
                      <StatusPill status={b.status} />
                    </div>
                  </div>
                  <div className="admin-mobile-card-body">
                    <strong>Requested Callback Slot:</strong> {b.preferredDate} at {b.preferredTime}
                  </div>
                  <div className="admin-mobile-card-footer">
                    <span>Submitted: {new Date(b.createdAt).toLocaleDateString()}</span>
                    <span className="admin-mobile-card-action">View session &rarr;</span>
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
