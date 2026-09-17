// Central Axios instance — all API calls go through here
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
})

// TEMPORARY DEBUG HELPER — decodes a JWT's payload without verifying it,
// purely to log its expiry time for diagnosing the idle-session bug.
// Safe to remove once that's confirmed fixed.
function debugTokenExp(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp ? new Date(payload.exp * 1000).toISOString() : 'no exp'
  } catch {
    return 'unparseable'
  }
}

// Attach JWT token from localStorage to every request
api.interceptors.request.use(config => {
  try {
    const stored = localStorage.getItem('whts_user')
    if (stored) {
      const { token } = JSON.parse(stored)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        console.log(`[api] → ${config.method?.toUpperCase()} ${config.url} | using token exp ${debugTokenExp(token)}`)
      }
    }
  } catch { /* ignore */ }
  return config
})

// Global response error handler
api.interceptors.response.use(
  res => {
    // Sliding admin session — protect() reissues a fresh token with a
    // renewed expiry on every authenticated admin request (see
    // auth.middleware.js). Swap it into storage so the next request uses
    // the renewed one instead of the one that's now ticking toward expiry.
    const refreshed = res.headers?.['x-refreshed-token']
    console.log(`[api] ← ${res.config?.url} | refreshed header present: ${!!refreshed}${refreshed ? ` | new exp ${debugTokenExp(refreshed)}` : ''}`)
    if (refreshed) {
      try {
        const stored = localStorage.getItem('whts_user')
        if (stored) {
          const parsed = JSON.parse(stored)
          parsed.token = refreshed
          localStorage.setItem('whts_user', JSON.stringify(parsed))
          console.log(`[api] localStorage token updated, now exp ${debugTokenExp(refreshed)}`)
        }
      } catch { /* ignore */ }
    }
    return res
  },
  err => {
    if (err.response?.status === 401) {
      console.log(`[api] 401 on ${err.config?.url} — clearing session and redirecting`)
      // Token expired — clear local session. Carry the current path as a
      // query param since window.location can't pass React Router state;
      // SignIn.jsx reads ?from= to send the person back where they were
      // instead of defaulting to the homepage.
      localStorage.removeItem('whts_user')
      const from = encodeURIComponent(window.location.pathname)
      window.location.href = `/signin?from=${from}`
    }
    return Promise.reject(err)
  }
)

export default api