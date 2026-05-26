import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/cyber.css'
import './Blog.css'

const ARTICLES = [
  {
    slug: 'recognize-phishing-emails',
    title: 'How to Recognize Phishing Emails',
    category: 'Email Safety',
    date: 'May 2026',
    readTime: '5 min read',
    emoji: '🎣',
    excerpt: 'Phishing emails have become increasingly sophisticated — often indistinguishable from legitimate messages. Learn the key signs of phishing emails and how to protect yourself before you click.',
    content: `Phishing emails are crafted to look exactly like messages from trusted brands — your bank, 
    Netflix, PayPal, or even your employer. Here are the signs that give them away every time.
    
    **Check the sender domain.** The display name can say anything, but the actual email address reveals the truth. 
    "PayPal Support" sent from "support@paypal-secure-login.com" is a phishing attempt — the real domain is paypal.com.
    
    **Hover before you click.** Hovering over any link reveals its true destination in your browser's status bar. 
    If the displayed text says "paypal.com" but the URL shows something different — do not click.
    
    **Watch for urgency.** "Your account will be suspended in 24 hours" is a pressure tactic. 
    Legitimate companies give you time to act and never threaten immediate consequences via unsolicited email.
    
    **Generic greetings are a red flag.** "Dear Customer" instead of your actual name suggests the email 
    was sent in bulk to thousands of addresses — not targeted at you specifically.
    
    **When in doubt — go direct.** Never click links in suspicious emails. Instead, open your browser 
    and go directly to the company's official website to check your account.`,
  },
  {
    slug: 'protecting-online-banking',
    title: 'Protecting Your Online Banking',
    category: 'Financial Security',
    date: 'April 2026',
    readTime: '6 min read',
    emoji: '🏦',
    excerpt: 'Your bank account is the primary target in most cybercrime. These essential tips protect your online banking from the most common attack vectors used against everyday users.',
    content: `Online banking fraud costs consumers billions annually. The good news is that most attacks 
    are preventable with the right habits and security settings in place.
    
    **Enable transaction alerts.** Set up SMS or email alerts for every transaction — even small ones. 
    Attackers often test with small amounts before making large withdrawals.
    
    **Use a dedicated device for banking.** If possible, use one device exclusively for banking — 
    never for general browsing, social media, or email. This dramatically reduces your attack surface.
    
    **Never bank on public WiFi.** Even with a VPN, avoid accessing banking apps or websites on 
    public networks. If you must, use your mobile data connection instead.
    
    **Enable MFA with an authenticator app.** SMS-based MFA can be bypassed via SIM swap. 
    An authenticator app like Google Authenticator is significantly more secure.
    
    **Monitor your credit report.** Regularly check your credit report for accounts or 
    enquiries you don't recognize — these are early signs of identity theft.`,
  },
  {
    slug: 'what-to-do-if-scammed',
    title: "What to Do If You're Scammed",
    category: 'Recovery Guide',
    date: 'March 2026',
    readTime: '8 min read',
    emoji: '🧭',
    excerpt: 'Being scammed is disorienting and distressing. This step-by-step guide walks you through exactly what to do in the first 24 hours after discovering you have been targeted.',
    content: `The first 24 hours after discovering a scam are critical. Acting quickly limits the damage 
    and preserves evidence for investigation. Here is exactly what to do.
    
    **Step 1 — Stop all contact immediately.** Do not respond to the scammer, negotiate, or send 
    additional money. Every interaction gives them more leverage and more of your data.
    
    **Step 2 — Document everything before blocking.** Screenshot all messages, emails, social media 
    profiles, transaction receipts, and any other evidence. Once you block them, this data may be lost.
    
    **Step 3 — Secure your accounts.** Change passwords on all accounts, starting with your email. 
    Enable MFA everywhere. Revoke any access or permissions you granted.
    
    **Step 4 — Contact your bank.** If money was sent, contact your bank immediately and request 
    a transaction reversal or hold. Speed is critical — banks can sometimes recover funds sent 
    within the same day.
    
    **Step 5 — Report it.** File reports with WHTS, the FTC (reportfraud.ftc.gov), the FBI IC3 
    (ic3.gov), and your local police. A report number is important for insurance and legal purposes.
    
    **Step 6 — Seek support.** Being scammed is traumatic. Talk to someone you trust. 
    WHTS counselors can help you navigate both the practical and emotional recovery process.`,
  },
]

