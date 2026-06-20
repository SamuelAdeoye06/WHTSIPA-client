import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/cyber.css'
import './Auth.css'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import logoWhts from '../assets/media/logo-whts.jpg'

/* ── Allowed countries (client spec) ── */
const ALLOWED_COUNTRIES = [
  { code: 'US', name: 'United States',          dial: '+1'   },
  { code: 'CA', name: 'Canada',                 dial: '+1'   },
  { code: 'GB', name: 'United Kingdom',         dial: '+44'  },
  { code: 'AU', name: 'Australia',              dial: '+61'  },
  { code: 'NZ', name: 'New Zealand',            dial: '+64'  },
  { code: 'DE', name: 'Germany',                dial: '+49'  },
  { code: 'FR', name: 'France',                 dial: '+33'  },
  { code: 'NL', name: 'Netherlands',            dial: '+31'  },
  { code: 'SE', name: 'Sweden',                 dial: '+46'  },
  { code: 'NO', name: 'Norway',                 dial: '+47'  },
  { code: 'DK', name: 'Denmark',                dial: '+45'  },
  { code: 'FI', name: 'Finland',                dial: '+358' },
  { code: 'CH', name: 'Switzerland',            dial: '+41'  },
  { code: 'SG', name: 'Singapore',              dial: '+65'  },
  { code: 'JP', name: 'Japan',                  dial: '+81'  },
  { code: 'KR', name: 'South Korea',            dial: '+82'  },
  { code: 'AE', name: 'United Arab Emirates',   dial: '+971' },
  { code: 'QA', name: 'Qatar',                  dial: '+974' },
  { code: 'IL', name: 'Israel',                 dial: '+972' },
  { code: 'AT', name: 'Austria',                dial: '+43'  },
  { code: 'BE', name: 'Belgium',                dial: '+32'  },
  { code: 'IT', name: 'Italy',                  dial: '+39'  },
  { code: 'ES', name: 'Spain',                  dial: '+34'  },
  { code: 'PL', name: 'Poland',                 dial: '+48'  },
  { code: 'PT', name: 'Portugal',               dial: '+351' },
  { code: 'IE', name: 'Ireland',                dial: '+353' },
  { code: 'GR', name: 'Greece',                 dial: '+30'  },
  { code: 'CZ', name: 'Czechia',               dial: '+420' },
  // DEV ONLY — remove before final delivery to client
  { code: 'NG', name: 'Nigeria (Dev)',          dial: '+234' },
]

/* ── Blocked country codes ── */
const BLOCKED_CODES = new Set([
  'CM','CI','TZ','UG','DZ','SN','MA','ZM','RW','GH','ZA','KE'
])

/* ── IP → country detection ── */
async function detectCountry() {
  try {
    const r = await fetch('https://ipapi.co/json/')
    const d = await r.json()
    return d.country_code || null
  } catch { return null }
}

