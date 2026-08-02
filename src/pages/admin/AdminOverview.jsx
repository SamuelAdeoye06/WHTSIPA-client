import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import './AdminShared.css'

export default function AdminOverview() {
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    Promise.all([
      api.get('/reports/all'),
      api.get('/tickets/all'),
      api.get('/booking/all'),
      api.get('/contact/all'),
      api.get('/admin/users'),
    ])
      .then(([reports, tickets, bookings, contacts, users]) => {
        setStats({
          reports:      reports.data,
          tickets:      tickets.data,
          bookings:     bookings.data,
          contacts:     contacts.data,
          users:        users.data,
        })
      })
      .catch(() => setError('Could not load dashboard data.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="admin-page-loading">Loading overview…</div>
  if (error)   return <div className="admin-page-error">{error}</div>

  const openReports  = stats.reports.filter(r => r.status === 'open').length
  const openTickets  = stats.tickets.filter(t => t.status === 'open').length
  const unreadMsgs    = stats.contacts.filter(c => c.status === 'unread').length
  const pendingBooks = stats.bookings.filter(b => b.status === 'pending').length

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Overview</h1>
        <p className="admin-page-sub">Platform-wide statistics and pending actions.</p>
      </div>

      <div className="admin-stat-grid">
        <Link to="/admin/reports" className="admin-stat-card" style={{ textDecoration: 'none' }}>
          <div className="admin-stat-label">Total Reports</div>
          <div className="admin-stat-value">{stats.reports.length}</div>
          <span className={`admin-stat-badge ${openReports > 0 ? 'admin-stat-badge-warn' : 'admin-stat-badge-neutral'}`}>
            {openReports} open
          </span>
        </Link>

        <Link to="/admin/tickets" className="admin-stat-card" style={{ textDecoration: 'none' }}>
          <div className="admin-stat-label">Total Tickets</div>
          <div className="admin-stat-value">{stats.tickets.length}</div>
          <span className={`admin-stat-badge ${openTickets > 0 ? 'admin-stat-badge-warn' : 'admin-stat-badge-neutral'}`}>
            {openTickets} open
          </span>
        </Link>

        <Link to="/admin/contact-messages" className="admin-stat-card" style={{ textDecoration: 'none' }}>
          <div className="admin-stat-label">Contact Messages</div>
          <div className="admin-stat-value">{stats.contacts.length}</div>
          <span className={`admin-stat-badge ${unreadMsgs > 0 ? 'admin-stat-badge-warn' : 'admin-stat-badge-neutral'}`}>
            {unreadMsgs} unread
          </span>
        </Link>

        <Link to="/admin/bookings" className="admin-stat-card" style={{ textDecoration: 'none' }}>
          <div className="admin-stat-label">Call Bookings</div>
          <div className="admin-stat-value">{stats.bookings.length}</div>
          <span className={`admin-stat-badge ${pendingBooks > 0 ? 'admin-stat-badge-warn' : 'admin-stat-badge-neutral'}`}>
            {pendingBooks} pending
          </span>
        </Link>

        <Link to="/admin/users" className="admin-stat-card" style={{ textDecoration: 'none' }}>
          <div className="admin-stat-label">Total Users</div>
          <div className="admin-stat-value">{stats.users.length}</div>
          <span className="admin-stat-badge admin-stat-badge-good">All roles</span>
        </Link>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Needs Attention</h3>
        </div>
        {openReports === 0 && openTickets === 0 && unreadMsgs === 0 && pendingBooks === 0 ? (
          <div className="admin-empty-state">
            <i className="bi bi-check-circle"></i>
            Nothing pending right now — everything's up to date.
          </div>
        ) : (
          <ul className="admin-attention-list">
            {openReports > 0 && (
              <li>
                <Link to="/admin/reports" className="admin-attention-row">
                  <span className="admin-attention-icon"><i className="bi bi-file-earmark-text-fill"></i></span>
                  <span className="admin-attention-text">
                    <strong>{openReports} open report{openReports > 1 ? 's' : ''}</strong> awaiting review
                  </span>
                  <i className="bi bi-chevron-right admin-attention-arrow"></i>
                </Link>
              </li>
            )}
            {openTickets > 0 && (
              <li>
                <Link to="/admin/tickets" className="admin-attention-row">
                  <span className="admin-attention-icon"><i className="bi bi-ticket-perforated-fill"></i></span>
                  <span className="admin-attention-text">
                    <strong>{openTickets} open ticket{openTickets > 1 ? 's' : ''}</strong> awaiting review
                  </span>
                  <i className="bi bi-chevron-right admin-attention-arrow"></i>
                </Link>
              </li>
            )}
            {unreadMsgs > 0 && (
              <li>
                <Link to="/admin/contact-messages" className="admin-attention-row">
                  <span className="admin-attention-icon admin-attention-icon-yellow"><i className="bi bi-envelope-fill"></i></span>
                  <span className="admin-attention-text">
                    <strong>{unreadMsgs} unread message{unreadMsgs > 1 ? 's' : ''}</strong> from the contact page
                  </span>
                  <i className="bi bi-chevron-right admin-attention-arrow"></i>
                </Link>
              </li>
            )}
            {pendingBooks > 0 && (
              <li>
                <Link to="/admin/bookings" className="admin-attention-row">
                  <span className="admin-attention-icon admin-attention-icon-yellow"><i className="bi bi-telephone-fill"></i></span>
                  <span className="admin-attention-text">
                    <strong>{pendingBooks} pending booking{pendingBooks > 1 ? 's' : ''}</strong> to confirm
                  </span>
                  <i className="bi bi-chevron-right admin-attention-arrow"></i>
                </Link>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  )
}
