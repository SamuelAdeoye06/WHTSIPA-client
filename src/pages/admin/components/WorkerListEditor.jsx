import { useState } from 'react'
import api from '../../../services/api'
import { useToast } from '../../../context/ToastContext'
import { formatPhoneDisplay } from '../../../utils/phoneFormat'
import ConfirmDialog from './ConfirmDialog'

const EMPTY_FORM = { name: '', whatsapp: '', telegramHandle: '', email: '' }

/* Manages the worker roster for one page-context (Threats or Contact).
   Exactly one worker is "active" at a time — that's the one whose details
   actually render on the public page. Adding/editing/removing a worker
   never changes what's live; only "Make Active" does. */
export default function WorkerListEditor({ context, workers, activeWorkerId, onConfigUpdate }) {
  const { showToast } = useToast()
  const [adding, setAdding]         = useState(false)
  const [editingId, setEditingId]   = useState(null)
  const [form, setForm]             = useState(EMPTY_FORM)
  const [busy, setBusy]             = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const startAdd = () => { setForm(EMPTY_FORM); setEditingId(null); setAdding(true) }
  const startEdit = (worker) => {
    setForm({ name: worker.name, whatsapp: worker.whatsapp, telegramHandle: worker.telegramHandle, email: worker.email })
    setAdding(false)
    setEditingId(worker._id)
  }
  const cancelForm = () => { setAdding(false); setEditingId(null); setForm(EMPTY_FORM) }

  const handleSaveNew = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return showToast('Enter a name for this worker.', 'error')
    setBusy(true)
    try {
      const { data } = await api.post(`/admin/config/${context}/workers`, form)
      onConfigUpdate(data)
      showToast('Worker added.', 'success')
      cancelForm()
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not add this worker.', 'error')
    } finally {
      setBusy(false)
    }
  }

  const handleSaveEdit = async (e, workerId) => {
    e.preventDefault()
    if (!form.name.trim()) return showToast('Enter a name for this worker.', 'error')
    setBusy(true)
    try {
      const { data } = await api.put(`/admin/config/${context}/workers/${workerId}`, form)
      onConfigUpdate(data)
      showToast('Worker updated.', 'success')
      cancelForm()
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not update this worker.', 'error')
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setBusy(true)
    try {
      const { data } = await api.delete(`/admin/config/${context}/workers/${deleteTarget._id}`)
      onConfigUpdate(data)
      showToast('Worker removed.', 'success')
      setDeleteTarget(null)
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not remove this worker.', 'error')
    } finally {
      setBusy(false)
    }
  }

  const handleSetActive = async (workerId) => {
    setBusy(true)
    try {
      const { data } = await api.patch(`/admin/config/${context}/active-worker`, { workerId })
      onConfigUpdate(data)
      showToast('Now live on the site.', 'success')
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not switch the active worker.', 'error')
    } finally {
      setBusy(false)
    }
  }

  const renderForm = (onSubmit) => (
    <form onSubmit={onSubmit} className="worker-form">
      <div className="worker-form-grid">
        <input className="admin-search-input" placeholder="Name" value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        <div>
          <input className="admin-search-input" style={{ width: '100%' }}
            placeholder="WhatsApp — country code + number, no + (e.g. 16502184673 for US, 2348012345678 for Nigeria)"
            value={form.whatsapp}
            onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value.replace(/[^\d]/g, '') }))} />
          {form.whatsapp && (
            <div className="worker-form-preview">Will show as: {formatPhoneDisplay(form.whatsapp)}</div>
          )}
        </div>
        <input className="admin-search-input" placeholder="Telegram handle (no @)" value={form.telegramHandle}
          onChange={e => setForm(f => ({ ...f, telegramHandle: e.target.value.replace(/^@+/, '') }))} />
        <input className="admin-search-input" placeholder="Email" type="email" value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
      </div>
      <div className="worker-form-actions">
        <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={cancelForm} disabled={busy}>
          Cancel
        </button>
        <button type="submit" className="admin-btn admin-btn-primary admin-btn-sm" disabled={busy}>
          {busy ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  )

  return (
    <div className="worker-list">
      {workers.length === 0 && !adding && (
        <div className="worker-empty">No workers added yet for this page.</div>
      )}

      {workers.map(w => (
        <div key={w._id} className={`worker-card ${w._id === activeWorkerId ? 'worker-card-active' : ''}`}>
          {editingId === w._id ? (
            renderForm(e => handleSaveEdit(e, w._id))
          ) : (
            <>
              <div className="worker-card-main">
                <div className="worker-card-name">
                  {w.name}
                  {w._id === activeWorkerId && <span className="worker-live-pill">Live on site</span>}
                </div>
                <div className="worker-card-details">
                  {w.whatsapp && <span><i className="bi bi-whatsapp"></i> {formatPhoneDisplay(w.whatsapp)}</span>}
                  {w.telegramHandle && <span><i className="bi bi-telegram"></i> @{w.telegramHandle}</span>}
                  {w.email && <span><i className="bi bi-envelope"></i> {w.email}</span>}
                </div>
              </div>
              <div className="worker-card-actions">
                {w._id !== activeWorkerId && (
                  <button className="admin-btn admin-btn-ghost admin-btn-sm" disabled={busy} onClick={() => handleSetActive(w._id)}>
                    Make Active
                  </button>
                )}
                <button className="admin-btn admin-btn-ghost admin-btn-sm" disabled={busy} onClick={() => startEdit(w)}>
                  Edit
                </button>
                <button className="admin-btn admin-btn-danger admin-btn-sm" disabled={busy} onClick={() => setDeleteTarget(w)}>
                  Remove
                </button>
              </div>
            </>
          )}
        </div>
      ))}

      {adding ? (
        <div className="worker-card">{renderForm(handleSaveNew)}</div>
      ) : (
        <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={startAdd}>
          <i className="bi bi-plus-lg"></i> Add Worker
        </button>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        danger
        title="Remove this worker?"
        message={`This removes "${deleteTarget?.name}" from the list. If they're currently active, another worker on the list will automatically take over as live.`}
        confirmLabel="Remove"
        loading={busy}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
