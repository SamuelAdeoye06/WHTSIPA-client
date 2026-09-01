import { useState, useEffect, useMemo } from 'react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import ConfirmDialog from './components/ConfirmDialog'
import './AdminShared.css'

export default function AdminUsers() {
  const { user: currentAdmin } = useAuth()
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [search, setSearch]   = useState('')
  const [actioningId, setActioningId] = useState(null)
  const [confirmTarget, setConfirmTarget] = useState(null) // { user, action: 'restrict' | 'unrestrict' | 'delete' }
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [actionError, setActionError] = useState('')

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

  const handleConfirm = async () => {
    if (!confirmTarget) return
    const { user: target, action } = confirmTarget
    setConfirmLoading(true)
    setActionError('')
    try {
      if (action === 'delete') {
        await api.delete(`/admin/users/${target._id}`)
        setUsers(prev => prev.filter(u => u._id !== target._id))
      } else {
        const restricted = action === 'restrict'
        const { data } = await api.patch(`/admin/users/${target._id}/restrict`, { restricted })
        setUsers(prev => prev.map(u => u._id === target._id ? data : u))
      }
      setConfirmTarget(null)
    } catch (err) {
      setActionError(err.response?.data?.message || 'Could not complete that action. Please try again.')
    } finally {
      setConfirmLoading(false)
    }
  }

  const confirmCopy = {
    restrict: {
      title: 'Restrict this user?',
      message: 'They will be signed out immediately and unable to log in, start a live chat, or submit anything until unrestricted.',
      confirmLabel: 'Restrict User',
      danger: true,
    },
    unrestrict: {
      title: 'Unrestrict this user?',
      message: 'They will be able to log in and use their account normally again.',
      confirmLabel: 'Unrestrict User',
      danger: false,
    },
    delete: {
      title: 'Delete this account permanently?',
      message: 'This cannot be undone. Their submitted reports, tickets, and bookings are NOT deleted along with the account — only the login itself is removed.',
      confirmLabel: 'Delete Account',
      danger: true,
    },
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Users</h1>
        <p className="admin-page-sub">Everyone registered on the platform.</p>
      </div>

      {actionError && <div className="admin-page-error" style={{ marginBottom: '1rem' }}>{actionError}</div>}

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
                    <th>Login Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => {
                    const isSelf = currentAdmin && u._id === currentAdmin.id
                    return (
                      <tr key={u._id}>
                        <td>{u.firstName} {u.lastName}</td>
                        <td>{u.email}</td>
                        <td>{u.country}</td>
                        <td style={{ textTransform: 'capitalize' }}>{u.role}</td>
                        <td>{u.isVerified ? <span className="admin-pill admin-pill-resolved">Verified</span> : <span className="admin-pill admin-pill-open">Unverified</span>}</td>
                        <td>
                          {u.isRestricted
                            ? <span className="admin-pill admin-pill-open">Restricted</span>
                            : <span className="admin-pill admin-pill-resolved">Active</span>}
                        </td>
                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td>
                          {isSelf ? (
                            <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>—</span>
                          ) : (
                            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                              {u.isRestricted ? (
                                <button
                                  className="admin-btn admin-btn-ghost admin-btn-sm"
                                  onClick={() => setConfirmTarget({ user: u, action: 'unrestrict' })}
                                >
                                  Unrestrict
                                </button>
                              ) : (
                                <button
                                  className="admin-btn admin-btn-ghost admin-btn-sm"
                                  onClick={() => setConfirmTarget({ user: u, action: 'restrict' })}
                                >
                                  Restrict
                                </button>
                              )}
                              <button
                                className="admin-btn admin-btn-danger admin-btn-sm"
                                onClick={() => setConfirmTarget({ user: u, action: 'delete' })}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View (SIWESLog Style) */}
            <div className="admin-mobile-cards">
              {filtered.map(u => {
                const initials = `${u.firstName?.[0] || ''}${u.lastName?.[0] || ''}`.toUpperCase() || 'U'
                const isSelf = currentAdmin && u._id === currentAdmin.id
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
                            {u.isRestricted
                              ? <span className="admin-pill admin-pill-open">Restricted</span>
                              : <span className="admin-pill admin-pill-resolved">Active</span>}
                          </div>
                        </div>
                        <div className="admin-mobile-card-sub">{u.email}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem', fontSize: '0.78rem', color: '#94a3b8' }}>
                          <span>Country: <strong>{u.country || 'N/A'}</strong></span>
                          <span>Joined {new Date(u.createdAt).toLocaleDateString()}</span>
                        </div>
                        {!isSelf && (
                          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.6rem' }}>
                            {u.isRestricted ? (
                              <button
                                className="admin-btn admin-btn-ghost admin-btn-sm"
                                onClick={() => setConfirmTarget({ user: u, action: 'unrestrict' })}
                              >
                                Unrestrict
                              </button>
                            ) : (
                              <button
                                className="admin-btn admin-btn-ghost admin-btn-sm"
                                onClick={() => setConfirmTarget({ user: u, action: 'restrict' })}
                              >
                                Restrict
                              </button>
                            )}
                            <button
                              className="admin-btn admin-btn-danger admin-btn-sm"
                              onClick={() => setConfirmTarget({ user: u, action: 'delete' })}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        open={!!confirmTarget}
        danger={confirmTarget ? confirmCopy[confirmTarget.action].danger : false}
        title={confirmTarget ? confirmCopy[confirmTarget.action].title : ''}
        message={confirmTarget ? confirmCopy[confirmTarget.action].message : ''}
        confirmLabel={confirmTarget ? confirmCopy[confirmTarget.action].confirmLabel : ''}
        loading={confirmLoading}
        onCancel={() => setConfirmTarget(null)}
        onConfirm={handleConfirm}
      />
    </div>
  )
}
