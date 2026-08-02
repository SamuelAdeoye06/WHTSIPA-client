import { useState, useEffect } from 'react'
import api from '../../services/api'
import './AdminShared.css'

const LINK_FIELDS = [
  ['callbackNumber',           'Callback Number',                'e.g. +1 (650) 221-7654'],
  ['supportEmail',             'Support Email',                  'e.g. support@whtsipa.com'],
  ['whatsappLink',             'WhatsApp Link',                  'https://wa.me/...'],
  ['telegramCommunityLink',    'Telegram — Community',           'https://t.me/...'],
  ['whtsipaToolsTelegramLink', 'Telegram — Tools',                'https://t.me/...'],
  ['findUsTelegramLink',       'Telegram — Find Us',              'https://t.me/...'],
  ['facebookCommunityLink',    'Facebook Community',             'https://facebook.com/...'],
]

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
      const payload = Object.fromEntries(LINK_FIELDS.map(([key]) => [key, config[key] || '']))
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

  if (loading) return <div className="admin-page-loading">Loading settings…</div>

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Settings</h1>
        <p className="admin-page-sub">Public contact links and your admin account.</p>
      </div>

      {/* ── Public contact / social links ── */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-card-header">
          <h3>Public Contact &amp; Social Links</h3>
        </div>
        <form onSubmit={handleSaveLinks} className="admin-detail-grid">
          {LINK_FIELDS.map(([key, label, placeholder]) => (
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
          <div className="admin-detail-field-full" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
