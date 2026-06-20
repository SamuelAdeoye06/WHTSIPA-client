// src/data/quizData.js
// All 17 quiz scenarios with 5 questions each

export const QUIZ_DATA = {
  instagram_hack: {
    title: 'Instagram Hack',
    emoji: '📷',
    risk: 'high',
    desc: 'Spot account takeover signs and prevent session abuse.',
    questions: [
      { q: 'Instagram 1 of 5', prompt: 'Which of these is a real Instagram account vs a fake/cloned one?', correct: 0, options: ['Official verified account with blue badge', 'Account with similar name but no badge', 'Account created 2 days ago with 0 posts', 'Account using a celebrity photo'] },
      { q: 'Instagram 2 of 5', prompt: 'Which link is the verified one sent by Instagram?', correct: 0, options: ['instagram.com/security', 'instagram-support-login.com', 'ig-verify.net/account', 'instagramm.com/help'] },
      { q: 'Instagram 3 of 5', prompt: 'Identify the real message vs a scammer message on Instagram.', correct: 1, options: ['DM: "You won a prize! Click here now!"', 'Notification from Instagram app about a login attempt', 'DM: "I can get you 10k followers for $5"', 'DM: "Your account will be deleted in 24h"'] },
      { q: 'Instagram 4 of 5', prompt: 'Which video source is real and safe to trust?', correct: 0, options: ['Official news channel with verified badge', 'Reposted clip with no original source listed', 'Account with 3 followers sharing breaking news', 'Screenshot of a video with no context'] },
      { q: 'Instagram 5 of 5', prompt: 'Identify the legitimate Instagram security alert vs a fake hack attempt.', correct: 1, options: ['Email: "Your password was changed, click to undo" from random domain', 'In-app notification: "We detected a new login from an unrecognized device"', 'DM: "We are Instagram support, send us your password"', 'Pop-up asking you to verify your account externally'] },
    ]
  },
  facebook_hack: {
    title: 'Facebook Hack',
    emoji: '📘',
    risk: 'high',
    desc: 'Detect suspicious logins and recover your account safely.',
    questions: [
      { q: 'Facebook 1 of 5', prompt: 'Click the real Facebook account vs the fake/cloned one.', correct: 0, options: ['Profile with consistent history and mutual friends', 'New profile with stock photo and no posts', 'Profile with copied bio from a known person', 'Account with 2 friends and no profile picture'] },
      { q: 'Facebook 2 of 5', prompt: 'Which is the verified/official Facebook link?', correct: 0, options: ['facebook.com/security', 'facbook-support.com/verify', 'fb-login-help.net', 'facebook-alerts.support.com'] },
      { q: 'Facebook 3 of 5', prompt: 'Identify the real message vs a scammer message.', correct: 1, options: ['"Send me $50 via Mpesa, I will pay back double"', 'Facebook notification: someone tagged you in a post', '"Your Facebook will be banned unless you verify now"', '"I am Mark Zuckerberg, you won $1000"'] },
      { q: 'Facebook 4 of 5', prompt: 'Click to identify the real post or source to avoid misinformation.', correct: 0, options: ['Post from verified news page with article link', 'Shared post with no original source', 'Screenshot of a tweet claiming breaking news', 'Post with 50k shares but no verifiable author'] },
      { q: 'Facebook 5 of 5', prompt: 'What is the safe action when shown a suspicious friend request?', correct: 2, options: ['Accept and wait to see what happens', 'Accept and message them first', 'Check mutual friends and verify before accepting', 'Share their profile to warn your friends immediately'] },
    ]
  },
  crypto_drainer: {
    title: 'Crypto Drainer',
    emoji: '⛓️',
    risk: 'high',
    desc: 'Protect your wallet from drainer sites and fake airdrops.',
    questions: [
      { q: 'Crypto Drainer 1 of 5', prompt: 'Click the legitimate wallet connection vs the fake drainer site.', correct: 0, options: ['app.uniswap.org (official URL)', 'uniswaap.org/connect-wallet', 'uniswap-airdrop.net', 'uniswap.io.connect.finance'] },
      { q: 'Crypto Drainer 2 of 5', prompt: 'What should you do with a suspicious airdrop requiring wallet access?', correct: 1, options: ['Connect wallet to claim free tokens', 'Reject — never connect wallet to unverified sites', 'Share with friends to claim together', 'Connect with a small wallet to test it'] },
      { q: 'Crypto Drainer 3 of 5', prompt: 'Which is the real security warning about unauthorized wallet access?', correct: 0, options: ['In-wallet alert: "Unknown contract requested full token approval"', 'Telegram DM: "Your wallet was hacked, click here to recover"', 'Email from random sender about wallet activity', 'Pop-up on random website about your MetaMask'] },
      { q: 'Crypto Drainer 4 of 5', prompt: 'Spot the legitimate URL vs the phishing site.', correct: 0, options: ['opensea.io', 'opensea-nft.io', 'open-sea.marketplace.net', 'opensea.xyz.login.com'] },
      { q: 'Crypto Drainer 5 of 5', prompt: 'A smart contract requests unlimited token approval — what do you do?', correct: 1, options: ['Approve — it is needed to use the dApp', 'Decline and revoke all previous approvals immediately', 'Approve once and check later', 'Ignore the warning and proceed'] },
    ]
  },
  fake_profile: {
    title: 'Fake Profile',
    emoji: '🎭',
    risk: 'mid',
    desc: 'Identify impersonation and cloned social media profiles.',
    questions: [
      { q: 'Fake Profile 1 of 5', prompt: 'Click the real profile vs the fake one in search results.', correct: 0, options: ['Profile with years of consistent posts and mutual friends', 'Profile created last week with same name and photo', 'Profile with celebrity photo and generic bio', 'Profile with no posts but many followers'] },
      { q: 'Fake Profile 2 of 5', prompt: 'What gives away stolen photos or inconsistent profile details?', correct: 2, options: ['Low follower count', 'No cover photo', 'Reverse image search shows photo belongs to someone else', 'Profile is set to private'] },
      { q: 'Fake Profile 3 of 5', prompt: 'Which is the real verification badge vs a fake one?', correct: 0, options: ['Blue checkmark directly from platform (not in bio)', 'Blue emoji ✅ placed in the bio text', 'Gold star added as a profile overlay', 'A "verified" image uploaded as profile picture'] },
      { q: 'Fake Profile 4 of 5', prompt: 'A profile with your friend\'s name messages you asking for money. What do you do?', correct: 1, options: ['Send money — it looks exactly like them', 'Call your friend directly to confirm', 'Reply asking for their account details', 'Report later after sending a small amount'] },
      { q: 'Fake Profile 5 of 5', prompt: 'Which action best protects you from fake profiles?', correct: 2, options: ['Accepting all requests to grow your network', 'Blocking anyone you don\'t recognize', 'Verifying through a separate channel before engaging', 'Reporting all new accounts'] },
    ]
  },
  ransomware: {
    title: 'Ransomware',
    emoji: '🧱',
    risk: 'high',
    desc: 'Recognize ransomware attempts before your files are encrypted.',
    questions: [
      { q: 'Ransomware 1 of 5', prompt: 'Which email is a ransomware delivery attempt?', correct: 1, options: ['Company IT department: scheduled maintenance notice', 'Unknown sender: "Invoice_2026.exe" attachment asking you to enable macros', 'HR: your payslip for April is ready in the portal', 'IT support: your VPN certificate will expire soon'] },
      { q: 'Ransomware 2 of 5', prompt: 'Your files suddenly have a .locked extension. What is the first step?', correct: 0, options: ['Disconnect from the network immediately', 'Pay the ransom to get files back quickly', 'Restart the computer to fix it', 'Email the attacker to negotiate'] },
      { q: 'Ransomware 3 of 5', prompt: 'Which is a legitimate ransom note vs a fake scare screen?', correct: 1, options: ['Windows error: "Your PC has a virus, call 1-800-MICROSOFT"', 'Screen-locking message with Bitcoin wallet address and countdown timer', 'Browser pop-up: "You have been hacked, click OK"', 'Email claiming FBI locked your computer'] },
      { q: 'Ransomware 4 of 5', prompt: 'What is the best protection against ransomware?', correct: 0, options: ['Regular offline backups of critical data', 'Antivirus software alone', 'Paying ransom quickly when attacked', 'Only opening emails from known contacts'] },
      { q: 'Ransomware 5 of 5', prompt: 'Which type of file is most commonly used to deliver ransomware?', correct: 2, options: ['PDF with embedded images', 'JPEG photo from a friend', 'Word document with macros enabled', 'Plain text .txt file'] },
    ]
  },
  wifi_hack: {
    title: 'WiFi Hack',
    emoji: '📡',
    risk: 'mid',
    desc: 'Spot fake hotspots and protect your data on public networks.',
    questions: [
      { q: 'WiFi 1 of 5', prompt: 'You see two WiFi networks: "Airport_Free_WiFi" and "Airport_WiFi_Official". Which do you connect to?', correct: 1, options: ['Airport_Free_WiFi — it\'s free', 'Neither — verify the correct network with airport staff first', 'Whichever has stronger signal', 'Connect to both for redundancy'] },
      { q: 'WiFi 2 of 5', prompt: 'What is an "evil twin" attack?', correct: 0, options: ['A fake WiFi network mimicking a real one to intercept traffic', 'A virus that duplicates your files', 'A hacker who clones your phone', 'Two routers with the same password'] },
      { q: 'WiFi 3 of 5', prompt: 'Which is safest to do on public WiFi?', correct: 2, options: ['Online banking', 'Entering credit card details', 'Reading news articles', 'Logging into work email'] },
      { q: 'WiFi 4 of 5', prompt: 'What tool best protects you on public WiFi?', correct: 0, options: ['VPN (Virtual Private Network)', 'Incognito mode', 'Turning off Bluetooth', 'Using a different browser'] },
      { q: 'WiFi 5 of 5', prompt: 'Your home WiFi has WEP security. What should you do?', correct: 1, options: ['Nothing — WEP is fine for home use', 'Upgrade to WPA3 immediately — WEP is easily cracked', 'Add a longer password to WEP', 'Disable WiFi and use ethernet only'] },
    ]
  },
  phishing_emails: {
    title: 'Phishing Emails',
    emoji: '🎣',
    risk: 'high',
    desc: 'Spot credential-stealing emails before you click.',
    questions: [
      { q: 'Phishing 1 of 5', prompt: 'Which sender address is suspicious?', correct: 1, options: ['support@paypal.com', 'support@paypal-secure-login.com', 'no-reply@netflix.com', 'billing@amazon.com'] },
      { q: 'Phishing 2 of 5', prompt: 'An email says "Your account will be suspended in 24 hours." What do you do?', correct: 2, options: ['Click the link immediately to fix it', 'Reply to confirm your details', 'Go directly to the official website in your browser', 'Forward it to your friends as a warning'] },
      { q: 'Phishing 3 of 5', prompt: 'Which sign strongly suggests a phishing email?', correct: 0, options: ['Urgent language + mismatched sender domain', 'Email from a known brand', 'Email with a plain text body', 'Email with no attachments'] },
      { q: 'Phishing 4 of 5', prompt: 'A link in an email shows "paypal.com" but where does it actually go?', correct: 1, options: ['Exactly to paypal.com', 'Hover over it to reveal the real URL — it may go elsewhere', 'The display text is always the real destination', 'Email links are always safe'] },
      { q: 'Phishing 5 of 5', prompt: 'What should you do if you accidentally clicked a phishing link?', correct: 0, options: ['Disconnect from internet, change passwords, report to IT', 'Wait and see if anything bad happens', 'Delete the email and forget about it', 'Scan with one antivirus and you\'re safe'] },
    ]
  },
  phone_hack: {
    title: 'Phone Hack',
    emoji: '📱',
    risk: 'high',
    desc: 'Detect signs your phone has been compromised.',
    questions: [
      { q: 'Phone Hack 1 of 5', prompt: 'Which is a sign your phone may have been hacked?', correct: 2, options: ['Battery drains after 2 years of use', 'Screen brightness changes in sunlight', 'Unexplained data usage spikes and unfamiliar apps', 'Slow performance while gaming'] },
      { q: 'Phone Hack 2 of 5', prompt: 'You receive a text with a link asking you to verify your phone. What do you do?', correct: 1, options: ['Click the link — verification is normal', 'Delete it and contact your carrier directly through the official app', 'Reply "STOP" to unsubscribe', 'Forward it to customer service'] },
      { q: 'Phone Hack 3 of 5', prompt: 'Which app permission is a red flag for a flashlight app?', correct: 0, options: ['Access to contacts, microphone, and location', 'Camera access for the flash', 'Storage access for saving settings', 'Notification access'] },
      { q: 'Phone Hack 4 of 5', prompt: 'What protects your phone best if it is stolen?', correct: 1, options: ['Keeping it in your pocket at all times', 'Full disk encryption + strong PIN + remote wipe enabled', 'Pattern lock only', 'Face ID only'] },
      { q: 'Phone Hack 5 of 5', prompt: 'Someone installed an APK from outside the app store on your phone. What is the risk?', correct: 0, options: ['Malware — sideloaded apps bypass security checks', 'No risk — APKs are just like Play Store apps', 'Minor risk — only if the app asks for permissions', 'No risk if the file came from a friend'] },
    ]
  },
  call_scam: {
    title: 'Call Scam',
    emoji: '📞',
    risk: 'mid',
    desc: 'Recognize voice scams and social engineering over the phone.',
    questions: [
      { q: 'Call Scam 1 of 5', prompt: 'A caller claims to be from your bank and asks for your OTP. What do you do?', correct: 1, options: ['Give the OTP — they need it to verify you', 'Hang up — banks never ask for OTPs over the phone', 'Ask them security questions first then give it', 'Give just the first 3 digits'] },
      { q: 'Call Scam 2 of 5', prompt: 'Which is a classic sign of a call scam?', correct: 0, options: ['Urgency + threatening consequences + request for payment/info', 'Caller knows your full name', 'Call comes from an unfamiliar country code', 'Caller has a foreign accent'] },
      { q: 'Call Scam 3 of 5', prompt: '"You owe taxes. Pay via gift card or you will be arrested." What is this?', correct: 1, options: ['A legitimate IRS/tax authority call', 'A scam — government agencies never request gift card payments', 'A valid debt collection method', 'A real consequence you should act on quickly'] },
      { q: 'Call Scam 4 of 5', prompt: 'What is caller ID spoofing?', correct: 0, options: ['Faking a phone number to appear as a trusted source', 'Recording a call without consent', 'Using a robocall system', 'Cloning a SIM card'] },
      { q: 'Call Scam 5 of 5', prompt: 'After a suspicious call, what is the safest action?', correct: 2, options: ['Call them back on the number they gave you', 'Wait to see if they call again', 'Look up the official number independently and call that instead', 'Block the number only'] },
    ]
  },
  tax_refund_scam: {
    title: 'Tax Refund Scam',
    emoji: '🧾',
    risk: 'mid',
    desc: 'Avoid fake government refund schemes designed to steal your data.',
    questions: [
      { q: 'Tax Refund 1 of 5', prompt: 'An email says "You have a $3,200 tax refund waiting. Click to claim." What do you do?', correct: 1, options: ['Click immediately — free money is real', 'Go to the official tax authority website directly and check your account', 'Reply with your details to verify eligibility', 'Share with family so they can claim too'] },
      { q: 'Tax Refund 2 of 5', prompt: 'Which is a legitimate way a tax authority contacts you?', correct: 0, options: ['Official mailed letter with reference number to verify online', 'WhatsApp message with a refund link', 'SMS with urgent link to enter banking details', 'Social media DM offering refund assistance'] },
      { q: 'Tax Refund 3 of 5', prompt: 'A caller says you owe back taxes and will be arrested unless you pay via wire transfer. What is this?', correct: 0, options: ['A scam — authorities use formal legal process, not phone threats', 'Legitimate — pay immediately to avoid arrest', 'A real debt collection call', 'A bank verification call'] },
      { q: 'Tax Refund 4 of 5', prompt: 'What information should you never share in response to an unsolicited tax refund offer?', correct: 2, options: ['Your city of residence', 'Your employer name', 'Your government ID number, bank account, or OTP', 'Your email address'] },
      { q: 'Tax Refund 5 of 5', prompt: 'How do you verify if a tax refund communication is real?', correct: 1, options: ['Call the number on the email or SMS', 'Log into your account on the official tax authority website', 'Google the email address', 'Ask friends if they got the same message'] },
    ]
  },
  ai_videos: {
    title: 'AI Videos (Deepfake)',
    emoji: '🤖',
    risk: 'high',
    desc: 'Detect AI-generated video and audio used for fraud.',
    questions: [
      { q: 'AI Videos 1 of 5', prompt: 'Which visual clue suggests a video may be deepfaked?', correct: 0, options: ['Unnatural blinking, blurry edges around face, lip sync off', 'Low video resolution', 'Background noise in audio', 'Shaky camera movement'] },
      { q: 'AI Videos 2 of 5', prompt: 'A video of a CEO announces a major investment opportunity. What do you do before acting?', correct: 1, options: ['Invest immediately — it is the CEO', 'Verify through official company channels before acting', 'Share the opportunity with colleagues', 'Check how many views the video has'] },
      { q: 'AI Videos 3 of 5', prompt: 'Which tool helps detect AI-generated images and videos?', correct: 0, options: ['Reverse image search + AI detection tools like Hive', 'Zooming in on the video', 'Checking the file size', 'Looking at video duration'] },
      { q: 'AI Videos 4 of 5', prompt: 'A voice message from your "boss" urgently requests a wire transfer. What should you do?', correct: 2, options: ['Process it — the voice sounds exactly right', 'Reply to the voice message asking for confirmation', 'Call your boss back on their known number to confirm', 'Transfer half first and wait for confirmation'] },
      { q: 'AI Videos 5 of 5', prompt: 'What is "voice cloning" used for in cybercrime?', correct: 0, options: ['Replicating someone\'s voice to impersonate them in calls or messages', 'Translating audio to another language', 'Removing background noise from recordings', 'Recording calls without detection'] },
    ]
  },
  malware_link: {
    title: 'Malware Link',
    emoji: '🧬',
    risk: 'high',
    desc: 'Identify malicious links before clicking them.',
    questions: [
      { q: 'Malware 1 of 5', prompt: 'Which URL is most likely malicious?', correct: 1, options: ['https://google.com/search', 'http://g00gle-free-prize.xyz/claim', 'https://accounts.google.com', 'https://support.google.com/account'] },
      { q: 'Malware 2 of 5', prompt: 'A friend\'s WhatsApp sends "Look at this!" with a link. What do you do?', correct: 1, options: ['Click it — it is from your friend', 'Call your friend to confirm they sent it before clicking', 'Forward to others to check', 'Screenshot and post in group chat'] },
      { q: 'Malware 3 of 5', prompt: 'What does a URL shortener like bit.ly hide?', correct: 0, options: ['The real destination URL — could be anything', 'The file size of the download', 'The age of the website', 'The server location only'] },
      { q: 'Malware 4 of 5', prompt: 'Which is a safe action before clicking any unfamiliar link?', correct: 2, options: ['Open in your main browser', 'Click once quickly then close', 'Use a link scanner like VirusTotal or Google Safe Browsing', 'Check the number of characters in the URL'] },
      { q: 'Malware 5 of 5', prompt: 'You accidentally downloaded a suspicious file. What is the first step?', correct: 0, options: ['Do NOT open it — delete it and run a full antivirus scan', 'Open it quickly then delete it', 'Move it to a folder and ignore it', 'Send it to IT via email attachment'] },
    ]
  },
  stalking_scam: {
    title: 'Stalking Scam',
    emoji: '👁️',
    risk: 'mid',
    desc: 'Recognize digital stalking and location tracking attempts.',
    questions: [
      { q: 'Stalking 1 of 5', prompt: 'A new contact seems to know your daily routine. What could explain this?', correct: 1, options: ['Coincidence — it happens', 'Your location or social media check-ins are being monitored', 'They live near you', 'They follow local news'] },
      { q: 'Stalking 2 of 5', prompt: 'Which app permission enables someone to track your location without you knowing?', correct: 0, options: ['Background location access granted to a suspicious app', 'Notification access', 'Storage access', 'Contacts access'] },
      { q: 'Stalking 3 of 5', prompt: 'You receive messages showing the stalker knows your real-time location. What do you do?', correct: 2, options: ['Reply to warn them to stop', 'Change your phone password only', 'Check all installed apps for unknown tracking apps and contact authorities', 'Post about it on social media'] },
      { q: 'Stalking 4 of 5', prompt: 'Which is the safest social media practice to prevent location tracking?', correct: 1, options: ['Posting your location in real-time with every update', 'Disabling location in photos and not posting real-time check-ins', 'Using a fake name on social media', 'Only posting at night'] },
      { q: 'Stalking 5 of 5', prompt: 'What is a "stalkerware" app?', correct: 0, options: ['Hidden software installed on a device to secretly monitor the owner\'s activity', 'Antivirus software for tracking malware', 'Parental control software', 'A VPN application'] },
    ]
  },
  fake_job: {
    title: 'Fake Job',
    emoji: '💼',
    risk: 'mid',
    desc: 'Spot fraudulent job offers designed to steal your data or money.',
    questions: [
      { q: 'Fake Job 1 of 5', prompt: 'Which job offer is most likely a scam?', correct: 1, options: ['Interview scheduled after submitting a full application', '"Earn $5000/week from home with no experience or qualifications needed"', 'Job offer from a company with verifiable website and LinkedIn', 'Recruiter who found your CV on a job portal'] },
      { q: 'Fake Job 2 of 5', prompt: 'A job offer asks you to pay a "training fee" before starting. What is this?', correct: 0, options: ['A scam — legitimate employers never charge you to work for them', 'Standard practice for some industries', 'An investment in your future salary', 'A refundable security deposit'] },
      { q: 'Fake Job 3 of 5', prompt: 'An employer asks for your government ID, bank details, and passport before any formal offer. What do you do?', correct: 1, options: ['Provide everything — it\'s for HR onboarding', 'Verify the company is real before sharing any sensitive documents', 'Provide only your bank details', 'Share your passport but not your government ID'] },
      { q: 'Fake Job 4 of 5', prompt: 'Which platform is most commonly used by fake recruiters to approach victims?', correct: 2, options: ['Official government job portals', 'Company career pages', 'WhatsApp, Telegram, and Instagram DMs', 'LinkedIn job listings only'] },
      { q: 'Fake Job 5 of 5', prompt: 'How do you verify if a company and job offer are legitimate?', correct: 0, options: ['Search the company name + "scam", check their official website, verify on LinkedIn', 'Reply to the email and ask if it is real', 'Check their Instagram followers count', 'Ask friends if they have heard of the company'] },
    ]
  },
  romance_scam: {
    title: 'Romance Scam',
    emoji: '💔',
    risk: 'high',
    desc: 'Identify fake relationships built to exploit you financially.',
    questions: [
      { q: 'Romance 1 of 5', prompt: 'An online match declares love within 3 days and has model-level photos. What is the red flag?', correct: 0, options: ['Too-good-to-be-true profile + extremely fast emotional escalation', 'They text too often', 'They have many followers', 'They use proper grammar'] },
      { q: 'Romance 2 of 5', prompt: 'Your online partner always cancels video calls. What could this indicate?', correct: 1, options: ['They are busy and shy', 'They may be hiding their real identity — request a live video chat', 'Video call apps don\'t work for them', 'Their internet is bad'] },
      { q: 'Romance 3 of 5', prompt: 'After weeks of chatting, they ask you to send money for a medical emergency. What do you do?', correct: 1, options: ['Send money — you trust them by now', 'Decline and report — this is a classic romance scam trigger', 'Send half to test their honesty', 'Ask for their bank statement first'] },
      { q: 'Romance 4 of 5', prompt: 'How can you verify if someone\'s online profile photos are real?', correct: 0, options: ['Reverse image search their profile photo on Google', 'Ask them to take a selfie', 'Check their follower count', 'Look at their tagged photos'] },
      { q: 'Romance 5 of 5', prompt: 'What should you do if you realize you have been in contact with a romance scammer?', correct: 2, options: ['Continue talking to gather more evidence yourself', 'Confront them directly via message', 'Stop contact, document everything, and report to the platform and authorities', 'Delete the app and move on without reporting'] },
    ]
  },
  compromised_device: {
    title: 'Compromised Device',
    emoji: '💻',
    risk: 'high',
    desc: 'Detect and respond to a hacked or compromised device.',
    questions: [
      { q: 'Compromised Device 1 of 5', prompt: 'Which behavior suggests your laptop may be compromised?', correct: 0, options: ['Webcam light turns on when you are not using it', 'Slow startup after updates', 'Loud fan when running video', 'Screen dims automatically'] },
      { q: 'Compromised Device 2 of 5', prompt: 'You notice bank transactions you did not make. What is your first step?', correct: 1, options: ['Wait to see if more appear', 'Freeze your account and contact your bank immediately', 'Change your email password', 'Run a quick antivirus scan'] },
      { q: 'Compromised Device 3 of 5', prompt: 'Which is the safest way to recover a heavily compromised device?', correct: 2, options: ['Run antivirus and continue using it', 'Factory reset without backup', 'Full wipe + clean OS reinstall from verified media', 'Delete suspicious files manually'] },
      { q: 'Compromised Device 4 of 5', prompt: 'After suspecting compromise, which accounts should you secure FIRST?', correct: 0, options: ['Email — it is the master key to all other account resets', 'Social media accounts', 'Gaming accounts', 'Streaming service accounts'] },
      { q: 'Compromised Device 5 of 5', prompt: 'What is the purpose of enabling two-factor authentication after a breach?', correct: 1, options: ['It restores deleted files', 'It prevents attackers from accessing accounts even if they have your password', 'It scans for malware automatically', 'It backs up your data'] },
    ]
  },
  identity_theft: {
    title: 'Identity Theft',
    emoji: '🪪',
    risk: 'high',
    desc: 'Protect your identity and detect fraudulent use of your information.',
    questions: [
      { q: 'Identity Theft 1 of 5', prompt: 'You receive a credit card bill for a card you never applied for. What is this?', correct: 0, options: ['Identity theft — someone opened an account using your details', 'A bank error — ignore it', 'A pre-approved offer you forgot about', 'Marketing material'] },
      { q: 'Identity Theft 2 of 5', prompt: 'Which piece of information is most valuable to an identity thief?', correct: 2, options: ['Your Instagram username', 'Your favorite restaurant', 'Your government ID + date of birth + address together', 'Your first name and email'] },
      { q: 'Identity Theft 3 of 5', prompt: 'How can you detect if someone is using your identity?', correct: 1, options: ['Wait for police to contact you', 'Monitor your credit report and account statements regularly', 'Check your social media followers', 'Look for unfamiliar faces in your contacts'] },
      { q: 'Identity Theft 4 of 5', prompt: 'What should you do immediately after discovering identity theft?', correct: 0, options: ['Report to authorities, freeze your credit, notify your bank, change all passwords', 'Only change your email password', 'Post about it on social media to warn others first', 'Wait to see how much damage is done before acting'] },
      { q: 'Identity Theft 5 of 5', prompt: 'Which practice best prevents identity theft?', correct: 2, options: ['Using the same strong password everywhere', 'Sharing ID documents only with friends', 'Shredding sensitive documents and using unique passwords + 2FA', 'Keeping your devices locked only'] },
    ]
  },
}

