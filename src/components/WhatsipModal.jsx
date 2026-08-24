/**
 * WhatsipModal — shared inline modal for:
 *   mode="hire"     → Hire Our Team intake form
 *   mode="report"   → Report This Threat form
 *   mode="request"  → Request Tools  ← completely rebuilt with intelligent chatbot
 *   mode="contact"  → Contact WHTS
 *   mode="recovery" → View Recovery Steps (no auth)
 */
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { openLiveChat, onAgentJoined } from '../utils/tidio'
import { genTicketId } from '../utils/ticketId'
import ChatSessionHistory from './ChatSessionHistory'
import './WhatsipModal.css'

/* ── Allowed countries — kept in sync with other forms ── */
const ALLOWED_COUNTRIES = [
  { code: 'US', name: 'United States',        dial: '+1'   },
  { code: 'CA', name: 'Canada',               dial: '+1'   },
  { code: 'GB', name: 'United Kingdom',       dial: '+44'  },
  { code: 'AU', name: 'Australia',            dial: '+61'  },
  { code: 'NZ', name: 'New Zealand',          dial: '+64'  },
  { code: 'DE', name: 'Germany',              dial: '+49'  },
  { code: 'FR', name: 'France',              dial: '+33'  },
  { code: 'NL', name: 'Netherlands',          dial: '+31'  },
  { code: 'SE', name: 'Sweden',               dial: '+46'  },
  { code: 'NO', name: 'Norway',               dial: '+47'  },
  { code: 'DK', name: 'Denmark',              dial: '+45'  },
  { code: 'FI', name: 'Finland',              dial: '+358' },
  { code: 'CH', name: 'Switzerland',          dial: '+41'  },
  { code: 'SG', name: 'Singapore',            dial: '+65'  },
  { code: 'JP', name: 'Japan',                dial: '+81'  },
  { code: 'KR', name: 'South Korea',          dial: '+82'  },
  { code: 'AE', name: 'United Arab Emirates', dial: '+971' },
  { code: 'QA', name: 'Qatar',               dial: '+974' },
  { code: 'IL', name: 'Israel',               dial: '+972' },
  { code: 'AT', name: 'Austria',              dial: '+43'  },
  { code: 'BE', name: 'Belgium',              dial: '+32'  },
  { code: 'IT', name: 'Italy',                dial: '+39'  },
  { code: 'ES', name: 'Spain',                dial: '+34'  },
  { code: 'PL', name: 'Poland',               dial: '+48'  },
  { code: 'PT', name: 'Portugal',             dial: '+351' },
  { code: 'IE', name: 'Ireland',              dial: '+353' },
  { code: 'GR', name: 'Greece',               dial: '+30'  },
  { code: 'CZ', name: 'Czechia',             dial: '+420' },
  { code: 'NG', name: 'Nigeria',              dial: '+234' },
]

/* ── Flag emoji from 2-letter country code ── */
const getCountryFlag = (code) => {
  if (!code || code.length !== 2) return '🌐'
  return String.fromCodePoint(
    ...code.toUpperCase().split('').map(c => 0x1F1E6 + c.charCodeAt(0) - 65)
  )
}

/* ── IP → country detection ── */
async function detectCountry() {
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  try {
    const r = await fetch(`${API_BASE}/geo`, { signal: AbortSignal.timeout(5000) })
    const d = await r.json()
    if (d.country_code && d.country_code.length === 2) return d.country_code
  } catch { /* fall through */ }
  try {
    const r = await fetch('https://ipwho.is/', { signal: AbortSignal.timeout(4000) })
    const d = await r.json()
    if (d.success && d.country_code) return d.country_code
  } catch { /* fall through */ }
  try {
    const r = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4000) })
    const d = await r.json()
    if (d.country_code) return d.country_code
  } catch { /* fall through */ }
  return null
}

/* ── Contact details ── */
const WHATSAPP_NUMBER   = '19293816441'
const TELEGRAM_USERNAME = 'WHTSIPA_DigitalTools'
const SUPPORT_EMAIL     = 'support@whtsipa.com'
const TG_CHANNEL_LINK   = 'https://t.me/WHTSIPA_DigitalTools'

/* ══════════════════════════════════════════
   TOOLS CHATBOT CONVERSATION TREE
   ══════════════════════════════════════════ */
