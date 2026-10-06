import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import '../styles/cyber.css'
import './Auth.css'
import logoWhts from '../assets/media/logo-whts.jpg'

export default function ForgotPassword() {
  const [email,     setEmail]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error,     setError]     = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) { setError('Please enter your email.'); return }
    setLoading(true); setError('')
    try {
      await api.post('/auth/forgot-password', { email })
      setSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-split">
      <div className="auth-panel-left">
        <div className="cyber-grid" aria-hidden="true" />
        <div className="auth-panel-left-inner">
          <Link to="/" className="auth-panel-logo"><img src={logoWhts} alt="WHTSIPA" /></Link>
          <div className="auth-panel-headline">
            <h2>Reset your</h2>
            <span className="auth-panel-accent">Password.</span>
            <p>Enter the email linked to your account and we'll send a reset link instantly.</p>
          </div>
        </div>
      </div>

      <div className="auth-panel-right">
        <div className="auth-form-wrap">
          {submitted ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
              <h2 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Check your inbox</h2>
              <p style={{ color: '#4a5568', lineHeight: 1.75, marginBottom: '1.5rem' }}>
                If <strong>{email}</strong> is registered, a password reset link has been sent. Check your spam folder if needed.
              </p>
              <Link to="/signin" className="auth-inline-link">Back to Sign In</Link>
            </div>
          ) : (
            <>
              <div className="auth-form-header">
                <h1 className="auth-form-title">Forgot Password</h1>
                <p className="auth-form-sub">
                  Remembered it? <Link to="/signin" className="auth-inline-link">Sign in</Link>
                </p>
              </div>
              {error && <div className="auth-error"><i className="bi bi-exclamation-circle me-2"></i>{error}</div>}
              <form onSubmit={handleSubmit} noValidate>
                <div className="auth-field">
                  <label className="auth-label" htmlFor="fp-email">Email Address</label>
                  <div className="auth-input-wrap">
                    <i className="bi bi-envelope auth-input-icon"></i>
                    <input id="fp-email" type="email" className="auth-input"
                      placeholder="you@example.com" value={email}
                      onChange={e => setEmail(e.target.value)} required />
                  </div>
                </div>
                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? <><span className="auth-spinner"></span>Sending…</> : <>Send Reset Link <i className="bi bi-arrow-right ms-2"></i></>}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}