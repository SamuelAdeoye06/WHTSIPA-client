import { Link, useNavigate } from 'react-router-dom'
import logoWhts from '../assets/media/logo-whts.jpg'

export default function Footer() {
  const year = new Date().getFullYear()
  const navigate = useNavigate()

  // Handles clicking a link that goes to a section on a different page
  const goTo = (path, sectionId) => {
    navigate(path, { state: { scrollTo: sectionId } })
  }

  return (
    <footer className="footer py-5">
      <div className="container">
        <div className="row g-4">

          {/* Brand column */}
          <div className="col-12 col-lg-3">
            <div className="mb-3">
              <img
                src={logoWhts}
                alt="The Watch Eyes - WHTS"
                style={{ height: '80px', width: 'auto', borderRadius: '10px', mixBlendMode: 'lighten' }}
              />
            </div>
            <p className="text-muted-cyber small mb-3">
              A cybersecurity intelligence platform helping individuals and organizations
              identify threats, report incidents, and recover safely.
            </p>
            <div className="d-flex gap-2 flex-wrap">
              <span className="pill low" style={{ fontSize: '0.68rem' }}>
                <span className="dot"></span> ACSW Verified
              </span>
              <span className="pill" style={{ fontSize: '0.68rem', borderColor: 'rgba(120,214,255,0.3)' }}>
                <i className="bi bi-shield-fill-check" style={{ color: 'var(--cyan)', fontSize: '0.75rem' }}></i> Secure Platform
              </span>
            </div>
          </div>

          {/* Platform links */}
          <div className="col-6 col-lg-2">
            <div className="footer-col-title">Platform</div>
            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                {/* Home — scroll to top */}
                <button className="footer-link-btn" onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
                  Home
                </button>
              </li>
              <li className="mb-2">
                <button className="footer-link-btn" onClick={() => { navigate('/threats'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
                  Threats
                </button>
              </li>
              <li className="mb-2">
                <button className="footer-link-btn" onClick={() => goTo('/report', 'report')}>
                  Report Incident
                </button>
              </li>
              <li className="mb-2">
                <button className="footer-link-btn" onClick={() => goTo('/report', 'recover')}>
                  Recover Now
                </button>
              </li>
            </ul>
          </div>

          {/* About column */}
          <div className="col-6 col-lg-2">
            <div className="footer-col-title">About</div>
            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <button className="footer-link-btn" onClick={() => navigate('/about')}>About WHTS</button>
              </li>
              <li className="mb-2">
                <button className="footer-link-btn" onClick={() => navigate('/about-officials')}>The Officials</button>
              </li>
              <li className="mb-2">
                <button className="footer-link-btn" onClick={() => navigate('/for-victims-government')}>For Victims</button>
              </li>
              <li className="mb-2">
                <button className="footer-link-btn" onClick={() => navigate('/contact')}>Contact Us</button>
              </li>
            </ul>
          </div>

          {/* Resources column */}
          <div className="col-6 col-lg-2">
            <div className="footer-col-title">Resources</div>
            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <button className="footer-link-btn" onClick={() => navigate('/essential-eight')}>Essential Eight</button>
              </li>
              <li className="mb-2">
                <button className="footer-link-btn" onClick={() => navigate('/blog')}>Knowledge Base</button>
              </li>
              <li className="mb-2">
                <button className="footer-link-btn" onClick={() => goTo('/threats', 'spot-a-threat')}>Spot a Scam Quiz</button>
              </li>
              <li className="mb-2">
                <button className="footer-link-btn" onClick={() => goTo('/threats', 'types-of-threats')}>Threat Library</button>
              </li>
            </ul>
          </div>

          {/* Actions column */}
          <div className="col-12 col-lg-3">
            <div className="footer-col-title">Take Action</div>
            <div className="d-grid gap-2 mb-3">
              <Link className="btn btn-alert" to="/report" state={{ scrollTo: 'report' }}>
                <i className="bi bi-exclamation-triangle me-2"></i>Report an Incident
              </Link>
              <Link className="btn btn-cyber" to="/report" state={{ scrollTo: 'recover' }}>
                <i className="bi bi-shield-check me-2"></i>Start Recovery
              </Link>
            </div>
            <div className="card-glass p-3 d-flex align-items-start gap-3">
              <div className="icon-box" style={{ width: 36, height: 36, fontSize: '1rem', flexShrink: 0 }}>🚨</div>
              <div>
                <div className="fw-bold small text-white">Emergency?</div>
                <div className="text-muted-cyber" style={{ fontSize: '0.78rem' }}>
                  Contact your local law enforcement or cybercrime authority immediately.
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar — styled background */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-inner">
            <div className="footer-bottom-copy">
              © {year} WHTS · America Cyber Security World. All rights reserved.
            </div>
            <div className="footer-bottom-links">
              <button className="footer-link-btn small" onClick={() => navigate('/contact')}>Contact</button>
              <span className="text-muted-cyber small">Privacy Policy</span>
              <span className="text-muted-cyber small">Terms of Use</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
