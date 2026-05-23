import { useState } from 'react'
import '../styles/cyber.css'
import './Auth.css'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import logoWhts from '../assets/media/logo-whts.jpg'

export default function SignIn() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')
        if (!form.email || !form.password) {
            setError('Please fill in all fields.')
            return
        }
        setLoading(true)
        // ── Replace setTimeout with actual API call later ──
        setTimeout(() => {
            login({ email: form.email, name: 'User' })
            setLoading(false)
            // If they were redirected here from another page, go back there
            const from = location.state?.from || '/'
            const scrollTo = location.state?.scrollTo
            navigate(from, scrollTo ? { state: { scrollTo } } : {})
        }, 1000)
    }

  return (
    <div className="auth-split">

      {/* ── LEFT — Brand panel ── */}
      <div className="auth-panel-left">
        <div className="cyber-grid" aria-hidden="true" />
        <div className="auth-panel-left-inner">

          {/* Logo */}
          <Link to="/" className="auth-panel-logo">
            <img src={logoWhts} alt="WHTS" />
          </Link>

          {/* Headline */}
          <div className="auth-panel-headline">
            <h2>Welcome back,</h2>
            <span className="auth-panel-accent">Defender.</span>
            <p>Your incident reports, threat intelligence, and recovery progress are right where you left them.</p>
          </div>

          {/* Feature stats */}
          <div className="auth-panel-stats">
            <div className="auth-stat-item">
              <div className="auth-stat-value">17+</div>
              <div className="auth-stat-label">Threat scenarios</div>
            </div>
            <div className="auth-stat-item">
              <div className="auth-stat-value">24/7</div>
              <div className="auth-stat-label">Active support</div>
            </div>
            <div className="auth-stat-item">
              <div className="auth-stat-value">Free</div>
              <div className="auth-stat-label">Always</div>
            </div>
          </div>

          {/* Quote */}
          <div className="auth-panel-quote">
            <span>"The best time to report a cybercrime was immediately. The second best time is now."</span>
          </div>

        </div>
      </div>

      {/* ── RIGHT — Form panel ── */}
      <div className="auth-panel-right">
        <div className="auth-form-wrap">

          <div className="auth-form-header">
            <h1 className="auth-form-title">Sign In</h1>
            <p className="auth-form-sub">
              Don't have an account?{' '}
              <Link to="/signup" className="auth-inline-link">Create one free</Link>
            </p>
          </div>

          {error && (
            <div className="auth-error">
              <i className="bi bi-exclamation-circle me-2"></i>{error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            <div className="auth-field">
              <label className="auth-label" htmlFor="email">Email Address</label>
              <div className="auth-input-wrap">
                <i className="bi bi-envelope auth-input-icon"></i>
                <input id="email" type="email" className="auth-input"
                  placeholder="you@example.com" value={form.email}
                  onChange={set('email')} autoComplete="email" required />
              </div>
            </div>

            <div className="auth-field">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="auth-label mb-0" htmlFor="password">Password</label>
                <Link to="/forgot-password" className="auth-forgot">Forgot password?</Link>
              </div>
              <div className="auth-input-wrap">
                <i className="bi bi-lock auth-input-icon"></i>
                <input id="password" type={showPassword ? 'text' : 'password'}
                  className="auth-input" placeholder="Enter your password"
                  value={form.password} onChange={set('password')}
                  autoComplete="current-password" required />
                <button type="button" className="auth-eye-btn"
                  onClick={() => setShowPassword(p => !p)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading
                ? <><span className="auth-spinner"></span>Signing in...</>
                : <>Sign In <i className="bi bi-arrow-right ms-2"></i></>
              }
            </button>

          </form>

          <p className="auth-bottom-note mt-4">
            By signing in you agree to our{' '}
            <span className="auth-link">Terms of Use</span> and{' '}
            <span className="auth-link">Privacy Policy</span>.
          </p>

        </div>
      </div>

    </div>
  )
}
