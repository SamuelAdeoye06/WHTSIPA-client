import { useState, useEffect, useRef, useCallback } from 'react'
import api from '../../../services/api'
import { useAuth } from '../../../context/AuthContext'
import { forceSignOut } from '../../../services/authRedirect'
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

  const idleTimerRef     = useRef(null)
  // The ONE thing that decides sign-out: a single setTimeout scheduled
  // for the exact grace deadline. Unlike a repeating setInterval whose
  // "final tick" callback can already be queued before a cancel takes
  // effect, a single deadline timeout has nothing to race against —
  // clearTimeout either beats it or doesn't, with no in-between state.
  const deadlineTimerRef = useRef(null)
  // Purely cosmetic — just repaints the countdown text. Never itself
  // triggers sign-out.
  const tickIntervalRef  = useRef(null)
  // Extra guard on top of the deadline/clearTimeout split above, since
  // handleSignOut can still be invoked from two places (the deadline
  // timer firing, or the user clicking "Sign Out" by hand) — whichever
  // runs first claims this flag, the other bails out.
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
    clearTimeout(deadlineTimerRef.current)
    clearInterval(tickIntervalRef.current)
    logout() // clears React auth state immediately for anything that renders before the hard nav lands
    forceSignOut() // shared lock — see services/authRedirect.js
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

  // Grace period: one setTimeout scheduled for the exact deadline decides
  // sign-out (handleSignOut, above). The setInterval here only repaints
  // the countdown text every 250ms from that same deadline — it never
  // makes the sign-out decision itself, so there's no "final tick" to
  // race a click against anymore.
  useEffect(() => {
    if (!showWarning) return
    const deadline = Date.now() + GRACE_PERIOD_SECONDS * 1000
    setGraceLeft(GRACE_PERIOD_SECONDS)

    deadlineTimerRef.current = setTimeout(handleSignOut, GRACE_PERIOD_SECONDS * 1000)
    tickIntervalRef.current = setInterval(() => {
      setGraceLeft(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)))
    }, 250)

    return () => {
      clearTimeout(deadlineTimerRef.current)
      clearInterval(tickIntervalRef.current)
    }
  }, [showWarning, handleSignOut])

  const handleStayLoggedIn = async () => {
    if (resolvedRef.current) return // the deadline already fired and signed out — too late
    resolvedRef.current = true
    clearTimeout(deadlineTimerRef.current)
    clearInterval(tickIntervalRef.current)
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
