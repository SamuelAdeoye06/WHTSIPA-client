import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import '../styles/cyber.css'
import './Auth.css'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import logoWhts from '../assets/media/logo-whts.jpg'
import { getCountryFlag } from '../utils/countryUtils'
import { useCountries } from '../context/CountriesContext'
import CountrySelectField from '../components/CountrySelectField'


const getFriendlyCode = (code) => {
  const mapping = {
    US: 'USA', CA: 'CAN', GB: 'UK', AU: 'AUS', NZ: 'NZL',
    DE: 'GER', FR: 'FRA', NL: 'NLD', SE: 'SWE', NO: 'NOR',
    DK: 'DNK', FI: 'FIN', CH: 'CHE', SG: 'SGP', JP: 'JPN',
    KR: 'KOR', AE: 'UAE', QA: 'QAT', IL: 'ISR', AT: 'AUT',
    BE: 'BEL', IT: 'ITA', ES: 'ESP', PL: 'POL', PT: 'PRT',
    IE: 'IRL', GR: 'GRC', CZ: 'CZE', NG: 'NGA'
  }
  return mapping[code] || code.toUpperCase()
}

/* ── IP → country detection (same strategy as Report page) ── */
async function detectCountry() {
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  try {
    const r = await fetch(`${API_BASE}/geo`, { signal: AbortSignal.timeout(5000) })
    const d = await r.json()
    if (d.country_code && d.country_code.length === 2) return d.country_code
  } catch { /* fall through */ }
  try {
    const r = await fetch('https://api.country.is/', { signal: AbortSignal.timeout(4000) })
    const d = await r.json()
    if (d.country && d.country.length === 2) return d.country
  } catch { /* fall through */ }
  try {
    const r = await fetch('https://ipwho.is/', { signal: AbortSignal.timeout(4000) })
    const d = await r.json()
    if (d.success && d.country_code) return d.country_code
  } catch { /* fall through */ }
  return null
}


/* ── SignUp Phone Field with Country Dropdown & Editable Dial Code ── */
function SignUpPhoneField({ form, setForm, errors, setErrors, handleBlur }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef(null)
  const { signupCountries, matchCountrySearch } = useCountries()

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selectedCode = form.phoneCountryCode || form.country || 'US'
  const selectedCountry = signupCountries.find(c => c.code === selectedCode) || signupCountries[0]

  const fullDial = form.phoneDialCode || selectedCountry?.dial || '+1'

  const handleDigitsChange = (e) => {
    const digits = e.target.value
    setForm(p => ({
      ...p,
      phoneDigits: digits,
      phone: `${p.phoneDialCode || '+1'} ${digits}`
    }))
    setErrors(p => ({ ...p, phone: '' }))
  }

  const filteredCountries = signupCountries.filter(c => matchCountrySearch(c, search))

  return (
    <div className="phone-country-field-wrap mb-0">
      <label className="auth-label" htmlFor="phone">
        Phone Number <span className="text-danger">*</span>
      </label>
      <div className="input-group phone-field-group" ref={dropdownRef}>
        {/* Country selector button */}
        <button
          type="button"
          className={`btn phone-country-btn ${showDropdown ? 'is-active' : ''}`}
          onClick={() => setShowDropdown(prev => !prev)}
          title="Select country code"
        >
          <span className="country-flag-emoji">{getCountryFlag(selectedCountry.code)}</span>
          <i className={`bi bi-caret-${showDropdown ? 'up' : 'down'}-fill country-arrow-icon`}></i>
        </button>

        {/* Autofilled dial prefix — non-editable badge */}
        <div className="phone-plus-prefix input-group-text" title={`Country code: ${fullDial}`}>
          <span>{fullDial}</span>
        </div>

        {/* Phone number digits */}
        <input
          id="phone"
          name="phoneDigits"
          type="tel"
          className={`form-control cyber-input ${errors.phone ? 'is-invalid' : ''}`}
          placeholder="Phone number digits"
          value={form.phoneDigits || ''}
          onChange={handleDigitsChange}
          onBlur={handleBlur('phone')}
        />

        {/* Country dropdown list */}
        {showDropdown && (
          <div className="phone-country-dropdown-menu">
            <div className="custom-country-search-wrap">
              <i className="bi bi-search custom-country-search-icon"></i>
              <input
                type="text"
                className="form-control form-control-sm custom-country-search"
                placeholder="Search country or code (+234, NG)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
            <ul className="list-unstyled mb-0 custom-country-list">
              {filteredCountries.length === 0 ? (
                <li className="p-3 text-muted-cyber text-center" style={{ fontSize: '0.82rem' }}>
                  No country matches
                </li>
              ) : (
                filteredCountries.map(c => {
                  const isSelected = selectedCode === c.code
                  const cleanName = c.name.replace(' (Dev)', '')
                  return (
                    <li key={c.code}>
                      <button
                        type="button"
                        className={`phone-country-dropdown-item ${isSelected ? 'active' : ''}`}
                        onClick={() => {
                          setForm(p => ({
                            ...p,
                            phoneCountryCode: c.code,
                            phoneDialCode: c.dial,
                            country: c.code,
                            phone: `${c.dial} ${p.phoneDigits || ''}`
                          }))
                          setErrors(p => ({ ...p, country: '', phone: '' }))
                          setShowDropdown(false)
                          setSearch('')
                        }}
                      >
                        <span className="country-flag-emoji me-2">{getCountryFlag(c.code)}</span>
                        <span className="country-option-text">{cleanName} ({c.dial})</span>
                      </button>
                    </li>
                  )
                })
              )}
            </ul>
          </div>
        )}
      </div>


      {!isValidDial && dialDigits.length > 0 && (
        <div className="auth-field-error">
          <i className="bi bi-exclamation-circle me-1"></i>
          Country code +{dialDigits} is invalid or not in the allowed countries list.
        </div>
      )}

      {errors.phone && (
        <div className="auth-field-error">
          <i className="bi bi-exclamation-circle me-1"></i>{errors.phone}
        </div>
      )}
    </div>
  )
}

