import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { QUIZ_LIST, QUIZ_DATA } from '../data/quizData'
import WhatsipModal from '../components/WhatsipModal'
import ThreatsFooter from '../components/ThreatsFooter'
import '../styles/cyber.css'
import './Threats.css'
import './Report.css'   /* shared livechat modal styles */
import { THREATS_AND_TOOLS } from '../data/threatsToolsData'

/* ─────────────────────────────────────────────────────────
   ADMIN-CONFIGURABLE CONTACT DETAILS — Threats page only
   These will be managed via the admin panel once built.
   To update temporarily: edit the values below.
───────────────────────────────────────────────────────── */
const THREATS_CONTACTS = {
  whatsapp:  { number: '+1 (650) 281-4251', url: 'https://wa.me/16502814251' },
  telegram:  { handle: '@WHTSIPA_DigitalTools', url: 'https://t.me/WHTSIPA_DigitalTools' },
  email:     { address: 'wehelptrackscammersipaddress@mail.com', url: 'mailto:wehelptrackscammersipaddress@mail.com' },
  website:   { label: 'wehelptrackscammersipaddress.com', url: 'https://wehelptrackscammersipaddress.com' },
}

/* ══════════════════════════════════════════════════════════
   THREATS-SPECIFIC LIVE CHAT FLOW
   Focused on: threat education, scam recovery, reporting,
   and connecting to live representatives
   ══════════════════════════════════════════════════════════ */
const THREATS_CHAT_FLOW = {
  main: {
    text: "Welcome to WHTSIPA Threat Support! I'm here to help with threat education, recovery steps, reporting cyber incidents, and connecting you to our team. What can I help you with?",
    options: [
      { text: '🦠 I think I have malware / ransomware',      next: 'threat_malware' },
      { text: '💰 I was scammed (romance / investment)',      next: 'threat_scam' },
      { text: '🔐 My account was hacked / compromised',      next: 'threat_account' },
      { text: '🕵️ I received a phishing / smishing attack',  next: 'threat_phishing' },
      { text: '🌐 I need to report a cybercrime',            next: 'reporting' },
      { text: '📚 Learn about types of threats',             next: 'threat_library' },
      { text: '🚨 Connect me to a live agent NOW',           next: 'live_agent' },
    ]
  },
  threat_malware: {
    text: "Malware and ransomware infections require immediate action:\n\n1. ❌ Disconnect from the internet NOW — stops data exfiltration\n2. 🚫 Do NOT pay the ransom — rarely results in file recovery\n3. 📸 Preserve the ransom note and error messages as screenshots\n4. 🔒 Do not restart — may trigger encryption of remaining files\n5. 📞 Contact WHTSIPA for professional malware analysis and decryption support\n\nOur team can assist with Ransomware Decryption, RAT Neutralisation, and Spyware Removal.",
    options: [
      { text: '🛠️ What tools can remove it?',     next: 'malware_tools' },
      { text: '📝 Report this malware incident',  action: 'go_report' },
      { text: '🚨 Connect to a live agent',       next: 'live_agent' },
      { text: '⬅️ Back to main menu',             next: 'main' },
    ]
  },
  malware_tools: {
    text: "WHTSIPA provides the following tools for malware and ransomware:\n\n• 🛡️ Advanced Antivirus EDR (Endpoint Detection & Response)\n• 🔑 Ransomware Decryption Assistance\n• 🕵️ Spyware & Keylogger Detector\n• 🤖 RAT (Remote Access Trojan) Neutralizer\n• 🧹 Full System Deep Clean & Audit\n\nAll tools come with expert guidance from our certified team.",
    options: [
      { text: '🛒 Request malware removal tools',  action: 'go_tools' },
      { text: '🚨 Connect to a live agent',        next: 'live_agent' },
      { text: '⬅️ Back',                           next: 'threat_malware' },
    ]
  },
  threat_scam: {
    text: "Romance, investment, and crypto scams are devastating. Key warning signs:\n\n🚩 Being pushed to move to private apps (Telegram, Signal)\n🚩 Promises of guaranteed investment returns\n🚩 Urgent requests for crypto, gift cards, or wire transfers\n🚩 Emotional pressure to act fast or keep it secret\n\nIf you've lost money — act immediately. Time is critical for fund tracing.",
    options: [
      { text: '💸 I lost money — what do I do first?',  next: 'scam_lost_money' },
      { text: '📝 Report this scam now',               action: 'go_report' },
      { text: '🛠️ Recovery and tracing tools',          action: 'go_tools' },
      { text: '🚨 Connect to a live agent',            next: 'live_agent' },
      { text: '⬅️ Back to main menu',                  next: 'main' },
    ]
  },
  scam_lost_money: {
    text: "If you've lost money to a scam, take these steps immediately:\n\n1. 🏦 Contact your bank — request a chargeback (usually within 120 days)\n2. 🔐 Change all passwords on affected accounts from a clean device\n3. 📸 Screenshot ALL communication — do not delete anything\n4. 📋 Note all transaction IDs, wallet addresses, and amounts\n5. 📞 Report to WHTSIPA — our team assists with fund tracing and legal evidence packages\n\nFor crypto losses, blockchain tracing is still possible after transfers.",
    options: [
      { text: '📝 File a full incident report',  action: 'go_report' },
      { text: '🔍 Crypto & fund tracing tools',  action: 'go_tools' },
      { text: '🚨 Speak to a specialist now',    next: 'live_agent' },
      { text: '⬅️ Back',                         next: 'threat_scam' },
    ]
  },
  threat_account: {
    text: "Account compromises require urgent action:\n\n1. 🔑 Change password immediately from a DIFFERENT, unaffected device\n2. ✅ Enable Two-Factor Authentication (2FA) everywhere, right now\n3. 🚪 Revoke all active sessions and connected third-party apps\n4. 📢 Alert your contacts — attacker may impersonate you\n5. 🏦 If banking is involved — freeze the account and call your bank\n\nAct fast — every minute matters.",
    options: [
      { text: '📝 Report this account compromise',  action: 'go_report' },
      { text: '🔐 Account protection tools',        action: 'go_tools' },
      { text: '🚨 Connect to a live agent',         next: 'live_agent' },
      { text: '⬅️ Back to main menu',              next: 'main' },
    ]
  },
  threat_phishing: {
    text: "Phishing, smishing (SMS), and vishing (phone calls) are the most common threats:\n\n📧 Phishing Email: Do NOT click links or download attachments. Report to your email provider. If you clicked — change your passwords immediately.\n\n📱 Smishing (SMS): Do not click the link. If you tapped — check for new apps and revoke permissions.\n\n📞 Vishing (Fake calls): Hang up — real banks will NEVER ask for OTP or passwords over the phone.",
    options: [
      { text: '📝 Report this phishing attack',  action: 'go_report' },
      { text: '📚 Explore threat library',       next: 'threat_library' },
      { text: '🚨 Connect to a live agent',      next: 'live_agent' },
      { text: '⬅️ Back to main menu',            next: 'main' },
    ]
  },
  reporting: {
    text: "WHTSIPA accepts two types of cybercrime reports:\n\n👤 Personal Report — For incidents that directly affected you (phishing, scams, account hacks, identity theft, financial fraud)\n\n🏢 Public / Org Report — For incidents affecting organisations, communities, or third parties\n\nAll reports are handled confidentially and assigned to our specialist team.",
    options: [
      { text: '👤 File a Personal Report',         action: 'go_report' },
      { text: '🏢 File a Public / Org Report',     action: 'go_report' },
      { text: '📋 What information do I need?',    next: 'reporting_info' },
      { text: '⬅️ Back to main menu',              next: 'main' },
    ]
  },
  reporting_info: {
    text: "For a strong report, please prepare:\n\n• Your name, email, and phone number\n• Incident date and description of what happened\n• Communication screenshots (emails, messages, profiles)\n• Financial transaction records if money was lost\n• Crypto wallet addresses or transaction IDs if applicable\n• Suspect social media handles, links, or phone numbers\n\nThe more detail you provide, the faster our team can act.",
    options: [
      { text: '📝 Go to Report page now',  action: 'go_report' },
      { text: '⬅️ Back to reporting',      next: 'reporting' },
    ]
  },
  threat_library: {
    text: "Our Threats Library covers the most dangerous cybersecurity threats. Which category would you like to explore?",
    options: [
      { text: '🦠 Malware, Ransomware & Spyware',       next: 'threat_malware' },
      { text: '💰 Scams: Romance, Investment & Crypto',  next: 'threat_scam' },
      { text: '🔐 Account Hacking & Credential Theft',   next: 'threat_account' },
      { text: '🕵️ Phishing, Smishing & Vishing',         next: 'threat_phishing' },
      { text: '📡 Deepfakes & Impersonation',            next: 'threat_deepfake' },
      { text: '🌐 DDoS & Network Attacks',               next: 'threat_ddos' },
      { text: '⬅️ Back to main menu',                    next: 'main' },
    ]
  },
  threat_deepfake: {
    text: "Deepfake and impersonation attacks use AI-generated video, voice, or images:\n\n🚩 Fake CEO video/voice calls requesting urgent transfers\n🚩 AI-generated romance profiles with stolen images\n🚩 Fake government officials demanding payment\n🚩 Cloned voice calls from 'family members' in fake emergencies\n\nAlways verify through a separate, known channel before taking any action.",
    options: [
      { text: '📝 Report a deepfake incident',  action: 'go_report' },
      { text: '🚨 Connect to a live agent',     next: 'live_agent' },
      { text: '⬅️ Back to threat library',      next: 'threat_library' },
    ]
  },
  threat_ddos: {
    text: "DDoS (Distributed Denial of Service) attacks overwhelm servers, making services unavailable:\n\n• Sudden service outages or extreme slowdowns for all users\n• Abnormal traffic spikes from no legitimate source\n• Exhausted bandwidth with no internal explanation\n\nWHTSIPA assists businesses with DDoS Mitigation, Traffic Scrubbing, and Network Hardening.",
    options: [
      { text: '🛠️ DDoS protection tools',       action: 'go_tools' },
      { text: '📝 Report a network attack',     action: 'go_report' },
      { text: '🚨 Connect to a specialist',     next: 'live_agent' },
      { text: '⬅️ Back to threat library',      next: 'threat_library' },
    ]
  },
  live_agent: {
    text: "Would you like to connect with a live representative? Please choose your preferred channel:",
    options: [
      { text: "💬 Connect via WhatsApp",                    action: "open_wa" },
      { text: "📲 Connect via Telegram",                    action: "open_tg" },
      { text: "🧑‍💼 Chat with an Active Representative",      next: "live_agent_confirm" },
      { text: "⬅️ Back to main menu",                      next: "main" },
    ]
  },
  live_agent_confirm: {
    text: "Would you like to chat with an Active Representative?\n\n⏱️ Estimated wait time: 15–20 minutes.\n\nAn available specialist will be assigned to your ticket and will reach out to you via your preferred contact channel (Telegram or WhatsApp).",
    options: [
      { text: "✅ Yes — Connect me now",      action: "connect_human" },
      { text: "💬 Connect via WhatsApp instead", action: "open_wa" },
      { text: "⬅️ Back",                       next: "live_agent" },
    ]
  },
}

