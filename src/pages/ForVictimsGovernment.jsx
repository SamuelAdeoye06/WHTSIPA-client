import { Link } from 'react-router-dom'
import '../styles/cyber.css'
import './ForVictimsGovernment.css'

const VICTIM_STEPS = [
  { icon: '🛑', title: 'Stop All Communication', desc: 'Immediately cease all contact with the scammer. Do not respond, pay, or negotiate. Every response gives them more leverage.' },
  { icon: '📸', title: 'Document Everything', desc: 'Screenshot all messages, emails, transaction records, and profile details before blocking. This evidence is critical for investigation.' },
  { icon: '🔒', title: 'Secure Your Accounts', desc: 'Change all passwords, enable MFA on every account, and revoke any access you may have granted. Start with email — it unlocks everything else.' },
  { icon: '📋', title: 'Report to Authorities', desc: 'File a report with WHTS, the FBI IC3, FTC, and your local law enforcement. The more details you provide, the stronger the case.' },
  { icon: '🤝', title: 'Seek Support', desc: 'Being scammed is traumatic. Reach out to trusted friends, family, or a counselor. You are not alone and it is not your fault.' },
  { icon: '📞', title: 'Contact WHTS', desc: 'Our Active Representatives are experienced in victim recovery. We help guide you through every step and connect you with the right authorities.' },
]

const VICTIM_TYPES = [
  { emoji: '💔', label: 'Romance Scam Victims' },
  { emoji: '💼', label: 'Job Scam Victims' },
  { emoji: '🪪', label: 'Identity Theft Victims' },
  { emoji: '⛓️', label: 'Crypto Drainer Victims' },
  { emoji: '📱', label: 'Account Hack Victims' },
  { emoji: '🧾', label: 'Tax Fraud Victims' },
  { emoji: '📨', label: 'BEC / Wire Fraud Victims' },
  { emoji: '🧬', label: 'Malware / Ransomware Victims' },
]

const GOV_SERVICES = [
  {
    icon: '📊',
    title: 'Reports & Statistics',
    desc: 'Access compiled cybercrime reports, incident statistics, and threat intelligence summaries aligned with government reporting standards for policy and research use.',
  },
  {
    icon: '📡',
    title: 'Alerts & Advisories',
    desc: 'Receive timely cybersecurity alerts and threat advisories relevant to government and public sector infrastructure, aligned with CISA and DHS frameworks.',
  },
  {
    icon: '🗂️',
    title: 'Data Sharing',
    desc: 'WHTS participates in responsible data sharing with affiliated law enforcement agencies — every valid report contributes to official cybercrime databases.',
  },
  {
    icon: '🏛️',
    title: 'News & Media',
    desc: 'Official statements, press releases, and media resources from WHTSIPA and ACSW available for government agencies and news organisations.',
  },
  {
    icon: '🎓',
    title: 'Training Programs',
    desc: 'Cybersecurity awareness and threat intelligence training resources developed in alignment with government security frameworks for public sector staff.',
  },
  {
    icon: '🚨',
    title: 'Rapid Response',
    desc: 'Coordinated rapid response support for government-level cybersecurity incidents — working alongside official channels to contain and investigate threats.',
  },
]

