import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import '../styles/cyber.css'
import './EssentialEight.css'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

/* ─────────────────────────────────────────────
   Fallback shown while the backend number loads.
   The real number is fetched from /api/booking/callback-number
   and is editable by admin via PUT /api/booking/callback-number.
───────────────────────────────────────────── */
const CALLBACK_NUMBER_FALLBACK = '+1 (650) 221-7654'

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

/* ── Countries with dial codes — kept in sync with SignUp/Report ── */
const ALLOWED_COUNTRIES = [
  { code: 'US', name: 'United States',          dial: '+1'   },
  { code: 'CA', name: 'Canada',                 dial: '+1'   },
  { code: 'GB', name: 'United Kingdom',         dial: '+44'  },
  { code: 'AU', name: 'Australia',              dial: '+61'  },
  { code: 'NZ', name: 'New Zealand',            dial: '+64'  },
  { code: 'DE', name: 'Germany',                dial: '+49'  },
  { code: 'FR', name: 'France',                 dial: '+33'  },
  { code: 'NL', name: 'Netherlands',            dial: '+31'  },
  { code: 'SE', name: 'Sweden',                 dial: '+46'  },
  { code: 'NO', name: 'Norway',                 dial: '+47'  },
  { code: 'DK', name: 'Denmark',                dial: '+45'  },
  { code: 'FI', name: 'Finland',                dial: '+358' },
  { code: 'CH', name: 'Switzerland',            dial: '+41'  },
  { code: 'SG', name: 'Singapore',              dial: '+65'  },
  { code: 'JP', name: 'Japan',                  dial: '+81'  },
  { code: 'KR', name: 'South Korea',            dial: '+82'  },
  { code: 'AE', name: 'United Arab Emirates',   dial: '+971' },
  { code: 'QA', name: 'Qatar',                  dial: '+974' },
  { code: 'IL', name: 'Israel',                 dial: '+972' },
  { code: 'AT', name: 'Austria',                dial: '+43'  },
  { code: 'BE', name: 'Belgium',                dial: '+32'  },
  { code: 'IT', name: 'Italy',                  dial: '+39'  },
  { code: 'ES', name: 'Spain',                  dial: '+34'  },
  { code: 'PL', name: 'Poland',                 dial: '+48'  },
  { code: 'PT', name: 'Portugal',               dial: '+351' },
  { code: 'IE', name: 'Ireland',                dial: '+353' },
  { code: 'GR', name: 'Greece',                 dial: '+30'  },
  { code: 'CZ', name: 'Czechia',               dial: '+420' },
  { code: 'NG', name: 'Nigeria (Dev)',          dial: '+234' },
]

/* ── Phone field with country-code dropdown — same UX as SignUp/Report,
   built for plain useState instead of Formik, and kept at module scope
   so React never remounts it (which would break input focus). ── */
