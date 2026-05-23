import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import './Navbar.css'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false)
  const location = useLocation()

  useEffect(() => { setNavOpen(false) }, [location])
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="navbar navbar-expand-lg navbar-dark cyber-navbar">
      <div className="container">

        <Link className="navbar-brand" to="/" aria-label="WHTS home">
          <img src="/src/assets/media/logo-whts.jpg" alt="The Watch Eyes - WHTS" className="brand-logo" />
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          aria-controls="mainNav"
          aria-expanded={navOpen}
          aria-label="Toggle navigation"
          onClick={() => setNavOpen(p => !p)}
        >
          <span className={`cyber-toggler-icon ${navOpen ? 'open' : ''}`}>
            <span /><span /><span />
          </span>
        </button>

        <div className={`collapse navbar-collapse ${navOpen ? 'show' : ''}`} id="mainNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-1">

            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} to="/">
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} to="/threats">
                Threats
              </NavLink>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Report &amp; Recover
              </a>
              <ul className="dropdown-menu dropdown-menu-end cyber-dropdown p-3">
                <li>
                  <Link className="dropdown-item cyber-dropdown-item" to="/report" state={{ scrollTo: 'report' }}>
                    <i className="bi bi-exclamation-triangle me-2 text-danger"></i>Report Incident
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item cyber-dropdown-item" to="/report" state={{ scrollTo: 'recover' }}>
                    <i className="bi bi-shield-check me-2 text-success"></i>Recover Now
                  </Link>
                </li>
                <li><hr className="dropdown-divider border-cyber" /></li>
                <li>
                  <span className="dropdown-item-text text-muted-cyber small">
                    Guided steps and emergency support.
                  </span>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/report" state={{ scrollTo: 'contact' }}>Contact</Link>
            </li>

          </ul>

          {/* Right side — auth buttons + main CTA */}
          <div className="d-flex align-items-center gap-2 ms-lg-3 mt-3 mt-lg-0">
            {user ? (
              <>
                <span className="nav-user-name">
                  <i className="bi bi-person-circle me-1"></i>
                  {user.name?.split(' ')[0] || 'Account'}
                </span>
                <button
                  className="btn btn-outline-cyber btn-sm-nav"
                  onClick={() => { logout(); navigate('/') }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-cyber btn-sm-nav" to="/signin">
                  Sign In
                </Link>
                <Link className="btn btn-cyber btn-sm-nav" to="/signup">
                  Sign Up
                </Link>
              </>
            )}
            <Link className="btn btn-report-cta btn-sm-nav" to="/report" state={{ scrollTo: 'report' }}>
              <i className="bi bi-shield-exclamation me-1"></i>Report
            </Link>
          </div>
        </div>

      </div>
    </nav>
  )
}