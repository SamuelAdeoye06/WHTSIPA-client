import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/cyber.css'
import './ThreatsTools.css'
import { THREATS_AND_TOOLS } from '../data/threatsToolsData'
import StyledSelect from '../components/StyledSelect'
import { useToast } from '../context/ToastContext'

// ── Tool request form uses Anthropic API for AI assistant ──
import iconDeepfake from '../assets/media/icons/icon-deepfake.png'
import iconCredentialStuffing from '../assets/media/icons/icon-credential-stuffing.png'
import iconBec from '../assets/media/icons/icon-bec.png'
import iconCloudMisconfig from '../assets/media/icons/icon-cloud-misconfig.png'
import iconInsiderThreat from '../assets/media/icons/icon-insider-threat.png'
import iconSimSwap from '../assets/media/icons/icon-sim-swap.png'
import iconSpyware from '../assets/media/icons/icon-spyware.png'
import iconTracking from '../assets/media/icons/icon-tracking.png'
import iconPentest from '../assets/media/icons/icon-pentest.png'
import iconPhising from '../assets/media/icons/icon-phishing.png'
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


const ICON_MAP = {
  'icon-deepfake.png':             iconDeepfake,
  'icon-credential-stuffing.png':  iconCredentialStuffing,
  'icon-bec.png':                  iconBec,
  'icon-cloud-misconfig.png':      iconCloudMisconfig,
  'icon-insider-threat.png':       iconInsiderThreat,
  'icon-sim-swap.png':             iconSimSwap,
  'icon-spyware.png':              iconSpyware,
  'icon-tracking.png':             iconTracking,
  'icon-pentest.png':              iconPentest,
  'icon-phishing.png':             iconPhising,
  'icon-ransomware.png':           iconRansomware,
  'icon-scam-fraud.png':           iconScamFraud,
  'icon-reputation.png':           iconReputation,
  'icon-account-takeover.png':     iconAccountTakeover,
  'icon-data-breach.png':          iconDataBreach,
  'icon-ddos.png':                 iconDdos,
  'icon-api-security.png':         iconApiSecurity,
  'icon-identity-theft.png':       iconIdentityTheft,
  'icon-malware.png':              iconMalware,
  'icon-crypto-drainer.png':       iconCryptoDrainer,
  'icon-delivery-scam.png':        iconDeliveryScam,
  'icon-unpatched-software.png':   iconUnpatchedSoftware,
  'icon-cctv-surveillance.png':    iconCctvSurveillance,
  'icon-social-media-threat.png':  iconSocialMediaThreat,
  'icon-botnet.png':               iconBotnet,
}
// Active tab state
const TABS = ['Types of Threats', 'Threat & Tool Analysis', 'How Our Tools Work', 'Request Tools']

