import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { THREAT_DATA } from '../data/threatData'
import { QUIZ_LIST } from '../data/quizData'
import WhatsipModal from '../components/WhatsipModal'
import ThreatsFooter from '../components/ThreatsFooter'
import '../styles/cyber.css'
import './ThreatDetail.css'

import iconDeepfake from '../assets/media/icons/icon-deepfake.png'
import iconCredentialStuffing from '../assets/media/icons/icon-credential-stuffing.png'
import iconBec from '../assets/media/icons/icon-bec.png'
import iconCloudMisconfig from '../assets/media/icons/icon-cloud-misconfig.png'
import iconInsiderThreat from '../assets/media/icons/icon-insider-threat.png'
import iconSimSwap from '../assets/media/icons/icon-sim-swap.png'
import iconSpyware from '../assets/media/icons/icon-spyware.png'
import iconTracking from '../assets/media/icons/icon-tracking.png'
import iconPentest from '../assets/media/icons/icon-pentest.png'
import iconPhishing from '../assets/media/icons/icon-phishing.png'
import iconRansomware from '../assets/media/icons/icon-ransomware.png'
import iconScamFraud from '../assets/media/icons/icon-scam-fraud.png'
import iconReputation from '../assets/media/icons/icon-reputation.png'
import iconAccountTakeover from '../assets/media/icons/icon-account-takeover.png'
import iconDataBreach from '../assets/media/icons/icon-data-breach.png'
import iconDdos from '../assets/media/icons/icon-ddos.png'
import iconApiSecurity from '../assets/media/icons/icon-api-security.png'
import iconIdentityTheft from '../assets/media/icons/icon-identity-theft.png'
import iconMalware from '../assets/media/icons/icon-malware.png'
import iconCryptoDrainer from '../assets/media/icons/icon-crypto-drainer.png'
import iconDeliveryScam from '../assets/media/icons/icon-delivery-scam.png'
import iconUnpatchedSoftware from '../assets/media/icons/icon-unpatched-software.png'
import iconCctvSurveillance from '../assets/media/icons/icon-cctv-surveillance.png'
import iconSocialMediaThreat from '../assets/media/icons/icon-social-media-threat.png'
import iconBotnet from '../assets/media/icons/icon-botnet.png'

// Maps every ThreatDetail slug → the client's PNG icon
const SLUG_ICON_MAP = {
  'deepfake':             iconDeepfake,
  'credential-stuffing':  iconCredentialStuffing,
  'bec':                  iconBec,
  'cloud-security':       iconCloudMisconfig,
  'insider-threat':       iconInsiderThreat,
  'phone-hack':           iconSimSwap,
  'sim-swap':             iconSimSwap,
  'spyware-detection':    iconSpyware,
  'stalking-scam':        iconTracking,
  'pentest':              iconPentest,
  'phishing-emails':      iconPhishing,
  'ransomware':           iconRansomware,
  'romance-scam':         iconScamFraud,
  'scam-fraud':           iconScamFraud,
  'reputation':           iconReputation,
  'compromised-device':   iconAccountTakeover,
  'account-takeover':     iconAccountTakeover,
  'data-breach':          iconDataBreach,
  'ddos-protection':      iconDdos,
  'api-security':         iconApiSecurity,
  'identity-theft':       iconIdentityTheft,
  'malware':              iconMalware,
  'malware-link':         iconMalware,
  'crypto-drainer':       iconCryptoDrainer,
  'fake-job':             iconDeliveryScam,
  'delivery-scam':        iconDeliveryScam,
  'unpatched-software':   iconUnpatchedSoftware,
  'cctv-surveillance':    iconCctvSurveillance,
  'fake-profile':         iconSocialMediaThreat,
  'social-media-threat':  iconSocialMediaThreat,
  'instagram-hack':       iconSocialMediaThreat,
  'facebook-hack':        iconSocialMediaThreat,
  'botnet':               iconBotnet,
  'wifi-hack':            iconSimSwap,
  'call-scam':            iconPhishing,
  'tax-refund-scam':      iconScamFraud,
  'ai-videos':            iconDeepfake,
}

const INVERT_ICONS = new Set([
  'icon-account-takeover.png','icon-api-security.png','icon-bec.png',
  'icon-credential-stuffing.png','icon-crypto-drainer.png','icon-data-breach.png',
  'icon-ddos.png','icon-identity-theft.png','icon-malware.png','icon-phishing.png',
  'icon-scam-fraud.png','icon-sim-swap.png','icon-social-media-threat.png','icon-unpatched-software.png',
])

