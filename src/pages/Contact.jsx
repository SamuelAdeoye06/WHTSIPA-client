import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/cyber.css'
import './Contact.css'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    // ── BACKEND: POST /api/contact with form data ──
    setSubmitted(true)
  }

  return (
    <>
      <header className="contact-hero">
        <div className="cyber-grid" aria-hidden="true" />
        <div className="container position-relative" style={{ zIndex: 2, paddingTop: '4rem', paddingBottom: '4rem' }}>
          <div className="section-label mb-2">Get In Touch</div>
          <h1 className="glow-text fw-bold mb-3">Contact WHTS</h1>
          <p className="text-muted-cyber" style={{ maxWidth: '52ch' }}>
            Have a question, want to report something urgently, or need to reach our
            Active Representative? We're here.
          </p>
        </div>
      </header>

      <section className="section-pad-lg">
        <div className="container">
          <div className="row g-4">

            {/* Contact form */}
            <div className="col-12 col-lg-7">
              {submitted ? (
                <div className="banner p-5 text-center">
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                  <h3 className="fw-bold glow-text mb-3">Message Sent</h3>
                  <p className="text-muted-cyber mb-4">
                    Thank you for reaching out. Our team will get back to you as soon as possible.
                  </p>
                  <button className="btn btn-outline-cyber" onClick={() => { setSubmitted(false); setForm({ name:'', email:'', subject:'', message:'' }) }}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div className="card-glass p-4 p-md-5">
                  <h3 className="fw-bold mb-4">Send us a Message</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-12 col-sm-6">
                        <label className="cyber-label">Full Name</label>
                        <div className="contact-input-wrap">
                          <i className="bi bi-person contact-icon"></i>
                          <input className="form-control cyber-input ps-contact" type="text"
                            placeholder="Your full name" value={form.name} onChange={set('name')} required />
                        </div>
                      </div>
                      <div className="col-12 col-sm-6">
                        <label className="cyber-label">Email Address</label>
                        <div className="contact-input-wrap">
                          <i className="bi bi-envelope contact-icon"></i>
                          <input className="form-control cyber-input ps-contact" type="email"
                            placeholder="you@example.com" value={form.email} onChange={set('email')} required />
                        </div>
                      </div>
                      <div className="col-12">
                        <label className="cyber-label">Subject</label>
                        <div className="contact-input-wrap">
                          <i className="bi bi-chat-left-text contact-icon"></i>
                          <input className="form-control cyber-input ps-contact" type="text"
                            placeholder="What is this about?" value={form.subject} onChange={set('subject')} required />
                        </div>
                      </div>
                      <div className="col-12">
                        <label className="cyber-label">Message</label>
                        <textarea className="form-control cyber-input" rows={5}
                          placeholder="Type your message here..."
                          value={form.message} onChange={set('message')} required />
                      </div>
                      <div className="col-12">
                        <button type="submit" className="btn btn-cyber w-100" style={{ padding: '0.85rem' }}>
                          <i className="bi bi-send me-2"></i>Send Message
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Contact info sidebar */}
            <div className="col-12 col-lg-5">
              <div className="d-flex flex-column gap-3">

                <div className="banner p-4">
                  <div className="section-label mb-2">Emergency Support</div>
                  <h4 className="fw-bold mb-2">Need Help Right Now?</h4>
                  <p className="text-muted-cyber small mb-3">
                    If you're actively experiencing a cybersecurity incident, don't wait —
                    use our secure reporting portal immediately.
                  </p>
                  <Link className="btn btn-alert w-100" to="/report">
                    <i className="bi bi-exclamation-triangle me-2"></i>Report an Incident
                  </Link>
                </div>

                <div className="card-glass p-4">
                  <div className="fw-bold mb-3">Other Ways to Reach Us</div>
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="icon-box" style={{ background: 'rgba(0,136,204,0.12)', border: '1px solid rgba(0,136,204,0.3)', flexShrink: 0 }}>
                        <i className="bi bi-telegram" style={{ color: '#0088cc' }}></i>
                      </div>
                      <div>
                        <div className="fw-bold small">Telegram</div>
                        {/* ── CLIENT: Replace with actual Telegram link ── */}
                        <a href="https://t.me/WHTS_support" target="_blank" rel="noopener noreferrer"
                          className="text-muted-cyber small" style={{ textDecoration: 'none' }}>
                          @WHTS_support
                        </a>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <div className="icon-box" style={{ flexShrink: 0 }}>
                        <i className="bi bi-globe" style={{ color: 'var(--cyan)' }}></i>
                      </div>
                      <div>
                        <div className="fw-bold small">Official Website</div>
                        <a href="https://wehelptrackscammersipaddress.com" target="_blank"
                          rel="noopener noreferrer" className="text-muted-cyber small"
                          style={{ textDecoration: 'none' }}>
                          wehelptrackscammersipaddress.com
                        </a>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <div className="icon-box" style={{ flexShrink: 0 }}>💬</div>
                      <div>
                        <div className="fw-bold small">Live Chat</div>
                        <div className="text-muted-cyber small">Available on the Report page — a representative joins urgent cases.</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-glass p-4">
                  <div className="fw-bold mb-2 small" style={{ color: 'rgba(233,243,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Response Time
                  </div>
                  <div className="d-flex gap-3">
                    <div className="stat flex-1 text-center">
                      <div className="value" style={{ fontSize: '1.4rem' }}>24/7</div>
                      <div className="text-muted-cyber small mt-1">Emergency reports</div>
                    </div>
                    <div className="stat flex-1 text-center">
                      <div className="value" style={{ fontSize: '1.4rem' }}>48h</div>
                      <div className="text-muted-cyber small mt-1">General enquiries</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}