/* ══════════════════════════════════════════════════════════
   THREATS PAGE LIVE CHAT MODAL
   ══════════════════════════════════════════════════════════ */
function ThreatsChatModal({ isOpen, onClose, navigate, isHumanAgent = false }) {
  const [currentNode, setCurrentNode] = useState('main')
  const [isHuman, setIsHuman] = useState(isHumanAgent)
  const [messages, setMessages]       = useState([{
    sender: 'agent',
    text:   "Welcome to WHTSIPA Threat Support! I can help with threat education, scam recovery, reporting cybercrime, or connecting you to our live team. What do you need help with today?",
    time:   new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }])
  const [isTyping,   setIsTyping]   = useState(false)
  const [inputText,  setInputText]  = useState('')
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  if (!isOpen) return null

  const WA_LINK    = 'https://wa.me/16502814251'
  const TG_LINK    = 'https://t.me/WHTSIPA_DigitalTools'
  const EMAIL_LINK = 'mailto:wehelptrackscammersipaddress@mail.com'

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
        const actions = {
          go_report:          () => { onClose(); navigate('/report') },
          go_tools:           () => { onClose(); navigate('/tools') },
          go_threats_library: () => {
            onClose()
            setTimeout(() => document.getElementById('types-of-threats')?.scrollIntoView({ behavior: 'smooth' }), 100)
          },
          open_wa:            () => window.open(WA_LINK, '_blank'),
          open_tg:            () => window.open(TG_LINK, '_blank'),
          open_email:         () => window.open(EMAIL_LINK, '_blank'),
          connect_human:      () => {
            setIsHuman(true)
            setMessages(prev => [...prev, {
              sender: 'agent',
              text: "Connecting to an Active Representative...\n\n⏱️ Estimated wait time: 15–20 minutes.\n\nYou have been placed in the queue. A representative will respond here shortly.",
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }])
          }
        }
        actions[opt.action]?.()
      }, 900)
      return
    }

    if (opt.next) {
      setTimeout(() => {
        setIsTyping(false)
        const nextNode = THREATS_CHAT_FLOW[opt.next]
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
        text:   "Please use the quick options below to navigate, or connect directly with our live team via WhatsApp or Telegram for real-time assistance.",
        time:   new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }])
    }, 1400)
  }

  const currentNodeData = THREATS_CHAT_FLOW[currentNode]

  return (
    <div className="wm-overlay" style={{ zIndex: 9999 }} onClick={onClose}>
      <div className="livechat-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="livechat-header threats-livechat-header">
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

import iconDeepfake from '../assets/media/icons/icon-deepfake.png'
import iconCredentialStuffing from '../assets/media/icons/icon-credential-stuffing.png'
import iconBec from '../assets/media/icons/icon-bec.png'
import iconCloudMisconfig from '../assets/media/icons/icon-cloud-misconfig.png'
import iconInsiderThreat from '../assets/media/icons/icon-insider-threat.png'
import iconSimSwap from '../assets/media/icons/icon-sim-swap.png'
import iconSpyware from '../assets/media/icons/icon-spyware.png'
import iconTracking from '../assets/media/icons/icon-tracking.png'
import iconPentest from '../assets/media/icons/icon-pentest.png'
import iconPhishing from '../assets/media/icons/icon-phishing.png'
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
  'icon-deepfake.png':            iconDeepfake,
  'icon-credential-stuffing.png': iconCredentialStuffing,
  'icon-bec.png':                 iconBec,
  'icon-cloud-misconfig.png':     iconCloudMisconfig,
  'icon-insider-threat.png':      iconInsiderThreat,
  'icon-sim-swap.png':            iconSimSwap,
  'icon-spyware.png':             iconSpyware,
  'icon-tracking.png':            iconTracking,
  'icon-pentest.png':             iconPentest,
  'icon-phishing.png':            iconPhishing,
  'icon-ransomware.png':          iconRansomware,
  'icon-scam-fraud.png':          iconScamFraud,
  'icon-reputation.png':          iconReputation,
  'icon-account-takeover.png':    iconAccountTakeover,
  'icon-data-breach.png':         iconDataBreach,
  'icon-ddos.png':                iconDdos,
  'icon-api-security.png':        iconApiSecurity,
  'icon-identity-theft.png':      iconIdentityTheft,
  'icon-malware.png':             iconMalware,
  'icon-crypto-drainer.png':      iconCryptoDrainer,
  'icon-delivery-scam.png':       iconDeliveryScam,
  'icon-unpatched-software.png':  iconUnpatchedSoftware,
  'icon-cctv-surveillance.png':   iconCctvSurveillance,
  'icon-social-media-threat.png': iconSocialMediaThreat,
  'icon-botnet.png':              iconBotnet,
}

