import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import '../styles/cyber.css'
import './Home.css'

import heroImage from '../assets/media/hero-image.png'

const heroVideo = 'https://res.cloudinary.com/dqch0tjrm/video/upload/v1782308519/hero-video-comp_zzd0se.mp4'

function useCounter(target, duration = 1400, trigger) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!trigger) return
    let start = 0
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [trigger, target, duration])
  return count
}

const WHY_ITEMS = [
  { icon: '💰', title: 'Proven Recovery Power', desc: "We don't just investigate — we deliver positive results to all reported cases. With a 95%+ recovery rate on tradable cases, we've successfully recovered millions in stolen assets for victims worldwide." },
  { icon: '🏛️', title: 'Government Backed Authority', desc: 'We maintain connection with our Active Representative and partnerships with law enforcement & regulatory authorities across multiple countries, giving us real-time intelligence and legal leverage that solo operators simply cannot match.' },
  { icon: '🛡️', title: 'Victims First Protection', desc: 'Our Active Representative treats every case with compassion and urgency — whether active attack or ongoing surveillance.' },
  { icon: '⚖️', title: 'Pure Ethical & Transparency', desc: "As pure ethical hackers and digital forensic experts, we operate strictly within legal boundaries. You'll always know exactly what we're doing, how we're doing it, and what the next steps are." },
]

const WHAT_WE_DO = [
  { icon: '📋', title: 'Scammer Exposure Documentation', desc: 'We identify and document fraudsters by providing strong evidence packages for law enforcement and assisting takedown through reports to be documented.' },
  { icon: '🔔', title: 'Proactive Victim Defense', desc: "Once your funds are recovered, we don't stop. We provide continuous monitoring and early warning alerts to prevent repeat targeting attempts." },
  { icon: '🔎', title: 'Assets Tracking & Recovery', desc: 'Using advanced forensic tools not yet known to the public, we trace stolen funds across wallets, exchanges, and borders to locate and recover your assets.' },
  { icon: '🌍', title: 'Global Intelligence Network', desc: 'Our real-time collaboration with international authorities allows us to act faster and more effectively than traditional private investigators or generic cybersecurity firms.' },
]

const PROCESS = [
  { n: 1, title: 'Deep Forensic Investigation', desc: 'Active Representative deploys advanced tracking tools and intelligence gathering within our security firm to locate the scammers and recover your lost assets.', active: true },
  { n: 2, title: 'Secure Consultation', desc: 'Our Communications Team can help you begin a confidential call or meeting to share your case to the public for awareness and assistance.' },
  { n: 3, title: 'Recovery & Enforcement', desc: 'We work with partnered authorities to freeze stolen assets, file legal actions and execute fast recovery. You can request real-time updates at every stage.' },
  { n: 4, title: 'Protection & Closure', desc: 'We implement ongoing surveillance, security hardening on your information and personalized protection protocols so you can move with confidence online — If Requested.' },
]

const MISSION_ITEMS = [
  { icon: '⚖️', title: 'To Restore Justice', desc: 'We exist to level the playing field between everyday victims and sophisticated scammers by using cutting-edge technology and ethical hacking.' },
  { icon: '🕸️', title: 'To Disrupt Fraud Networks', desc: 'Every case we take contributes to dismantling larger fraud ecosystems through intelligence analysis and coordinated enforcement with governments.' },
  { icon: '☮️', title: 'To Reclaim Peace Online', desc: 'Being scammed is traumatic. Our goal is not only to recover funds but to help victims regain control and emotional security.' },
  { icon: '🏆', title: 'To Set a New Digital Record', desc: 'We are building the gold standard for ethical, transparent and effective scam recovery systems. Proving that technology and justice can work together for good!' },
]

