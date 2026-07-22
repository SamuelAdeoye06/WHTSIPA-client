import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import '../styles/cyber.css'
import './Report.css'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

/* ── Incident types (Updated per spec) ── */
const INCIDENT_TYPES = [
  'Phishing / Smishing / Vishing',
  'Account Compromise (Social Media, Email, etc.)',
  'Ransomware or Malware Infection',
  'Identity Theft or Fraud',
  'Romance Scam',
  'Fake Job / Investment / Crypto Scam',
  'Deepfake / AI-Generated Scam',
  'Stalking or Harassment',
  'Other (please specify)',
]

/* ── Allowed countries (client spec) ── */
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

/* ── Currency mapping per country code ── */
const COUNTRY_CURRENCIES = {
  US: 'USD $',
  CA: 'CAD $',
  GB: 'GBP £',
  AU: 'AUD $',
  NZ: 'NZD $',
  DE: 'EUR €',
  FR: 'EUR €',
  NL: 'EUR €',
  SE: 'SEK kr',
  NO: 'NOK kr',
  DK: 'DKK kr',
  FI: 'EUR €',
  CH: 'CHF CHF',
  SG: 'SGD $',
  JP: 'JPY ¥',
  KR: 'KRW ₩',
  AE: 'AED د.إ',
  QA: 'QAR ر.ق',
  IL: 'ILS ₪',
  AT: 'EUR €',
  BE: 'EUR €',
  IT: 'EUR €',
  ES: 'EUR €',
  PL: 'PLN zł',
  PT: 'EUR €',
  IE: 'EUR €',
  GR: 'EUR €',
  CZ: 'CZK Kč',
  NG: 'NGN ₦',
}

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

/* ── IP → country detection ── */
async function detectCountry() {
  try {
    const r = await fetch('https://ipapi.co/json/')
    const d = await r.json()
    return d.country_code || null
  } catch { return null }
}

const getFriendlyCode = (code) => {
  const mapping = {
    US: 'USA', CA: 'CAN', GB: 'UK', AU: 'AUS', NZ: 'NZL',
    DE: 'GER', FR: 'FRA', NL: 'NLD', SE: 'SWE', NO: 'NOR',
    DK: 'DNK', FI: 'FIN', CH: 'CHE', SG: 'SGP', JP: 'JPN',
    KR: 'KOR', AE: 'UAE', QA: 'QAT', IL: 'ISR', AT: 'AUT',
    BE: 'BEL', IT: 'ITA', ES: 'ESP', PL: 'POL', PT: 'PRT',
    IE: 'IRL', GR: 'GRC', CZ: 'CZE', NG: 'NGA'
  }
  return mapping[code] || code.toUpperCase()
}

