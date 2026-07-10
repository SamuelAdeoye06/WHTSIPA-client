import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/cyber.css'
import './About.css'
import theEquationPoster from '../assets/media/the-equation-image.png'
import lazarusPoster from '../assets/media/lazarus-image.png'
import virusPoster from '../assets/media/virus-image.png'
import anonymousPoster from '../assets/media/anonymous-image.png'
import shadowBrokersPoster from '../assets/media/shadow-brokers-image.png'
import apt29Poster from '../assets/media/apt29-image.png'



// Clean, direct Cloudinary URLs avoiding on-the-fly transformations that cause connection drops
const OFFICIALS = [
  {
    id: 'equation',
    name: 'The Equation Group',
    codename: 'EQUATION',
    type: 'Nation-State Threat Actor',
    origin: 'United States',
    since: 'Est. 2001',
    description: 'Considered the most sophisticated cyber-espionage group ever discovered. Linked to the NSA\'s Tailored Access Operations unit, the Equation Group pioneered firmware-level implants and zero-day exploits that remain unmatched in complexity.',
    capabilities: ['Firmware-level persistence', 'Zero-day exploit development', 'Air-gap bridging', 'Custom malware frameworks'],
    threat: 'EXTREME',
    videoUrl: 'https://res.cloudinary.com/dqch0tjrm/video/upload/vc_h264/v1780406757/the-equation_vs2zsc.mp4', 
    poster: theEquationPoster,
    color: '#3b82f6',
  },
  {
    id: 'lazarus',
    name: 'Lazarus Group',
    codename: 'LAZARUS',
    type: 'Nation-State APT',
    origin: 'North Korea',
    since: 'Est. 2007',
    description: 'A state-sponsored advanced persistent threat group for some of the largest financial cyber heists in history, including $81M Bangladesh Bank and widespread cryptocurrency claims.',
    capabilities: ['Financial system targeting', 'Cryptocurrency theft', 'Destructive wiper attacks', 'Supply chain compromise'],
    threat: 'EXTREME',
    videoUrl: 'https://res.cloudinary.com/dqch0tjrm/video/upload/vc_h264/v1780248016/lazarus_nhudt2.mp4',
    poster: lazarusPoster,
    color: '#a855f7',
  },
  {
    id: 'apt29',
    name: 'APT29 (Cozy Bear)',
    codename: 'APT29',
    type: 'Nation-State APT',
    origin: 'Russia (SVR)',
    since: 'Est. 2008',
    description: 'A Russian intelligence-linked advanced persistent threat group for the SolarWinds supply chain attack, the DNC breach, and ongoing espionage campaigns against governments, think tanks,and COVID-19 vaccine researchers.',
    capabilities: ['Supply chain attacks', 'Long-term stealth persistence', 'Government espionage', 'Cloud infrastructure abuse'],
    threat: 'EXTREME',
    videoUrl: 'https://res.cloudinary.com/dqch0tjrm/video/upload/vc_h264/v1780492583/apt29_lwnncf.mp4',
    poster: apt29Poster,
    color: '#22c55e',
  },
  {
    id: 'shadow-brokers',
    name: 'The Shadow Brokers',
    codename: 'SHADOW BROKERS',
    type: 'Exploit Broker / Threat Actor',
    origin: 'Unknown',
    since: 'Est. 2016',
    description: 'A mysterious threat that leaked classified NSA hacking tools including EternalBlue — the exploit that powered the WannaCry and NotPetya attacks affecting hundreds of thousands of systems worldwide.',
    capabilities: ['Classified exploit leaking', 'NSA tool exfiltration', 'Zero-day brokering', 'Critical infrastructure targeting'],
    threat: 'EXTREME',
    videoUrl: 'https://res.cloudinary.com/dqch0tjrm/video/upload/vc_h264/v1780463969/shadow-brokers_ga6tmk.mp4',
    poster: shadowBrokersPoster,
    color: '#f59e0b',
  },
  {
    id: 'virus',
    name: 'Virus',
    codename: 'VIRUS',
    type: 'Malware Development Group',
    origin: 'Eastern Europe',
    since: 'Est. 2010',
    description: 'A prolific malware development and distribution network for some of the most destructive ransomware and banking trojans deployed globally. Known for constant evolution to evade detection.',
    capabilities: ['Ransomware development', 'Banking trojan deployment', 'Botnet operations', 'Cryptomining malware'],
    threat: 'HIGH',
    videoUrl: 'https://res.cloudinary.com/dqch0tjrm/video/upload/vc_h264/v1780384928/virus_aol82c.mp4',
    poster: virusPoster,
    color: '#ef4444',
  },
  {
    id: 'anonymous',
    name: 'Anonymous',
    codename: 'ANONYMOUS',
    type: 'Hacktivist Collective',
    origin: 'Global',
    since: 'Est. 2003',
    description: 'A decentralized international hacktivist collective known for coordinated cyber attacks against governments, corporations, and institutions perceived as corrupt. Operates through social media coordination with no central leadership.',
    capabilities: ['DDoS campaigns', 'Data exfiltration', 'Website defacement', 'Doxxing operations'],
    threat: 'HIGH',
    videoUrl: 'https://res.cloudinary.com/dqch0tjrm/video/upload/vc_h264/v1780406450/anonymous_mtu7vb.mp4',
    poster: anonymousPoster,
    color: '#6b7280',
  },
]

