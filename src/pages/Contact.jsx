import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import '../styles/cyber.css'
import './Contact.css'
import './Report.css'   /* shared livechat modal styles */

/* ── Contact channel constants ── */
const WA_NUMBER       = '16502184673'
const TG_HANDLE       = 'Wehelptrackscammersipaddress'
const SUPPORT_EMAIL   = 'wehelptrackscammersipaddress@mail.com'
const OFFICIAL_SITE   = 'https://wehelptrackscammersipaddress.com'

/* ══════════════════════════════════════════════════════════
   SITE-WIDE LIVE CHAT FLOW
   Covers every aspect of WHTSIPA — reports, tools, threats,
   recovery, hiring, contact, tools AI chatbot, accounts etc.
   ══════════════════════════════════════════════════════════ */
const SITE_CHAT_FLOW = {
  main: {
    text: "Welcome to WHTSIPA Central Support! I'm here to help with anything on our platform. What do you need today?",
    options: [
      { text: '📝 Reporting an incident / cybercrime',    next: 'reports' },
      { text: '🛡️ Threat library & recovery steps',       next: 'threats' },
      { text: '🔧 Security tools & purchasing',           next: 'tools' },
      { text: '🤝 Hire our team / specialist support',    next: 'hire' },
      { text: '👤 My account (sign up, login, password)', next: 'account' },
      { text: '📬 Contact & response times',              next: 'contact_info' },
      { text: '🚨 Connect me to a live agent NOW',        next: 'live_agent' },
    ]
  },

  /* ── REPORTS ── */
  reports: {
    text: "WHTSIPA handles two types of incident reports:\n\n• **Personal Report** — for incidents that directly affected you (phishing, identity theft, romance scams, etc.)\n• **Public / Org Report** — for incidents affecting organisations, communities, or third parties.\n\nWhat would you like to know?",
    options: [
      { text: '👤 I need to file a Personal Report',           action: 'go_report_personal' },
      { text: '🏢 I need to file a Public / Org Report',       action: 'go_report_public' },
      { text: '📋 What info do I need to prepare?',           next: 'reports_prepare' },
      { text: '🔒 Is my data kept confidential?',             next: 'data_privacy' },
      { text: '⬅️ Back to main menu',                         next: 'main' },
    ]
  },
  reports_prepare: {
    text: "To file a strong report, please prepare:\n\n• Your contact details (name, email, phone)\n• Incident date and a clear description of what happened\n• Any communication screenshots (emails, messages, profiles)\n• Financial transaction records if money was lost\n• Social media handles or links associated with the suspect\n\nThe more detail you provide, the faster our team can act.",
    options: [
      { text: '📝 Go to the Report page now',  action: 'go_report' },
      { text: '⬅️ Back',                        next: 'reports' },
    ]
  },

  /* ── THREATS ── */
  threats: {
    text: "Our Threats Library covers a wide range of cybersecurity incidents. You can explore threat categories, learn about tactics used by scammers, and follow tailored recovery steps. What are you looking for?",
    options: [
      { text: '🦠 Malware / Ransomware',          next: 'threat_malware' },
      { text: '💰 Romance / Investment Scams',     next: 'threat_scam' },
      { text: '🔐 Account Compromise / Hacking',   next: 'threat_account' },
      { text: '🕵️ Phishing / Smishing / Vishing',  next: 'threat_phishing' },
      { text: '🌐 Go to full Threats Library',      action: 'go_threats' },
      { text: '⬅️ Back to main menu',               next: 'main' },
    ]
  },
  threat_malware: {
    text: "Ransomware and malware infections can encrypt or destroy your files. Immediate steps:\n\n1. Disconnect your device from the network immediately\n2. Do NOT pay the ransom — it rarely works\n3. Preserve the ransom note and any error messages\n4. Contact WHTSIPA for a professional malware analysis and decryption support.\n\nOur team can assist with Ransomware Decryption, RAT Neutralisation, and Spyware Removal.",
    options: [
      { text: '🔧 I need malware removal tools',   action: 'go_tools' },
      { text: '🚨 Connect to a live agent',         next: 'live_agent' },
      { text: '⬅️ Back to threats menu',            next: 'threats' },
    ]
  },
  threat_scam: {
    text: "Romance, investment and crypto scams are among the most devastating. Warning signs include:\n\n• Requests to move to private messaging platforms\n• Promises of guaranteed investment returns\n• Requests for crypto, gift cards, or wire transfers\n• Emotional pressure to act urgently or secretly\n\nIf you've been targeted, document everything and act fast — time is critical for recovery.",
    options: [
      { text: '📝 Report this scam now',          action: 'go_report_personal' },
      { text: '🔧 I need recovery tools',          action: 'go_tools' },
      { text: '🚨 Connect to a live agent',         next: 'live_agent' },
      { text: '⬅️ Back to threats menu',            next: 'threats' },
    ]
  },
  threat_account: {
    text: "Account compromises (social media, email, banking) require urgent action:\n\n1. Immediately change your password from a separate, unaffected device\n2. Enable Two-Factor Authentication (2FA) everywhere\n3. Revoke all active sessions and connected apps\n4. Alert your contacts — the attacker may impersonate you\n5. Report to the platform and WHTSIPA for investigation support.",
    options: [
      { text: '📝 File an incident report',        action: 'go_report_personal' },
      { text: '🔐 I need account protection tools', action: 'go_tools' },
      { text: '⬅️ Back to threats menu',            next: 'threats' },
    ]
  },
  threat_phishing: {
    text: "Phishing attacks trick you into surrendering credentials, personal data, or money. Types include:\n\n• **Phishing** — deceptive emails impersonating legitimate companies\n• **Smishing** — SMS-based deceptive links\n• **Vishing** — phone call scams from fake banks, government bodies, or tech support\n\nNever click suspicious links or share OTPs/passwords. If you've fallen victim, change all passwords immediately and report the sender.",
    options: [
      { text: '📝 Report a phishing attack',       action: 'go_report_personal' },
      { text: '🌐 View full Threats Library',       action: 'go_threats' },
      { text: '⬅️ Back to threats menu',            next: 'threats' },
    ]
  },

  /* ── TOOLS ── */
  tools: {
    text: "WHTSIPA offers a range of professional security tools across several categories. You can browse, request, or purchase tools directly. What category interests you?",
    options: [
      { text: '🦠 Malware & Ransomware Removal',    next: 'tools_malware' },
      { text: '🔐 Account & Identity Protection',   next: 'tools_account' },
      { text: '🧱 Botnet & Network Tools',           next: 'tools_network' },
      { text: '🔍 Tracking & OSINT Tools',           next: 'tools_osint' },
      { text: '💰 Crypto Fraud & Recovery Tools',    next: 'tools_crypto' },
      { text: '📝 Request a custom tool',            action: 'go_tools' },
      { text: '⬅️ Back to main menu',                next: 'main' },
    ]
  },
  tools_malware: {
    text: "Our Malware & Ransomware tools include:\n\n• Advanced Antivirus EDR\n• Ransomware Decryption Assistance\n• Spyware & Keylogger Detector\n• RAT (Remote Access Trojan) Neutralizer\n\nAll tools are provided with expert guidance from our team.",
    options: [
      { text: '🛒 Purchase / Request this tool',  action: 'go_tools' },
      { text: '🚨 Connect to a live agent',        next: 'live_agent' },
      { text: '⬅️ Back to tools',                  next: 'tools' },
    ]
  },
  tools_account: {
    text: "Our Account & Identity Protection tools:\n\n• MFA Enforcement Suite\n• SIM Swap Prevention Tool\n• Account Recovery Assistance\n• Dark Web Identity Monitor\n• Password Strength Auditor",
    options: [
      { text: '🛒 Purchase / Request this tool',  action: 'go_tools' },
      { text: '🚨 Connect to a live agent',        next: 'live_agent' },
      { text: '⬅️ Back to tools',                  next: 'tools' },
    ]
  },
  tools_network: {
    text: "Our Network & Botnet Security tools:\n\n• DDoS Mitigation & Traffic Scrubbing\n• Botnet Detection & Cleanup\n• Network Segmentation Tool\n• API Security Gateway\n• Firewall Configuration Auditor",
    options: [
      { text: '🛒 Purchase / Request this tool',  action: 'go_tools' },
      { text: '🚨 Connect to a live agent',        next: 'live_agent' },
      { text: '⬅️ Back to tools',                  next: 'tools' },
    ]
  },
  tools_osint: {
    text: "Our Tracking & OSINT tools:\n\n• IP & Device Geolocation Tracer\n• Social Media Investigation Suite\n• Deep Web / Dark Web Monitor\n• Identity Verification & Cross-Reference Tool\n• Real-Time Threat Intelligence Feed",
    options: [
      { text: '🛒 Purchase / Request this tool',  action: 'go_tools' },
      { text: '🚨 Connect to a live agent',        next: 'live_agent' },
      { text: '⬅️ Back to tools',                  next: 'tools' },
    ]
  },
  tools_crypto: {
    text: "Our Crypto Fraud & Recovery tools:\n\n• Crypto Wallet Recovery Assistant\n• Blockchain Transaction Tracer\n• Crypto Drainer Detector\n• Investment Scam Evidence Package\n• Wallet Address Intelligence Report",
    options: [
      { text: '🛒 Purchase / Request this tool',  action: 'go_tools' },
      { text: '🚨 Connect to a live agent',        next: 'live_agent' },
      { text: '⬅️ Back to tools',                  next: 'tools' },
    ]
  },

  /* ── HIRE ── */
  hire: {
    text: "Our specialist team provides personalised cybersecurity services including:\n\n• Scammer Tracking & Investigation\n• Full Recovery Support (financial, account, crypto)\n• Evidence Analysis & Legal Documentation\n• Law Enforcement / Insurance Reporting\n• Ongoing Protection & Monitoring\n\nTo hire us, submit a formal Hire Request so we can assign the right expert.",
    options: [
      { text: '📋 Submit a Hire Request Form',  action: 'go_hire' },
      { text: '🚨 Speak to an agent directly',   next: 'live_agent' },
      { text: '⬅️ Back to main menu',             next: 'main' },
    ]
  },

  /* ── ACCOUNT ── */
  account: {
    text: "WHTSIPA requires a free account to submit reports, hire our team, or request tools. This ensures secure case tracking and personalised service. What do you need help with?",
    options: [
      { text: '✍️ How do I create an account?',      next: 'account_signup' },
      { text: '🔑 I forgot my password',              next: 'account_password' },
      { text: '📧 I haven\'t received a verify email', next: 'account_verify' },
      { text: '⬅️ Back to main menu',                 next: 'main' },
    ]
  },
  account_signup: {
    text: "Creating a free account is quick:\n\n1. Click 'Sign Up' in the navigation bar\n2. Fill in your name, email, country and a strong password (min 12 chars, uppercase, number & symbol)\n3. Check your inbox for a verification email from WHTSIPA\n4. Click the verification link to activate your account\n5. Sign in and you're ready to go!\n\nYour account is completely free and gives you access to all WHTSIPA services.",
    options: [
      { text: '✍️ Go to Sign Up page',        action: 'go_signup' },
      { text: '⬅️ Back to account options',    next: 'account' },
    ]
  },
  account_password: {
    text: "To reset your password:\n\n1. Go to the Sign In page\n2. Click 'Forgot Password?' under the login form\n3. Enter your registered email address\n4. Check your inbox for a password reset link (valid for 1 hour)\n5. Click the link and enter your new password\n\nIf you don't receive the email, check your spam/junk folder.",
    options: [
      { text: '🔑 Go to Forgot Password',   action: 'go_forgot_password' },
      { text: '⬅️ Back to account options',  next: 'account' },
    ]
  },
  account_verify: {
    text: "If you haven't received your verification email:\n\n• Check your spam / junk folder first\n• The email comes from WHTSIPA Security\n• The verification link is valid for 24 hours\n• If 24 hours have passed, you may need to register again\n\nIf you're still having issues, contact our team directly via WhatsApp or Telegram.",
    options: [
      { text: '🟢 Contact via WhatsApp',      action: 'open_wa' },
      { text: '🔵 Contact via Telegram',       action: 'open_tg' },
      { text: '⬅️ Back to account options',    next: 'account' },
    ]
  },

  /* ── CONTACT INFO ── */
  contact_info: {
    text: "Here are our response times and channels:\n\n📱 **WhatsApp & Telegram** — Fastest, usually within minutes (24/7 for emergencies)\n📧 **Email** — Within 48 hours for general enquiries\n🌐 **Website contact form** — Within 48 hours\n\nFor urgent cybersecurity incidents, always use WhatsApp or Telegram for the fastest response.",
    options: [
      { text: '🟢 WhatsApp (fastest)',          action: 'open_wa' },
      { text: '🔵 Telegram',                    action: 'open_tg' },
      { text: '📧 Email us',                    action: 'open_email' },
      { text: '⬅️ Back to main menu',            next: 'main' },
    ]
  },

  /* ── DATA PRIVACY ── */
  data_privacy: {
    text: "All your submissions are handled with strict confidentiality:\n\n• Reports are encrypted and only visible to verified WHTSIPA representatives\n• We never sell or share your personal data with third parties\n• If you opt into 'Share Anonymized Data', all personal identifiers are removed before use\n• You can request deletion of your data at any time by contacting our team",
    options: [
      { text: '⬅️ Back to reports',    next: 'reports' },
      { text: '⬅️ Back to main menu',  next: 'main' },
    ]
  },

  /* ── LIVE AGENT ── */
  live_agent: {
    text: "Our live representatives are available around the clock for urgent cases. Choose how you'd like to connect:",
    options: [
      { text: '🟢 WhatsApp — Fastest (24/7)',  action: 'open_wa' },
      { text: '🔵 Telegram Support',            action: 'open_tg' },
      { text: '📧 Send an Email',               action: 'open_email' },
      { text: '⬅️ Back to main menu',           next: 'main' },
    ]
  },
}

