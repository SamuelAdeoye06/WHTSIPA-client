import { Link, useNavigate } from 'react-router-dom'
import '../styles/cyber.css'
import './NotFound.css'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="notfound-page">
      <div className="cyber-grid" aria-hidden="true" />

      {/* Glitch 404 */}
      <div className="notfound-container">

        <div className="notfound-code" aria-hidden="true">
          <span className="notfound-4">4</span>
          <span className="notfound-0">0</span>
          <span className="notfound-4b">4</span>
        </div>

        <div className="scan-bar notfound-scan mb-4">
          <span />
        </div>

        <h1 className="notfound-title">Page Not Found</h1>
        <p className="notfound-desc">
          The page you're looking for doesn't exist or may have been moved.
          No threat detected — just a wrong turn.
        </p>

        {/* Quick links */}
        <div className="notfound-links">
          <div className="notfound-link-item">
            <i className="bi bi-house"></i>
            <Link to="/">Go Home</Link>
          </div>
          <div className="notfound-link-item">
            <i className="bi bi-shield-exclamation"></i>
            <Link to="/threats">Threat Library</Link>
          </div>
          <div className="notfound-link-item">
            <i className="bi bi-exclamation-triangle"></i>
            <Link to="/report">Report Incident</Link>
          </div>
        </div>

        {/* CTAs */}
        <div className="d-flex flex-wrap gap-3 justify-content-center mt-4">
          <button className="btn btn-outline-cyber" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left me-2"></i>Go Back
          </button>
          <Link className="btn btn-cyber" to="/">
            <i className="bi bi-house me-2"></i>Back to Home
          </Link>
        </div>

      </div>
    </div>
  )
}