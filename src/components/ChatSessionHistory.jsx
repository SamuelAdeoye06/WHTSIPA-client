/**
 * ChatSessionHistory
 * ------------------
 * Shown as the "home screen" inside every WHTSIPA live-chat modal when the
 * user is authenticated and has at least one previous ticket.
 *
 * Features
 *  • Lists previous sessions with status pill + date
 *  • Blue unread dot on tickets that are ended and not yet read (isReadByVisitor=false)
 *  • "Ended" sessions show a locked card with the closing summary — cannot be re-opened
 *  • Active sessions show a "Continue" option
 *  • "Start New Chat" launches the current page's chat flow as usual
 *
 * Props
 *  user          – auth user object (null = guest, hides component)
 *  onNewChat     – callback to bypass history and start a fresh chat
 *  chatLabel     – label for the "Start New Chat" button context (e.g. "Support Chat")
 */
import { useState, useEffect } from 'react'
import api from '../services/api'
import { formatChatDate } from '../utils/dateFormatter'

const STATUS_LABELS = {
  open:        { label: 'Open',        cls: 'badge bg-primary' },
  'in-progress': { label: 'In Progress', cls: 'badge bg-warning text-dark' },
  resolved:    { label: 'Resolved',    cls: 'badge bg-success' },
  ended:       { label: 'Ended',       cls: 'badge bg-secondary' },
}

const TYPE_LABELS = {
  report:    '📝 Incident Report',
  hire:      '🤝 Hire Request',
  request:   '🔧 Tool Request',
  livechat:  '💬 Live Chat',
}

export default function ChatSessionHistory({ user, onNewChat, chatLabel = 'New Chat' }) {
  const [tickets,  setTickets]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [expanded, setExpanded] = useState(null) // ticket._id that is expanded

  useEffect(() => {
    if (!user) { setLoading(false); return }
    api.get('/tickets/mine')
      .then(({ data }) => setTickets(data))
      .catch(() => setTickets([]))
      .finally(() => setLoading(false))
  }, [user])

  // Mark a ticket as read when the user expands it
  const handleExpand = async (ticket) => {
    const next = expanded === ticket._id ? null : ticket._id
    setExpanded(next)
    if (next && !ticket.isReadByVisitor && ticket.status === 'ended') {
      try {
        await api.patch(`/tickets/${ticket._id}/activity`, { isReadByVisitor: true })
        setTickets(prev => prev.map(t =>
          t._id === ticket._id ? { ...t, isReadByVisitor: true } : t
        ))
      } catch { /* silent */ }
    }
  }

  // Count unread ended tickets for the dot on the "Previous Sessions" header
  const unreadCount = tickets.filter(t => t.status === 'ended' && !t.isReadByVisitor).length

  if (!user) return null

  return (
    <div className="csh-wrapper">
      {/* ── Header row ── */}
      <div className="csh-header">
        <span className="csh-header-label">
          Previous Sessions
          {unreadCount > 0 && (
            <span className="csh-unread-badge" title={`${unreadCount} unread update${unreadCount > 1 ? 's' : ''}`}>
              {unreadCount > 6 ? '+6' : unreadCount}
            </span>
          )}
        </span>
        <button className="csh-new-btn" onClick={onNewChat}>
          <i className="bi bi-plus-circle me-1"></i>{chatLabel}
        </button>
      </div>

      {/* ── Session list ── */}
      {loading ? (
        <div className="csh-loading">
          <span className="typing-dot"></span>
          <span className="typing-dot"></span>
          <span className="typing-dot"></span>
        </div>
      ) : tickets.length === 0 ? (
        <div className="csh-empty">
          <i className="bi bi-chat-square-dots csh-empty-icon"></i>
          <p>No previous sessions</p>
          <button className="csh-start-btn" onClick={onNewChat}>
            Start a conversation
          </button>
        </div>
      ) : (
        <div className="csh-list">
          {tickets.map(ticket => {
            const isEnded   = ticket.status === 'ended'
            const isUnread  = isEnded && !ticket.isReadByVisitor
            const isOpen    = expanded === ticket._id
            const statusMeta = STATUS_LABELS[ticket.status] || STATUS_LABELS.open

            return (
              <div
                key={ticket._id}
                className={`csh-item ${isEnded ? 'csh-item--ended' : 'csh-item--active'} ${isOpen ? 'csh-item--open' : ''}`}
              >
                {/* ── Summary row ── */}
                <button
                  className="csh-item-header"
                  onClick={() => handleExpand(ticket)}
                  aria-expanded={isOpen}
                >
                  <div className="csh-item-header-main">
                    <div className="csh-item-row-top">
                      <div className="csh-item-type-wrap">
                        {isUnread && <span className="csh-unread-dot" title="New update"></span>}
                        <span className="csh-item-type">{TYPE_LABELS[ticket.type] || '💬 Session'}</span>
                      </div>
                      <div className="csh-item-right">
                        <span className={statusMeta.cls} style={{ fontSize: '0.68rem' }}>{statusMeta.label}</span>
                        <span className="csh-item-date">{formatChatDate(ticket.createdAt)}</span>
                        <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'} csh-chevron`}></i>
                      </div>
                    </div>

                    {(ticket.threatTitle || ticket.summary) && (
                      <div className="csh-item-row-sub">
                        {ticket.threatTitle || ticket.summary}
                      </div>
                    )}
                  </div>
                </button>

                {/* ── Expanded detail ── */}
                {isOpen && (
                  <div className="csh-item-body">
                    {/* Ticket ID */}
                    <div className="csh-ticket-id">
                      <i className="bi bi-hash"></i> {ticket.ticketId}
                    </div>

                    {/* Ended = locked + show closing summary */}
                    {isEnded ? (
                      <div className="csh-ended-card">
                        <div className="csh-ended-icon">
                          <i className="bi bi-lock-fill"></i>
                        </div>
                        <div className="csh-ended-content">
                          <div className="csh-ended-title">Chat Session Ended</div>
                          {ticket.closingSummary ? (
                            <p className="csh-ended-summary">{ticket.closingSummary}</p>
                          ) : (
                            <p className="csh-ended-summary">
                              This chat session has been closed. If you need further assistance, please start a new conversation.
                            </p>
                          )}
                          <div className="csh-ended-hint">
                            <i className="bi bi-info-circle me-1"></i>
                            Ended sessions cannot be reopened. Start a new chat to continue.
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Active / in-progress — show summary and a continue option */
                      <div>
                        {ticket.summary && (
                          <p className="csh-item-summary">{ticket.summary}</p>
                        )}
                        <div className="csh-active-actions">
                          <span className="csh-active-hint">
                            <i className="bi bi-clock me-1"></i>
                            Open since {formatChatDate(ticket.createdAt)}
                          </span>
                          <button className="csh-continue-btn" onClick={onNewChat}>
                            Continue Chat <i className="bi bi-arrow-right ms-1"></i>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── Bottom action footer ── */}
      <div className="csh-footer p-3">
        <button
          type="button"
          className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
          onClick={onNewChat}
          style={{
            backgroundColor: '#1d4ed8',
            borderColor: '#1d4ed8',
            borderRadius: '12px',
            padding: '0.65rem 1rem',
            fontWeight: 700,
            fontSize: '0.85rem'
          }}
        >
          <i className="bi bi-chat-plus-fill"></i>
          Start New Conversation
        </button>
      </div>
    </div>
  )
}