export const QUIZ_LIST = [
  { slug: 'instagram_hack',     title: 'Instagram Hack',         emoji: '📷', risk: 'high' },
  { slug: 'facebook_hack',      title: 'Facebook Hack',          emoji: '📘', risk: 'high' },
  { slug: 'crypto_drainer',     title: 'Crypto Drainer',         emoji: '⛓️', risk: 'high' },
  { slug: 'fake_profile',       title: 'Fake Profile',           emoji: '🎭', risk: 'mid'  },
  { slug: 'ransomware',         title: 'Ransomware',             emoji: '🧱', risk: 'high' },
  { slug: 'wifi_hack',          title: 'WiFi Hack',              emoji: '📡', risk: 'mid'  },
  { slug: 'phishing_emails',    title: 'Phishing Emails',        emoji: '🎣', risk: 'high' },
  { slug: 'phone_hack',         title: 'Phone Hack',             emoji: '📱', risk: 'high' },
  { slug: 'call_scam',          title: 'Call Scam',              emoji: '📞', risk: 'mid'  },
  { slug: 'tax_refund_scam',    title: 'Tax Refund Scam',        emoji: '🧾', risk: 'mid'  },
  { slug: 'ai_videos',          title: 'AI Videos (Deepfake)',   emoji: '🤖', risk: 'high' },
  { slug: 'malware_link',       title: 'Malware Link',           emoji: '🧬', risk: 'high' },
  { slug: 'stalking_scam',      title: 'Stalking Scam',          emoji: '👁️', risk: 'mid'  },
  { slug: 'fake_job',           title: 'Fake Job',               emoji: '💼', risk: 'mid'  },
  { slug: 'romance_scam',       title: 'Romance Scam',           emoji: '💔', risk: 'high' },
  { slug: 'compromised_device', title: 'Compromised Device',     emoji: '💻', risk: 'high' },
  { slug: 'identity_theft',     title: 'Identity Theft',         emoji: '🪪', risk: 'high' },
]