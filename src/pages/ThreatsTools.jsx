import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/cyber.css'
import './ThreatsTools.css'

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

const THREATS_AND_TOOLS = [
  {
    id: 'deepfake',
    name: 'DeepFake & Synthetic Identity Attacks',
    icon: 'icon-deepfake.png',
    tool: 'Encryption Netlas Tools',
    successRate: '60–75%',
    description: 'Deepfake and synthetic identity attacks use advanced AI to impersonate individuals and steal personal data. Our Encryption Netlas Tools effectively detect and neutralize these sophisticated threats across text messages, phone calls, and video chat sessions.',
    steps: [
      { title: 'Deepfake Attacks', desc: 'If you notice suspicious changes in your personal information, contact our team immediately or visit the Threats page.' },
      { title: 'Choose Netlas Tools', desc: 'Purchase and use our tools to scan, identify and safely remove corrupted files linked to certain identity attacks.' },
      { title: 'Deepfake Rescan Tools', desc: 'After rescanning your devices, if any threats remain, our team will completely remove them and help secure your identity.' },
    ],
  },
  {
    id: 'credential-stuffing',
    name: 'Credential Stuffing & Password Threats',
    icon: 'icon-credential-stuffing.png',
    tool: 'MFA Tools',
    successRate: '77–85%',
    description: 'Credential stuffing and password attacks allow cybercriminals to steal login details across multiple websites by capturing cookies and monitoring your activity. Our MFA Tools provide strong protection for your browsing experience.',
    steps: [
      { title: 'Password & Credential Threats', desc: 'Identify which email accounts and browsers store your sensitive data and cookies.' },
      { title: 'MFA Tools', desc: 'Our tools help you detect safe versus harmful cookies and manage what information is stored while browsing.' },
      { title: 'Stay Protected', desc: 'Create a secure account with our MFA tools to automatically regulate and protect your stored data and cookies.' },
    ],
  },
  {
    id: 'bec',
    name: 'Business Email Compromise (BEC)',
    icon: 'icon-bec.png',
    tool: 'Web Cruiser Pro Tools',
    successRate: '85–90%',
    description: 'BEC attacks are costing companies billions annually through sophisticated impersonation and fraud. Our Web Cruiser Pro Tools, developed with legal expertise, help prevent and detect these threats.',
    steps: [
      { title: 'Report Business Email Threats', desc: 'Submit details through our dedicated report page.' },
      { title: 'Request Web Cruiser Pro Tools', desc: 'Secure your business email — our tool detects unauthorized changes, third-party logins and suspicious client interactions.' },
      { title: 'Stay Protected Always', desc: 'Receive real-time alerts for new threats or attempted breaches, keeping your business communications safe.' },
    ],
  },
  {
    id: 'cloud-misconfig',
    name: 'Cloud Misconfiguration Vulnerabilities',
    icon: 'icon-cloud-misconfig.png',
    tool: 'Reaver & Retina Tools',
    successRate: '68–78%',
    description: 'Misconfigured cloud storage often leads to public data leaks. Protect your cloud backups and access keys with our Reaver & Retina Tools.',
    steps: [
      { title: 'Cloud Access & Storage Keys', desc: 'Secure your cloud storage with controlled access keys to prevent unauthorized exposure.' },
      { title: 'Get Reaver & Retina Tools', desc: 'Reaver creates time-limited secure access keys, while Retina monitors for changes and instantly alerts you to potential leaks or breaches.' },
      { title: 'Choose the Right Plan', desc: 'Select a plan that ensures continuous protection and encryption of your cloud data.' },
    ],
  },
  {
    id: 'insider-threat',
    name: 'Insider Threats & Employee Sabotage',
    icon: 'icon-insider-threat.png',
    tool: 'Insider Risk Program (IRP)',
    successRate: '60–90%',
    description: 'Insider threats from employees or trusted individuals remain a major risk for corporations and financial institutions. Our Insider Risk Program (IRP) provides effective monitoring and protection.',
    steps: [
      { title: 'Insider Threats Monitoring', desc: 'Implement a risk management program to track employee logins and access to sensitive workplace information.' },
      { title: 'Insider Risk Program Tool', desc: 'The system automatically analyzes suspicious logins from unknown devices or locations and sends immediate alerts.' },
      { title: 'Get Alert Always', desc: 'Sign up for IRP to receive real-time notifications of potential breaches or suspicious employee activity.' },
    ],
  },
  {
    id: 'sim-swap',
    name: 'SIM Swapping Threats',
    icon: 'icon-sim-swap.png',
    tool: 'Sgobuster Net Tools',
    successRate: '45–70%',
    description: 'SIM swapping attackers port active phone numbers to hijack accounts. Our Sgobuster Net Tools can help detect and restrict unauthorized cloning attempts when a subscription is still active.',
    steps: [
      { title: 'Blocks Unauthorized Requests', desc: 'Sgobuster Net Tools prevents all incoming attempts to bypass your carrier and reopen lines for bypassing data and detecting IP.' },
      { title: 'Detects Spoofed Numbers', desc: 'Helps identify cloned numbers and fraudulent messages attempting to obtain your SIM information.' },
      { title: 'Get Protection Alerts', desc: 'Notifies you of landline callers and numbers reported as fraudulent to help prevent cloning.' },
    ],
  },
  {
    id: 'spyware',
    name: 'Spyware & Keylogger Threats',
    icon: 'icon-spyware.png',
    tool: 'Privacy Audit Tools',
    successRate: '85–96%',
    description: 'Spyware and tools like RATs can access your webcam, data, and devices. Our Privacy Audit Tools detect and neutralize these threats for businesses and individuals.',
    steps: [
      { title: 'Spy Malware Detection', desc: 'Quickly identifies if you are being monitored from kept records on how long your camera, microphone and others have been used.' },
      { title: 'Reviews Suspicious Activity', desc: 'Analyzes recent links clicked to determine what data may have been compromised.' },
      { title: 'Removes Unauthorized Tools', desc: 'Blocks spy cameras and deletes linked devices without authorization.' },
    ],
  },
  {
    id: 'tracking',
    name: 'Tracking a Tracker',
    icon: 'icon-tracking.png',
    tool: 'Grabify Tools',
    successRate: '76–100%',
    description: 'We help neutralize digital threats by tracking scammers using our Grabify Tools, which generate links or photos to capture information from imposters.',
    steps: [
      { title: 'Generate Grabify Tools', desc: 'Create shareable links or photos when imposters contact you repeatedly to scare them off or track them down.' },
      { title: 'Real-Time Tracking', desc: 'Reveals the scammer\'s identity once they interact with the generated content shared after generating.' },
      { title: 'Access Key Information', desc: 'Provides details on the imposter without needing professional assistance.' },
    ],
  },
  {
    id: 'pentest',
    name: 'Penetration Testing',
    icon: 'icon-pentest.png',
    tool: 'Brutal Penetration Tools',
    successRate: '77–85%',
    description: 'Comprehensive penetration testing for servers and applications to identify possible threats and block vulnerabilities.',
    steps: [
      { title: 'Brutal Penetration Tools', desc: 'Scans for loopholes based on your requested testing type.' },
      { title: 'Insider Protection Software', desc: 'Alerts you to high network traffic and potential threats.' },
      { title: 'System Updates', desc: 'Ensures older vulnerable versions are removed everywhere for smooth and secure operation.' },
    ],
  },
  {
    id: 'phishing',
    name: 'Phishing Threats',
    icon: 'icon-phishing.png',
    tool: 'AI-Powered Email/Website Filtering & Malicious Detection Tools',
    successRate: '55–70%',
    description: 'Phishing attacks use deceptive emails, texts and websites. Our AI-Powered Email/Website Filtering and Malicious Detection Tools help businesses and individuals stay protected.',
    steps: [
      { title: 'Advanced Malicious Detection Tools', desc: 'Works in identifying both known and unreported malicious links.' },
      { title: 'Photo Scanner', desc: 'Detects and blurs photos containing hidden malicious links used to attack devices remotely.' },
      { title: 'Ongoing Protection', desc: 'Create a personal or business account to regulate and block threats with AI tools.' },
    ],
  },
  {
    id: 'ransomware',
    name: 'Ransomware & Digital Extortion',
    icon: 'icon-ransomware.png',
    tool: 'Endpoint Rapid Backup and Recovery Tools',
    successRate: '75–98%',
    description: 'Digital Extortion won\'t be tolerated. We help disrupt ransomware and extortion attempts using our Endpoint Rapid Backup and Recovery Tools for businesses and individuals.',
    steps: [
      { title: 'Endpoint Rapid Backup', desc: 'Detects incoming attackers to secure your data quickly.' },
      { title: 'Recovery Tools', desc: 'We protect and recover compromised information.' },
      { title: 'Rapid Response Status', desc: 'Provides clear feedback with status indicators for threat neutralization.' },
    ],
  },
  {
    id: 'scam-fraud',
    name: 'Online Scam & Investment Fraud',
    icon: 'icon-scam-fraud.png',
    tool: 'Scam Monitoring Tools',
    successRate: '95–100%',
    description: 'Romance scams, tech support scams and crypto fraud has caused significant losses. We offer recovery and monitoring tools for businesses and individuals.',
    steps: [
      { title: 'Scam Monitoring Tools', desc: 'Prevents and neutralizes active ongoing scams.' },
      { title: 'Start Recovery Process', desc: 'Contact The Officials to start recovery before further data is lost or sold.' },
      { title: 'Stay Safe', desc: 'By purchasing threat tools you get a full video demo to maintain online privacy.' },
    ],
  },
  {
    id: 'reputation',
    name: 'Reputation & Brand Damage',
    icon: 'icon-reputation.png',
    tool: 'Reputation Management Services (RMS) & Dark Web Cleanup Tools',
    successRate: '65–87%',
    description: 'Public leaks of sensitive information can damage reputation. Our Reputation Management Services (RMS) and Dark Web Cleanup Tools protect businesses and individuals.',
    steps: [
      { title: 'Reputation Management Service', desc: 'We offer full privacy to safeguard brand information and client data.' },
      { title: 'Deep Dark Web Cleanup Tools', desc: 'WHTSIPA Cleanup Tools automatically detects and removes stolen information online linked to devices.' },
      { title: 'Threat Monitoring', desc: 'Proactively tracks and prevents public exposure.' },
    ],
  },
  {
    id: 'account-takeover',
    name: 'Account Takeover Fraud',
    icon: 'icon-account-takeover.png',
    tool: 'Rapid Recovery & Advanced Authentication Tools',
    successRate: '77–90%',
    description: 'Hackers seize control of accounts for financial gain. Our Rapid Recovery and Advanced Authentication Tools protect businesses and individuals.',
    steps: [
      { title: 'Recovery Process', desc: 'Professional assistance to regain control of hacked accounts.' },
      { title: 'Advanced Authentication Tools', desc: 'Restricts access to trusted devices only.' },
      { title: 'Real-Time Alerts', desc: 'Notifies you of any unauthorized access attempts from the time of the first alert.' },
    ],
  },
  {
    id: 'data-breach',
    name: 'Data Breaches & Leaks',
    icon: 'icon-data-breach.png',
    tool: 'Data Forensics, Rapid Response Retainers & BCM Tools',
    successRate: '69–97%',
    description: 'Unauthorized access leads to fines and loss of trust. We provide Data Forensics, Rapid Response Retainers, and Breach Credit Monitoring (BCM) Tools.',
    steps: [
      { title: 'Data Forensics Investigation', desc: 'Identifies where and how the breach occurred.' },
      { title: 'Rapid Response Retainers', desc: 'Ensures quick and effective threat response.' },
      { title: 'Breach Monitoring', desc: 'Continuously tracks potential misuse of your data and sends timely alerts.' },
    ],
  },
  {
    id: 'ddos',
    name: 'DDoS Attacks',
    icon: 'icon-ddos.png',
    tool: 'Scrubbing Center & Traffic Monitoring Tools',
    successRate: '76–99%',
    description: 'DDoS attacks flood systems and cause downtime. Our Scrubbing Center and Traffic Monitoring Tools provide zero-downtime protection.',
    steps: [
      { title: 'Scanner Tools', desc: 'Identifies threats before they impact services.' },
      { title: 'Scrubbing Center', desc: 'Filters malicious traffic during attacks.' },
      { title: 'Traffic Monitoring Tools', desc: 'Maintains normal traffic levels and prevents downtime.' },
    ],
  },
  {
    id: 'api-security',
    name: 'API Security Threats',
    icon: 'icon-api-security.png',
    tool: 'Secure API Gateways (SAG) & Penetration Tools',
    successRate: '45–75%',
    description: 'Exploited APIs expose sensitive data. Our Secure API Gateways and Penetration Tools protect businesses and individuals.',
    steps: [
      { title: 'Analysis Tools', desc: 'Scans for exploited APIs manually or automatically.' },
      { title: 'Secure API Gateways (SAG)', desc: 'Blocks threats and marks suspicious activity.' },
      { title: 'Retesting', desc: 'Verifies security after implementing protections.' },
    ],
  },
  {
    id: 'identity-theft',
    name: 'Identity Theft & Fraud Threats',
    icon: 'icon-identity-theft.png',
    tool: 'Nonstop Identity Theft Prevention, Dark Web Monitoring & Restoration Tools',
    successRate: '75–98%',
    description: 'Stolen identities are used for fraud. Our Nonstop Identity Theft Prevention, Dark Web Monitoring, and Restoration Tools serve businesses and individuals.',
    steps: [
      { title: 'Spot Threats', desc: 'Use alerts and monitoring to detect risks early.' },
      { title: 'Nonstop Prevention Tools', desc: '24/7 surveillance and management services.' },
      { title: 'Dark Web Monitoring', desc: 'Detects and removes stolen data from sale sites.' },
    ],
  },
  {
    id: 'malware',
    name: 'Malware Infection (Virus)',
    icon: 'icon-malware.png',
    tool: 'New Generation Antivirus (NGA), Device Management & Malware Cleanup Tools',
    successRate: '95–99%',
    description: 'Various malware types (Botnets, Adware, Spyware, Trojans, etc.) threaten devices. Our New Generation Antivirus (NGA), Device Management, and Malware Cleanup Tools protect businesses and individuals.',
    steps: [
      { title: 'NGA Tools', desc: 'Provides advanced virus protection.' },
      { title: 'Device Management', desc: 'Monitors connections to reduce infection risks.' },
      { title: 'Malware Cleanup', desc: '24/7 service to remove threats and verify safety.' },
    ],
  },
  {
    id: 'crypto-drainer',
    name: 'Crypto Drainer Threats',
    icon: 'icon-crypto-drainer.png',
    tool: 'Crypto Detection & Monitoring Tools',
    successRate: '65–89%',
    description: 'Airdrop drainers steal crypto assets. We provide detection, monitoring, and recovery tools.',
    steps: [
      { title: 'Report Drainer Links', desc: 'Helps track stolen transactions.' },
      { title: 'Wallet Monitoring', desc: 'Tracks where stolen assets are moved.' },
      { title: 'Recovery Assistance', desc: 'Active support to recover funds when possible.' },
    ],
  },
  {
    id: 'delivery-scam',
    name: 'Fake Package (UPS) & Delivery Scams',
    icon: 'icon-delivery-scam.png',
    tool: 'Real-Time Detection & Link Verification Tools',
    successRate: '55–70%',
    description: 'We offer real-time detection and link verification tools for businesses and individuals.',
    steps: [
      { title: 'Spot Delivery Scams', desc: 'Verify sources using detection tools.' },
      { title: 'Report Fake Links', desc: 'Take down reported scam websites.' },
      { title: 'Stay Protected', desc: 'Use verification tools to avoid scams.' },
    ],
  },
  {
    id: 'unpatched-software',
    name: 'Unpatched Software Threats',
    icon: 'icon-unpatched-software.png',
    tool: 'Endpoint Server & Vulnerability Scanner Tools',
    successRate: '77–89%',
    description: 'Outdated software creates entry points for attacks. Our Endpoint Server and Vulnerability Scanner Tools protect businesses and individuals.',
    steps: [
      { title: 'Software Updates', desc: 'Removes old vulnerable versions.' },
      { title: 'Deep Analysis', desc: 'Identifies needed security updates.' },
      { title: 'Alerts', desc: 'Notifies you of critical patches and changes.' },
    ],
  },
  {
    id: 'cctv-surveillance',
    name: 'CCTV Home & Office Surveillance Threats',
    icon: 'icon-cctv-surveillance.png',
    tool: 'New Private Access Protection Key (NPAPK) & Surveillance Protection Tools',
    successRate: '45–70%',
    description: 'We protect footage with New Private Access Protection Key (NPAPK) and Surveillance Protection Tools for businesses and individuals.',
    steps: [
      { title: 'Public Access Control', desc: 'Prevents unauthorized viewing.' },
      { title: 'Private Access Tools', desc: 'Converts public IPs to secure private access.' },
      { title: 'Surveillance Protocol', desc: 'Limits viewing to authorized devices only.' },
    ],
  },
  {
    id: 'social-media-threat',
    name: 'Social Media Monitoring Threats',
    icon: 'icon-social-media-threat.png',
    tool: 'Social Media Monitoring & Protection Tools',
    successRate: '70–92%',
    description: 'We offer monitoring and protection tools to safeguard accounts and reputation for businesses and individuals.',
    steps: [
      { title: 'Social Media Threats', desc: 'Restrict accounts to trusted devices.' },
      { title: 'Monitoring Tools', desc: 'Alerts for new logins or suspicious activity.' },
      { title: 'Account Protection Tools', desc: 'Emergency lockdown options for reputation safety.' },
    ],
  },
  {
    id: 'botnet',
    name: 'Botnets & Zombie Network Attacks',
    icon: 'icon-botnet.png',
    tool: 'Device Cleanup, Network Segmentation & Botnet Blocker Tools',
    successRate: '77–95%',
    description: 'Our Device Cleanup, Network Segmentation, and Botnet Blocker Tools protect businesses and individuals.',
    steps: [
      { title: 'Report Botnet Activity', desc: 'Documents and targets active threats.' },
      { title: 'Botnet Blocker Tools', desc: 'Tracks and blocks infections across devices.' },
      { title: 'Device Cleanup', desc: 'Permanently removes botnet connections.' },
    ],
  },
]

// Active tab state
const TABS = ['Types of Threats', 'Threat & Tool Analysis', 'How Our Tools Work', 'Request Tools']

export default function ThreatsTools() {
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
                  <Link to={`/threats/${threat.id}`} className="text-decoration-none">
                    <div className="tt-threat-card">
                      <div className="tt-threat-icon-wrap">
                        <img
                          src={`/src/assets/media/icons/${threat.icon}`}
                          alt={threat.name}
                          className="tt-threat-icon"
                        />
                       
                      </div>
                      <div className="tt-threat-name">{threat.name}</div>
                    </div>
                  </Link>
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
                    <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }}>
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
                          <select className="contact-field" value={requestForm.tool} onChange={set('tool')} required>
                            <option value="">Select a tool category</option>
                            {THREATS_AND_TOOLS.map(t => (
                              <option key={t.id} value={t.tool}>{t.tool}</option>
                            ))}
                            <option value="custom">Custom / Not Listed</option>
                          </select>
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