export default function ThreatsTools() {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('Types of Threats')
  const [expanded, setExpanded] = useState(null)
  const [requestForm, setRequestForm] = useState({ name: '', email: '', tool: '', detail: '' })
  const [submitted, setSubmitted] = useState(false)

  const set = (k) => (e) => setRequestForm(p => ({ ...p, [k]: e.target.value }))

  return (
    <div className="threats-tools-page">

      {/* ── Hero ── */}
      <header className="tt-hero">
        <div className="container" style={{ paddingTop: '3.5rem', paddingBottom: '3.5rem' }}>
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-7">
              <div className="tt-hero-red-bar mb-4">
                <h1 className="tt-hero-title">THREATS &amp; Tools</h1>
              </div>
              <p style={{ color: '#1a1a2e', maxWidth: '64ch', fontSize: '1.05rem', lineHeight: 1.75 }} className="mb-0">
                At <strong>Threats &amp; Tools</strong>, we assert that knowledge and tools are Digital Power —
                the strongest form of protection. Our Self-Defense Training Certifications program combines
                practical real-world training with high quality, secure software tools. It equips individuals,
                families, and business teams with the skills they need to handle real-world threats
                confidently and legally as signed.
              </p>
            </div>
            <div className="col-12 col-lg-5">
              <div className="tt-hero-animation-wrap">
                <div className="tt-hero-scanner">
                  <div className="tt-scanner-ring ring-1"></div>
                  <div className="tt-scanner-ring ring-2"></div>
                  <div className="tt-scanner-ring ring-3"></div>
                  <div className="tt-scanner-line"></div>
                  <div className="tt-scanner-hub">
                    <i className="bi bi-shield-lock-fill"></i>
                  </div>
                </div>
                <div className="tt-hero-tech-nodes">
                  <span className="tech-node n1">SECURE</span>
                  <span className="tech-node n2">DECRYPT</span>
                  <span className="tech-node n3">MONITOR</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Tab navigation ── */}
      <div className="tt-tabs-bar">
        <div className="container">
          <div className="tt-tabs">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`tt-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ════════ TAB 1: Types of Threats ════════ */}
      {activeTab === 'Types of Threats' && (
        <section className="section-pad-lg" style={{ background: '#ffffff' }}>
          <div className="container">
            <div className="tt-tab-header">
              <h2 style={{ color: '#1a1a2e' }}>Types of Threats</h2>
              <p className="tt-bywhts">BY WHTSIPA</p>
              <p style={{ color: '#4a5568' }}>
                Understand the most common and emerging threats you may face online and in real life.
              </p>
            </div>
            <div className="row g-4">

              {THREATS_AND_TOOLS.map(threat => (
                <div key={threat.id} className="col-6 col-md-4 col-lg-3">
                  {threat.slug ? (
                    <Link to={`/threats/${threat.slug}`} className="text-decoration-none">
                      <div className="tt-threat-card">
                        <div className="tt-threat-icon-wrap">
                          <img
                            src={ICON_MAP[threat.icon]}
                            alt={threat.name}
                            className="tt-threat-icon"
                          />
                          <div className="tt-threat-name">{threat.name}</div>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="tt-threat-card" style={{ cursor: 'default' }}>
                      <div className="tt-threat-icon-wrap">
                        <img
                          src={ICON_MAP[threat.icon]}
                          alt={threat.name}
                          className="tt-threat-icon"
                        />
                        <div className="tt-threat-name">{threat.name}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════ TAB 2: Threat & Tool Analysis ════════ */}
      {activeTab === 'Threat & Tool Analysis' && (
        <section className="section-pad-lg" style={{ background: '#ffffff' }}>
          <div className="container">
            <div className="tt-tab-header">
              <h2 style={{ color: '#1a1a2e' }}>Threat &amp; Tool Analysis</h2>
              <p className="tt-bywhts">BY WHTSIPA</p>
              <p style={{ color: '#4a5568' }}>
                Get insights on how specific threats work and which tools best protect against them.
                We analyze real scenarios, compare protection options and recommend the most suitable
                tools for personal safety or business security.
              </p>
            </div>
            <div className="d-flex flex-column gap-3">
              {THREATS_AND_TOOLS.map(threat => (
                <div
                  key={threat.id}
                  className={`tt-analysis-card ${expanded === threat.id ? 'open' : ''}`}
                  onClick={() => setExpanded(expanded === threat.id ? null : threat.id)}
                >
                  <div className="tt-analysis-header">
                    <div className="d-flex align-items-center gap-3">
                      <div className="tt-analysis-icon">
                        <i className="bi bi-shield-exclamation"></i>
                      </div>
                      <div>
                        <div className="fw-bold" style={{ color: '#0f172a' }}>{threat.name}</div>
                        <div style={{ color: '#dc2626', fontSize: '0.78rem', fontWeight: 600 }}>
                          Tool: {threat.tool}
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="tt-success-rate">{threat.successRate}</span>
                      <i className={`bi bi-chevron-down tt-chevron ${expanded === threat.id ? 'open' : ''}`}></i>
                    </div>
                  </div>

                  {expanded === threat.id && (
                    <div className="tt-analysis-body">
                      <p style={{ color: '#4a5568', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                        {threat.description}
                      </p>
                      <div className="fw-bold small mb-2" style={{ color: '#0f172a' }}>How it Works:</div>
                      <div className="d-flex flex-column gap-2">
                        {threat.steps.map((step, i) => (
                          <div key={i} className="tt-step-item">
                            <div className="tt-step-num">{i + 1}</div>
                            <div>
                              <div className="fw-bold small" style={{ color: '#0f172a' }}>{step.title}</div>
                              <div style={{ color: '#4a5568', fontSize: '0.85rem' }}>{step.desc}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════ TAB 3: How Our Tools Work ════════ */}
      {activeTab === 'How Our Tools Work' && (
        <section className="section-pad-lg" style={{ background: '#ffffff' }}>
          <div className="container">
            <div className="tt-tab-header">
              <h2 style={{ color: '#1a1a2e' }}>How Our Tools Work</h2>
              <p className="tt-bywhts">BY WHTSIPA</p>
              <p style={{ color: '#4a5568' }}>
                Learn how our recommended protection tools and software function online. Through simple
                explanations, step-by-step guides and demo videos you'll see how each tool operates
                and how to use it confidently for maximum safety as you purchase.
              </p>
              <div className="tt-demo-note">
                <i className="bi bi-play-circle me-2" style={{ color: '#dc2626' }}></i>
                A clear AI-powered demonstration video is included so you can watch, practice and
                confidently apply the techniques in your daily life.
              </div>
            </div>
            <div className="row g-4">
              {THREATS_AND_TOOLS.map(threat => (
                <div key={threat.id} className="col-12 col-md-6 col-lg-4">
                  <div className="tt-tool-card h-100">
                    <div className="tt-tool-card-header">
                      <div className="tt-tool-name">{threat.tool}</div>
                      <div className="tt-tool-threat">{threat.name}</div>
                    </div>
                    <div className="tt-tool-success">
                      <span className="tt-success-label">Success Rate</span>
                      <span className="tt-success-value">{threat.successRate}</span>
                    </div>
                    <ol className="tt-tool-steps">
                      {threat.steps.map((step, i) => (
                        <li key={i} className="tt-tool-step">
                          <div className="fw-bold small" style={{ color: '#0f172a' }}>{step.title}</div>
                          <div style={{ color: '#4a5568', fontSize: '0.82rem' }}>{step.desc}</div>
                        </li>
                      ))}
                    </ol>
                    <button className="tt-purchase-btn">
                      <i className="bi bi-bag-check me-2"></i>Purchase Tool
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════ TAB 4: Request Tools ════════ */}
      {activeTab === 'Request Tools' && (
        <section className="section-pad-lg" style={{ background: '#ffffff' }}>
          <div className="container">
            <div className="tt-tab-header">
              <h2 style={{ color: '#1a1a2e' }}>Request Tools</h2>
              <p className="tt-bywhts">BY WHTSIPA</p>
              <p style={{ color: '#4a5568' }}>
                Need a specific tool or solution to protect yourself from online threats?
                Simply submit your request here. Our AI assistant is available 24/7 to guide you
                through options and answer your questions instantly, and a live representative will
                personally review and handle your request for personalized recommendations and support.
              </p>
            </div>

            <div className="row g-4">
              {/* Request form */}
              <div className="col-12 col-lg-7">
                {submitted ? (
                  <div className="about-cta-banner p-5 text-center">
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                    <h3 className="fw-bold mb-2" style={{ color: '#0f172a' }}>Request Submitted</h3>
                    <p style={{ color: '#4a5568' }} className="mb-4">
                      Our AI assistant has logged your request. A live representative will review it
                      and contact you with personalized recommendations.
                    </p>
                    <button className="btn btn-outline-primary" style={{ borderRadius: 12 }}
                      onClick={() => setSubmitted(false)}>
                      Submit Another Request
                    </button>
                  </div>
                ) : (
                  <div className="tt-request-card p-4 p-md-5">
                    <h4 className="fw-bold mb-4" style={{ color: '#0f172a' }}>Tool Request Form</h4>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      // Native <select required> used to block submission here —
                      // StyledSelect isn't a real form control, so this replaces
                      // that guarantee explicitly rather than silently losing it.
                      if (!requestForm.tool) {
                        showToast('Please select a tool category.', 'error')
                        return
                      }
                      setSubmitted(true)
                    }}>
                      <div className="row g-3">
                        <div className="col-12 col-sm-6">
                          <label className="contact-label">Full Name</label>
                          <input className="contact-field" type="text" placeholder="Your name"
                            value={requestForm.name} onChange={set('name')} required />
                        </div>
                        <div className="col-12 col-sm-6">
                          <label className="contact-label">Email Address</label>
                          <input className="contact-field" type="email" placeholder="you@example.com"
                            value={requestForm.email} onChange={set('email')} required />
                        </div>
                        <div className="col-12">
                          <label className="contact-label">Tool or Solution Needed</label>
                          <StyledSelect className="contact-field" value={requestForm.tool} onChange={set('tool')}>
                            <option value="">Select a tool category</option>
                            {THREATS_AND_TOOLS.map(t => (
                              <option key={t.id} value={t.tool}>{t.tool}</option>
                            ))}
                            <option value="custom">Custom / Not Listed</option>
                          </StyledSelect>
                        </div>
                        <div className="col-12">
                          <label className="contact-label">Describe Your Situation</label>
                          <textarea className="contact-field" rows={5}
                            placeholder="Describe the threat or problem you need protection from. The more detail, the better our recommendation."
                            value={requestForm.detail} onChange={set('detail')} required />
                        </div>
                        <div className="col-12">
                          <button type="submit" className="btn btn-danger w-100" style={{ padding: '0.85rem', borderRadius: 12, fontWeight: 600 }}>
                            <i className="bi bi-send me-2"></i>Submit Tool Request
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              {/* AI assistant + live rep info */}
              <div className="col-12 col-lg-5">
                <div className="d-flex flex-column gap-3">
                  <div className="tt-ai-card p-4">
                    <div className="tt-ai-header">
                      <div className="tt-ai-dot"></div>
                      <div className="fw-bold" style={{ color: '#0f172a' }}>AI Assistant — 24/7</div>
                    </div>
                    <p style={{ color: '#4a5568', fontSize: '0.88rem', marginBottom: '0.75rem' }}>
                      Our AI assistant is available around the clock to guide you through tool options,
                      answer questions instantly, and help you identify the right protection for your needs.
                    </p>
                    <div className="tt-ai-note">
                      Whether you're looking for digital security tools, self-defense solutions or
                      custom protection setups, we'll help you select and secure the right tools
                      quickly and effectively.
                    </div>
                  </div>

                  <div className="tt-rep-card p-4">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <div className="tt-rep-avatar">👤</div>
                      <div>
                        <div className="fw-bold" style={{ color: '#0f172a' }}>Live Representative</div>
                        <div style={{ color: '#16a34a', fontSize: '0.78rem', fontWeight: 600 }}>● Available</div>
                      </div>
                    </div>
                    <p style={{ color: '#4a5568', fontSize: '0.88rem', marginBottom: '1rem' }}>
                      After submitting your request, a live representative will personally review
                      and handle it for personalized recommendations and support.
                    </p>
                    <Link className="btn btn-primary w-100" to="/contact" style={{ borderRadius: 12, fontWeight: 600 }}>
                      <i className="bi bi-headset me-2"></i>Contact a Representative
                    </Link>
                  </div>

                  <div className="tt-purchase-note p-4">
                    <div className="fw-bold small mb-2" style={{ color: '#0f172a' }}>
                      📦 After Purchase
                    </div>
                    <p style={{ color: '#4a5568', fontSize: '0.85rem', marginBottom: 0 }}>
                      We provide full demonstration versions after purchase. You will receive an email
                      with instructions on how to use the tools for your digital security needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Can't find your tool */}
            <div className="tt-cant-find mt-5">
              <div className="fw-bold mb-1" style={{ color: '#0f172a' }}>Can't find your tool?</div>
              <p style={{ color: '#4a5568', marginBottom: '1rem' }}>
                If you need a specific tool that isn't listed above, make a custom request and
                our team will find or build the right solution for you.
              </p>
              <button
                className="btn btn-outline-danger"
                style={{ borderRadius: 12, fontWeight: 600 }}
                onClick={() => setRequestForm(p => ({ ...p, tool: 'custom' }))}
              >
                <i className="bi bi-plus-circle me-2"></i>Make a Custom Request
              </button>
            </div>

          </div>
        </section>
      )}

    </div>
  )
}