export default function SignUp() {
  const navigate  = useNavigate()
  const { register } = useAuth()

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    country: '', phone: '', password: '', confirmPassword: ''
  })
  const [countrySearch, setCountrySearch]   = useState('')
  const [showDropdown,  setShowDropdown]    = useState(false)
  const [showPassword,  setShowPassword]    = useState(false)
  const [showConfirm,   setShowConfirm]     = useState(false)
  const [errors,        setErrors]          = useState({})
  const [submitError,   setSubmitError]     = useState('')
  const [loading,       setLoading]         = useState(false)
  const [blocked,       setBlocked]         = useState(false)
  const [submitted,     setSubmitted]        = useState(false)
  const dropdownRef = useRef(null)

  /* ── Auto-detect country on mount ── */
  useEffect(() => {
    detectCountry().then(code => {
      if (!code) return
      if (BLOCKED_CODES.has(code)) { setBlocked(true); return }
      const match = ALLOWED_COUNTRIES.find(c => c.code === code)
      if (match) setForm(p => ({ ...p, country: match.code }))
    })
  }, [])

  /* ── Close dropdown on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setShowDropdown(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const set = (key) => (e) => {
    setForm(p => ({ ...p, [key]: e.target.value }))
    setErrors(p => ({ ...p, [key]: '' }))
  }

  /* ── Selected country object ── */
  const selectedCountry = ALLOWED_COUNTRIES.find(c => c.code === form.country)

  /* ── Filtered country list ── */
  const filteredCountries = ALLOWED_COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  )

  /* ── Password strength ── */
  const getStrength = (pw) => {
    if (!pw) return { score: 0, label: '', color: '' }
    let score = 0
    if (pw.length >= 12)         score++
    if (/[A-Z]/.test(pw))        score++
    if (/[0-9]/.test(pw))        score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    const map = [
      { label: '',        color: '' },
      { label: 'Weak',    color: 'var(--red)' },
      { label: 'Fair',    color: 'var(--yellow)' },
      { label: 'Good',    color: 'var(--cyan)' },
      { label: 'Strong',  color: 'var(--green)' },
    ]
    return { score, ...map[score] }
  }
  const strength = getStrength(form.password)

  /* ── Real-time field validation ── */
  const validateField = (key, value) => {
    switch (key) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) return 'This field is required.'
        if (!/^[A-Za-z\s'-]+$/.test(value)) return 'Letters only — no numbers or special characters.'
        return ''
      case 'email':
        if (!value.trim()) return 'Email is required.'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address.'
        return ''
      case 'country':
        if (!value) return 'Please select your country.'
        return ''
      case 'phone':
        if (!value.trim()) return 'Phone number is required.'
        if (!/^\+?[\d\s\-().]{7,20}$/.test(value)) return 'Enter a valid phone number.'
        return ''
      case 'password':
        if (!value) return 'Password is required.'
        if (value.length < 12) return 'Minimum 12 characters.'
        if (!/[A-Z]/.test(value)) return 'Add at least 1 uppercase letter.'
        if (!/[0-9]/.test(value)) return 'Add at least 1 number.'
        if (!/[^A-Za-z0-9]/.test(value)) return 'Add at least 1 special character.'
        return ''
      case 'confirmPassword':
        if (!value) return 'Please confirm your password.'
        if (value !== form.password) return 'Passwords do not match.'
        return ''
      default: return ''
    }
  }

  const handleBlur = (key) => () => {
    const err = validateField(key, form[key])
    setErrors(p => ({ ...p, [key]: err }))
  }

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    const newErrors = {}
    Object.keys(form).forEach(key => {
      const err = validateField(key, form[key])
      if (err) newErrors[key] = err
    })
    if (Object.keys(newErrors).length) { setErrors(newErrors); return }
    if (strength.score < 2) { setSubmitError('Please use a stronger password.'); return }

    setLoading(true)
    try {
      await api.post('/auth/register', {
        firstName: form.firstName,
        lastName:  form.lastName,
        email:     form.email,
        country:   form.country,
        phone:     form.phone,
        password:  form.password,
      })
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  /* ── Blocked country screen ── */
  if (blocked) {
    return (
      <div style={{ minHeight: '100vh', background: '#050913', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: 420, textAlign: 'center', color: '#f0f4ff' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚫</div>
          <h2 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Service Unavailable</h2>
          <p style={{ color: 'rgba(233,243,255,0.6)', lineHeight: 1.7 }}>
            WHTS is not currently available in your region. If you believe this is an error,
            please <Link to="/contact" style={{ color: 'var(--cyan)' }}>contact us</Link>.
          </p>
        </div>
      </div>
    )
  }

  // Email confirmation sent screen
  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: 460, textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📧</div>
          <h2 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Check your email</h2>
          <p style={{ color: '#4a5568', lineHeight: 1.75, marginBottom: '1.5rem' }}>
            We've sent a confirmation link to <strong>{form.email}</strong>.
            Click the link in that email to activate your account, then you can sign in.
          </p>
          <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Didn't receive it? Check your spam folder. The link expires in 24 hours.
          </p>
          <Link to="/signin" className="auth-submit-btn" style={{ textDecoration: 'none', display: 'inline-flex', width: 'auto', padding: '0.75rem 2rem' }}>
            Go to Sign In <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>
      </div>
    )
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
            <p>Create your free WHTS account to report incidents, access our full threat library, and get guided recovery support.</p>
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

          {submitError && (
            <div className="auth-error">
              <i className="bi bi-exclamation-circle me-2"></i>{submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">

              {/* First Name */}
              <div className="col-6">
                <div className="auth-field mb-0">
                  <label className="auth-label" htmlFor="firstName">First Name</label>
                  <div className="auth-input-wrap">
                    <i className="bi bi-person auth-input-icon"></i>
                    <input id="firstName" type="text" className={`auth-input${errors.firstName ? ' auth-input-error' : ''}`}
                      placeholder="First name" value={form.firstName}
                      onChange={set('firstName')} onBlur={handleBlur('firstName')} required />
                  </div>
                  {errors.firstName && <div className="auth-field-error">{errors.firstName}</div>}
                </div>
              </div>

              {/* Last Name */}
              <div className="col-6">
                <div className="auth-field mb-0">
                  <label className="auth-label" htmlFor="lastName">Last Name</label>
                  <div className="auth-input-wrap">
                    <i className="bi bi-person auth-input-icon"></i>
                    <input id="lastName" type="text" className={`auth-input${errors.lastName ? ' auth-input-error' : ''}`}
                      placeholder="Last name" value={form.lastName}
                      onChange={set('lastName')} onBlur={handleBlur('lastName')} required />
                  </div>
                  {errors.lastName && <div className="auth-field-error">{errors.lastName}</div>}
                </div>
              </div>

              {/* Email */}
              <div className="col-12">
                <div className="auth-field mb-0">
                  <label className="auth-label" htmlFor="su-email">Email Address</label>
                  <div className="auth-input-wrap">
                    <i className="bi bi-envelope auth-input-icon"></i>
                    <input id="su-email" type="email" className={`auth-input${errors.email ? ' auth-input-error' : ''}`}
                      placeholder="you@example.com" value={form.email}
                      onChange={set('email')} onBlur={handleBlur('email')}
                      autoComplete="email" required />
                  </div>
                  {errors.email && <div className="auth-field-error">{errors.email}</div>}
                </div>
              </div>

              {/* Country — searchable custom dropdown */}
              <div className="col-12">
                <div className="auth-field mb-0">
                  <label className="auth-label" htmlFor="country-btn">Country</label>
                  <div className="auth-country-wrap" ref={dropdownRef}>
                    <button
                      type="button"
                      id="country-btn"
                      className={`auth-input auth-country-btn${errors.country ? ' auth-input-error' : ''}`}
                      onClick={() => setShowDropdown(p => !p)}
                    >
                      <i className="bi bi-globe auth-input-icon"></i>
                      <span className="auth-country-label">
                        {selectedCountry ? selectedCountry.name : 'Select your country'}
                      </span>
                      <i className={`bi bi-chevron-${showDropdown ? 'up' : 'down'} auth-country-chevron`}></i>
                    </button>
                    {showDropdown && (
                      <div className="auth-country-dropdown">
                        <div className="auth-country-search-wrap">
                          <i className="bi bi-search auth-country-search-icon"></i>
                          <input
                            className="auth-country-search"
                            placeholder="Search country…"
                            value={countrySearch}
                            onChange={e => setCountrySearch(e.target.value)}
                            autoFocus
                          />
                        </div>
                        <ul className="auth-country-list">
                          {filteredCountries.length === 0 && (
                            <li className="auth-country-empty">No countries found</li>
                          )}
                          {filteredCountries.map(c => (
                            <li key={c.code}>
                              <button
                                type="button"
                                className={`auth-country-option${form.country === c.code ? ' selected' : ''}`}
                                onClick={() => {
                                  setForm(p => ({ ...p, country: c.code,
                                    phone: p.phone.startsWith('+') ? c.dial + p.phone.replace(/^\+\d+/, '') : c.dial + ' '
                                  }))
                                  setErrors(p => ({ ...p, country: '' }))
                                  setShowDropdown(false)
                                  setCountrySearch('')
                                }}
                              >
                                <span className="auth-country-name">{c.name}</span>
                                <span className="auth-country-dial">{c.dial}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  {errors.country && <div className="auth-field-error">{errors.country}</div>}
                </div>
              </div>

              {/* Phone */}
              <div className="col-12">
                <div className="auth-field mb-0">
                  <label className="auth-label" htmlFor="phone">Phone Number</label>
                  <div className="auth-input-wrap">
                    <i className="bi bi-telephone auth-input-icon"></i>
                    <input id="phone" type="tel" className={`auth-input${errors.phone ? ' auth-input-error' : ''}`}
                      placeholder={selectedCountry ? `${selectedCountry.dial} ...` : '+1 ...'}
                      value={form.phone}
                      onChange={set('phone')} onBlur={handleBlur('phone')} />
                  </div>
                  {errors.phone && <div className="auth-field-error">{errors.phone}</div>}
                </div>
              </div>

              {/* Password */}
              <div className="col-12">
                <div className="auth-field mb-0">
                  <label className="auth-label" htmlFor="su-password">Password</label>
                  <div className="auth-input-wrap">
                    <i className="bi bi-lock auth-input-icon"></i>
                    <input id="su-password" type={showPassword ? 'text' : 'password'}
                      className={`auth-input${errors.password ? ' auth-input-error' : ''}`}
                      placeholder="Min. 12 chars, uppercase, number, symbol"
                      value={form.password} onChange={set('password')}
                      onBlur={handleBlur('password')} autoComplete="new-password" required />
                    <button type="button" className="auth-eye-btn"
                      onClick={() => setShowPassword(p => !p)} aria-label="Toggle password">
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                  {form.password && (
                    <div className="strength-wrap">
                      <div className="strength-bar">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="strength-segment"
                            style={{ background: i <= strength.score ? strength.color : 'rgba(0,0,0,0.08)' }} />
                        ))}
                      </div>
                      <span className="strength-label" style={{ color: strength.color }}>{strength.label}</span>
                    </div>
                  )}
                  {errors.password && <div className="auth-field-error">{errors.password}</div>}
                </div>
              </div>

              {/* Confirm Password */}
              <div className="col-12">
                <div className="auth-field mb-0">
                  <label className="auth-label" htmlFor="confirmPassword">Confirm Password</label>
                  <div className="auth-input-wrap">
                    <i className="bi bi-lock-fill auth-input-icon"></i>
                    <input id="confirmPassword" type={showConfirm ? 'text' : 'password'}
                      className={`auth-input${errors.confirmPassword ? ' auth-input-error' : ''}`}
                      placeholder="Repeat your password"
                      value={form.confirmPassword} onChange={set('confirmPassword')}
                      onBlur={handleBlur('confirmPassword')} autoComplete="new-password" required />
                    <button type="button" className="auth-eye-btn"
                      onClick={() => setShowConfirm(p => !p)} aria-label="Toggle confirm password">
                      <i className={`bi ${showConfirm ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                  {form.confirmPassword && !errors.confirmPassword && (
                    <div className="match-indicator">
                      {form.password === form.confirmPassword
                        ? <><i className="bi bi-check-circle-fill me-1" style={{color:'var(--green)'}}></i><span style={{color:'var(--green)'}}>Passwords match</span></>
                        : <><i className="bi bi-x-circle-fill me-1" style={{color:'var(--red)'}}></i><span style={{color:'var(--red)'}}>Passwords do not match</span></>
                      }
                    </div>
                  )}
                  {errors.confirmPassword && <div className="auth-field-error">{errors.confirmPassword}</div>}
                </div>
              </div>

            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading} style={{ marginTop: '1.5rem' }}>
              {loading
                ? <><span className="auth-spinner"></span>Creating account…</>
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