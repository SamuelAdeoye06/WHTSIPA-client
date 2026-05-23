import { useParams, Link, useNavigate } from 'react-router-dom'
import { THREAT_DATA } from '../data/threatData'
import { QUIZ_LIST } from '../data/quizData'
import '../styles/cyber.css'
import './ThreatDetail.css'

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
  const threat = THREAT_DATA[slug]

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
    <>
      {/* ════════════════════════════
          HERO
          ════════════════════════════ */}
      <header className="threat-detail-hero">
        <div className="cyber-grid" aria-hidden="true" />
        <div className="container position-relative" style={{ zIndex: 2, paddingTop: '3rem', paddingBottom: '3rem' }}>
          
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb cyber-breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/threats">Threats</Link></li>
              <li className="breadcrumb-item active">{threat.title}</li>
            </ol>
          </nav>

          <div className="row g-4 align-items-center">
            <div className="col-12 col-lg-7">
              <div className="d-flex align-items-center gap-2 flex-wrap mb-3">
                <span className={`pill ${threat.risk}`}>
                  <span className="dot" /><span className="fw-bold" style={{ fontSize: '0.7rem' }}>{threat.riskLabel}</span>
                </span>
                <span className="text-muted-cyber small">Threat Detail · {threat.category}</span>
              </div>

              <div className="d-flex align-items-center gap-3 mb-3">
                <span style={{ fontSize: '2.5rem' }}>{threat.emoji}</span>
                <h1 className="glow-text fw-bold mb-0">{threat.title}</h1>
              </div>

              <p className="text-muted-cyber mb-4" style={{ maxWidth: '56ch' }}>
                <ToolsText text={threat.overview} />
              </p>

              <div className="d-flex flex-column flex-sm-row gap-2">
                <Link className="btn btn-alert" to="/report">
                  <i className="bi bi-exclamation-triangle me-2"></i>Report this incident
                </Link>
                <Link className="btn btn-outline-cyber" to="/report#recover">
                  <i className="bi bi-shield-check me-2"></i>View recovery steps
                </Link>
              </div>
            </div>

            <div className="col-12 col-lg-5">
              <div className="banner p-4">
                <div className="text-muted-cyber small mb-1">Threat status</div>
                <div className="fw-bold fs-5 glow-text mb-3" style={{ color: riskStyle.text }}>
                  {threat.tagline}
                </div>
                <div className="scan-bar mb-2"><span /></div>
                <div className="text-muted-cyber small mb-4">Continuously monitored by WHTS intelligence</div>
                <div className="d-flex align-items-start gap-3 p-3 rounded-3"
                  style={{ background: riskStyle.bg, border: `1px solid ${riskStyle.border}` }}>
                  <i className="bi bi-shield-exclamation mt-1" style={{ color: riskStyle.text, fontSize: '1.1rem', flexShrink: 0 }}></i>
                  <div>
                    <div className="fw-bold small">Safe Handling</div>
                    <div className="text-muted-cyber small">{threat.safeHandling}</div>
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

              {/* WHTS solutions */}
              <div className="banner p-4">
                <div className="d-flex align-items-start gap-3">
                  <div className="icon-box" style={{ flexShrink: 0 }}>🛡️</div>
                  <div>
                    <div className="section-label mb-1">WHTSIPA Solutions</div>
                    <h3 className="fw-bold mb-2">How WHTS Protects You</h3>
                    <p className="text-muted-cyber small mb-3">
                      <ToolsText text={threat.solutions} />
                    </p>
                    <Link className="btn btn-cyber" to="/report#contact">
                      <i className="bi bi-headset me-2"></i>Talk to Our Team
                    </Link>
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
                    to={`/threats#quizzes`}
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
                  <Link className="btn btn-alert" to="/report">
                    <i className="bi bi-send me-2"></i>Report This Threat
                  </Link>
                  <Link className="btn btn-cyber" to="/report#recover">
                    <i className="bi bi-arrow-repeat me-2"></i>Start Recovery
                  </Link>
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
                  Then <Link to="/report#contact" style={{ color: 'var(--cyan)' }}>contact WHTS</Link> for expert recovery support.
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
                      <span>{t.emoji}</span>
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
              Don't wait. Every minute counts. Submit a secure report to WHTS and
              get guided recovery support from our Active Representative.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link className="btn btn-alert" to="/report">
                <i className="bi bi-exclamation-triangle me-2"></i>Report Now
              </Link>
              <Link className="btn btn-cyber" to="/threats">
                <i className="bi bi-grid me-2"></i>Explore All Threats
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}