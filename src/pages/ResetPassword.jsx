import { useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import '../styles/cyber.css'
import './Auth.css'
import logoWhts from '../assets/media/logo-whts.jpg'

export default function ResetPassword() {
  const [params]   = useSearchParams()
  const navigate   = useNavigate()
  const token      = params.get('token')
  const [form,     setForm]     = useState({ password: '', confirm: '' })
  const [show,     setShow]     = useState({ password: false, confirm: false })
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [done,     setDone]     = useState(false)

  const getStrength = (pw) => {
    if (!pw) return { score: 0, label: '', color: '' }
    let s = 0
    if (pw.length >= 12) s++
    if (/[A-Z]/.test(pw)) s++
    if (/[0-9]/.test(pw)) s++
    if (/[^A-Za-z0-9]/.test(pw)) s++
    const map = [
      { label: '', color: '' }, { label: 'Weak', color: 'var(--red)' },
      { label: 'Fair', color: 'var(--yellow)' }, { label: 'Good', color: 'var(--cyan)' },
      { label: 'Strong', color: 'var(--green)' },
    ]
    return { score: s, ...map[s] }
  }
  const strength = getStrength(form.password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!token) { setError('Invalid reset link.'); return }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (strength.score < 3) { setError('Please use a stronger password.'); return }
    setLoading(true)
    try {
      await api.post('/auth/reset-password', { token, password: form.password })
      setDone(true)
      setTimeout(() => navigate('/signin'), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. The link may have expired.')
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
            <h2>Create a new</h2>
            <span className="auth-panel-accent">Password.</span>
            <p>Choose something strong — at least 12 characters with uppercase, number, and symbol.</p>
          </div>
        </div>
      </div>

      <div className="auth-panel-right">
        <div className="auth-form-wrap">
          {done ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h2 style={{ fontWeight: 800, color: '#0f172a' }}>Password Reset!</h2>
              <p style={{ color: '#4a5568', marginTop: '0.5rem' }}>Redirecting you to sign in…</p>
            </div>
          ) : (
            <>
              <div className="auth-form-header">
                <h1 className="auth-form-title">Reset Password</h1>
              </div>
              {error && <div className="auth-error"><i className="bi bi-exclamation-circle me-2"></i>{error}</div>}
              <form onSubmit={handleSubmit} noValidate>
                <div className="auth-field">
                  <label className="auth-label">New Password</label>
                  <div className="auth-input-wrap">
                    <i className="bi bi-lock auth-input-icon"></i>
                    <input type={show.password ? 'text' : 'password'} className="auth-input"
                      placeholder="Min. 12 chars, uppercase, number, symbol"
                      value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
                    <button type="button" className="auth-eye-btn" onClick={() => setShow(p => ({ ...p, password: !p.password }))}>
                      <i className={`bi ${show.password ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                  {form.password && (
                    <div className="strength-wrap">
                      <div className="strength-bar">
                        {[1,2,3,4].map(i => <div key={i} className="strength-segment" style={{ background: i <= strength.score ? strength.color : 'rgba(0,0,0,0.08)' }} />)}
                      </div>
                      <span className="strength-label" style={{ color: strength.color }}>{strength.label}</span>
                    </div>
                  )}
                </div>
                <div className="auth-field">
                  <label className="auth-label">Confirm Password</label>
                  <div className="auth-input-wrap">
                    <i className="bi bi-lock-fill auth-input-icon"></i>
                    <input type={show.confirm ? 'text' : 'password'} className="auth-input"
                      placeholder="Repeat your password"
                      value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))} />
                    <button type="button" className="auth-eye-btn" onClick={() => setShow(p => ({ ...p, confirm: !p.confirm }))}>
                      <i className={`bi ${show.confirm ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                  {form.confirm && (
                    <div className="match-indicator">
                      {form.password === form.confirm
                        ? <><i className="bi bi-check-circle-fill me-1" style={{color:'var(--green)'}}></i><span style={{color:'var(--green)'}}>Passwords match</span></>
                        : <><i className="bi bi-x-circle-fill me-1" style={{color:'var(--red)'}}></i><span style={{color:'var(--red)'}}>Passwords do not match</span></>
                      }
                    </div>
                  )}
                </div>
                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? <><span className="auth-spinner"></span>Resetting…</> : <>Reset Password <i className="bi bi-arrow-right ms-2"></i></>}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}