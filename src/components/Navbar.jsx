import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logoWhts from '../assets/media/logo-whts.jpg'
import './Navbar.css'

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { setNavOpen(false) }, [location])

  const isAboutActive = location.pathname.startsWith('/about') || location.pathname === '/for-victims-government'
  const isResourcesActive = ['/essential-eight', '/blog'].includes(location.pathname)
  const isReportActive = location.pathname.startsWith('/report')

  // Dark pages keep the existing dark navbar
  // Light pages get a white navbar
  const isDarkPage = location.pathname === '/threats' ||
    location.pathname.startsWith('/threats/')

  return (
    <nav className={`navbar navbar-expand-lg cyber-navbar ${isDarkPage ? 'navbar-dark' : 'navbar-light navbar-white'}`}>
      <div className="container nav-inner">

        <Link className="navbar-brand" to="/" aria-label="WHTS home">
          <img src={logoWhts} alt="The Watch Eyes - WHTS" className="brand-logo" />
        </Link>

        <div className="nav-top-actions">
          <Link className="nav-search-btn" to="/blog">
            {/* <i className="bi bi-search"></i> */}
            <span>Resources</span>
          </Link>
          <Link className="btn btn-report-cta btn-sm-nav" to="/report" state={{ scrollTo: 'report' }}>
            <i className="bi bi-shield-exclamation me-1"></i>Report
          </Link>
          {user ? (
            <button className="nav-utility-link" type="button" onClick={() => { logout(); navigate('/') }}>
              Sign out
            </button>
          ) : (
            <>
              <Link className="nav-utility-link" to="/signin">Sign in</Link>
              <Link className="nav-utility-link" to="/signup">Sign up</Link>
            </>
          )}
        </div>

        <button className="navbar-toggler border-0" type="button"
          aria-controls="mainNav" aria-expanded={navOpen}
          aria-label="Toggle navigation" onClick={() => setNavOpen(p => !p)}>
          <span className={`cyber-toggler-icon ${navOpen ? 'open' : ''}`}>
            <span /><span /><span />
          </span>
          <span className="nav-menu-label">Menu</span>
        </button>

        <div className={`collapse navbar-collapse nav-menu-row ${navOpen ? 'show' : ''}`} id="mainNav">
          <ul className="navbar-nav mb-2 mb-lg-0 align-items-lg-center gap-lg-1">

            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} to="/">
                Home
              </NavLink>
            </li>

            {/* Threats dropdown */}
            <li className="nav-item dropdown">
              <a className={`nav-link dropdown-toggle nav-dropdown-toggle ${location.pathname.startsWith('/threats') ? 'active-link' : ''}`}
                href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Threats
                <span className="nav-underline" aria-hidden="true"></span>
              </a>
              <ul className="dropdown-menu cyber-dropdown p-3">
                <li>
                  <Link className="dropdown-item cyber-dropdown-item" to="/threats">
                    <i className="bi bi-grid me-2" style={{ color: '#1d4ed8' }}></i>Threat Library
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item cyber-dropdown-item" to="/threats-tools">
                    <i className="bi bi-tools me-2" style={{ color: '#dc2626' }}></i>Threats &amp; Tools
                  </Link>
                </li>
              </ul>
            </li>

            {/* About dropdown */}
            <li className="nav-item dropdown">
              <a className={`nav-link dropdown-toggle nav-dropdown-toggle ${isAboutActive ? 'active-link' : ''}`}
                href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                About
                <span className="nav-underline" aria-hidden="true"></span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end cyber-dropdown p-3">
                <li>
                  <Link className="dropdown-item cyber-dropdown-item" to="/about">
                    <i className="bi bi-info-circle me-2" style={{ color: 'var(--cyan)' }}></i>About WHTSIPA
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item cyber-dropdown-item" to="/about-officials">
                    <i className="bi bi-people me-2" style={{ color: 'var(--cyan)' }}></i>The Officials
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item cyber-dropdown-item" to="/for-victims-government">
                    <i className="bi bi-heart me-2" style={{ color: 'var(--red)' }}></i>For Victims &amp; Government
                  </Link>
                </li>
              </ul>
            </li>

            {/* Resources dropdown */}
            <li className="nav-item dropdown">
              <a className={`nav-link dropdown-toggle nav-dropdown-toggle ${isResourcesActive ? 'active-link' : ''}`}
                href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Resources
                <span className="nav-underline" aria-hidden="true"></span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end cyber-dropdown p-3">
                <li>
                  <Link className="dropdown-item cyber-dropdown-item" to="/essential-eight">
                    <i className="bi bi-shield-check me-2" style={{ color: 'var(--green)' }}></i>Essential Eight
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item cyber-dropdown-item" to="/blog">
                    <i className="bi bi-newspaper me-2" style={{ color: 'var(--cyan)' }}></i>Knowledge Base
                  </Link>
                </li>
              </ul>
            </li>

            {/* Report & Recover dropdown */}
            <li className="nav-item dropdown">
              <a className={`nav-link dropdown-toggle nav-dropdown-toggle ${isReportActive ? 'active-link' : ''}`}
                href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Report &amp; Recover
                <span className="nav-underline" aria-hidden="true"></span>
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
              </ul>
            </li>

            {/* Single Contact link */}
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} to="/contact">
                Contact
              </NavLink>
            </li>

          </ul>

          {/* Auth buttons + CTA */}
          <div className="nav-auth-actions">
            {user ? (
              <>
                <span className="nav-user-name">
                  <i className="bi bi-person-circle me-1"></i>
                  {user.name?.split(' ')[0] || 'Account'}
                </span>
                <button className="btn btn-outline-cyber btn-sm-nav"
                  onClick={() => { logout(); navigate('/') }}>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-cyber btn-sm-nav" to="/signin">Sign In</Link>
                <Link className="btn btn-cyber btn-sm-nav" to="/signup">Sign Up</Link>
              </>
            )}
            <Link className="btn btn-report-cta btn-sm-nav nav-report-mobile" to="/report" state={{ scrollTo: 'report' }}>
              <i className="bi bi-shield-exclamation me-1"></i>Report
            </Link>
          </div>
        </div>

      </div>
    </nav>
  )
}
