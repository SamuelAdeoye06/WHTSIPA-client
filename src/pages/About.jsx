import { Link } from 'react-router-dom'
import '../styles/cyber.css'
import './About.css'

const TIMELINE = [
  { year: '2018', title: 'WHTSIPA Founded', desc: 'The Watch Eyes organisation was established to track and expose cybercriminals targeting individuals and businesses.' },
  { year: '2019', title: 'ACSW Partnership', desc: 'America Cyber Security World formally partnered with WHTSIPA, expanding reach across federal and international frameworks.' },
  { year: '2021', title: 'IC3 Integration', desc: 'Reports submitted through WHTS became eligible for escalation to the FBI\'s Internet Crime Complaint Center.' },
  { year: '2022', title: 'Research Published', desc: 'WHTSIPA published landmark research on ransomware impact, referenced by multiple government cybersecurity agencies.' },
  { year: '2024', title: 'Platform Launched', desc: 'The public-facing intelligence platform launched — giving individuals direct access to threat education and incident reporting.' },
  { year: '2026', title: 'Global Expansion', desc: 'Operations expanded to support victims across 40+ countries with multilingual reporting and recovery guidance.' },
]

const PILLARS = [
  { icon: '🔍', title: 'Track', desc: 'We track scammers, cybercriminals, and threat actors using intelligence methods aligned with government law enforcement frameworks.' },
  { icon: '📢', title: 'Expose', desc: 'We expose fraudulent operations through coordinated reporting with INTERPOL, FBI, IRS, and other affiliated agencies.' },
  { icon: '🛡️', title: 'Protect', desc: 'We protect individuals and organizations with real-time threat intelligence, education, and guided recovery workflows.' },
  { icon: '⚖️', title: 'Pursue', desc: 'We pursue accountability — every valid report contributes to ongoing investigations and official cybercrime records.' },
]

export default function About() {
  return (
    <>
      {/* ── Hero ── */}
      <header className="about-hero">
        <div className="cyber-grid" aria-hidden="true" />
        <div className="container position-relative" style={{ zIndex: 2, paddingTop: '4rem', paddingBottom: '4rem' }}>
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-7">
              <div className="section-label mb-2">About WHTSIPA</div>
              <h1 className="glow-text fw-bold mb-3">
                We Help Track Scammers.<br />We Help Protect People.
              </h1>
              <p className="text-muted-cyber mb-4" style={{ maxWidth: '56ch', fontSize: '1.05rem' }}>
                WHTSIPA — The Watch Eyes — is a certified cybersecurity intelligence organisation
                operating in alignment with US government agencies and international law enforcement
                to track, expose, and dismantle cybercriminal networks.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link className="btn btn-cyber" to="/about-officials">
                  <i className="bi bi-people me-2"></i>Meet the Officials
                </Link>
                <Link className="btn btn-outline-cyber" to="/report">
                  <i className="bi bi-send me-2"></i>Submit a Report
                </Link>
              </div>
            </div>
            <div className="col-12 col-lg-5">
              <div className="banner p-4">
                <div className="section-label mb-2">Our Mission</div>
                <h3 className="fw-bold mb-3">Don't Get Caught.</h3>
                <p className="text-muted-cyber small mb-4">
                  Our motto isn't just a warning — it's a commitment. We arm individuals and
                  organizations with the intelligence they need to stay one step ahead of every threat.
                </p>
                <div className="scan-bar mb-2"><span /></div>
                <div className="text-muted-cyber small">
                  Operated under the banner of America Cyber Security World (ACSW) ·
                  Aligned with WeHelpTrackScammersIpAddress.com
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Four pillars ── */}
      <section className="section-pad-lg">
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-label mb-2">What We Do</div>
            <h2 className="fw-bold mb-2">Four Pillars of Operation</h2>
            <p className="text-muted-cyber mx-auto" style={{ maxWidth: '52ch' }}>
              Every action WHTSIPA takes is built on these four core operational principles.
            </p>
          </div>
          <div className="row g-4">
            {PILLARS.map(p => (
              <div key={p.title} className="col-12 col-md-6 col-lg-3">
                <div className="card-glass card-hover p-4 h-100 text-center">
                  <div className="about-pillar-icon">{p.icon}</div>
                  <div className="fw-bold fs-5 mb-2">{p.title}</div>
                  <div className="text-muted-cyber small">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="section-pad" style={{ background: 'rgba(5,9,19,0.55)' }}>
        <div className="container">
          <div className="section-label mb-2">History</div>
          <h2 className="fw-bold mb-5">Our Journey</h2>
          <div className="about-timeline">
            {TIMELINE.map((item, i) => (
              <div key={item.year} className={`about-timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}>
                <div className="about-timeline-year">{item.year}</div>
                <div className="about-timeline-card card-glass p-4">
                  <div className="fw-bold mb-1">{item.title}</div>
                  <div className="text-muted-cyber small">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Affiliation statement ── */}
      <section className="section-pad-lg">
        <div className="container">
          <div className="banner p-4 p-md-5">
            <div className="row align-items-center g-4">
              <div className="col-12 col-lg-8">
                <div className="section-label mb-2">Government Aligned</div>
                <h2 className="fw-bold mb-3">Certified. Aligned. Accountable.</h2>
                <p className="text-muted-cyber mb-3">
                  WHTSIPA operates as a certified organisation recognised under American Government
                  cybersecurity frameworks. All valid incident reports submitted through our platform
                  are eligible for escalation to the FBI Internet Crime Complaint Center (IC3),
                  INTERPOL, IRS Criminal Investigation, and other affiliated agencies.
                </p>
                <p className="text-muted-cyber mb-0 small">
                  We do not operate as a replacement for law enforcement — we operate alongside it.
                </p>
              </div>
              <div className="col-12 col-lg-4 text-lg-end">
                <Link className="btn btn-alert mb-2 w-100" to="/report">
                  <i className="bi bi-exclamation-triangle me-2"></i>Report an Incident
                </Link>
                <Link className="btn btn-outline-cyber w-100" to="/about-officials">
                  <i className="bi bi-people me-2"></i>Meet the Officials
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}