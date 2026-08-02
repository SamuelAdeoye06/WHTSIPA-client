import { useState, useEffect, useMemo } from 'react'
import api from '../../services/api'
import './AdminShared.css'

export default function AdminUsers() {
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [search, setSearch]   = useState('')

  useEffect(() => {
    api.get('/admin/users')
      .then(({ data }) => setUsers(data))
      .catch(() => setError('Could not load users.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return users
    const q = search.toLowerCase()
    return users.filter(u =>
      u.email?.toLowerCase().includes(q) ||
      u.firstName?.toLowerCase().includes(q) ||
      u.lastName?.toLowerCase().includes(q)
    )
  }, [users, search])

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Users</h1>
        <p className="admin-page-sub">Everyone registered on the platform.</p>
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
          <div className="admin-page-loading">Loading users…</div>
        ) : error ? (
          <div className="admin-page-error">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="admin-table-empty">No users match your search.</div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="admin-table-wrap admin-desktop-table">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Country</th>
                    <th>Role</th>
                    <th>Verified</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u._id}>
                      <td>{u.firstName} {u.lastName}</td>
                      <td>{u.email}</td>
                      <td>{u.country}</td>
                      <td style={{ textTransform: 'capitalize' }}>{u.role}</td>
                      <td>{u.isVerified ? <span className="admin-pill admin-pill-resolved">Verified</span> : <span className="admin-pill admin-pill-open">Unverified</span>}</td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View (SIWESLog Style) */}
            <div className="admin-mobile-cards">
              {filtered.map(u => {
                const initials = `${u.firstName?.[0] || ''}${u.lastName?.[0] || ''}`.toUpperCase() || 'U'
                return (
                  <div key={u._id} className="admin-mobile-card" style={{ cursor: 'default' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div className="admin-mobile-avatar">
                        {initials}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
                          <div className="admin-mobile-card-title">{u.firstName} {u.lastName}</div>
                          <div className="admin-mobile-card-pills">
                            <span className="admin-pill admin-pill-pending" style={{ textTransform: 'capitalize' }}>{u.role}</span>
                            {u.isVerified ? (
                              <span className="admin-pill admin-pill-resolved">Verified</span>
                            ) : (
                              <span className="admin-pill admin-pill-open">Unverified</span>
                            )}
                          </div>
                        </div>
                        <div className="admin-mobile-card-sub">{u.email}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem', fontSize: '0.78rem', color: '#94a3b8' }}>
                          <span>Country: <strong>{u.country || 'N/A'}</strong></span>
                          <span>Joined {new Date(u.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