export default function SignUp() {

  const navigate  = useNavigate()
  const location  = useLocation()
  const { register } = useAuth()
  const { signupCountries } = useCountries()

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    country: '', phoneCountryCode: 'US', phoneDialCode: '+1', phoneDigits: '', phone: '',
    password: '', confirmPassword: ''
  })

  const [showPassword,  setShowPassword]    = useState(false)
  const [showConfirm,   setShowConfirm]     = useState(false)
  const [errors,        setErrors]          = useState({})
  const [submitError,   setSubmitError]     = useState('')
  const [loading,       setLoading]         = useState(false)
  const [blocked,       setBlocked]         = useState(false)

  /* ── Auto-detect country on mount ── */
  useEffect(() => {
    detectCountry().then(code => {
      if (!code) return
      // Check against admin-configured signup list
      const match = signupCountries.find(c => c.code === code)
      if (!match) { setBlocked(true); return }
      setForm(p => ({
        ...p,
        country: match.code,
        phoneCountryCode: match.code,
        phoneDialCode: match.dial
      }))
    })
  }, [signupCountries])

  const set = (key) => (e) => {
    setForm(p => ({ ...p, [key]: e.target.value }))
    setErrors(p => ({ ...p, [key]: '' }))
  }

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
        const phoneVal = (form.phoneDigits || form.phone).trim()
        if (!phoneVal) return 'Phone number is required.'
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
      const phoneVal = form.phoneDigits ? `${form.phoneDialCode || '+1'} ${form.phoneDigits}` : form.phone
      await api.post('/auth/register', {
        firstName: form.firstName,
        lastName:  form.lastName,
        email:     form.email,
        country:   form.country,
        phone:     phoneVal,
        password:  form.password,
      })

      navigate('/verify-otp', { state: { email: form.email, ...location.state } })
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

              {/* Country */}
              <div className="col-12">
                <CountrySelectField
                  id="country"
                  name="country"
                  label="Country"
                  isRequired={true}
                  value={form.country}
                  onChange={(code) => {
                    setForm(p => {
                      const match = signupCountries.find(c => c.code === code)
                      const dial = match ? match.dial : (p.phoneDialCode || '+1')
                      return {
                        ...p,
                        country: code,
                        phoneCountryCode: code,
                        phoneDialCode: dial,
                        phone: `${dial} ${p.phoneDigits || ''}`
                      }
                    })
                    setErrors(p => ({ ...p, country: '' }))
                  }}
                  onBlur={handleBlur('country')}
                  isInvalid={Boolean(errors.country)}
                  errorMsg={errors.country}
                />
              </div>

              {/* Phone Number with Country Dropdown & Editable Dial Code */}
              <div className="col-12">
                <SignUpPhoneField
                  form={form}
                  setForm={setForm}
                  errors={errors}
                  setErrors={setErrors}
                  handleBlur={handleBlur}
                />
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