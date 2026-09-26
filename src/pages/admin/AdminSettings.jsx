import { useState, useEffect } from 'react'
import api from '../../services/api'
import WorkerListEditor from './components/WorkerListEditor'
import ConfirmDialog from './components/ConfirmDialog'
import StyledSelect from '../../components/StyledSelect'
import { useToast } from '../../context/ToastContext'
import './AdminShared.css'

/* Grouped by page/context so it's obvious in the admin UI which part of
   the site each field actually affects. Fields here are simple single
   values (one per site) — the Threats/Contact worker lists below are
   handled separately since each can hold multiple entries. */
const LINK_GROUPS = [
  {
    heading: 'Navbar / Community Links',
    hint: 'Shown site-wide in the footer.',
    fields: [
      ['whatsappLink',          'WhatsApp Link',        'https://wa.me/...'],
      ['telegramCommunityLink', 'Telegram — Community',  'https://t.me/...'],
      ['facebookCommunityLink', 'Facebook Community',    'https://facebook.com/...'],
    ],
  },
  {
    heading: 'About Officials Page',
    hint: 'The "Find Us" Telegram link on the About Officials page.',
    fields: [
      ['findUsTelegramLink', 'Telegram — Find Us', 'https://t.me/...'],
    ],
  },
  {
    heading: 'Essential Eight Page',
    hint: 'The callback number shown on the Essential Eight page.',
    fields: [
      ['callbackNumber', 'Callback Number', 'e.g. +1 (650) 221-7654'],
    ],
  },
  {
    heading: 'Request Security Tools (Threats page)',
    hint: 'The Telegram link used in the "Request Security Tools" modal — the AI chat handoff and the "Join Telegram Support Channel" card.',
    fields: [
      ['toolsTelegramLink', 'Telegram — Tools Support', 'https://t.me/...'],
    ],
  },
  {
    heading: 'Scenario Active Representative Contact',
    hint: 'The "You Need Help" prompt on the Threats page quiz — shown after a visitor fails 3 scenarios, with a "Contact Active Representative" button.',
    fields: [
      ['scenarioActiveRepLink', 'Telegram — Active Representative', 'https://t.me/...'],
      // 4th element flags this field for colored styling in the admin panel
      // only (per client request) — has no effect on how it looks to
      // actual site visitors, who just see whatever plain-colored text
      // is typed in here on the public "Contact Active Representative" button.
      ['scenarioActiveRepText', 'Button Text / Username', 'e.g. @WHTS_SUPPORT', 'red'],
    ],
  },
  {
    heading: 'Need personalised recovery support (Threats Page)',
    fields: [
      ['recoveryWhatsappNumber', 'WhatsApp Number', 'digits only, e.g. 19293816441'],
      ['recoveryTelegramHandle', 'Telegram Handle', 'no @ or URL, e.g. WHTSIPA_DigitalTools'],
    ],
    // Heading-only highlight (not the fields) — green, per client request,
    // so it's easy to spot as "the place to change this" without recoloring
    // the inputs themselves.
    headingColor: '#16a34a',
  },
]

const HIGHLIGHT_COLORS = { red: '#dc2626', green: '#16a34a' }

const ALL_LINK_KEYS = LINK_GROUPS.flatMap(g => g.fields.map(([key]) => key))

