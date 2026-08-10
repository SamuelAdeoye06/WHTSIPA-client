import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../styles/cyber.css'

export default function PrivacyTerms({ mode = 'privacy' }) {
  const location = useLocation()
  const isPrivacy = mode === 'privacy' || location.pathname === '/privacy'

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <div className="privacy-terms-page section-pad-lg" style={{ background: '#ffffff', minHeight: '80vh', color: '#1a1a2e' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        
        {/* Breadcrumb / Nav back */}
        <div className="mb-4 d-flex align-items-center gap-2" style={{ fontSize: '0.88rem' }}>
          <Link to="/" style={{ color: '#0f766e', textDecoration: 'none', fontWeight: 600 }}>Home</Link>
          <span style={{ color: '#94a3b8' }}>&gt;</span>
          <span style={{ color: '#64748b' }}>{isPrivacy ? 'Privacy Policy' : 'Terms of Service'}</span>
        </div>

        {/* Tab Toggle */}
        <div className="d-flex gap-3 mb-5 border-bottom pb-3">
          <Link
            to="/privacy"
            className={`btn ${isPrivacy ? 'btn-primary' : 'btn-outline-secondary'}`}
            style={{ borderRadius: '10px', fontWeight: 600 }}
          >
            <i className="bi bi-shield-check me-2"></i>Privacy Policy
          </Link>
          <Link
            to="/terms"
            className={`btn ${!isPrivacy ? 'btn-primary' : 'btn-outline-secondary'}`}
            style={{ borderRadius: '10px', fontWeight: 600 }}
          >
            <i className="bi bi-file-text me-2"></i>Terms of Service
          </Link>
        </div>

        {isPrivacy ? (
          <div>
            <h1 className="fw-bold mb-3" style={{ color: '#0f172a' }}>Privacy Policy</h1>
            <p className="text-muted mb-4">Last Updated: August 2026</p>

            <section className="mb-5">
              <h3 className="h5 fw-bold text-dark mb-3">1. Information We Collect</h3>
              <p style={{ lineHeight: 1.7, color: '#334155' }}>
                WHTSIPA collects information necessary to investigate cyber incidents, deliver security tools, and protect digital assets. This includes:
              </p>
              <ul style={{ lineHeight: 1.7, color: '#334155' }}>
                <li><strong>Account Data:</strong> Name, email address, phone number, and country when registering an account.</li>
                <li><strong>Incident Report Data:</strong> Evidence details, targeted account handles, transaction hashes, screenshots, and logs submitted during personal or public reporting.</li>
                <li><strong>Technical Data:</strong> IP addresses, browser fingerprinting for threat intelligence analysis, and session metrics.</li>
              </ul>
            </section>

            <section className="mb-5">
              <h3 className="h5 fw-bold text-dark mb-3">2. How We Use Your Information</h3>
              <p style={{ lineHeight: 1.7, color: '#334155' }}>
                All submitted information is processed under strict security protocols. We use data to:
              </p>
              <ul style={{ lineHeight: 1.7, color: '#334155' }}>
                <li>Investigate scam operations and track down malicious actors.</li>
                <li>Fulfill requested security tools and provide rapid incident recovery support.</li>
                <li>Compile anonymized threat intelligence to alert the public against active scam campaigns (only if anonymization consent is granted).</li>
              </ul>
            </section>

            <section className="mb-5">
              <h3 className="h5 fw-bold text-dark mb-3">3. Data Protection &amp; Confidentiality</h3>
              <p style={{ lineHeight: 1.7, color: '#334155' }}>
                We enforce military-grade encryption at rest and in transit. Your personal information is never sold, leased, or disclosed to third parties without your explicit consent or law enforcement subpoenas.
              </p>
            </section>

            <section className="mb-5">
              <h3 className="h5 fw-bold text-dark mb-3">4. Contacting Our Data Protection Officer</h3>
              <p style={{ lineHeight: 1.7, color: '#334155' }}>
                If you have questions regarding your data or wish to request data deletion, contact our privacy team at <a href="mailto:support@whtsipa.com" style={{ color: '#0f766e' }}>support@whtsipa.com</a> or via our <Link to="/contact" style={{ color: '#0f766e' }}>Contact Page</Link>.
              </p>
            </section>
          </div>
        ) : (
          <div>
            <h1 className="fw-bold mb-3" style={{ color: '#0f172a' }}>Terms of Service</h1>
            <p className="text-muted mb-4">Last Updated: August 2026</p>

            <section className="mb-5">
              <h3 className="h5 fw-bold text-dark mb-3">1. Acceptance of Terms</h3>
              <p style={{ lineHeight: 1.7, color: '#334155' }}>
                By accessing or using WHTSIPA (We Help Track Scammers IP Address), you agree to be bound by these Terms of Service. If you do not agree, please discontinue use of our platform immediately.
              </p>
            </section>

            <section className="mb-5">
              <h3 className="h5 fw-bold text-dark mb-3">2. Acceptable Use &amp; Legal Compliance</h3>
              <p style={{ lineHeight: 1.7, color: '#334155' }}>
                WHTSIPA tools and services are provided strictly for defensive cybersecurity, victim recovery, incident reporting, and lawful threat intelligence. Users are strictly prohibited from utilizing WHTSIPA tools or services for unauthorized hacking, extortion, harassment, or unlawful surveillance.
              </p>
            </section>

            <section className="mb-5">
              <h3 className="h5 fw-bold text-dark mb-3">3. Services &amp; Disclaimers</h3>
              <p style={{ lineHeight: 1.7, color: '#334155' }}>
                While WHTSIPA employs industry-leading investigation tools and fund-tracing methodologies, asset recovery depends on external factors including law enforcement action and blockchain liquidity. WHTSIPA provides services on an "as-is" basis under certified expert oversight.
              </p>
            </section>

            <section className="mb-5">
              <h3 className="h5 fw-bold text-dark mb-3">4. Account Termination</h3>
              <p style={{ lineHeight: 1.7, color: '#334155' }}>
                We reserve the right to suspend or terminate accounts that submit fraudulent incident reports, abuse support channels, or breach these terms.
              </p>
            </section>
          </div>
        )}

      </div>
    </div>
  )
}