const CATEGORIES = ['All', 'Email Safety', 'Financial Security', 'Recovery Guide']

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeArticle, setActiveArticle] = useState(null)

  const filtered = activeCategory === 'All'
    ? ARTICLES
    : ARTICLES.filter(a => a.category === activeCategory)

  if (activeArticle) {
    const article = ARTICLES.find(a => a.slug === activeArticle)
    return (
      <div className="blog-article-page">
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem', maxWidth: 760 }}>
          <button className="btn btn-outline-cyber mb-4" onClick={() => setActiveArticle(null)}>
            <i className="bi bi-arrow-left me-2"></i>Back to Knowledge Base
          </button>
          <div className="section-label mb-2">{article.category}</div>
          <h1 className="fw-bold glow-text mb-3">{article.title}</h1>
          <div className="d-flex align-items-center gap-3 mb-4 text-muted-cyber small">
            <span><i className="bi bi-calendar me-1"></i>{article.date}</span>
            <span><i className="bi bi-clock me-1"></i>{article.readTime}</span>
          </div>
          <div className="scan-bar mb-5"><span /></div>
          <div className="blog-content">
            {article.content.split('\n\n').map((para, i) => {
              if (para.startsWith('**') && para.includes('.**')) {
                const [bold, ...rest] = para.split('.**')
                return (
                  <p key={i}>
                    <strong style={{ color: 'var(--cyan)' }}>{bold.replace(/\*\*/g, '')}.</strong>
                    {rest.join('.**')}
                  </p>
                )
              }
              return <p key={i} className="text-muted-cyber">{para.trim()}</p>
            })}
          </div>
          <div className="banner p-4 mt-5 text-center">
            <h4 className="fw-bold mb-2">Think You've Been Targeted?</h4>
            <p className="text-muted-cyber small mb-3">Don't wait — report it now and get guided recovery support.</p>
            <Link className="btn btn-alert" to="/report">
              <i className="bi bi-exclamation-triangle me-2"></i>Report an Incident
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* ── Hero ── */}
      <header className="blog-hero">
        <div className="cyber-grid" aria-hidden="true" />
        <div className="container position-relative" style={{ zIndex: 2, paddingTop: '4rem', paddingBottom: '4rem' }}>
          <div className="text-center">
            <div className="section-label mb-2">Knowledge Base</div>
            <h1 className="glow-text fw-bold mb-3">
              Latest Alerts on<br />
              <span style={{ color: 'var(--cyan)' }}>WeHelpTrackScammersIpAddress.com</span>
            </h1>
            <p className="text-muted-cyber mx-auto" style={{ maxWidth: '52ch' }}>
              Guides, advisories, and intelligence updates to keep you informed
              and protected against evolving cyber threats.
            </p>
          </div>
        </div>
      </header>

      {/* ── Articles ── */}
      <section className="section-pad-lg">
        <div className="container">

          {/* Category filter */}
          <div className="d-flex gap-2 flex-wrap mb-5">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`blog-filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Articles grid */}
          <div className="row g-4">
            {filtered.map((article, i) => (
              <div key={article.slug} className="col-12 col-md-6 col-lg-4">
                <div
                  className="blog-card h-100"
                  onClick={() => setActiveArticle(article.slug)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setActiveArticle(article.slug)}
                >
                  <div className="blog-card-emoji">{article.emoji}</div>
                  <div className="p-4">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="section-label" style={{ fontSize: '0.65rem' }}>{article.category}</span>
                    </div>
                    <h3 className="fw-bold mb-2" style={{ fontSize: '1rem', color: '#f0f4ff', lineHeight: 1.4 }}>
                      {article.title}
                    </h3>
                    <p className="text-muted-cyber small mb-3">{article.excerpt}</p>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="text-muted-cyber" style={{ fontSize: '0.75rem' }}>
                        {article.date} · {article.readTime}
                      </div>
                      <span className="blog-read-more">
                        Read <i className="bi bi-arrow-right ms-1"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  )
}