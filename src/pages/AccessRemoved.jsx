import '../styles/cyber.css'

// Third-strike dead end for a restricted account's session. Deliberately
// has no links, no nav, no "Go Home" button, no way to get back into the
// app from here — see authRedirect.js's forceRestrictedRedirect() for why.
export default function AccessRemoved() {
  return (
    <div className="page-light">
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <i className="bi bi-shield-x" style={{ fontSize: '3rem', color: '#dc2626', marginBottom: '1rem' }}></i>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          Access Removed
        </h1>
        <p style={{ color: '#6b7280', maxWidth: 420 }}>
          Your access to WHTSIPA has been removed. If you believe this is a mistake,
          please contact support directly rather than through this site.
        </p>
      </div>
    </div>
  )
}