const INVERT_ICONS = new Set([
  'icon-account-takeover.png','icon-api-security.png','icon-bec.png',
  'icon-credential-stuffing.png','icon-crypto-drainer.png','icon-data-breach.png',
  'icon-ddos.png','icon-identity-theft.png','icon-malware.png','icon-phishing.png',
  'icon-scam-fraud.png','icon-sim-swap.png','icon-social-media-threat.png','icon-unpatched-software.png',
])

const RISK_LABEL = { high: 'HIGH RISK', mid: 'MED RISK', low: 'SECURE PATH' }

/* ════════════════════════════════════════════
   SECTION 2 — TYPES OF THREATS data
   ════════════════════════════════════════════ */
// Maps Types of Threats entry → threatsToolsData id (for scroll-to behaviour)
const TYPES_TO_TT_ID = {
  'deepfake':            'deepfake',
  'credential-stuffing': 'credential-stuffing',
  'bec':                 'bec',
  'cloud-security':      'cloud-misconfig',
  'insider-threat':      'insider-threat',
  'sim-swap':            'sim-swap',
  'spyware-detection':   'spyware',
  'tracking':            'tracking',
  'pentest':             'pentest',
  'phishing-emails':     'phishing',
  'ransomware':          'ransomware',
  'scam-fraud':          'scam-fraud',
  'reputation':          'reputation',
  'account-takeover':    'account-takeover',
  'data-breach':         'data-breach',
  'ddos-protection':     'ddos',
  'api-security':        'api-security',
  'identity-theft':      'identity-theft',
  'malware':             'malware',
  'crypto-drainer':      'crypto-drainer',
  'delivery-scam':       'delivery-scam',
  'unpatched-software':  'unpatched-software',
  'cctv-surveillance':   'cctv-surveillance',
  'social-media-threat': 'social-media-threat',
  'botnet':              'botnet',
}

const TYPES_OF_THREATS = [
  { icon: 'icon-deepfake.png',            title: 'DeepFake & Synthetic Identity Attacks',      risk: 'mid',
    desc: 'AI-generated fake videos/audio impersonating executives or loved ones for identity fraud and financial extortion.',
    link: 'deepfake' },
  { icon: 'icon-credential-stuffing.png', title: 'Credential Stuffing & Password Threats',     risk: 'high',
    desc: 'Automated use of leaked credentials across sites leading to account takeovers. Our MFA tools provide strong protection.',
    link: 'credential-stuffing' },
  { icon: 'icon-bec.png',                 title: 'Business Email Compromise (BEC) Threats',    risk: 'high',
    desc: 'Targeted email scams impersonating CEOs for wire transfers. Companies lose billions. We offer executive training and AI anomaly detection.',
    link: 'bec' },
  { icon: 'icon-cloud-misconfig.png',     title: 'Cloud Misconfiguration Vulnerabilities',     risk: 'mid',
    desc: 'Exposed storage buckets and weak settings leak data publicly. Our automated scanning and CSPM tools fix vulnerabilities.',
    link: 'cloud-security' },
  { icon: 'icon-insider-threat.png',      title: 'Insider Threats & Employee Sabotage',        risk: 'high',
    desc: 'Malicious or negligent insiders steal or leak data. We offer User Behavior Analysis (UBA) and Insider Risk Program (IRP) tools.',
    link: 'insider-threat' },
  { icon: 'icon-sim-swap.png',            title: 'SIM Swapping Threats',                       risk: 'high',
    desc: 'Attackers port your number to hijack accounts. Our pin-based carrier-level protection and SIM swap prevention tools stop this.',
    link: 'sim-swap' },
  { icon: 'icon-spyware.png',             title: 'Spyware & Keylogger Threats',                risk: 'mid',
    desc: 'RATs and spyware access your webcam and data. Our Privacy Audit Tools detect and neutralize these threats for businesses and individuals.',
    link: 'spyware-detection' },
  { icon: 'icon-tracking.png',            title: 'Tracking a Tracker',                         risk: 'mid',
    desc: 'We neutralize digital threats by tracking scammers using Grabify Tools that generate links to capture information from imposters.',
    link: 'tracking' },
  { icon: 'icon-pentest.png',             title: 'Penetration Testing',                        risk: 'low',
    desc: 'Comprehensive testing for servers and applications to identify possible threats and block vulnerabilities before attackers do.',
    link: 'pentest' },
  { icon: 'icon-phishing.png',            title: 'Phishing Threats',                           risk: 'high',
    desc: 'Deceptive emails, texts and websites trick users into revealing credentials. Our AI-powered email filtering and real-time link scanning tools protect you.',
    link: 'phishing-emails' },
  { icon: 'icon-ransomware.png',          title: 'Ransomware & Digital Extortion',             risk: 'high',
    desc: 'Malware encrypts data and demands payment. We offer immutable backups, EDR and rapid decryption negotiation tools.',
    link: 'ransomware' },
  { icon: 'icon-scam-fraud.png',          title: 'Online Scam & Investment Fraud',             risk: 'high',
    desc: 'Romance, tech support and crypto scams cause massive losses. We offer victim recovery assistance and transaction monitoring tools.',
    link: 'scam-fraud' },
  { icon: 'icon-reputation.png',          title: 'Reputation & Brand Damage',                  risk: 'mid',
    desc: 'Public leaks of explicit content and attacks destroy trust. Our dark web cleanup and proactive reputation monitoring tools protect you.',
    link: 'reputation' },
  { icon: 'icon-account-takeover.png',    title: 'Account Takeover Fraud',                     risk: 'high',
    desc: 'Hackers seize control of online accounts for financial gain. We offer session monitoring, risk-based authentication and rapid recovery tools.',
    link: 'account-takeover' },
  { icon: 'icon-data-breach.png',         title: 'Data Breaches & Leaks',                      risk: 'high',
    desc: 'Unauthorized data access triggers fines and loss of trust. Our forensics investigators, rapid response retainers and BCM tools protect you.',
    link: 'data-breach' },
  { icon: 'icon-ddos.png',               title: 'DDoS Attacks',                               risk: 'mid',
    desc: 'Flooding systems causes downtime. Our cloud-based scrubbing centers, traffic monitoring and always-on mitigation provide zero-downtime protection.',
    link: 'ddos-protection' },
  { icon: 'icon-api-security.png',        title: 'API Security Threats',                       risk: 'mid',
    desc: 'Exploited APIs expose backend data. Our secure API gateways with rate limiting, real-time threat detection and penetration testing tools protect you.',
    link: 'api-security' },
  { icon: 'icon-identity-theft.png',      title: 'Identity Theft & Fraud Threats',             risk: 'high',
    desc: 'Stolen identities used for loans, accounts or espionage. We offer 24/7 dark web monitoring, credit alerts and identity restoration insurance.',
    link: 'identity-theft' },
  { icon: 'icon-malware.png',             title: 'Malware Infection (Virus)',                   risk: 'high',
    desc: 'Malicious software steals data and disrupts systems. We offer new-gen antivirus, automated scanning, device management and 24/7 malware cleanup.',
    link: 'malware' },
  { icon: 'icon-crypto-drainer.png',      title: 'Crypto Drainer Threats',                     risk: 'high',
    desc: 'Airdrop drainers steal crypto assets silently. We provide detection, wallet monitoring and active recovery tools.',
    link: 'crypto-drainer' },
  { icon: 'icon-delivery-scam.png',       title: 'Fake Package (UPS) & Delivery Scams',        risk: 'mid',
    desc: 'Fake delivery notifications trick victims into clicking malicious links. We offer real-time detection and link verification tools.',
    link: 'delivery-scam' },
  { icon: 'icon-unpatched-software.png',  title: 'Unpatched Software Threats',                 risk: 'mid',
    desc: 'Delayed updates create easy entry points. Our managed endpoint services and vulnerability scanning tools enforce best-practice patch management.',
    link: 'unpatched-software' },
  { icon: 'icon-cctv-surveillance.png',   title: 'CCTV Home & Office Surveillance Threats',    risk: 'mid',
    desc: 'Exposed camera feeds risk privacy. We protect footage with New Private Access Protection Key (NPAPK) and Surveillance Protection Tools.',
    link: 'cctv-surveillance' },
  { icon: 'icon-social-media-threat.png', title: 'Social Media Monitoring Threats',            risk: 'mid',
    desc: 'Account takeovers and reputation attacks via social platforms. We offer monitoring, protection tools and emergency lockdown options.',
    link: 'social-media-threat' },
  { icon: 'icon-botnet.png',              title: 'Botnets & Zombie Network Attacks',           risk: 'high',
    desc: 'Infected devices form zombie networks. Our Device Cleanup, Network Segmentation and Botnet Blocker Tools permanently eliminate infections.',
    link: 'botnet' },
]

