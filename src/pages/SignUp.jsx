import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/cyber.css'
import './Auth.css'
import { useAuth } from '../context/AuthContext'
import logoWhts from '../assets/media/logo-whts.jpg'

const COUNTRIES = [
  'United States','United Kingdom','Nigeria','Canada','Australia',
  'Germany','France','India','South Africa','Ghana','Kenya',
  'Brazil','Mexico','UAE','Singapore','Other'
]

export default function SignUp() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({
    firstName:'', lastName:'', email:'',
    country:'', password:'', confirmPassword:''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  const getStrength = (pw) => {
    if (!pw) return { score: 0, label: '', color: '' }
    let score = 0
    if (pw.length >= 8)          score++
    if (/[A-Z]/.test(pw))        score++
    if (/[0-9]/.test(pw))        score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    const map = [
      { label: '',       color: '' },
      { label: 'Weak',   color: 'var(--red)' },
      { label: 'Fair',   color: 'var(--yellow)' },
      { label: 'Good',   color: 'var(--cyan)' },
      { label: 'Strong', color: 'var(--green)' },
    ]
    return { score, ...map[score] }
  }

  const strength = getStrength(form.password)

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')
        if (Object.values(form).some(v => !v)) { setError('Please fill in all fields.'); return }
        if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }
        if (strength.score < 2) { setError('Please use a stronger password.'); return }
        setLoading(true)
        // ── Replace setTimeout with actual API call later ──
        setTimeout(() => {
            register({ email: form.email, name: `${form.firstName} ${form.lastName}`, country: form.country })
            setLoading(false)
            navigate('/')
        }, 1200)
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
            <h2>Join the network,</h2>
            <span className="auth-panel-accent">Stay protected.</span>
            <p>
              Create your free WHTS account to report incidents, access
              our full threat library, and get guided recovery support.
            </p>
          </div>

          <div className="auth-panel-stats">
            <div className="auth-stat-item">
              <div className="auth-stat-value">Free</div>
              <div className="auth-stat-label">Always free</div>
            </div>
            <div className="auth-stat-item">
              <div className="auth-stat-value">850+</div>
              <div className="auth-stat-label">Reports handled</div>
            </div>
            <div className="auth-stat-item">
              <div className="auth-stat-value">97%</div>
              <div className="auth-stat-label">Recovery rate</div>
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
            <h1 className="auth-form-title">Create Account</h1>
            <p className="auth-form-sub">
              Already have an account?{' '}
              <Link to="/signin" className="auth-inline-link">Sign in</Link>
            </p>
          </div>

          {error && (
            <div className="auth-error">
              <i className="bi bi-exclamation-circle me-2"></i>{error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">

              <div className="col-6">
                <div className="auth-field mb-0">
                  <label className="auth-label" htmlFor="firstName">First Name</label>
                  <div className="auth-input-wrap">
                    <i className="bi bi-person auth-input-icon"></i>
                    <input id="firstName" type="text" className="auth-input"
                      placeholder="First name" value={form.firstName}
                      onChange={set('firstName')} required />
                  </div>
                </div>
              </div>

              <div className="col-6">
                <div className="auth-field mb-0">
                  <label className="auth-label" htmlFor="lastName">Last Name</label>
                  <div className="auth-input-wrap">
                    <i className="bi bi-person auth-input-icon"></i>
                    <input id="lastName" type="text" className="auth-input"
                      placeholder="Last name" value={form.lastName}
                      onChange={set('lastName')} required />
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="auth-field mb-0">
                  <label className="auth-label" htmlFor="su-email">Email Address</label>
                  <div className="auth-input-wrap">
                    <i className="bi bi-envelope auth-input-icon"></i>
                    <input id="su-email" type="email" className="auth-input"
                      placeholder="you@example.com" value={form.email}
                      onChange={set('email')} autoComplete="email" required />
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="auth-field mb-0">
                  <label className="auth-label" htmlFor="country">Country</label>
                  <div className="auth-input-wrap">
                    <i className="bi bi-globe auth-input-icon"></i>
                    <select id="country" className="auth-input auth-select"
                      value={form.country} onChange={set('country')} required>
                      <option value="">Select your country</option>
                      {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="auth-field mb-0">
                  <label className="auth-label" htmlFor="su-password">Password</label>
                  <div className="auth-input-wrap">
                    <i className="bi bi-lock auth-input-icon"></i>
                    <input id="su-password" type={showPassword ? 'text' : 'password'}
                      className="auth-input" placeholder="Create a strong password"
                      value={form.password} onChange={set('password')}
                      autoComplete="new-password" required />
                    <button type="button" className="auth-eye-btn"
                      onClick={() => setShowPassword(p => !p)}
                      aria-label="Toggle password">
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                  {form.password && (
                    <div className="strength-wrap">
                      <div className="strength-bar">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="strength-segment"
                            style={{ background: i <= strength.score ? strength.color : 'rgba(255,255,255,0.08)' }} />
                        ))}
                      </div>
                      <span className="strength-label" style={{ color: strength.color }}>{strength.label}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-12">
                <div className="auth-field mb-0">
                  <label className="auth-label" htmlFor="confirmPassword">Confirm Password</label>
                  <div className="auth-input-wrap">
                    <i className="bi bi-lock-fill auth-input-icon"></i>
                    <input id="confirmPassword" type={showConfirm ? 'text' : 'password'}
                      className="auth-input" placeholder="Repeat your password"
                      value={form.confirmPassword} onChange={set('confirmPassword')}
                      autoComplete="new-password" required />
                    <button type="button" className="auth-eye-btn"
                      onClick={() => setShowConfirm(p => !p)}
                      aria-label="Toggle password">
                      <i className={`bi ${showConfirm ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                  {form.confirmPassword && (
                    <div className="match-indicator">
                      {form.password === form.confirmPassword
                        ? <><i className="bi bi-check-circle-fill me-1" style={{color:'var(--green)'}}></i><span style={{color:'var(--green)'}}>Passwords match</span></>
                        : <><i className="bi bi-x-circle-fill me-1" style={{color:'var(--red)'}}></i><span style={{color:'var(--red)'}}>Passwords do not match</span></>
                      }
                    </div>
                  )}
                </div>
              </div>

            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading} style={{marginTop:'1.5rem'}}>
              {loading
                ? <><span className="auth-spinner"></span>Creating account...</>
                : <>Create Account <i className="bi bi-arrow-right ms-2"></i></>
              }
            </button>

          </form>

          <p className="auth-bottom-note mt-4">
            By creating an account you agree to our{' '}
            <span className="auth-link">Terms of Use</span> and{' '}
            <span className="auth-link">Privacy Policy</span>.
          </p>

        </div>
      </div>

    </div>
  )
}
