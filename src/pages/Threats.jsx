import { useState } from 'react'
import { Link } from 'react-router-dom'
import { QUIZ_LIST, QUIZ_DATA } from '../data/quizData'
import '../styles/cyber.css'
import './Threats.css'

/* ── Threat categories linking to detail pages ── */
const THREAT_CATS = [
  { emoji: '🧱', title: 'Ransomware',                  slug: 'ransomware',                  risk: 'high', desc: 'Extortion, encryption, and recovery readiness.' },
  { emoji: '🎣', title: 'Phishing Emails',              slug: 'phishing-emails',             risk: 'high', desc: 'Credential capture and malicious payload delivery.' },
  { emoji: '🎭', title: 'Deepfake Detection',           slug: 'deepfake',                    risk: 'mid',  desc: 'Authenticity, provenance, and trust verification.' },
  { emoji: '📨', title: 'Business Email Compromise',    slug: 'bec',                         risk: 'high', desc: 'Fraudulent transactions and fake authority.' },
  { emoji: '🧬', title: 'Malware Protection',           slug: 'malware',                     risk: 'mid',  desc: 'Containment and safe browsing hygiene.' },
  { emoji: '🪪', title: 'Identity Theft',               slug: 'identity-theft',              risk: 'low',  desc: 'Account takeover, monitoring, and secure recovery.' },
  { emoji: '🌐', title: 'DDoS Protection',              slug: 'ddos-protection',             risk: 'mid',  desc: 'Availability protection for critical services.' },
  { emoji: '☁️', title: 'Cloud Security',               slug: 'cloud-security',              risk: 'low',  desc: 'Guardrails for identity, access, and data integrity.' },
  { emoji: '🕵️', title: 'Spyware Detection',           slug: 'spyware-detection',           risk: 'mid',  desc: 'Detect stealth behaviors and protect your endpoints.' },
]

const RISK_LABEL = { high: 'HIGH RISK', mid: 'MED RISK', low: 'SECURE PATH' }