/* ════════════════════════════════════════════
   QUIZ MODAL
   ════════════════════════════════════════════ */
function QuizModal({ slug, onClose, onFail }) {
  const quiz = QUIZ_DATA[slug]
  const [step, setStep]         = useState(0)
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [score, setScore]       = useState(0)
  const [done, setDone]         = useState(false)

  if (!quiz) return null

  const q     = quiz.questions[step]
  const total = quiz.questions.length

  const handleAnswer = (idx) => {
    if (selected !== null) return
    setSelected(idx)
    const isCorrect = idx === q.correct
    setFeedback(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) setScore(s => s + 1)
  }

  const handleNext = () => {
    if (step + 1 >= total) {
      const lastCorrect = selected === q.correct
      const trueScore   = score + (lastCorrect ? 1 : 0)
      setDone(true)
      if (trueScore < Math.ceil(total * 0.8)) onFail(slug)
    } else {
      setStep(s => s + 1)
      setSelected(null)
      setFeedback(null)
    }
  }

  const getResult = () => {
    if (score === total)     return { label: '🛡️ Secured!',  msg: 'Perfect score — you are fully threat-aware.',     color: 'var(--green)' }
    if (score === total - 1) return { label: '🧠 Smart One!', msg: 'Almost perfect — review the one you missed.',     color: 'var(--cyan)'  }
    return                          { label: '⚠️ You Failed', msg: 'You need to improve. Try this scenario again.',   color: 'var(--red)'   }
  }

  return (
    <div className="threats-page">
      <div className="quiz-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="quiz-modal-box" role="dialog" aria-modal="true" aria-label={`Quiz: ${quiz.title}`}>
          <div className="quiz-modal-header">
            <div className="d-flex align-items-center gap-2">
              <span style={{ fontSize: '1.4rem' }}>{quiz.emoji}</span>
              <div>
                <div className="fw-bold text-white">{quiz.title}</div>
                <div className="text-muted-cyber" style={{ fontSize: '0.72rem' }}>
                  {done ? 'Quiz Complete' : `Question ${step + 1} of ${total}`}
                </div>
              </div>
            </div>
            <button className="quiz-close-btn" onClick={onClose} aria-label="Close quiz">
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          {!done && (
            <div className="quiz-progress">
              <div className="quiz-progress-fill" style={{ width: `${(step / total) * 100}%` }} />
            </div>
          )}

          {!done ? (
            <div className="quiz-phone-mock">
              <div className="quiz-phone-notch" />
              <div className="quiz-phone-screen">
                <div className="text-muted-cyber small mb-2" style={{ fontSize: '0.7rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {q.q}
                </div>
                <div className="quiz-question">{q.prompt}</div>
                <div className="quiz-options">
                  {q.options.map((opt, i) => {
                    let cls = 'quiz-option'
                    if (selected !== null) {
                      if (i === q.correct) cls += ' correct'
                      else if (i === selected && i !== q.correct) cls += ' wrong'
                      else cls += ' dimmed'
                    }
                    return (
                      <button key={i} className={cls} onClick={() => handleAnswer(i)} disabled={selected !== null}>
                        <span className="quiz-option-letter">{String.fromCharCode(65 + i)}</span>
                        {opt}
                      </button>
                    )
                  })}
                </div>
                {feedback && (
                  <div className={`quiz-feedback ${feedback}`}>
                    {feedback === 'correct'
                      ? <><i className="bi bi-check-circle-fill me-2"></i>Correct!</>
                      : <><i className="bi bi-x-circle-fill me-2"></i>Whoops! The right answer was highlighted above.</>
                    }
                  </div>
                )}
                {selected !== null && (
                  <button className="btn btn-cyber w-100 mt-3" onClick={handleNext}>
                    {step + 1 >= total ? 'See Results' : 'Continue →'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="quiz-results">
              {(() => {
                const r = getResult()
                return (
                  <>
                    <div className="quiz-result-score" style={{ color: r.color }}>{score}/{total}</div>
                    <div className="quiz-result-label" style={{ color: r.color }}>{r.label}</div>
                    <div className="text-muted-cyber text-center mb-4">{r.msg}</div>
                    <div className="d-flex gap-2 justify-content-center flex-wrap">
                      <button className="btn btn-outline-cyber" onClick={() => { setStep(0); setSelected(null); setFeedback(null); setScore(0); setDone(false) }}>
                        <i className="bi bi-arrow-repeat me-2"></i>Retry
                      </button>
                      <button className="btn btn-cyber" onClick={onClose}>Done</button>
                    </div>
                  </>
                )
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════
   MAIN THREATS PAGE
   ════════════════════════════════════════════ */
export default function Threats() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeQuiz,      setActiveQuiz]      = useState(null)
  const [failedScenarios, setFailedScenarios] = useState([])
  const [showRepPrompt,   setShowRepPrompt]   = useState(false)
  const [highlightedCard, setHighlightedCard] = useState(null)
  const [activeModal,     setActiveModal]     = useState(null)
  const [modalThreat,     setModalThreat]     = useState('')
  const [showThreatChat,  setShowThreatChat]  = useState(false)

  // After a redirected sign-in/sign-up, reopen the modal the user was using
  // (Request Tool, Hire, Report, Contact) with the same threat context.
  useEffect(() => {
    if (location.state?.reopenModal) {
      setActiveModal(location.state.reopenModal)
      setModalThreat(location.state.reopenThreatTitle || '')
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state, location.pathname, navigate])

  const handleFail = (slug) => {
    setFailedScenarios(prev => {
      if (prev.includes(slug)) return prev
      const updated = [...prev, slug]
      if (updated.length >= 3) setShowRepPrompt(true)
      return updated
    })
  }

  /* Smooth-scroll to a Threats & Tools card and highlight it */
  const scrollToTTCard = (ttId) => {
    const el = document.getElementById(`tt-card-${ttId}`)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setHighlightedCard(ttId)
    setTimeout(() => setHighlightedCard(null), 2800)
  }

  const handleLearnMore = (ttId) => {
    scrollToTTCard(ttId)
  }

  return (
    <div className="threats-page">

      {/* ── Quiz Modal ── */}
      {activeQuiz && (
        <QuizModal slug={activeQuiz} onClose={() => setActiveQuiz(null)} onFail={handleFail} />
      )}

      {/* ── Failed 3+ scenarios prompt ── */}
      {showRepPrompt && (
        <div className="quiz-modal-backdrop" onClick={() => setShowRepPrompt(false)}>
          <div className="quiz-modal-box" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div className="quiz-modal-header">
              <div className="d-flex align-items-center gap-2">
                <span style={{ fontSize: '1.4rem' }}>⚠️</span>
                <div className="fw-bold text-white">You Need Help</div>
              </div>
              <button className="quiz-close-btn" onClick={() => setShowRepPrompt(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="p-4 text-center">
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🛡️</div>
              <div className="fw-bold text-white mb-2">You have failed {failedScenarios.length} different scenarios.</div>
              <p className="text-muted-cyber small mb-4">
                You need to protect yourself. Contact an Active Representative now —
                they will guide you through staying safe online.
              </p>
              <a href="https://t.me/WHTS_support" target="_blank" rel="noopener noreferrer"
                className="btn btn-alert w-100 mb-2">
                <i className="bi bi-telegram me-2"></i>Contact Active Representative
              </a>
              <button className="btn btn-outline-cyber w-100" onClick={() => setShowRepPrompt(false)}>
                Keep Practicing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════
          HERO
          ════════════════════════════ */}
      <header className="threats-hero">
        <div className="cyber-grid" aria-hidden="true" />
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center g-4 py-5">
            <div className="col-12 col-lg-7">
              <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
                <span className="pill low">
                  <span className="dot" /><span className="fw-bold" style={{ fontSize: '0.7rem' }}>LIVE TRAINING</span>
                </span>
                <span className="text-muted-cyber small">Threat education · Prevention-first</span>
              </div>
              <div className="threats-hero-headline-box">
                <h1 className="glow-text fw-bold mb-2">Know Your Threats.<br />Stay One Step Ahead.</h1>
                <p className="text-muted-cyber mb-0" style={{ maxWidth: '54ch' }}>
                  To add a layer of top-notch security to help prevent incoming threats and protect yourself
                  by learning to spot threats.
                </p>
              </div>
              <p className="text-muted-cyber mb-4 mt-2" style={{ maxWidth: '54ch' }}>
                Take a quiz to spot scams and get tools to protect your information.
              </p>
              <div className="d-flex gap-2 flex-wrap threats-hero-btns">
                <a className="btn btn-cyber" href="#spot-a-threat" onClick={e => { e.preventDefault(); document.getElementById('spot-a-threat')?.scrollIntoView({ behavior: 'smooth' }) }}>
                  <i className="bi bi-controller me-2"></i>Spot a Threat
                </a>
                <a className="btn btn-outline-cyber" href="#types-of-threats" onClick={e => { e.preventDefault(); document.getElementById('types-of-threats')?.scrollIntoView({ behavior: 'smooth' }) }}>
                  <i className="bi bi-list-ul me-2"></i>Types of Threats
                </a>
                <a className="btn btn-outline-cyber" href="#threats-tools" onClick={e => { e.preventDefault(); document.getElementById('threats-tools')?.scrollIntoView({ behavior: 'smooth' }) }}>
                  <i className="bi bi-grid me-2"></i>Threats &amp; Tools
                </a>
                <a
                  className="btn btn-alert"
                  href="#threats-contact-section"
                  onClick={e => { e.preventDefault(); document.getElementById('threats-contact-section')?.scrollIntoView({ behavior: 'smooth' }) }}
                >
                  <i className="bi bi-exclamation-triangle me-2"></i>Need Urgent Help?
                </a>
              </div>
            </div>
            <div className="col-12 col-lg-5">
              <div className="banner p-4">
                <div className="text-muted-cyber small mb-1">Education Mode</div>
                <div className="fw-bold fs-5 glow-text mb-3">17 Threat Scenarios</div>
                <div className="scan-bar mb-2"><span /></div>
                <div className="text-muted-cyber small mb-4">Interactive quizzes · Instant feedback · Score tracking</div>
                <div className="d-flex align-items-start gap-3">
                  <div className="icon-box">🛡️</div>
                  <div>
                    <div className="fw-bold">Built from real-world patterns</div>
                    <div className="text-muted-cyber small">Every scenario is based on actual cybercrime methods reported to WHTS.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ════════════════════════════
          WHTSIPA SECURITY WORLD BAR
          ════════════════════════════ */}
      <div className="threats-security-world-bar">
        <span className="threats-marquee-dot-green"></span>
        <span className="threats-security-world-text">WHTSIPA SECURITY WORLD</span>
        <span className="threats-marquee-dot-yellow"></span>
      </div>

      {/* ════════════════════════════
          SECTION 1 — SPOT A THREAT
          ════════════════════════════ */}
      <section className="section-pad-lg threats-section-alt" id="spot-a-threat">
          <div className="container">

            {/* Header */}
            <div className="text-center mb-5">
              <div className="section-label mb-2">Interactive Training</div>
              <h2 className="fw-bold mb-2">Spot a Threat</h2>
              <p className="text-muted-cyber mx-auto mb-1" style={{ maxWidth: '56ch' }}>
                Think you can spot a scam? Take our quiz.
              </p>
              <p className="text-muted-cyber mx-auto mb-4" style={{ maxWidth: '58ch', fontSize: '0.88rem' }}>
                Click any scenario below to begin its 5-question interactive quiz. Each question
                displays a phone screenshot where you click to identify the real vs the threat.
              </p>
              <div className="threats-edu-mode-pill">
                <span className="threats-edu-dot" />
                <span className="fw-bold" style={{ fontSize: '0.7rem' }}>
                  EDUCATION MODE · Powered <span style={{ color: '#e0004d' }}>BY WHTSIPA</span>
                </span>
              </div>
            </div>

            {/* Quiz grid */}
            <div className="row g-3">
              {QUIZ_LIST.map(quiz => (
                <div key={quiz.slug} className="col-12 col-sm-6 col-lg-4">
                  <div className="quiz-card-item h-100">
                    <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
                      <div className="icon-box">{quiz.emoji}</div>
                      <span className={`pill ${quiz.risk}`}>
                        <span className="dot" />
                        <span className="fw-bold" style={{ fontSize: '0.65rem' }}>{RISK_LABEL[quiz.risk]}</span>
                      </span>
                    </div>
                    <div className="fw-bold text-white mb-1">{quiz.title}</div>
                    <div className="text-muted-cyber small mb-3">{QUIZ_DATA[quiz.slug]?.desc}</div>
                    <button
                      className="btn btn-outline-cyber w-100 mt-auto"
                      onClick={() => setActiveQuiz(quiz.slug)}
                    >
                      <i className="bi bi-play-fill me-2"></i>Start Quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

      {/* ════════════════════════════
          SECTION 2 — TYPES OF THREATS
          ════════════════════════════ */}
      <section className="section-pad-lg" id="types-of-threats">
          <div className="container">

            {/* Header */}
            <div className="mb-5">
              <div className="threats-intel-label mb-3">Threat Intelligence <span className="threats-intel-dot"></span></div>
              <div className="threats-section-highlight-box">
                <h2 className="fw-bold mb-2">Types of Threats</h2>
                <p className="text-muted-cyber mb-0" style={{ maxWidth: '72ch' }}>
                  In today's digital and interconnected world, companies, individuals and government
                  organisations face relentless types of threats that drive millions online worldwide
                  in search of immediate solutions.
                </p>
              </div>
              <p className="text-muted-cyber mb-4 mt-3" style={{ maxWidth: '72ch' }}>
                On our recent research we discovered a lot of companies and individuals shut down
                operations because of digital threats. <strong className="text-white">We have a solution.</strong>
              </p>
              {/* "BY WHTSIPA" in red as requested */}
              <div className="by-whtsipa-tag">BY WHTSIPA</div>
            </div>

            {/* Threats grid */}
            <h3 className="fw-bold mb-4" style={{ color: '#f0f4ff' }}>
              We offer services to various types of threats:
            </h3>
            <div className="row g-3">
              {TYPES_OF_THREATS.map(threat => {
                const ttId = threat.link ? TYPES_TO_TT_ID[threat.link] : null
                return (
                  <div key={threat.title} className="col-12 col-md-6 col-lg-4">
                    <div className="tot-threat-card h-100">
                      <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={ICON_MAP[threat.icon]}
                            alt={threat.title}
                            className={`tot-threat-icon-img${INVERT_ICONS.has(threat.icon) ? ' tt-icon-invert' : ' tt-icon-natural'}`}
                          />
                          <span className="tot-threat-title">{threat.title}</span>
                        </div>
                        <span className={`pill ${threat.risk} flex-shrink-0`} style={{ fontSize: '0.62rem' }}>
                          <span className="dot" />{RISK_LABEL[threat.risk]}
                        </span>
                      </div>
                      <p className="tot-threat-desc">{threat.desc}</p>
                      {ttId ? (
                        <button
                          className="tot-learn-link"
                          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                          onClick={() => handleLearnMore(ttId)}
                          title="Double-click to jump to tools section"
                        >
                          Learn more <i className="bi bi-arrow-right ms-1"></i>
                        </button>
                      ) : (
                        <button
                          className="tot-learn-link"
                          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                          onClick={() => { setModalThreat(''); setActiveModal('contact') }}
                        >
                          Request help <i className="bi bi-arrow-right ms-1"></i>
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

          </div>
        </section>

      {/* ════════════════════════════
          SECTION 3 — THREATS & TOOLS
          ════════════════════════════ */}
      <section className="section-pad-lg threats-tools-section" id="threats-tools">
          <div className="container">

            {/* Header */}
            <div className="mb-5">
              <div className="tt-hero-red-bar-inline mb-4">
                <span>THREATS &amp; TOOLS</span>
              </div>
              <div className="threats-section-highlight-box">
                <p className="mb-0" style={{ color: 'rgba(233,243,255,0.9)' }}>
                  At <strong>Threats &amp; Tools</strong>, we assert that knowledge and tools are Digital Power —
                  the strongest form of protection. Our Self-Defense Training Certifications program combines
                  practical real-world training with high quality, secure software tools. It equips individuals,
                  families, and business teams with the skills they need to handle real-world threats
                  confidently and legally as signed.
                </p>
              </div>
            </div>

            {/* 4 illustrated info cards — all 4 in one row */}
            <div className="row g-3 mb-5 tt-info-cards-row flex-nowrap flex-md-nowrap">
              {[
                {
                  svg: (
                    <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" className="tt-info-svg">
                      <rect width="200" height="140" rx="12" fill="#f3e8ff"/>
                      {/* Background shapes */}
                      <circle cx="160" cy="30" r="28" fill="#e9d5ff" opacity="0.6"/>
                      <circle cx="40" cy="110" r="20" fill="#ddd6fe" opacity="0.5"/>
                      {/* Screen/monitor */}
                      <rect x="55" y="30" width="90" height="60" rx="6" fill="#7c3aed"/>
                      <rect x="59" y="34" width="82" height="52" rx="4" fill="#1e1b4b"/>
                      {/* Warning lines on screen */}
                      <rect x="65" y="42" width="50" height="4" rx="2" fill="#f87171" opacity="0.9"/>
                      <rect x="65" y="52" width="38" height="4" rx="2" fill="#fbbf24" opacity="0.8"/>
                      <rect x="65" y="62" width="44" height="4" rx="2" fill="#34d399" opacity="0.8"/>
                      <rect x="65" y="72" width="30" height="4" rx="2" fill="#60a5fa" opacity="0.8"/>
                      {/* Alert icon */}
                      <circle cx="120" cy="55" r="10" fill="#ef4444" opacity="0.9"/>
                      <rect x="119" y="49" width="2" height="6" rx="1" fill="white"/>
                      <circle cx="120" cy="57" r="1.2" fill="white"/>
                      {/* Stand */}
                      <rect x="93" y="90" width="14" height="6" rx="2" fill="#7c3aed"/>
                      <rect x="83" y="96" width="34" height="4" rx="2" fill="#6d28d9"/>
                      {/* Person left */}
                      <circle cx="30" cy="55" r="10" fill="#c084fc"/>
                      <path d="M16 95 Q30 72 44 95" fill="#a855f7" stroke="none"/>
                      <rect x="23" y="65" width="14" height="18" rx="4" fill="#9333ea"/>
                      {/* Person right */}
                      <circle cx="170" cy="55" r="10" fill="#f9a8d4"/>
                      <path d="M156 95 Q170 72 184 95" fill="#ec4899" stroke="none"/>
                      <rect x="163" y="65" width="14" height="18" rx="4" fill="#db2777"/>
                    </svg>
                  ),
                  title: 'Type of Threats',
                  desc: 'Understand the most common and emerging threats you may face online and in real life.',
                },
                {
                  svg: (
                    <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" className="tt-info-svg">
                      <rect width="200" height="140" rx="12" fill="#ede9fe"/>
                      <circle cx="160" cy="20" r="22" fill="#ddd6fe" opacity="0.5"/>
                      {/* Whiteboard */}
                      <rect x="30" y="20" width="100" height="75" rx="6" fill="white" stroke="#c4b5fd" strokeWidth="2"/>
                      {/* Chart bars */}
                      <rect x="45" y="65" width="12" height="22" rx="2" fill="#8b5cf6"/>
                      <rect x="63" y="52" width="12" height="35" rx="2" fill="#7c3aed"/>
                      <rect x="81" y="42" width="12" height="45" rx="2" fill="#6d28d9"/>
                      <rect x="99" y="35" width="12" height="52" rx="2" fill="#5b21b6"/>
                      {/* Trend line */}
                      <polyline points="51,65 69,50 87,40 105,33" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round"/>
                      <circle cx="105" cy="33" r="4" fill="#10b981"/>
                      {/* Presenter person */}
                      <circle cx="155" cy="48" r="12" fill="#fbbf24"/>
                      <rect x="147" y="62" width="16" height="28" rx="5" fill="#1d4ed8"/>
                      {/* Pointing arm */}
                      <line x1="147" y1="72" x2="130" y2="58" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round"/>
                      {/* Legs */}
                      <rect x="149" y="88" width="6" height="22" rx="3" fill="#1e40af"/>
                      <rect x="159" y="88" width="6" height="22" rx="3" fill="#1e40af"/>
                    </svg>
                  ),
                  title: 'Threat & Tool Analysis',
                  desc: 'Get insights on how specific threats work and which tools best protect against them.',
                },
                {
                  svg: (
                    <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" className="tt-info-svg">
                      <rect width="200" height="140" rx="12" fill="#fce7f3"/>
                      <circle cx="170" cy="25" r="25" fill="#fbcfe8" opacity="0.6"/>
                      {/* Laptop base */}
                      <rect x="40" y="68" width="120" height="8" rx="3" fill="#e879f9"/>
                      <rect x="30" y="76" width="140" height="5" rx="2" fill="#c026d3"/>
                      {/* Laptop screen */}
                      <rect x="50" y="28" width="100" height="42" rx="5" fill="#86198f"/>
                      <rect x="54" y="32" width="92" height="34" rx="3" fill="#0f172a"/>
                      {/* Shield on screen */}
                      <path d="M100 38 L88 43 L88 54 Q88 62 100 66 Q112 62 112 54 L112 43 Z" fill="#e879f9"/>
                      <path d="M100 42 L91 46 L91 54 Q91 60 100 63 Q109 60 109 54 L109 46 Z" fill="#a21caf"/>
                      <path d="M96 52 L99 55 L106 47" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      {/* Tool icons floating */}
                      <rect x="160" y="50" width="20" height="14" rx="3" fill="#f0abfc" opacity="0.8"/>
                      <rect x="162" y="53" width="16" height="2" rx="1" fill="#a21caf"/>
                      <rect x="162" y="57" width="10" height="2" rx="1" fill="#a21caf"/>
                      <rect x="20" y="50" width="20" height="14" rx="3" fill="#f0abfc" opacity="0.8"/>
                      <circle cx="30" cy="57" r="4" fill="#a21caf" opacity="0.7"/>
                    </svg>
                  ),
                  title: 'How Our Tools Work',
                  desc: "Learn how our protection tools function. Step-by-step guides and demo videos show each tool in action.",
                },
                {
                  svg: (
                    <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" className="tt-info-svg">
                      <rect width="200" height="140" rx="12" fill="#fef3c7"/>
                      <circle cx="165" cy="22" r="25" fill="#fde68a" opacity="0.6"/>
                      {/* Envelope body */}
                      <rect x="35" y="45" width="100" height="65" rx="7" fill="#f59e0b"/>
                      <rect x="38" y="48" width="94" height="59" rx="5" fill="white"/>
                      {/* Envelope flap */}
                      <path d="M35 45 L85 80 L135 45 Z" fill="#d97706"/>
                      {/* Email lines */}
                      <rect x="50" y="72" width="60" height="4" rx="2" fill="#e5e7eb"/>
                      <rect x="50" y="82" width="45" height="4" rx="2" fill="#e5e7eb"/>
                      <rect x="50" y="92" width="52" height="4" rx="2" fill="#e5e7eb"/>
                      {/* Shield badge */}
                      <circle cx="130" cy="62" r="20" fill="#1d4ed8"/>
                      <path d="M130 48 L120 53 L120 62 Q120 70 130 74 Q140 70 140 62 L140 53 Z" fill="#3b82f6"/>
                      <path d="M126 61 L129 64 L136 56" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      {/* Stars / sparkles */}
                      <text x="158" y="80" fontSize="14" fill="#f59e0b">✦</text>
                      <text x="22" y="65" fontSize="10" fill="#fbbf24">✦</text>
                    </svg>
                  ),
                  title: 'Request Tools',
                  desc: 'Need a specific tool? Submit your request here. Our AI assistant is available 24/7 with live representative support.',
                },
              ].map(item => (
                <div key={item.title} className="col-6 col-md-3 col-lg-3">
                  <div className="tot-info-card h-100">
                    <div className="tt-info-svg-wrap">{item.svg}</div>
                    <div className="tot-info-title">{item.title}</div>
                    <div className="tot-info-desc">{item.desc}</div>
                    <div className="by-whtsipa-tag mt-3">BY WHTSIPA</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Divider heading */}
            <div className="tt-section-divider mb-4">
              <div className="tt-section-divider-line" />
              <span className="tt-section-divider-label">Threats &amp; Tools</span>
              <div className="tt-section-divider-line" />
            </div>

            {/* Threats & Tools list */}
            <div className="d-flex flex-column gap-4">
              {THREATS_AND_TOOLS.map(threat => {
                const detailSlug = threat.slug ?? threat.id
                return (
                <div
                  key={threat.id}
                  id={`tt-card-${threat.id}`}
                  className={`tt-card-new${highlightedCard === threat.id ? ' tt-card-highlighted' : ''}`}
                >
                  {/* Top bar — title left, icon right */}
                  <div className="tt-card-top">
                    <div className="tt-card-top-left">
                      <div
                        className="tt-card-title"
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/threats/${detailSlug}`)}
                      >
                        {threat.name}
                      </div>
                      <div className="tt-card-meta-inline">
                        <div className="tt-available-on">
                          <span className="tt-available-label">Available On</span>
                          <div className="tt-device-icons">
                            <i className="bi bi-display"></i>
                            <i className="bi bi-laptop"></i>
                            <i className="bi bi-tablet"></i>
                            <i className="bi bi-phone"></i>
                          </div>
                        </div>
                        <div className="tt-card-success">
                          <span className="tt-success-label">Success Rates:</span>
                          <span className="tt-success-value">{threat.successRate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="tt-card-icon-right">
                      <img
                        src={ICON_MAP[threat.icon]}
                        alt={threat.name}
                        className={`tt-card-icon-img${INVERT_ICONS.has(threat.icon) ? ' tt-icon-invert-light' : ' tt-icon-natural-light'}`}
                      />
                    </div>
                  </div>

                  {/* Body — full width */}
                  <div className="tt-card-body-new">
                    <div className="tt-card-left">
                      <p className="tt-card-desc">{threat.description}</p>
                      <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
                        <div className="tt-how-label">How it works? <i className="bi bi-question-circle ms-1"></i></div>
                        <button
                          className="tt-request-btn"
                          onClick={e => {
                            e.stopPropagation()
                            setModalThreat(threat.name)
                            setActiveModal('request')
                          }}
                        >
                          Request Tools
                        </button>
                      </div>
                      <div className="tt-steps-row">
                        {threat.steps.map((step, i) => (
                          <div key={i} className="tt-step-card-dark">
                            <div className="tt-step-card-num">{i + 1}</div>
                            <div className="tt-step-card-title">{step.title}</div>
                            <div className="tt-step-card-desc">{step.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
                )
              })}
            </div>

            {/* Can't find tool */}
            <div className="tot-purchase-note mt-5">
              <div className="d-flex align-items-start gap-3">
                <span style={{ fontSize: '1.5rem' }}>🔧</span>
                <div>
                  <div className="fw-bold text-white mb-1">Can't find your tool?</div>
                  <p className="text-muted-cyber small mb-3">
                    Our AI assistant is available 24/7 to guide you through options and answer your
                    questions instantly. A live representative will personally review and handle your
                    request for personalized recommendations and support.
                  </p>
                  <button className="btn btn-alert btn-sm" onClick={() => { setModalThreat(''); setActiveModal('request') }}>
                    <i className="bi bi-send me-2"></i>Make a Request
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

      {/* ════════════════════════════
          FINAL CTA
          ════════════════════════════ */}
      <section className="section-pad">
        <div className="container">
          <div className="banner p-4 p-md-5 text-center">
            <div className="section-label mb-3">Need Real Help?</div>
            <h2 className="fw-bold glow-text mb-3">Think You've Been Targeted?</h2>
            <p className="text-muted-cyber mb-4 mx-auto" style={{ maxWidth: '50ch' }}>
              If you've experienced any of these threats for real, don't wait.
              Report it now and let WHTSIP guide your recovery.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <button className="btn btn-alert" onClick={() => { setModalThreat(''); setActiveModal('report') }}>
                <i className="bi bi-exclamation-triangle me-2"></i>Report an Incident
              </button>
              <a
                className="btn btn-cyber"
                href="#spot-a-threat"
                onClick={e => { e.preventDefault(); document.getElementById('spot-a-threat')?.scrollIntoView({ behavior: 'smooth' }) }}
              >
                <i className="bi bi-controller me-2"></i>Spot a Threat
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════
          OTHER WAYS TO REACH US
          Threats page only — distinct design
          ════════════════════════════ */}
      <section className="threats-contact-section" id="threats-contact-section">
        <div className="container">
          <h3 className="threats-contact-title">Other Ways to Reach Us</h3>
          <div className="threats-contact-grid">

            {/* WhatsApp */}
            <a
              href={THREATS_CONTACTS.whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="threats-contact-card"
            >
              <div className="tcc-icon tcc-icon-whatsapp">
                <i className="bi bi-whatsapp"></i>
              </div>
              <div className="tcc-body">
                <div className="tcc-name">WhatsApp</div>
                <div className="tcc-detail">{THREATS_CONTACTS.whatsapp.number} · 24/7 fastest response</div>
              </div>
              <i className="bi bi-arrow-right tcc-arrow"></i>
            </a>

            {/* Telegram */}
            <a
              href={THREATS_CONTACTS.telegram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="threats-contact-card"
            >
              <div className="tcc-icon tcc-icon-telegram">
                <i className="bi bi-telegram"></i>
              </div>
              <div className="tcc-body">
                <div className="tcc-name">Telegram</div>
                <div className="tcc-detail">{THREATS_CONTACTS.telegram.handle}</div>
              </div>
              <i className="bi bi-arrow-right tcc-arrow"></i>
            </a>

            {/* Email */}
            <a
              href={THREATS_CONTACTS.email.url}
              className="threats-contact-card"
            >
              <div className="tcc-icon tcc-icon-email">
                <i className="bi bi-envelope-fill"></i>
              </div>
              <div className="tcc-body">
                <div className="tcc-name">Email Us</div>
                <div className="tcc-detail">{THREATS_CONTACTS.email.address}</div>
              </div>
              <i className="bi bi-arrow-right tcc-arrow"></i>
            </a>

            {/* Official Website */}
            <a
              href={THREATS_CONTACTS.website.url}
              target="_blank"
              rel="noopener noreferrer"
              className="threats-contact-card"
            >
              <div className="tcc-icon tcc-icon-web">
                <i className="bi bi-globe2"></i>
              </div>
              <div className="tcc-body">
                <div className="tcc-name">Official Website</div>
                <div className="tcc-detail">{THREATS_CONTACTS.website.label}</div>
              </div>
              <i className="bi bi-arrow-right tcc-arrow"></i>
            </a>

            {/* Live Chat — threats-focused chatbot */}
            <button
              className="threats-contact-card threats-contact-card-btn"
              onClick={() => setShowThreatChat(true)}
            >
              <div className="tcc-icon tcc-icon-chat">
                <i className="bi bi-chat-dots-fill"></i>
              </div>
              <div className="tcc-body">
                <div className="tcc-name">Live Chat</div>
                <div className="tcc-detail">Threats · Recovery · Reporting · and more</div>
              </div>
              <i className="bi bi-arrow-right tcc-arrow"></i>
            </button>

          </div>
        </div>
      </section>

      <ThreatsFooter />

      {/* ── Modals ── */}
      {activeModal && (
        <WhatsipModal
          mode={activeModal}
          threatTitle={modalThreat}
          onClose={() => { setActiveModal(null); setModalThreat('') }}
        />
      )}

      {/* ── Threats Live Chat ── */}
      <ThreatsChatModal
        isOpen={showThreatChat}
        onClose={() => setShowThreatChat(false)}
        navigate={navigate}
      />

    </div>
  )
}
