import { useState, useRef, useEffect } from 'react'
import '../styles/cyber.css'
import './Auth.css'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import api from '../services/api'
import logoWhts from '../assets/media/logo-whts.jpg'

const CODE_LENGTH = 6

export default function SignIn() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // ── Two-factor step — only entered when login() reports requires2FA.
  // pendingToken proves the password step already succeeded; it carries
  // no session privileges on its own until verify-login accepts a code.
  const [pendingToken, setPendingToken] = useState('')
  const [useBackupCode, setUseBackupCode] = useState(false)
  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(''))
  const [backupCode, setBackupCode] = useState('')
  const [verifying, setVerifying] = useState(false)
  const inputsRef = useRef([])

  useEffect(() => {
    if (pendingToken && !useBackupCode) inputsRef.current[0]?.focus()
  }, [pendingToken, useBackupCode])

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  const finishLogin = (data) => {
    login({ ...data.user, token: data.token })
    // React Router state (set when navigating here client-side) takes
    // priority; ?from= is the fallback for forced logouts that had to
    // use a full page reload (401 interceptor, idle-timeout modal),
    // which can't carry router state — see services/api.js.
    const searchFrom = new URLSearchParams(location.search).get('from')
    const { from = searchFrom || '/', ...rest } = location.state || {}
    navigate(from, Object.keys(rest).length ? { state: rest } : {})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) {
        setError('Please fill in all fields.')
        return
    }
    setLoading(true)
    try {
        const { data } = await api.post('/auth/login', { email: form.email, password: form.password })
        if (data.requires2FA) {
          setPendingToken(data.pendingToken)
        } else {
          finishLogin(data)
        }
    } catch (err) {
         setError(err.response?.data?.message || 'Invalid email or password.')
    } finally {
        setLoading(false)
    }
  }

  const codeValue = digits.join('')

  const handleCodeChange = (i) => (e) => {
    const val = e.target.value.replace(/\D/g, '')
    if (!val) {
      setDigits(p => { const next = [...p]; next[i] = ''; return next })
      return
    }
    if (val.length > 1) {
      const chars = val.slice(0, CODE_LENGTH).split('')
      setDigits(p => {
        const next = [...p]
        chars.forEach((c, idx) => { if (i + idx < CODE_LENGTH) next[i + idx] = c })
        return next
      })
      inputsRef.current[Math.min(i + chars.length, CODE_LENGTH - 1)]?.focus()
      return
    }
    setDigits(p => { const next = [...p]; next[i] = val; return next })
    if (i < CODE_LENGTH - 1) inputsRef.current[i + 1]?.focus()
  }

  const handleCodeKeyDown = (i) => (e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) inputsRef.current[i - 1]?.focus()
  }

  const handleVerify2FA = async (e) => {
    e.preventDefault()
    setError('')
    const code = useBackupCode ? backupCode.trim() : codeValue
    if (useBackupCode ? !code : code.length !== CODE_LENGTH) {
      setError(useBackupCode ? 'Enter a backup code.' : 'Please enter the full 6-digit code.')
      return
    }
    setVerifying(true)
    try {
      const { data } = await api.post('/auth/2fa/verify-login', { pendingToken, code })
      finishLogin(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.')
      setDigits(Array(CODE_LENGTH).fill(''))
      inputsRef.current[0]?.focus()
    } finally {
      setVerifying(false)
    }
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
            <h1 className="auth-form-title">{pendingToken ? 'Two-Factor Verification' : 'Sign In'}</h1>
            <p className="auth-form-sub">
              {pendingToken
                ? (useBackupCode
                    ? 'Enter one of your backup codes.'
                    : 'Enter the 6-digit code from your authenticator app.')
                : <>Don't have an account?{' '}
                    <Link to="/signup" className="auth-inline-link">Create one free</Link>
                  </>
              }
            </p>
          </div>

          {error && (
            <div className="auth-error">
              <i className="bi bi-exclamation-circle me-2"></i>{error}
            </div>
          )}

          {pendingToken ? (
            <>
              <form onSubmit={handleVerify2FA} noValidate>
                {useBackupCode ? (
                  <div className="auth-field">
                    <label className="auth-label" htmlFor="backupCode">Backup Code</label>
                    <div className="auth-input-wrap">
                      <i className="bi bi-key auth-input-icon"></i>
                      <input id="backupCode" type="text" className="auth-input"
                        placeholder="XXXX-XXXX" value={backupCode}
                        onChange={e => setBackupCode(e.target.value)}
                        autoComplete="one-time-code" autoCapitalize="characters" required />
                    </div>
                  </div>
                ) : (
                  <div className="auth-field">
                    <label className="auth-label">Verification Code</label>
                    <div className="otp-input-group">
                      {digits.map((d, i) => (
                        <input
                          key={i}
                          ref={el => (inputsRef.current[i] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={CODE_LENGTH}
                          className={`otp-box${error ? ' otp-box-error' : ''}`}
                          value={d}
                          onChange={handleCodeChange(i)}
                          onKeyDown={handleCodeKeyDown(i)}
                          autoComplete={i === 0 ? 'one-time-code' : 'off'}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <button type="submit" className="auth-submit-btn" disabled={verifying} style={{ marginTop: '1.5rem' }}>
                  {verifying
                    ? <><span className="auth-spinner"></span>Verifying...</>
                    : <>Verify <i className="bi bi-arrow-right ms-2"></i></>
                  }
                </button>
              </form>

              <p className="auth-bottom-note mt-4">
                <button type="button" className="auth-inline-link" style={{ background: 'none', border: 'none', padding: 0 }}
                  onClick={() => { setUseBackupCode(p => !p); setError(''); setDigits(Array(CODE_LENGTH).fill('')); setBackupCode('') }}>
                  {useBackupCode ? 'Use your authenticator app instead' : "Can't access your authenticator? Use a backup code"}
                </button>
                <br />
                <button type="button" className="auth-inline-link" style={{ background: 'none', border: 'none', padding: 0, marginTop: '0.5rem' }}
                  onClick={() => { setPendingToken(''); setError(''); setDigits(Array(CODE_LENGTH).fill('')); setBackupCode('') }}>
                  Back to sign in
                </button>
              </p>
            </>
          ) : (
          <>
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
          </>
          )}

        </div>
      </div>

    </div>
  )
}
