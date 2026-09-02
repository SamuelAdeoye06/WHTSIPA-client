import { createContext, useCallback, useContext, useState } from 'react'
import './Toast.css'

const ToastContext = createContext(null)

let idCounter = 0

/* Global toast provider — mounted once at the app root (App.jsx) so both
   the public site and the admin panel share the same toast stack. Renders
   fixed top-right, stacks multiple toasts, auto-dismisses after `duration`. */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const showToast = useCallback((message, type = 'success', duration = 5000) => {
    const id = ++idCounter
    setToasts(prev => [...prev, { id, message, type }])
    if (duration) setTimeout(() => removeToast(id), duration)
    return id
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={`toast-item toast-${t.type}`}>
            <i className={
              t.type === 'success' ? 'bi bi-check-circle-fill' :
              t.type === 'error'   ? 'bi bi-exclamation-circle-fill' :
                                      'bi bi-info-circle-fill'
            }></i>
            <span className="toast-msg">{t.message}</span>
            <button className="toast-close" onClick={() => removeToast(t.id)} aria-label="Dismiss">
              <i className="bi bi-x"></i>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

/* showToast(message, type?, duration?) — type: 'success' | 'error' | 'info' */
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
