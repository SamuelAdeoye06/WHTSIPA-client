import { useState, useEffect, useRef, useCallback } from 'react'
import api from '../../../services/api'
import { useAuth } from '../../../context/AuthContext'
import '../AdminShared.css'

// How long the "Are you still logged in?" modal waits for a response
// before treating silence as "no" and logging out. Not admin-configurable
// (only the idle threshold itself is, in Settings) — kept short on purpose
// so it can't quietly double the effective idle allowance on the shortest
// (30s) setting. 15s is enough time for a human to notice and click.
const GRACE_PERIOD_SECONDS = 15

const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart']

/* Mounted once in AdminLayout.jsx, wraps the whole admin panel. Tracks
   idle time client-side and shows a confirmation modal when the admin's
   configured session length elapses with no activity — if there's no
   response within the grace period, or the admin explicitly signs out,
   the session ends. Clicking "Yes" pings a lightweight authenticated
   endpoint to trigger the sliding server-side token refresh (see
   auth.middleware.js protect()), so the actual session genuinely extends,
   not just the UI illusion of it. */
export default function AdminIdleWarning() {
  const { logout } = useAuth()
  const [idleSeconds, setIdleSeconds] = useState(30)
  const [showWarning, setShowWarning] = useState(false)
  const [graceLeft, setGraceLeft] = useState(GRACE_PERIOD_SECONDS)

  const idleTimerRef  = useRef(null)
  const graceTimerRef = useRef(null)
  // Guards against a real race: the grace countdown's setInterval tick and
  // a "Stay Logged In" click can both already be queued in the same
  // instant (browser fires the interval's due tick before the click's
  // clearInterval() call has a chance to cancel it). Whichever of
  // handleSignOut/handleStayLoggedIn actually runs first "claims" this
  // flag; the other bails out instead of both executing.
  const resolvedRef = useRef(false)

  useEffect(() => {
    api.get('/admin/config').then(({ data }) => {
      if (data?.adminSessionSeconds) setIdleSeconds(data.adminSessionSeconds)
    }).catch(() => { /* keep default */ })
  }, [])

  const handleSignOut = useCallback(() => {
    if (resolvedRef.current) return
    resolvedRef.current = true
    clearTimeout(idleTimerRef.current)
    clearInterval(graceTimerRef.current)
    logout()
    const from = encodeURIComponent(window.location.pathname)
    window.location.href = `/signin?from=${from}`
  }, [logout])

  const startIdleTimer = useCallback(() => {
    clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(() => {
      resolvedRef.current = false
      setShowWarning(true)
      setGraceLeft(GRACE_PERIOD_SECONDS)
    }, idleSeconds * 1000)
  }, [idleSeconds])

  // While the warning modal is up, activity is ignored on purpose — the
  // admin must explicitly answer the prompt rather than the mere presence
  // of a stray mouse twitch silently dismissing it.
  const handleActivity = useCallback(() => {
    if (!showWarning) startIdleTimer()
  }, [showWarning, startIdleTimer])

  useEffect(() => {
    startIdleTimer()
    ACTIVITY_EVENTS.forEach(evt => document.addEventListener(evt, handleActivity))
    return () => {
      ACTIVITY_EVENTS.forEach(evt => document.removeEventListener(evt, handleActivity))
      clearTimeout(idleTimerRef.current)
    }
  }, [handleActivity, startIdleTimer])

  // Grace-period countdown once the warning is showing
  useEffect(() => {
    if (!showWarning) return
    graceTimerRef.current = setInterval(() => {
      setGraceLeft(prev => {
        if (prev <= 1) {
          clearInterval(graceTimerRef.current)
          handleSignOut()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(graceTimerRef.current)
  }, [showWarning, handleSignOut])

  const handleStayLoggedIn = async () => {
    if (resolvedRef.current) return // the grace tick already fired and signed out — too late
    resolvedRef.current = true
    clearInterval(graceTimerRef.current)
    setShowWarning(false)
    try {
      await api.get('/auth/me') // triggers the sliding token refresh server-side
    } catch {
      // If this fails the token's likely already dead — next real action
      // will 401 and the api.js interceptor bounces to /signin anyway.
    }
    startIdleTimer()
  }

  if (!showWarning) return null

  return (
    <div className="admin-confirm-overlay">
      <div className="admin-confirm-box">
        <div className="admin-confirm-icon"><i className="bi bi-clock-history"></i></div>
        <h3>Are you still logged in?</h3>
        <p>
          You've been inactive for a while. For security, this session will end automatically
          in {graceLeft}s unless you confirm you're still here.
        </p>
        <div className="admin-confirm-actions">
          <button className="admin-btn admin-btn-ghost" onClick={handleSignOut}>
            Sign Out
          </button>
          <button className="admin-btn admin-btn-primary" onClick={handleStayLoggedIn}>
            Yes, Stay Logged In
          </button>
        </div>
      </div>
    </div>
  )
}
