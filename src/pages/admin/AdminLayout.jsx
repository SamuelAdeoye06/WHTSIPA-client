import { useState, useEffect } from 'react'
import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './AdminLayout.css'

const NAV_ITEMS = [
  { to: '/admin',                  label: 'Overview',         icon: 'bi-grid-1x2-fill', end: true },
  { to: '/admin/reports',          label: 'Reports',          icon: 'bi-file-earmark-text-fill' },
  { to: '/admin/tickets',          label: 'Tickets',          icon: 'bi-ticket-perforated-fill' },
  { to: '/admin/bookings',         label: 'Call Bookings',    icon: 'bi-telephone-fill' },
  { to: '/admin/contact-messages', label: 'Contact Messages', icon: 'bi-envelope-fill' },
  { to: '/admin/users',            label: 'Users',            icon: 'bi-people-fill' },
  { to: '/admin/settings',         label: 'Settings',         icon: 'bi-gear-fill' },
]

export default function AdminLayout() {
  const { user, loading, logout } = useAuth()
  const location = useLocation()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  // Close the mobile drawer automatically whenever the route changes
  useEffect(() => {
    setMobileNavOpen(false)
  }, [location.pathname])

  if (loading) {
    return (
      <div className="admin-gate-loading">
        <span className="admin-spinner" />
      </div>
    )
  }

  // Not signed in at all — send to sign-in, remember where they were headed
  if (!user) {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />
  }

  // Signed in, but not an admin — no admin panel for them
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  const currentPage = NAV_ITEMS.find(item =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
  )

  return (
    <div className="admin-shell">
      {/* Backdrop — tapping it closes the mobile drawer */}
      {mobileNavOpen && (
        <div className="admin-backdrop" onClick={() => setMobileNavOpen(false)} />
      )}

      <aside className={`admin-sidebar${mobileNavOpen ? ' admin-sidebar-open' : ''}`}>
        <div className="admin-sidebar-brand">
          <span className="admin-brand-white">WHTS</span><span className="admin-brand-accent">IPA</span>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav-label">Main Menu</div>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-nav-item${isActive ? ' admin-nav-item-active' : ''}`}
            >
              <i className={`bi ${item.icon}`}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button className="admin-signout-btn" onClick={logout}>
          <i className="bi bi-box-arrow-right"></i>
          <span>Sign Out</span>
        </button>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              className="admin-hamburger-btn"
              onClick={() => setMobileNavOpen(o => !o)}
              aria-label="Toggle menu"
            >
              <i className="bi bi-list"></i>
            </button>
            <div className="admin-topbar-title">{currentPage?.label || 'Admin Panel'}</div>
          </div>
          <div className="admin-topbar-user">
            <div className="admin-topbar-user-name">{user.firstName || user.name}</div>
            <div className="admin-topbar-user-role">Admin</div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
