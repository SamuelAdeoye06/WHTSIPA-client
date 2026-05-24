import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/cyber.css'
import './Report.css'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

/* ── Incident types ── */
const INCIDENT_TYPES = [
  'Hacked Account',
  'Scam / Fraud',
  'Malware Infection',
  'Ransomware / Extortion',
  'Identity Theft',
  'Phishing / Credential Theft',
  'Business Email Compromise (BEC)',
  'Data Breach',
  'Lost / Stolen Crypto Wallet',
  'Tracking / Stalking',
  'Other (describe below)',
]

/* ── Recovery scenarios ── */
const RECOVERY_SCENARIOS = [
  {
    id: 'ransomware',
    emoji: '🧱',
    title: 'Ransomware',
    immediate: 'Isolate the affected device immediately by disconnecting it from the network to prevent spread.',
    steps: [
      'Never pay the ransom — it does not guarantee file recovery.',
      'Restore data only from clean, verified offline backups.',
      'Update all software, OS, and firmware to latest versions.',
      'Run a full scan with reputable antivirus and anti-malware tools.',
      'Enable MFA on all accounts and conduct a full security audit.',
      'Report the incident to law enforcement and relevant authorities.',
      'Document everything — screenshots, ransom notes, timelines.',
      'Contact WHTS immediately for trusted recovery assistance.',
      'Review and update your incident response plan.',
      'Monitor for secondary attacks or data leaks post-recovery.',
    ]
  },
  {
    id: 'identity',
    emoji: '🪪',
    title: 'Identity Theft',
    immediate: 'Contact your bank and financial institutions right away to freeze or monitor your accounts.',
    steps: [
      'Change all passwords immediately and enable MFA on every account.',
      'Monitor credit reports and financial statements for suspicious activity.',
      'Freeze your credit with major credit bureaus to block new account openings.',
      'Replace compromised ID documents (passport, driver\'s license, etc.).',
      'Report to the FTC and local law enforcement.',
      'File taxes early if tax-related fraud is suspected.',
      'Place fraud alerts with credit reporting agencies.',
      'Maintain offline, encrypted backups of important documents.',
      'Contact WHTS for expert guidance tailored to your situation.',
      'Review accounts for suspicious activity for 12–24 months.',
    ]
  },
  {
    id: 'malware',
    emoji: '🧬',
    title: 'Malware Infection',
    immediate: 'Disconnect the infected device from your network immediately to prevent further spread.',
    steps: [
      'Run a full system scan using reputable antivirus and anti-malware tools.',
      'Remove or quarantine all detected threats.',
      'Report the incident through our portal for immediate expert assistance.',
      'Update your OS, software, and firmware to the latest versions.',
      'Change all passwords from a clean, unaffected device.',
      'Enable MFA across all accounts.',
      'Restore data only from clean, offline backups.',
      'Reinstall the OS if the infection is severe.',
      'Notify affected parties about potential data exposure.',
      'Contact WHTS for advanced removal and system restoration support.',
    ]
  },
  {
    id: 'hacking',
    emoji: '💻',
    title: 'Hacking / System Compromise',
    immediate: 'Log in only from a secure, trusted device. Avoid public WiFi immediately.',
    steps: [
      'Change all passwords and enable MFA across all accounts.',
      'Review and revoke access for any suspicious or unused linked apps.',
      'Run a full antivirus and anti-malware scan immediately.',
      'Check for unauthorized changes to settings, email forwarding rules, or recovery options.',
      'Monitor accounts for suspicious activity and enable recovery alerts.',
      'Use a VPN when accessing sensitive accounts remotely.',
      'Report the hack to our team and relevant platforms.',
      'Contact WHTS for professional reverse engineering and full recovery support.',
      'Grant only minimum required permissions to apps going forward.',
      'Verify all apps and services linked to your accounts.',
    ]
  },
  {
    id: 'tracking',
    emoji: '👁️',
    title: 'Tracking / Scammer Targeting',
    immediate: 'Document all evidence — messages, calls, links, unusual activity — immediately.',
    steps: [
      'Back up data to an offline device then reset affected device(s) to factory settings.',
      'Change passwords on all social media and online accounts immediately.',
      'Review your device for suspicious apps or remote access tools and remove them.',
      'Enable privacy settings on all accounts and limit personal information visibility.',
      'Scan devices with trusted security tools and monitor for continued tracking.',
      'If physical safety is at risk, contact law enforcement immediately.',
      'Contact WHTS — our specialists are experienced in tracing and neutralizing these threats.',
      'Act quickly — do not delay.',
    ]
  },
  {
    id: 'bec',
    emoji: '📨',
    title: 'Business Email Compromise (BEC)',
    immediate: 'Contact your financial institution immediately to request transaction reversals or holds.',
    steps: [
      'Notify your internal IT/security team and senior management right away.',
      'Preserve all evidence (emails, logs, IP addresses) without altering it.',
      'Change passwords and enable MFA on all business email accounts.',
      'Review and secure any linked accounts or vendor relationships.',
      'File a BEC complaint and contact WHTS for urgent case assistance.',
      'Report to the FBI Internet Crime Complaint Center (IC3) and local authorities.',
      'Engage legal and cybersecurity professionals for full forensic investigation.',
      'Update email security policies and conduct employee training.',
    ]
  },
  {
    id: 'databreach',
    emoji: '🔓',
    title: 'Data Breach',
    immediate: 'Immediately revoke access for all third-party apps and websites that no longer need permission.',
    steps: [
      'Clear browser cache, cookies, and history on all devices.',
      'Change all passwords from a clean, unaffected device.',
      'Enable MFA everywhere and review account activity logs.',
      'Scan all devices with updated antivirus and anti-malware tools.',
      'Monitor credit reports and financial accounts for unusual activity.',
      'Avoid sending sensitive files to unknown or unverified contacts.',
      'Notify affected individuals or organizations if you are responsible for the breach.',
      'Report to relevant authorities and WHTS for coordinated support.',
      'Do not click suspicious links or download attachments from untrusted sources.',
    ]
  },
  {
    id: 'wallet',
    emoji: '⛓️',
    title: 'Lost / Stolen Crypto Wallet',
    immediate: 'Contact WHTS immediately and provide all available wallet details for specialized recovery.',
    steps: [
      'Check for unauthorized transactions and report to the wallet provider or exchange.',
      'Secure any remaining accessible wallets by enabling all available security features.',
      'Never share private keys or seed phrases with anyone claiming to help.',
      'Monitor blockchain explorers for suspicious movements of your funds.',
      'File a report with law enforcement and cybercrime units.',
      'Consider professional blockchain forensic services for tracing stolen assets.',
      'Create new, highly secure wallets for future holdings.',
      'Follow best cold-storage practices going forward.',
    ]
  },
]

