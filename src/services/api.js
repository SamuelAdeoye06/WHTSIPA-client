// Central Axios instance — all API calls go through here
import axios from 'axios'
import { forceSignOut } from './authRedirect'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
})

// Attach JWT token from localStorage to every request
api.interceptors.request.use(config => {
  try {
    const stored = localStorage.getItem('whts_user')
    if (stored) {
      const { token } = JSON.parse(stored)
      if (token) config.headers.Authorization = `Bearer ${token}`
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
    if (refreshed) {
      try {
        const stored = localStorage.getItem('whts_user')
        if (stored) {
          const parsed = JSON.parse(stored)
          parsed.token = refreshed
          localStorage.setItem('whts_user', JSON.stringify(parsed))
        }
      } catch { /* ignore */ }
    }
    return res
  },
  err => {
    if (err.response?.status === 401) {
      // Token expired/invalidated — hand off to the shared redirect lock
      // rather than navigating directly. If the idle-timeout modal (or
      // another in-flight request's 401) already claimed the redirect,
      // this is a no-op; otherwise this call does it. See authRedirect.js
      // for why a single lock matters here.
      forceSignOut()
    }
    return Promise.reject(err)
  }
)

export default api