/* ── Reusable Phone Field with Country Code Dropdown ── */
function PhoneCountryField({ formik, fieldName, phoneDialFieldName, phoneCodeFieldName, isRequired }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setShowDropdown(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selectedCode = formik.values[phoneCodeFieldName] || 'US'
  const selectedCountry = ALLOWED_COUNTRIES.find(c => c.code === selectedCode) || ALLOWED_COUNTRIES[0]

  return (
    <div className="phone-country-field-wrap">
      <label className="form-label cyber-label" htmlFor={fieldName}>
        Phone Number {isRequired ? <span className="text-danger">* (Required – with country code)</span> : <span className="text-muted-cyber">(Optional)</span>}
      </label>
      <div className="input-group" ref={dropdownRef}>
        <button
          type="button"
          className="btn phone-country-btn dropdown-toggle"
          onClick={() => setShowDropdown(prev => !prev)}
        >
          {selectedCountry ? `${getFriendlyCode(selectedCountry.code)} (${selectedCountry.dial})` : 'USA (+1)'}
        </button>
        <input
          id={fieldName}
          name={fieldName}
          type="tel"
          className={`form-control cyber-input ${formik.touched[fieldName] && formik.errors[fieldName] ? 'is-invalid' : ''}`}
          placeholder="Phone number digits"
          value={formik.values[fieldName]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {showDropdown && (
          <div className="phone-country-dropdown-menu">
            <ul className="list-unstyled mb-0">
              {ALLOWED_COUNTRIES.map(c => (
                <li key={c.code}>
                  <button
                    type="button"
                    className="phone-country-dropdown-item"
                    onClick={() => {
                      formik.setFieldValue(phoneCodeFieldName, c.code)
                      formik.setFieldValue(phoneDialFieldName, c.dial)
                      setShowDropdown(false)
                    }}
                  >
                    <span className="country-name">{c.name}</span>
                    <span className="country-dial">{getFriendlyCode(c.code)} ({c.dial})</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {formik.touched[fieldName] && formik.errors[fieldName] && (
        <div className="cyber-error-msg">
          <i className="bi bi-exclamation-triangle-fill me-1"></i>{formik.errors[fieldName]}
        </div>
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
      <i className="bi bi-cloud-upload" style={{ fontSize: '1.8rem', color: '#1d4ed8', opacity: 0.7 }}></i>
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

/* ── Live Support Chat Flow Configuration ── */
const CHAT_FLOW = {
  main: {
    text: "How can I help you with your incident reports, threat recovery, or related assistance today?",
    options: [
      { text: "📝 How do I report an incident?", next: "reporting_help" },
      { text: "🧭 How does threat recovery work?", next: "recovery_help" },
      { text: "🔒 What happens to my data?", next: "data_privacy" },
      { text: "🤝 Connect with a live agent", next: "live_agent" },
    ]
  },
  reporting_help: {
    text: "To report an incident, use the formal forms on this page. Choose 'Personal Report' if it affected you directly, or 'Public / Org Report' if it impacted an organisation or community. The forms require details, contact info, and any evidence files you can upload. Completing required fields enables submission.",
    options: [
      { text: "👤 Go to Personal Form", action: "go_personal" },
      { text: "🏢 Go to Public/Org Form", action: "go_public" },
      { text: "⬅️ Go back to main menu", next: "main" },
    ]
  },
  recovery_help: {
    text: "Our recovery steps are designed to help you secure your systems immediately. Scroll down to the 'Recover Now' section, select your incident category (e.g., Ransomware, Hacked Account, lost crypto wallet), and follow the numbered steps in sequence. Acting quickly limits the scope of breach.",
    options: [
      { text: "🛡️ Go to 'Recover Now' Section", action: "go_recover" },
      { text: "⬅️ Go back to main menu", next: "main" },
    ]
  },
  data_privacy: {
    text: "All submissions are handled confidentially. All uploads are encrypted and only accessible to verified Active Representatives. If you opt into 'Agreement to Share Anonymized Data', we remove all personal identifiers (names, emails, precise handles) before utilizing threat metadata for global intelligence mappings to protect the community.",
    options: [
      { text: "⬅️ Go back to main menu", next: "main" },
    ]
  },
  live_agent: {
    text: "Would you like to connect with a live representative? Please choose your preferred channel:",
    options: [
      { text: "💬 Connect via WhatsApp",                   action: "open_wa" },
      { text: "📲 Connect via Telegram",                   action: "open_tg" },
      { text: "🧑‍💼 Chat with an Active Representative",     next: "live_agent_confirm" },
      { text: "⬅️ Go back to main menu",                   next: "main" },
    ]
  },
  live_agent_confirm: {
    text: "Would you like to chat with an Active Representative?\n\n⏱️ Estimated wait time: 15–20 minutes.\n\nAn available specialist will be assigned to your ticket and will respond here shortly.",
    options: [
      { text: "✅ Yes — Connect me now",       action: "connect_human" },
      { text: "💬 Connect via WhatsApp instead", action: "open_wa" },
      { text: "⬅️ Back",                        next: "live_agent" },
    ]
  },
}

/* ── Live Support Chat Component ── */
function LiveChatModal({ isOpen, onClose, userName, setReportType, isHumanAgent = false }) {
  const [currentNode, setCurrentNode] = useState('main')
  const [isHuman, setIsHuman] = useState(isHumanAgent)
  const [messages, setMessages] = useState([
    {
      sender: 'agent',
      text: `Hello ${userName || 'there'}! Welcome to WHTSIPA Secure Live Support. I'm your AI assistant. How can I help you with your incident reports, threat recovery, or related assistance today?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef(null)

  // Listen for real Tidio agent connection event
  useEffect(() => {
    localStorage.removeItem('whts_chat_ishuman')
    if (window.tidioChatApi) {
      try {
        window.tidioChatApi.on('agentJoined', () => setIsHuman(true))
      } catch { /* ignore */ }
    }
  }, [])

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping])

  if (!isOpen) return null

  const selectOption = (opt) => {
    // 1. Add user message
    const userMsg = {
      sender: 'user',
      text: opt.text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)

    // 2. Perform action if specified
    if (opt.action) {
      setTimeout(() => {
        setIsTyping(false)
        if (opt.action === 'go_personal') {
          setReportType('personal')
          onClose()
          const el = document.getElementById('report')
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        } else if (opt.action === 'go_public') {
          setReportType('public')
          onClose()
          const el = document.getElementById('report')
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        } else if (opt.action === 'go_recover') {
          onClose()
          const el = document.getElementById('recover')
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        } else if (opt.action === 'open_wa') {
          window.open('https://wa.me/16502184673', '_blank')
        } else if (opt.action === 'open_tg') {
          window.open('https://t.me/Wehelptrackscammersipaddress', '_blank')
        } else if (opt.action === 'connect_human') {
          setMessages(prev => [...prev, {
            sender: 'agent',
            text: "Connecting to an Active Representative...\n\n⏱️ Estimated wait time: 15–20 minutes.\n\nYou have been placed in the queue. Our AI assistant remains available here, or connect directly via WhatsApp or Telegram for instant human response.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }])
          if (window.tidioChatApi) {
            try { window.tidioChatApi.show(); window.tidioChatApi.open() } catch { /* ignore */ }
          }
        }
      }, 1000)
      return
    }

    // 3. Move to next node
    if (opt.next) {
      setTimeout(() => {
        setIsTyping(false)
        const nextNode = CHAT_FLOW[opt.next]
        setCurrentNode(opt.next)
        const agentMsg = {
          sender: 'agent',
          text: nextNode.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
        setMessages(prev => [...prev, agentMsg])
      }, 1200)
    }
  }

  const handleSend = (e) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const userMsg = {
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages(prev => [...prev, userMsg])
    setInputText('')
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      const agentMsg = {
        sender: 'agent',
        text: "I am a security routing assistant. Please select one of the options below for structured routing, or use our direct WhatsApp/Telegram links to chat with an Active Representative.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages(prev => [...prev, agentMsg])
    }, 1500)
  }

  const currentNodeData = CHAT_FLOW[currentNode]

  return (
    <div className="wm-overlay" style={{ zIndex: 9999 }} onClick={onClose}>
      <div className="livechat-modal" onClick={e => e.stopPropagation()}>
        {/* Chat Header */}
        <div className="livechat-header">
          <div className="d-flex align-items-center gap-2">
            <div className="livechat-avatar">
              <i className={`bi ${isHuman ? 'bi-person-fill' : 'bi-shield-fill-check'} text-white`}></i>
            </div>
            <div>
              <div className="livechat-title text-white">WHTSIPA Live Support</div>
              <div className="livechat-status">
                <span className="livechat-status-dot"></span>
                {isHuman ? 'Active Representative Online' : 'AI Representative Online'}
              </div>
            </div>
          </div>
          <button className="livechat-close" onClick={onClose} aria-label="Close Chat">
            <i className="bi bi-x-lg text-white"></i>
          </button>
        </div>

        {/* Chat Body */}
        <div className="livechat-body">
          {messages.map((m, idx) => (
            <div key={idx} className={`livechat-msg-row ${m.sender === 'user' ? 'user-row' : 'agent-row'}`}>
              <div className="livechat-bubble">
                <div className="msg-text">{m.text}</div>
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

        {/* Quick Options Selection */}
        {!isTyping && currentNodeData && currentNodeData.options && (
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

        {/* Chat Footer */}
        <form className="livechat-footer" onSubmit={handleSend}>
          <input
            type="text"
            className="form-control livechat-input"
            placeholder="Type your message here..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
          />
          <button type="submit" className="btn btn-primary livechat-send-btn" style={{ color: '#ffffff', backgroundColor: '#1d4ed8' }}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              fill="#ffffff" 
              viewBox="0 0 16 16"
              style={{ fill: '#ffffff', color: '#ffffff', display: 'block' }}
            >
              <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
}

export default function Report() {
  const [reportType, setReportType]     = useState('personal') // 'personal' | 'public'
  const [files, setFiles]               = useState([])
  const [submitted, setSubmitted]       = useState(false)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')
  const [showLiveChat, setShowLiveChat] = useState(false)
  const [activeRecovery, setActiveRecovery] = useState(null)
  const isLoadedRef = useRef(false)

  const { user } = useAuth()
  const navigate = useNavigate()

  /* ── 1. Formik & Yup Validation: Personal Form ── */
  const personalFormik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      phone: '',
      phoneCountryCode: 'US',
      phoneCountryDial: '+1',
      country: '',
      communicationMethod: '',
      communicationValue: '',
      incidentTypes: [],
      incidentTypesOther: '',
      detail: '',
      financialLoss: '',
      financialLossCurrency: 'USD $',
      consentShareAnonymized: true,
      contactedAuthorities: '',
    },
    validationSchema: Yup.object({
      fullName: Yup.string(),
      email: Yup.string().email('Invalid email address'),
      phone: Yup.string().required('Phone Number is required'),
      country: Yup.string().required('Country of Residence is required'),
      communicationMethod: Yup.string().required('Preferred Communication Method is required'),
      communicationValue: Yup.string().test(
        'comm-value-required',
        'Please provide your contact details for the selected method',
        function (value) {
          const { communicationMethod } = this.parent
          if (['Email', 'Phone Call', 'SMS/Text', 'Secure Messaging App (e.g., Signal, WhatsApp)'].includes(communicationMethod)) {
            return !!value && value.trim().length > 0
          }
          return true
        }
      ),
      incidentTypes: Yup.array()
        .min(1, 'Please select at least one incident type')
        .max(3, 'You may select a maximum of 3 incident types')
        .required('Type of Incident is required'),
      incidentTypesOther: Yup.string().test(
        'is-required-other',
        'Please specify the other incident type',
        function (value) {
          const { incidentTypes } = this.parent
          if (incidentTypes && incidentTypes.includes('Other (please specify)')) {
            return !!value && value.trim().length > 0
          }
          return true
        }
      ),
      detail: Yup.string()
        .required('Report Details are required')
        .test(
          'min-25-words',
          'Please provide at least 25 words in your report details',
          value => value ? value.trim().split(/\s+/).filter(Boolean).length >= 25 : false
        ),
    }),
    onSubmit: async (values) => {
      await handleFormSubmit(values)
    }
  })

  /* ── 2. Formik & Yup Validation: Public/Org Form ── */
  const publicFormik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      phone: '',
      phoneCountryCode: 'US',
      phoneCountryDial: '+1',
      country: '',
      organization: '',
      communicationMethod: '',
      communicationValue: '',
      incidentTypes: [],
      incidentTypesOther: '',
      incidentStatus: '',
      incidentStatusOther: '',
      targetedName: '',
      socialHandles: '',
      linksImposterDetails: '',
      effectsOfIncident: '',
      detail: '',
    },
    validationSchema: Yup.object({
      fullName: Yup.string(),
      email: Yup.string().email('Invalid email address'),
      phone: Yup.string().required('Phone Number is required'),
      country: Yup.string().required('Country is required'),
      organization: Yup.string(),
      communicationMethod: Yup.string(),
      communicationValue: Yup.string().test(
        'pub-comm-value-required',
        'Please provide your contact details for the selected method',
        function (value) {
          const { communicationMethod } = this.parent
          if (['Email', 'SMS/Text'].includes(communicationMethod)) {
            return !!value && value.trim().length > 0
          }
          return true
        }
      ),
      incidentTypes: Yup.array()
        .min(1, 'Please select at least one incident type')
        .max(3, 'You may select a maximum of 3 incident types')
        .required('Type of Incident is required'),
      incidentTypesOther: Yup.string().test(
        'is-required-other',
        'Please specify the other incident type',
        function (value) {
          const { incidentTypes } = this.parent
          if (incidentTypes && incidentTypes.includes('Other (please specify)')) {
            return !!value && value.trim().length > 0
          }
          return true
        }
      ),
      incidentStatus: Yup.string().required('Status of Incident is required'),
      incidentStatusOther: Yup.string().test(
        'is-required-status-other',
        'Please specify the other status of incident',
        function (value) {
          const { incidentStatus } = this.parent
          if (incidentStatus === 'Others') {
            return !!value && value.trim().length > 0
          }
          return true
        }
      ),
      targetedName: Yup.string().required('Name of Targeted Organisation / Individual is required'),
      socialHandles: Yup.string().required('Social Media Handles or Targeted Websites is required'),
      linksImposterDetails: Yup.string(),
      effectsOfIncident: Yup.string().required('Effects of the Incident is required'),
      detail: Yup.string()
        .required('Report Details are required')
        .test(
          'min-25-words',
          'Please provide at least 25 words in your report details',
          value => value ? value.trim().split(/\s+/).filter(Boolean).length >= 25 : false
        ),
    }),
    onSubmit: async (values) => {
      await handleFormSubmit(values)
    }
  })

  /* ── 3. Submission Handler ── */
  const handleFormSubmit = async (values) => {
    if (!user) {
      // Save draft and redirect to sign in
      localStorage.setItem(
        reportType === 'personal' ? 'whts_personal_draft' : 'whts_public_draft',
        JSON.stringify(values)
      )
      navigate('/signin', { state: { from: '/report', scrollTo: 'report' } })
      return
    }

    setLoading(true)
    setError('')
    try {
      const payload = {
        reportType,
        fullName: reportType === 'personal' ? values.fullName : (values.fullName || 'Anonymous'),
        email: reportType === 'personal' ? values.email : (values.email || user.email),
        phone: `${values.phoneCountryDial} ${values.phone}`,
        country: values.country,
        incidentType: values.incidentTypes.join(', ') + (values.incidentTypes.includes('Other (please specify)') ? `: ${values.incidentTypesOther}` : ''),
        detail: values.detail,
        // Optional & spec conditional fields mapped to custom schema keys
        communicationMethod: values.communicationMethod,
        communicationValue: values.communicationValue,
        financialLoss: reportType === 'personal' && values.financialLoss ? `${values.financialLossCurrency} ${values.financialLoss}` : undefined,
        consentShareAnonymized: reportType === 'personal' ? values.consentShareAnonymized : undefined,
        contactedAuthorities: reportType === 'personal' ? values.contactedAuthorities : undefined,
        incidentStatus: reportType === 'public' ? (values.incidentStatus === 'Others' ? `Others: ${values.incidentStatusOther}` : values.incidentStatus) : undefined,
        organization: reportType === 'public' ? values.organization : undefined,
        targetedName: reportType === 'public' ? values.targetedName : undefined,
        socialHandles: reportType === 'public' ? values.socialHandles : undefined,
        linksImposterDetails: reportType === 'public' ? values.linksImposterDetails : undefined,
        effectsOfIncident: reportType === 'public' ? values.effectsOfIncident : undefined,
        evidenceFiles: files.map(f => f.name),
      }

      await api.post('/reports/submit', payload)

      // Clear draft on successful submit
      localStorage.removeItem(reportType === 'personal' ? 'whts_personal_draft' : 'whts_public_draft')
      setFiles([])
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  /* ── 4. Restore Drafts & Detect IP Country on Mount ── */
  useEffect(() => {
    const savedPersonal = localStorage.getItem('whts_personal_draft')
    if (savedPersonal) {
      try {
        personalFormik.setValues(JSON.parse(savedPersonal))
      } catch (e) {
        console.error('Error parsing personal draft', e)
      }
    }

    const savedPublic = localStorage.getItem('whts_public_draft')
    if (savedPublic) {
      try {
        publicFormik.setValues(JSON.parse(savedPublic))
      } catch (e) {
        console.error('Error parsing public draft', e)
      }
    }

    // IP Detection for country/dial prefill (if no drafts exist)
    detectCountry().then(code => {
      if (!code) return
      const match = ALLOWED_COUNTRIES.find(c => c.code === code)
      if (match) {
        if (!savedPersonal) {
          personalFormik.setFieldValue('country', match.code)
          personalFormik.setFieldValue('phoneCountryCode', match.code)
          personalFormik.setFieldValue('phoneCountryDial', match.dial)
          personalFormik.setFieldValue('financialLossCurrency', COUNTRY_CURRENCIES[match.code] || 'USD $')
        }
        if (!savedPublic) {
          publicFormik.setFieldValue('country', match.code)
          publicFormik.setFieldValue('phoneCountryCode', match.code)
          publicFormik.setFieldValue('phoneCountryDial', match.dial)
        }
      }
    })

    isLoadedRef.current = true
  }, [])

  /* ── 5. Auto-Save Drafts on change ── */
  useEffect(() => {
    if (!isLoadedRef.current) return
    localStorage.setItem('whts_personal_draft', JSON.stringify(personalFormik.values))
  }, [personalFormik.values])

  useEffect(() => {
    if (!isLoadedRef.current) return
    localStorage.setItem('whts_public_draft', JSON.stringify(publicFormik.values))
  }, [publicFormik.values])

  /* ── 6. Progress Calculations ── */
  const getPersonalProgress = () => {
    const required = ['fullName', 'email', 'phone', 'country', 'communicationMethod', 'detail']
    let filled = required.filter(field => !!personalFormik.values[field]).length
    if (personalFormik.values.incidentTypes && personalFormik.values.incidentTypes.length > 0) {
      // Validate incidentTypesOther dependency if "Other" is checked
      if (!personalFormik.values.incidentTypes.includes('Other (please specify)') || (personalFormik.values.incidentTypesOther && personalFormik.values.incidentTypesOther.trim() !== '')) {
        filled += 1
      }
    }
    return Math.round((filled / (required.length + 1)) * 100)
  }

  const getPublicProgress = () => {
    const required = ['phone', 'country', 'incidentStatus', 'targetedName', 'socialHandles', 'effectsOfIncident', 'detail']
    let filled = required.filter(field => !!publicFormik.values[field]).length
    if (publicFormik.values.incidentTypes && publicFormik.values.incidentTypes.length > 0) {
      if (!publicFormik.values.incidentTypes.includes('Other (please specify)') || (publicFormik.values.incidentTypesOther && publicFormik.values.incidentTypesOther.trim() !== '')) {
        filled += 1
      }
    }
    return Math.round((filled / (required.length + 1)) * 100)
  }

  const activeProgress = reportType === 'personal' ? getPersonalProgress() : getPublicProgress()

  return (
    <div className="page-light">
      <>
        {/* ════════════ HERO ════════════ */}
        <header className="report-hero">
          <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
            <div className="row g-4 align-items-stretch">

              <div className="col-12 col-lg-6">
                <div className="about-cta-banner p-4 h-100">
                  <div className="d-flex align-items-start gap-3 mb-4">
                    <div className="fvg-step-icon" style={{ background: '#fef2f2', border: '1px solid #fca5a5' }}>🛑</div>
                    <div>
                      <div className="section-label">Incident intake</div>
                      <h1 className="fw-bold mt-1 mb-1" style={{ color: '#0f172a', fontSize: 'clamp(1.4rem,2.5vw,2rem)' }}>Report an Incident</h1>
                      <p className="mb-0" style={{ color: '#4a5568', fontSize: '0.9rem' }}>
                        Every report is promptly reviewed and handled by our Active Representative.
                        Help us track scammers and protect others.
                      </p>
                    </div>
                  </div>
                  <span className="fvg-pill mb-3" style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626' }}>
                    🚨 EMERGENCY READY
                  </span>
                  <div className="e8-scan-bar mb-2"><span /></div>
                  <div className="mb-4" style={{ color: '#6b7280', fontSize: '0.85rem' }}>Secure intake — all reports open a support ticket with our team</div>
                  <a className="btn btn-danger w-100" href="#report" style={{ borderRadius: 12, fontWeight: 600 }}>
                    <i className="bi bi-exclamation-triangle me-2"></i>Start Your Report
                  </a>
                </div>
              </div>

              <div className="col-12 col-lg-6">
                <div className="about-cta-banner p-4 h-100">
                  <div className="d-flex align-items-start gap-3 mb-4">
                    <div className="fvg-step-icon">🧭</div>
                    <div>
                      <div className="section-label">Recovery workflow</div>
                      <h2 className="fw-bold mt-1 mb-1" style={{ color: '#0f172a', fontSize: 'clamp(1.4rem,2.5vw,2rem)' }}>Recover Now</h2>
                      <p className="mb-0" style={{ color: '#4a5568', fontSize: '0.9rem' }}>
                        Step-by-step recovery guidance for every type of cyberattack.
                        Act fast — every minute counts.
                      </p>
                    </div>
                  </div>
                  <span className="fvg-pill mb-3" style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#16a34a' }}>
                    ✅ SECURE RECOVERY
                  </span>
                  <ul className="list-unstyled mb-4" style={{ color: '#4a5568', fontSize: '0.88rem' }}>
                    <li className="mb-2"><i className="bi bi-check2 me-2" style={{ color: '#16a34a' }}></i>Contain and preserve evidence</li>
                    <li className="mb-2"><i className="bi bi-check2 me-2" style={{ color: '#16a34a' }}></i>Validate and remove the threat</li>
                    <li><i className="bi bi-check2 me-2" style={{ color: '#16a34a' }}></i>Restore with hardened controls</li>
                  </ul>
                  <a className="btn btn-primary w-100" href="#recover" style={{ borderRadius: 12, fontWeight: 600 }}>
                    <i className="bi bi-shield-check me-2"></i>Open Recovery Steps
                  </a>
                </div>
              </div>

            </div>
          </div>
        </header>

        {/* ════════════ MISSION ════════════ */}
        <section className="section-pad" style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <div className="container">
            <div className="row g-4 align-items-center">
              <div className="col-12 col-lg-7">
                <div className="section-label mb-2">Support Our Mission</div>
                <h2 className="fw-bold mb-3" style={{ color: '#0f172a' }}>Every Report Strengthens Our Mission</h2>
                <p className="mb-4" style={{ color: '#4a5568' }}>
                  Help strengthen WHTSIPA, ACSW, and WHTSIP by reporting cybersecurity incidents,
                  fraud, suspicious activity, and impersonation attempts.
                </p>
                <div className="d-flex flex-column gap-3">
                  {[
                    { icon: '🎫', title: 'Opens a support ticket', desc: 'You get rapid assistance from our Active Representative team.' },
                    { icon: '🔍', title: 'We investigate and resolve', desc: 'Every valid report is reviewed and handled by our specialists.' },
                    { icon: '🏛️', title: 'Contributes to official records', desc: 'Reports are shared with government agencies and relevant authorities.' },
                  ].map(item => (
                    <div key={item.title} className="d-flex gap-3">
                      <div className="fvg-step-icon">{item.icon}</div>
                      <div>
                        <div className="fw-bold" style={{ color: '#0f172a' }}>{item.title}</div>
                        <div style={{ color: '#4a5568', fontSize: '0.88rem' }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-12 col-lg-5">
                <div className="about-cta-banner p-4">
                  <div className="section-label mb-2">Have You Been Hacked?</div>
                  <h3 className="fw-bold mb-3" style={{ color: '#0f172a' }}>Act Immediately</h3>
                  <p className="mb-4" style={{ color: '#4a5568', fontSize: '0.9rem' }}>
                    If you suspect your personal information has been compromised,
                    don't wait. Learn exactly what to do and get help now.
                  </p>
                  <a className="btn btn-danger w-100 mb-2" href="#report" style={{ borderRadius: 12, fontWeight: 600 }}>
                    <i className="bi bi-exclamation-triangle me-2"></i>Get Help Now
                  </a>
                  <a className="btn btn-outline-secondary w-100" href="#recover" style={{ borderRadius: 12, fontWeight: 600 }}>
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

            {/* Success message (Updated per spec) */}
            {submitted ? (
              <div className="banner p-5 text-center">
                <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#0ea5e9' }}>
                  <i className="bi bi-check-circle-fill"></i>
                </div>
                <h3 className="fw-bold glow-text mb-3">Report Submitted</h3>
                <p className="text-muted-cyber mb-4" style={{ maxWidth: '62ch', margin: '0 auto 1.5rem', lineHeight: '1.6' }}>
                  {reportType === 'personal'
                    ? 'Thank you for reporting. Our Active Representative on WHTSIPA reviews all submissions confidentially. You will receive an acknowledgment and next steps via your preferred contact method.'
                    : 'Thank you for reporting. Our active WHTSIPA representatives review all submissions confidentially. You will receive an acknowledgment and next steps via your preferred contact method.'}
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <button className="btn btn-outline-cyber" onClick={() => {
                    setSubmitted(false)
                    setFiles([])
                    personalFormik.resetForm()
                    publicFormik.resetForm()
                  }}>
                    Submit Another Report
                  </button>
                  <a className="btn btn-cyber" href="#recover">View Recovery Steps</a>
                </div>
              </div>
            ) : (
              <div className="card-glass p-4 p-md-5">
                {/* Visual Progress indicator */}
                <div className="form-progress-bar-wrap mb-4">
                  <div className="d-flex justify-content-between align-items-baseline mb-2">
                    <span className="progress-title">Form Completion Progress</span>
                    <span className="progress-percentage">{activeProgress}%</span>
                  </div>
                  <div className="progress cyber-progress-bar">
                    <div className="progress-bar cyber-progress-bg" style={{ width: `${activeProgress}%`, transition: 'width 0.3s ease' }}></div>
                  </div>
                </div>

                <div className="report-form-header mb-2">
                  <h3 className="report-form-title fw-bold">
                    {reportType === 'personal' ? 'Personal Report Form' : 'Public Report Form'}
                  </h3>
                  <button
                    type="button"
                    className="btn-clear-draft"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to clear your current draft?')) {
                        if (reportType === 'personal') {
                          localStorage.removeItem('whts_personal_draft')
                          personalFormik.resetForm()
                        } else {
                          localStorage.removeItem('whts_public_draft')
                          publicFormik.resetForm()
                        }
                      }
                    }}
                  >
                    Clear Draft
                  </button>
                </div>
                <p className="report-form-subtitle mb-4">
                  Please complete the form below. Note that all fields marked with an astelish (*) are required.
                </p>

                {error && (
                  <div className="alert alert-danger d-flex align-items-center mb-4" role="alert" style={{ borderRadius: '12px', fontSize: '0.88rem' }}>
                    <i className="bi bi-exclamation-octagon-fill me-2"></i>
                    <div>{error}</div>
                  </div>
                )}

                {/* 👤 PERSONAL REPORT FORM */}
                {reportType === 'personal' && (
                  <form onSubmit={personalFormik.handleSubmit} noValidate>
                    <div className="row g-3">
                      <div className="col-12"><div className="section-label" style={{ fontSize: '0.68rem' }}>Contact Details</div></div>

                      {/* Full Name */}
                      <div className="col-12 col-md-6">
                        <label className="form-label cyber-label" htmlFor="personal-fullName">
                          Full Name <span className="text-muted-cyber fw-normal">(Optional – input nickname to remain anonymous)</span>
                        </label>
                        <input
                          id="personal-fullName"
                          name="fullName"
                          type="text"
                          placeholder="Your full name or nickname"
                          className="form-control cyber-input"
                          value={personalFormik.values.fullName}
                          onChange={personalFormik.handleChange}
                          onBlur={personalFormik.handleBlur}
                        />
                      </div>

                      {/* Email Address */}
                      <div className="col-12 col-md-6">
                        <label className="form-label cyber-label" htmlFor="personal-email">
                          Email Address <span className="text-muted-cyber fw-normal">(Optional – for confirmation and updates only)</span>
                        </label>
                        <input
                          id="personal-email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          className={`form-control cyber-input ${personalFormik.touched.email && personalFormik.errors.email ? 'is-invalid' : ''}`}
                          value={personalFormik.values.email}
                          onChange={personalFormik.handleChange}
                          onBlur={personalFormik.handleBlur}
                        />
                        {personalFormik.touched.email && personalFormik.errors.email && (
                          <div className="cyber-error-msg"><i className="bi bi-exclamation-triangle-fill me-1"></i>{personalFormik.errors.email}</div>
                        )}
                      </div>

                      {/* Country of Residence */}
                      <div className="col-12 col-md-6">
                        <label className="form-label cyber-label" htmlFor="personal-country">Country of Residence <span className="text-danger">* (Required)</span></label>
                        <select
                          id="personal-country"
                          name="country"
                          className={`form-select cyber-select ${personalFormik.touched.country && personalFormik.errors.country ? 'is-invalid' : ''}`}
                          value={personalFormik.values.country}
                          onChange={(e) => {
                            personalFormik.handleChange(e)
                            // Prefill currency & phone prefix based on chosen country
                            const code = e.target.value
                            const match = ALLOWED_COUNTRIES.find(c => c.code === code)
                            if (match) {
                              personalFormik.setFieldValue('phoneCountryCode', match.code)
                              personalFormik.setFieldValue('phoneCountryDial', match.dial)
                              personalFormik.setFieldValue('financialLossCurrency', COUNTRY_CURRENCIES[match.code] || 'USD $')
                            }
                          }}
                          onBlur={personalFormik.handleBlur}
                        >
                          <option value="">Choose country</option>
                          {ALLOWED_COUNTRIES.map(c => (
                            <option key={c.code} value={c.code}>{c.name}</option>
                          ))}
                        </select>
                        {personalFormik.touched.country && personalFormik.errors.country && (
                          <div className="cyber-error-msg"><i className="bi bi-exclamation-triangle-fill me-1"></i>{personalFormik.errors.country}</div>
                        )}
                      </div>

                      {/* Phone Number */}
                      <div className="col-12 col-md-6">
                        <PhoneCountryField
                          formik={personalFormik}
                          fieldName="phone"
                          phoneCodeFieldName="phoneCountryCode"
                          phoneDialFieldName="phoneCountryDial"
                          isRequired={true}
                        />
                      </div>

                      {/* Preferred Communication Method */}
                      <div className="col-12">
                        <label className="form-label cyber-label">Preferred Communication Method for Updates <span className="text-danger">* (Required)</span></label>
                        <div className="d-flex flex-wrap gap-3 mt-1">
                          {['Email', 'Phone Call', 'SMS/Text', 'Secure Messaging App (e.g., Signal, WhatsApp)'].map(method => (
                            <label key={method} className="cyber-checkbox-label" style={{ borderRadius: '10px' }}>
                              <input
                                type="radio"
                                name="communicationMethod"
                                value={method}
                                checked={personalFormik.values.communicationMethod === method}
                                onChange={personalFormik.handleChange}
                              />
                              <span>{method}</span>
                            </label>
                          ))}
                        </div>
                        {personalFormik.touched.communicationMethod && personalFormik.errors.communicationMethod && (
                          <div className="cyber-error-msg"><i className="bi bi-exclamation-triangle-fill me-1"></i>{personalFormik.errors.communicationMethod}</div>
                        )}

                        {/* Dynamic contact input based on selected method */}
                        {personalFormik.values.communicationMethod === 'Phone Call' && (
                          <div className="comm-value-wrap mt-3">
                            <label className="form-label cyber-label" htmlFor="personal-commVal-phone">
                              Phone number to call you on <span className="text-danger">*</span>
                            </label>
                            <input
                              id="personal-commVal-phone"
                              name="communicationValue"
                              type="tel"
                              placeholder="+1 234 567 8900"
                              className={`form-control cyber-input ${personalFormik.touched.communicationValue && personalFormik.errors.communicationValue ? 'is-invalid' : ''}`}
                              value={personalFormik.values.communicationValue}
                              onChange={personalFormik.handleChange}
                              onBlur={personalFormik.handleBlur}
                            />
                            {personalFormik.touched.communicationValue && personalFormik.errors.communicationValue && (
                              <div className="cyber-error-msg"><i className="bi bi-exclamation-triangle-fill me-1"></i>{personalFormik.errors.communicationValue}</div>
                            )}
                          </div>
                        )}

                        {personalFormik.values.communicationMethod === 'SMS/Text' && (
                          <div className="comm-value-wrap mt-3">
                            <label className="form-label cyber-label" htmlFor="personal-commVal-sms">
                              Phone number to SMS you on <span className="text-danger">*</span>
                            </label>
                            <input
                              id="personal-commVal-sms"
                              name="communicationValue"
                              type="tel"
                              placeholder="+1 234 567 8900"
                              className={`form-control cyber-input ${personalFormik.touched.communicationValue && personalFormik.errors.communicationValue ? 'is-invalid' : ''}`}
                              value={personalFormik.values.communicationValue}
                              onChange={personalFormik.handleChange}
                              onBlur={personalFormik.handleBlur}
                            />
                            {personalFormik.touched.communicationValue && personalFormik.errors.communicationValue && (
                              <div className="cyber-error-msg"><i className="bi bi-exclamation-triangle-fill me-1"></i>{personalFormik.errors.communicationValue}</div>
                            )}
                          </div>
                        )}

                        {personalFormik.values.communicationMethod === 'Secure Messaging App (e.g., Signal, WhatsApp)' && (
                          <div className="comm-value-wrap mt-3">
                            <label className="form-label cyber-label" htmlFor="personal-commVal-msg">
                              Your username or phone number on Signal/WhatsApp <span className="text-danger">*</span>
                            </label>
                            <input
                              id="personal-commVal-msg"
                              name="communicationValue"
                              type="text"
                              placeholder="e.g. +1 234 567 8900 or @username"
                              className={`form-control cyber-input ${personalFormik.touched.communicationValue && personalFormik.errors.communicationValue ? 'is-invalid' : ''}`}
                              value={personalFormik.values.communicationValue}
                              onChange={personalFormik.handleChange}
                              onBlur={personalFormik.handleBlur}
                            />
                            {personalFormik.touched.communicationValue && personalFormik.errors.communicationValue && (
                              <div className="cyber-error-msg"><i className="bi bi-exclamation-triangle-fill me-1"></i>{personalFormik.errors.communicationValue}</div>
                            )}
                          </div>
                        )}

                        {personalFormik.values.communicationMethod === 'Email' && (
                          <div className="comm-value-wrap mt-3">
                            <label className="form-label cyber-label" htmlFor="personal-commVal-email">
                              Email address to contact you on <span className="text-danger">*</span>
                            </label>
                            <input
                              id="personal-commVal-email"
                              name="communicationValue"
                              type="email"
                              placeholder="you@example.com"
                              className={`form-control cyber-input ${personalFormik.touched.communicationValue && personalFormik.errors.communicationValue ? 'is-invalid' : ''}`}
                              value={personalFormik.values.communicationValue}
                              onChange={personalFormik.handleChange}
                              onBlur={personalFormik.handleBlur}
                            />
                            {personalFormik.touched.communicationValue && personalFormik.errors.communicationValue && (
                              <div className="cyber-error-msg"><i className="bi bi-exclamation-triangle-fill me-1"></i>{personalFormik.errors.communicationValue}</div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="col-12 mt-2"><div className="section-label" style={{ fontSize: '0.68rem' }}>Incident details</div></div>

                      {/* Type of Incident Checkboxes */}
                      <div className="col-12">
                        <label className="form-label cyber-label">
                          Type of Incident <span className="text-danger">* (Required – select up to 3; selecting "Other" deselects all others)</span>
                        </label>
                        <div className="row g-2 mt-1">
                          {INCIDENT_TYPES.map(type => {
                            const isOtherSelected = personalFormik.values.incidentTypes.includes('Other (please specify)')
                            const isThisOther = type === 'Other (please specify)'
                            const isChecked = personalFormik.values.incidentTypes.includes(type)
                            const atMax = personalFormik.values.incidentTypes.length >= 3
                            const isDisabled = !isChecked && ((atMax && !isThisOther) || (isOtherSelected && !isThisOther))
                            return (
                              <div key={type} className="col-12 col-md-6">
                                <label className={`cyber-checkbox-label${isDisabled ? ' opacity-50' : ''}`}>
                                  <input
                                    type="checkbox"
                                    name="incidentTypes"
                                    value={type}
                                    checked={isChecked}
                                    disabled={isDisabled}
                                    onChange={(e) => {
                                      const checked = e.target.checked
                                      let updated
                                      if (isThisOther && checked) {
                                        // "Other" selected → deselect all others, select only Other
                                        updated = ['Other (please specify)']
                                      } else if (isThisOther && !checked) {
                                        updated = []
                                      } else {
                                        updated = checked
                                          ? [...personalFormik.values.incidentTypes, type]
                                          : personalFormik.values.incidentTypes.filter(t => t !== type)
                                      }
                                      personalFormik.setFieldValue('incidentTypes', updated)
                                    }}
                                  />
                                  <span className="cyber-checkbox-text">{type}</span>
                                </label>
                              </div>
                            )
                          })}
                        </div>
                        <div className="text-muted-cyber small mt-1">
                          {personalFormik.values.incidentTypes.length}/3 selected
                        </div>
                        {personalFormik.values.incidentTypes.includes('Other (please specify)') && (
                          <div className="mt-2">
                            <input
                              type="text"
                              name="incidentTypesOther"
                              placeholder="Please specify other incident type"
                              className={`form-control cyber-input ${personalFormik.touched.incidentTypesOther && personalFormik.errors.incidentTypesOther ? 'is-invalid' : ''}`}
                              value={personalFormik.values.incidentTypesOther}
                              onChange={personalFormik.handleChange}
                              onBlur={personalFormik.handleBlur}
                            />
                            {personalFormik.touched.incidentTypesOther && personalFormik.errors.incidentTypesOther && (
                              <div className="cyber-error-msg"><i className="bi bi-exclamation-triangle-fill me-1"></i>{personalFormik.errors.incidentTypesOther}</div>
                            )}
                          </div>
                        )}
                        {personalFormik.touched.incidentTypes && personalFormik.errors.incidentTypes && (
                          <div className="cyber-error-msg mt-2"><i className="bi bi-exclamation-triangle-fill me-1"></i>{personalFormik.errors.incidentTypes}</div>
                        )}
                      </div>

                      {/* Detail */}
                      <div className="col-12">
                        <label className="form-label cyber-label" htmlFor="personal-detail">Report Details <span className="text-danger">* (Required – minimum 25 words)</span></label>
                        <textarea
                          id="personal-detail"
                          name="detail"
                          rows={5}
                          placeholder="Please provide a clear description of what happened, including dates, platforms involved, and any suspicious communications."
                          className={`form-control cyber-input ${personalFormik.touched.detail && personalFormik.errors.detail ? 'is-invalid' : ''}`}
                          value={personalFormik.values.detail}
                          onChange={personalFormik.handleChange}
                          onBlur={personalFormik.handleBlur}
                        />
                        <div className="d-flex justify-content-between align-items-center mt-1">
                          <div>
                            {personalFormik.touched.detail && personalFormik.errors.detail && (
                              <div className="cyber-error-msg"><i className="bi bi-exclamation-triangle-fill me-1"></i>{personalFormik.errors.detail}</div>
                            )}
                          </div>
                          <small className={`text-end ${
                            personalFormik.values.detail.trim().split(/\s+/).filter(Boolean).length >= 25 ? 'text-success' : 'text-muted-cyber'
                          }`}>
                            {personalFormik.values.detail.trim().split(/\s+/).filter(Boolean).length} / 25 words
                          </small>
                        </div>
                      </div>

                      {/* Total Financial Losses */}
                      <div className="col-12 col-md-6">
                        <label className="form-label cyber-label" htmlFor="personal-financialLoss">Total Financial Losses <span className="text-muted-cyber">(Optional)</span></label>
                        <div className="input-group">
                          <select
                            name="financialLossCurrency"
                            className="form-select cyber-select"
                            style={{ 
                              maxWidth: '120px', 
                              fontSize: '0.82rem', 
                              paddingLeft: '0.5rem', 
                              paddingRight: '1.5rem', 
                              borderRight: 'none', 
                              borderRadius: '12px 0 0 12px' 
                            }}
                            value={personalFormik.values.financialLossCurrency}
                            onChange={personalFormik.handleChange}
                            onBlur={personalFormik.handleBlur}
                          >
                            {ALLOWED_COUNTRIES.map(c => {
                              const cur = COUNTRY_CURRENCIES[c.code] || 'USD $'
                              return (
                                <option key={c.code} value={cur}>
                                  {getFriendlyCode(c.code)} ({cur})
                                </option>
                              )
                            })}
                          </select>
                          <input
                            id="personal-financialLoss"
                            name="financialLoss"
                            type="text"
                            placeholder="e.g. 10000"
                            className="form-control cyber-input"
                            style={{ borderRadius: '0 12px 12px 0' }}
                            value={personalFormik.values.financialLoss}
                            onChange={personalFormik.handleChange}
                            onBlur={personalFormik.handleBlur}
                          />
                        </div>
                      </div>

                      {/* Have you contacted bank/authorities */}
                      <div className="col-12 col-md-6">
                        <label className="form-label cyber-label" htmlFor="personal-authorities">Have you contacted your bank, platform, or authorities? <span className="text-muted-cyber">(Optional)</span></label>
                        <select
                          id="personal-authorities"
                          name="contactedAuthorities"
                          className="form-select cyber-select"
                          value={personalFormik.values.contactedAuthorities}
                          onChange={personalFormik.handleChange}
                          onBlur={personalFormik.handleBlur}
                        >
                          <option value="">Select option</option>
                          <option value="Yes, contacted bank and authorities">Yes, bank & authorities</option>
                          <option value="Only bank / platform">Only bank / platform</option>
                          <option value="No, not yet">No, not yet</option>
                          <option value="In Progress">In Progress</option>
                        </select>
                      </div>

                      {/* Evidence upload */}
                      <div className="col-12">
                        <label className="cyber-label mb-2 d-block">Supporting Evidence <span className="text-muted-cyber small">(Optional but highly recommended)</span></label>
                        <FileUpload files={files} onChange={setFiles} />
                      </div>

                      {/* Agreement to Share Anonymized Data */}
                      <div className="col-12">
                        <div className="card-glass p-3 mt-2">
                          <label className="form-label cyber-label fw-bold">Privacy & Community Contribution</label>
                          <p className="text-muted-cyber small mb-3">
                            I consent to sharing anonymized details of this incident for threat intelligence purposes to help protect others in the community.
                          </p>
                          <div className="d-flex flex-column gap-2">
                            <label className="cyber-checkbox-label">
                              <input
                                type="radio"
                                name="consentShareAnonymized"
                                checked={personalFormik.values.consentShareAnonymized === true}
                                onChange={() => personalFormik.setFieldValue('consentShareAnonymized', true)}
                              />
                              <span>Yes, I agree (recommended)</span>
                            </label>
                            <label className="cyber-checkbox-label">
                              <input
                                type="radio"
                                name="consentShareAnonymized"
                                checked={personalFormik.values.consentShareAnonymized === false}
                                onChange={() => personalFormik.setFieldValue('consentShareAnonymized', false)}
                              />
                              <span>No, I prefer full privacy</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Submit */}
                      <div className="col-12 mt-4">
                        <button
                          type="submit"
                          disabled={loading || (activeProgress < 100)}
                          className="btn btn-alert w-100"
                          style={{
                            padding: '0.85rem',
                            color: '#fff',
                            background: 'linear-gradient(180deg, rgba(220,38,38,0.85), rgba(185,28,28,0.9))',
                            border: '1px solid rgba(220,38,38,0.6)',
                            opacity: (activeProgress < 100) ? 0.65 : 1,
                            cursor: (activeProgress < 100) ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {loading ? (
                            <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Submitting...</>
                          ) : user ? (
                            <><i className="bi bi-send me-2"></i>Submit Report</>
                          ) : (
                            <><i className="bi bi-lock me-2"></i>Sign In to Submit Report</>
                          )}
                        </button>
                        <p className="text-muted-cyber small text-center mt-2 mb-0">
                          {activeProgress < 100
                            ? 'Please complete all required fields marked with * to enable submission.'
                            : 'By submitting you agree your report will be reviewed by our team and may be shared with relevant authorities.'}
                        </p>
                      </div>

                    </div>
                  </form>
                )}

                {/* 🏢 PUBLIC / ORG REPORT FORM */}
                {reportType === 'public' && (
                  <form onSubmit={publicFormik.handleSubmit} noValidate>
                    <div className="row g-3">
                      <div className="col-12"><div className="section-label" style={{ fontSize: '0.68rem' }}>Reporter Information</div></div>

                      {/* Full Name or Nickname */}
                      <div className="col-12 col-md-6">
                        <label className="form-label cyber-label" htmlFor="public-fullName">Full Name or nickname <span className="text-muted-cyber">(Optional – you can remain anonymous)</span></label>
                        <input
                          id="public-fullName"
                          name="fullName"
                          type="text"
                          placeholder="Your name or nickname"
                          className="form-control cyber-input"
                          value={publicFormik.values.fullName}
                          onChange={publicFormik.handleChange}
                          onBlur={publicFormik.handleBlur}
                        />
                      </div>

                      {/* Email Address */}
                      <div className="col-12 col-md-6">
                        <label className="form-label cyber-label" htmlFor="public-email">Email Address <span className="text-muted-cyber">(Optional – for confirmation and updates only)</span></label>
                        <input
                          id="public-email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          className={`form-control cyber-input ${publicFormik.touched.email && publicFormik.errors.email ? 'is-invalid' : ''}`}
                          value={publicFormik.values.email}
                          onChange={publicFormik.handleChange}
                          onBlur={publicFormik.handleBlur}
                        />
                        {publicFormik.touched.email && publicFormik.errors.email && (
                          <div className="cyber-error-msg"><i className="bi bi-exclamation-triangle-fill me-1"></i>{publicFormik.errors.email}</div>
                        )}
                      </div>

                      {/* Country */}
                      <div className="col-12 col-md-6">
                        <label className="form-label cyber-label" htmlFor="public-country">Country <span className="text-danger">* (Required – for threat mapping)</span></label>
                        <select
                          id="public-country"
                          name="country"
                          className={`form-select cyber-select ${publicFormik.touched.country && publicFormik.errors.country ? 'is-invalid' : ''}`}
                          value={publicFormik.values.country}
                          onChange={(e) => {
                            publicFormik.handleChange(e)
                            const code = e.target.value
                            const match = ALLOWED_COUNTRIES.find(c => c.code === code)
                            if (match) {
                              publicFormik.setFieldValue('phoneCountryCode', match.code)
                              publicFormik.setFieldValue('phoneCountryDial', match.dial)
                            }
                          }}
                          onBlur={publicFormik.handleBlur}
                        >
                          <option value="">Choose country</option>
                          {ALLOWED_COUNTRIES.map(c => (
                            <option key={c.code} value={c.code}>{c.name}</option>
                          ))}
                        </select>
                        {publicFormik.touched.country && publicFormik.errors.country && (
                          <div className="cyber-error-msg"><i className="bi bi-exclamation-triangle-fill me-1"></i>{publicFormik.errors.country}</div>
                        )}
                      </div>

                      {/* Phone Number */}
                      <div className="col-12 col-md-6">
                        <PhoneCountryField
                          formik={publicFormik}
                          fieldName="phone"
                          phoneCodeFieldName="phoneCountryCode"
                          phoneDialFieldName="phoneCountryDial"
                          isRequired={true}
                        />
                      </div>

                      {/* Organisation */}
                      <div className="col-12 col-md-6">
                        <label className="form-label cyber-label" htmlFor="public-organization">Organisation <span className="text-muted-cyber">(Optional – if reporting on behalf of a company, organisation, or another person)</span></label>
                        <input
                          id="public-organization"
                          name="organization"
                          type="text"
                          placeholder="Organisation name"
                          className="form-control cyber-input"
                          value={publicFormik.values.organization}
                          onChange={publicFormik.handleChange}
                          onBlur={publicFormik.handleBlur}
                        />
                      </div>

                      {/* Preferred Communication Method */}
                      <div className="col-12 col-md-6">
                        <label className="form-label cyber-label">Preferred Communication Method for Updates <span className="text-muted-cyber">(Optional)</span></label>
                        <div className="d-flex flex-wrap gap-2 mt-1">
                          {['Email', 'SMS/Text', 'No follow-up needed (fully anonymous)'].map(method => (
                            <label key={method} className="cyber-checkbox-label">
                              <input
                                type="radio"
                                name="communicationMethod"
                                value={method}
                                checked={publicFormik.values.communicationMethod === method}
                                onChange={publicFormik.handleChange}
                              />
                              <span>{method}</span>
                            </label>
                          ))}
                        </div>

                        {/* Dynamic contact input based on selected method */}
                        {publicFormik.values.communicationMethod === 'Email' && (
                          <div className="comm-value-wrap mt-3">
                            <label className="form-label cyber-label" htmlFor="public-commVal-email">
                              Email address to contact you on <span className="text-muted-cyber fw-normal">(Optional)</span>
                            </label>
                            <input
                              id="public-commVal-email"
                              name="communicationValue"
                              type="email"
                              placeholder="you@example.com"
                              className="form-control cyber-input"
                              value={publicFormik.values.communicationValue}
                              onChange={publicFormik.handleChange}
                              onBlur={publicFormik.handleBlur}
                            />
                          </div>
                        )}

                        {publicFormik.values.communicationMethod === 'SMS/Text' && (
                          <div className="comm-value-wrap mt-3">
                            <label className="form-label cyber-label" htmlFor="public-commVal-sms">
                              Phone number to SMS you on <span className="text-muted-cyber fw-normal">(Optional)</span>
                            </label>
                            <input
                              id="public-commVal-sms"
                              name="communicationValue"
                              type="tel"
                              placeholder="+1 234 567 8900"
                              className="form-control cyber-input"
                              value={publicFormik.values.communicationValue}
                              onChange={publicFormik.handleChange}
                              onBlur={publicFormik.handleBlur}
                            />
                          </div>
                        )}
                      </div>

                      <div className="col-12 mt-2"><div className="section-label" style={{ fontSize: '0.68rem' }}>Incident Information</div></div>

                      {/* Type of Incident */}
                      <div className="col-12">
                        <label className="form-label cyber-label">
                          Type of Incident <span className="text-danger">* (Required – select up to 3; selecting "Other" deselects all others)</span>
                        </label>
                        <div className="row g-2 mt-1">
                          {INCIDENT_TYPES.map(type => {
                            const isOtherSelected = publicFormik.values.incidentTypes.includes('Other (please specify)')
                            const isThisOther = type === 'Other (please specify)'
                            const isChecked = publicFormik.values.incidentTypes.includes(type)
                            const atMax = publicFormik.values.incidentTypes.length >= 3
                            const isDisabled = !isChecked && ((atMax && !isThisOther) || (isOtherSelected && !isThisOther))
                            return (
                              <div key={type} className="col-12 col-md-6">
                                <label className={`cyber-checkbox-label${isDisabled ? ' opacity-50' : ''}`}>
                                  <input
                                    type="checkbox"
                                    name="incidentTypes"
                                    value={type}
                                    checked={isChecked}
                                    disabled={isDisabled}
                                    onChange={(e) => {
                                      const checked = e.target.checked
                                      let updated
                                      if (isThisOther && checked) {
                                        updated = ['Other (please specify)']
                                      } else if (isThisOther && !checked) {
                                        updated = []
                                      } else {
                                        updated = checked
                                          ? [...publicFormik.values.incidentTypes, type]
                                          : publicFormik.values.incidentTypes.filter(t => t !== type)
                                      }
                                      publicFormik.setFieldValue('incidentTypes', updated)
                                    }}
                                  />
                                  <span className="cyber-checkbox-text">{type}</span>
                                </label>
                              </div>
                            )
                          })}
                        </div>
                        <div className="text-muted-cyber small mt-1">
                          {publicFormik.values.incidentTypes.length}/3 selected
                        </div>
                        {publicFormik.values.incidentTypes.includes('Other (please specify)') && (
                          <div className="mt-2">
                            <input
                              type="text"
                              name="incidentTypesOther"
                              placeholder="Please specify other incident type"
                              className={`form-control cyber-input ${publicFormik.touched.incidentTypesOther && publicFormik.errors.incidentTypesOther ? 'is-invalid' : ''}`}
                              value={publicFormik.values.incidentTypesOther}
                              onChange={publicFormik.handleChange}
                              onBlur={publicFormik.handleBlur}
                            />
                            {publicFormik.touched.incidentTypesOther && publicFormik.errors.incidentTypesOther && (
                              <div className="cyber-error-msg"><i className="bi bi-exclamation-triangle-fill me-1"></i>{publicFormik.errors.incidentTypesOther}</div>
                            )}
                          </div>
                        )}
                        {publicFormik.touched.incidentTypes && publicFormik.errors.incidentTypes && (
                          <div className="cyber-error-msg mt-2"><i className="bi bi-exclamation-triangle-fill me-1"></i>{publicFormik.errors.incidentTypes}</div>
                        )}
                      </div>

                      {/* Status of Incident */}
                      <div className="col-12 col-md-6">
                        <label className="form-label cyber-label" htmlFor="public-incidentStatus">Status of Incident <span className="text-danger">* (Required)</span></label>
                        <select
                          id="public-incidentStatus"
                          name="incidentStatus"
                          className={`form-select cyber-select ${publicFormik.touched.incidentStatus && publicFormik.errors.incidentStatus ? 'is-invalid' : ''}`}
                          value={publicFormik.values.incidentStatus}
                          onChange={publicFormik.handleChange}
                          onBlur={publicFormik.handleBlur}
                        >
                          <option value="">Select status</option>
                          <option value="Ongoing / Active">Ongoing / Active</option>
                          <option value="Spam report">Spam report</option>
                          <option value="Requires Investigation">Requires Investigation</option>
                          <option value="Needs to be Neutralized">Needs to be Neutralized</option>
                          <option value="Others">Others</option>
                        </select>
                        {publicFormik.values.incidentStatus === 'Others' && (
                          <div className="mt-2">
                            <input
                              type="text"
                              name="incidentStatusOther"
                              placeholder="Please specify other incident status"
                              className={`form-control cyber-input ${publicFormik.touched.incidentStatusOther && publicFormik.errors.incidentStatusOther ? 'is-invalid' : ''}`}
                              value={publicFormik.values.incidentStatusOther}
                              onChange={publicFormik.handleChange}
                              onBlur={publicFormik.handleBlur}
                            />
                            {publicFormik.touched.incidentStatusOther && publicFormik.errors.incidentStatusOther && (
                              <div className="cyber-error-msg"><i className="bi bi-exclamation-triangle-fill me-1"></i>{publicFormik.errors.incidentStatusOther}</div>
                            )}
                          </div>
                        )}
                        {publicFormik.touched.incidentStatus && publicFormik.errors.incidentStatus && (
                          <div className="cyber-error-msg"><i className="bi bi-exclamation-triangle-fill me-1"></i>{publicFormik.errors.incidentStatus}</div>
                        )}
                      </div>

                      {/* Name of Targeted Organisation / Individual */}
                      <div className="col-12 col-md-6">
                        <label className="form-label cyber-label" htmlFor="public-targetedName">Name of Targeted Organisation / Individual <span className="text-danger">* (Required)</span></label>
                        <input
                          id="public-targetedName"
                          name="targetedName"
                          type="text"
                          placeholder="Who was targeted?"
                          className={`form-control cyber-input ${publicFormik.touched.targetedName && publicFormik.errors.targetedName ? 'is-invalid' : ''}`}
                          value={publicFormik.values.targetedName}
                          onChange={publicFormik.handleChange}
                          onBlur={publicFormik.handleBlur}
                        />
                        {publicFormik.touched.targetedName && publicFormik.errors.targetedName && (
                          <div className="cyber-error-msg"><i className="bi bi-exclamation-triangle-fill me-1"></i>{publicFormik.errors.targetedName}</div>
                        )}
                      </div>

                      {/* Social Media Handles or Targeted Websites */}
                      <div className="col-12 col-md-6">
                        <label className="form-label cyber-label" htmlFor="public-socialHandles">Social Media Handles or Targeted Websites <span className="text-danger">* (Required)</span></label>
                        <input
                          id="public-socialHandles"
                          name="socialHandles"
                          type="text"
                          placeholder="@handle or https://example.com"
                          className={`form-control cyber-input ${publicFormik.touched.socialHandles && publicFormik.errors.socialHandles ? 'is-invalid' : ''}`}
                          value={publicFormik.values.socialHandles}
                          onChange={publicFormik.handleChange}
                          onBlur={publicFormik.handleBlur}
                        />
                        {publicFormik.touched.socialHandles && publicFormik.errors.socialHandles && (
                          <div className="cyber-error-msg"><i className="bi bi-exclamation-triangle-fill me-1"></i>{publicFormik.errors.socialHandles}</div>
                        )}
                      </div>

                      {/* Links or Imposter Details */}
                      <div className="col-12 col-md-6">
                        <label className="form-label cyber-label" htmlFor="public-linksImposterDetails">Links or Imposter Details <span className="text-muted-cyber">(Optional – e.g., fake profiles, suspicious URLs, phone numbers)</span></label>
                        <input
                          id="public-linksImposterDetails"
                          name="linksImposterDetails"
                          type="text"
                          placeholder="e.g. fake profile link, scam numbers"
                          className="form-control cyber-input"
                          value={publicFormik.values.linksImposterDetails}
                          onChange={publicFormik.handleChange}
                          onBlur={publicFormik.handleBlur}
                        />
                      </div>

                      {/* Effects of the Incident */}
                      <div className="col-12">
                        <label className="form-label cyber-label" htmlFor="public-effectsOfIncident">Effects of the Incident <span className="text-danger">* (Required)</span></label>
                        <textarea
                          id="public-effectsOfIncident"
                          name="effectsOfIncident"
                          rows={3}
                          placeholder="Please describe the impact (e.g., financial loss, data breach, emotional distress, reputational harm, or other consequences)."
                          className={`form-control cyber-input ${publicFormik.touched.effectsOfIncident && publicFormik.errors.effectsOfIncident ? 'is-invalid' : ''}`}
                          value={publicFormik.values.effectsOfIncident}
                          onChange={publicFormik.handleChange}
                          onBlur={publicFormik.handleBlur}
                        />
                        {publicFormik.touched.effectsOfIncident && publicFormik.errors.effectsOfIncident && (
                          <div className="cyber-error-msg"><i className="bi bi-exclamation-triangle-fill me-1"></i>{publicFormik.errors.effectsOfIncident}</div>
                        )}
                      </div>

                      {/* Detail */}
                      <div className="col-12">
                        <label className="form-label cyber-label" htmlFor="public-detail">Report Details <span className="text-danger">* (Required – minimum 25 words)</span></label>
                        <textarea
                          id="public-detail"
                          name="detail"
                          rows={5}
                          placeholder="Please provide a clear and detailed description of the incident, including dates, how it occurred, and any impact."
                          className={`form-control cyber-input ${publicFormik.touched.detail && publicFormik.errors.detail ? 'is-invalid' : ''}`}
                          value={publicFormik.values.detail}
                          onChange={publicFormik.handleChange}
                          onBlur={publicFormik.handleBlur}
                        />
                        <div className="d-flex justify-content-between align-items-center mt-1">
                          <div>
                            {publicFormik.touched.detail && publicFormik.errors.detail && (
                              <div className="cyber-error-msg"><i className="bi bi-exclamation-triangle-fill me-1"></i>{publicFormik.errors.detail}</div>
                            )}
                          </div>
                          <small className={`text-end ${
                            publicFormik.values.detail.trim().split(/\s+/).filter(Boolean).length >= 25 ? 'text-success' : 'text-muted-cyber'
                          }`}>
                            {publicFormik.values.detail.trim().split(/\s+/).filter(Boolean).length} / 25 words
                          </small>
                        </div>
                      </div>

                      {/* Evidence upload */}
                      <div className="col-12">
                        <label className="cyber-label mb-2 d-block">Evidence Files <span className="text-muted-cyber small">(Optional but strongly recommended)</span></label>
                        <FileUpload files={files} onChange={setFiles} />
                      </div>

                      {/* Submit */}
                      <div className="col-12 mt-4">
                        <button
                          type="submit"
                          disabled={loading || (activeProgress < 100)}
                          className="btn btn-alert w-100"
                          style={{
                            padding: '0.85rem',
                            color: '#fff',
                            background: 'linear-gradient(180deg, rgba(220,38,38,0.85), rgba(185,28,28,0.9))',
                            border: '1px solid rgba(220,38,38,0.6)',
                            opacity: (activeProgress < 100) ? 0.65 : 1,
                            cursor: (activeProgress < 100) ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {loading ? (
                            <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Submitting...</>
                          ) : user ? (
                            <><i className="bi bi-send me-2"></i>Submit Report</>
                          ) : (
                            <><i className="bi bi-lock me-2"></i>Sign In to Submit Report</>
                          )}
                        </button>
                        <p className="text-muted-cyber small text-center mt-2 mb-0">
                          {activeProgress < 100
                            ? 'Please complete all required fields marked with * to enable submission.'
                            : 'By submitting you agree your report will be reviewed by our team and may be shared with relevant authorities.'}
                        </p>
                      </div>

                    </div>
                  </form>
                )}
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
                <i className="bi bi-hand-index" style={{ fontSize: '1.5rem', color: '#1d4ed8', opacity: 0.6 }}></i>
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

              {/* Newsletter signup — only shown to guests */}
              {!user && (
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
                        <label className="form-label cyber-label" htmlFor="signupFirst">First Name</label>
                        <input id="signupFirst" type="text" className="form-control cyber-input" placeholder="First name" />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label cyber-label" htmlFor="signupLast">Last Name</label>
                        <input id="signupLast" type="text" className="form-control cyber-input" placeholder="Last name" />
                      </div>
                      <div className="col-12">
                        <label className="form-label cyber-label" htmlFor="signupEmail">Email Address</label>
                        <input id="signupEmail" type="email" className="form-control cyber-input" placeholder="you@example.com" />
                      </div>
                      <div className="col-12">
                        <button className="btn btn-cyber w-100" type="button">
                          <i className="bi bi-bell me-2"></i>Sign Up for Recovery Alerts
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact / support card — full width when signed in, half when guest */}
              <div className={`col-12 ${!user ? 'col-lg-6' : 'col-lg-8 mx-auto'}`}>
                <div className="banner p-4 h-100">
                  <div className="section-label mb-2">Direct Support</div>
                  <h3 className="fw-bold mb-2">Need Immediate Help?</h3>
                  <p className="text-muted-cyber small mb-4">
                    Our Active Representative is available for urgent cybersecurity cases.
                    Reach us through our secure support channels.
                  </p>
                  <div className="d-flex flex-column gap-3">
                    {/* Live Chat */}
                    <div
                      className="d-flex gap-3 align-items-center card-glass p-3 contact-card"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setShowLiveChat(true)}
                    >
                      <div className="icon-box">
                        <i className="bi bi-chat-dots-fill"></i>
                      </div>
                      <div>
                        <div className="fw-bold text-cyber-glow">Live Chat</div>
                        <div className="text-muted-cyber small">Get help with reports, recovery, and related assistance.</div>
                      </div>
                    </div>
                    {/* WhatsApp Us */}
                    <a
                      href="https://wa.me/16502184673"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="d-flex gap-3 align-items-center card-glass p-3 contact-card text-decoration-none"
                      style={{ color: 'inherit' }}
                    >
                      <div className="icon-box" style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)' }}>
                        <i className="bi bi-whatsapp" style={{ color: '#22c55e' }}></i>
                      </div>
                      <div>
                        <div className="fw-bold">WhatsApp Us</div>
                        <div className="text-muted-cyber small">
                          <span className="text-cyber-glow fw-bold">+1 (650) 218-4673</span>
                          <div className="text-muted small mt-1">(Connect with an Active Representative)</div>
                        </div>
                      </div>
                    </a>
                    {/* Telegram Support */}
                    <a
                      href="https://t.me/Wehelptrackscammersipaddress"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="d-flex gap-3 align-items-center card-glass p-3 contact-card text-decoration-none"
                      style={{ color: 'inherit' }}
                    >
                      <div className="icon-box" style={{ background: 'rgba(0,136,204,0.12)', border: '1px solid rgba(0,136,204,0.3)' }}>
                        <i className="bi bi-telegram" style={{ color: '#0088cc' }}></i>
                      </div>
                      <div>
                        <div className="fw-bold">Telegram Support</div>
                        <div className="text-muted-cyber small">
                          <span className="text-cyber-glow fw-bold">@Wehelptrackscammersipaddress</span>
                          <div className="text-muted small mt-1">(The Officials)</div>
                        </div>
                      </div>
                    </a>
                    {/* Email Us */}
                    <a
                      href="mailto:wehelptrackscammersipaddress@mail.com"
                      className="d-flex gap-3 align-items-center card-glass p-3 contact-card text-decoration-none"
                      style={{ color: 'inherit' }}
                    >
                      <div className="icon-box" style={{ background: 'rgba(30,58,138,0.12)', border: '1px solid rgba(30,58,138,0.3)' }}>
                        <i className="bi bi-envelope-at-fill" style={{ color: '#1e3a8a' }}></i>
                      </div>
                      <div>
                        <div className="fw-bold">Email Us</div>
                        <div className="text-muted-cyber small">
                          <span className="text-cyber-glow fw-bold">wehelptrackscammersipaddress@mail.com</span>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Live Support Chat Modal overlay */}
        <LiveChatModal
          isOpen={showLiveChat}
          onClose={() => setShowLiveChat(false)}
          userName={user?.firstName}
          setReportType={setReportType}
        />
      </>
    </div>
  )
}