/* ── Form field component ── */
function CyberInput({ id, label, type = 'text', placeholder, required, value, onChange, as: As = 'input', children }) {
  return (
    <div>
      <label className="form-label cyber-label" htmlFor={id}>{label}</label>
      {As === 'select' ? (
        <select id={id} className="form-select cyber-select" required={required} value={value} onChange={onChange}>
          {children}
        </select>
      ) : As === 'textarea' ? (
        <textarea id={id} className="form-control cyber-input" placeholder={placeholder} required={required} rows={4} value={value} onChange={onChange} />
      ) : (
        <input id={id} className="form-control cyber-input" type={type} placeholder={placeholder} required={required} value={value} onChange={onChange} />
      )}
    </div>
  )
}

/* ── File upload component ── */
function FileUpload({ files, onChange }) {
  const handleDrop = (e) => {
    e.preventDefault()
    const dropped = Array.from(e.dataTransfer.files)
    onChange(prev => [...prev, ...dropped].slice(0, 5))
  }

  return (
    <div
      className="file-drop-zone"
      onDragOver={e => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => document.getElementById('fileInput').click()}
    >
      <input id="fileInput" type="file" multiple accept="image/*,.pdf,.doc,.docx" hidden
        onChange={e => onChange(prev => [...prev, ...Array.from(e.target.files)].slice(0, 5))} />
      <i className="bi bi-cloud-upload" style={{ fontSize: '1.8rem', color: 'var(--cyan)', opacity: 0.7 }}></i>
      <div className="fw-bold mt-2" style={{ fontSize: '0.9rem' }}>Drag & drop evidence files here</div>
      <div className="text-muted-cyber small mt-1">or click to browse · Images, PDF, DOC · Max 5 files</div>
      {files.length > 0 && (
        <div className="mt-3 d-flex flex-wrap gap-2 justify-content-center">
          {files.map((f, i) => (
            <span key={i} className="file-chip">
              <i className="bi bi-paperclip me-1"></i>{f.name}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Main page ── */
export default function Report() {
  const [reportType, setReportType]     = useState('personal') // 'personal' | 'public'
  const [files, setFiles]               = useState([])
  const [submitted, setSubmitted]       = useState(false)
  const [activeRecovery, setActiveRecovery] = useState(null)

  const { user } = useAuth()
  const navigate = useNavigate()

  // Form state
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', country: '',
    organization: '', incidentType: '', targetedName: '',
    socialHandles: '', detail: '',
  })
  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))


  const handleSubmit = (e) => {
    e.preventDefault()
    if (!user) {
      // Not logged in — send to sign in, come back to report after
      navigate('/signin', { state: { from: '/report', scrollTo: 'report' } })
      return
    }
    // ── BACKEND: Replace setSubmitted(true) with: ──
    // try {
    //   const formData = new FormData()
    //   formData.append('reportType', reportType)
    //   formData.append('fullName', form.fullName)
    //   formData.append('email', form.email)
    //   formData.append('phone', form.phone)
    //   formData.append('country', form.country)
    //   formData.append('incidentType', form.incidentType)
    //   formData.append('detail', form.detail)
    //   if (reportType === 'public') {
    //     formData.append('organization', form.organization)
    //     formData.append('targetedName', form.targetedName)
    //     formData.append('socialHandles', form.socialHandles)
    //   }
    //   files.forEach(f => formData.append('evidence', f))
    //   await api.post('/reports/submit', formData, {
    //     headers: { 'Content-Type': 'multipart/form-data' }
    //   })
    //   setSubmitted(true)
    // } catch (err) {
    //   setError('Submission failed. Please try again.')
    // }
    //
    // Also create: src/services/api.js
    // import axios from 'axios'
    // const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })
    // api.interceptors.request.use(config => {
    //   const user = JSON.parse(localStorage.getItem('whts_user') || '{}')
    //   if (user.token) config.headers.Authorization = `Bearer ${user.token}`
    //   return config
    // })
    // export default api
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* ════════════════════════════
          HERO — split two panels
          ════════════════════════════ */}
      <header className="report-hero">
        <div className="cyber-grid" aria-hidden="true" />
        <div className="container position-relative" style={{ zIndex: 2, paddingTop: '3rem', paddingBottom: '3rem' }}>
          <div className="row g-4 align-items-stretch">

            {/* Report panel */}
            <div className="col-12 col-lg-6">
              <div className="banner p-4 h-100">
                <div className="d-flex align-items-start gap-3 mb-4">
                  <div className="icon-box" style={{ border: '1px solid rgba(255,59,85,0.4)', background: 'rgba(255,59,85,0.08)' }}>🛑</div>
                  <div>
                    <div className="text-muted-cyber small">Incident intake</div>
                    <h1 className="fw-bold glow-text mt-1 mb-1" style={{ fontSize: 'clamp(1.4rem,2.5vw,2rem)' }}>Report an Incident</h1>
                    <p className="text-muted-cyber small mb-0">
                      Every report is promptly reviewed and handled by our Active Representative.
                      Help us track scammers and protect others.
                    </p>
                  </div>
                </div>
                <span className="pill high mb-3"><span className="dot" /><span className="fw-bold" style={{ fontSize: '0.7rem' }}>EMERGENCY READY</span></span>
                <div className="scan-bar mb-2"><span /></div>
                <div className="text-muted-cyber small mb-4">Secure intake — all reports open a support ticket with our team</div>
                <a className="btn btn-alert w-100" href="#report">
                  <i className="bi bi-exclamation-triangle me-2"></i>Start Your Report
                </a>
              </div>
            </div>

            {/* Recover panel */}
            <div className="col-12 col-lg-6">
              <div className="banner p-4 h-100">
                <div className="d-flex align-items-start gap-3 mb-4">
                  <div className="icon-box">🧭</div>
                  <div>
                    <div className="text-muted-cyber small">Recovery workflow</div>
                    <h2 className="fw-bold glow-text mt-1 mb-1" style={{ fontSize: 'clamp(1.4rem,2.5vw,2rem)' }}>Recover Now</h2>
                    <p className="text-muted-cyber small mb-0">
                      Step-by-step recovery guidance for every type of cyberattack.
                      Act fast — every minute counts.
                    </p>
                  </div>
                </div>
                <span className="pill low mb-3"><span className="dot" /><span className="fw-bold" style={{ fontSize: '0.7rem' }}>SECURE RECOVERY</span></span>
                <ul className="list-unstyled text-muted-cyber small mb-4">
                  <li className="mb-2"><i className="bi bi-check2 me-2" style={{ color: 'var(--green)' }}></i>Contain and preserve evidence</li>
                  <li className="mb-2"><i className="bi bi-check2 me-2" style={{ color: 'var(--green)' }}></i>Validate and remove the threat</li>
                  <li><i className="bi bi-check2 me-2" style={{ color: 'var(--green)' }}></i>Restore with hardened controls</li>
                </ul>
                <a className="btn btn-cyber w-100" href="#recover">
                  <i className="bi bi-shield-check me-2"></i>Open Recovery Steps
                </a>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* ════════════════════════════
          MISSION SECTION
          ════════════════════════════ */}
      <section className="section-pad" style={{ background: 'rgba(5,9,19,0.6)', borderBottom: '1px solid rgba(120,214,255,0.08)' }}>
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-12 col-lg-7">
              <div className="section-label mb-2">Support Our Mission</div>
              <h2 className="fw-bold mb-3">Every Report Strengthens Our Mission</h2>
              <p className="text-muted-cyber mb-4">
                Help strengthen WHTSIPA, ACSW, and WHTSIP by reporting cybersecurity incidents,
                fraud, suspicious activity, and impersonation attempts.
              </p>
              <div className="d-flex flex-column gap-3">
                {[
                  { icon: '🎫', title: 'Opens a support ticket', desc: 'You get rapid assistance from our Active Representative team.' },
                  { icon: '🔍', title: 'We investigate and resolve', desc: 'Every valid report is reviewed and handled by our specialists.' },
                  { icon: '🏛️', title: 'Contributes to official records', desc: 'Reports are shared with government agencies and relevant authorities, enhancing our certified organisation\'s credibility.' },
                ].map(item => (
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
            <div className="col-12 col-lg-5">
              <div className="banner p-4">
                <div className="section-label mb-2">Have You Been Hacked?</div>
                <h3 className="fw-bold mb-3">Act Immediately</h3>
                <p className="text-muted-cyber small mb-4">
                  If you suspect your personal information has been compromised,
                  don't wait. Learn exactly what to do and get help now.
                </p>
                <a className="btn btn-alert w-100 mb-2" href="#report">
                  <i className="bi bi-exclamation-triangle me-2"></i>Get Help Now
                </a>
                <a className="btn btn-outline-cyber w-100" href="#recover">
                  <i className="bi bi-book me-2"></i>Read Recovery Steps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════
          REPORT FORMS
          ════════════════════════════ */}
      <section className="section-pad-lg" id="report">
        <div className="container">
          <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-4">
            <div>
              <div className="section-label mb-2">Incident Reporting</div>
              <h2 className="fw-bold mb-1">Report a Cybercrime or Incident</h2>
              <p className="text-muted-cyber mb-0">
                Submit a detailed report. Choose personal or public reporting below.
              </p>
            </div>
          </div>

          {/* Report type toggle */}
          <div className="report-type-tabs mb-4">
            <button
              className={`report-tab ${reportType === 'personal' ? 'active' : ''}`}
              onClick={() => setReportType('personal')}
            >
              <i className="bi bi-person me-2"></i>Personal Report
            </button>
            <button
              className={`report-tab ${reportType === 'public' ? 'active' : ''}`}
              onClick={() => setReportType('public')}
            >
              <i className="bi bi-building me-2"></i>Public / Org Report
            </button>
          </div>

          {/* Success message */}
          {submitted ? (
            <div className="banner p-5 text-center">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h3 className="fw-bold glow-text mb-3">Report Submitted</h3>
              <p className="text-muted-cyber mb-4" style={{ maxWidth: '48ch', margin: '0 auto 1.5rem' }}>
                Thank you for taking action. Your report has been received and a support ticket
                has been opened. Our Active Representative will review it promptly.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <button className="btn btn-outline-cyber" onClick={() => { setSubmitted(false); setFiles([]); setForm({ fullName:'',email:'',phone:'',country:'',organization:'',incidentType:'',targetedName:'',socialHandles:'',detail:'' }) }}>
                  Submit Another Report
                </button>
                <a className="btn btn-cyber" href="#recover">View Recovery Steps</a>
              </div>
            </div>
          ) : (
            <div className="card-glass p-4 p-md-5">
              <div className="d-flex align-items-start justify-content-between gap-3 mb-4">
                <div>
                  <div className="text-muted-cyber small">{reportType === 'personal' ? 'Personal' : 'Public / Organisation'}</div>
                  <h3 className="fw-bold mt-1">
                    {reportType === 'personal' ? '👤 Personal Report Form' : '🏢 Public Report Form'}
                  </h3>
                  <p className="text-muted-cyber small mb-0">
                    {reportType === 'personal'
                      ? 'For incidents affecting your own accounts, devices, or data.'
                      : 'For incidents impacting organisations, communities, or the general public.'}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">

                  {/* Contact details */}
                  <div className="col-12"><div className="section-label" style={{ fontSize: '0.68rem' }}>Contact Details</div></div>

                  <div className="col-12 col-md-6">
                    <CyberInput id="fullName" label="Full Name" placeholder="Your full name" required value={form.fullName} onChange={set('fullName')} />
                  </div>
                  <div className="col-12 col-md-6">
                    <CyberInput id="email" label="Email Address" type="email" placeholder="you@example.com" required value={form.email} onChange={set('email')} />
                  </div>
                  <div className="col-12 col-md-6">
                    <CyberInput id="phone" label="Phone Number" type="tel" placeholder="+1 234 567 8900" required value={form.phone} onChange={set('phone')} />
                  </div>
                  <div className="col-12 col-md-6">
                    <CyberInput id="country" label="Country" placeholder="Your country" required value={form.country} onChange={set('country')} />
                  </div>

                  {/* Public only — organisation field */}
                  {reportType === 'public' && (
                    <div className="col-12">
                      <CyberInput id="organization" label="Organisation (reporting on behalf of a company or person)" placeholder="Company or organisation name" value={form.organization} onChange={set('organization')} />
                    </div>
                  )}

                  {/* Incident type */}
                  <div className="col-12 mt-2"><div className="section-label" style={{ fontSize: '0.68rem' }}>Incident Details</div></div>

                  <div className="col-12">
                    <CyberInput id="incidentType" label="Type of Incident" as="select" required value={form.incidentType} onChange={set('incidentType')}>
                      <option value="">Choose incident type</option>
                      {INCIDENT_TYPES.map(t => <option key={t}>{t}</option>)}
                    </CyberInput>
                  </div>

                  {/* Public only — targeted fields */}
                  {reportType === 'public' && (
                    <>
                      <div className="col-12 col-md-6">
                        <CyberInput id="targetedName" label="Name of Targeted Organisation" placeholder="Who was targeted?" value={form.targetedName} onChange={set('targetedName')} />
                      </div>
                      <div className="col-12 col-md-6">
                        <CyberInput id="socialHandles" label="Social Media Handles or Targeted Websites" placeholder="@handle or https://example.com" value={form.socialHandles} onChange={set('socialHandles')} />
                      </div>
                    </>
                  )}

                  <div className="col-12">
                    <CyberInput id="detail" label="Report Details" as="textarea"
                      placeholder="Describe everything that happened — include dates, platforms involved, messages received, actions taken, and any other useful information for our investigation."
                      required value={form.detail} onChange={set('detail')} />
                  </div>

                  {/* Evidence upload */}
                  <div className="col-12">
                    <label className="cyber-label mb-2 d-block">Evidence Files <span className="text-muted-cyber small">(optional — screenshots, documents)</span></label>
                    <FileUpload files={files} onChange={setFiles} />
                  </div>

                  {/* Submit */}
                  <div className="col-12 mt-2">
                  <button type="submit" className="btn btn-alert w-100" style={{ padding: '0.85rem' }}>
                    {user
                      ? <><i className="bi bi-send me-2"></i>Submit Report</>
                      : <><i className="bi bi-lock me-2"></i>Sign In to Submit Report</>
                    }
                  </button>
                    <p className="text-muted-cyber small text-center mt-2 mb-0">
                      By submitting you agree your report will be reviewed by our team and may be shared with relevant authorities.
                    </p>
                  </div>

                </div>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════
          RECOVERY STEPS
          ════════════════════════════ */}
      <section className="section-pad-lg" id="recover" style={{ background: 'rgba(5,9,19,0.55)' }}>
        <div className="container">
          <div className="section-label mb-2">WHTSIPA Recovery Advice</div>
          <h2 className="fw-bold mb-2">Recover Now</h2>
          <p className="text-muted-cyber mb-4" style={{ maxWidth: '58ch' }}>
            Select your incident type below for step-by-step recovery guidance.
            Act fast — early action is the most effective defence.
          </p>

          {/* Scenario selector */}
          <div className="recovery-tabs mb-4">
            {RECOVERY_SCENARIOS.map(s => (
              <button
                key={s.id}
                className={`recovery-tab ${activeRecovery === s.id ? 'active' : ''}`}
                onClick={() => setActiveRecovery(activeRecovery === s.id ? null : s.id)}
              >
                <span className="me-2">{s.emoji}</span>{s.title}
              </button>
            ))}
          </div>

          {/* Active recovery steps */}
          {activeRecovery && (() => {
            const scenario = RECOVERY_SCENARIOS.find(s => s.id === activeRecovery)
            return (
              <div className="banner p-4 p-md-5">
                <div className="d-flex align-items-start gap-3 mb-4">
                  <div className="icon-box" style={{ fontSize: '1.5rem' }}>{scenario.emoji}</div>
                  <div>
                    <div className="section-label mb-1">Recovery: {scenario.title}</div>
                    <div className="fw-bold" style={{ color: 'var(--red)' }}>
                      <i className="bi bi-lightning-fill me-2"></i>Immediate Action: {scenario.immediate}
                    </div>
                  </div>
                </div>
                <div className="timeline">
                  {scenario.steps.map((step, i) => (
                    <div key={i} className="t-item">
                      <div className="t-marker">{i + 1}</div>
                      <div className="small" style={{ color: 'rgba(233,243,255,0.88)', paddingTop: '3px' }}>{step}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 d-flex gap-3 flex-wrap">
                  <a className="btn btn-alert" href="#contact">
                    <i className="bi bi-headset me-2"></i>Contact WHTS Now
                  </a>
                  <a className="btn btn-outline-cyber" href="#report">
                    <i className="bi bi-send me-2"></i>Submit a Report
                  </a>
                </div>
              </div>
            )
          })()}

          {!activeRecovery && (
            <div className="card-glass p-4 text-center text-muted-cyber">
              <i className="bi bi-hand-index" style={{ fontSize: '1.5rem', color: 'var(--cyan)', opacity: 0.6 }}></i>
              <div className="mt-2">Select an incident type above to see your recovery steps.</div>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════
          CONTACT / NEWSLETTER
          ════════════════════════════ */}
      <section className="section-pad" id="contact">
        <div className="container">
          <div className="row g-4">

            {/* Newsletter signup */}
            <div className="col-12 col-lg-6">
              <div className="banner p-4 h-100">
                <div className="section-label mb-2">Stay Informed</div>
                <h3 className="fw-bold mb-2">Never Miss an Update</h3>
                <p className="text-muted-cyber small mb-4">
                  Sign up for the latest cybersecurity alerts, threat intelligence,
                  and new recovery solutions to stay secure online.
                </p>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <CyberInput id="signupFirst" label="First Name" placeholder="First name" />
                  </div>
                  <div className="col-12 col-md-6">
                    <CyberInput id="signupLast" label="Last Name" placeholder="Last name" />
                  </div>
                  <div className="col-12">
                    <CyberInput id="signupEmail" label="Email Address" type="email" placeholder="you@example.com" />
                  </div>
                  <div className="col-12">
                    <button className="btn btn-cyber w-100">
                      <i className="bi bi-bell me-2"></i>Sign Up for Recovery Alerts
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact card */}
            <div className="col-12 col-lg-6">
              <div className="banner p-4 h-100">
                <div className="section-label mb-2">Direct Support</div>
                <h3 className="fw-bold mb-2">Need Immediate Help?</h3>
                <p className="text-muted-cyber small mb-4">
                  Our Active Representative is available for urgent cybersecurity cases.
                  Reach us through our secure support channels.
                </p>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex gap-3 align-items-center card-glass p-3">
                    <div className="icon-box">💬</div>
                    <div>
                      <div className="fw-bold">Live Chat Support</div>
                      <div className="text-muted-cyber small">Bot first, then a human representative joins for urgent cases.</div>
                    </div>
                  </div>
                  <div className="d-flex gap-3 align-items-center card-glass p-3">
                    <div className="icon-box" style={{ background: 'rgba(0,136,204,0.12)', border: '1px solid rgba(0,136,204,0.3)' }}>
                      <i className="bi bi-telegram" style={{ color: '#0088cc' }}></i>
                    </div>
                    <div>
                      <div className="fw-bold">Telegram Support</div>
                      <div className="text-muted-cyber small">Direct line for urgent incident reports and recovery guidance.</div>
                    </div>
                  </div>
                  <a className="btn btn-alert w-100" href="#report">
                    <i className="bi bi-exclamation-triangle me-2"></i>Open a Support Ticket Now
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}