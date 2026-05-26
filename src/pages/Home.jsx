import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import '../styles/cyber.css'
import './Home.css'

import agencyCisa from '../assets/media/agency-cisa.jpeg'
import agencyDhs from '../assets/media/agency-dhs.jpeg'
import agencyFbi from '../assets/media/agency-fbi.jpeg'
import agencyFtc from '../assets/media/agency-ftc.jpeg'
import agencyInterpol from '../assets/media/agency-interpol.jpeg'
import agencyIrs from '../assets/media/agency-irs.jpeg'
import agencySecretService from '../assets/media/agency-secret-service.jpeg'
import agencyUsps from '../assets/media/agency-usps.jpeg'
import heroImage from '../assets/media/hero-image.png'
const heroVideo = 'https://res.cloudinary.com/dqch0tjrm/video/upload/v1779575838/hero-video-compressed_rdbyn5.mp4'

/* ── Animated counter hook ── */
function useCounter(target, duration = 1400, trigger) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!trigger) return
    let start = 0
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [trigger, target, duration])
  return count
}

/* ── Threat categories data ── */
const THREAT_CATS = [
  { emoji: '🎣', title: 'Phishing & Scam Emails',    slug: 'phishing-emails',    desc: 'Identify deceptive messages designed to steal your credentials.' },
  { emoji: '🧱', title: 'Ransomware',                slug: 'ransomware',          desc: 'Stop extortion attacks before they encrypt your files.' },
  { emoji: '🎭', title: 'Deepfake & AI Fraud',       slug: 'deepfake',            desc: 'Detect manipulated video, audio, and identity impersonation.' },
  { emoji: '🪪', title: 'Identity Theft',            slug: 'identity-theft',      desc: 'Secure your accounts and detect fraudulent activity early.' },
  { emoji: '🧬', title: 'Malware & Spyware',         slug: 'malware',             desc: 'Prevent infection and stop malicious software at the source.' },
  { emoji: '📡', title: 'Business Email Compromise', slug: 'bec',                 desc: 'Recognise impersonation attacks targeting your organisation.' },
]

/* ── Why choose us ── */
const WHY_ITEMS = [
  { icon: '✅', title: 'Intelligence-Backed Guidance', desc: 'Actionable steps built on real cybercrime patterns and government-grade frameworks.' },
  { icon: '🧠', title: 'Education That Sticks',        desc: 'Interactive scenarios and prevention tips that build lasting security habits.' },
  { icon: '🧩', title: 'Structured Recovery Workflows', desc: 'Clear, step-by-step incident reporting and recovery guidance when you need it most.' },
]

/* ── Detection process ── */
const PROCESS = [
  { n: 1, title: 'Observe Anomalies',   desc: 'Identify suspicious patterns in messages, devices, or account behaviour.', active: true },
  { n: 2, title: 'Validate Indicators', desc: 'Use safe verification methods to confirm the threat and prevent further spread.' },
  { n: 3, title: 'Contain & Report',    desc: 'Follow guided recovery steps and submit a secure incident report.' },
]

const AGENCIES = [
  { name: 'Federal Trade Commission',                       abbr: 'FTC',      img: agencyFtc },
  { name: 'US Postal Inspection Service',                   abbr: 'USPS',     img: agencyUsps },
  { name: 'INTERPOL',                                       abbr: 'INTERPOL', img: agencyInterpol },
  { name: 'Cybersecurity & Infrastructure Security Agency', abbr: 'CISA',     img: agencyCisa },
  { name: 'Dept. of Homeland Security',                     abbr: 'DHS',      img: agencyDhs },
  { name: 'FBI / Dept. of Justice',                         abbr: 'FBI',      img: agencyFbi },
  { name: 'US Secret Service',                              abbr: 'USSS',     img: agencySecretService },
  { name: 'Internal Revenue Service',                       abbr: 'IRS',      img: agencyIrs },
]