function BookingPhoneField({ dialCode, setDialCode, digits, setDigits, error }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selectedCountry = ALLOWED_COUNTRIES.find(c => c.dial === dialCode) || ALLOWED_COUNTRIES[0]

  return (
    <div className="bc-field">
      <label className="bc-label" htmlFor="bc-phone">Phone Number *</label>
      <div className="phone-country-field-wrap">
        <div className="input-group" ref={dropdownRef}>
          <button
            type="button"
            className="btn phone-country-btn dropdown-toggle"
            onClick={() => setShowDropdown(p => !p)}
          >
            {selectedCountry.code} ({selectedCountry.dial})
          </button>
          <input
            id="bc-phone"
            type="tel"
            className={`form-control bc-input bc-input-phone ${error ? 'bc-input-err' : ''}`}
            placeholder="Phone number digits"
            value={digits}
            onChange={e => setDigits(e.target.value)}
          />
          {showDropdown && (
            <div className="phone-country-dropdown-menu">
              <ul className="list-unstyled mb-0">
                {ALLOWED_COUNTRIES.map(c => (
                  <li key={c.code}>
                    <button
                      type="button"
                      className="phone-country-dropdown-item"
                      onClick={() => { setDialCode(c.dial); setShowDropdown(false) }}
                    >
                      <span className="country-name">{c.name}</span>
                      <span className="country-dial">{c.dial}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      {error && <span className="bc-error"><i className="bi bi-exclamation-circle me-1"></i>{error}</span>}
    </div>
  )
}

/* ── Field wrapper — at module scope so React never remounts it on re-render ── */
function F({ id, label, error, children }) {
  return (
    <div className="bc-field">
      <label className="bc-label" htmlFor={id}>{label}</label>
      {children}
      {error && <span className="bc-error"><i className="bi bi-exclamation-circle me-1"></i>{error}</span>}
    </div>
  )
}

/* ── Book a Call Modal ── */
function BookCallModal({ onClose }) {
  const { user } = useAuth()
  const navigate  = useNavigate()

  const [step,           setStep]           = useState('form')
  const [loading,        setLoading]        = useState(false)
  const [callbackNumber, setCallbackNumber] = useState(CALLBACK_NUMBER_FALLBACK)
  const [form,           setForm]           = useState({
    name: '', email: '', dialCode: '+1', phoneDigits: '', preferredDate: '', preferredTime: '', notes: '',
  })
  const [errors, setErrors] = useState({})

  // Fetch the admin-configured callback number on mount
  useEffect(() => {
    api.get('/booking/callback-number')
      .then(({ data }) => { if (data.callbackNumber) setCallbackNumber(data.callbackNumber) })
      .catch(() => { /* keep fallback */ })
  }, [])

  /* If not signed in — show auth prompt instead of form */
  if (!user) {
    return (
      <div className="bc-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="bc-box" role="dialog" aria-modal="true">
          <button className="bc-close" onClick={onClose} aria-label="Close"><i className="bi bi-x-lg"></i></button>
          <div className="bc-auth-prompt">
            <div className="bc-auth-icon"><i className="bi bi-lock-fill"></i></div>
            <h3 className="bc-auth-title">Sign In Required</h3>
            <p className="bc-auth-text">
              You need to be signed in to book a call session with our team.
            </p>
            <button className="bc-btn-primary w-100 mb-2" onClick={() => { onClose(); navigate('/signin', { state: { from: '/essential-eight', reopenModal: 'bookCall' } }) }}>
              <i className="bi bi-box-arrow-in-right me-2"></i>Sign In
            </button>
            <button className="bc-btn-outline w-100" onClick={() => { onClose(); navigate('/signup', { state: { from: '/essential-eight', reopenModal: 'bookCall' } }) }}>
              <i className="bi bi-person-plus me-2"></i>Create Account
            </button>
          </div>
        </div>
      </div>
    )
  }

  const set = key => e => setForm(p => ({ ...p, [key]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.name.trim())          e.name          = 'Full name is required'
    if (!form.email.trim())         e.email         = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.phoneDigits.trim())         e.phoneDigits  = 'Phone number is required'
    else if (!/^[\d\s\-().]{4,15}$/.test(form.phoneDigits)) e.phoneDigits = 'Enter a valid phone number'
    if (!form.preferredDate)        e.preferredDate = 'Please select a preferred date'
    if (!form.preferredTime)        e.preferredTime = 'Please select a preferred time'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: `${form.dialCode} ${form.phoneDigits}`.trim(),
        preferredDate: form.preferredDate,
        preferredTime: form.preferredTime,
        notes: form.notes,
      }
      const { data } = await api.post('/booking/submit', payload)
      // Use the number returned from the server if available
      if (data.callbackNumber) setCallbackNumber(data.callbackNumber)
      setStep('success')
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.'
      setErrors({ submit: msg })
    } finally {
      setLoading(false)
    }
  }

  /* ── Success screen ── */
  if (step === 'success') {
    return (
      <div className="bc-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="bc-box" role="dialog" aria-modal="true">
          <button className="bc-close" onClick={onClose} aria-label="Close"><i className="bi bi-x-lg"></i></button>
          <div className="bc-success">
            <div className="bc-success-icon"><i className="bi bi-check-circle-fill"></i></div>
            <h3 className="bc-success-title">Booking Confirmed!</h3>
            <p className="bc-success-text">
              Your call session has been booked. Our team will reach out to you at the scheduled time.
            </p>
            <div className="bc-number-card">
              <div className="bc-number-label">
                <i className="bi bi-telephone-fill me-2"></i>Our Official Callback Number
              </div>
              <div className="bc-number-value">{callbackNumber}</div>
              <p className="bc-number-note">
                Please save this number. Expect a call from our specialists within 24 to 72 hours.
              </p>
            </div>
            <div className="bc-note-box">
              <i className="bi bi-info-circle me-2"></i>
              <span>
                Our call sessions are scheduled for <strong>callback only</strong> — not an immediate live call.
                Once you book, our team will reach out at the scheduled time using the number displayed above.
              </span>
            </div>
            <button className="bc-btn-primary w-100 mt-3" onClick={onClose}>Done</button>
          </div>
        </div>
      </div>
    )
  }

  /* Today's date as min for date picker */
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="bc-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bc-box" role="dialog" aria-modal="true">
        <button className="bc-close" onClick={onClose} aria-label="Close"><i className="bi bi-x-lg"></i></button>

        <div className="bc-header">
          <div className="bc-header-icon"><i className="bi bi-headset"></i></div>
          <div>
            <h3 className="bc-title">Book a Call Session</h3>
            <p className="bc-subtitle">
              When you book a call session and you're ready to speak with our team,
              simply fill in the details below.
            </p>
          </div>
        </div>

        <div className="bc-body">
          <F id="bc-name" label="Full Name *" error={errors.name}>
            <input id="bc-name" className={`bc-input ${errors.name ? 'bc-input-err' : ''}`}
              placeholder="Your full name" value={form.name} onChange={set('name')} />
          </F>

          <F id="bc-email" label="Email Address *" error={errors.email}>
            <input id="bc-email" type="email" className={`bc-input ${errors.email ? 'bc-input-err' : ''}`}
              placeholder="you@example.com" value={form.email} onChange={set('email')} />
          </F>

          <BookingPhoneField
            dialCode={form.dialCode}
            setDialCode={dc => setForm(p => ({ ...p, dialCode: dc }))}
            digits={form.phoneDigits}
            setDigits={d => setForm(p => ({ ...p, phoneDigits: d }))}
            error={errors.phoneDigits}
          />

          <div className="bc-row">
            <F id="bc-date" label="Preferred Date *" error={errors.preferredDate}>
              <input id="bc-date" type="date" min={today}
                className={`bc-input ${errors.preferredDate ? 'bc-input-err' : ''}`}
                value={form.preferredDate} onChange={set('preferredDate')} />
            </F>
            <F id="bc-time" label="Preferred Time *" error={errors.preferredTime}>
              <select id="bc-time" className={`bc-input ${errors.preferredTime ? 'bc-input-err' : ''}`}
                value={form.preferredTime} onChange={set('preferredTime')}>
                <option value="">Select time</option>
                {['09:00 AM','10:00 AM','11:00 AM','12:00 PM',
                  '01:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </F>
          </div>

          <F id="bc-notes" label="Additional Notes (optional)">
            <textarea id="bc-notes" className="bc-input bc-textarea"
              placeholder="Briefly describe what you need help with…"
              rows={3} value={form.notes} onChange={set('notes')} />
          </F>

          {errors.submit && (
            <div className="bc-submit-error">
              <i className="bi bi-exclamation-triangle me-2"></i>{errors.submit}
            </div>
          )}

          <button className="bc-btn-primary w-100" onClick={handleSubmit} disabled={loading}>
            {loading
              ? <><span className="bc-spinner"></span> Booking…</>
              : <><i className="bi bi-calendar-check me-2"></i>Confirm Booking</>
            }
          </button>

          <p className="bc-disclaimer">
            <i className="bi bi-shield-lock me-1"></i>
            Your information is kept strictly confidential and used only for scheduling purposes.
          </p>
        </div>
      </div>
    </div>
  )
}

/* ── Main page ── */
export default function EssentialEight() {
  const [expanded,      setExpanded]      = useState(null)
  const [showBookModal, setShowBookModal] = useState(false)
  const location = useLocation()
  const navigate  = useNavigate()

  // After a redirected sign-in, reopen the Book a Call modal automatically
  // so the user lands right back where they intended to act, not just the page.
  useEffect(() => {
    if (location.state?.reopenModal === 'bookCall') {
      setShowBookModal(true)
      // Clear the flag so refreshing or navigating away doesn't reopen it again
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state, location.pathname, navigate])

  return (
    <div className="page-light">

      {/* ── Hero ── */}
      <header className="template-hero e8-hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-7">
              <h1 className="template-hero-title">The Essential Eight</h1>
              <p className="template-hero-copy">
                The Essential Eight are eight baseline mitigation strategies developed to
                make it significantly harder for adversaries to compromise systems. WHTS
                recommends all individuals and organisations implement these controls.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link className="btn btn-primary px-4" to="/threats" style={{ borderRadius: 12, fontWeight: 600 }}>
                  <i className="bi bi-shield me-2"></i>Explore Threats
                </Link>
                <Link className="btn btn-danger px-4" to="/report" style={{ borderRadius: 12, fontWeight: 600 }}>
                  <i className="bi bi-exclamation-triangle me-2"></i>Report an Incident
                </Link>
              </div>
            </div>
            <div className="col-12 col-lg-5">
              <div className="template-hero-art" aria-hidden="true">
                <div className="art-desk"></div>
                <div className="art-person art-person-left">
                  <span className="art-head"></span>
                  <span className="art-body"></span>
                  <span className="art-laptop"></span>
                </div>
                <div className="art-person art-person-right">
                  <span className="art-head"></span>
                  <span className="art-body"></span>
                  <span className="art-paper"></span>
                </div>
                <div className="art-shield"><i className="bi bi-shield-lock"></i></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Strategies grid ── */}
      <section className="section-pad-lg" style={{ background: '#ffffff' }}>
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-label mb-2">The Eight Strategies</div>
            <h2 className="fw-bold mb-2" style={{ color: '#0f172a' }}>Click Any Strategy to Expand</h2>
            <p style={{ color: '#4a5568', maxWidth: '52ch', margin: '0 auto' }}>
              Each strategy addresses a specific attack vector. Together they form a
              comprehensive baseline that stops the majority of cyber attacks.
            </p>
          </div>

          <div className="row g-3">
            {STRATEGIES.map((s) => (
              <div key={s.number} className="col-12 col-md-6 col-lg-6">
                <div
                  className={`e8-card-light ${expanded === s.number ? 'e8-card-light--open' : ''}`}
                  onClick={() => setExpanded(expanded === s.number ? null : s.number)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setExpanded(expanded === s.number ? null : s.number)}
                >
                  <div className="e8-card-header">
                    <div className="d-flex align-items-center gap-3">
                      <div className="e8-number" style={{ color: s.color }}>{s.number}</div>
                      <div className="e8-icon-light">{s.icon}</div>
                      <div>
                        <div className="fw-bold" style={{ color: '#0f172a' }}>{s.title}</div>
                        <div style={{ color: '#6b7280', fontSize: '0.82rem' }}>{s.summary}</div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2 flex-shrink-0 ms-3">
                      <span className="e8-risk-badge" style={{ borderColor: s.color, color: s.color }}>
                        {s.risk}
                      </span>
                      <i className={`bi bi-chevron-down e8-chevron ${expanded === s.number ? 'e8-chevron--open' : ''}`}></i>
                    </div>
                  </div>

                  {expanded === s.number && (
                    <div className="e8-card-body-light">
                      <p style={{ color: '#4a5568', fontSize: '0.88rem', marginBottom: '0.85rem' }}>{s.detail}</p>
                      <div className="fw-bold small mb-2" style={{ color: s.color }}>
                        <i className="bi bi-check2-circle me-2"></i>Action Steps
                      </div>
                      <ul className="e8-actions-light">
                        {s.actions.map((a, i) => (
                          <li key={i} className="e8-action-item-light">
                            <i className="bi bi-arrow-right-short" style={{ color: s.color, flexShrink: 0 }}></i>
                            <span style={{ fontSize: '0.85rem', color: '#374151' }}>{a}</span>
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
      <section className="section-pad" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div className="about-cta-banner p-4 p-md-5 text-center">
            <div className="section-label mb-3">WHTS Tools</div>
            <h2 className="fw-bold mb-3" style={{ color: '#0f172a' }}>Get the Right Tools</h2>
            <p className="mb-4 mx-auto" style={{ maxWidth: '52ch', color: '#4a5568' }}>
              WHTSIPA provides tools aligned with every Essential Eight strategy —
              from patch management and MFA to EDR, backup solutions, and more.
              Contact our team for guidance on the right tools for your situation.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <button
                className="btn btn-primary px-4"
                style={{ borderRadius: 12, fontWeight: 600 }}
                onClick={() => setShowBookModal(true)}
              >
                <i className="bi bi-headset me-2"></i>Talk to Our Team
              </button>
              <Link className="btn btn-outline-secondary px-4" to="/threats" style={{ borderRadius: 12, fontWeight: 600 }}>
                <i className="bi bi-grid me-2"></i>Browse Threat Library
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Book a Call Modal ── */}
      {showBookModal && <BookCallModal onClose={() => setShowBookModal(false)} />}

    </div>
  )
}