/* ══════════════════════════════════════════════════════════
   SITE-WIDE LIVE CHAT MODAL COMPONENT
   ══════════════════════════════════════════════════════════ */
function ContactLiveChat({ isOpen, onClose, userName, navigate }) {
  const [currentNode, setCurrentNode] = useState('main')
  const [messages, setMessages]       = useState([{
    sender: 'agent',
    text:   `Hello ${userName || 'there'}! Welcome to WHTSIPA Central Support. I can help with anything on our platform — reports, threats, tools, accounts, hiring, and more. What do you need today?`,
    time:   new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }])
  const [inputText, setInputText] = useState('')
  const [isTyping,  setIsTyping]  = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  if (!isOpen) return null

  const selectOption = (opt) => {
    setMessages(prev => [...prev, {
      sender: 'user',
      text:   opt.text,
      time:   new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }])
    setIsTyping(true)

    if (opt.action) {
      setTimeout(() => {
        setIsTyping(false)
        const actionMap = {
          go_report:          () => { onClose(); navigate('/report') },
          go_report_personal: () => { onClose(); navigate('/report') },
          go_report_public:   () => { onClose(); navigate('/report') },
          go_threats:         () => { onClose(); navigate('/threats') },
          go_tools:           () => { onClose(); navigate('/tools') },
          go_hire:            () => { onClose(); navigate('/tools') },
          go_signup:          () => { onClose(); navigate('/signup') },
          go_forgot_password: () => { onClose(); navigate('/forgot-password') },
          open_wa:            () => window.open(`https://wa.me/${WA_NUMBER}`, '_blank'),
          open_tg:            () => window.open(`https://t.me/${TG_HANDLE}`, '_blank'),
          open_email:         () => window.open(`mailto:${SUPPORT_EMAIL}`, '_blank'),
        }
        actionMap[opt.action]?.()
      }, 900)
      return
    }

    if (opt.next) {
      setTimeout(() => {
        setIsTyping(false)
        const nextNode = SITE_CHAT_FLOW[opt.next]
        setCurrentNode(opt.next)
        setMessages(prev => [...prev, {
          sender: 'agent',
          text:   nextNode.text,
          time:   new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }])
      }, 1200)
    }
  }

  const handleSend = (e) => {
    e.preventDefault()
    if (!inputText.trim()) return
    setMessages(prev => [...prev, {
      sender: 'user',
      text:   inputText,
      time:   new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }])
    setInputText('')
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, {
        sender: 'agent',
        text:   "I'm a site-wide routing assistant. Please select one of the quick options below, or connect directly with a live representative via WhatsApp or Telegram for a real-time conversation.",
        time:   new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }])
    }, 1400)
  }

  const currentNodeData = SITE_CHAT_FLOW[currentNode]

  return (
    <div className="wm-overlay" style={{ zIndex: 9999 }} onClick={onClose}>
      <div className="livechat-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="livechat-header">
          <div className="d-flex align-items-center gap-2">
            <div className="livechat-avatar">
              <i className="bi bi-shield-fill-check text-white"></i>
            </div>
            <div>
              <div className="livechat-title text-white">WHTSIPA Central Support</div>
              <div className="livechat-status">
                <span className="livechat-status-dot"></span>
                Active Representative Online
              </div>
            </div>
          </div>
          <button className="livechat-close" onClick={onClose} aria-label="Close Chat">
            <i className="bi bi-x-lg text-white"></i>
          </button>
        </div>

        {/* Messages */}
        <div className="livechat-body">
          {messages.map((m, idx) => (
            <div key={idx} className={`livechat-msg-row ${m.sender === 'user' ? 'user-row' : 'agent-row'}`}>
              <div className="livechat-bubble">
                <div className="msg-text" style={{ whiteSpace: 'pre-line' }}>{m.text}</div>
                <div className="msg-time">{m.time}</div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="livechat-msg-row agent-row">
              <div className="livechat-bubble typing-bubble">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick options */}
        {!isTyping && currentNodeData?.options && (
          <div className="livechat-options-panel p-2">
            <div className="d-flex flex-column gap-1">
              {currentNodeData.options.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="btn btn-sm livechat-opt-btn"
                  onClick={() => selectOption(opt)}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input footer */}
        <form className="livechat-footer" onSubmit={handleSend}>
          <input
            type="text"
            className="form-control livechat-input"
            placeholder="Type a message…"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary livechat-send-btn"
            style={{ color: '#ffffff', backgroundColor: '#1d4ed8' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ffffff" viewBox="0 0 16 16"
              style={{ fill: '#ffffff', display: 'block' }}>
              <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
            </svg>
          </button>
        </form>

      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   CONTACT PAGE
   ══════════════════════════════════════════════════════════ */
export default function Contact() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { user }  = useAuth()
  const [form,      setForm]      = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [showChat,  setShowChat]  = useState(false)
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  // Restore a saved draft (left behind by an auth redirect) and prefill from the signed-in user
  useEffect(() => {
    const saved = localStorage.getItem('whts_contact_draft')
    if (saved) {
      try { setForm(JSON.parse(saved)) } catch { /* ignore */ }
    }
  }, [])

  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        name:  f.name  || (user.firstName || user.name || ''),
        email: f.email || user.email || '',
      }))
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!user) {
      // Save what they've typed so far and send them to sign in
      localStorage.setItem('whts_contact_draft', JSON.stringify(form))
      navigate('/signin', { state: { from: '/contact', scrollTo: 'contact' } })
      return
    }

    setLoading(true)
    try {
      await api.post('/contact/submit', form)
      localStorage.removeItem('whts_contact_draft')
      setSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const waLink    = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hello WHTSIPA, I need support.')}`
  const tgLink    = `https://t.me/${TG_HANDLE}`
  const emailLink = `mailto:${SUPPORT_EMAIL}?subject=WHTSIPA%20Support`

  return (
    <div className="page-light">

      <header className="template-hero contact-template-hero">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-7">
              <h1 className="template-hero-title">Contact us</h1>
              <p className="template-hero-copy">
                Get support, ask a question, or reach our active representative
                for urgent cybersecurity help.
              </p>
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
                <div className="art-shield"><i className="bi bi-chat-dots"></i></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="section-pad-lg" style={{ background: '#ffffff' }}>
        <div className="container">
          <div className="row g-4">

            {/* ── Contact form ── */}
            <div className="col-12 col-lg-7">
              {submitted ? (
                <div className="about-cta-banner p-5 text-center">
                  <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#0d9488' }}>
                    <i className="bi bi-check-circle-fill"></i>
                  </div>
                  <h3 className="fw-bold mb-3" style={{ color: '#0f172a' }}>Message Sent</h3>
                  <p className="mb-4" style={{ color: '#4a5568' }}>
                    Thank you for reaching out. Our team will get back to you within 48 hours.
                  </p>
                  <button
                    className="btn btn-outline-primary"
                    style={{ borderRadius: 12 }}
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div className="contact-form-card p-4 p-md-5" id="contact">
                  <h3 className="fw-bold mb-4" style={{ color: '#0f172a' }}>Send us a Message</h3>
                  {error && (
                    <div className="alert alert-danger d-flex align-items-center gap-2 mb-3" style={{ borderRadius: 10 }}>
                      <i className="bi bi-exclamation-circle-fill"></i>
                      <span>{error}</span>
                    </div>
                  )}
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-12 col-sm-6">
                        <label className="contact-label">Full Name</label>
                        <div className="contact-input-wrap">
                          <i className="bi bi-person contact-icon"></i>
                          <input className="contact-field ps-contact" type="text"
                            placeholder="Your full name" value={form.name} onChange={set('name')} required />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6">
                        <label className="contact-label">Email Address</label>
                        <div className="contact-input-wrap">
                          <i className="bi bi-envelope contact-icon"></i>
                          <input className="contact-field ps-contact" type="email"
                            placeholder="you@example.com" value={form.email} onChange={set('email')} required />
                        </div>
                      </div>
                      <div className="col-12">
                        <label className="contact-label">Subject</label>
                        <div className="contact-input-wrap">
                          <i className="bi bi-chat-left-text contact-icon"></i>
                          <input className="contact-field ps-contact" type="text"
                            placeholder="What is this about?" value={form.subject} onChange={set('subject')} required />
                        </div>
                      </div>
                      <div className="col-12">
                        <label className="contact-label">Message</label>
                        <textarea className="contact-field" rows={5}
                          placeholder="Type your message here..."
                          value={form.message} onChange={set('message')} required />
                      </div>
                      <div className="col-12">
                        <button
                          type="submit"
                          className="btn btn-primary w-100"
                          style={{ padding: '0.85rem', borderRadius: 12, fontWeight: 600 }}
                          disabled={loading}
                        >
                          {loading ? (
                            <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending…</>
                          ) : user ? (
                            <><i className="bi bi-send me-2"></i>Send Message</>
                          ) : (
                            <><i className="bi bi-lock me-2"></i>Sign In to Submit</>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* ── Sidebar ── */}
            <div className="col-12 col-lg-5">
              <div className="d-flex flex-column gap-3">

                {/* Emergency banner */}
                <div className="about-cta-banner p-4">
                  <div className="section-label mb-2">Emergency Support</div>
                  <h4 className="fw-bold mb-2" style={{ color: '#0f172a' }}>Need Help Right Now?</h4>
                  <p className="mb-3" style={{ color: '#4a5568', fontSize: '0.9rem' }}>
                    If you're actively experiencing a cybersecurity incident, don't wait —
                    use our secure reporting portal immediately.
                  </p>
                  <Link className="btn btn-danger w-100" to="/report" style={{ borderRadius: 12, fontWeight: 600 }}>
                    <i className="bi bi-exclamation-triangle me-2"></i>Report an Incident
                  </Link>
                </div>

                {/* Channels card */}
                <div className="contact-info-card p-4">
                  <div className="fw-bold mb-3" style={{ color: '#0f172a' }}>Other Ways to Reach Us</div>
                  <div className="d-flex flex-column gap-2">

                    {/* WhatsApp */}
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-channel-row text-decoration-none"
                      aria-label="WhatsApp"
                    >
                      <div className="contact-icon-box" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                        <i className="bi bi-whatsapp" style={{ color: '#16a34a' }}></i>
                      </div>
                      <div className="contact-channel-text">
                        <div className="fw-bold small" style={{ color: '#0f172a' }}>WhatsApp</div>
                        <div style={{ color: '#4a5568', fontSize: '0.82rem' }}>+1 (650) 218-4673 · 24/7 fastest response</div>
                      </div>
                      <i className="bi bi-arrow-right contact-channel-arrow"></i>
                    </a>

                    {/* Telegram */}
                    <a
                      href={tgLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-channel-row text-decoration-none"
                      aria-label="Telegram"
                    >
                      <div className="contact-icon-box" style={{ background: '#e8f4fd', border: '1px solid #bee3f8' }}>
                        <i className="bi bi-telegram" style={{ color: '#0088cc' }}></i>
                      </div>
                      <div className="contact-channel-text">
                        <div className="fw-bold small" style={{ color: '#0f172a' }}>Telegram</div>
                        <div style={{ color: '#4a5568', fontSize: '0.82rem', wordBreak: 'break-all' }}>@Wehelptrackscammersipaddress</div>
                      </div>
                      <i className="bi bi-arrow-right contact-channel-arrow"></i>
                    </a>

                    {/* Email */}
                    <a
                      href={emailLink}
                      className="contact-channel-row text-decoration-none"
                      aria-label="Email"
                    >
                      <div className="contact-icon-box" style={{ background: '#eef2ff', border: '1px solid #c7d2fe' }}>
                        <i className="bi bi-envelope-at-fill" style={{ color: '#4f46e5' }}></i>
                      </div>
                      <div className="contact-channel-text">
                        <div className="fw-bold small" style={{ color: '#0f172a' }}>Email Us</div>
                        <div style={{ color: '#4a5568', fontSize: '0.82rem', wordBreak: 'break-all' }}>wehelptrackscammersipaddress@mail.com</div>
                      </div>
                      <i className="bi bi-arrow-right contact-channel-arrow"></i>
                    </a>

                    {/* Official Website */}
                    <a
                      href={OFFICIAL_SITE}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-channel-row text-decoration-none"
                      aria-label="Official Website"
                    >
                      <div className="contact-icon-box">
                        <i className="bi bi-globe" style={{ color: '#1d4ed8' }}></i>
                      </div>
                      <div className="contact-channel-text">
                        <div className="fw-bold small" style={{ color: '#0f172a' }}>Official Website</div>
                        <div style={{ color: '#4a5568', fontSize: '0.82rem', wordBreak: 'break-all' }}>wehelptrackscammersipaddress.com</div>
                      </div>
                      <i className="bi bi-arrow-right contact-channel-arrow"></i>
                    </a>

                    {/* Live Chat — triggers site-wide chatbot */}
                    <button
                      className="contact-channel-row contact-channel-btn"
                      onClick={() => setShowChat(true)}
                      aria-label="Open Live Chat"
                    >
                      <div className="contact-icon-box" style={{ background: '#fef3c7', border: '1px solid #fde68a' }}>
                        <i className="bi bi-chat-dots-fill" style={{ color: '#d97706' }}></i>
                      </div>
                      <div className="contact-channel-text">
                        <div className="fw-bold small" style={{ color: '#0f172a' }}>Live Chat</div>
                        <div style={{ color: '#4a5568', fontSize: '0.82rem' }}>Reports, tools, threats, account &amp; more</div>
                      </div>
                      <i className="bi bi-arrow-right contact-channel-arrow"></i>
                    </button>

                  </div>
                </div>

                {/* Response time */}
                <div className="contact-info-card p-4">
                  <div className="fw-bold mb-3 small" style={{ color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Response Time
                  </div>
                  <div className="d-flex gap-3">
                    <div className="contact-stat flex-1 text-center">
                      <div className="contact-stat-value">24/7</div>
                      <div style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '0.25rem' }}>Emergency reports</div>
                    </div>
                    <div className="contact-stat flex-1 text-center">
                      <div className="contact-stat-value">48h</div>
                      <div style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '0.25rem' }}>General enquiries</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Site-wide Live Chat Modal */}
      <ContactLiveChat
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        navigate={navigate}
      />

    </div>
  )
}