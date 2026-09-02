import { useState, useEffect } from 'react'
import api from '../../services/api'
import WorkerListEditor from './components/WorkerListEditor'
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
]

const ALL_LINK_KEYS = LINK_GROUPS.flatMap(g => g.fields.map(([key]) => key))

export default function AdminSettings() {
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

  useEffect(() => {
    api.get('/config')
      .then(({ data }) => setConfig(data))
      .catch(() => setSaveErr('Could not load current settings.'))
      .finally(() => setLoading(false))
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
      await api.post('/auth/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword:      pwForm.newPassword,
      })
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
              placeholder="Defaults to the server's MAIL_USER address if left blank"
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

      {/* ── Threats page channels ── */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-card-header">
          <h3><i className="bi bi-headset"></i> Threats Page Channels</h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '-0.5rem', marginBottom: '1rem' }}>
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

      {/* ── Contact page channels ── */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-card-header">
          <h3><i className="bi bi-chat-dots"></i> Contact Page Channels</h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '-0.5rem', marginBottom: '1rem' }}>
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

      {/* ── Public contact / social links, grouped by page ── */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-card-header">
          <h3>Other Public Links</h3>
        </div>
        <form onSubmit={handleSaveLinks}>
          {LINK_GROUPS.map(group => (
            <div key={group.heading} style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.15rem' }}>
                {group.heading}
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.75rem' }}>{group.hint}</p>
              <div className="admin-detail-grid">
                {group.fields.map(([key, label, placeholder]) => (
                  <div key={key}>
                    <label className="admin-detail-field-label" htmlFor={key}>{label}</label>
                    <input
                      id={key}
                      className="admin-search-input"
                      style={{ width: '100%' }}
                      placeholder={placeholder}
                      value={config?.[key] || ''}
                      onChange={handleFieldChange(key)}
                    />
                  </div>
                ))}
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
    </div>
  )
}
