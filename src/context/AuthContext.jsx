import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'
import { resetRestrictedStrikes } from '../services/authRedirect'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount — validate existing token with the server
  useEffect(() => {
    const stored = localStorage.getItem('whts_user')
    if (!stored) { setLoading(false); return }
    const parsed = JSON.parse(stored)
    if (!parsed?.token) { setLoading(false); return }

    api.get('/auth/me')
      .then(({ data }) => setUser({ ...data, token: parsed.token }))
      .catch(() => localStorage.removeItem('whts_user'))
      .finally(() => setLoading(false))
  }, [])

  // The browser's back/forward cache (bfcache) can restore an old page
  // exactly as it was — frozen JS state and all — without re-running any
  // of our code or hitting the server again. That's what let a restricted
  // user's old dashboard reappear when they hit Back: nothing re-checked
  // whether they were still allowed there. `pageshow` with
  // `event.persisted === true` is the browser's own signal that a page was
  // just restored this way (rather than freshly loaded), so this re-runs
  // the same /auth/me check right then. If the account is restricted, the
  // normal 403 → api.js's interceptor → forceRestrictedRedirect() chain
  // kicks in immediately, same as any other blocked request.
  useEffect(() => {
    const handlePageShow = (event) => {
      if (!event.persisted) return
      const stored = localStorage.getItem('whts_user')
      if (!stored) return
      api.get('/auth/me').catch(() => {})
    }
    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [])

  const login = (userData) => {
    // userData = { id, name, firstName, email, country, token }
    setUser(userData)
    localStorage.setItem('whts_user', JSON.stringify(userData))
    // A real, successful sign-in means this browser is no longer mid-cheat
    // on a restricted session — clear any escalation count so it doesn't
    // carry over and wrongly affect this (or a future legitimate) visit.
    resetRestrictedStrikes()
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('whts_user')
  }

  const register = (userData) => {
    // After registration we do NOT auto-login —
    // user must verify email first. userData here is just
    // for showing a success message if needed.
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}