const TOOLS_FLOW = {
  main: {
    text: "Welcome to WHTSIPA Tools AI Assistant! I can help you browse security tools, purchase specific ones, or submit a custom request. What would you like to do?",
    options: [
      { text: "🛠️ Browse available tools", next: "browse" },
      { text: "🛒 Purchase a specific tool", next: "purchase" },
      { text: "📝 Request a new / custom tool", next: "custom_req" },
      { text: "🧱 Botnet & network tools", next: "botnet" },
      { text: "🔍 Tracking & OSINT tools", next: "tracking" },
      { text: "🤝 Connect with a representative", next: "live_rep" },
    ]
  },
  browse: {
    text: "We offer security tools across these categories. Which area are you interested in?",
    options: [
      { text: "🦠 Malware & ransomware removal", next: "malware_tools" },
      { text: "🔐 Account & identity protection", next: "account_tools" },
      { text: "🌐 Network & DDoS protection", next: "network_tools" },
      { text: "📡 Surveillance & monitoring", next: "surveillance_tools" },
      { text: "💰 Crypto & financial fraud tools", next: "crypto_tools" },
      { text: "⬅️ Back to main menu", next: "main" },
    ]
  },
  malware_tools: {
    text: "Our Malware & Ransomware suite includes:\n• Advanced Antivirus EDR\n• Ransomware Decryption Assistance\n• Spyware & Keylogger Detector\n• RAT (Remote Access Trojan) Neutralizer\n\nAll tools come with expert guidance from our team.",
    options: [
      { text: "🛒 Purchase a malware tool", next: "purchase_confirm" },
      { text: "📝 Request custom malware solution", next: "custom_req" },
      { text: "⬅️ Back to browse", next: "browse" },
    ]
  },
  account_tools: {
    text: "Our Account & Identity Protection tools include:\n• MFA Enforcement Suite\n• SIM Swap Prevention Tool\n• Account Recovery Assistance\n• Dark Web Identity Monitor\n• Password Strength Auditor",
    options: [
      { text: "🛒 Purchase an account tool", next: "purchase_confirm" },
      { text: "📝 Request custom solution", next: "custom_req" },
      { text: "⬅️ Back to browse", next: "browse" },
    ]
  },
  network_tools: {
    text: "Our Network Security tools include:\n• DDoS Mitigation & Traffic Scrubbing\n• Botnet Detection & Cleanup\n• Network Segmentation Tool\n• API Security Gateway\n• Firewall Configuration Auditor",
    options: [
      { text: "🛒 Purchase a network tool", next: "purchase_confirm" },
      { text: "🧱 Tell me more about botnet tools", next: "botnet" },
      { text: "⬅️ Back to browse", next: "browse" },
    ]
  },
  surveillance_tools: {
    text: "Our Surveillance & Monitoring tools include:\n• CCTV Security Audit & Lockdown (NPAPK)\n• Insider Threat Monitor (UBA)\n• Real-time Activity Logger\n• Social Media Monitoring Dashboard",
    options: [
      { text: "🛒 Purchase a surveillance tool", next: "purchase_confirm" },
      { text: "📝 Request custom monitoring", next: "custom_req" },
      { text: "⬅️ Back to browse", next: "browse" },
    ]
  },
  crypto_tools: {
    text: "Our Crypto & Financial Fraud tools include:\n• Crypto Wallet Recovery Assistant\n• Blockchain Transaction Tracer\n• Crypto Drainer Detector\n• Investment Scam Evidence Package",
    options: [
      { text: "🛒 Purchase a crypto tool", next: "purchase_confirm" },
      { text: "📝 Request wallet recovery help", next: "custom_req" },
      { text: "⬅️ Back to browse", next: "browse" },
    ]
  },
  purchase: {
    text: "To purchase a specific tool, let me know which category interests you. Our team will provide pricing and complete the transaction securely.",
    options: [
      { text: "🦠 Malware / Ransomware Tools", next: "malware_tools" },
      { text: "🧱 Botnet Tools", next: "botnet" },
      { text: "🔍 Tracking / OSINT Tools", next: "tracking" },
      { text: "💰 Crypto Recovery Tools", next: "crypto_tools" },
      { text: "📲 Get pricing on Telegram", action: "open_tg" },
      { text: "⬅️ Back to main menu", next: "main" },
    ]
  },
  purchase_confirm: {
    text: "Great choice! To complete your purchase, our team will verify your requirements and provide a secure payment link. Connect directly via Telegram or WhatsApp with your Ticket ID above for the fastest processing.",
    options: [
      { text: "📲 Continue on Telegram (WHTSIPA Tools)", action: "open_tg" },
      { text: "💬 Continue on WhatsApp", action: "open_wa" },
      { text: "⬅️ Back to main menu", next: "main" },
    ]
  },
  custom_req: {
    text: "Requesting a custom tool is easy! Our engineering team reviews all requests. We can build or source tools for any specific threat you're facing. What type of tool do you need?",
    options: [
      { text: "🧱 Botnet-related tool", next: "botnet" },
      { text: "🔍 Tracking / investigation tool", next: "tracking" },
      { text: "🔐 Identity / account protection", next: "account_tools" },
      { text: "📡 Surveillance / monitoring tool", next: "surveillance_tools" },
      { text: "📲 Submit request on Telegram", action: "open_tg" },
      { text: "⬅️ Back to main menu", next: "main" },
    ]
  },
  botnet: {
    text: "Our Botnet & Network Security tools include:\n• Botnet Detection & Cleanup\n• Device Quarantine & Segmentation\n• Zombie Network Analyzer\n• C2 Server Takedown Assistance\n• Botnet Blocker Suite\n\nThese tools permanently eliminate botnet infections and fully secure your network.",
    options: [
      { text: "🛒 Purchase a botnet tool", next: "purchase_confirm" },
      { text: "📝 Request botnet investigation", next: "botnet_request" },
      { text: "🤝 Talk to a specialist now", next: "live_rep" },
      { text: "⬅️ Back to main menu", next: "main" },
    ]
  },
  botnet_request: {
    text: "For a botnet investigation or full cleanup, our specialists will analyze your network, identify all infected nodes, and provide a complete remediation plan. Connect via Telegram for the fastest response.",
    options: [
      { text: "📲 Start on Telegram (WHTSIPA Tools)", action: "open_tg" },
      { text: "💬 Start on WhatsApp", action: "open_wa" },
      { text: "⬅️ Back to main menu", next: "main" },
    ]
  },
  tracking: {
    text: "Our Tracking & OSINT tools include:\n• Grabify IP Tracker (capture IP via custom links)\n• Scammer IP Tracing Tool\n• Social Media Footprint Analyzer\n• Phone Number OSINT Tool\n• Digital Identity Tracer\n\nThese tools help neutralize and trace active threats.",
    options: [
      { text: "🛒 Purchase a tracking tool", next: "purchase_confirm" },
      { text: "📝 Request scammer trace", next: "tracking_request" },
      { text: "🤝 Talk to a specialist", next: "live_rep" },
      { text: "⬅️ Back to main menu", next: "main" },
    ]
  },
  tracking_request: {
    text: "Our tracking specialists can trace a scammer using IP logging, social media OSINT, and digital footprint analysis. We document everything for potential legal action. Ready to begin?",
    options: [
      { text: "📲 Start request on Telegram", action: "open_tg" },
      { text: "💬 Start request on WhatsApp", action: "open_wa" },
      { text: "⬅️ Back to main menu", next: "main" },
    ]
  },
  live_rep: {
    text: "Would you like to connect with a live representative? Please choose your preferred channel:",
    options: [
      { text: "💬 Connect via WhatsApp",                    action: "open_wa" },
      { text: "📲 Connect via Telegram",                    action: "open_tg" },
      { text: "🧑‍💼 Chat with an Active Representative",      next: "live_rep_confirm" },
      { text: "⬅️ Back to main menu",                      next: "main" },
    ]
  },
  live_rep_confirm: {
    text: "Would you like to chat with an Active Representative?\n\n⏱️ Estimated wait time: 15–20 minutes.\n\nAn available specialist will be assigned to your ticket and will reach out to you via your preferred contact channel (Telegram or WhatsApp).",
    options: [
      { text: "✅ Yes — Open Telegram Now",      action: "open_tg" },
      { text: "💬 Connect via WhatsApp instead", action: "open_wa" },
      { text: "⬅️ Back",                       next: "live_rep" },
    ]
  },
}