export default function AdminSettings() {
  const { showToast } = useToast()
  const [config, setConfig]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [saveErr, setSaveErr] = useState('')

  const [pwForm, setPwForm]       = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwSaving, setPwSaving]   = useState(false)
  const [pwMsg, setPwMsg]         = useState('')
  const [pwErr, setPwErr]         = useState('')

  const [notifSaving, setNotifSaving] = useState(false)
  const [notifMsg, setNotifMsg]       = useState('')
  const [notifErr, setNotifErr]       = useState('')

  const [sessionSaving, setSessionSaving] = useState(false)
  const [sessionMsg, setSessionMsg]       = useState('')
  const [sessionErr, setSessionErr]       = useState('')
  const [loggingOutAll, setLoggingOutAll] = useState(false)
  const [logoutAllConfirmOpen, setLogoutAllConfirmOpen] = useState(false)

  // ── Two-factor auth ──
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(null) // null = still loading current status

  const [setupOpen, setSetupOpen]         = useState(false)
  const [setupStep, setSetupStep]         = useState('qr') // 'qr' | 'backup-codes'
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('')
  const [manualSecret, setManualSecret]   = useState('')
  const [setupCode, setSetupCode]         = useState('')
  const [setupErr, setSetupErr]           = useState('')
  const [setupSaving, setSetupSaving]     = useState(false)
  const [newBackupCodes, setNewBackupCodes] = useState([])

  const [disableOpen, setDisableOpen]         = useState(false)
  const [disablePassword, setDisablePassword] = useState('')
  const [disableErr, setDisableErr]           = useState('')
  const [disableSaving, setDisableSaving]     = useState(false)

  const [regenOpen, setRegenOpen]         = useState(false)
  const [regenPassword, setRegenPassword] = useState('')
  const [regenErr, setRegenErr]           = useState('')
  const [regenSaving, setRegenSaving]     = useState(false)
  const [regenCodes, setRegenCodes]       = useState([])

  useEffect(() => {
    api.get('/admin/config')
      .then(({ data }) => setConfig(data))
      .catch(() => setSaveErr('Could not load current settings.'))
      .finally(() => setLoading(false))
    api.get('/auth/me')
      .then(({ data }) => setTwoFactorEnabled(!!data.twoFactorEnabled))
      .catch(() => setTwoFactorEnabled(false))
  }, [])

  const handleFieldChange = (key) => (e) => {
    setConfig(prev => ({ ...prev, [key]: e.target.value }))
  }

  const handleSaveLinks = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaveMsg('')
    setSaveErr('')
    try {
      const payload = Object.fromEntries(ALL_LINK_KEYS.map(key => [key, config[key] || '']))
      await api.put('/config', payload)
      setSaveMsg('Settings saved.')
    } catch (err) {
      setSaveErr(err.response?.data?.message || 'Could not save settings.')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPwMsg('')
    setPwErr('')

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwErr('New password and confirmation do not match.')
      return
    }

    setPwSaving(true)
    try {
      const { data } = await api.post('/auth/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword:      pwForm.newPassword,
      })
      // Changing the password bumps tokenVersion server-side, which
      // invalidates every previously-issued token — including the one
      // this browser is currently using. The server sends back a fresh
      // token in the same response so this session isn't logged out by
      // its own action; swap it into storage now.
      if (data?.token) {
        try {
          const stored = JSON.parse(localStorage.getItem('whts_user') || '{}')
          stored.token = data.token
          localStorage.setItem('whts_user', JSON.stringify(stored))
        } catch { /* ignore */ }
      }
      setPwMsg('Password changed successfully.')
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setPwErr(err.response?.data?.message || 'Could not change password.')
    } finally {
      setPwSaving(false)
    }
  }

  const handleSaveNotificationEmail = async (e) => {
    e.preventDefault()
    setNotifSaving(true)
    setNotifMsg('')
    setNotifErr('')
    try {
      await api.put('/config', { notificationEmail: config.notificationEmail || '' })
      setNotifMsg('Saved.')
    } catch (err) {
      setNotifErr(err.response?.data?.message || 'Could not save this address.')
    } finally {
      setNotifSaving(false)
    }
  }

  const handleSaveSessionLength = async (e) => {
    e.preventDefault()
    setSessionSaving(true)
    setSessionMsg('')
    setSessionErr('')
    try {
      await api.put('/config', { adminSessionSeconds: Number(config.adminSessionSeconds) || 30 })
      setSessionMsg('Saved. Takes effect on next login.')
    } catch (err) {
      setSessionErr(err.response?.data?.message || 'Could not save session length.')
    } finally {
      setSessionSaving(false)
    }
  }

  const handleLogoutAllSessions = async () => {
    setLoggingOutAll(true)
    try {
      await api.post('/auth/logout-all-sessions')
      // The call above just invalidated the token this request used, so
      // the next request anywhere will 401 and the api.js interceptor
      // redirects to /signin — but redirect immediately rather than
      // waiting on that, since we already know the outcome.
      localStorage.removeItem('whts_user')
      window.location.href = '/signin'
    } catch (err) {
      setLoggingOutAll(false)
      setLogoutAllConfirmOpen(false)
      showToast(err.response?.data?.message || 'Could not log out all sessions.', 'error')
    }
  }

  const handleStartSetup = async () => {
    setSetupErr('')
    setSetupSaving(true)
    try {
      const { data } = await api.post('/auth/2fa/setup')
      setQrCodeDataUrl(data.qrCodeDataUrl)
      setManualSecret(data.secret)
      setSetupCode('')
      setSetupStep('qr')
      setSetupOpen(true)
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not start 2FA setup.', 'error')
    } finally {
      setSetupSaving(false)
    }
  }

  const handleConfirmSetup = async (e) => {
    e.preventDefault()
    setSetupErr('')
    setSetupSaving(true)
    try {
      const { data } = await api.post('/auth/2fa/confirm-setup', { code: setupCode })
      setNewBackupCodes(data.backupCodes)
      setSetupStep('backup-codes')
      setTwoFactorEnabled(true)
    } catch (err) {
      setSetupErr(err.response?.data?.message || 'Incorrect code. Please try again.')
      setSetupCode('')
    } finally {
      setSetupSaving(false)
    }
  }

  const handleCloseSetup = () => {
    setSetupOpen(false)
    setQrCodeDataUrl('')
    setManualSecret('')
    setSetupCode('')
    setSetupErr('')
    setNewBackupCodes([])
    setSetupStep('qr')
  }

  const handleDisable2FA = async (e) => {
    e.preventDefault()
    setDisableErr('')
    setDisableSaving(true)
    try {
      await api.post('/auth/2fa/disable', { currentPassword: disablePassword })
      setTwoFactorEnabled(false)
      setDisableOpen(false)
      setDisablePassword('')
      showToast('Two-factor authentication has been disabled.', 'success')
    } catch (err) {
      setDisableErr(err.response?.data?.message || 'Could not disable 2FA.')
    } finally {
      setDisableSaving(false)
    }
  }

  const handleRegenerateBackupCodes = async (e) => {
    e.preventDefault()
    setRegenErr('')
    setRegenSaving(true)
    try {
      const { data } = await api.post('/auth/2fa/regenerate-backup-codes', { currentPassword: regenPassword })
      setRegenCodes(data.backupCodes)
      setRegenPassword('')
    } catch (err) {
      setRegenErr(err.response?.data?.message || 'Could not generate new backup codes.')
    } finally {
      setRegenSaving(false)
    }
  }

  const handleCloseRegen = () => {
    setRegenOpen(false)
    setRegenPassword('')
    setRegenErr('')
    setRegenCodes([])
  }

  if (loading) return <div className="admin-page-loading">Loading settings…</div>

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Settings</h1>
        <p className="admin-page-sub">Public contact links, page channels, and your admin account.</p>
      </div>

      {/* ── Notification bell settings ── */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-card-header">
          <h3><i className="bi bi-bell"></i> Notifications</h3>
        </div>
        <form onSubmit={handleSaveNotificationEmail} className="admin-detail-grid">
          <div className="admin-detail-field-full">
            <label className="admin-detail-field-label" htmlFor="notificationEmail">
              Notification Email
            </label>
            <input
              id="notificationEmail"
              type="email"
              className="admin-search-input"
              style={{ width: '100%' }}
              placeholder="Defaults to acsw@wehelptrackscammersipaddress.com if left blank"
              value={config?.notificationEmail || ''}
              onChange={e => setConfig(prev => ({ ...prev, notificationEmail: e.target.value }))}
            />
            <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '0.3rem' }}>
              Where "new submission" alerts (reports, contact messages, bookings) get sent.
              These alerts never include the submitted content itself — just a heads-up and a link into the panel.
            </div>
          </div>
          <div className="admin-detail-field-full" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={notifSaving}>
              {notifSaving ? 'Saving…' : 'Save'}
            </button>
            {notifMsg && <span style={{ color: '#15803d', fontSize: '0.88rem' }}>{notifMsg}</span>}
            {notifErr && <span style={{ color: '#dc2626', fontSize: '0.88rem' }}>{notifErr}</span>}
          </div>
        </form>
      </div>

      {/* ── Admin session rules ── */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-card-header">
          <h3><i className="bi bi-shield-lock"></i> Admin Session</h3>
        </div>
        <form onSubmit={handleSaveSessionLength} className="admin-detail-grid">
          <div>
            <label className="admin-detail-field-label" htmlFor="adminSessionSeconds">
              Session Length
            </label>
            <StyledSelect
              id="adminSessionSeconds"
              className="admin-search-input"
              style={{ width: '100%' }}
              value={config?.adminSessionSeconds || 30}
              onChange={e => setConfig(prev => ({ ...prev, adminSessionSeconds: e.target.value }))}
            >
              <option value={30}>30 seconds</option>
              <option value={60}>1 minute</option>
              <option value={300}>5 minutes</option>
              <option value={600}>10 minutes</option>
              <option value={900}>15 minutes</option>
              <option value={1800}>30 minutes</option>
            </StyledSelect>
            <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '0.3rem' }}>
              How long an admin can stay idle in the panel before being signed out automatically.
              Staying active resets the clock — this only counts inactive time. Defaults to the
              shortest option (30 seconds) until changed, for safety.
            </div>
          </div>
          <div className="admin-detail-field-full" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={sessionSaving}>
              {sessionSaving ? 'Saving…' : 'Save'}
            </button>
            {sessionMsg && <span style={{ color: '#15803d', fontSize: '0.88rem' }}>{sessionMsg}</span>}
            {sessionErr && <span style={{ color: '#dc2626', fontSize: '0.88rem' }}>{sessionErr}</span>}
          </div>
        </form>
        <div className="admin-card-body" style={{ paddingTop: 0 }}>
          <button type="button" className="admin-btn admin-btn-danger" onClick={() => setLogoutAllConfirmOpen(true)} disabled={loggingOutAll}>
            <i className="bi bi-door-closed"></i> {loggingOutAll ? 'Logging out…' : 'Log Out of All Sessions'}
          </button>
          <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '0.5rem' }}>
            Immediately ends every active admin login, including this one — everyone (including you)
            will need to sign in again with the current password.
          </div>
        </div>
      </div>

      {/* ── Two-factor authentication ── */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-card-header">
          <h3><i className="bi bi-shield-check"></i> Two-Factor Authentication</h3>
        </div>
        <div className="admin-card-body">
          {twoFactorEnabled === null ? (
            <p className="admin-card-body-hint">Checking status…</p>
          ) : twoFactorEnabled ? (
            <>
              <p className="admin-card-body-hint" style={{ color: '#15803d' }}>
                <i className="bi bi-check-circle-fill me-1"></i>
                2FA is enabled. You'll be asked for a code from your authenticator app every time you sign in.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setRegenOpen(true)}>
                  <i className="bi bi-arrow-repeat"></i> Regenerate Backup Codes
                </button>
                <button type="button" className="admin-btn admin-btn-danger" onClick={() => setDisableOpen(true)}>
                  <i className="bi bi-shield-x"></i> Disable 2FA
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="admin-card-body-hint">
                Add a second layer of security to your admin account using Google Authenticator or any
                compatible authenticator app. Optional, but recommended.
              </p>
              <button type="button" className="admin-btn admin-btn-primary" onClick={handleStartSetup} disabled={setupSaving}>
                <i className="bi bi-qr-code"></i> {setupSaving ? 'Starting…' : 'Enable 2FA'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Threats page channels ── */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-card-header">
          <h3><i className="bi bi-headset"></i> Threats Page Channels</h3>
        </div>
        <div className="admin-card-body">
          <p className="admin-card-body-hint">
            The "Other Ways to Reach Us" section on the Threats page. Keep a roster of workers here and switch
            who's live any time — the page's look never changes, only whose number/handle/email is shown.
          </p>
          <WorkerListEditor
            context="threats"
            workers={config?.threatsPageWorkers || []}
            activeWorkerId={config?.activeThreatsWorkerId}
            onConfigUpdate={setConfig}
          />
        </div>
      </div>

      {/* ── Contact page channels ── */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-card-header">
          <h3><i className="bi bi-chat-dots"></i> Contact Page Channels</h3>
        </div>
        <div className="admin-card-body">
          <p className="admin-card-body-hint">
            The support channels and live-chat handoff on the Contact page. Same idea as Threats above —
            one roster, one active worker shown to visitors at a time.
          </p>
          <WorkerListEditor
            context="contact"
            workers={config?.contactPageWorkers || []}
            activeWorkerId={config?.activeContactWorkerId}
            onConfigUpdate={setConfig}
          />
        </div>
      </div>

      {/* ── Hire Our Team / Reach Us Instantly channels ── */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-card-header">
          <h3><i className="bi bi-person-badge"></i> Hire Our Team Channels</h3>
        </div>
        <div className="admin-card-body">
          <p className="admin-card-body-hint">
            The "Connect With Our Experts" / "Reach Us Instantly" quick-connect menu shown when a visitor
            clicks "Hire Our Team" on the Threats page. Same roster-and-active-worker model as above.
          </p>
          <WorkerListEditor
            context="hire"
            workers={config?.hirePageWorkers || []}
            activeWorkerId={config?.activeHirePageWorkerId}
            onConfigUpdate={setConfig}
          />
        </div>
      </div>

      {/* ── Public contact / social links, grouped by page ── */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-card-header">
          <h3>Other Public Links</h3>
        </div>
        <form onSubmit={handleSaveLinks} className="admin-card-body">
          {LINK_GROUPS.map((group, i) => (
            <div key={group.heading} style={{ marginBottom: i === LINK_GROUPS.length - 1 ? '1.5rem' : '2rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: group.headingColor || '#0f172a', marginBottom: '0.15rem' }}>
                {group.heading}
              </h4>
              {group.hint && <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.9rem' }}>{group.hint}</p>}
              <div className="admin-detail-grid" style={{ padding: 0, gap: '1rem 1.5rem' }}>
                {group.fields.map(([key, label, placeholder, highlight]) => {
                  const hex = HIGHLIGHT_COLORS[highlight]
                  return (
                    <div key={key}>
                      <label
                        className="admin-detail-field-label"
                        htmlFor={key}
                        style={hex ? { color: hex } : undefined}
                      >
                        {label}
                      </label>
                      <input
                        id={key}
                        className="admin-search-input"
                        style={{ width: '100%', ...(hex ? { color: hex, fontWeight: 600 } : {}) }}
                        placeholder={placeholder}
                        value={config?.[key] || ''}
                        onChange={handleFieldChange(key)}
                      />
                      {hex && (
                        <div style={{ fontSize: '0.76rem', color: hex, marginTop: '0.3rem' }}>
                          This is the exact place to change this — {hex === HIGHLIGHT_COLORS.red
                            ? 'this is what shows on the button, visitors see it in plain text; this red'
                            : 'this'} coloring is only here in the admin panel so it's easy to spot.
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            {saveMsg && <span style={{ color: '#15803d', fontSize: '0.88rem' }}>{saveMsg}</span>}
            {saveErr && <span style={{ color: '#dc2626', fontSize: '0.88rem' }}>{saveErr}</span>}
          </div>
        </form>
      </div>

      {/* ── Change password ── */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Change Admin Password</h3>
        </div>
        <form onSubmit={handleChangePassword} className="admin-detail-grid" style={{ maxWidth: 420 }}>
          <div className="admin-detail-field-full">
            <label className="admin-detail-field-label">Current Password</label>
            <input
              type="password"
              className="admin-search-input"
              style={{ width: '100%' }}
              value={pwForm.currentPassword}
              onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))}
              required
            />
          </div>
          <div className="admin-detail-field-full">
            <label className="admin-detail-field-label">New Password</label>
            <input
              type="password"
              className="admin-search-input"
              style={{ width: '100%' }}
              value={pwForm.newPassword}
              onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))}
              minLength={12}
              required
            />
            <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '0.3rem' }}>
              At least 12 characters, with an uppercase letter, a number, and a symbol.
            </div>
          </div>
          <div className="admin-detail-field-full">
            <label className="admin-detail-field-label">Confirm New Password</label>
            <input
              type="password"
              className="admin-search-input"
              style={{ width: '100%' }}
              value={pwForm.confirmPassword}
              onChange={e => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))}
              required
            />
          </div>
          <div className="admin-detail-field-full" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={pwSaving}>
              {pwSaving ? 'Changing…' : 'Change Password'}
            </button>
            {pwMsg && <span style={{ color: '#15803d', fontSize: '0.88rem' }}>{pwMsg}</span>}
            {pwErr && <span style={{ color: '#dc2626', fontSize: '0.88rem' }}>{pwErr}</span>}
          </div>
        </form>
      </div>

      {/* ── 2FA setup modal — QR step, then backup codes shown once ── */}
      {setupOpen && (
        <div className="admin-confirm-overlay" onClick={setupStep === 'backup-codes' ? undefined : handleCloseSetup}>
          <div className="admin-confirm-box" style={{ maxWidth: 440, textAlign: 'left' }} onClick={e => e.stopPropagation()}>
            {setupStep === 'qr' ? (
              <>
                <h3 style={{ textAlign: 'center' }}>Scan this with your authenticator app</h3>
                {qrCodeDataUrl && (
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
                    <img src={qrCodeDataUrl} alt="2FA QR code" style={{ width: 200, height: 200, borderRadius: 8, border: '1px solid #e5e7eb' }} />
                  </div>
                )}
                <p style={{ fontSize: '0.8rem', color: '#6b7280', textAlign: 'center' }}>
                  Can't scan? Enter this code manually: <br />
                  <code style={{ fontSize: '0.85rem', wordBreak: 'break-all' }}>{manualSecret}</code>
                </p>
                <form onSubmit={handleConfirmSetup} style={{ marginTop: '1rem' }}>
                  <label className="admin-detail-field-label">Enter the 6-digit code to confirm</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    className="admin-search-input"
                    style={{ width: '100%', textAlign: 'center', fontSize: '1.2rem', letterSpacing: '0.3em' }}
                    value={setupCode}
                    onChange={e => setSetupCode(e.target.value.replace(/\D/g, ''))}
                    autoFocus
                  />
                  {setupErr && <div style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.4rem' }}>{setupErr}</div>}
                  <div className="admin-confirm-actions" style={{ marginTop: '1.2rem' }}>
                    <button type="button" className="admin-btn admin-btn-ghost" onClick={handleCloseSetup} disabled={setupSaving}>
                      Cancel
                    </button>
                    <button type="submit" className="admin-btn admin-btn-primary" disabled={setupSaving || setupCode.length !== 6}>
                      {setupSaving ? 'Verifying…' : 'Confirm & Enable'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h3 style={{ textAlign: 'center' }}><i className="bi bi-shield-check" style={{ color: '#15803d' }}></i> 2FA Enabled</h3>
                <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                  Save these backup codes somewhere safe — each works once, for signing in if you lose access
                  to your authenticator app. <strong>They won't be shown again.</strong>
                </p>
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem',
                  background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: 8,
                  padding: '0.9rem', margin: '0.8rem 0', fontFamily: 'monospace', fontSize: '0.9rem',
                }}>
                  {newBackupCodes.map(c => <div key={c}>{c}</div>)}
                </div>
                <div className="admin-confirm-actions">
                  <button type="button" className="admin-btn admin-btn-primary" onClick={handleCloseSetup}>
                    I've saved these codes
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Disable 2FA modal ── */}
      {disableOpen && (
        <div className="admin-confirm-overlay" onClick={() => { setDisableOpen(false); setDisablePassword(''); setDisableErr('') }}>
          <div className="admin-confirm-box" style={{ maxWidth: 400, textAlign: 'left' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ textAlign: 'center' }}>Disable Two-Factor Authentication?</h3>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', textAlign: 'center' }}>
              Enter your password to confirm. Your account will only need a password to sign in afterward.
            </p>
            <form onSubmit={handleDisable2FA}>
              <input
                type="password"
                className="admin-search-input"
                style={{ width: '100%' }}
                placeholder="Current password"
                value={disablePassword}
                onChange={e => setDisablePassword(e.target.value)}
                autoFocus
                required
              />
              {disableErr && <div style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.4rem' }}>{disableErr}</div>}
              <div className="admin-confirm-actions" style={{ marginTop: '1.2rem' }}>
                <button type="button" className="admin-btn admin-btn-ghost"
                  onClick={() => { setDisableOpen(false); setDisablePassword(''); setDisableErr('') }} disabled={disableSaving}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-danger" disabled={disableSaving}>
                  {disableSaving ? 'Disabling…' : 'Disable 2FA'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Regenerate backup codes modal ── */}
      {regenOpen && (
        <div className="admin-confirm-overlay" onClick={regenCodes.length ? undefined : handleCloseRegen}>
          <div className="admin-confirm-box" style={{ maxWidth: 420, textAlign: 'left' }} onClick={e => e.stopPropagation()}>
            {regenCodes.length === 0 ? (
              <>
                <h3 style={{ textAlign: 'center' }}>Regenerate Backup Codes?</h3>
                <p style={{ fontSize: '0.85rem', color: '#6b7280', textAlign: 'center' }}>
                  This invalidates all your existing backup codes. Enter your password to confirm.
                </p>
                <form onSubmit={handleRegenerateBackupCodes}>
                  <input
                    type="password"
                    className="admin-search-input"
                    style={{ width: '100%' }}
                    placeholder="Current password"
                    value={regenPassword}
                    onChange={e => setRegenPassword(e.target.value)}
                    autoFocus
                    required
                  />
                  {regenErr && <div style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.4rem' }}>{regenErr}</div>}
                  <div className="admin-confirm-actions" style={{ marginTop: '1.2rem' }}>
                    <button type="button" className="admin-btn admin-btn-ghost" onClick={handleCloseRegen} disabled={regenSaving}>
                      Cancel
                    </button>
                    <button type="submit" className="admin-btn admin-btn-primary" disabled={regenSaving}>
                      {regenSaving ? 'Generating…' : 'Regenerate'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h3 style={{ textAlign: 'center' }}>New Backup Codes</h3>
                <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                  Your old codes no longer work. Save these somewhere safe — <strong>they won't be shown again.</strong>
                </p>
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem',
                  background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: 8,
                  padding: '0.9rem', margin: '0.8rem 0', fontFamily: 'monospace', fontSize: '0.9rem',
                }}>
                  {regenCodes.map(c => <div key={c}>{c}</div>)}
                </div>
                <div className="admin-confirm-actions">
                  <button type="button" className="admin-btn admin-btn-primary" onClick={handleCloseRegen}>
                    I've saved these codes
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={logoutAllConfirmOpen}
        danger
        title="Log out of all sessions?"
        message="This ends every active admin login right now, including this one — everyone will need to sign in again."
        confirmLabel="Log Out Everyone"
        loading={loggingOutAll}
        onCancel={() => setLogoutAllConfirmOpen(false)}
        onConfirm={handleLogoutAllSessions}
      />
    </div>
  )
}