export default function Home() {
  const statsRef        = useRef(null)
  const heroVideoRef    = useRef(null)
  const videoWrapRef    = useRef(null)
  const lastTapRef      = useRef({ side: null, time: 0 })
  const skipFeedbackRef = useRef(null)

  const [statsVisible, setStatsVisible] = useState(false)
  const [muted,        setMuted]        = useState(true)
  const [volume,       setVolume]       = useState(1)
  const [showVolSlider,setShowVolSlider]= useState(false)
  const [isPlaying,    setIsPlaying]    = useState(false)
  const [progress,     setProgress]     = useState(0)
  const [currentTime,  setCurrentTime]  = useState(0)
  const [duration,     setDuration]     = useState(0)
  const [skipHint,     setSkipHint]     = useState(null) // 'forward' | 'backward' | null
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [playbackSpeed,setPlaybackSpeed]= useState(1)
  const [showSpeedMenu,setShowSpeedMenu]= useState(false)
  const [ccOn,         setCcOn]         = useState(false)

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00'
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const handleVideoClick = () => {
    const vid = heroVideoRef.current
    if (!vid) return
    if (vid.paused) { vid.play(); setIsPlaying(true) }
    else            { vid.pause(); setIsPlaying(false) }
  }

  const handleSeek = (e) => {
    const vid = heroVideoRef.current
    if (!vid) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct  = (e.clientX - rect.left) / rect.width
    vid.currentTime = pct * vid.duration
  }

  /* Double-tap to skip — works on touch (mobile) and mouse (desktop) */
  const handleFrameTap = (e) => {
    const vid = heroVideoRef.current
    if (!vid) return
    const rect   = e.currentTarget.getBoundingClientRect()
    const tapX   = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
    const side   = tapX < rect.width / 2 ? 'backward' : 'forward'
    const now    = Date.now()
    const last   = lastTapRef.current

    if (last.side === side && now - last.time < 350) {
      // Double tap detected
      const skip = side === 'forward' ? 10 : -10
      vid.currentTime = Math.min(Math.max(vid.currentTime + skip, 0), vid.duration)
      setSkipHint(side)
      clearTimeout(skipFeedbackRef.current)
      skipFeedbackRef.current = setTimeout(() => setSkipHint(null), 700)
      lastTapRef.current = { side: null, time: 0 } // reset
    } else {
      // First tap — record it; wait for possible second
      lastTapRef.current = { side, time: now }
      // If no second tap after 350ms, treat as play/pause
      clearTimeout(skipFeedbackRef.current)
      skipFeedbackRef.current = setTimeout(() => {
        if (lastTapRef.current.side === side) {
          handleVideoClick()
          lastTapRef.current = { side: null, time: 0 }
        }
      }, 360)
    }
  }

  /* Restart — back to 0:00 */
  const handleRestart = () => {
    const vid = heroVideoRef.current
    if (!vid) return
    vid.currentTime = 0
    if (vid.paused) { vid.play(); setIsPlaying(true) }
  }

  /* Playback speed */
  const handleSpeedChange = (rate) => {
    const vid = heroVideoRef.current
    if (vid) vid.playbackRate = rate
    setPlaybackSpeed(rate)
    setShowSpeedMenu(false)
  }

  /* Fullscreen toggle */
  const handleFullscreen = () => {
    const wrap = videoWrapRef.current
    if (!wrap) return
    if (!document.fullscreenElement) {
      wrap.requestFullscreen?.() || wrap.webkitRequestFullscreen?.()
    } else {
      document.exitFullscreen?.() || document.webkitExitFullscreen?.()
    }
  }

  /* Volume change */
  const handleVolumeChange = (e) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    const vid = heroVideoRef.current
    if (vid) { vid.volume = v; vid.muted = v === 0 }
    setMuted(v === 0)
  }

  /* Video events */
  useEffect(() => {
    const vid = heroVideoRef.current
    if (!vid) return
    const onTime  = () => { setCurrentTime(vid.currentTime); setProgress((vid.currentTime / vid.duration) * 100 || 0) }
    const onMeta  = () => setDuration(vid.duration)
    const onEnd   = () => setIsPlaying(false)
    const onFs    = () => setIsFullscreen(!!document.fullscreenElement)
    vid.addEventListener('timeupdate',     onTime)
    vid.addEventListener('loadedmetadata', onMeta)
    vid.addEventListener('ended',          onEnd)
    document.addEventListener('fullscreenchange', onFs)
    document.addEventListener('webkitfullscreenchange', onFs)
    return () => {
      vid.removeEventListener('timeupdate',     onTime)
      vid.removeEventListener('loadedmetadata', onMeta)
      vid.removeEventListener('ended',          onEnd)
      document.removeEventListener('fullscreenchange', onFs)
      document.removeEventListener('webkitfullscreenchange', onFs)
    }
  }, [])

  useEffect(() => {
    const vid = heroVideoRef.current
    if (vid) { vid.muted = muted; if (!muted) vid.volume = volume }
  }, [muted])

  /* Scroll-pause: pause when scrolled out of view, resume when back */
  useEffect(() => {
    const vid = heroVideoRef.current
    if (!vid) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && !vid.paused) {
          vid.pause(); setIsPlaying(false)
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(vid)
    return () => observer.disconnect()
  }, [])

  /* Stats counter trigger */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true) },
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  const threats  = useCounter(2400,  1600, statsVisible)
  const reports  = useCounter(850,   1200, statsVisible)
  const recovery = useCounter(97,    1000, statsVisible)

  return (
    <div className="page-light">
      <>

      {/* ════════ HERO ════════ */}
      <header className="template-hero home-template-hero">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-7">
              <h1 className="template-hero-title">
                Emerging Next Generation Cyber Protection for the Digital Age
              </h1>
              <p className="template-hero-copy">
                Learn the warning signs, report cyber incidents, start recovery and track down
                scammers with clear guidance from WHTSIP intelligence world.
              </p>
              <div className="d-flex gap-3 flex-wrap mt-4">
                <Link className="btn btn-primary px-4" to="/threats" style={{ borderRadius: 8 }}>Explore Threats</Link>
                <Link className="btn btn-outline-secondary px-4" to="/report" style={{ borderRadius: 8 }}>Report an Incident</Link>
              </div>
            </div>
            <div className="col-12 col-lg-5">
              <div className="template-hero-art" aria-hidden="true">
                <div className="art-desk"></div>
                <div className="art-person art-person-left">
                  <span className="art-head"></span><span className="art-body"></span><span className="art-laptop"></span>
                </div>
                <div className="art-person art-person-right">
                  <span className="art-head"></span><span className="art-body"></span><span className="art-paper"></span>
                </div>
                <div className="art-shield"><i className="bi bi-shield-check"></i></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════
          VIDEO SECTION
          ════════════════════════════════════════ */}
      <section className="home-video-section">
        <div className="container-fluid px-0">

          {/* Text above player */}
          <div className="home-video-intro">
            <div className="home-video-label">
              <span className="home-video-label-dot"></span>
              WHTSIP &amp; The Officials — Who We Are
            </div>
            <h2 className="home-video-heading">
              Introducing Our Elite Cybersecurity Partners
            </h2>
            <p className="home-video-sub">
              This video defines our mission, our partners, and who you are communicating with
              online.
            </p>
            <p className="home-video-sub">
              Watch to understand the full scope of WHTS intelligence operations.
            </p>
            <div className="home-video-sub-badge">WHTSIP &amp; The Officials</div>
          </div>

          {/* ── Cinematic player ── */}
          <div className="cinematic-player" ref={videoWrapRef}>

            <div className="cinematic-topbar">
              <div className="cinematic-dots" aria-hidden="true"><span></span><span></span><span></span></div>
              <div className="cinematic-title">WHTSIP &amp; The Officials</div>
              <div className="cinematic-duration">2:57</div>
            </div>

            <div
              className="cinematic-frame"
              onClick={handleFrameTap}
              onTouchEnd={handleFrameTap}
            >
              <video
                ref={heroVideoRef}
                className="cinematic-video"
                src={heroVideo}
                playsInline
                preload="auto"
                poster={heroImage}
              />
              <div className="cinematic-gradient" aria-hidden="true" />
              <div className="cinematic-watermark" aria-hidden="true">whts-client.vercel.app</div>

              {/* Double-tap skip feedback */}
              {skipHint === 'backward' && (
                <div className="skip-hint skip-hint-left">
                  <i className="bi bi-skip-backward-fill"></i>
                  <span>-10s</span>
                </div>
              )}
              {skipHint === 'forward' && (
                <div className="skip-hint skip-hint-right">
                  <i className="bi bi-skip-forward-fill"></i>
                  <span>+10s</span>
                </div>
              )}

              {!isPlaying && (
                <div className="cinematic-overlay">
                  <div className="cinematic-play-wrap">
                    <button className="cinematic-play-btn" aria-label="Play video">
                      <i className="bi bi-play-fill"></i>
                    </button>
                    <div className="cinematic-play-label">
                      <span className="cinematic-play-title">WHTSIP &amp; The Officials</span>
                      <span className="cinematic-play-sub">Tap to play · double-tap sides to skip · 2:57</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="cinematic-controls">
              <div className="cinematic-controls-row1">
                <div className="cinematic-controls-left">
                  <button className="cinematic-ctrl" onClick={handleRestart} aria-label="Restart">
                    <i className="bi bi-arrow-counterclockwise"></i>
                  </button>
                  <button className="cinematic-ctrl" onClick={handleVideoClick} aria-label={isPlaying ? 'Pause' : 'Play'}>
                    <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
                  </button>

                  {/* Volume control */}
                  <div className="cinematic-vol-wrap"
                    onMouseEnter={() => setShowVolSlider(true)}
                    onMouseLeave={() => setShowVolSlider(false)}
                  >
                    <button className="cinematic-ctrl" onClick={() => setMuted(p => !p)} aria-label="Toggle mute">
                      <i className={`bi ${muted || volume === 0 ? 'bi-volume-mute-fill' : volume < 0.5 ? 'bi-volume-down-fill' : 'bi-volume-up-fill'}`}></i>
                    </button>
                    {showVolSlider && (
                      <div className="cinematic-vol-slider-wrap">
                        <input
                          type="range"
                          className="cinematic-vol-slider"
                          min="0" max="1" step="0.05"
                          value={muted ? 0 : volume}
                          onChange={handleVolumeChange}
                          aria-label="Volume"
                        />
                      </div>
                    )}
                  </div>

                  <span className="cinematic-time">{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>

                <div className="cinematic-controls-right">
                  <button
                    className={`cinematic-ctrl ${ccOn ? 'cinematic-ctrl-active' : ''}`}
                    onClick={() => setCcOn(p => !p)}
                    aria-label="Toggle captions"
                    aria-pressed={ccOn}
                  >
                    <i className="bi bi-cc-square"></i>
                  </button>

                  {/* Speed / settings */}
                  <div className="cinematic-speed-wrap">
                    <button
                      className="cinematic-ctrl"
                      onClick={() => setShowSpeedMenu(p => !p)}
                      aria-label="Playback speed settings"
                    >
                      <i className="bi bi-gear-fill"></i>
                    </button>
                    {showSpeedMenu && (
                      <div className="cinematic-speed-menu">
                        {[0.5, 1, 1.5, 2].map(rate => (
                          <button
                            key={rate}
                            className={`cinematic-speed-option ${playbackSpeed === rate ? 'cinematic-speed-option-active' : ''}`}
                            onClick={() => handleSpeedChange(rate)}
                          >
                            {rate}x{rate === 1 ? ' (Normal)' : ''}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button className="cinematic-ctrl cinematic-fullscreen-btn" onClick={handleFullscreen} aria-label="Toggle fullscreen">
                    <i className={`bi ${isFullscreen ? 'bi-fullscreen-exit' : 'bi-fullscreen'}`}></i>
                  </button>

                  <span className="cinematic-badge"><i className="bi bi-shield-fill-check me-1"></i>WHTS</span>
                </div>
              </div>

              <div className="cinematic-progress" onClick={handleSeek}>
                <div className="cinematic-progress-track">
                  <div className="cinematic-progress-fill" style={{ width: `${progress}%` }} />
                  <div className="cinematic-progress-thumb" style={{ left: `${progress}%` }} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════ QUICK ACTION CARDS — with header ════════ */}
      <section className="section-pad quick-actions-section">
        <div className="container">

          {/* ── Section header ── */}
          <div className="quick-actions-header">
            <div className="section-label mb-2" style={{ color: '#1a56db' }}>Get Started</div>
            <h2 className="quick-actions-title">Where Would You Like to Go?</h2>
            <p className="quick-actions-sub">
              Choose a path below — whether you need to protect yourself, access resources, or get the right tools.
            </p>
          </div>

          <div className="row g-2 g-md-4">
            <div className="col-4">
              <Link to="/contact" className="quick-action-card text-decoration-none">
                <div className="qa-icon-wrap">
                  <i className="bi bi-display"></i>
                </div>
                <div className="qa-body">
                  <h3 className="qa-title">Protect Yourself</h3>
                  <p className="qa-sub">Direction to Contact Us</p>
                </div>
                <div className="qa-arrow"><i className="bi bi-arrow-right"></i></div>
              </Link>
            </div>
            <div className="col-4">
              <Link to="/essential-eight" className="quick-action-card text-decoration-none">
                <div className="qa-icon-wrap">
                  <i className="bi bi-journal-richtext"></i>
                </div>
                <div className="qa-body">
                  <h3 className="qa-title">Resources</h3>
                  <p className="qa-sub">Essential Eight</p>
                </div>
                <div className="qa-arrow"><i className="bi bi-arrow-right"></i></div>
              </Link>
            </div>
            <div className="col-4">
              <Link to="/threats#threats-tools" className="quick-action-card text-decoration-none">
                <div className="qa-icon-wrap">
                  <i className="bi bi-sliders2"></i>
                </div>
                <div className="qa-body">
                  <h3 className="qa-title">Tools</h3>
                  <p className="qa-sub">Direction to purchasing tools</p>
                </div>
                <div className="qa-arrow"><i className="bi bi-arrow-right"></i></div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ WHY WHTSIP ════════ */}
      <section className="section-pad-lg whywhtsip-section">
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-label mb-2" style={{ color: '#1a56db' }}>Why WHTSIP?</div>
            <h2 className="fw-bold mb-2" style={{ color: '#0f172a' }}>Built for Real World Action</h2>
            <p style={{ color: '#4a5568', maxWidth: '56ch', margin: '0 auto' }}>
              Trusted cybersecurity guidance as a Call to Action for individuals, businesses and organizations.
            </p>
          </div>
          <div className="row g-4">
            {WHY_ITEMS.map(item => (
              <div key={item.title} className="col-12 col-md-6 col-lg-3">
                <div className="why-card p-4 h-100">
                  <div className="why-icon mb-3">{item.icon}</div>
                  <div className="why-card-title">{item.title}</div>
                  <div className="why-card-desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ WHAT WE DO ════════ */}
      <section className="section-pad-lg" style={{ background: 'rgba(5,9,19,0.5)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-label mb-2">What We Do</div>
            <h2 className="fw-bold mb-2">Management of Digital Threats</h2>
            <p className="text-muted-cyber mx-auto" style={{ maxWidth: '56ch' }}>
              Emerging to control and reveal hidden services to the public.
            </p>
          </div>
          <div className="row g-4">
            {WHAT_WE_DO.map(item => (
              <div key={item.title} className="col-12 col-md-6 col-lg-3">
                <div className="card-glass card-hover p-4 h-100 d-flex flex-column gap-3">
                  <div className="icon-box">{item.icon}</div>
                  <div>
                    <div className="fw-bold text-white mb-2">{item.title}</div>
                    <div className="text-muted-cyber small">{item.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ OUR PROCESS ════════ */}
      <section className="section-pad-lg">
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-label mb-2">Our Process</div>
            <h2 className="fw-bold mb-2">Threat Detection Process</h2>
            <p className="text-muted-cyber mx-auto" style={{ maxWidth: '52ch' }}>
              A structured path from spotting a threat to full recovery.
            </p>
          </div>
          <div className="banner p-4 p-md-5">
            <div className="timeline">
              {PROCESS.map(step => (
                <div key={step.n} className={`t-item ${step.active ? 'active' : ''}`}>
                  <div className="t-marker">{step.n}</div>
                  <div>
                    <div className="fw-bold">{step.title}</div>
                    <div className="text-muted-cyber small">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ OUR MISSION ════════ */}
      <section className="section-pad-lg" style={{ background: 'rgba(5,9,19,0.5)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-label mb-2">Our Mission</div>
            <h2 className="fw-bold mb-2">Tracking &amp; Reclaiming Justice Space</h2>
            <p className="text-muted-cyber mx-auto" style={{ maxWidth: '58ch' }}>
              Our dedication to tracking cybercriminals and helping victims reclaim justice through
              advanced intelligence, strategic partnerships and decisive action in the digital space.
            </p>
          </div>
          <div className="row g-4">
            {MISSION_ITEMS.map(item => (
              <div key={item.title} className="col-12 col-md-6">
                <div className="card-glass card-hover p-4 h-100 d-flex gap-3">
                  <div className="icon-box flex-shrink-0" style={{ fontSize: '1.5rem' }}>{item.icon}</div>
                  <div>
                    <div className="fw-bold text-white mb-2">{item.title}</div>
                    <div className="text-muted-cyber small">{item.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ AFFILIATED AGENCIES ════════ */}
      <section className="section-pad-lg" id="agencies" style={{ background: 'rgba(5,9,19,0.5)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-label mb-2">Government Aligned</div>
            <h2 className="fw-bold mb-2">Affiliated Agencies &amp; Partners</h2>
            <p className="text-muted-cyber mx-auto" style={{ maxWidth: '56ch' }}>
              WHTSIPA operates in alignment with these government agencies and international
              law enforcement bodies. Valid reports are shared with relevant authorities.
            </p>
          </div>
          <div className="agencies-highlight-box mb-4">
            <div className="agencies-highlight-inner">
              <i className="bi bi-shield-fill-check agencies-highlight-icon"></i>
              <p className="agencies-highlight-text">
                WHTSIPA maintains verified working relationships with federal, international and
                regulatory bodies. All valid incident reports are escalated to the appropriate authority.
              </p>
            </div>
          </div>
          <div className="text-center">
            <Link className="btn btn-outline-cyber" to="/about#government-agencies">
              <i className="bi bi-people me-2"></i>View All Affiliated Agencies
            </Link>
          </div>
        </div>
      </section>

      {/* ════════ FINAL CTA ════════ */}
      <section className="section-pad-lg">
        <div className="container">
          <div className="banner p-5 text-center">
            <div className="section-label mb-3">Take Action Now</div>
            <h2 className="fw-bold glow-text mb-3">Don't Wait Until It's Too Late</h2>
            <p className="text-muted-cyber mb-4 mx-auto" style={{ maxWidth: '52ch' }}>
              Whether you've spotted a scam, experienced a breach, or want to stay protected —
              WHTSIP private security agency is here to guide you every step of the way.
            </p>
            <div className="d-flex justify-content-center flex-wrap gap-3">
              <Link className="btn btn-alert" to="/report">
                <i className="bi bi-exclamation-triangle me-2" />Report an Incident
              </Link>
              <Link className="btn btn-cyber" to="/threats">
                <i className="bi bi-book me-2" />Browse all threats
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ STATS — last section ════════ */}
      <section className="section-pad home-stats-final" ref={statsRef}>
        <div className="container">
          <div className="row g-3 g-md-4">
            <div className="col-12 col-md-4">
              <div className="stat-final-card text-center">
                <div className="stat-final-value">{threats.toLocaleString()}+</div>
                <div className="stat-final-label">Threat scenarios documented</div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="stat-final-card text-center">
                <div className="stat-final-value">{reports.toLocaleString()}+</div>
                <div className="stat-final-label">Incidents reported through WHTS</div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="stat-final-card text-center">
                <div className="stat-final-value">{recovery}%</div>
                <div className="stat-final-label">Guided recovery success rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      </>
    </div>
  )
}