/* ══════════════════════════════════════════
   TOOLS LIVE CHAT COMPONENT
   ══════════════════════════════════════════ */
function ToolsLiveChat({ ticketId, threatTitle, onClose, onBack, user, userName, waLink, isHumanAgent = false }) {
  const [currentNode, setCurrentNode] = useState('main')
  // isHuman only becomes true when Tidio confirms an actual human agent connected (connect_human action).
  // Clicking "Open Telegram Now" does NOT flip this flag — the user left to Telegram, no in-app agent.
  const [isHuman, setIsHuman] = useState(isHumanAgent)
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('whts_tools_chat_messages')
    if (saved) {
      try { return JSON.parse(saved) } catch { /* ignore */ }
    }
    return [{
      sender: 'agent',
      text: `Hello ${userName || 'there'}! Welcome to WHTSIPA Help portal. How can we assist you today? ✅`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]
  })
  const [isTyping, setIsTyping] = useState(false)
  // Don't decide whether to show history until auth has actually finished
  // loading — deciding at mount time off `user` alone races against
  // AuthContext's async /auth/me check, so a fast click right after page
  // load could see `user` still null and permanently skip history for
  // that session even though the person really is logged in.
  const { loading: authLoading } = useAuth()
  const [showHistory, setShowHistory] = useState(false)
  useEffect(() => {
    if (!authLoading) setShowHistory(!!user)
  }, [authLoading, user])
  const chatEndRef = useRef(null)

  // Clear any stale "human" flag set by old code (open_tg incorrectly set it)
  useEffect(() => { localStorage.removeItem('whts_chat_ishuman') }, [])

  // Save chat messages to localStorage for session continuity (but NOT isHuman)
  useEffect(() => {
    localStorage.setItem('whts_tools_chat_messages', JSON.stringify(messages))
  }, [messages])

  // Track the ticket's real MongoDB _id (distinct from our own ticketId
  // string) so we can PATCH it later when a human agent actually joins —
  // the activity endpoint looks tickets up by _id, not by our ticketId.
  const ticketDbIdRef = useRef(null)

  // Listen for real Tidio agent connection event
  useEffect(() => {
    localStorage.removeItem('whts_chat_ishuman')
    onAgentJoined(() => {
      setIsHuman(true)
      if (ticketDbIdRef.current) {
        api.patch(`/tickets/${ticketDbIdRef.current}/activity`, { hasHumanAgent: true }).catch(() => { /* non-critical */ })
      }
    })
  }, [])

  useEffect(() => {
    const recordSession = async () => {
      try {
        const { data } = await api.post('/tickets/create', {
          ticketId,
          type: 'livechat',
          threatTitle: threatTitle || 'General Threat Tools Inquiry',
          summary: `AI Live Chat Session - ${threatTitle || 'General'}`,
          goals: `User initiated live chatbot conversation. Ref: ${threatTitle || 'General'}`,
          name: user?.firstName || user?.name || userName || 'Anonymous Client',
          email: user?.email || 'chat-client@whtsipa.com',
          contactMethod: 'Live Chat'
        })
        ticketDbIdRef.current = data._id
      } catch (err) {
        console.error('Error pre-registering ticket session:', err)
      }
    }
    recordSession()
  }, [ticketId, threatTitle, user, userName])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const selectOption = (opt) => {
    const userMsg = {
      sender: 'user',
      text: opt.text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)

    if (opt.action) {
      setTimeout(() => {
        setIsTyping(false)
        if (opt.action === 'open_tg') {
          window.open(TG_CHANNEL_LINK, '_blank')
          setMessages(prev => [...prev, {
            sender: 'agent',
            text: `Redirecting you to Telegram (@WHTSIPA_DigitalTools) now. \n\nYour Ticket ID is: ${ticketId} \u2014 please share it with the representative for faster assistance.\n\nℹ️ Note: You\'re now on Telegram. Our AI assistant here remains available if you have further questions.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }])
          // Do NOT set isHuman = true here — no Tidio agent has confirmed an in-app connection.
        } else if (opt.action === 'open_wa') {
          window.open(waLink, '_blank')
          setMessages(prev => [...prev, {
            sender: 'agent',
            text: `Opening WhatsApp now. Your Ticket ID is: ${ticketId} — our team will respond shortly.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }])
        } else if (opt.action === 'connect_human') {
          setIsHuman(true)
          setMessages(prev => [...prev, {
            sender: 'agent',
            text: `Connecting you with an Active Representative...\n\n⏱️ Estimated wait time: 15–20 minutes.\n\nYour Ticket ID is: ${ticketId} — an available specialist will be assigned and will respond directly to you shortly.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }])
          openLiveChat(
            `Visitor requesting an Active Representative from the Threats/Tools page.\nTicket ID: ${ticketId}${threatTitle ? `\nTool: ${threatTitle}` : ''}${user?.email ? `\nAccount: ${user.email}` : ''}`
          )
        }
      }, 900)
      return
    }

    if (opt.next) {
      setTimeout(() => {
        setIsTyping(false)
        const next = TOOLS_FLOW[opt.next]
        if (next) {
          setCurrentNode(opt.next)
          setMessages(prev => [...prev, {
            sender: 'agent',
            text: next.text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }])
        }
      }, 1100)
    }
  }

  const nodeData = TOOLS_FLOW[currentNode]

  return (
    <div className="wm-tools-chat">
      {/* Header */}
      <div className="wm-tools-chat-header">
        <button className="wm-tools-back-btn" onClick={onBack} aria-label="Back">
          <i className="bi bi-arrow-left"></i>
        </button>
        <div className="wm-tools-chat-avatar">
          <i className={`bi ${isHuman ? 'bi-person-fill' : 'bi-robot'} text-white`}></i>
        </div>
        <div className="wm-tools-chat-info">
          <div className="wm-tools-chat-title">WHTSIPA Live Support</div>
          <div className="wm-tools-chat-status" style={{ fontWeight: 700 }}>
            <span className="wm-tools-status-dot"></span>
            {isHuman ? `Active Representative (${messages.length})` : `Ai Representative (${messages.length})`}
          </div>
        </div>
        <button className="wm-close wm-tools-close-btn" onClick={onClose} aria-label="Close">
          <i className="bi bi-x-lg text-white"></i>
        </button>
      </div>

      {/* Session history (logged-in users only) */}
      {showHistory && (
        <ChatSessionHistory
          user={user}
          chatLabel="New Chat"
          onNewChat={() => setShowHistory(false)}
        />
      )}

      {/* Messages */}
      {!showHistory && (
        <>
          <div className="wm-tools-chat-body">
            {messages.map((m, i) => (
              <div key={i} className={`wm-tools-msg-row ${m.sender === 'user' ? 'wm-tools-user-row' : 'wm-tools-agent-row'}`}>
                <div className="wm-tools-bubble">
                  <div className="wm-tools-msg-text">{m.text}</div>
                  <div className="wm-tools-msg-time">{m.time}</div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="wm-tools-msg-row wm-tools-agent-row">
                <div className="wm-tools-bubble wm-tools-typing">
                  <span className="wm-tools-typing-dot"></span>
                  <span className="wm-tools-typing-dot"></span>
                  <span className="wm-tools-typing-dot"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Options */}
          {!isTyping && nodeData?.options && (
            <div className="wm-tools-options-panel">
              <div className="wm-tools-options-label">Select an option:</div>
              <div className="d-flex flex-column gap-1">
                {nodeData.options.map((opt, i) => (
                  <button key={i} type="button" className="wm-tools-opt-btn" onClick={() => selectOption(opt)}>
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════
   MAIN WHATSIP MODAL COMPONENT
   ══════════════════════════════════════════ */
export default function WhatsipModal({ mode, onClose, threatTitle = '' }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [ticketId] = useState(genTicketId)
  const [step, setStep] = useState('main')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    summary: '', services: [], duration: 'One-Time Assistance',
    goals: '', name: '', email: '', phone: '',
    phoneCountryCode: 'US', phoneDialCode: '+1', phoneDigits: '',
    contactMethod: '',
    evidence: null,
  })

  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        name: f.name || (user.firstName || user.name || ''),
        email: f.email || user.email || '',
      }))
    }
  }, [user])

  // Auto-detect country for phone code pre-fill
  useEffect(() => {
    detectCountry().then(code => {
      if (!code) return
      const match = ALLOWED_COUNTRIES.find(c => c.code === code)
      if (match) {
        setForm(f => ({ ...f, phoneCountryCode: match.code, phoneDialCode: match.dial }))
      }
    })
  }, [])

  // Phone dropdown ref for outside-click close
  const phoneDropdownRef = useRef(null)
  const [showPhoneDropdown, setShowPhoneDropdown] = useState(false)
  useEffect(() => {
    const handler = (e) => {
      if (phoneDropdownRef.current && !phoneDropdownRef.current.contains(e.target))
        setShowPhoneDropdown(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const waMessage = encodeURIComponent(
    `Hello WHTSIPA Tools Team,\n\nTicket ID: ${ticketId}\nTool Request: ${threatTitle || 'General Security Tools'}\nI need assistance.\n\n— ${user?.email || 'Guest'}`
  )
  const waLink   = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`
  const tgLink   = `https://t.me/${TELEGRAM_USERNAME}`
  const mailLink = `mailto:${SUPPORT_EMAIL}?subject=WHTSIPA%20Support%20%7C%20${ticketId}&body=Ticket%3A%20${ticketId}`

  /* Auth gate */
  if (!user && mode !== 'recovery') {
    return (
      <div className="wm-overlay" onClick={onClose}>
        <div className="wm-modal" onClick={e => e.stopPropagation()}>
          <button className="wm-close" onClick={onClose}><i className="bi bi-x-lg"></i></button>
          <div className="wm-auth-gate">
            <div className="wm-auth-icon"><i className="bi bi-shield-lock-fill"></i></div>
            <h3 className="wm-auth-title">Sign Up to Continue</h3>
            <p className="wm-auth-desc">
              You must create a free account before you can request tools, hire our team,
              or contact support. This ensures secure tracking and personalized service.
            </p>
            <div className="wm-auth-ticket">
              Your Ticket ID: <strong>{ticketId}</strong>
              <br/><small>Save this — it will be yours after sign up.</small>
            </div>
            <div className="d-flex gap-2 flex-wrap justify-content-center mt-3">
              <button className="btn btn-cyber" onClick={() => {
                onClose()
                navigate('/signup', { state: { from: window.location.pathname, reopenModal: mode, reopenThreatTitle: threatTitle } })
              }}>
                <i className="bi bi-person-plus me-2"></i>Create Free Account
              </button>
              <button className="btn btn-outline-cyber" onClick={() => {
                onClose()
                navigate('/signin', { state: { from: window.location.pathname, reopenModal: mode, reopenThreatTitle: threatTitle } })
              }}>
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* Recovery mode */
  if (mode === 'recovery') {
    const steps = threatTitle ? [
      { n: 1, title: 'Stop & Secure',      desc: 'Immediately disconnect the affected device. Change all passwords from a safe device.' },
      { n: 2, title: 'Document Everything', desc: 'Screenshot all evidence — messages, transactions, profiles, dates, amounts.' },
      { n: 3, title: 'Report Internally',   desc: 'Report to your bank, platform, and local cybercrime authority.' },
      { n: 4, title: 'Contact WHTSIPA',     desc: 'Submit a full incident report via WhatsApp or Telegram for expert case assignment.' },
      { n: 5, title: 'Monitor & Protect',   desc: 'Set up account alerts, enable 2FA everywhere, and follow up with our team.' },
    ] : []
    return (
      <div className="wm-overlay" onClick={onClose}>
        <div className="wm-modal wm-recovery" onClick={e => e.stopPropagation()}>
          <button className="wm-close" onClick={onClose}><i className="bi bi-x-lg"></i></button>
          <div className="wm-header">
            <i className="bi bi-shield-check wm-header-icon" style={{ color: '#22d3ee' }}></i>
            <div>
              <div className="wm-mode-label">Recovery Guide</div>
              <h3 className="wm-title">View Recovery Steps</h3>
              <p className="wm-subtitle">For: <strong>{threatTitle || 'this threat'}</strong></p>
            </div>
          </div>
          <div className="wm-steps-list">
            {steps.map(s => (
              <div key={s.n} className="wm-recovery-step">
                <div className="wm-step-num">{s.n}</div>
                <div><div className="wm-step-title">{s.title}</div><div className="wm-step-desc">{s.desc}</div></div>
              </div>
            ))}
          </div>
          <div className="wm-recovery-cta">
            <p className="wm-subtitle">Need personalised recovery support?</p>
            <div className="d-flex gap-2 flex-wrap">
              <a href={waLink} target="_blank" rel="noreferrer" className="wm-channel-btn wm-wa"><i className="bi bi-whatsapp"></i>WhatsApp (24/7)</a>
              <a href={tgLink} target="_blank" rel="noreferrer" className="wm-channel-btn wm-tg"><i className="bi bi-telegram"></i>Telegram</a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* Contact / Hire picker */
  if (mode === 'contact' || (mode === 'hire' && step === 'main')) {
    return (
      <div className="wm-overlay" onClick={onClose}>
        <div className="wm-modal" onClick={e => e.stopPropagation()}>
          <button className="wm-close" onClick={onClose}><i className="bi bi-x-lg"></i></button>
          <div className="wm-header">
            <i className={`bi ${mode === 'hire' ? 'bi-headset' : 'bi-chat-dots'} wm-header-icon`}></i>
            <div>
              <div className="wm-mode-label">{mode === 'hire' ? 'Hire Our Team' : 'Contact WHTSIPA'}</div>
              <h3 className="wm-title">{mode === 'hire' ? 'Connect With Our Experts' : 'Reach Us Instantly'}</h3>
              <p className="wm-subtitle">Choose how you'd like to connect.</p>
            </div>
          </div>
          <div className="wm-channels">
            <a href={waLink} target="_blank" rel="noreferrer" className="wm-channel-btn wm-wa">
              <i className="bi bi-whatsapp"></i><span><strong>WhatsApp</strong><small>24/7 support — fastest response</small></span><i className="bi bi-arrow-right ms-auto"></i>
            </a>
            <a href={tgLink} target="_blank" rel="noreferrer" className="wm-channel-btn wm-tg">
              <i className="bi bi-telegram"></i><span><strong>Telegram</strong><small>Instant messaging support</small></span><i className="bi bi-arrow-right ms-auto"></i>
            </a>
            <a href={mailLink} className="wm-channel-btn wm-email">
              <i className="bi bi-envelope"></i><span><strong>Email Us</strong><small>{SUPPORT_EMAIL}</small></span><i className="bi bi-arrow-right ms-auto"></i>
            </a>
            {mode === 'hire' && (
              <button className="wm-channel-btn wm-form" onClick={() => setStep('form')}>
                <i className="bi bi-file-earmark-text"></i><span><strong>Submit Hire Request Form</strong><small>Structured intake form — creates a ticket</small></span><i className="bi bi-arrow-right ms-auto"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  /* ════════════════════════════════════════
     REQUEST TOOLS — main picker
     ════════════════════════════════════════ */
  if (mode === 'request' && step === 'main') {
    return (
      <div className="wm-overlay" onClick={onClose}>
        <div className="wm-modal wm-request-main" onClick={e => e.stopPropagation()}>
          <button className="wm-close" onClick={onClose}><i className="bi bi-x-lg"></i></button>

          <div className="wm-header">
            <i className="bi bi-tools wm-header-icon" style={{ color: '#f59e0b' }}></i>
            <div>
              <div className="wm-mode-label">WHTSIPA Tools</div>
              <h3 className="wm-title">Request Security Tools</h3>
              <p className="wm-subtitle">
                {threatTitle
                  ? <>Requesting tools for: <strong>{threatTitle}</strong></>
                  : 'Choose how you\'d like to proceed.'}
              </p>
            </div>
          </div>

          <div className="wm-request-options">
            <button className="wm-request-option-card wm-roc-chat" onClick={() => setStep('livechat')}>
              <div className="wm-roc-icon"><i className="bi bi-robot"></i></div>
              <div className="wm-roc-body">
                <div className="wm-roc-title">
                  <span>AI Live Chat</span>
                  <span className="wm-roc-badge">Instant</span>
                </div>
                <div className="wm-roc-desc">
                  Powered by WHTSIPA Chatbot — browse tools, request botnet tools, purchase, get custom recommendations and more
                </div>
              </div>
              <i className="bi bi-arrow-right wm-roc-arrow"></i>
            </button>

            <a href={TG_CHANNEL_LINK} target="_blank" rel="noopener noreferrer" className="wm-request-option-card wm-roc-tg text-decoration-none">
              <div className="wm-roc-icon wm-roc-tg-icon"><i className="bi bi-telegram"></i></div>
              <div className="wm-roc-body">
                <div className="wm-roc-title">
                  <span>Telegram Chat</span>
                  <span className="wm-roc-badge wm-roc-badge-tg">Immediate</span>
                </div>
                <div className="wm-roc-username"><i className="bi bi-at me-1"></i>WHTSIPA_DigitalTools</div>
                <div className="wm-roc-desc">Immediate response available on our Telegram</div>
              </div>
              <i className="bi bi-arrow-right wm-roc-arrow"></i>
            </a>
          </div>

          {/* Footer — Telegram support channel */}
          <div className="wm-request-footer-info">
            <div className="wm-request-footer-label">
              <i className="bi bi-send me-1"></i>Join Telegram Support Channel
            </div>
            <a href={TG_CHANNEL_LINK} target="_blank" rel="noopener noreferrer" className="wm-tg-support-link">
              <i className="bi bi-telegram me-2"></i>
              <span>WHTSIPA Tools</span>
              <i className="bi bi-box-arrow-up-right ms-auto"></i>
            </a>
          </div>
        </div>
      </div>
    )
  }

  /* ════════════════════════════════════════
     REQUEST TOOLS — intelligent live chat
     ════════════════════════════════════════ */
  if (mode === 'request' && step === 'livechat') {
    return (
      <div className="wm-overlay" onClick={onClose}>
        <div className="wm-modal wm-livechat-modal" onClick={e => e.stopPropagation()}>
          <ToolsLiveChat
            ticketId={ticketId}
            threatTitle={threatTitle}
            onClose={onClose}
            onBack={() => setStep('main')}
            user={user}
            userName={user?.firstName || user?.name || ''}
            waLink={waLink}
          />
        </div>
      </div>
    )
  }

  /* ════════════════════════════════════════
     REPORT / HIRE / REQUEST FORM
     ════════════════════════════════════════ */
  if (step === 'form' || mode === 'report') {
    const isReport  = mode === 'report'
    const isHire    = mode === 'hire'
    const isRequest = mode === 'request'

    const title  = isReport ? 'Report This Threat' : isHire ? 'Submit Hire Request' : 'Submit Tool Request'
    const icon   = isReport ? 'bi-send' : isHire ? 'bi-headset' : 'bi-tools'
    const submit = isReport ? 'Submit Report' : isHire ? 'Create Ticket & Connect' : 'Send Request'

    const SERVICE_OPTIONS = isHire
      ? ['Scammer Tracking & Investigation', 'Full Recovery Support', 'Evidence Analysis & Reporting',
         'Law Enforcement / Insurance Documentation', 'Ongoing Protection & Monitoring', 'Other (please specify)']
      : []

    const handleSubmit = async (e) => {
      e.preventDefault()
      setLoading(true)
      setError('')
      try {
        const fileNames = form.evidence ? Array.from(form.evidence).map(f => f.name) : []
        await api.post('/tickets/create', {
          ticketId,
          type: isReport ? 'report' : isHire ? 'hire' : 'request',
          threatTitle: threatTitle || undefined,
          summary: form.summary,
          goals: form.goals,
          services: isHire ? form.services : [],
          duration: isHire ? form.duration : undefined,
          name: form.name,
          email: form.email,
          // For WhatsApp, combine dial code + digits into the phone field
          phone: form.contactMethod === 'WhatsApp'
            ? `${form.phoneDialCode}${form.phoneDigits}`
            : form.phone,
          contactMethod: form.contactMethod,
          evidenceFiles: fileNames
        })
        setStep('success')
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to submit request. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (step === 'success') {
      return (
        <div className="wm-overlay" onClick={onClose}>
          <div className="wm-modal" onClick={e => e.stopPropagation()}>
            <button className="wm-close" onClick={onClose}><i className="bi bi-x-lg"></i></button>
            <div className="wm-success">
              <div className="wm-success-icon"><i className="bi bi-check-circle-fill"></i></div>
              <h3 className="wm-success-title">Ticket Created!</h3>
              <div className="wm-ticket-ref wm-ticket-large">{ticketId}</div>
              <p className="wm-success-desc">
                Our specialist will assist you shortly. Keep your Ticket ID for reference.
              </p>
              <div className="d-flex gap-2 flex-wrap justify-content-center">
                <a href={waLink} target="_blank" rel="noreferrer" className="wm-channel-btn wm-wa"><i className="bi bi-whatsapp"></i>Continue on WhatsApp</a>
                <a href={tgLink} target="_blank" rel="noreferrer" className="wm-channel-btn wm-tg"><i className="bi bi-telegram"></i>Continue on Telegram</a>
              </div>
              <button className="btn btn-outline-cyber mt-3 w-100" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="wm-overlay" onClick={onClose}>
        <div className="wm-modal wm-form-modal" onClick={e => e.stopPropagation()}>
          <button className="wm-close" onClick={onClose}><i className="bi bi-x-lg"></i></button>
          <div className="wm-header">
            <i className={`bi ${icon} wm-header-icon`}></i>
            <div>
              <div className="wm-mode-label">WHTSIPA Support Ticket</div>
              <h3 className="wm-title">{title}</h3>
            </div>
          </div>

          <form className="wm-form" onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 mb-3" style={{ borderRadius: 10, fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}>
                <i className="bi bi-exclamation-circle-fill"></i>
                <span>{error}</span>
              </div>
            )}
            <div className="wm-field">
              <label>Incident / Case Summary <span className="wm-required">*</span></label>
              <textarea rows={3} placeholder="Briefly describe the issue or threat you're experiencing..."
                value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} required />
            </div>

            {isHire && (
              <div className="wm-field">
                <label>Services Requested</label>
                <div className="wm-checkboxes">
                  {SERVICE_OPTIONS.map(opt => (
                    <label key={opt} className="wm-checkbox-item">
                      <input type="checkbox" checked={form.services.includes(opt)}
                        onChange={e => setForm(f => ({
                          ...f, services: e.target.checked ? [...f.services, opt] : f.services.filter(s => s !== opt)
                        }))} />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {isHire && (
              <div className="wm-field">
                <label>Desired Engagement Duration</label>
                <select value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}>
                  {['One-Time Assistance (single incident)', '7 Days', '30 Days', '90 Days', 'Ongoing / Retainer', 'Other (specify)'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            )}

            <div className="wm-field">
              <label>{isHire ? 'Specific Goals / What You Need Help With' : isRequest ? 'Tools Required / Goals' : 'What Happened — Detailed Description'} <span className="wm-required">*</span></label>
              <textarea rows={3}
                placeholder={isHire ? 'Describe outcomes you want...' : isRequest ? 'List the tools or features you need...' : 'Provide as much detail as possible...'}
                value={form.goals} onChange={e => setForm(f => ({ ...f, goals: e.target.value }))} required />
            </div>

            <div className="wm-field">
              <label>Contact Information</label>
              {/* Full Name — always visible */}
              <input
                placeholder="Full Name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
                style={{ marginBottom: '0.75rem' }}
              />

              {/* Preferred Contact Method — ALWAYS shown, BEFORE the value input */}
              <label style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', display: 'block' }}>
                Preferred Contact Method <span className="wm-required">*</span>
              </label>
              <div className="wm-radio-row" style={{ marginBottom: '0.55rem' }}>
                {['WhatsApp', 'Telegram', 'Email'].map(m => (
                  <label key={m} className="wm-radio-item">
                    <input type="radio" name="contactMethod" value={m} checked={form.contactMethod === m}
                      onChange={() => setForm(f => ({ ...f, contactMethod: m }))} />
                    <span>{m}</span>
                  </label>
                ))}
              </div>

              {/* Contact value input — hidden until a method is selected */}
              {form.contactMethod === 'WhatsApp' && (() => {
                const fullDial = form.phoneDialCode || '+1'
                const dialDigits = fullDial.replace(/^\+/, '')
                const isValidDial = ALLOWED_COUNTRIES.some(c => c.dial === fullDial)

                const handleDialDigitsChange = (e) => {
                  const typed = e.target.value.replace(/\D/g, '')
                  const newFullDial = '+' + typed
                  const match = ALLOWED_COUNTRIES.find(c => c.dial === newFullDial)
                  if (match) {
                    setForm(f => ({ ...f, phoneCountryCode: match.code, phoneDialCode: match.dial }))
                  } else {
                    setForm(f => ({ ...f, phoneDialCode: newFullDial }))
                  }
                }

                return (
                  <div>
                    <div className="wm-phone-wrap" ref={phoneDropdownRef}>
                      {/* Country code selector button */}
                      <button
                        type="button"
                        className={`wm-phone-btn ${showPhoneDropdown ? 'is-active' : ''}`}
                        onClick={() => setShowPhoneDropdown(p => !p)}
                        title="Select country code"
                      >
                        <span className="wm-phone-flag">{getCountryFlag(form.phoneCountryCode)}</span>
                        <i className={`bi bi-caret-${showPhoneDropdown ? 'up' : 'down'}-fill wm-phone-arrow`}></i>
                      </button>

                      {/* Manual editable dial prefix — '+' is constant, digits are editable */}
                      <span className={`wm-phone-prefix ${!isValidDial && dialDigits.length > 0 ? 'wm-invalid-dial' : ''}`}>
                        <span className="plus-symbol">+</span>
                        <input
                          type="text"
                          className="wm-dial-input"
                          value={dialDigits}
                          onChange={handleDialDigitsChange}
                          placeholder="1"
                          maxLength={4}
                          title="Type country dial code"
                        />
                      </span>

                      {/* Editable digits only */}
                      <input
                        type="tel"
                        className="wm-phone-digits"
                        placeholder="Phone number digits"
                        value={form.phoneDigits}
                        onChange={e => setForm(f => ({ ...f, phoneDigits: e.target.value }))}
                        required
                      />

                      {/* Floating dropdown */}
                      {showPhoneDropdown && (
                        <div className="wm-phone-dropdown">
                          <ul className="wm-phone-list">
                            {ALLOWED_COUNTRIES.map(c => {
                              const isSelected = form.phoneCountryCode === c.code
                              return (
                                <li key={c.code}>
                                  <button
                                    type="button"
                                    className={`wm-phone-item ${isSelected ? 'active' : ''}`}
                                    onClick={() => {
                                      setForm(f => ({ ...f, phoneCountryCode: c.code, phoneDialCode: c.dial }))
                                      setShowPhoneDropdown(false)
                                    }}
                                  >
                                    <span className="wm-phone-item-flag">{getCountryFlag(c.code)}</span>
                                    <span className="wm-phone-item-text">{c.name} ({c.dial})</span>
                                  </button>
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                    {!isValidDial && dialDigits.length > 0 && (
                      <small className="wm-hint text-danger mt-1 d-block">
                        <i className="bi bi-exclamation-triangle me-1"></i>Country code +{dialDigits} is not in the allowed list.
                      </small>
                    )}
                  </div>
                )
              })()}

              {form.contactMethod === 'Telegram' && (
                <input
                  type="text"
                  placeholder="Input Telegram username (e.g. @username)"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  required
                />
              )}

              {form.contactMethod === 'Email' && (
                <input
                  type="email"
                  placeholder="Input email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              )}
              {!form.contactMethod && (
                <small className="wm-hint">Select a method above to enter your contact details.</small>
              )}
            </div>

            <div className="wm-field">
              <label>Evidence Upload <span className="wm-optional">(optional)</span></label>
              <input type="file" multiple accept="image/*,.pdf,.txt,.doc,.docx" className="wm-file-input"
                onChange={e => setForm(f => ({ ...f, evidence: e.target.files }))} />
              <small className="wm-hint">Screenshots, transaction records, emails, etc. Secure &amp; encrypted.</small>
            </div>

            <button type="submit" className="btn btn-alert w-100 mt-2" disabled={loading}>
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Submitting...</>
              ) : (
                <><i className="bi bi-send me-2"></i>{submit}</>
              )}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return null
}
