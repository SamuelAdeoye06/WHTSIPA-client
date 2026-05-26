import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/cyber.css'
import './EssentialEight.css'

const STRATEGIES = [
  {
    number: '01',
    title: 'Patch Applications',
    icon: '🔧',
    risk: 'Extreme',
    color: 'var(--red)',
    summary: 'Keep all applications patched and up to date.',
    detail: `Security vulnerabilities in applications like browsers, PDF readers, and Office suites
    are actively exploited by attackers. Patching these applications within 48 hours of a critical
    patch release (or two weeks for non-critical) significantly reduces your attack surface.
    Automated patch management tools make this manageable at scale.`,
    actions: [
      'Enable automatic updates on all applications',
      'Prioritize patches rated Critical or High first',
      'Audit installed software monthly — remove unused applications',
      'Use vulnerability scanning tools to identify unpatched software',
    ],
  },
  {
    number: '02',
    title: 'Patch Operating Systems',
    icon: '💻',
    risk: 'Extreme',
    color: 'var(--red)',
    summary: 'Keep operating systems patched against known vulnerabilities.',
    detail: `Unpatched operating systems are one of the most exploited entry points in cybercrime.
    OS patches address vulnerabilities that attackers use to gain initial access, escalate
    privileges, and move laterally. Critical patches should be applied within 48 hours
    of release across all devices including servers, workstations, and mobile devices.`,
    actions: [
      'Enable Windows Update / macOS Software Update on all devices',
      'Patch internet-facing systems within 48 hours of critical releases',
      'Replace end-of-life operating systems that no longer receive patches',
      'Maintain an asset inventory so no device is missed',
    ],
  },
  {
    number: '03',
    title: 'Multi-Factor Authentication',
    icon: '🔐',
    risk: 'Essential',
    color: 'var(--cyan)',
    summary: 'Require MFA for all users on all services — especially remote access.',
    detail: `Multi-Factor Authentication (MFA) prevents attackers from accessing accounts even
    when passwords are stolen. It is one of the highest-impact controls available. MFA should
    be enforced on all remote access services, cloud platforms, email, and any system storing
    sensitive data. Authenticator apps are stronger than SMS-based MFA.`,
    actions: [
      'Enable MFA on all cloud services, email, and remote access',
      'Use authenticator apps (Google Authenticator, Authy) over SMS',
      'Enforce MFA for all admin and privileged accounts without exception',
      'Monitor and alert on MFA bypass attempts',
    ],
  },
  {
    number: '04',
    title: 'Restrict Admin Privileges',
    icon: '🛡️',
    risk: 'Essential',
    color: 'var(--cyan)',
    summary: 'Limit who has administrative access — and when they use it.',
    detail: `Administrative accounts are the most valuable target for attackers. Restricting
    admin privileges means attackers who compromise a standard user account gain limited access.
    Admins should use separate accounts for administrative tasks and standard accounts for
    everyday work. Privileged access should be time-limited and audited.`,
    actions: [
      'Audit all admin accounts — remove unnecessary privileges immediately',
      'Use separate admin and standard accounts for all staff',
      'Implement just-in-time privileged access management',
      'Log and review all privileged account activity',
    ],
  },
  {
    number: '05',
    title: 'Application Control',
    icon: '⚙️',
    risk: 'Essential',
    color: 'var(--cyan)',
    summary: 'Only allow approved, trusted applications to run.',
    detail: `Application control prevents malicious software from executing on your systems —
    even if it is downloaded or delivered through phishing. By maintaining an allowlist of
    approved applications, you prevent attackers from running unauthorised executables,
    scripts, and malware. This is one of the most effective controls against ransomware.`,
    actions: [
      'Implement application allowlisting on all workstations',
      'Block execution from user-writable folders like Downloads and Temp',
      'Use Windows Defender Application Control or AppLocker',
      'Review and update the allowlist whenever new software is approved',
    ],
  },
  {
    number: '06',
    title: 'Restrict Microsoft Office Macros',
    icon: '📄',
    risk: 'High',
    color: 'var(--yellow)',
    summary: 'Block or restrict Office macros — a top malware delivery vector.',
    detail: `Microsoft Office macros are one of the most common ways malware and ransomware
    are delivered via email attachments. Macros should be disabled by default and only
    enabled for specific, trusted files from known locations. Macros from the internet
    should never be enabled under any circumstances.`,
    actions: [
      'Disable all macros from internet-sourced files via Group Policy',
      'Allow macros only from trusted, digitally signed sources',
      'Block macro execution entirely for users who don\'t need them',
      'Train staff to never enable macros in unexpected email attachments',
    ],
  },
  {
    number: '07',
    title: 'User Application Hardening',
    icon: '🌐',
    risk: 'High',
    color: 'var(--yellow)',
    summary: 'Configure web browsers and applications to reduce attack surface.',
    detail: `Web browsers are the primary gateway for most attacks. Hardening browser and
    application settings — disabling Flash, blocking ads, enabling sandboxing, and
    restricting web content — significantly reduces exposure. Users should also be
    restricted from installing unapproved browser extensions.`,
    actions: [
      'Disable Flash, Java, and other legacy browser plugins',
      'Block ads and malicious content with approved browser extensions',
      'Enable browser sandboxing and Safe Browsing features',
      'Restrict installation of unapproved extensions and plugins',
    ],
  },
  {
    number: '08',
    title: 'Regular Backups',
    icon: '💾',
    risk: 'Essential',
    color: 'var(--green)',
    summary: 'Back up data regularly and test restoration — especially against ransomware.',
    detail: `Regular, tested backups are your last line of defence against ransomware and
    data loss. Backups must be stored offline or in immutable cloud storage — attackers
    actively target and delete backups before deploying ransomware. The 3-2-1 rule:
    3 copies, 2 different media types, 1 offsite or offline.`,
    actions: [
      'Follow the 3-2-1 backup rule for all critical data',
      'Store at least one backup offline or in immutable storage',
      'Test backup restoration quarterly — untested backups may be corrupt',
      'Ensure backups are not accessible from the production network',
    ],
  },
]

