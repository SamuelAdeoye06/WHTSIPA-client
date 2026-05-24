// ══════════════════════════════════════════════════════
// BACKEND INTEGRATION — AuthContext.jsx
// ══════════════════════════════════════════════════════
// Replace the localStorage simulation with real API calls:
//
// login(userData)    → POST /api/auth/login
// register(userData) → POST /api/auth/register
// logout()           → POST /api/auth/logout (optional, clear server session)
//
// On app mount (useEffect), replace localStorage.getItem with:
//   GET /api/auth/me  — returns current user from JWT/session
//
// Expected user object shape:
// { id, name, email, country, createdAt }
// ══════════════════════════════════════════════════════

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount — check if a user session exists in localStorage
  // When backend is ready, replace this with an API call e.g. api.get('/auth/me')
  useEffect(() => {
    try {
      const stored = localStorage.getItem('whts_user')
      if (stored) setUser(JSON.parse(stored))
    } catch {
      localStorage.removeItem('whts_user')
    } finally {
      setLoading(false)
    }
  }, [])

  const login = (userData) => {
    // Called after successful sign in API response
    setUser(userData)
    localStorage.setItem('whts_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('whts_user')
  }

  const register = (userData) => {
    // Called after successful sign up API response
    setUser(userData)
    localStorage.setItem('whts_user', JSON.stringify(userData))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook — use this in any component that needs auth state
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}   