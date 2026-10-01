// Single source of truth for "force the user back to /signin, preserving
// where they were." Both the admin idle-timeout modal and the axios 401
// interceptor call forceSignOut() instead of touching window.location
// directly — whichever fires first "wins" and performs the one real
// navigation; every other caller (including this same tick) becomes a
// no-op.
//
// Why this exists: previously each caller independently read
// window.location.pathname and independently set window.location.href.
// Clearing the token (logout()) triggers a React re-render, and
// AdminLayout's own `if (!user) return <Navigate ... replace />` fires a
// client-side history.replaceState — which is effectively instant and
// happens *before* a real browser navigation (window.location.href) has
// finished starting. If a second 401 came in around the same time (e.g.
// the idle-ping request, or any other in-flight admin call), it would
// recompute `from` from window.location.pathname *after* that
// replaceState had already changed it — capturing the wrong page and
// sending the person to the wrong place (sometimes the homepage) after
// they signed back in. This lock makes only one redirect ever actually
// happen, computed from the original page, every time.
let redirecting = false

export function forceSignOut() {
  if (redirecting) return
  redirecting = true
  const from = encodeURIComponent(window.location.pathname)
  localStorage.removeItem('whts_user')
  window.location.href = `/signin?from=${from}`
}

// AdminLayout checks this before rendering its own client-side
// <Navigate> — if a hard redirect is already in flight, it should do
// nothing and let that real navigation land, rather than racing it.
export function isRedirecting() {
  return redirecting
}

// ── Restricted-account escalation ──
// A restricted account is already blocked on every API call by the backend
// (see auth.middleware.js) — this just makes a live session actually *feel*
// blocked instead of sitting there silently failing in the background.
// Each time a restricted account's stale session gets caught making an API
// call, it escalates: 1st catch → Sign In, 2nd catch → Sign Up, 3rd+ catch →
// removed from the app entirely, no way back in. The count is kept in
// localStorage (not memory) so it survives a page reload or the browser
// Back button, which is exactly the "cheat and reverse back" case this
// exists for. It's reset the moment a real sign-in/sign-up succeeds (see
// resetRestrictedStrikes(), called from AuthContext's login()) so it never
// lingers and affects a different, legitimate future visit on the same
// browser.
const STRIKES_KEY = 'whts_restricted_strikes'

export function forceRestrictedRedirect() {
  if (redirecting) return
  redirecting = true

  let strikes = Number(localStorage.getItem(STRIKES_KEY) || 0) + 1
  localStorage.setItem(STRIKES_KEY, String(strikes))
  localStorage.removeItem('whts_user')

  if (strikes === 1) {
    const from = encodeURIComponent(window.location.pathname)
    window.location.href = `/signin?from=${from}`
  } else if (strikes === 2) {
    window.location.href = '/signup'
  } else {
    window.location.href = '/access-removed'
  }
}

export function resetRestrictedStrikes() {
  localStorage.removeItem(STRIKES_KEY)
}