// Which slugs map to an inverted icon
const INVERT_SLUGS = new Set([
  'credential-stuffing','bec','compromised-device','account-takeover','crypto-drainer',
  'data-breach','ddos-protection','identity-theft','malware','malware-link','phishing-emails',
  'romance-scam','scam-fraud','phone-hack','sim-swap','fake-profile','social-media-threat',
  'instagram-hack','facebook-hack','unpatched-software','call-scam','tax-refund-scam',
  'wifi-hack',
])

const RISK_COLOR = {
  high: { border: 'rgba(255,59,85,0.4)',  bg: 'rgba(255,59,85,0.08)',  text: 'var(--red)'   },
  mid:  { border: 'rgba(255,209,102,0.4)', bg: 'rgba(255,209,102,0.08)', text: 'var(--yellow)' },
  low:  { border: 'rgba(46,229,157,0.4)',  bg: 'rgba(46,229,157,0.08)',  text: 'var(--green)'  },
}

/* Highlights every occurrence of the word "tools" as a cyan styled link */
function ToolsText({ text }) {
  const parts = text.split(/(tools)/gi)
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === 'tools'
          ? <span key={i} className="tools-link">{part}</span>
          : part
      )}
    </>
  )
}

export default function ThreatDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const threat = THREAT_DATA[slug]
  const [activeModal, setActiveModal] = useState(null) // 'hire' | 'report' | 'request' | 'contact' | 'recovery'

  // After a redirected sign-in/sign-up, reopen the modal the user was using.
  useEffect(() => {
    if (location.state?.reopenModal) {
      setActiveModal(location.state.reopenModal)
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state, location.pathname, navigate])

  // Find a related quiz for this slug
  const relatedQuiz = QUIZ_LIST.find(q =>
    slug.includes(q.slug.replace('_', '-')) ||
    q.slug.replace('_', '-').includes(slug.replace('-', '_'))
  )

  // Other threats to browse
  const otherThreats = Object.entries(THREAT_DATA)
    .filter(([s]) => s !== slug)
    .slice(0, 3)

  if (!threat) {
    return (
      <div className="container section-pad text-center">
        <div style={{ fontSize: '3rem' }}>🔍</div>
        <h2 className="fw-bold mt-3 mb-2">Threat page not found</h2>
        <p className="text-muted-cyber mb-4">This threat category is being documented. Check back soon.</p>
        <Link className="btn btn-cyber" to="/threats">← Back to Threats</Link>
      </div>
    )
  }

  const riskStyle = RISK_COLOR[threat.risk]

  return (
    <div className="threat-detail-page">
      <>
        {/* ════════════════════════════
            HERO
            ════════════════════════════ */}
          <header className="threat-detail-hero">
          <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>

            <nav aria-label="breadcrumb" className="mb-4">
              <ol className="breadcrumb" style={{ fontSize: '0.82rem' }}>
                <li className="breadcrumb-item"><Link to="/" style={{ color: '#1d4ed8', textDecoration: 'none' }}>Home</Link></li>
                <li className="breadcrumb-item"><Link to="/threats" style={{ color: '#1d4ed8', textDecoration: 'none' }}>Threats</Link></li>
                <li className="breadcrumb-item active" style={{ color: '#6b7280' }}>{threat.title}</li>
              </ol>
            </nav>

            <div className="row g-4 align-items-center">
              <div className="col-12 col-lg-7">
                <div className="d-flex align-items-center gap-2 flex-wrap mb-3">
                  <span className="fvg-pill" style={{
                    background: threat.risk === 'high' ? '#fef2f2' : threat.risk === 'mid' ? '#fffbeb' : '#f0fdf4',
                    border: `1px solid ${threat.risk === 'high' ? '#fca5a5' : threat.risk === 'mid' ? '#fde68a' : '#86efac'}`,
                    color: threat.risk === 'high' ? '#dc2626' : threat.risk === 'mid' ? '#d97706' : '#16a34a',
                  }}>
                    {threat.riskLabel}
                  </span>
                  <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Threat Detail · {threat.category}</span>
                </div>

                <div className="d-flex align-items-center gap-3 mb-3">
                  {SLUG_ICON_MAP[slug] ? (
                    <img
                      src={SLUG_ICON_MAP[slug]}
                      alt={threat.title}
                      className={`td-hero-icon${INVERT_SLUGS.has(slug) ? ' td-icon-invert' : ' td-icon-natural'}`}
                    />
                  ) : (
                    <span style={{ fontSize: '2.5rem' }}>{threat.emoji}</span>
                  )}
                  <h1 className="fw-bold mb-0" style={{ color: '#0f172a', fontSize: 'clamp(1.6rem,3vw,2.5rem)' }}>{threat.title}</h1>
                </div>

                <p className="mb-4" style={{ maxWidth: '56ch', color: '#4a5568' }}>
                  <ToolsText text={threat.overview} />
                </p>

                <div className="d-flex flex-column flex-sm-row gap-2">
                  <button className="btn btn-danger px-4" onClick={() => setActiveModal('report')} style={{ borderRadius: 12, fontWeight: 600 }}>
                    <i className="bi bi-exclamation-triangle me-2"></i>Report this threat
                  </button>
                  <button className="btn btn-outline-secondary px-4" onClick={() => setActiveModal('recovery')} style={{ borderRadius: 12, fontWeight: 600 }}>
                    <i className="bi bi-shield-check me-2"></i>View recovery steps
                  </button>
                </div>
              </div>

              <div className="col-12 col-lg-5">
                <div className="about-cta-banner p-4">
                  <div style={{ color: '#6b7280', fontSize: '0.82rem', marginBottom: '0.25rem' }}>Threat status</div>
                  <div className="fw-bold fs-5 mb-3" style={{ color: riskStyle.text }}>
                    {threat.tagline}
                  </div>
                  <div className="e8-scan-bar mb-2"><span /></div>
                  <div className="mb-4" style={{ color: '#6b7280', fontSize: '0.85rem' }}>Continuously monitored by WHTSIPA intelligence</div>
                  <div className="d-flex align-items-start gap-3 p-3 rounded-3"
                    style={{ background: riskStyle.bg, border: `1px solid ${riskStyle.border}` }}>
                    <i className="bi bi-shield-exclamation mt-1" style={{ color: riskStyle.text, fontSize: '1.1rem', flexShrink: 0 }}></i>
                    <div>
                      <div className="fw-bold small" style={{ color: '#0f172a' }}>Safe Handling</div>
                      <div style={{ color: '#4a5568', fontSize: '0.85rem' }}>{threat.safeHandling}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ════════════════════════════
            MAIN CONTENT
            ════════════════════════════ */}
        <main className="section-pad-lg">
          <div className="container">
            <div className="row g-4">

              {/* ── Left column — main content ── */}
              <div className="col-12 col-lg-8">

                {/* Warning indicators */}
                <div className="banner p-4 mb-4">
                  <h2 className="fw-bold mb-3">
                    <i className="bi bi-eye me-2" style={{ color: 'var(--cyan)' }}></i>
                    Warning Indicators
                  </h2>
                  <p className="text-muted-cyber small mb-3">
                    Watch for these signs — early detection prevents serious damage.
                  </p>
                  <div className="row g-2">
                    {threat.indicators.map((ind, i) => (
                      <div key={i} className="col-12 col-md-6">
                        <div className="indicator-item">
                          <i className="bi bi-exclamation-circle me-2" style={{ color: 'var(--red)', fontSize: '0.9rem', flexShrink: 0 }}></i>
                          <span className="small">{ind}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prevention actions */}
                <div className="banner p-4 mb-4">
                  <h2 className="fw-bold mb-1">
                    <i className="bi bi-shield-lock me-2" style={{ color: 'var(--green)' }}></i>
                    Threat Prevention Actions
                  </h2>
                  <p className="text-muted-cyber small mb-4">
                    Concrete steps you can take right now to reduce your exposure.
                  </p>
                  <div className="row g-3">
                    {threat.prevention.map((item, i) => (
                      <div key={i} className="col-12 col-md-6">
                        <div className="prevention-card h-100">
                          <div className="prevention-num">{String(i + 1).padStart(2, '0')}</div>
                          <div className="fw-bold mb-1">{item.title}</div>
                          <div className="text-muted-cyber small">
                            <ToolsText text={item.desc} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WHTSIPA solutions */}
                <div className="banner p-4">
                  <div className="d-flex align-items-start gap-3">
                    <div className="icon-box" style={{ flexShrink: 0 }}>🛡️</div>
                    <div>
                      <div className="section-label mb-1">WHTSIPA Solutions</div>
                      <h3 className="fw-bold mb-2">How WHTSIPA Protects You</h3>
                      <p className="text-muted-cyber small mb-3">
                        <ToolsText text={threat.solutions} />
                      </p>
                      <button className="btn btn-cyber"
                        onClick={() => setActiveModal('hire')}>
                        <i className="bi bi-headset me-2"></i>Hire Our Team
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* ── Right column — sidebar ── */}
              <div className="col-12 col-lg-4">

                {/* Related quiz */}
                {relatedQuiz && (
                  <div className="banner p-4 mb-4">
                    <div className="section-label mb-2">Test Your Knowledge</div>
                    <h3 className="fw-bold mb-2">
                      {relatedQuiz.emoji} {relatedQuiz.title} Quiz
                    </h3>
                    <p className="text-muted-cyber small mb-3">
                      5 questions based on real scenarios. Can you spot it?
                    </p>
                    <Link
                      className="btn btn-outline-cyber w-100"
                      to="/threats#spot-a-threat"
                      state={{ openQuiz: relatedQuiz.slug }}
                    >
                      <i className="bi bi-play-fill me-2"></i>Start Quiz
                    </Link>
                  </div>
                )}

                {/* Quick actions */}
                <div className="card-glass p-4 mb-4">
                  <div className="fw-bold mb-3">Quick Actions</div>
                  <div className="d-flex flex-column gap-2">
                    <button className="btn btn-alert" onClick={() => setActiveModal('report')}>
                      <i className="bi bi-send me-2"></i>Report This Threat
                    </button>
                    <button className="btn btn-cyber" onClick={() => setActiveModal('recovery')}>
                      <i className="bi bi-arrow-repeat me-2"></i>View Recovery Steps
                    </button>
                    <Link className="btn btn-outline-cyber" to="/threats">
                      <i className="bi bi-grid me-2"></i>Browse All Threats
                    </Link>
                  </div>
                </div>

                {/* Emergency note */}
                <div className="p-3 rounded-3 mb-4"
                  style={{ background: 'rgba(255,59,85,0.07)', border: '1px solid rgba(255,59,85,0.28)' }}>
                  <div className="fw-bold small mb-1" style={{ color: 'var(--red)' }}>
                    <i className="bi bi-lightning-fill me-2"></i>Emergency?
                  </div>
                  <div className="text-muted-cyber small">
                    Contact law enforcement or your national cybercrime authority immediately.
                    Then{' '}
                    <button
                      style={{ background: 'none', border: 'none', padding: 0, color: 'var(--cyan)', cursor: 'pointer', textDecoration: 'underline', fontSize: 'inherit' }}
                      onClick={() => setActiveModal('contact')}
                    >
                      contact WHTSIPA
                    </button>
                    {' '}for expert recovery support.
                  </div>
                </div>

                {/* Other threats */}
                <div className="card-glass p-4">
                  <div className="fw-bold mb-3 small" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(233,243,255,0.6)' }}>
                    Explore More Threats
                  </div>
                  <div className="d-flex flex-column gap-2">
                    {otherThreats.map(([s, t]) => (
                      <Link key={s} to={`/threats/${s}`}
                        className="d-flex align-items-center gap-2 text-decoration-none p-2 rounded-3"
                        style={{ border: '1px solid rgba(120,214,255,0.1)', background: 'rgba(255,255,255,0.02)', transition: 'border-color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(120,214,255,0.3)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(120,214,255,0.1)'}
                      >
                        {SLUG_ICON_MAP[s] ? (
                          <img
                            src={SLUG_ICON_MAP[s]}
                            alt={t.title}
                            className={`${INVERT_SLUGS.has(s) ? 'td-icon-invert' : 'td-icon-natural'}`}
                            style={{ width: '24px', height: '24px', objectFit: 'contain', borderRadius: '4px', flexShrink: 0 }}
                          />
                        ) : (
                          <span>{t.emoji}</span>
                        )}
                        <span className="small fw-bold text-white">{t.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </main>

        {/* ════════════════════════════
            BOTTOM CTA
            ════════════════════════════ */}
        <section className="section-pad" style={{ background: 'rgba(5,9,19,0.55)' }}>
          <div className="container">
            <div className="banner p-4 p-md-5 text-center">
              <div className="section-label mb-3">Take Action</div>
              <h2 className="fw-bold glow-text mb-3">
                Experienced {threat.title}?
              </h2>
              <p className="text-muted-cyber mb-4 mx-auto" style={{ maxWidth: '50ch' }}>
                Don't wait. Every minute counts. Submit a secure report to WHTSIPA and
                get guided recovery support from our Active Representative.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <button className="btn btn-alert" onClick={() => setActiveModal('report')}>
                  <i className="bi bi-exclamation-triangle me-2"></i>Report an Incident
                </button>
                <button className="btn btn-cyber" onClick={() => setActiveModal('recovery')}>
                  <i className="bi bi-shield-check me-2"></i>View Recovery Steps
                </button>
              </div>
            </div>
          </div>
        </section>
      </>

      <ThreatsFooter />

      {/* ── Modals ── */}
      {activeModal && (
        <WhatsipModal
          mode={activeModal}
          threatTitle={threat?.title || ''}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  )
}
