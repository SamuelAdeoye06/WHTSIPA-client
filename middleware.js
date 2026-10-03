// Vercel Routing Middleware — runs at Vercel's edge, before any page is
// served, for every request to this project. Works for any framework
// (confirmed against Vercel's current docs — this isn't a Next.js-only
// feature), which matters here since this is a plain Vite SPA.
//
// Purpose: block the ENTIRE public site from loading for visitors whose
// IP geolocates to a country the admin has marked "Page Access: Blocked"
// on the Countries admin page (CountrySettings.pageAccessAllowed). This is
// a different, stronger control than the existing `signupAllowed` flag,
// which only blocks the signup action for someone already using the site.
//
// The admin never has to touch Vercel directly — toggling a country in
// /admin/countries is all that's needed; this middleware picks it up on
// its own on the next cache refresh (see CACHE_TTL_MS below).

const BACKEND_BASE = process.env.VITE_API_URL || 'https://whtsipa-backend.onrender.com/api'
const BLOCKED_LIST_URL = `${BACKEND_BASE}/countries/blocked`

// Paths that must always stay reachable, everywhere, regardless of
// country — so restricting a country here can never accidentally lock the
// admin (or an existing account holder) out of signing in or managing the
// site. Checked as a plain prefix match, not a routing config `matcher`,
// to avoid getting matcher-regex syntax wrong.
const ALWAYS_ALLOWED_PREFIXES = [
  '/admin',
  '/signin',
  '/signup',
  '/verify-otp',
  '/forgot-password',
  '/reset-password',
  '/access-removed',
]

// Module-scope cache. Edge functions can get reused across nearby
// requests on a warm instance (not guaranteed, but common in practice),
// so this meaningfully cuts down how often the backend actually gets
// called — and even on a cold instance, worst case is one extra fetch.
let cache = { codes: null, expiresAt: 0 }
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes — see note below on why this is a deliberate tradeoff, not an afterthought

async function getBlockedCodes() {
  const now = Date.now()
  if (cache.codes && now < cache.expiresAt) return cache.codes

  try {
    // Render's free tier can cold-start slowly after inactivity. A slow or
    // hung backend must never be able to take the whole public site down
    // for everyone — so this fails OPEN (treat as "nothing blocked") on any
    // error or timeout, rather than failing closed. Blocking too little for
    // a few minutes is a far smaller problem than accidentally blocking
    // every visitor, everywhere, because Render was asleep.
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)
    const res = await fetch(BLOCKED_LIST_URL, { signal: controller.signal })
    clearTimeout(timeout)
    if (!res.ok) throw new Error(`Bad response: ${res.status}`)

    const codes = await res.json()
    cache = { codes: new Set(codes), expiresAt: now + CACHE_TTL_MS }
    return cache.codes
  } catch (err) {
    console.error('middleware: could not refresh blocked-countries list, failing open:', err.message)
    // Keep serving a stale cache if we have one (better than nothing);
    // otherwise treat as "nothing blocked" rather than blocking everyone.
    return cache.codes || new Set()
  }
}

function blockedResponse() {
  return new Response(
    `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Not Available</title>
    <style>
      body { font-family: system-ui, sans-serif; background: #0f172a; color: #e2e8f0; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; padding: 2rem; }
      h1 { font-size: 1.3rem; margin-bottom: 0.5rem; }
      p { color: #94a3b8; max-width: 420px; }
    </style>
  </head>
  <body>
    <div>
      <h1>This content isn't available in your region.</h1>
      <p>If you believe this is a mistake, please contact support.</p>
    </div>
  </body>
</html>`,
    { status: 403, headers: { 'content-type': 'text/html; charset=utf-8' } }
  )
}

export default async function middleware(request) {
  const url = new URL(request.url)

  if (ALWAYS_ALLOWED_PREFIXES.some(prefix => url.pathname.startsWith(prefix))) {
    return // let it through, untouched
  }

  const country = request.headers.get('x-vercel-ip-country')
  if (!country) return // no geo data (e.g. local dev) — allow through

  const blocked = await getBlockedCodes()
  if (blocked.has(country)) {
    return blockedResponse()
  }
  // implicit: no return = request continues normally
}
