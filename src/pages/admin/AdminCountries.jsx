import { useState, useEffect, useMemo } from 'react'
import api from '../../services/api'
import { getCountryFlag, ALLOWED_COUNTRIES, REGIONS } from '../../utils/countryUtils'
import './AdminShared.css'

export default function AdminCountries() {
  const [countries, setCountries] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [search, setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [regionFilter, setRegionFilter] = useState('all')
  const [sortBy, setSortBy]       = useState('name-asc')
  const [updatingCode, setUpdatingCode] = useState(null)
  const [bulkUpdating, setBulkUpdating] = useState(false)
  const [notice, setNotice]       = useState('')

  useEffect(() => {
    api.get('/countries/admin')
      .then(({ data }) => {
        // Merge with local ALLOWED_COUNTRIES to ensure region and other attributes are present
        const localMap = Object.fromEntries(ALLOWED_COUNTRIES.map(c => [c.code, c]))
        const merged = data.map(c => ({
          ...(localMap[c.code] || {}),
          ...c,
          region: localMap[c.code]?.region || 'Other',
        }))
        setCountries(merged)
      })
      .catch(() => setError('Could not load countries.'))
      .finally(() => setLoading(false))
  }, [])

  const handleToggle = async (code, field, currentValue) => {
    const nextValue = !currentValue
    setUpdatingCode(code)
    setNotice('')

    // Optimistic UI update
    setCountries(prev => prev.map(c => c.code === code ? { ...c, [field]: nextValue } : c))

    try {
      await api.patch(`/countries/${code}`, { [field]: nextValue })
      setNotice(`Updated ${code} settings.`)
      setTimeout(() => setNotice(''), 3000)
    } catch (err) {
      // Rollback on failure
      setCountries(prev => prev.map(c => c.code === code ? { ...c, [field]: currentValue } : c))
      setError(err.response?.data?.message || `Failed to update ${code}.`)
      setTimeout(() => setError(''), 4000)
    } finally {
      setUpdatingCode(null)
    }
  }

  // Bulk action on currently filtered countries
  const handleBulkAction = async (field, value) => {
    const targets = filtered.filter(c => c[field] !== value)
    if (targets.length === 0) return

    const confirmMsg = `Are you sure you want to set "${field === 'signupAllowed' ? 'Allow Sign Up' : 'Show in Dropdowns'}" to ${value ? 'ALLOWED / VISIBLE' : 'BLOCKED / HIDDEN'} for all ${targets.length} currently filtered countries?`
    if (!window.confirm(confirmMsg)) return

    setBulkUpdating(true)
    setNotice('')

    // Optimistic UI update
    const targetCodes = new Set(targets.map(c => c.code))
    setCountries(prev => prev.map(c => targetCodes.has(c.code) ? { ...c, [field]: value } : c))

    try {
      await Promise.all(
        targets.map(c => api.patch(`/countries/${c.code}`, { [field]: value }))
      )
      setNotice(`Successfully updated ${targets.length} countries.`)
      setTimeout(() => setNotice(''), 3500)
    } catch (err) {
      setError('Some bulk updates may have failed. Refreshing data...')
      // Refresh
      api.get('/countries/admin').then(({ data }) => {
        const localMap = Object.fromEntries(ALLOWED_COUNTRIES.map(c => [c.code, c]))
        setCountries(data.map(c => ({ ...(localMap[c.code] || {}), ...c })))
      })
    } finally {
      setBulkUpdating(false)
    }
  }

  const filtered = useMemo(() => {
    let list = countries

    // 1. Search Query
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      const queryDigits = q.replace(/\D/g, '')
      list = list.filter(c => {
        const nameMatch = c.name?.toLowerCase().includes(q)
        const codeMatch = c.code?.toLowerCase() === q
        const regionMatch = c.region?.toLowerCase().includes(q)
        const dialDigits = (c.dial || '').replace(/\D/g, '')
        const dialMatch = queryDigits && dialDigits.startsWith(queryDigits)
        return nameMatch || codeMatch || regionMatch || dialMatch
      })
    }

    // 2. Region / Continent Filter
    if (regionFilter !== 'all') {
      list = list.filter(c => c.region === regionFilter)
    }

    // 3. Status Filter
    if (statusFilter === 'signup-allowed') {
      list = list.filter(c => c.signupAllowed)
    } else if (statusFilter === 'signup-blocked') {
      list = list.filter(c => !c.signupAllowed)
    } else if (statusFilter === 'dropdown-visible') {
      list = list.filter(c => c.showInDropdown)
    } else if (statusFilter === 'dropdown-hidden') {
      list = list.filter(c => !c.showInDropdown)
    }

    // 4. Sorting
    list = [...list].sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name)
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name)
      if (sortBy === 'code-asc') return a.code.localeCompare(b.code)
      if (sortBy === 'dial-asc') {
        const numA = parseInt(a.dial.replace(/\D/g, ''), 10) || 0
        const numB = parseInt(b.dial.replace(/\D/g, ''), 10) || 0
        return numA - numB
      }
      if (sortBy === 'region-asc') {
        const regDiff = (a.region || '').localeCompare(b.region || '')
        return regDiff !== 0 ? regDiff : a.name.localeCompare(b.name)
      }
      return 0
    })

    return list
  }, [countries, search, regionFilter, statusFilter, sortBy])

  const stats = useMemo(() => {
    const total = countries.length
    const signupCount = countries.filter(c => c.signupAllowed).length
    const dropdownCount = countries.filter(c => c.showInDropdown).length

    const regionCounts = {}
    REGIONS.forEach(r => {
      regionCounts[r] = countries.filter(c => c.region === r).length
    })

    return { total, signupCount, dropdownCount, regionCounts }
  }, [countries])

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Country &amp; Region Access</h1>
        <p className="admin-page-sub">
          Manage user signup permissions and country/dial-code visibility by continent, region, or status.
        </p>
      </div>

      {notice && (
        <div style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', padding: '0.65rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.86rem' }}>
          <i className="bi bi-check-circle-fill me-2"></i>{notice}
        </div>
      )}

      {error && (
        <div style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '0.65rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.86rem' }}>
          <i className="bi bi-exclamation-circle-fill me-2"></i>{error}
        </div>
      )}

      <div className="admin-card">
        {/* Multi-tier Toolbar */}
        <div className="admin-toolbar" style={{ gap: '0.75rem', alignItems: 'center' }}>
          {/* Search Box */}
          <input
            className="admin-search-input"
            placeholder="Search country, code, dial (+234), or region…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ minWidth: '220px', flex: '1 1 220px' }}
          />

          {/* Region / Continent Filter */}
          <select
            className="admin-filter-select"
            value={regionFilter}
            onChange={e => setRegionFilter(e.target.value)}
            style={{ flex: '1 1 160px', minWidth: '150px' }}
          >
            <option value="all">🌍 All Continents ({stats.total})</option>
            {REGIONS.map(r => (
              <option key={r} value={r}>
                {r} ({stats.regionCounts[r] || 0})
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            className="admin-filter-select"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ flex: '1 1 160px', minWidth: '150px' }}
          >
            <option value="all">⚡ All Statuses</option>
            <option value="signup-allowed">Signup Allowed ({stats.signupCount})</option>
            <option value="signup-blocked">Signup Blocked ({stats.total - stats.signupCount})</option>
            <option value="dropdown-visible">In Dropdowns ({stats.dropdownCount})</option>
            <option value="dropdown-hidden">Hidden from Dropdowns ({stats.total - stats.dropdownCount})</option>
          </select>

          {/* Sort Filter */}
          <select
            className="admin-filter-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{ flex: '1 1 140px', minWidth: '130px' }}
          >
            <option value="name-asc">Sort: Name (A-Z)</option>
            <option value="name-desc">Sort: Name (Z-A)</option>
            <option value="region-asc">Sort: Region</option>
            <option value="code-asc">Sort: ISO Code</option>
            <option value="dial-asc">Sort: Dial Code</option>
          </select>
        </div>

        {/* Region / Filter Quick Summary & Bulk Action Bar */}
        {(regionFilter !== 'all' || statusFilter !== 'all' || search.trim()) && (
          <div style={{
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            padding: '0.65rem 1.4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            fontSize: '0.84rem'
          }}>
            <div style={{ color: '#475569' }}>
              Showing <strong>{filtered.length}</strong> {regionFilter !== 'all' ? `in ${regionFilter}` : 'matching countries'}
              {regionFilter !== 'all' && (
                <button
                  type="button"
                  className="btn btn-link btn-sm p-0 ms-2 text-decoration-none"
                  style={{ fontSize: '0.8rem', color: '#0d9488' }}
                  onClick={() => { setRegionFilter('all'); setStatusFilter('all'); setSearch('') }}
                >
                  (Reset filters)
                </button>
              )}
            </div>

            {/* Quick Bulk Action Buttons for the active view */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="admin-btn admin-btn-ghost admin-btn-sm"
                disabled={bulkUpdating || filtered.length === 0}
                onClick={() => handleBulkAction('signupAllowed', true)}
                title="Allow signup for all countries currently in view"
              >
                <i className="bi bi-check2-all text-success"></i> Allow Signups
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-ghost admin-btn-sm"
                disabled={bulkUpdating || filtered.length === 0}
                onClick={() => handleBulkAction('signupAllowed', false)}
                title="Block signup for all countries currently in view"
              >
                <i className="bi bi-slash-circle text-danger"></i> Block Signups
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-ghost admin-btn-sm"
                disabled={bulkUpdating || filtered.length === 0}
                onClick={() => handleBulkAction('showInDropdown', true)}
                title="Show in dropdowns for all countries currently in view"
              >
                <i className="bi bi-eye text-primary"></i> Show All
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-ghost admin-btn-sm"
                disabled={bulkUpdating || filtered.length === 0}
                onClick={() => handleBulkAction('showInDropdown', false)}
                title="Hide from dropdowns for all countries currently in view"
              >
                <i className="bi bi-eye-slash text-secondary"></i> Hide All
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="admin-page-loading">Loading country list…</div>
        ) : filtered.length === 0 ? (
          <div className="admin-table-empty">
            <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>🌐</div>
            <div>No countries match your search or filter criteria.</div>
            <button
              type="button"
              className="admin-btn admin-btn-ghost admin-btn-sm mt-3"
              onClick={() => { setRegionFilter('all'); setStatusFilter('all'); setSearch('') }}
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="admin-table-wrap admin-desktop-table">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>Flag</th>
                    <th>Country Name</th>
                    <th>Region / Continent</th>
                    <th>ISO Code</th>
                    <th>Dial Code</th>
                    <th style={{ textAlign: 'center' }}>Allow Sign Up</th>
                    <th style={{ textAlign: 'center' }}>Show in Dropdowns</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(c => {
                    const isBusy = updatingCode === c.code || bulkUpdating
                    return (
                      <tr key={c.code}>
                        <td style={{ fontSize: '1.4rem' }}>{getCountryFlag(c.code)}</td>
                        <td style={{ fontWeight: 600 }}>{c.name}</td>
                        <td>
                          <span className="admin-pill" style={{ background: '#f1f5f9', color: '#334155', fontSize: '0.74rem' }}>
                            {c.region || 'World'}
                          </span>
                        </td>
                        <td>
                          <span className="admin-pill admin-pill-pending" style={{ fontFamily: 'monospace' }}>
                            {c.code}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 500, color: '#475569' }}>{c.dial}</span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <label className="admin-switch" title={`Toggle signup for ${c.name}`}>
                            <input
                              type="checkbox"
                              checked={Boolean(c.signupAllowed)}
                              disabled={isBusy}
                              onChange={() => handleToggle(c.code, 'signupAllowed', c.signupAllowed)}
                            />
                            <span className="admin-switch-slider"></span>
                          </label>
                          <div style={{ fontSize: '0.72rem', marginTop: '0.2rem', color: c.signupAllowed ? '#15803d' : '#9ca3af', fontWeight: 600 }}>
                            {c.signupAllowed ? 'Allowed' : 'Blocked'}
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <label className="admin-switch" title={`Toggle dropdown visibility for ${c.name}`}>
                            <input
                              type="checkbox"
                              checked={Boolean(c.showInDropdown)}
                              disabled={isBusy}
                              onChange={() => handleToggle(c.code, 'showInDropdown', c.showInDropdown)}
                            />
                            <span className="admin-switch-slider"></span>
                          </label>
                          <div style={{ fontSize: '0.72rem', marginTop: '0.2rem', color: c.showInDropdown ? '#0d9488' : '#9ca3af', fontWeight: 600 }}>
                            {c.showInDropdown ? 'Visible' : 'Hidden'}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="admin-mobile-cards">
              {filtered.map(c => {
                const isBusy = updatingCode === c.code || bulkUpdating
                return (
                  <div key={c.code} className="admin-mobile-card" style={{ cursor: 'default' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>{getCountryFlag(c.code)}</span>
                        <div>
                          <div className="admin-mobile-card-title">{c.name}</div>
                          <div className="admin-mobile-card-sub" style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <span className="admin-pill admin-pill-pending" style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>
                              {c.code}
                            </span>
                            <span style={{ fontWeight: 500 }}>{c.dial}</span>
                            <span className="admin-pill" style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.7rem' }}>
                              {c.region || 'World'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', marginTop: '0.5rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                          Sign Up
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <label className="admin-switch">
                            <input
                              type="checkbox"
                              checked={Boolean(c.signupAllowed)}
                              disabled={isBusy}
                              onChange={() => handleToggle(c.code, 'signupAllowed', c.signupAllowed)}
                            />
                            <span className="admin-switch-slider"></span>
                          </label>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: c.signupAllowed ? '#15803d' : '#9ca3af' }}>
                            {c.signupAllowed ? 'Allowed' : 'Blocked'}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                          Dropdowns
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <label className="admin-switch">
                            <input
                              type="checkbox"
                              checked={Boolean(c.showInDropdown)}
                              disabled={isBusy}
                              onChange={() => handleToggle(c.code, 'showInDropdown', c.showInDropdown)}
                            />
                            <span className="admin-switch-slider"></span>
                          </label>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: c.showInDropdown ? '#0d9488' : '#9ca3af' }}>
                            {c.showInDropdown ? 'Visible' : 'Hidden'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