/* ── Quiz Modal Component ── */
function QuizModal({ slug, onClose, onFail }) {
  const quiz = QUIZ_DATA[slug]
  const [step, setStep]       = useState(0)   // current question index
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)  // 'correct' | 'wrong'
  const [score, setScore]     = useState(0)
  const [done, setDone]       = useState(false)

  if (!quiz) return null

  const q = quiz.questions[step]
  const total = quiz.questions.length

  const handleAnswer = (idx) => {
    if (selected !== null) return
    setSelected(idx)
    const isCorrect = idx === q.correct
    setFeedback(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) setScore(s => s + 1)
  }

  const handleNext = () => {
    if (step + 1 >= total) {
      // Calculate true final score — include this last answer since score state
      // hasn't updated yet (React state is async)
      const lastAnswerCorrect = selected === q.correct
      const trueScore = score + (lastAnswerCorrect ? 1 : 0)

      setDone(true)

      // Passing threshold is 4 out of 5 (80%) — below that = failed
      // Math.floor(total * 0.8) = 4 for a 5-question quiz
      if (trueScore < Math.ceil(total * 0.8)) {
        onFail(slug)
      }
    } else {
      setStep(s => s + 1)
      setSelected(null)
      setFeedback(null)
    }
  }

  const getResult = () => {
    if (score === total)        return { label: '🛡️ Secured!',   msg: 'Perfect score — you are fully threat-aware.',              color: 'var(--green)' }
    if (score === total - 1)    return { label: '🧠 Smart One!',  msg: 'Almost perfect — review the one you missed.',              color: 'var(--cyan)'  }
    return                             { label: '⚠️ You Failed',  msg: 'You need to improve. Try this scenario again.',            color: 'var(--red)'   }
  }


  return (
    <div className="quiz-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="quiz-modal-box" role="dialog" aria-modal="true" aria-label={`Quiz: ${quiz.title}`}>

        {/* Header */}
        <div className="quiz-modal-header">
          <div className="d-flex align-items-center gap-2">
            <span style={{ fontSize: '1.4rem' }}>{quiz.emoji}</span>
            <div>
              <div className="fw-bold text-white">{quiz.title}</div>
              <div className="text-muted-cyber" style={{ fontSize: '0.72rem' }}>
                {done ? 'Quiz Complete' : `Question ${step + 1} of ${total}`}
              </div>
            </div>
          </div>
          <button className="quiz-close-btn" onClick={onClose} aria-label="Close quiz">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Progress bar */}
        {!done && (
          <div className="quiz-progress">
            <div className="quiz-progress-fill" style={{ width: `${((step) / total) * 100}%` }} />
          </div>
        )}

        {/* Phone mock content */}
        {!done ? (
          <div className="quiz-phone-mock">
            <div className="quiz-phone-notch" />
            <div className="quiz-phone-screen">

              {/* Step label */}
              <div className="text-muted-cyber small mb-2" style={{ fontSize: '0.7rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {q.q}
              </div>

              {/* Question */}
              <div className="quiz-question">{q.prompt}</div>

              {/* Options */}
              <div className="quiz-options">
                {q.options.map((opt, i) => {
                  let cls = 'quiz-option'
                  if (selected !== null) {
                    if (i === q.correct)  cls += ' correct'
                    else if (i === selected && i !== q.correct) cls += ' wrong'
                    else cls += ' dimmed'
                  }
                  return (
                    <button key={i} className={cls} onClick={() => handleAnswer(i)} disabled={selected !== null}>
                      <span className="quiz-option-letter">{String.fromCharCode(65 + i)}</span>
                      {opt}
                    </button>
                  )
                })}
              </div>

              {/* Feedback */}
              {feedback && (
                <div className={`quiz-feedback ${feedback}`}>
                  {feedback === 'correct'
                    ? <><i className="bi bi-check-circle-fill me-2"></i>Correct!</>
                    : <><i className="bi bi-x-circle-fill me-2"></i>Whoops! The right answer was highlighted above.</>
                  }
                </div>
              )}

              {/* Next button */}
              {selected !== null && (
                <button className="btn btn-cyber w-100 mt-3" onClick={handleNext}>
                  {step + 1 >= total ? 'See Results' : 'Continue →'}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Results screen */
          <div className="quiz-results">
            {(() => {
              const r = getResult()
              return (
                <>
                  <div className="quiz-result-score" style={{ color: r.color }}>{score}/{total}</div>
                  <div className="quiz-result-label" style={{ color: r.color }}>{r.label}</div>
                  <div className="text-muted-cyber text-center mb-4">{r.msg}</div>
                  <div className="d-flex gap-2 justify-content-center flex-wrap">
                    <button className="btn btn-outline-cyber" onClick={() => { setStep(0); setSelected(null); setFeedback(null); setScore(0); setDone(false) }}>
                      <i className="bi bi-arrow-repeat me-2"></i>Retry
                    </button>
                    <button className="btn btn-cyber" onClick={onClose}>
                      Done
                    </button>
                  </div>
                </>
              )
            })()}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Main Threats Page ── */
export default function Threats() {
  const [activeQuiz, setActiveQuiz] = useState(null)

  // Tracks which quiz slugs the user has failed — persists across quiz sessions
  const [failedScenarios, setFailedScenarios] = useState([])
  const [showRepPrompt, setShowRepPrompt] = useState(false)

  const handleFail = (slug) => {
    setFailedScenarios(prev => {
      // Only count each unique scenario once
      if (prev.includes(slug)) return prev
      const updated = [...prev, slug]
      // PDF rule: 3 or more unique failed scenarios triggers the modal
      if (updated.length >= 3) setShowRepPrompt(true)
      return updated
    })
  }
  return (
    <>
      {/* ── Quiz Modal ── */}
      {activeQuiz && (
        <QuizModal
          slug={activeQuiz}
          onClose={() => setActiveQuiz(null)}
          onFail={handleFail}
        />
      )}

      {/* PDF requirement: show rep contact prompt after 3+ failed scenarios */}
      {showRepPrompt && (
        <div className="quiz-modal-backdrop" onClick={() => setShowRepPrompt(false)}>
          <div className="quiz-modal-box" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div className="quiz-modal-header">
              <div className="d-flex align-items-center gap-2">
                <span style={{ fontSize: '1.4rem' }}>⚠️</span>
                <div className="fw-bold text-white">You Need Help</div>
              </div>
              <button className="quiz-close-btn" onClick={() => setShowRepPrompt(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="p-4 text-center">
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🛡️</div>
              <div className="fw-bold text-white mb-2">You have failed {failedScenarios.length} different scenarios.</div>
              <p className="text-muted-cyber small mb-4">
                You need to protect yourself. Contact an Active Representative now
                — they will guide you through staying safe online.
              </p>
              {/* ── BACKEND NOTE: Replace the href below with the actual Telegram link from the client ── */}
              <a
                href="https://t.me/WHTS_support"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-alert w-100 mb-2"
              >
                <i className="bi bi-telegram me-2"></i>Contact Active Representative
              </a>
              <button className="btn btn-outline-cyber w-100" onClick={() => setShowRepPrompt(false)}>
                Keep Practicing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════
          HERO
          ════════════════════════════ */}
      <header className="threats-hero">
        <div className="cyber-grid" aria-hidden="true" />
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center g-4 py-5">
            <div className="col-12 col-lg-7">

              <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
                <span className="pill low">
                  <span className="dot" /><span className="fw-bold" style={{ fontSize: '0.7rem' }}>LIVE TRAINING</span>
                </span>
                <span className="text-muted-cyber small">Threat education · Prevention-first</span>
              </div>

              <h1 className="glow-text fw-bold mb-3">Know Your Threats.<br />Stay One Step Ahead.</h1>

              <p className="text-muted-cyber mb-4" style={{ maxWidth: '54ch' }}>
                Learn how cyber threats work, test yourself with real-scenario quizzes,
                and take the right action before it is too late.
              </p>

              <div className="d-flex gap-2 flex-wrap">
                <a className="btn btn-cyber" href="#quizzes">
                  <i className="bi bi-controller me-2"></i>Start a Quiz
                </a>
                <a className="btn btn-outline-cyber" href="#categories">
                  <i className="bi bi-grid me-2"></i>Threat Library
                </a>
                <Link className="btn btn-alert" to="/report">
                  <i className="bi bi-exclamation-triangle me-2"></i>Need Urgent Help?
                </Link>
              </div>

            </div>

            <div className="col-12 col-lg-5">
              <div className="banner p-4">
                <div className="text-muted-cyber small mb-1">Education Mode</div>
                <div className="fw-bold fs-5 glow-text mb-3">17 Threat Scenarios</div>
                <div className="scan-bar mb-2"><span /></div>
                <div className="text-muted-cyber small mb-4">Interactive quizzes · Instant feedback · Score tracking</div>
                <div className="d-flex align-items-start gap-3">
                  <div className="icon-box">🛡️</div>
                  <div>
                    <div className="fw-bold">Built from real-world patterns</div>
                    <div className="text-muted-cyber small">Every scenario is based on actual cybercrime methods reported to WHTS.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ════════════════════════════
          THREAT CATEGORIES
          ════════════════════════════ */}
      <section className="section-pad-lg" id="categories">
        <div className="container">
          <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-4">
            <div>
              <div className="section-label mb-2">Threat Library</div>
              <h2 className="fw-bold mb-1">Threat Categories</h2>
              <p className="text-muted-cyber mb-0">Click any category to read full details and prevention steps.</p>
            </div>
            <a className="btn btn-outline-cyber d-none d-md-inline-flex" href="#quizzes">
              Jump to Quizzes
            </a>
          </div>

          <div className="row g-3">
            {THREAT_CATS.map(cat => (
              <div key={cat.slug} className="col-12 col-md-6 col-lg-4">
                <Link to={`/threats/${cat.slug}`} className="text-decoration-none d-block h-100">
                  <div className="card-glass card-hover p-3 h-100">
                    <div className="d-flex align-items-start gap-3 mb-3">
                      <div className="icon-box">{cat.emoji}</div>
                      <div>
                        <div className="fw-bold text-white mb-1">{cat.title}</div>
                        <div className="text-muted-cyber small">{cat.desc}</div>
                      </div>
                    </div>
                    <span className={`pill ${cat.risk}`}>
                      <span className="dot" /><span className="fw-bold" style={{ fontSize: '0.68rem' }}>{RISK_LABEL[cat.risk]}</span>
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════
          SPOT A SCAM QUIZ GRID
          ════════════════════════════ */}
      <section className="section-pad-lg" id="quizzes" style={{ background: 'rgba(5,9,19,0.6)' }}>
        <div className="container">
          <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-4">
            <div>
              <div className="section-label mb-2">Interactive Training</div>
              <h2 className="fw-bold mb-1">Spot a Scam Quiz</h2>
              <p className="text-muted-cyber mb-0">Pick any scenario and test your threat awareness. 5 questions each.</p>
            </div>
            <span className="pill mid d-none d-md-inline-flex">
              <span className="dot" /><span className="fw-bold" style={{ fontSize: '0.7rem' }}>EDUCATION MODE</span>
            </span>
          </div>

          <div className="row g-3">
            {QUIZ_LIST.map(quiz => (
              <div key={quiz.slug} className="col-12 col-md-6 col-lg-4">
                <div className="quiz-card-item h-100">
                  <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
                    <div className="icon-box">{quiz.emoji}</div>
                    <span className={`pill ${quiz.risk}`}>
                      <span className="dot" />
                      <span className="fw-bold" style={{ fontSize: '0.65rem' }}>{RISK_LABEL[quiz.risk]}</span>
                    </span>
                  </div>
                  <div className="fw-bold text-white mb-1">{quiz.title}</div>
                  <div className="text-muted-cyber small mb-3">
                    {QUIZ_DATA[quiz.slug]?.desc}
                  </div>
                  <button
                    className="btn btn-outline-cyber w-100 mt-auto"
                    onClick={() => setActiveQuiz(quiz.slug)}
                  >
                    <i className="bi bi-play-fill me-2"></i>Start Quiz
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════
          FINAL CTA
          ════════════════════════════ */}
      <section className="section-pad">
        <div className="container">
          <div className="banner p-4 p-md-5 text-center">
            <div className="section-label mb-3">Need Real Help?</div>
            <h2 className="fw-bold glow-text mb-3">Think You've Been Targeted?</h2>
            <p className="text-muted-cyber mb-4 mx-auto" style={{ maxWidth: '50ch' }}>
              If you've experienced any of these threats for real, don't wait.
              Report it now and let WHTS guide your recovery.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link className="btn btn-alert" to="/report">
                <i className="bi bi-exclamation-triangle me-2"></i>Report an Incident
              </Link>
              <Link className="btn btn-cyber" to="/report#recover">
                <i className="bi bi-shield-check me-2"></i>Start Recovery
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}