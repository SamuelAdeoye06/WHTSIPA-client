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

  'phone-hack': {
    title: 'Phone Hacking',
    emoji: '📱',
    risk: 'high',
    riskLabel: 'HIGH RISK',
    category: 'Mobile Security',
    tagline: 'Your phone is your most targeted device',
    safeHandling: 'Do not use the suspected device for any sensitive tasks. Run a full scan from a clean network.',
    overview: `Phone hacking gives attackers full access to your calls, messages, banking apps,
    and personal data. From SIM swapping to malicious apps installed via phishing links, mobile
    devices are the most targeted endpoints in modern cybercrime. Once compromised, an attacker
    can silently monitor everything on your device in real time.`,
    solutions: `WHTS provides Mobile Threat Detection tools, SIM swap alerts, and device security
    audits to protect your phone from unauthorized access and monitoring.`,
    prevention: [
      { title: 'Enable SIM swap protection', desc: 'Contact your carrier and add a PIN or passphrase required before any SIM changes are authorized.' },
      { title: 'Audit app permissions', desc: 'Regularly review every app\'s permissions — remove access to contacts, microphone, and location for apps that don\'t need it.' },
      { title: 'Only install from official stores', desc: 'Never sideload APKs from outside the Play Store or App Store — they bypass security checks entirely.' },
      { title: 'Enable full disk encryption', desc: 'Ensure your phone\'s storage is fully encrypted so stolen data cannot be read without your PIN.' },
      { title: 'Use Mobile Threat Detection tools', desc: 'Deploy Mobile Threat Detection tools to continuously scan for malicious behavior, rogue apps, and network anomalies.' },
      { title: 'Enable remote wipe', desc: 'Set up Find My Device / Find My iPhone so you can remotely erase your phone if it is stolen or compromised.' },
    ],
    indicators: [
      'Battery drains unusually fast with light usage',
      'Phone feels warm even when idle',
      'Unexplained data usage spikes',
      'Unfamiliar apps appearing without installation',
      'Calls or texts sent that you didn\'t make',
      'Accounts sending messages you never wrote',
    ],
  },

  'call-scam': {
    title: 'Call Scams (Vishing)',
    emoji: '📞',
    risk: 'mid',
    riskLabel: 'MED RISK',
    category: 'Social Engineering',
    tagline: 'Hang up — then verify independently',
    safeHandling: 'Never give OTPs, card numbers, or personal details to an inbound caller — regardless of who they claim to be.',
    overview: `Voice phishing (vishing) uses phone calls to impersonate banks, government agencies,
    and tech support to extract credentials, OTPs, and payments. Caller ID spoofing makes these
    calls appear to come from legitimate numbers, making them highly convincing. Billions are lost
    annually to call scams targeting individuals and businesses.`,
    solutions: `WHTS provides call scam reporting tools, caller verification guidance, and
    real-time scam number databases to help you identify and report fraudulent callers.`,
    prevention: [
      { title: 'Never give OTPs over the phone', desc: 'Legitimate banks and agencies never ask for one-time passwords, PINs, or passwords over the phone — ever.' },
      { title: 'Hang up and call back officially', desc: 'If a caller claims to be from your bank or a government agency, hang up and call the official number from their website.' },
      { title: 'Understand caller ID spoofing', desc: 'The number displayed on your screen can be faked. A call appearing from your bank\'s number does not mean it is your bank.' },
      { title: 'Register on do-not-call lists', desc: 'Register your number on official do-not-call registries to reduce unsolicited calls from scammers.' },
      { title: 'Use call filtering apps', desc: 'Enable your phone\'s built-in spam call filtering or install call-screening apps that flag known scam numbers.' },
      { title: 'Report scam numbers to WHTS', desc: 'Report the number and details to WHTS immediately so it can be flagged in our scam number database.' },
    ],
    indicators: [
      'Caller creates extreme urgency — "act now or face consequences"',
      'Requests payment via gift card, wire transfer, or cryptocurrency',
      'Asks for OTP, PIN, or full card number',
      'Claims you owe taxes, fees, or fines payable immediately',
      'Threatens arrest, account suspension, or legal action',
      'Caller discourages you from verifying with anyone else',
    ],
  },

  'tax-refund-scam': {
    title: 'Tax Refund Scam',
    emoji: '🧾',
    risk: 'mid',
    riskLabel: 'MED RISK',
    category: 'Government Impersonation',
    tagline: 'Governments mail letters — they never text refund links',
    safeHandling: 'Go directly to the official tax authority website. Never click links in emails or texts claiming to be about your refund.',
    overview: `Tax refund scams impersonate government tax agencies to steal banking details,
    NINs, and personal data under the guise of processing a refund. These scams peak around
    tax season but run year-round, using emails, SMS, and fake websites that mirror official
    government portals pixel-for-pixel to deceive victims.`,
    solutions: `WHTS provides guidance on verifying tax communications and reporting
    government impersonation scams to the appropriate authorities.`,
    prevention: [
      { title: 'Always use the official portal', desc: 'Access your tax account directly through the official government website — never through links in messages.' },
      { title: 'Know how agencies contact you', desc: 'Most tax authorities initiate contact via official mail with reference numbers — not SMS, email, or WhatsApp.' },
      { title: 'Never pay via gift cards or crypto', desc: 'No government tax agency accepts payment via gift cards, wire transfer to personal accounts, or cryptocurrency.' },
      { title: 'Protect your government ID', desc: 'Your national identification number is the master key to your tax identity — never share it in response to unsolicited contact.' },
      { title: 'File taxes early', desc: 'Filing your tax return early reduces the window for fraudsters to file a fake return in your name and claim your refund.' },
      { title: 'Report to authorities', desc: 'Report tax scam attempts to the IRS, HMRC, or your national tax authority and to WHTS immediately.' },
    ],
    indicators: [
      'Unexpected refund notification via SMS, email, or WhatsApp',
      'Link in message goes to a non-government domain',
      'Asks for bank account details to "process" the refund',
      'Threatens penalties for not acting immediately',
      'Caller or message references a case number you cannot verify',
      'Refund amount seems unusually high',
    ],
  },

  'romance-scam': {
    title: 'Romance Scam',
    emoji: '💔',
    risk: 'high',
    riskLabel: 'HIGH RISK',
    category: 'Social Engineering',
    tagline: 'Verify before you trust — and never send money',
    safeHandling: 'Stop all contact, preserve all evidence, and report to WHTS and the platform immediately.',
    overview: `Romance scammers build fabricated emotional relationships online over weeks or months
    before exploiting the victim financially. They use stolen photos, scripted conversations, and
    manufactured emergencies to extract money, gift cards, or cryptocurrency. Victims lose not just
    money but suffer significant emotional and psychological harm.`,
    solutions: `WHTS provides romance scam detection guidance, reverse image search tools, and
    reporting pathways to help victims stop the abuse and begin recovery.`,
    prevention: [
      { title: 'Reverse image search every profile', desc: 'Before investing emotionally, run their profile photos through reverse image search — stolen photos from models are common.' },
      { title: 'Insist on live video calls', desc: 'Request unscheduled live video calls from a specific angle or with a hand gesture — fakers will always have an excuse to avoid it.' },
      { title: 'Never send money to online contacts', desc: 'No matter how real the relationship feels, never send money, gift cards, or crypto to someone you haven\'t met in person.' },
      { title: 'Be cautious of fast emotional escalation', desc: 'Scammers accelerate emotional intimacy deliberately to create trust before the ask. Real relationships develop over time.' },
      { title: 'Talk to someone you trust', desc: 'If a friend or family member expresses concern about someone you\'ve met online, take that seriously — outsiders spot red flags faster.' },
      { title: 'Report and stop contact immediately', desc: 'Once you suspect a romance scam, stop all contact, document everything, and report to WHTS and the platform.' },
    ],
    indicators: [
      'Claims to be overseas — military, oil rig, medical mission',
      'Professes love or deep connection within days or weeks',
      'Always has an excuse to avoid video calls or meeting in person',
      'Profile photos look professional or appear elsewhere online',
      'Eventually asks for money for an emergency, travel, or fees',
      'Story details change or contradict previous conversations',
    ],
  },

  'fake-job': {
    title: 'Fake Job Scam',
    emoji: '💼',
    risk: 'mid',
    riskLabel: 'MED RISK',
    category: 'Recruitment Fraud',
    tagline: 'Legitimate employers never charge you to work',
    safeHandling: 'Stop all contact, do not send money or documents, and report to WHTS and relevant job platforms.',
    overview: `Fake job offers target job seekers with promises of high-paying remote work to steal
    personal documents, charge fees, or launder money through victim accounts. These scams are
    increasingly sophisticated — using fake company websites, professional email signatures, and
    fabricated offer letters to appear legitimate before the trap is sprung.`,
    solutions: `WHTS provides job scam verification tools and reporting pathways to protect
    job seekers and help dismantle fraudulent recruitment operations.`,
    prevention: [
      { title: 'Verify the company independently', desc: 'Search the company name plus "scam" or "reviews", check their official website, and verify the recruiter on LinkedIn.' },
      { title: 'Never pay to get a job', desc: 'Legitimate employers never charge application fees, training fees, equipment deposits, or background check fees.' },
      { title: 'Protect your documents', desc: 'Never send your government ID, passport, or bank details before receiving a verified, signed offer letter from a verifiable company.' },
      { title: 'Be skeptical of unrealistic offers', desc: '"Earn $5,000/week from home, no experience needed" is always a scam. Research realistic salaries for the role and industry.' },
      { title: 'Use official job platforms', desc: 'Apply through verified platforms like LinkedIn, Indeed, or company career pages — not via WhatsApp, Telegram, or Instagram DMs.' },
      { title: 'Report fake listings', desc: 'Report fraudulent job postings to the platform, to WHTS, and to your national consumer protection agency.' },
    ],
    indicators: [
      'Contacted out of nowhere by a recruiter you never applied to',
      'Asked to pay a fee before starting or receiving payment',
      'Interview conducted entirely via chat with no video call',
      'Offer letter has spelling errors or unprofessional formatting',
      'Asked to receive money in your account and forward it on',
      'Company has no verifiable web presence or physical address',
    ],
  },

  'stalking-scam': {
    title: 'Online Stalking & Tracking',
    emoji: '👁️',
    risk: 'mid',
    riskLabel: 'MED RISK',
    category: 'Digital Stalking',
    tagline: 'Stalkerware is invisible — audit your device now',
    safeHandling: 'If you feel physically at risk, contact law enforcement immediately before doing anything else.',
    overview: `Digital stalking involves unauthorized monitoring of a person\'s device, location,
    or online activity using stalkerware, spyware, or social engineering. Perpetrators may be
    ex-partners, obsessive online contacts, or threat actors. Victims are often unaware they are
    being monitored, making early detection and safe exit planning critical.`,
    solutions: `WHTS provides stalkerware detection guidance, safe device audit procedures, and
    reporting pathways coordinated with law enforcement for digital stalking cases.`,
    prevention: [
      { title: 'Audit your installed apps', desc: 'Regularly review all installed apps — look for anything you didn\'t install, especially apps with broad permissions.' },
      { title: 'Check location sharing settings', desc: 'Audit which apps and contacts have access to your live location — revoke access for any you don\'t actively choose to share with.' },
      { title: 'Limit real-time social media check-ins', desc: 'Avoid posting your real-time location or predictable daily routine on any social media platform.' },
      { title: 'Use a separate safe device if concerned', desc: 'If you suspect your device is compromised, use a separate clean device for sensitive communications until it is confirmed safe.' },
      { title: 'Document all incidents', desc: 'Screenshot messages, note dates and times, and preserve all evidence before blocking — it is critical for legal action.' },
      { title: 'Contact WHTS and authorities', desc: 'Stalking cases require coordinated support. Contact WHTS for technical analysis and law enforcement for your physical safety.' },
    ],
    indicators: [
      'Someone consistently knows your location or schedule without being told',
      'Device battery drains faster than usual with no heavy usage',
      'Unfamiliar apps with location or microphone access installed',
      'Accounts sending messages or content you didn\'t create',
      'Someone references private conversations you had offline or via app',
      'Persistent contact from the same person across multiple platforms',
    ],
  },

  'crypto-drainer': {
    title: 'Crypto Wallet Drainer',
    emoji: '⛓️',
    risk: 'high',
    riskLabel: 'HIGH RISK',
    category: 'Cryptocurrency Fraud',
    tagline: 'One wrong approval empties your entire wallet',
    safeHandling: 'Immediately revoke all token approvals on a site like revoke.cash and move remaining funds to a new wallet.',
    overview: `Crypto drainers are malicious smart contracts or phishing sites that trick users into
    approving unlimited token access — emptying entire wallets in seconds. Fake airdrop sites,
    cloned DeFi platforms, and compromised NFT project links are the most common delivery vectors.
    Once approval is granted, the drain is instant and typically irreversible.`,
    solutions: `WHTS provides crypto scam detection tools, wallet audit guidance, and blockchain
    forensic reporting to help track stolen assets and prevent further losses.`,
    prevention: [
      { title: 'Always verify the URL', desc: 'Before connecting your wallet, triple-check the URL — one wrong character leads to a drainer. Bookmark official sites.' },
      { title: 'Revoke unlimited approvals', desc: 'Regularly audit and revoke token approvals at revoke.cash or Etherscan — never leave unlimited approvals active.' },
      { title: 'Use a dedicated hot wallet', desc: 'Keep only small amounts in your connected hot wallet — store the majority in a cold hardware wallet disconnected from the internet.' },
      { title: 'Never connect wallet to unverified sites', desc: 'If a site asks you to connect your wallet and you didn\'t seek it out yourself, close it immediately.' },
      { title: 'Read approval requests carefully', desc: 'Before signing any transaction, read exactly what is being approved — "unlimited spend" requests are almost always malicious.' },
      { title: 'Use simulation tools', desc: 'Use transaction simulation tools like Pocket Universe or Fire to preview what a transaction will do before signing.' },
    ],
    indicators: [
      'Site URL is slightly misspelled compared to the official domain',
      'Airdrop or free mint requires wallet connection and approval',
      'Transaction requests unlimited token spend allowance',
      'Multiple transaction requests appear in quick succession',
      'Wallet balance drops to zero immediately after approving a transaction',
      'Site was shared via DM, not found through official channels',
    ],
  },

  'fake-profile': {
    title: 'Fake & Cloned Profiles',
    emoji: '🎭',
    risk: 'mid',
    riskLabel: 'MED RISK',
    category: 'Identity Impersonation',
    tagline: 'Verify before you connect — appearances are easily faked',
    safeHandling: 'Do not engage further — report the profile to the platform and to WHTS immediately.',
    overview: `Fake and cloned social media profiles impersonate real people or brands to scam
    followers, spread misinformation, and conduct targeted fraud. Attackers copy profile photos,
    bios, and posts to create convincing duplicates — then contact the victim\'s connections
    pretending to be them to request money or sensitive information.`,
    solutions: `WHTS provides profile verification guidance, reporting tools, and impersonation
    case management to help victims get fake profiles removed and prevent further harm.`,
    prevention: [
      { title: 'Reverse image search profile photos', desc: 'Run every suspicious profile photo through Google reverse image search to check if it belongs to someone else.' },
      { title: 'Verify through a second channel', desc: 'If someone you know contacts you from an unfamiliar account, call or message them on a known number to confirm.' },
      { title: 'Check account creation date and history', desc: 'Fake profiles are often newly created with few posts. Check the account age and content consistency.' },
      { title: 'Enable profile lock features', desc: 'On platforms that offer it, lock your profile so your photos and posts cannot be easily copied by impersonators.' },
      { title: 'Report impersonation immediately', desc: 'Report fake profiles to the platform and to WHTS — fast reporting increases the chance of takedown.' },
      { title: 'Never send money based on a DM alone', desc: 'Even if a message appears to come from a known contact, verify by phone before sending any money or sensitive information.' },
    ],
    indicators: [
      'Account has the same name and photo as someone you know but different handle',
      'Account was created recently with very few posts or followers',
      'Immediately asks for money, gift cards, or personal information',
      'No mutual connections despite claiming to be a known person',
      'Profile photos appear identical to a known person\'s real account',
      'Messages have unusual tone or grammar compared to the real person',
    ],
  },

  'instagram-hack': {
    title: 'Instagram Account Hack',
    emoji: '📷',
    risk: 'high',
    riskLabel: 'HIGH RISK',
    category: 'Social Media Security',
    tagline: 'Enable 2FA now — before it is too late',
    safeHandling: 'Use Instagram\'s official account recovery flow immediately. Do not pay anyone claiming they can recover your account.',
    overview: `Instagram account takeovers are used to scam followers, sell the account, or
    leverage it for further phishing. Attackers gain access through phishing links, credential
    stuffing from breached passwords, and fake "verification" DMs. Once inside, they change
    the email and phone number — locking the real owner out instantly.`,
    solutions: `WHTS provides social media account recovery guidance and security hardening
    tools to help you reclaim and protect your Instagram account.`,
    prevention: [
      { title: 'Enable two-factor authentication', desc: 'Enable 2FA on Instagram using an authenticator app — not SMS alone, which is vulnerable to SIM swap attacks.' },
      { title: 'Use a unique strong password', desc: 'Never reuse your Instagram password on any other site. Use a password manager to generate and store a unique one.' },
      { title: 'Verify login activity regularly', desc: 'Check Settings > Security > Login Activity regularly for unrecognized devices or locations.' },
      { title: 'Never click DMs claiming to be Instagram', desc: 'Instagram never sends account warnings via DM — always check your official email and in-app notifications only.' },
      { title: 'Link a secure recovery email', desc: 'Ensure your Instagram recovery email is itself secured with a strong password and 2FA.' },
      { title: 'Revoke third-party app access', desc: 'Regularly review and revoke access for third-party apps connected to your Instagram account.' },
    ],
    indicators: [
      'Unexpected login notification from an unfamiliar location',
      'Password or email no longer works',
      'Followers report unusual DMs or posts from your account',
      'Profile photo, bio, or username changed without your action',
      'You receive a DM claiming your account violated policies with a link',
      'Recovery codes are requested without you initiating a login',
    ],
  },

  'facebook-hack': {
    title: 'Facebook Account Hack',
    emoji: '📘',
    risk: 'high',
    riskLabel: 'HIGH RISK',
    category: 'Social Media Security',
    tagline: 'Your Facebook is a gateway to everything linked to it',
    safeHandling: 'Visit facebook.com/hacked immediately and follow the official recovery steps — do not pay third parties.',
    overview: `Facebook account compromises expose your identity, connected apps, payment methods,
    and Marketplace activity to attackers. Facebook accounts are high-value targets because they
    are linked to so many other services. Attackers use phishing, session hijacking, and
    credential stuffing to gain access — then use the account for scams or sell it.`,
    solutions: `WHTS provides Facebook account recovery pathways, security audit tools, and
    reporting support for compromised social media accounts.`,
    prevention: [
      { title: 'Enable 2FA with an authenticator app', desc: 'Enable two-factor authentication using an authenticator app for stronger protection than SMS codes.' },
      { title: 'Review connected apps and websites', desc: 'Remove all third-party apps connected to your Facebook that you no longer use — each one is a potential entry point.' },
      { title: 'Check active sessions regularly', desc: 'Go to Settings > Security > Where You\'re Logged In and end any unrecognized sessions immediately.' },
      { title: 'Use a dedicated email for Facebook', desc: 'Using a dedicated email address for Facebook recovery reduces exposure if your main email is breached.' },
      { title: 'Enable login alerts', desc: 'Turn on login alerts so you are notified immediately when your account is accessed from a new device or location.' },
      { title: 'Never approve "Facebook Support" DMs', desc: 'Facebook support contacts you via your registered email and in-app notifications — never via Messenger.' },
    ],
    indicators: [
      'Login attempt notification from an unfamiliar country or device',
      'Friends report strange posts, links, or messages from your account',
      'You are suddenly logged out of all sessions',
      'Password reset email you didn\'t request arrives',
      'Profile or page details changed without your action',
      'Facebook Marketplace or payment methods accessed without your knowledge',
    ],
  },

  'ai-videos': {
    title: 'AI Deepfake Videos',
    emoji: '🤖',
    risk: 'high',
    riskLabel: 'HIGH RISK',
    category: 'AI-Powered Fraud',
    tagline: 'If you didn\'t seek it out yourself — verify before you trust it',
    safeHandling: 'Never act on video or audio instructions alone. Verify through a known, separate channel before taking any action.',
    overview: `AI-generated deepfake videos and cloned voices are used to impersonate executives,
    public figures, and individuals for financial fraud, extortion, and misinformation. The
    technology has become accessible to anyone — enabling convincing fakes to be produced in
    minutes using only a few seconds of real video or audio as source material.`,
    solutions: `WHTS provides Deepfake Detection tools, media verification guidance, and
    reporting pathways for AI-generated fraud cases.`,
    prevention: [
      { title: 'Use Deepfake Detection tools', desc: 'Run suspicious videos through AI-powered Deepfake Detection tools before acting on any instructions they contain.' },
      { title: 'Establish out-of-band verification', desc: 'For any financial or sensitive request received via video or voice message, verify through a completely separate channel.' },
      { title: 'Know the visual indicators', desc: 'Watch for unnatural blinking, blurry face edges, lip sync issues, inconsistent lighting, and unnatural skin texture.' },
      { title: 'Limit public audio and video of yourself', desc: 'Minimize the amount of your voice and face available publicly — less source material means lower quality clones.' },
      { title: 'Implement voice authentication for high-value actions', desc: 'Use cryptographic voice verification tools for calls authorizing financial transactions or sensitive access.' },
      { title: 'Train your team to verify before acting', desc: 'Ensure anyone who handles finances or sensitive data knows to verify video and voice instructions independently.' },
    ],
    indicators: [
      'Facial edges appear blurry or shimmer slightly when the person moves',
      'Blinking is absent, infrequent, or unnatural',
      'Lip movements are slightly out of sync with the audio',
      'Lighting or shadows on the face don\'t match the background',
      'Audio quality is inconsistent with the video quality',
      'The person in the video avoids turning their head to an angle',
    ],
  },

  'malware-link': {
    title: 'Malware Links',
    emoji: '🧬',
    risk: 'high',
    riskLabel: 'HIGH RISK',
    category: 'Malicious Links',
    tagline: 'One click is all it takes — verify every link before you click',
    safeHandling: 'Do not click. If already clicked, disconnect from the network immediately and run a full scan.',
    overview: `Malicious links are the primary delivery mechanism for malware, ransomware, and
    credential theft. Sent via SMS, email, WhatsApp, and social media — often appearing to come
    from trusted contacts whose accounts have been compromised — these links silently download
    payloads or redirect to convincing phishing pages the moment they are tapped.`,
    solutions: `WHTS provides link scanning tools, safe browsing guidance, and malware
    removal support for devices compromised through malicious links.`,
    prevention: [
      { title: 'Scan links before clicking', desc: 'Paste any suspicious link into VirusTotal or Google Safe Browsing to check it before opening — takes 5 seconds.' },
      { title: 'Verify with the sender independently', desc: 'If a link arrives from a known contact unexpectedly, call them to confirm they actually sent it before clicking.' },
      { title: 'Expand shortened URLs first', desc: 'Use a URL expander to reveal the true destination of any bit.ly or shortened link before clicking it.' },
      { title: 'Enable safe browsing in your browser', desc: 'Turn on Google Safe Browsing or equivalent in your browser settings to block known malicious sites automatically.' },
      { title: 'Keep your browser and OS updated', desc: 'Drive-by download attacks exploit outdated browsers. Keep everything updated to close these entry points.' },
      { title: 'Do not click links in unsolicited messages', desc: 'If you didn\'t expect a link, didn\'t ask for it, or the message feels off — do not click it regardless of who it\'s from.' },
    ],
    indicators: [
      'Link arrives unexpectedly from a known contact',
      'URL uses a shortener or has random characters in the domain',
      'Message creates urgency — "view before it expires" or "you\'ve been tagged"',
      'Domain is a slight misspelling of a trusted brand',
      'Link arrives via SMS or WhatsApp to claim a prize or delivery',
      'Clicking causes immediate download or permission request',
    ],
  },

  'compromised-device': {
    title: 'Compromised Device',
    emoji: '💻',
    risk: 'high',
    riskLabel: 'HIGH RISK',
    category: 'Device Security',
    tagline: 'Act immediately — every minute gives them more access',
    safeHandling: 'Disconnect from all networks immediately. Do not log into any accounts from the compromised device.',
    overview: `A compromised device gives attackers persistent access to everything on it —
    banking apps, saved passwords, emails, files, and camera. Compromise can occur through
    malware, physical access, malicious apps, or remote exploitation. The longer it goes
    undetected, the greater the damage — attackers often establish multiple persistence
    mechanisms to survive reboots and partial cleanup.`,
    solutions: `WHTS provides device compromise assessment tools, clean reinstallation guides,
    and post-compromise account hardening support to fully recover from a device breach.`,
    prevention: [
      { title: 'Disconnect from all networks immediately', desc: 'At first sign of compromise, turn off WiFi and mobile data to cut the attacker\'s access channel.' },
      { title: 'Change all passwords from a clean device', desc: 'Never change passwords from the compromised device — use a separate, clean device to reset everything.' },
      { title: 'Secure email first', desc: 'Your email is the master key to all other accounts. Secure it with a new password and 2FA before anything else.' },
      { title: 'Perform a full clean reinstall', desc: 'For severe compromise, a full OS wipe and clean reinstall is the only guaranteed way to remove persistent malware.' },
      { title: 'Restore from a pre-compromise backup', desc: 'Only restore data from backups dated before the suspected compromise — restoring an infected backup reinfects the device.' },
      { title: 'Enable 2FA on all accounts', desc: 'After securing the device, enable 2FA on every account — this prevents attackers from using harvested credentials.' },
    ],
    indicators: [
      'Webcam indicator light activates without any app open',
      'Unknown processes running in Task Manager or Activity Monitor',
      'Files modified or deleted without your action',
      'Passwords stop working across multiple accounts simultaneously',
      'Antivirus or firewall disabled without your action',
      'Device is unusually slow, hot, or has high unexplained network activity',
    ],
  },

  'credential-stuffing': {
    title: 'Credential Stuffing & Password Threats',
    emoji: '🔐',
    risk: 'high',
    riskLabel: 'HIGH RISK',
    category: 'Account Security',
    tagline: 'One leaked password can unlock everything',
    safeHandling: 'Enable MFA on all accounts immediately and rotate any reused passwords.',
    overview: `Credential stuffing attacks use large databases of username/password pairs leaked from past breaches and automatically try them across hundreds of websites. Because most people reuse passwords, attackers regularly succeed — gaining access to banking, email, and social media accounts without any hacking required.`,
    solutions: `WHTS provides MFA Tools, credential exposure monitoring, and automated breach alerting to stop account takeovers before they happen.`,
    prevention: [
      { title: 'Use a unique password per site', desc: 'Reusing passwords is the core enabler of stuffing attacks — a password manager makes unique passwords effortless.' },
      { title: 'Enable MFA everywhere', desc: 'Multi-factor authentication stops stuffing attacks even when credentials are correct — it\'s the single most effective control.' },
      { title: 'Monitor breach exposure', desc: 'Use services like HaveIBeenPwned to learn if your credentials appear in known breach databases and rotate them immediately.' },
      { title: 'Watch for unexpected login alerts', desc: 'Enable login notifications on every account — unexpected alerts are an early warning of a stuffing attempt in progress.' },
      { title: 'Use passkeys where available', desc: 'Passkeys are phishing-resistant and cannot be stuffed — adopt them on any service that supports them.' },
      { title: 'Rate-limit and block automated logins', desc: 'For businesses, implement CAPTCHA, IP rate limiting, and anomaly detection to block automated credential stuffing bots.' },
    ],
    indicators: [
      'Unexpected login notification from an unfamiliar location',
      'Account password stops working without you changing it',
      'New devices appear in your account\'s active sessions',
      'Email sent from your account that you didn\'t write',
      'Purchases or transfers you didn\'t initiate',
      'Security questions or recovery email changed without your action',
    ],
  },

  'insider-threat': {
    title: 'Insider Threats & Employee Sabotage',
    emoji: '🕵️',
    risk: 'high',
    riskLabel: 'HIGH RISK',
    category: 'Organizational Security',
    tagline: 'The most trusted access is also the most dangerous',
    safeHandling: 'Do not confront suspected insiders directly — escalate to HR and legal before any action.',
    overview: `Insider threats come from current or former employees, contractors, and partners who abuse their legitimate access to steal data, sabotage systems, or enable external attacks. Unlike external breaches, insiders already have access — making them harder to detect and capable of causing severe damage before any alarm is triggered.`,
    solutions: `WHTS provides Insider Risk Program (IRP) monitoring, User Behavior Analytics (UBA), and privileged access management tools to detect and contain insider threats early.`,
    prevention: [
      { title: 'Apply least-privilege access', desc: 'Grant employees only the access they need for their role — limit blast radius if an insider turns malicious.' },
      { title: 'Monitor privileged user activity', desc: 'Log and review actions by administrators, finance teams, and anyone with access to sensitive data or systems.' },
      { title: 'Offboard thoroughly and immediately', desc: 'Revoke all access on the day of departure — most insider damage from former employees happens within 24 hours of termination.' },
      { title: 'Implement UBA tools', desc: 'User Behavior Analytics flags anomalies like unusual download volumes, after-hours access, or accessing systems outside normal patterns.' },
      { title: 'Separate duties for critical functions', desc: 'Require two people to authorize sensitive transactions — this prevents a single insider from executing fraud undetected.' },
      { title: 'Create a safe reporting channel', desc: 'Employees who notice suspicious colleague behaviour need a confidential way to report it — anonymous hotlines are highly effective.' },
    ],
    indicators: [
      'Employee accessing files outside their normal role or hours',
      'Large volumes of data downloaded to personal storage or email',
      'Requests to disable logging or monitoring tools',
      'Disgruntled behavior combined with access to sensitive systems',
      'Attempts to access systems after termination notice',
      'Sharing credentials with unauthorized individuals',
    ],
  },

  'data-breach': {
    title: 'Data Breaches & Leaks',
    emoji: '💾',
    risk: 'high',
    riskLabel: 'HIGH RISK',
    category: 'Data Security',
    tagline: 'Every exposed record is a liability and a target',
    safeHandling: 'Contain first — isolate affected systems before assessing the scope of exposure.',
    overview: `Data breaches occur when unauthorized parties gain access to sensitive information — customer records, financial data, healthcare files, or credentials. Whether caused by external attacks, misconfigured systems, or insider action, a breach triggers regulatory penalties, loss of customer trust, and long-term reputational damage. Speed of detection and response is everything.`,
    solutions: `WHTS provides forensic investigation, rapid response retainers, breach containment tools, and Business Continuity Management (BCM) frameworks to minimize damage and meet regulatory requirements.`,
    prevention: [
      { title: 'Encrypt data at rest and in transit', desc: 'Encryption ensures that even if data is stolen, it cannot be read or used without the decryption key.' },
      { title: 'Implement DLP tools', desc: 'Data Loss Prevention tools monitor and block sensitive data from leaving your environment through unauthorized channels.' },
      { title: 'Audit access controls regularly', desc: 'Review who has access to what data quarterly — over-permissioned accounts are a leading cause of breach scope expansion.' },
      { title: 'Patch vulnerabilities immediately', desc: 'Most breaches exploit known, unpatched vulnerabilities — a disciplined patch management process is your first line of defense.' },
      { title: 'Deploy intrusion detection', desc: 'IDS/IPS tools monitor network traffic for signs of exfiltration — catch breaches in progress, not weeks later.' },
      { title: 'Prepare a breach response plan', desc: 'A tested incident response plan cuts breach cost and duration significantly — know exactly who does what when a breach is confirmed.' },
    ],
    indicators: [
      'Unexpected outbound data transfers to unknown IP addresses',
      'Accounts accessing unusually large volumes of records',
      'Security alerts from a third-party vendor or dark web monitoring service',
      'Employees reporting inability to access files (possible ransomware overlap)',
      'Customers reporting fraud linked to data only your organization holds',
      'Evidence of credential harvesting in logs',
    ],
  },

  'api-security': {
    title: 'API Security Threats',
    emoji: '🔌',
    risk: 'mid',
    riskLabel: 'MED RISK',
    category: 'Application Security',
    tagline: 'Unsecured APIs are open doors to your backend',
    safeHandling: 'Immediately revoke exposed API keys and audit all recent API activity for unauthorized calls.',
    overview: `APIs connect applications, services, and data — and poorly secured APIs expose your entire backend to attackers. Common vulnerabilities include broken authentication, excessive data exposure, lack of rate limiting, and injection flaws. API attacks are increasingly automated, and a single exposed endpoint can yield millions of records or full system compromise.`,
    solutions: `WHTS provides secure API gateway configuration, real-time API threat monitoring, rate limiting enforcement, and penetration testing tools specifically targeting API attack surfaces.`,
    prevention: [
      { title: 'Authenticate every API call', desc: 'Use OAuth 2.0 or API key authentication — never expose unauthenticated endpoints, even internally.' },
      { title: 'Enforce rate limiting', desc: 'Rate limiting prevents automated abuse and brute-force attacks against your API endpoints.' },
      { title: 'Return only what\'s needed', desc: 'Never return full database objects — expose only the fields the client actually needs to prevent excessive data exposure.' },
      { title: 'Validate all input', desc: 'Treat all API input as untrusted — validate types, lengths, and formats to prevent injection attacks.' },
      { title: 'Rotate API keys regularly', desc: 'Old API keys that have been shared, stored in repos, or forgotten are a constant exposure risk — rotate on a schedule.' },
      { title: 'Run API-specific penetration tests', desc: 'Standard web app pentests miss many API flaws — use OWASP API Security Top 10 as your testing framework.' },
    ],
    indicators: [
      'Unusual spike in API call volume from a single IP or account',
      'Requests accessing endpoints outside normal application flow',
      'API errors indicating enumeration or fuzzing attempts',
      'Leaked API keys found in public GitHub repositories',
      'Unexpected data exports through an API endpoint',
      'Authentication bypass errors appearing in logs',
    ],
  },

  'unpatched-software': {
    title: 'Unpatched Software Threats',
    emoji: '⚙️',
    risk: 'mid',
    riskLabel: 'MED RISK',
    category: 'Vulnerability Management',
    tagline: 'Every delayed patch is an open invitation',
    safeHandling: 'Apply critical patches within 24–48 hours of release — prioritize internet-facing systems first.',
    overview: `Unpatched software is the single most exploited attack vector in cybercrime. When vendors release patches, attackers immediately reverse-engineer them to create exploits targeting organizations that haven't yet updated. Ransomware gangs, nation-state actors, and automated botnets all actively scan for known vulnerable software — turning delayed patching into a near-certain breach.`,
    solutions: `WHTS provides managed endpoint patch services, vulnerability scanning, patch prioritization frameworks, and automated update enforcement tools for individuals and organizations.`,
    prevention: [
      { title: 'Enable automatic updates', desc: 'For OS and browsers, enable automatic updates — the patch delay between release and install is when attackers strike.' },
      { title: 'Maintain a software inventory', desc: 'You can\'t patch what you don\'t know exists — maintain a complete inventory of all software in your environment.' },
      { title: 'Prioritize by severity and exposure', desc: 'Use CVSS scores and internet-facing exposure to prioritize which patches to apply first when you can\'t patch everything immediately.' },
      { title: 'Patch third-party applications too', desc: 'OS patches alone aren\'t enough — browsers, PDF readers, Java, and productivity suites are common attack targets that need patching.' },
      { title: 'Test patches before broad deployment', desc: 'For critical business systems, test patches in a staging environment first to prevent update-caused outages.' },
      { title: 'Use virtual patching for legacy systems', desc: 'For systems that can\'t be patched immediately, web application firewalls and IDS rules can provide temporary protection.' },
    ],
    indicators: [
      'Software version is multiple releases behind the current stable version',
      'Vendor has published a critical or high severity CVE for your software version',
      'Unusual system behavior after a known exploit is published publicly',
      'Antivirus or EDR alerts referencing a known CVE identifier',
      'Vulnerability scanner flags unpatched software in your environment',
      'Scan traffic targeting your systems that matches known exploit patterns',
    ],
  },

  'cctv-surveillance': {
    title: 'CCTV Home & Office Surveillance Threats',
    emoji: '📹',
    risk: 'mid',
    riskLabel: 'MED RISK',
    category: 'Physical & Digital Security',
    tagline: 'Your security camera may be watching for someone else',
    safeHandling: 'Immediately change default credentials and isolate exposed cameras from your main network.',
    overview: `Insecure CCTV and IP cameras are routinely compromised — default passwords, unpatched firmware, and direct internet exposure turn security cameras into surveillance tools for attackers. Compromised feeds have been used for voyeurism, corporate espionage, and to plan physical intrusions. Millions of cameras remain accessible on public search engines like Shodan.`,
    solutions: `WHTS provides camera security audits, NPAPK (New Private Access Protection Key) implementation, network segmentation guidance, and Surveillance Protection Tools to lock down your camera infrastructure.`,
    prevention: [
      { title: 'Change default passwords immediately', desc: 'Default camera credentials are publicly documented — change them to strong, unique passwords on first setup.' },
      { title: 'Segment cameras on a separate network', desc: 'Place all cameras on a dedicated VLAN isolated from your main network — limit what a compromised camera can reach.' },
      { title: 'Update camera firmware regularly', desc: 'Camera manufacturers release firmware patches for critical vulnerabilities — enable auto-update where available.' },
      { title: 'Disable remote access if not needed', desc: 'If you don\'t need to view cameras remotely, disable external access — it removes the attack surface entirely.' },
      { title: 'Use a VPN for remote viewing', desc: 'If remote access is needed, access camera feeds through a VPN rather than exposing the camera management port to the internet.' },
      { title: 'Audit your cameras on Shodan', desc: 'Search Shodan for your IP range to discover if any of your cameras are publicly accessible — then immediately secure them.' },
    ],
    indicators: [
      'Camera PTZ (pan/tilt/zoom) moves without your input',
      'Recording gaps or deleted footage you didn\'t delete',
      'Unexpected outbound traffic from your camera\'s IP address',
      'Camera appears on public camera search sites',
      'Login attempts in camera access logs from unknown IPs',
      'Firmware version is significantly out of date',
    ],
  },

  'reputation': {
    title: 'Reputation & Brand Damage',
    emoji: '🏷️',
    risk: 'mid',
    riskLabel: 'MED RISK',
    category: 'Reputation Security',
    tagline: 'Online reputation damage can outlast any financial loss',
    safeHandling: 'Document everything immediately — screenshots, URLs, timestamps — before content is taken down.',
    overview: `Reputation attacks include coordinated negative review campaigns, leaked private content, impersonation accounts, defamatory posts, and dark web data exposure. For individuals and businesses alike, reputation damage erodes trust, tanks revenue, and can take years to recover. Attacks are often targeted, persistent, and difficult to attribute — making proactive monitoring essential.`,
    solutions: `WHTS provides dark web monitoring, impersonation account takedowns, negative content removal, and proactive reputation monitoring tools to protect and restore your online presence.`,
    prevention: [
      { title: 'Set up Google Alerts for your name/brand', desc: 'Free and immediate — get notified the moment your name or brand appears in new online content.' },
      { title: 'Monitor the dark web for leaked content', desc: 'WHTS dark web monitoring scans for leaked images, documents, and personal data tied to your identity or brand.' },
      { title: 'Secure all social media accounts', desc: 'Enable MFA, use strong passwords, and audit connected apps — impersonation often starts with a compromised official account.' },
      { title: 'Respond to negative content strategically', desc: 'Not all negative content warrants a response — strategic silence often serves you better than public arguments with trolls.' },
      { title: 'Document and report impersonation accounts', desc: 'Report fake profiles on every platform immediately — platforms take impersonation seriously and act quickly with proper documentation.' },
      { title: 'Build positive content proactively', desc: 'Publishing consistent, positive content makes it harder for damaging material to rank — own your first-page search results.' },
    ],
    indicators: [
      'Sudden spike in negative reviews across multiple platforms simultaneously',
      'Impersonation accounts appearing on social media using your name or logo',
      'Defamatory content ranking in search results for your name or brand',
      'Leaked private images or documents appearing on public sites',
      'Employees or customers reporting unsolicited negative communications',
      'Coordinated social media campaign using hashtags targeting your brand',
    ],
  },

  'pentest': {
    title: 'Penetration Testing',
    emoji: '🔬',
    risk: 'low',
    riskLabel: 'SECURE PATH',
    category: 'Proactive Security',
    tagline: 'Find your vulnerabilities before attackers do',
    safeHandling: 'Only commission penetration tests from qualified professionals with a signed scope agreement in place.',
    overview: `Penetration testing is authorized, simulated attack on your systems, networks, and applications to identify vulnerabilities before real attackers exploit them. Unlike automated vulnerability scanning, skilled pentesters chain vulnerabilities together the way an attacker would — revealing real-world risk rather than just theoretical exposure. Regular pentests are required by most security frameworks and cyber insurance policies.`,
    solutions: `WHTS provides comprehensive penetration testing services for servers, web applications, APIs, mobile apps, and network infrastructure — with clear, actionable reporting and remediation guidance included.`,
    prevention: [
      { title: 'Define a clear scope before testing begins', desc: 'A signed scope agreement protects both parties and ensures testers focus on the highest-risk areas of your environment.' },
      { title: 'Test at least annually', desc: 'Environments change constantly — annual pentests catch new vulnerabilities introduced by system changes, new software, or reconfigurations.' },
      { title: 'Remediate findings promptly', desc: 'A pentest report with no remediation action is worthless — prioritize findings by severity and track remediation to completion.' },
      { title: 'Include social engineering tests', desc: 'Technical pentests alone miss the human element — phishing simulations and vishing tests reveal training gaps that technical controls can\'t fix.' },
      { title: 'Test after major changes', desc: 'Any significant infrastructure change, new application deployment, or cloud migration warrants a targeted pentest of the affected scope.' },
      { title: 'Verify fixes with a re-test', desc: 'Confirm that vulnerabilities identified in the original test have been correctly fixed — partial remediations are common and dangerous.' },
    ],
    indicators: [
      'No record of a penetration test in the past 12 months',
      'Recent major system changes with no subsequent security assessment',
      'Cyber insurance policy requiring annual pentest that hasn\'t been conducted',
      'Security audit findings referencing lack of penetration testing',
      'Open vulnerabilities from a previous pentest that haven\'t been remediated',
      'New cloud environment or third-party integrations not yet assessed',
    ],
  },

  'botnet': {
    title: 'Botnets & Zombie Network Attacks',
    emoji: '🤖',
    risk: 'high',
    riskLabel: 'HIGH RISK',
    category: 'Network Security',
    tagline: 'Your device may be part of a criminal network right now',
    safeHandling: 'Disconnect the suspected device from all networks immediately and run a full malware scan before reconnecting.',
    overview: `Botnets are networks of infected devices — computers, phones, routers, and IoT devices — controlled remotely by attackers without the owners' knowledge. Infected devices (called zombies or bots) are used to send spam, launch DDoS attacks, mine cryptocurrency, steal credentials, and spread malware. Botnet infections are often silent and can persist for months or years undetected.`,
    solutions: `WHTS provides Device Cleanup Tools, Network Segmentation services, and Botnet Blocker Tools to detect infections, remove malware, and prevent re-infection of your devices and network.`,
    prevention: [
      { title: 'Keep all devices updated', desc: 'Botnets exploit unpatched vulnerabilities — keeping devices updated closes the most common infection vectors.' },
      { title: 'Change default credentials on all devices', desc: 'Routers, cameras, and IoT devices with factory passwords are prime botnet targets — change them immediately on setup.' },
      { title: 'Install reputable security software', desc: 'Modern endpoint security can detect botnet command-and-control communications and block malicious downloads.' },
      { title: 'Monitor network traffic for anomalies', desc: 'Unexpected outbound connections, high bandwidth usage at odd hours, or connections to unknown IPs are botnet indicators.' },
      { title: 'Segment IoT devices', desc: 'Place smart home devices and IoT equipment on a separate network — isolate them from computers that hold sensitive data.' },
      { title: 'Reset infected devices to factory settings', desc: 'If a device is confirmed infected, a full factory reset followed by an updated reinstall is the most reliable cleanup method.' },
    ],
    indicators: [
      'Device is unusually slow, overheating, or has high CPU usage at idle',
      'Unexpected high internet bandwidth usage, especially at night',
      'Antivirus alerts referencing remote access trojans or command-and-control traffic',
      'Internet service provider warning about malicious outbound traffic from your IP',
      'New unknown processes running in Task Manager or Activity Monitor',
      'Email contacts reporting spam sent from your address',
    ],
  },
}

// Slugs that use the same template but aren't built yet
// — these can be added to THREAT_DATA above as content is confirmed
export const THREAT_SLUGS = Object.keys(THREAT_DATA)