const THREAT_COLORS = {
  'EXTREME': { bg: '#fef2f2', border: '#fca5a5', text: '#dc2626' },
  'HIGH':    { bg: '#fffbeb', border: '#fde68a', text: '#d97706' },
}

function OfficialPlayer({ official }) {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)
  const [ccOn, setCcOn] = useState(false)

  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00'
    return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`
  }

  const toggle = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      const playPromise = v.play()
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true)).catch(err => console.log('Play error:', err))
      }
    } else {
      v.pause()
      setIsPlaying(false)
    }
  }

  const seek = (e) => {
    const v = videoRef.current
    if (!v) return
    const r = e.currentTarget.getBoundingClientRect()
    v.currentTime = ((e.clientX - r.left) / r.width) * v.duration
  }

  const restart = (e) => {
    e.stopPropagation()
    const v = videoRef.current
    if (!v) return
    v.currentTime = 0
    if (v.paused) { v.play(); setIsPlaying(true) }
  }

  const handleSpeedChange = (rate, e) => {
    e?.stopPropagation()
    const v = videoRef.current
    if (v) v.playbackRate = rate
    setPlaybackSpeed(rate)
    setShowSpeedMenu(false)
  }

  /* Double-tap sides of the frame to skip ±10s */
  const lastTapRef = useRef({ side: null, time: 0 })
  const [skipHint, setSkipHint] = useState(null)
  const handleFrameTap = (e) => {
    const v = videoRef.current
    if (!v) return
    const rect = e.currentTarget.getBoundingClientRect()
    const tapX = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
    const side = tapX < rect.width / 2 ? 'backward' : 'forward'
    const now  = Date.now()
    const last = lastTapRef.current

    if (last.side === side && now - last.time < 350) {
      const skip = side === 'forward' ? 10 : -10
      v.currentTime = Math.min(Math.max(v.currentTime + skip, 0), v.duration)
      setSkipHint(side)
      setTimeout(() => setSkipHint(null), 700)
      lastTapRef.current = { side: null, time: 0 }
    } else {
      lastTapRef.current = { side, time: now }
      setTimeout(() => {
        if (lastTapRef.current.side === side) {
          toggle()
          lastTapRef.current = { side: null, time: 0 }
        }
      }, 360)
    }
  }

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onTime = () => { setCurrentTime(v.currentTime); setProgress((v.currentTime/v.duration)*100||0) }
    const onMeta = () => setDuration(v.duration)
    const onEnd  = () => setIsPlaying(false)
    v.addEventListener('timeupdate', onTime)
    v.addEventListener('loadedmetadata', onMeta)
    v.addEventListener('ended', onEnd)
    return () => {
      v.removeEventListener('timeupdate', onTime)
      v.removeEventListener('loadedmetadata', onMeta)
      v.removeEventListener('ended', onEnd)
    }
  }, [])

  useEffect(() => { if (videoRef.current) videoRef.current.muted = muted }, [muted])

  /* Scroll-pause: pause when scrolled out of view */
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (!entry.isIntersecting && !v.paused) { v.pause(); setIsPlaying(false) } },
      { threshold: 0.15 }
    )
    observer.observe(v)
    return () => observer.disconnect()
  }, [])

  const tc = THREAT_COLORS[official.threat]

  return (
    <div className="official-player-card">
      <div className="official-player-frame" onClick={handleFrameTap} onTouchEnd={handleFrameTap} style={{ borderColor: official.color + '44' }}>
        <video
          ref={videoRef}
          className="official-player-video"
          src={official.videoUrl}
          playsInline
          preload="metadata"
          crossOrigin="anonymous"
        />
        <div className="official-player-gradient" />
        <div className="official-player-watermark" style={{ color: official.color + '55' }}>
          {official.codename}
        </div>

        {skipHint === 'backward' && (
          <div className="skip-hint skip-hint-left"><i className="bi bi-skip-backward-fill"></i><span>-10s</span></div>
        )}
        {skipHint === 'forward' && (
          <div className="skip-hint skip-hint-right"><i className="bi bi-skip-forward-fill"></i><span>+10s</span></div>
        )}

        {!isPlaying && (
          <div className="official-player-overlay">
            <button className="official-play-btn" style={{ borderColor: official.color, background: official.color + '22' }}>
              <i className="bi bi-play-fill" style={{ color: official.color }}></i>
            </button>
          </div>
        )}
      </div>

      <div className="official-player-controls">
        <div className="official-ctrl-row1">
          <div className="official-ctrl-left">
            <button className="official-ctrl" onClick={restart} aria-label="Restart">
              <i className="bi bi-arrow-counterclockwise"></i>
            </button>
            <button className="official-ctrl" onClick={toggle} aria-label={isPlaying ? 'Pause' : 'Play'}>
              <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
            </button>
            <button className="official-ctrl" onClick={() => setMuted(p => !p)} aria-label="Toggle mute">
              <i className={`bi ${muted ? 'bi-volume-mute-fill' : 'bi-volume-up-fill'}`}></i>
            </button>
            <span className="official-ctrl-time">{fmt(currentTime)} / {fmt(duration)}</span>
          </div>
          <div className="official-ctrl-right">
            <button
              className={`official-ctrl ${ccOn ? 'official-ctrl-active' : ''}`}
              onClick={() => setCcOn(p => !p)}
              aria-label="Toggle captions"
              aria-pressed={ccOn}
            >
              <i className="bi bi-cc-square"></i>
            </button>
            <div className="official-speed-wrap">
              <button className="official-ctrl" onClick={() => setShowSpeedMenu(p => !p)} aria-label="Playback speed settings">
                <i className="bi bi-gear-fill"></i>
              </button>
              {showSpeedMenu && (
                <div className="official-speed-menu">
                  {[0.5, 1, 1.5, 2].map(rate => (
                    <button
                      key={rate}
                      className={`official-speed-option ${playbackSpeed === rate ? 'official-speed-option-active' : ''}`}
                      onClick={(e) => handleSpeedChange(rate, e)}
                    >
                      {rate}x{rate === 1 ? ' (Normal)' : ''}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="official-ctrl-progress" onClick={seek}>
          <div className="official-progress-track">
            <div className="official-progress-fill" style={{ width: `${progress}%`, background: official.color }} />
          </div>
        </div>
      </div>

      <div className="official-caption">
        <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
          <div>
            <div className="official-caption-codename" style={{ color: official.color }}>
              {official.codename}
            </div>
            <div className="official-caption-name">{official.name}</div>
            <div className="official-caption-type">{official.type} · {official.origin}</div>
          </div>
          <span className="official-threat-badge" style={{ background: tc.bg, borderColor: tc.border, color: tc.text }}>
            {official.threat}
          </span>
        </div>
        <p className="official-caption-desc">{official.description}</p>
        <div className="official-caption-capabilities">
          <div className="official-cap-label">Key Capabilities</div>
          <div className="d-flex flex-wrap gap-1 mt-1">
            {official.capabilities.map(c => (
              <span key={c} className="official-cap-tag">{c}</span>
            ))}
          </div>
        </div>
        <div className="official-caption-since">{official.since}</div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════
   COMBINED VIDEO — "The Hackers"
   Full-width cinematic player shown
   below all six official videos
   ══════════════════════════════════════ */
function CombinedVideo() {
  const videoRef = useRef(null)
  const playerWrapRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [muted,     setMuted]     = useState(true)
  const [progress,  setProgress]  = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration,  setDuration]  = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)
  const [ccOn, setCcOn] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [skipHint, setSkipHint] = useState(null)
  const lastTapRef = useRef({ side: null, time: 0 })

  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00'
    return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`
  }

  const toggle = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play().then(() => setIsPlaying(true)).catch(e => console.log('Play error:', e))
    } else {
      v.pause(); setIsPlaying(false)
    }
  }

  const seek = (e) => {
    const v = videoRef.current
    if (!v) return
    const r = e.currentTarget.getBoundingClientRect()
    v.currentTime = ((e.clientX - r.left) / r.width) * v.duration
  }

  const restart = (e) => {
    e.stopPropagation()
    const v = videoRef.current
    if (!v) return
    v.currentTime = 0
    if (v.paused) { v.play(); setIsPlaying(true) }
  }

  const handleSpeedChange = (rate, e) => {
    e?.stopPropagation()
    const v = videoRef.current
    if (v) v.playbackRate = rate
    setPlaybackSpeed(rate)
    setShowSpeedMenu(false)
  }

  const toggleFullscreen = (e) => {
    e.stopPropagation()
    const wrap = playerWrapRef.current
    if (!wrap) return
    if (!document.fullscreenElement) {
      wrap.requestFullscreen?.() || wrap.webkitRequestFullscreen?.()
    } else {
      document.exitFullscreen?.() || document.webkitExitFullscreen?.()
    }
  }

  /* Double-tap sides of the frame to skip ±10s */
  const handleFrameTap = (e) => {
    const v = videoRef.current
    if (!v) return
    const rect = e.currentTarget.getBoundingClientRect()
    const tapX = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
    const side = tapX < rect.width / 2 ? 'backward' : 'forward'
    const now  = Date.now()
    const last = lastTapRef.current

    if (last.side === side && now - last.time < 350) {
      const skip = side === 'forward' ? 10 : -10
      v.currentTime = Math.min(Math.max(v.currentTime + skip, 0), v.duration)
      setSkipHint(side)
      setTimeout(() => setSkipHint(null), 700)
      lastTapRef.current = { side: null, time: 0 }
    } else {
      lastTapRef.current = { side, time: now }
      setTimeout(() => {
        if (lastTapRef.current.side === side) {
          toggle()
          lastTapRef.current = { side: null, time: 0 }
        }
      }, 360)
    }
  }

  const playFullscreen = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const v = videoRef.current
    const wrap = playerWrapRef.current
    if (!v) return
    v.muted = false
    setMuted(false)
    v.play().then(() => {
      setIsPlaying(true)
      if (wrap) {
        wrap.requestFullscreen?.() || wrap.webkitRequestFullscreen?.()
      }
    }).catch(e => console.log('Play error:', e))
  }

  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFs)
    document.addEventListener('webkitfullscreenchange', onFs)
    return () => {
      document.removeEventListener('fullscreenchange', onFs)
      document.removeEventListener('webkitfullscreenchange', onFs)
    }
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onTime = () => { setCurrentTime(v.currentTime); setProgress((v.currentTime/v.duration)*100||0) }
    const onMeta = () => setDuration(v.duration)
    const onEnd  = () => setIsPlaying(false)
    v.addEventListener('timeupdate', onTime)
    v.addEventListener('loadedmetadata', onMeta)
    v.addEventListener('ended', onEnd)
    return () => {
      v.removeEventListener('timeupdate', onTime)
      v.removeEventListener('loadedmetadata', onMeta)
      v.removeEventListener('ended', onEnd)
    }
  }, [])

  useEffect(() => { if (videoRef.current) videoRef.current.muted = muted }, [muted])

  /* Scroll-pause */
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (!entry.isIntersecting && !v.paused) { v.pause(); setIsPlaying(false) } },
      { threshold: 0.15 }
    )
    observer.observe(v)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="section-pad-lg" style={{ background: '#0a0f1e' }}>
      <div className="container">
        <div className="text-center mb-5">
          <div className="section-label mb-2" style={{ color: 'rgba(120,214,255,0.7)' }}>All Six Officials</div>
          <h2 className="fw-bold mb-2" style={{ color: '#f0f4ff', fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)' }}>
            The Officials — United
          </h2>
          <p className="mx-auto" style={{ maxWidth: '56ch', color: 'rgba(233,243,255,0.6)', fontSize: '0.95rem' }}>
            A combined look at all six elite threat actors tracked by WHTSIPA. Understand
            how they operate together to form the most sophisticated cyber threat landscape.
          </p>
        </div>

        {/* Cinematic player — full width */}
        <div className="combined-video-player" ref={playerWrapRef}>

          {/* Top bar */}
          <div className="combined-video-topbar">
            <div className="combined-video-dots" aria-hidden="true">
              <span style={{ background: '#ff5f57' }}></span>
              <span style={{ background: '#febc2e' }}></span>
              <span style={{ background: '#28c840' }}></span>
            </div>
            <div className="combined-video-title">WHTSIPA &amp; The Officials </div>
            <div className="combined-video-duration">{fmt(duration)}</div>
          </div>

          {/* Video frame */}
          <div className="combined-video-frame" onClick={handleFrameTap} onTouchEnd={handleFrameTap}>
            <video
              ref={videoRef}
              className="combined-video-el"
              src="https://res.cloudinary.com/dqch0tjrm/video/upload/v1781208116/the-hackers_vdy1uk.mp4"
              playsInline
              preload="metadata"
              crossOrigin="anonymous"
            />
            <div className="combined-video-gradient" />
            <div className="combined-video-watermark">whts-client.vercel.app</div>

            {skipHint === 'backward' && (
              <div className="skip-hint skip-hint-left"><i className="bi bi-skip-backward-fill"></i><span>-10s</span></div>
            )}
            {skipHint === 'forward' && (
              <div className="skip-hint skip-hint-right"><i className="bi bi-skip-forward-fill"></i><span>+10s</span></div>
            )}

            {!isPlaying && (
              <div className="combined-video-overlay">
                <button className="combined-play-btn" aria-label="Play video">
                  <i className="bi bi-play-fill"></i>
                </button>
                <div className="combined-play-sub">
                  Tap to play · The Hackers · {fmt(duration)}
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="combined-video-controls">
            <div className="combined-ctrl-row1">
              <div className="combined-ctrl-left">
                <button className="combined-ctrl-btn" onClick={restart} aria-label="Restart">
                  <i className="bi bi-arrow-counterclockwise"></i>
                </button>
                <button className="combined-ctrl-btn" onClick={toggle} aria-label={isPlaying ? 'Pause' : 'Play'}>
                  <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
                </button>
                <button className="combined-ctrl-btn" onClick={() => setMuted(p => !p)} aria-label="Toggle mute">
                  <i className={`bi ${muted ? 'bi-volume-mute-fill' : 'bi-volume-up-fill'}`}></i>
                </button>
                <span className="combined-ctrl-time">{fmt(currentTime)} / {fmt(duration)}</span>
              </div>

              <div className="combined-ctrl-right">
                <button
                  className={`combined-ctrl-btn ${ccOn ? 'combined-ctrl-active' : ''}`}
                  onClick={() => setCcOn(p => !p)}
                  aria-label="Toggle captions"
                  aria-pressed={ccOn}
                >
                  <i className="bi bi-cc-square"></i>
                </button>
                <div className="combined-speed-wrap">
                  <button className="combined-ctrl-btn" onClick={() => setShowSpeedMenu(p => !p)} aria-label="Playback speed settings">
                    <i className="bi bi-gear-fill"></i>
                  </button>
                  {showSpeedMenu && (
                    <div className="combined-speed-menu">
                      {[0.5, 1, 1.5, 2].map(rate => (
                        <button
                          key={rate}
                          className={`combined-speed-option ${playbackSpeed === rate ? 'combined-speed-option-active' : ''}`}
                          onClick={(e) => handleSpeedChange(rate, e)}
                        >
                          {rate}x{rate === 1 ? ' (Normal)' : ''}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button className="combined-ctrl-btn" onClick={toggleFullscreen} aria-label="Toggle fullscreen">
                  <i className={`bi ${isFullscreen ? 'bi-fullscreen-exit' : 'bi-fullscreen'}`}></i>
                </button>
                <span className="combined-ctrl-badge">
                  <i className="bi bi-shield-fill-check me-1"></i>WHTSIPA
                </span>
              </div>
            </div>

            <div className="combined-ctrl-progress" onClick={seek}>
              <div className="combined-progress-track">
                <div className="combined-progress-fill" style={{ width: `${progress}%` }} />
                <div className="combined-progress-thumb" style={{ left: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="combined-video-find-us-wrap">
          <button className="combined-ctrl-find-us" onClick={playFullscreen} type="button">
            <span className="find-us-inner">
              <span className="find-us-bracket find-us-bracket-tl"></span>
              <span className="find-us-bracket find-us-bracket-tr"></span>
              FIND US
              <span className="find-us-bracket find-us-bracket-bl"></span>
              <span className="find-us-bracket find-us-bracket-br"></span>
            </span>
          </button>
        </div>

      </div>
    </section>
  )
}

export default function AboutOfficials() {
  return (
    <div className="page-light">
      <header className="about-hero">
        <div className="container text-center" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
          <div className="section-label mb-2">The Officials</div>
          <h1 className="fw-bold mb-3" style={{ color: '#0f172a', fontSize: 'clamp(1.8rem,3vw,2.8rem)', lineHeight: 1.1 }}>
            Meet The Six Officials
          </h1>
          <p className="mx-auto mb-4" style={{ maxWidth: '60ch', fontSize: '1.05rem', color: '#4a5568' }}>
            WHTSIPA Tracks and Monitors with Six Elite Threat Actor Groups — The chosen Sophisticated Cyber Operations in the World. Understanding them is the first step toward effective protection.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link className="btn btn-primary px-4" to="/about" style={{ borderRadius: 12, fontWeight: 600 }}>
              <i className="bi bi-arrow-left me-2"></i>About WHTSIPA
            </Link>
            <Link className="btn btn-danger px-4" to="/report" style={{ borderRadius: 12, fontWeight: 600 }}>
              <i className="bi bi-exclamation-triangle me-2"></i>Report an Incident
            </Link>
          </div>
        </div>
      </header>

      <section className="section-pad-lg" style={{ background: '#ffffff' }}>
        <div className="container">
          <div className="row g-5">
            {OFFICIALS.map(official => (
              <div key={official.id} className="col-12 col-lg-6">
                <OfficialPlayer official={official} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Arrow separator — points from individual officials down to the combined section ── */}
      <div className="officials-arrow-separator">
        <div className="officials-arrow-line"></div>
        <div className="officials-arrow-head">
          <i className="bi bi-chevron-down"></i>
        </div>
      </div>

      {/* ── Combined "The Hackers" video — full width ── */}
      <CombinedVideo />

      <section className="section-pad" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div className="about-cta-banner p-4 p-md-5 text-center">
            <div className="section-label mb-3">Stay Informed</div>
            <h2 className="fw-bold mb-3" style={{ color: '#0f172a' }}>
              These threats are real. Your protection matters.
            </h2>
            <p className="mb-4 mx-auto" style={{ maxWidth: '50ch', color: '#4a5568' }}>
              WHTSIPA actively work together with all six groups. If you suspect you've been targeted
              by any of these actors, report it immediately.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link className="btn btn-danger px-4" to="/report" style={{ borderRadius: 12, fontWeight: 600 }}>
                <i className="bi bi-exclamation-triangle me-2"></i>Report an Incident
              </Link>
              <Link className="btn btn-outline-secondary px-4" to="/threats" style={{ borderRadius: 12, fontWeight: 600 }}>
                <i className="bi bi-grid me-2"></i>Threat Library
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}