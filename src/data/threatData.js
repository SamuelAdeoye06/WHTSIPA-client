// src/data/threatData.js
// Full content for all threat detail pages

export const THREAT_DATA = {
  'phishing-emails': {
    title: 'Phishing Emails',
    emoji: '🎣',
    risk: 'high',
    riskLabel: 'HIGH RISK',
    category: 'Email Safety',
    tagline: 'Credential theft likely',
    safeHandling: 'Do not click links or download attachments from unexpected senders.',
    overview: `Phishing emails impersonate trusted brands to steal credentials, deliver malware,
    or drive fraudulent payments. Deceptive emails, texts, and websites are designed to trick
    users into revealing credentials or clicking malicious links. Campaigns may escalate to
    business email compromise and cause severe financial and reputational damage.`,
    solutions: `Our AI-powered Email Filtering, Simulated Phishing Training, and Real-Time Link
    Scanning tools protect your organization and employees from phishing threats.`,
    prevention: [
      { title: 'Verify before trusting', desc: 'Use official contact paths and confirm requests out-of-band before acting on any email instructions.' },
      { title: 'Inspect links safely', desc: 'Hover to preview destinations and avoid shortened URLs. Use a link scanner before clicking.' },
      { title: 'Authenticate email', desc: 'Check SPF, DKIM, and DMARC posture with your organization to filter spoofed senders.' },
      { title: 'Enable MFA everywhere', desc: 'Even if credentials are stolen, MFA prevents attackers from accessing your accounts.' },
      { title: 'Report suspicious emails', desc: 'Forward phishing attempts to your IT team and to WHTS for investigation and pattern tracking.' },
      { title: 'Use email filtering tools', desc: 'Deploy AI-powered email filtering tools to automatically detect and quarantine phishing attempts.' },
    ],
    indicators: [
      'Urgent language demanding immediate action',
      'Sender domain doesn\'t match the brand (e.g. paypal-secure.com)',
      'Generic greetings like "Dear Customer"',
      'Links that don\'t match the displayed text on hover',
      'Requests for credentials, OTPs, or payment details',
      'Unexpected attachments — especially .exe, .zip, .docm files',
    ],
  },

  'ransomware': {
    title: 'Ransomware',
    emoji: '🧱',
    risk: 'high',
    riskLabel: 'HIGH RISK',
    category: 'Digital Extortion',
    tagline: 'Immediate isolation required',
    safeHandling: 'Never pay the ransom. Isolate the device from the network immediately.',
    overview: `Ransomware is incoming malware that encrypts your data and demands payment —
    often with threats to publicly leak sensitive information. WHTSIPA 2018-2022 research shows
    many companies and individuals have been forced to shut down operations due to ransomware attacks.`,
    solutions: `Our solutions include Immutable Backups, Endpoint Detection & Response (EDR), and
    Rapid Decryption Negotiation tools to minimize damage and disrupt attackers.`,
    prevention: [
      { title: 'Maintain offline backups', desc: 'Keep regular, verified backups stored offline or in immutable cloud storage — test them frequently.' },
      { title: 'Enable EDR tools', desc: 'Deploy Endpoint Detection & Response tools to detect ransomware behavior before encryption begins.' },
      { title: 'Patch all systems', desc: 'Most ransomware exploits known vulnerabilities. Update OS, software, and firmware immediately.' },
      { title: 'Disable macros by default', desc: 'Ransomware is often delivered via Office documents with macros. Disable macro execution by default.' },
      { title: 'Segment your network', desc: 'Limit lateral movement — isolate critical systems so ransomware cannot spread across your entire environment.' },
      { title: 'Train staff on delivery methods', desc: 'Most ransomware arrives via phishing. Conduct regular phishing simulation training for all staff.' },
    ],
    indicators: [
      'Files suddenly have unfamiliar extensions (.locked, .encrypted, .WNCRY)',
      'Ransom note appears on desktop or in file folders',
      'Programs fail to open — files are corrupted',
      'Unusually high disk activity with no clear cause',
      'Network connections to unknown external IP addresses',
      'Security software disabled or unresponsive',
    ],
  },

  'deepfake': {
    title: 'Deepfake & Synthetic Identity',
    emoji: '🎭',
    risk: 'high',
    riskLabel: 'HIGH RISK',
    category: 'AI-Powered Fraud',
    tagline: 'Verify all media authenticity',
    safeHandling: 'Never act on video or audio instructions alone — always verify through a separate, known channel.',
    overview: `AI-generated fake videos and audio are used to impersonate top executives or loved ones
    for extortion, identity fraud, and financial loss. Deepfake technology has become accessible
    enough that convincing impersonations can be created in minutes, making traditional trust signals
    unreliable without additional verification.`,
    solutions: `WHTSIPA introduces advanced Deepfake Detection Tools that help organizations and
    individuals identify and mitigate these sophisticated threats before financial or reputational damage occurs.`,
    prevention: [
      { title: 'Use Deepfake Detection tools', desc: 'Run suspicious media through our AI-powered Deepfake Detection tools to verify authenticity.' },
      { title: 'Establish verification protocols', desc: 'Never execute financial transfers based on video or voice alone — always confirm via a known second channel.' },
      { title: 'Train on visual indicators', desc: 'Look for unnatural blinking, facial edge blurring, inconsistent lighting, and lip sync issues.' },
      { title: 'Use reverse image/video search', desc: 'Check if profile images or video clips appear elsewhere under different identities.' },
      { title: 'Secure executive communications', desc: 'Limit public video/audio of executives — less training data means lower quality fakes.' },
      { title: 'Implement voice verification', desc: 'For high-value calls, use cryptographic voice authentication tools instead of relying on sound alone.' },
    ],
    indicators: [
      'Unnatural blinking frequency or eye movement',
      'Blurry or shifting edges around the face and hair',
      'Lip sync slightly out of alignment with audio',
      'Inconsistent skin tone or lighting across the face',
      'Background appears warped or distorted near face edges',
      'Audio quality doesn\'t match video quality',
    ],
  },

  'bec': {
    title: 'Business Email Compromise',
    emoji: '📨',
    risk: 'high',
    riskLabel: 'HIGH RISK',
    category: 'Corporate Fraud',
    tagline: 'Financial loss risk — verify all wire requests',
    safeHandling: 'Never execute a wire transfer or payment based solely on an email request — always verify by phone.',
    overview: `BEC attacks involve targeted email scams impersonating CEOs or executives to initiate
    fraudulent wire transfers. Companies lose billions annually, with finance professionals and
    government procurement teams being prime targets. Attackers often monitor email accounts for
    weeks before striking at the perfect moment.`,
    solutions: `Our BEC Protection includes Email Authentication Protocols, Third-Party Alerts, and
    AI-powered Anomaly Detection tools. We also offer executive training and demo sessions.`,
    prevention: [
      { title: 'Enforce payment verification', desc: 'Any wire transfer request must be verbally confirmed with the requester using a known phone number — not one from the email.' },
      { title: 'Deploy email authentication tools', desc: 'Implement DMARC, DKIM, and SPF. Use AI-powered Anomaly Detection tools to flag unusual sending patterns.' },
      { title: 'Set up third-party alerts', desc: 'Enable Third-Party Alerts on your email platform to flag messages from external senders impersonating internal domains.' },
      { title: 'Train finance and executive staff', desc: 'BEC targets specific roles. Conduct regular training and simulated BEC attacks for high-risk employees.' },
      { title: 'Use dual approval for transfers', desc: 'Require two-person authorization for all wire transfers above a defined threshold.' },
      { title: 'Monitor email forwarding rules', desc: 'Attackers often set up silent forwarding rules. Regularly audit email account rules for unauthorized changes.' },
    ],
    indicators: [
      'Request for urgent wire transfer with unusual instructions',
      'Sender email is slightly different from the real domain (e.g. .co instead of .com)',
      'Executive "requests" are made while they are supposedly traveling',
      'Vendor banking details changed via email just before a payment is due',
      'Pressure to act quickly and keep the transaction confidential',
      'Reply-to address is different from the displayed sender address',
    ],
  },

  'malware': {
    title: 'Malware Protection',
    emoji: '🧬',
    risk: 'mid',
    riskLabel: 'MED RISK',
    category: 'Endpoint Security',
    tagline: 'Contain and scan immediately',
    safeHandling: 'Disconnect from the network immediately. Do not restart — this can trigger further payload execution.',
    overview: `Malicious software is deployed at scale to steal data, disrupt systems, and enable
    further attacks. From keyloggers capturing banking credentials to spyware conducting corporate
    espionage, malware remains one of the most versatile and persistent threats facing individuals
    and organizations today.`,
    solutions: `The Officials offer New-Generation Antivirus, Automated Scanning tools, Device Management,
    and 24/7 Malware Cleanup services. We also provide Keylogger Detection, Endpoint Protection
    Software (EPS), Profile Monitoring, and Privacy Audit tools.`,
    prevention: [
      { title: 'Use New-Generation Antivirus tools', desc: 'Traditional signature-based AV misses modern threats. Deploy behaviour-based New-Generation Antivirus tools for real-time protection.' },
      { title: 'Limit download sources', desc: 'Only install software from verified, official sources. Avoid pirated software and sideloaded APKs.' },
      { title: 'Enable automatic patching', desc: 'Malware exploits unpatched software vulnerabilities. Keep all systems and applications automatically updated.' },
      { title: 'Use Endpoint Protection tools', desc: 'Deploy Endpoint Protection Software (EPS) and run regular automated scans across all devices.' },
      { title: 'Conduct Privacy Audits', desc: 'Regularly review app permissions, browser extensions, and installed software to detect unauthorized tools.' },
      { title: 'Isolate infected devices', desc: 'At first sign of infection, disconnect from all networks to prevent lateral spread before running cleanup.' },
    ],
    indicators: [
      'Device slows down significantly without explanation',
      'Unexpected pop-ups, ads, or browser redirects',
      'Programs opening, closing, or installing themselves',
      'Data usage spikes with no clear cause',
      'Webcam or microphone active without user action',
      'Antivirus or security software suddenly disabled',
    ],
  },

  'identity-theft': {
    title: 'Identity Theft & Fraud',
    emoji: '🪪',
    risk: 'high',
    riskLabel: 'HIGH RISK',
    category: 'Identity Protection',
    tagline: 'Act within the first 24 hours',
    safeHandling: 'Contact your bank immediately to freeze accounts. File a police report and contact WHTS.',
    overview: `Stolen personal or corporate identities are used for fraudulent loans, account creation,
    tax fraud, and corporate espionage. Identity thieves compile information from data breaches,
    social engineering, and physical theft to impersonate victims for financial gain. The damage
    can take years to fully resolve without expert guidance.`,
    solutions: `Our Nonstop Identity Theft Protection tools include Dark Web Monitoring, Credit Alerts,
    Identity Restoration Insurance, and Enterprise Identity protection — monitoring continuously
    for unauthorized use of your personal information.`,
    prevention: [
      { title: 'Enable Dark Web Monitoring', desc: 'Use our Dark Web Monitoring tools to detect if your credentials or personal data appear in breach databases.' },
      { title: 'Freeze your credit proactively', desc: 'Don\'t wait until theft occurs — freeze your credit with all major bureaus as a preventive measure.' },
      { title: 'Use unique strong passwords + MFA', desc: 'Reused passwords across sites amplify the impact of any single breach. Use a password manager and enable MFA everywhere.' },
      { title: 'Shred sensitive documents', desc: 'Physical documents like bank statements and medical records are still a major source of identity theft data.' },
      { title: 'Monitor your credit alerts', desc: 'Set up Credit Alerts to be notified immediately of any new accounts, hard inquiries, or unusual activity.' },
      { title: 'Limit shared personal information', desc: 'Be selective about what personal information you share online, especially on social media and public forms.' },
    ],
    indicators: [
      'Credit card bills for accounts you never opened',
      'Unexpected hard inquiries on your credit report',
      'Medical bills for treatments you never received',
      'Tax return rejected because one was already filed',
      'Calls from debt collectors about debts you don\'t recognize',
      'Accounts locked because someone changed your credentials',
    ],
  },

  'wifi-hack': {
    title: 'WiFi Network Hacking',
    emoji: '📡',
    risk: 'mid',
    riskLabel: 'MED RISK',
    category: 'Network Security',
    tagline: 'Use a VPN on any public network',
    safeHandling: 'Disconnect from public WiFi before accessing any sensitive accounts or performing transactions.',
    overview: `Attackers exploit unsecured or poorly configured WiFi networks to intercept traffic,
    steal credentials, and perform man-in-the-middle attacks. Evil twin hotspots — fake networks
    mimicking legitimate ones — are used in airports, hotels, and cafes to silently capture all
    data passing through connected devices.`,
    solutions: `WHTS provides network security assessment tools and VPN configuration guidance to protect
    your connections on any network type. Our tools identify rogue access points and alert you
    to suspicious network behavior in real time.`,
    prevention: [
      { title: 'Always use a VPN', desc: 'A VPN encrypts your traffic regardless of the network you are on. Use one on every public WiFi connection.' },
      { title: 'Verify network names with staff', desc: 'Before connecting to WiFi in a public place, confirm the exact network name with an employee — don\'t guess.' },
      { title: 'Upgrade home WiFi to WPA3', desc: 'WEP and WPA2 are crackable with widely available tools. Upgrade your router firmware and security protocol to WPA3.' },
      { title: 'Disable auto-connect', desc: 'Turn off automatic WiFi joining on all devices to prevent silent connections to rogue networks.' },
      { title: 'Avoid sensitive actions on public WiFi', desc: 'Even with a VPN, avoid online banking, entering card details, or accessing work systems on public networks where possible.' },
      { title: 'Use mobile data for sensitive tasks', desc: 'For high-value transactions, switch to your mobile data connection — it is significantly more secure than public WiFi.' },
    ],
    indicators: [
      'Network name is very similar but slightly different to the expected one',
      'Connection drops frequently with no clear cause',
      'HTTPS padlock missing on sites that normally have it',
      'Browser certificate warnings on familiar websites',
      'Unusually slow speeds despite strong signal',
      'Device connects to a network you don\'t recognize',
    ],
  },

  // ── Threat detail pages to be built ── (PDF-sourced content)
  'ddos-protection': {
    title: 'DDoS Protection',
    emoji: '🌐',
    risk: 'mid',
    riskLabel: 'MED RISK',
    category: 'Infrastructure Security',
    tagline: 'Always-on mitigation required',
    safeHandling: 'Enable traffic scrubbing immediately upon detecting a DDoS. Contact your ISP and WHTS.',
    overview: `Distributed Denial of Service attacks flood systems with traffic from thousands of
    compromised devices (botnets), causing total service downtime. Government agencies, financial
    institutions, and ecommerce platforms are frequent targets — but any online service is at risk.`,
    solutions: `Our Cloud-based Scrubbing Centers, Traffic Monitoring, and Always-On Mitigation tools
    ensure zero-downtime protection. We also offer Device cleanup, network segmentation, and
    botnet blocking at the ISP level tools.`,
    prevention: [
      { title: 'Deploy Always-On Mitigation tools', desc: 'Don\'t wait for an attack — deploy Always-On Mitigation tools that filter malicious traffic before it reaches your servers.' },
      { title: 'Use Cloud Scrubbing Centers', desc: 'Route your traffic through Cloud-based Scrubbing Centers that separate legitimate from attack traffic in real time.' },
      { title: 'Implement rate limiting', desc: 'Configure rate limiting at your network edge to throttle abnormal request volumes from single sources.' },
      { title: 'Enable Traffic Monitoring tools', desc: 'Set up continuous Traffic Monitoring tools with automated alerts when request patterns deviate from baseline.' },
      { title: 'Work with your ISP for blocking', desc: 'Engage your ISP for upstream botnet blocking — stopping attack traffic before it reaches your infrastructure.' },
      { title: 'Maintain an incident response plan', desc: 'Have a DDoS response plan in place — know which teams to notify and what mitigation actions to take at each severity level.' },
    ],
    indicators: [
      'Website or service becomes unavailable with no infrastructure issues',
      'Massive spike in incoming traffic from multiple geographic sources',
      'Server CPU, memory, or bandwidth suddenly at 100%',
      'Unusually high number of requests to a single endpoint',
      'Network logs show traffic from known botnet IP ranges',
      'Users report service unavailability across different networks',
    ],
  },

  'cloud-security': {
    title: 'Cloud Security',
    emoji: '☁️',
    risk: 'mid',
    riskLabel: 'MED RISK',
    category: 'Cloud Infrastructure',
    tagline: 'Misconfigurations are the top cloud threat',
    safeHandling: 'Immediately revoke public access to exposed buckets or misconfigured resources.',
    overview: `Exposed cloud storage buckets and weak configurations lead to public data leaks across
    all industries. Cloud environments are powerful but require deliberate security configuration —
    default settings are often insecure, and a single misconfiguration can expose millions of records.`,
    solutions: `Our Cloud Security solutions include Automated Configuration Scanning, Cloud Leakage
    Alerts, and CSPM (Cloud Security Posture Management) tools to continuously secure your
    cloud environment.`,
    prevention: [
      { title: 'Use CSPM tools', desc: 'Deploy Cloud Security Posture Management (CSPM) tools to continuously scan for misconfigurations across your cloud environment.' },
      { title: 'Enable Automated Configuration Scanning', desc: 'Run automated scans after every infrastructure change to catch misconfigurations before they can be exploited.' },
      { title: 'Set up Cloud Leakage Alerts', desc: 'Configure Cloud Leakage Alerts to notify you immediately when any storage bucket or resource becomes publicly accessible.' },
      { title: 'Apply least-privilege access', desc: 'Grant only the minimum permissions needed for each user and service. Audit and reduce permissions regularly.' },
      { title: 'Encrypt data at rest and in transit', desc: 'Enable encryption for all stored data and enforce HTTPS for all data in transit within your cloud environment.' },
      { title: 'Audit logs continuously', desc: 'Enable cloud audit logging and review it regularly — unauthorized access often appears in logs before a breach is confirmed.' },
    ],
    indicators: [
      'Storage bucket or database accessible without authentication',
      'Cloud audit logs show access from unfamiliar IP addresses or regions',
      'Unexplained data transfer costs in cloud billing',
      'Public internet access enabled on resources that should be private',
      'IAM roles with wildcard permissions (*) in production',
      'Sensitive data found indexed by search engines',
    ],
  },

  'spyware-detection': {
    title: 'Spyware & Keylogger Detection',
    emoji: '🕵️',
    risk: 'mid',
    riskLabel: 'MED RISK',
    category: 'Device Privacy',
    tagline: 'Silent surveillance — detect before damage',
    safeHandling: 'Do not use the suspected device for any sensitive tasks. Run a full scan on a separate network.',
    overview: `Targeted spyware and keyloggers are installed to conduct banking theft, corporate espionage,
    and data sales on the dark web. Unlike obvious malware, spyware operates silently — monitoring
    keystrokes, capturing screenshots, and exfiltrating data without triggering visible symptoms.`,
    solutions: `Our solutions include Keylogger Detection, Endpoint Protection Software (EPS), Profile
    Monitoring, and Privacy Audit tools to identify and remove covert surveillance software
    from your devices.`,
    prevention: [
      { title: 'Run Keylogger Detection tools', desc: 'Deploy specialized Keylogger Detection tools that identify covert keystroke-capturing software that standard antivirus misses.' },
      { title: 'Conduct regular Privacy Audits', desc: 'Periodically audit all installed apps, browser extensions, and background processes for unauthorized surveillance software.' },
      { title: 'Use Endpoint Protection Software', desc: 'EPS tools monitor device behavior continuously, flagging processes that access the keyboard, clipboard, or microphone unexpectedly.' },
      { title: 'Avoid untrusted USB devices', desc: 'Spyware is commonly delivered via infected USB drives. Never plug in a device you didn\'t personally verify.' },
      { title: 'Enable Profile Monitoring', desc: 'Use Profile Monitoring tools to detect changes to device configuration profiles that may enable covert surveillance.' },
      { title: 'Use hardware privacy screens', desc: 'Protect against visual shoulder-surfing and screen-capture spyware by using privacy screen filters in public spaces.' },
    ],
    indicators: [
      'Device battery drains unusually fast with no heavy usage',
      'Unexpected background data usage when device appears idle',
      'Keyboard feels slightly delayed or laggy',
      'Microphone or camera indicator activates without user action',
      'Accounts show logins from unknown devices or locations',
      'System settings or security software modified without your action',
    ],
  },
}

// Slugs that use the same template but aren't built yet
// — these can be added to THREAT_DATA above as content is confirmed
export const THREAT_SLUGS = Object.keys(THREAT_DATA)