export default function EssentialEight() {
  const [expanded, setExpanded] = useState(null)

  return (
    <>
      {/* ── Hero ── */}
      <header className="e8-hero">
        <div className="cyber-grid" aria-hidden="true" />
        <div className="container position-relative" style={{ zIndex: 2, paddingTop: '4rem', paddingBottom: '4rem' }}>
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-7">
              <div className="section-label mb-2">Cybersecurity Framework</div>
              <h1 className="glow-text fw-bold mb-3">The Essential Eight</h1>
              <p className="text-muted-cyber mb-4" style={{ maxWidth: '58ch', fontSize: '1.05rem' }}>
                The Essential Eight are eight baseline mitigation strategies developed to
                make it significantly harder for adversaries to compromise systems. WHTS
                recommends all individuals and organisations implement these controls.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link className="btn btn-cyber" to="/threats">
                  <i className="bi bi-shield me-2"></i>Explore Threats
                </Link>
                <Link className="btn btn-alert" to="/report">
                  <i className="bi bi-exclamation-triangle me-2"></i>Report an Incident
                </Link>
              </div>
            </div>
            <div className="col-12 col-lg-5">
              <div className="banner p-4">
                <div className="section-label mb-2">Why This Matters</div>
                <h3 className="fw-bold mb-3">Baseline Protection for Everyone</h3>
                <p className="text-muted-cyber small mb-3">
                  This baseline makes it much harder for adversaries to compromise systems.
                  Implementing all eight significantly reduces the risk of the most common
                  attack vectors used against individuals, businesses, and government systems.
                </p>
                <div className="scan-bar"><span /></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Strategies grid ── */}
      <section className="section-pad-lg">
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-label mb-2">The Eight Strategies</div>
            <h2 className="fw-bold mb-2">Click Any Strategy to Expand</h2>
            <p className="text-muted-cyber mx-auto" style={{ maxWidth: '52ch' }}>
              Each strategy addresses a specific attack vector. Together they form a
              comprehensive baseline that stops the majority of cyber attacks.
            </p>
          </div>

          <div className="row g-3">
            {STRATEGIES.map((s) => (
              <div key={s.number} className="col-12 col-md-6 col-lg-6">
                <div
                  className={`e8-card ${expanded === s.number ? 'e8-card--open' : ''}`}
                  onClick={() => setExpanded(expanded === s.number ? null : s.number)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setExpanded(expanded === s.number ? null : s.number)}
                >
                  {/* Card header */}
                  <div className="e8-card-header">
                    <div className="d-flex align-items-center gap-3">
                      <div className="e8-number" style={{ color: s.color }}>{s.number}</div>
                      <div className="e8-icon">{s.icon}</div>
                      <div>
                        <div className="fw-bold text-white">{s.title}</div>
                        <div className="text-muted-cyber small">{s.summary}</div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2 flex-shrink-0 ms-3">
                      <span className="e8-risk-badge" style={{ borderColor: s.color, color: s.color }}>
                        {s.risk}
                      </span>
                      <i className={`bi bi-chevron-down e8-chevron ${expanded === s.number ? 'e8-chevron--open' : ''}`}></i>
                    </div>
                  </div>

                  {/* Expanded content */}
                  {expanded === s.number && (
                    <div className="e8-card-body">
                      <p className="text-muted-cyber small mb-3">{s.detail}</p>
                      <div className="fw-bold small mb-2" style={{ color: s.color }}>
                        <i className="bi bi-check2-circle me-2"></i>Action Steps
                      </div>
                      <ul className="e8-actions">
                        {s.actions.map((a, i) => (
                          <li key={i} className="e8-action-item">
                            <i className="bi bi-arrow-right-short" style={{ color: s.color, flexShrink: 0 }}></i>
                            <span className="small">{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tools CTA ── */}
      <section className="section-pad" style={{ background: 'rgba(5,9,19,0.55)' }}>
        <div className="container">
          <div className="banner p-4 p-md-5 text-center">
            <div className="section-label mb-3">WHTS Tools</div>
            <h2 className="fw-bold glow-text mb-3">Get the Right Tools</h2>
            <p className="text-muted-cyber mb-4 mx-auto" style={{ maxWidth: '52ch' }}>
              WHTSIPA provides tools aligned with every Essential Eight strategy —
              from patch management and MFA to EDR, backup solutions, and more.
              Contact our team for guidance on the right tools for your situation.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link className="btn btn-cyber" to="/contact">
                <i className="bi bi-headset me-2"></i>Talk to Our Team
              </Link>
              <Link className="btn btn-outline-cyber" to="/threats">
                <i className="bi bi-grid me-2"></i>Browse Threat Library
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}