export default function Home() {
  const statsRef = useRef(null)
  const [statsVisible, setStatsVisible] = useState(false)
  const [muted, setMuted] = useState(true)

  /* Intersection observer to trigger counters when stats scroll into view */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true) },
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  const threats  = useCounter(2400, 1400, statsVisible)
  const reports  = useCounter(850,  1200, statsVisible)
  const recovery = useCounter(97,   1000, statsVisible)

  return (
    <>
  
      <header className="hero position-relative overflow-hidden">

        {/* Full-width video background */}
        <div className="hero-media" aria-hidden="true">
          <video
            className="hero-media-video"
            src={heroVideo}
            autoPlay
            muted={muted}
            loop
            playsInline
            preload="auto"
            poster = {heroImage}
          />
          {/* Dark overlay so text stays readable */}
          <div className="hero-media-overlay" />
        </div>

        <div className="cyber-grid" aria-hidden="true" />

        <div className="container hero-content section-pad-lg">
          <div className="row align-items-center g-5 min-vh-hero">

            {/* Left — all text content */}
            <div className="col-12 col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-4"
                style={{ border: '1px solid rgba(120,214,255,0.25)', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)' }}>
                <span className="pill low" style={{ padding: '0.2rem 0.55rem' }}>
                  <span className="dot" />
                  <span className="fw-bold" style={{ fontSize: '0.68rem' }}>LIVE INTELLIGENCE</span>
                </span>
                <span className="text-muted-cyber small">Real-time threat detection · Secure reporting</span>
              </div>

              <h1 className="glow-text mb-3">
                Protecting Individuals &amp; Organizations Against Modern Cyber Threats
              </h1>

              <p className="mb-4" style={{ color: 'rgba(233,243,255,0.88)', fontSize: 'clamp(1rem,1.2vw,1.1rem)', maxWidth: '58ch' }}>
                The Watch Eyes delivers intelligence-backed cybersecurity guidance —
                helping you identify scams, report incidents, and recover with confidence.
              </p>

              <div className="d-flex flex-column flex-sm-row gap-2 flex-wrap">
                <Link className="btn btn-alert" to="/report">
                  <i className="bi bi-exclamation-triangle me-2" />Report an Incident
                </Link>
                <Link className="btn btn-cyber" to="/report" state={{ scrollTo: 'recover' }}>
                  <i className="bi bi-shield-check me-2" />Recover Now
                </Link>
                <Link className="btn btn-outline-cyber" to="/threats">
                  Explore Threats
                </Link>
              </div>

              <div className="d-flex align-items-center gap-3 mt-4 pt-3"
                style={{ borderTop: '1px solid rgba(120,214,255,0.15)' }}>
                <span className="pill mid">
                  <span className="dot" /><span className="fw-bold" style={{ fontSize: '0.7rem' }}>MONITORING</span>
                </span>
                <div className="scan-bar flex-grow-1"><span /></div>
                <span className="text-muted-cyber small" style={{ whiteSpace: 'nowrap' }}>Threat level: Elevated</span>
              </div>
            </div>

            {/* Right — threat level panel */}
            <div className="col-12 col-lg-5">
              <div className="banner p-4" style={{ backdropFilter: 'blur(16px)', background: 'rgba(7,17,38,0.75)' }}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <div className="text-muted-cyber small mb-1">Current Threat Level</div>
                    <div className="fw-bold fs-4 glow-text">Elevated</div>
                  </div>
                  <span className="pill mid">
                    <span className="dot" /><span className="fw-bold" style={{ fontSize: '0.72rem' }}>MONITORING</span>
                  </span>
                </div>
                <div className="scan-bar mb-2"><span /></div>
                <div className="text-muted-cyber small mb-4">Continuously scanning for active threat signals</div>
                <div className="d-flex align-items-start gap-3 mb-3">
                  <div className="icon-box">🛡️</div>
                  <div>
                    <div className="fw-bold">Instant Guidance Available</div>
                    <div className="text-muted-cyber small">Browse our threat library and take the Spot-a-Scam quiz.</div>
                  </div>
                </div>
                <div className="d-grid gap-2">
                  <Link className="btn btn-cyber" to="/threats">Explore Threat Library</Link>
                  <Link className="btn btn-outline-cyber" to="/report">Submit a Secure Report</Link>
                </div>

                {/* Unmute button */}
                <button
                  className="hero-video-unmute"
                  onClick={() => setMuted(p => !p)}
                  aria-label="Toggle video sound"
                  title={muted ? 'Unmute video' : 'Mute video'}
                >
                  <i className={`bi ${muted ? 'bi-volume-mute-fill' : 'bi-volume-up-fill'}`}></i>
                </button>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════
          STATS SECTION
          ════════════════════════════════════════ */}
      <section className="section-pad" style={{ background: 'rgba(5,9,19,0.6)', borderBottom: '1px solid rgba(120,214,255,0.1)' }} ref={statsRef}>
        <div className="container">
          <div className="row g-3 text-center">
            <div className="col-12 col-md-4">
              <div className="stat">
                <div className="value">{threats.toLocaleString()}+</div>
                <div className="text-muted-cyber small mt-1">Threat scenarios documented</div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="stat">
                <div className="value">{reports.toLocaleString()}+</div>
                <div className="text-muted-cyber small mt-1">Incidents reported through WHTS</div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="stat">
                <div className="value">{recovery}%</div>
                <div className="text-muted-cyber small mt-1">Guided recovery success rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURED THREAT CATEGORIES
          ════════════════════════════════════════ */}
      <section className="section-pad-lg">
        <div className="container">
          <div className="d-flex align-items-end justify-content-between gap-3 mb-4">
            <div>
              <div className="section-label mb-2">Threat Library</div>
              <h2 className="fw-bold mb-1">Featured Threat Categories</h2>
              <p className="text-muted-cyber mb-0">Know what you're up against. Click any category to learn more.</p>
            </div>
            <Link className="btn btn-outline-cyber d-none d-md-inline-flex" to="/threats">
              Browse all threats
            </Link>
          </div>

          <div className="row g-3">
            {THREAT_CATS.map(cat => (
              <div key={cat.slug} className="col-12 col-md-6 col-lg-4">
                <Link to={`/threats/${cat.slug}`} className="text-decoration-none d-block h-100">
                  <div className="card-glass card-hover p-3 h-100">
                    <div className="d-flex align-items-start gap-3">
                      <div className="icon-box">{cat.emoji}</div>
                      <div>
                        <div className="fw-bold text-white mb-1">{cat.title}</div>
                        <div className="text-muted-cyber small">{cat.desc}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-4 d-md-none">
            <Link className="btn btn-outline-cyber" to="/threats">Browse all threats</Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          WHY CHOOSE US + DETECTION PROCESS
          ════════════════════════════════════════ */}
      <section className="section-pad" style={{ background: 'rgba(5,9,19,0.5)' }}>
        <div className="container">
          <div className="row g-4">

            {/* Why choose us */}
            <div className="col-12 col-lg-6">
              <div className="banner p-4 h-100">
                <div className="section-label mb-2">Why WHTS</div>
                <h2 className="fw-bold mb-2">Built for Real-World Action</h2>
                <p className="text-muted-cyber mb-4">Trust-focused cybersecurity guidance for individuals, businesses, and organisations.</p>
                <div className="d-flex flex-column gap-3">
                  {WHY_ITEMS.map(item => (
                    <div key={item.title} className="d-flex gap-3">
                      <div className="icon-box">{item.icon}</div>
                      <div>
                        <div className="fw-bold">{item.title}</div>
                        <div className="text-muted-cyber small">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detection process */}
            <div className="col-12 col-lg-6">
              <div className="banner p-4 h-100">
                <div className="section-label mb-2">Our Process</div>
                <h2 className="fw-bold mb-2">Threat Detection Process</h2>
                <p className="text-muted-cyber mb-4">A structured path from spotting a threat to full recovery.</p>
                <div className="timeline">
                  {PROCESS.map(step => (
                    <div key={step.n} className={`t-item ${step.active ? 'active' : ''}`}>
                      <div className="t-marker">{step.n}</div>
                      <div>
                        <div className="fw-bold">{step.title}</div>
                        <div className="text-muted-cyber small">{step.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          AFFILIATED AGENCIES SECTION
          ════════════════════════════════════════ */}
      <section className="section-pad-lg" id="agencies" style={{ background: 'rgba(5,9,19,0.5)' }}>
        <div className="container">

          <div className="text-center mb-5">
            <div className="section-label mb-2">Government Aligned</div>
            <h2 className="fw-bold mb-2">Affiliated Agencies & Partners</h2>
            <p className="text-muted-cyber mx-auto" style={{ maxWidth: '56ch' }}>
              WHTSIPA operates in alignment with these government agencies and international
              law enforcement bodies. Valid reports are shared with relevant authorities.
            </p>
          </div>

          {/* ── Infinite scrolling logo carousel ── */}
          <div className="agency-marquee-wrap mb-5">
            <div className="agency-marquee-track">
              {/* Duplicate the list so the loop is seamless */}
              {[...AGENCIES, ...AGENCIES].map((agency, i) => (
                <div key={i} className="agency-marquee-item">
                  <img src={agency.img} alt={agency.name} />
                </div>
              ))}
            </div>
          </div>

          {/* Link to full officials page */}
          <div className="text-center">
            <Link className="btn btn-outline-cyber" to="/about-officials">
              <i className="bi bi-people me-2"></i>View All Affiliated Agencies
            </Link>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════
          FINAL CTA BANNER
          ════════════════════════════════════════ */}
      <section className="section-pad-lg">
        <div className="container">
          <div className="banner p-5 text-center">
            <div className="section-label mb-3">Take Action Now</div>
            <h2 className="fw-bold glow-text mb-3">Don't Wait Until It's Too Late</h2>
            <p className="text-muted-cyber mb-4 mx-auto" style={{ maxWidth: '52ch' }}>
              Whether you've spotted a scam, experienced a breach, or want to stay protected —
              WHTS is here to guide you every step of the way.
            </p>
            <div className="d-flex justify-content-center flex-wrap gap-3">
              <Link className="btn btn-alert" to="/report">
                <i className="bi bi-exclamation-triangle me-2" />
                Report an Incident
              </Link>
              <Link className="btn btn-cyber" to="/threats">
                <i className="bi bi-book me-2" />
                Explore Threat Library
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}