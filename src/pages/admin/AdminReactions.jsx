import { useState, useEffect, useMemo } from 'react'
import api from '../../services/api'
import { formatReactionCount } from '../../utils/numberFormatter'
import './AdminShared.css'

export default function AdminReactions() {
  const [reactions, setReactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [search, setSearch] = useState('')
  const [pageFilter, setPageFilter] = useState('all') // 'all' | 'about' | 'about-officials'
  const [sortBy, setSortBy] = useState('likes-desc') // 'likes-desc' | 'dislikes-desc' | 'name-asc' | 'page-asc'
  const [updatingId, setUpdatingId] = useState(null)

  // Edit draft states: { [entityId]: { boostLikes, boostDislikes } }
  const [drafts, setDrafts] = useState({})

  const fetchReactions = () => {
    setLoading(true)
    api.get('/reactions/admin')
      .then(({ data }) => {
        setReactions(data || [])
        // Initialize drafts
        const initDrafts = {}
        data.forEach(r => {
          initDrafts[r.entityId] = {
            boostLikes: r.boostLikes || 0,
            boostDislikes: r.boostDislikes || 0,
          }
        })
        setDrafts(initDrafts)
      })
      .catch(err => {
        console.error('Failed to load admin reactions:', err)
        setError('Could not load reactions data.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchReactions()
  }, [])

  const handleDraftChange = (entityId, field, value) => {
    const num = Math.max(0, parseInt(value, 10) || 0)
    setDrafts(prev => ({
      ...prev,
      [entityId]: {
        ...(prev[entityId] || {}),
        [field]: num,
      }
    }))
  }

  const handleSave = async (entityId) => {
    const draft = drafts[entityId]
    if (!draft) return

    setUpdatingId(entityId)
    setNotice('')
    setError('')

    try {
      const { data } = await api.patch(`/reactions/admin/${entityId}`, {
        boostLikes: draft.boostLikes,
        boostDislikes: draft.boostDislikes,
      })

      setReactions(prev => prev.map(r => r.entityId === entityId ? data.data : r))
      setNotice(`Updated settings for ${data.data.abbr || data.data.name}.`)
      setTimeout(() => setNotice(''), 3500)
    } catch (err) {
      console.error(`Failed to update ${entityId}:`, err)
      setError(err.response?.data?.message || 'Failed to update reaction settings.')
      setTimeout(() => setError(''), 4000)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleResetQueue = async (entityId) => {
    setUpdatingId(entityId)
    try {
      const { data } = await api.patch(`/reactions/admin/${entityId}`, { resetQueue: true })
      setReactions(prev => prev.map(r => r.entityId === entityId ? data.data : r))
      setNotice(`Reset queued dislikes for ${data.data.abbr || data.data.name}.`)
      setTimeout(() => setNotice(''), 3500)
    } catch (err) {
      setError('Failed to reset queue.')
      setTimeout(() => setError(''), 4000)
    } finally {
      setUpdatingId(null)
    }
  }

  // Quick preset helper (e.g. +1000 likes)
  const handleQuickBoost = (entityId, amount) => {
    const current = drafts[entityId]?.boostLikes || 0
    handleDraftChange(entityId, 'boostLikes', current + amount)
  }

  // Filtered & Sorted listing
  const filtered = useMemo(() => {
    let result = reactions.filter(r => {
      if (pageFilter !== 'all' && r.page !== pageFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        const matchName = r.name?.toLowerCase().includes(q)
        const matchAbbr = r.abbr?.toLowerCase().includes(q)
        const matchRole = r.role?.toLowerCase().includes(q)
        const matchId = r.entityId?.toLowerCase().includes(q)
        if (!matchName && !matchAbbr && !matchRole && !matchId) return false
      }
      return true
    })

    result.sort((a, b) => {
      const draftA = drafts[a.entityId] || { boostLikes: a.boostLikes, boostDislikes: a.boostDislikes }
      const draftB = drafts[b.entityId] || { boostLikes: b.boostLikes, boostDislikes: b.boostDislikes }
      const totalLikesA = (draftA.boostLikes || 0) + (a.userLikes || 0)
      const totalLikesB = (draftB.boostLikes || 0) + (b.userLikes || 0)
      const totalDislikesA = (draftA.boostDislikes || 0) + (a.userDislikes || 0)
      const totalDislikesB = (draftB.boostDislikes || 0) + (b.userDislikes || 0)

      if (sortBy === 'likes-desc') return totalLikesB - totalLikesA
      if (sortBy === 'dislikes-desc') return totalDislikesB - totalDislikesA
      if (sortBy === 'name-asc') return (a.name || '').localeCompare(b.name || '')
      if (sortBy === 'page-asc') return (a.page || '').localeCompare(b.page || '')
      return 0
    })

    return result
  }, [reactions, drafts, pageFilter, search, sortBy])

  // Summary Metrics
  const totalLikesAll = useMemo(() => reactions.reduce((acc, r) => acc + (r.totalLikes || 0), 0), [reactions])
  const totalDislikesAll = useMemo(() => reactions.reduce((acc, r) => acc + (r.totalDislikes || 0), 0), [reactions])
  const totalQueuedAll = useMemo(() => reactions.reduce((acc, r) => acc + (r.queuedDislikes || 0), 0), [reactions])
  const aboutCount = useMemo(() => reactions.filter(r => r.page === 'about').length, [reactions])
  const officialsCount = useMemo(() => reactions.filter(r => r.page === 'about-officials').length, [reactions])

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="admin-page-title">Reactions &amp; Likes</h1>
          <p className="admin-page-sub">
            Monitor and boost likes, track throttled dislikes, and manage engagement across pages.
          </p>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn-ghost"
          onClick={fetchReactions}
          disabled={loading}
        >
          <i className={`bi bi-arrow-clockwise ${loading ? 'spin' : ''}`}></i> Refresh Data
        </button>
      </div>

      {/* KPI Stat Cards */}
      <div className="admin-stat-grid mb-4">
        <div className="admin-stat-card">
          <div className="admin-stat-label">Total Public Likes</div>
          <div className="admin-stat-value" style={{ color: '#0d9488' }}>
            {formatReactionCount(totalLikesAll)}
          </div>
          <span className="admin-stat-badge admin-stat-badge-good">
            <i className="bi bi-hand-thumbs-up-fill me-1"></i> {totalLikesAll.toLocaleString()} live likes
          </span>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-label">Total Public Dislikes</div>
          <div className="admin-stat-value" style={{ color: '#b91c1c' }}>
            {formatReactionCount(totalDislikesAll)}
          </div>
          <span className="admin-stat-badge admin-stat-badge-neutral">
            <i className="bi bi-hand-thumbs-down-fill me-1"></i> {totalDislikesAll.toLocaleString()} reflected
          </span>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-label">Queued Dislikes (2-Wk Hold)</div>
          <div className="admin-stat-value" style={{ color: totalQueuedAll > 0 ? '#b45309' : '#64748b' }}>
            {totalQueuedAll}
          </div>
          <span className={`admin-stat-badge ${totalQueuedAll > 0 ? 'admin-stat-badge-warn' : 'admin-stat-badge-good'}`}>
            <i className="bi bi-hourglass-split me-1"></i> {totalQueuedAll > 0 ? `${totalQueuedAll} waiting for 14d cycle` : 'Queue empty'}
          </span>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-label">Tracked Entities</div>
          <div className="admin-stat-value">
            {reactions.length}
          </div>
          <span className="admin-stat-badge admin-stat-badge-good">
            8 Agencies · 6 Officials
          </span>
        </div>
      </div>

      {/* Notices */}
      {notice && (
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          color: '#065f46',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.88rem'
        }}>
          <i className="bi bi-check-circle-fill text-success"></i> {notice}
        </div>
      )}
      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#991b1b',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.88rem'
        }}>
          <i className="bi bi-exclamation-triangle-fill text-danger"></i> {error}
        </div>
      )}

      {/* Main Admin Card Container */}
      <div className="admin-card">
        {/* Responsive Toolbar (Search on line 1, both filter dropdowns side-by-side on line 2 on mobile) */}
        <div className="admin-reactions-toolbar">
          {/* Search Box */}
          <div className="admin-reactions-search-box">
            <input
              className="admin-search-input"
              style={{ width: '100%' }}
              placeholder="Search entity name, acronym (FTC, USPIS), or threat role…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Filter Dropdowns Grid */}
          <div className="admin-reactions-filters-grid">
            <select
              className="admin-filter-select"
              value={pageFilter}
              onChange={e => setPageFilter(e.target.value)}
              style={{ fontSize: '0.84rem' }}
            >
              <option value="all">📂 All Pages ({reactions.length})</option>
              <option value="about">🏛️ About WHTSIPA ({aboutCount})</option>
              <option value="about-officials">🛡️ Officials ({officialsCount})</option>
            </select>

            <select
              className="admin-filter-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{ fontSize: '0.84rem' }}
            >
              <option value="likes-desc">🔥 Highest Likes</option>
              <option value="dislikes-desc">👎 Highest Dislikes</option>
              <option value="name-asc">🔤 Name (A-Z)</option>
              <option value="page-asc">📑 Section</option>
            </select>
          </div>
        </div>

        {/* Filter Summary Bar */}
        {(pageFilter !== 'all' || search.trim()) && (
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
              Showing <strong>{filtered.length}</strong> {pageFilter !== 'all' ? `in ${pageFilter === 'about' ? 'About WHTSIPA' : 'About Officials'}` : 'matching entities'}
              <button
                type="button"
                className="btn btn-link btn-sm p-0 ms-2 text-decoration-none"
                style={{ fontSize: '0.8rem', color: '#0d9488' }}
                onClick={() => { setPageFilter('all'); setSearch('') }}
              >
                (Reset filters)
              </button>
            </div>
          </div>
        )}

        {/* ── DESKTOP TABLE VIEW (Compact, Zero-Overflow) ── */}
        <div className="admin-desktop-table">
          <div className="admin-table-wrap">
            <table className="admin-table admin-reactions-table">
              <thead>
                <tr>
                  <th style={{ width: '32%' }}>Entity &amp; Section</th>
                  <th style={{ width: '25%' }}>Likes (Boost + Organic)</th>
                  <th style={{ width: '23%' }}>Dislikes (Boost + Organic)</th>
                  <th style={{ width: '12%' }}>2-Wk Queue</th>
                  <th style={{ width: '8%', textAlign: 'right' }}>Save</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="admin-table-empty">
                      <span className="admin-spinner spin me-2"></span> Loading reactions…
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="admin-table-empty">
                      No matching entities found.
                    </td>
                  </tr>
                ) : (
                  filtered.map(r => {
                    const draft = drafts[r.entityId] || { boostLikes: r.boostLikes, boostDislikes: r.boostDislikes }
                    const isDirty = draft.boostLikes !== r.boostLikes || draft.boostDislikes !== r.boostDislikes
                    const isUpdating = updatingId === r.entityId

                    const totalCalcLikes = (draft.boostLikes || 0) + (r.userLikes || 0)
                    const totalCalcDislikes = (draft.boostDislikes || 0) + (r.userDislikes || 0)

                    return (
                      <tr key={r.entityId}>
                        {/* Entity & Section */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <div
                              className="admin-avatar-entity"
                              style={{
                                background: r.page === 'about' ? '#e0f2fe' : '#ede9fe',
                                color: r.page === 'about' ? '#0369a1' : '#6d28d9',
                              }}
                            >
                              {r.abbr ? r.abbr.substring(0, 3) : r.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>{r.name}</span>
                                <span className={`admin-pill ${r.page === 'about' ? 'admin-pill-ended' : 'admin-pill-resolved'}`} style={{ fontSize: '0.66rem', padding: '0.12rem 0.45rem' }}>
                                  {r.page === 'about' ? 'About WHTSIPA' : 'Officials'}
                                </span>
                              </div>
                              <div style={{ fontSize: '0.74rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {r.abbr ? <span style={{ fontWeight: 600, color: '#0d9488' }}>{r.abbr} · </span> : ''}
                                {r.role}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Likes Management */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
                            <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>Boost:</span>
                            <input
                              type="number"
                              className="admin-input-num"
                              value={draft.boostLikes}
                              min={0}
                              onChange={e => handleDraftChange(r.entityId, 'boostLikes', e.target.value)}
                            />
                            <button
                              type="button"
                              className="admin-btn admin-btn-ghost admin-btn-sm py-1 px-1"
                              style={{ fontSize: '0.68rem', borderRadius: '5px', padding: '0.2rem 0.4rem' }}
                              title="Quick add +1,000 likes"
                              onClick={() => handleQuickBoost(r.entityId, 1000)}
                            >
                              +1k
                            </button>
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                            Organic: <strong style={{ color: '#0f172a' }}>{r.userLikes || 0}</strong> · Total: <strong style={{ color: '#0d9488' }}>{formatReactionCount(totalCalcLikes)}</strong> ({totalCalcLikes.toLocaleString()})
                          </div>
                        </td>

                        {/* Dislikes Management */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
                            <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>Boost:</span>
                            <input
                              type="number"
                              className="admin-input-num"
                              value={draft.boostDislikes}
                              min={0}
                              onChange={e => handleDraftChange(r.entityId, 'boostDislikes', e.target.value)}
                            />
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                            Organic: <strong style={{ color: '#0f172a' }}>{r.userDislikes || 0}</strong> · Total: <strong style={{ color: '#b91c1c' }}>{formatReactionCount(totalCalcDislikes)}</strong> ({totalCalcDislikes.toLocaleString()})
                          </div>
                        </td>

                        {/* 2-Week Dislike Queue */}
                        <td>
                          {r.queuedDislikes > 0 ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <span className="admin-pill admin-pill-pending" style={{ fontSize: '0.7rem' }}>
                                {r.queuedDislikes} Queued
                              </span>
                              <button
                                type="button"
                                className="admin-btn admin-btn-ghost admin-btn-sm py-0 px-1"
                                style={{ fontSize: '0.65rem' }}
                                title="Reset queued dislikes"
                                onClick={() => handleResetQueue(r.entityId)}
                              >
                                Clear
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>0 queued</span>
                          )}
                          {r.lastDislikeReflectedAt && (
                            <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>
                              Last: {new Date(r.lastDislikeReflectedAt).toLocaleDateString()}
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className={`admin-btn admin-btn-sm ${isDirty ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.76rem' }}
                            disabled={isUpdating || !isDirty}
                            onClick={() => handleSave(r.entityId)}
                          >
                            {isUpdating ? <span className="admin-spinner spin me-1" /> : <i className={`bi ${isDirty ? 'bi-cloud-arrow-up' : 'bi-check2'} me-1`} />}
                            {isDirty ? 'Save' : 'Saved'}
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── MOBILE CARD LIST VIEW (Responsive Table-to-Card) ── */}
        <div className="admin-mobile-cards">
          {loading ? (
            <div className="admin-page-loading">
              <span className="admin-spinner spin me-2"></span> Loading reactions…
            </div>
          ) : filtered.length === 0 ? (
            <div className="admin-page-loading">No matching entities found.</div>
          ) : (
            filtered.map(r => {
              const draft = drafts[r.entityId] || { boostLikes: r.boostLikes, boostDislikes: r.boostDislikes }
              const isDirty = draft.boostLikes !== r.boostLikes || draft.boostDislikes !== r.boostDislikes
              const isUpdating = updatingId === r.entityId

              const totalCalcLikes = (draft.boostLikes || 0) + (r.userLikes || 0)
              const totalCalcDislikes = (draft.boostDislikes || 0) + (r.userDislikes || 0)

              return (
                <div key={r.entityId} className="admin-mobile-card">
                  {/* Top: Entity Info + Badge */}
                  <div className="admin-mobile-card-top">
                    <div>
                      <div className="admin-mobile-card-title">{r.name}</div>
                      <div className="admin-mobile-card-sub">
                        {r.abbr ? <span style={{ fontWeight: 600, color: '#0d9488' }}>{r.abbr} · </span> : ''}
                        {r.role}
                      </div>
                    </div>
                    <span className={`admin-pill ${r.page === 'about' ? 'admin-pill-ended' : 'admin-pill-resolved'}`}>
                      {r.page === 'about' ? 'About' : 'Officials'}
                    </span>
                  </div>

                  {/* Body: Inputs & Live Totals */}
                  <div className="admin-mobile-card-body">
                    {/* Likes Row */}
                    <div style={{ marginBottom: '0.65rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.84rem' }}>
                          <i className="bi bi-hand-thumbs-up-fill text-primary me-1"></i> Total Likes: <span style={{ color: '#0d9488' }}>{formatReactionCount(totalCalcLikes)}</span>
                        </span>
                        <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Organic: {r.userLikes || 0}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: '100%' }}>
                        <span style={{ fontSize: '0.78rem', color: '#64748b', flex: '0 0 auto', width: '42px' }}>Boost:</span>
                        <input
                          type="number"
                          className="admin-input-num"
                          style={{ flex: '1 1 0', minWidth: 0, width: '100%' }}
                          value={draft.boostLikes}
                          min={0}
                          onChange={e => handleDraftChange(r.entityId, 'boostLikes', e.target.value)}
                        />
                        <button
                          type="button"
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          style={{ flex: '0 0 auto', padding: '0.35rem 0.6rem', fontSize: '0.78rem' }}
                          onClick={() => handleQuickBoost(r.entityId, 1000)}
                        >
                          +1k
                        </button>
                      </div>
                    </div>

                    {/* Dislikes Row */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.84rem' }}>
                          <i className="bi bi-hand-thumbs-down-fill text-danger me-1"></i> Total Dislikes: <span style={{ color: '#b91c1c' }}>{formatReactionCount(totalCalcDislikes)}</span>
                        </span>
                        <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Organic: {r.userDislikes || 0}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: '100%' }}>
                        <span style={{ fontSize: '0.78rem', color: '#64748b', flex: '0 0 auto', width: '42px' }}>Boost:</span>
                        <input
                          type="number"
                          className="admin-input-num"
                          style={{ flex: '1 1 0', minWidth: 0, width: '100%' }}
                          value={draft.boostDislikes}
                          min={0}
                          onChange={e => handleDraftChange(r.entityId, 'boostDislikes', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer: Queue & Action Button */}
                  <div className="admin-mobile-card-footer">
                    <div>
                      {r.queuedDislikes > 0 ? (
                        <span className="admin-pill admin-pill-pending">
                          {r.queuedDislikes} Queued Dislikes
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>0 Queued</span>
                      )}
                    </div>
                    <button
                      type="button"
                      className={`admin-btn admin-btn-sm ${isDirty ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
                      disabled={isUpdating || !isDirty}
                      onClick={() => handleSave(r.entityId)}
                    >
                      {isUpdating ? <span className="admin-spinner spin me-1" /> : <i className={`bi ${isDirty ? 'bi-cloud-arrow-up' : 'bi-check2'} me-1`} />}
                      {isDirty ? 'Save Changes' : 'Saved'}
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
