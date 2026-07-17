import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import '../styles/cyber.css'
import './Auth.css'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import logoWhts from '../assets/media/logo-whts.jpg'

const OTP_LENGTH = 6
const RESEND_COOLDOWN = 60 // seconds — mirrors the server-side cooldown

export default function VerifyOtp() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const email = location.state?.email || ''

  const [digits, setDigits]       = useState(Array(OTP_LENGTH).fill(''))
  const [error, setError]         = useState('')
  const [notice, setNotice]       = useState('')
  const [loading, setLoading]     = useState(false)
  const [resending, setResending] = useState(false)
  const [cooldown, setCooldown]   = useState(RESEND_COOLDOWN)
  const inputsRef = useRef([])

  // No email in state means someone landed here directly — send them back to sign up.
  useEffect(() => {
    if (!email) navigate('/signup', { replace: true })
  }, [email, navigate])

  // Focus the first box on mount
  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])

  // Resend cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const otpValue = digits.join('')

  const handleChange = (i) => (e) => {
    const val = e.target.value.replace(/\D/g, '')
    if (!val) {
      setDigits(p => { const next = [...p]; next[i] = ''; return next })
      return
    }
    // Handle paste of the full code into a single box
    if (val.length > 1) {
      const chars = val.slice(0, OTP_LENGTH).split('')
      setDigits(p => {
        const next = [...p]
        chars.forEach((c, idx) => { if (i + idx < OTP_LENGTH) next[i + idx] = c })
        return next
      })
      const nextIndex = Math.min(i + chars.length, OTP_LENGTH - 1)
      inputsRef.current[nextIndex]?.focus()
      return
    }
    setDigits(p => { const next = [...p]; next[i] = val; return next })
    if (i < OTP_LENGTH - 1) inputsRef.current[i + 1]?.focus()
  }

  const handleKeyDown = (i) => (e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputsRef.current[i - 1]?.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setNotice('')
    if (otpValue.length !== OTP_LENGTH) {
      setError('Please enter the full 6-digit code.')
      return
    }
    setLoading(true)
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp: otpValue })
      login({ ...data.user, token: data.token })
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.')
      setDigits(Array(OTP_LENGTH).fill(''))
      inputsRef.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (cooldown > 0 || resending) return
    setError('')
    setNotice('')
    setResending(true)
    try {
      const { data } = await api.post('/auth/resend-otp', { email })
      setNotice(data.message || 'A new code has been sent.')
      setDigits(Array(OTP_LENGTH).fill(''))
      inputsRef.current[0]?.focus()
      setCooldown(RESEND_COOLDOWN)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not resend code. Please try again.')
      if (err.response?.data?.secondsLeft) setCooldown(err.response.data.secondsLeft)
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="auth-split">

      {/* ── LEFT — Brand panel ── */}
      <div className="auth-panel-left">
        <div className="cyber-grid" aria-hidden="true" />
        <div className="auth-panel-left-inner">
          <Link to="/" className="auth-panel-logo">
            <img src={logoWhts} alt="WHTS" />
          </Link>
          <div className="auth-panel-headline">
            <h2>Almost there,</h2>
            <span className="auth-panel-accent">Verify your email.</span>
            <p>One quick step keeps your account secure and confirms it's really you before we activate it.</p>
          </div>
          <div className="auth-panel-stats">
            <div className="auth-stat-item">
              <div className="auth-stat-value">6</div>
              <div className="auth-stat-label">Digit code</div>
            </div>
            <div className="auth-stat-item">
              <div className="auth-stat-value">10min</div>
              <div className="auth-stat-label">Code validity</div>
            </div>
            <div className="auth-stat-item">
              <div className="auth-stat-value">Secure</div>
              <div className="auth-stat-label">By design</div>
            </div>
          </div>
          <div className="auth-panel-quote">
            <span>"Don't Get Caught — report it before they strike again."</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT — Form panel ── */}
      <div className="auth-panel-right">
        <div className="auth-form-wrap">

          <div className="auth-form-header">
            <h1 className="auth-form-title">Verify Your Email</h1>
            <p className="auth-form-sub">
              We sent a 6-digit code to <strong>{email}</strong>
            </p>
          </div>

          {error && (
            <div className="auth-error">
              <i className="bi bi-exclamation-circle me-2"></i>{error}
            </div>
          )}
          {notice && !error && (
            <div className="auth-success">
              <i className="bi bi-check-circle me-2"></i>{notice}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label className="auth-label">Verification Code</label>
              <div className="otp-input-group">
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={el => (inputsRef.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={OTP_LENGTH}
                    className={`otp-box${error ? ' otp-box-error' : ''}`}
                    value={d}
                    onChange={handleChange(i)}
                    onKeyDown={handleKeyDown(i)}
                    autoComplete={i === 0 ? 'one-time-code' : 'off'}
                  />
                ))}
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading} style={{ marginTop: '1.5rem' }}>
              {loading
                ? <><span className="auth-spinner"></span>Verifying…</>
                : <>Verify Email <i className="bi bi-arrow-right ms-2"></i></>
              }
            </button>
          </form>

          <div className="otp-resend-row">
            <span>Didn't get the code?</span>
            <button
              type="button"
              className="otp-resend-btn"
              onClick={handleResend}
              disabled={cooldown > 0 || resending}
            >
              {resending ? 'Sending…' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
            </button>
          </div>

          <p className="auth-bottom-note mt-4">
            Wrong email?{' '}
            <Link to="/signup" className="auth-inline-link">Sign up again</Link>
          </p>

        </div>
      </div>

    </div>
  )
}