export default function ForVictimsGovernment() {
  return (
    <>
      {/* ── Hero ── */}
      <header className="fvg-hero">
        <div className="cyber-grid" aria-hidden="true" />
        <div className="container position-relative" style={{ zIndex: 2, paddingTop: '4rem', paddingBottom: '4rem' }}>
          <div className="text-center">
            <div className="section-label mb-2">Who We Serve</div>
            <h1 className="glow-text fw-bold mb-3">For Victims &amp; Government</h1>
            <p className="text-muted-cyber mx-auto mb-5" style={{ maxWidth: '58ch', fontSize: '1.05rem' }}>
              WHTSIPA serves two critical audiences — individuals and families affected by
              cybercrime, and government agencies and organisations working to combat it.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <a className="btn btn-alert" href="#victims">
                <i className="bi bi-heart me-2"></i>I'm a Victim — Help Me
              </a>
              <a className="btn btn-cyber" href="#government">
                <i className="bi bi-building me-2"></i>Government &amp; Organisations
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ════════════════ VICTIMS SECTION ════════════════ */}
      <section className="section-pad-lg" id="victims">
        <div className="container">
          <div className="row g-5 align-items-start">
            <div className="col-12 col-lg-5">
              <div className="section-label mb-2">For Individuals &amp; Families</div>
              <h2 className="fw-bold mb-3">You've Been Scammed.<br />Here's What to Do.</h2>
              <p className="text-muted-cyber mb-4">
                Being targeted by a cybercriminal is frightening and disorienting.
                WHTS provides clear, step-by-step guidance to help you stop the damage,
                recover your accounts, and report to the right authorities.
              </p>

              {/* Victim types */}
              <div className="fw-bold small mb-3" style={{ color: 'var(--cyan)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                We Support
              </div>
              <div className="d-flex flex-wrap gap-2 mb-4">
                {VICTIM_TYPES.map(v => (
                  <span key={v.label} className="pill" style={{ fontSize: '0.75rem' }}>
                    <span className="me-1">{v.emoji}</span>{v.label}
                  </span>
                ))}
              </div>

              <Link className="btn btn-alert" to="/report">
                <i className="bi bi-exclamation-triangle me-2"></i>Get Help Now
              </Link>
            </div>

            <div className="col-12 col-lg-7">
              <div className="fw-bold mb-3 small" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(233,243,255,0.55)' }}>
                Immediate Action Steps
              </div>
              <div className="timeline">
                {VICTIM_STEPS.map((step, i) => (
                  <div key={i} className="t-item">
                    <div className="t-marker" style={{ fontSize: '1rem', width: 36, height: 36 }}>{step.icon}</div>
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
      </section>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: 'rgba(120,214,255,0.1)', margin: '0' }} />

      {/* ════════════════ GOVERNMENT SECTION ════════════════ */}
      <section className="section-pad-lg fvg-gov-section" id="government">
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-label mb-2">For Government &amp; Organisations</div>
            <h2 className="fw-bold mb-2">Authorised by the United States Government</h2>
            <p className="text-muted-cyber mx-auto" style={{ maxWidth: '58ch' }}>
              WHTSIPA operates under alignment with US Government cybersecurity frameworks.
              We provide intelligence, reporting, and coordination services for public sector
              agencies, law enforcement partners, and registered organisations.
            </p>
          </div>

          <div className="row g-4 mb-5">
            {GOV_SERVICES.map(service => (
              <div key={service.title} className="col-12 col-md-6 col-lg-4">
                <div className="card-glass card-hover p-4 h-100">
                  <div className="icon-box mb-3">{service.icon}</div>
                  <div className="fw-bold mb-2">{service.title}</div>
                  <div className="text-muted-cyber small">{service.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Government CTA */}
          <div className="banner p-4 p-md-5">
            <div className="row align-items-center g-4">
              <div className="col-12 col-lg-8">
                <div className="section-label mb-2">Partnership</div>
                <h3 className="fw-bold mb-2">Work With WHTSIPA</h3>
                <p className="text-muted-cyber mb-0">
                  Government agencies, law enforcement bodies, and registered organisations
                  can contact WHTS to establish formal data sharing, reporting partnerships,
                  or collaborative cybercrime investigation support.
                </p>
              </div>
              <div className="col-12 col-lg-4 d-flex flex-column gap-2">
                <Link className="btn btn-cyber" to="/contact">
                  <i className="bi bi-building me-2"></i>Contact Us
                </Link>
                <Link className="btn btn-outline-cyber" to="/about-officials">
                  <i className="bi bi-people me-2"></i>View Our Officials
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}