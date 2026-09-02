import { useState } from 'react'
import api from '../../../services/api'
import { useToast } from '../../../context/ToastContext'

const IMAGE_EXTS  = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic']
const OFFICE_EXTS = ['doc', 'docx']

function getFileName(url) {
  try {
    const { pathname } = new URL(url)
    return decodeURIComponent(pathname.split('/').pop() || 'file')
  } catch {
    return 'file'
  }
}

function getExt(fileName) {
  const dot = fileName.lastIndexOf('.')
  return dot !== -1 ? fileName.slice(dot + 1).toLowerCase() : ''
}

/* Renders one evidence file as a chip. Clicking it opens a preview modal —
   there is deliberately no plain download link anywhere else. Downloading
   only happens via the button inside this modal, after the admin has had
   the file rendered in front of them (or been shown that no preview is
   available for that type), never as a blind click straight to a file URL. */
export default function AttachmentViewer({ url }) {
  const { showToast } = useToast()
  const [open, setOpen]           = useState(false)
  const [emailOpen, setEmailOpen] = useState(false)
  const [emailTo, setEmailTo]     = useState('')
  const [sending, setSending]     = useState(false)

  const fileName = getFileName(url)
  const ext      = getExt(fileName)
  const isImage  = IMAGE_EXTS.includes(ext)
  const isPdf    = ext === 'pdf'
  const isOffice = OFFICE_EXTS.includes(ext)

  const closeModal = () => { setOpen(false); setEmailOpen(false); setEmailTo('') }

  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const handleSendEmail = async (e) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTo.trim())) {
      showToast('Enter a valid email address.', 'error')
      return
    }
    setSending(true)
    try {
      await api.post('/admin/send-attachment', { url, to: emailTo.trim() })
      showToast('Attachment sent.', 'success')
      setEmailOpen(false)
      setEmailTo('')
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not send this attachment.', 'error')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <button type="button" className="attachment-chip" onClick={() => setOpen(true)}>
        <i className={`bi ${isImage ? 'bi-image' : isPdf ? 'bi-file-earmark-pdf' : isOffice ? 'bi-file-earmark-word' : 'bi-file-earmark'}`}></i>
        <span className="attachment-chip-name">{fileName}</span>
        <span className="attachment-chip-view">View</span>
      </button>

      {open && (
        <div className="admin-confirm-overlay" onClick={closeModal}>
          <div className="attachment-modal" onClick={e => e.stopPropagation()}>
            <div className="attachment-modal-header">
              <span className="attachment-modal-title">{fileName}</span>
              <button className="attachment-modal-close" onClick={closeModal} aria-label="Close">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="attachment-modal-preview">
              {isImage && <img src={url} alt={fileName} />}
              {isPdf && <iframe src={url} title={fileName} />}
              {isOffice && (
                <iframe
                  src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`}
                  title={fileName}
                />
              )}
              {!isImage && !isPdf && !isOffice && (
                <div className="attachment-modal-nopreview">
                  <i className="bi bi-file-earmark-x"></i>
                  <p>No inline preview available for this file type.</p>
                </div>
              )}
            </div>

            <div className="attachment-modal-actions">
              <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setEmailOpen(v => !v)}>
                <i className="bi bi-envelope"></i> Email as Attachment
              </button>
              <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={handleDownload}>
                <i className="bi bi-download"></i> Download
              </button>
            </div>

            {emailOpen && (
              <form onSubmit={handleSendEmail} className="attachment-email-form">
                <input
                  type="email"
                  className="admin-search-input"
                  placeholder="recipient@example.com"
                  value={emailTo}
                  onChange={e => setEmailTo(e.target.value)}
                  autoFocus
                  style={{ flex: 1 }}
                />
                <button type="submit" className="admin-btn admin-btn-primary admin-btn-sm" disabled={sending}>
                  {sending ? 'Sending…' : 'Send'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
