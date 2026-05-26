import { Link } from 'react-router-dom'
import '../styles/cyber.css'
import './About.css'

import agencyDescFtc from '../assets/media/agency-desc-ftc.jpeg'
import agencyDescUsps from '../assets/media/agency-desc-usps.jpeg'
import agencyDescInterpol from '../assets/media/agency-desc-interpol.jpeg'
import agencyDescCisa from '../assets/media/agency-desc-cisa.jpeg'
import agencyDescDhs from '../assets/media/agency-desc-dhs.jpeg'
import agencyDescFbi from '../assets/media/agency-desc-fbi.jpeg'
import agencyDescSecretService from '../assets/media/agency-desc-secret-service.jpeg'
import agencyDescIrs from '../assets/media/agency-desc-irs.jpeg'

const OFFICIALS = [
  { abbr: 'FTC',      name: 'Federal Trade Commission',                       role: 'Consumer Protection & Fraud Enforcement',        img: agencyDescFtc },
  { abbr: 'USPIS',    name: 'US Postal Inspection Service',                   role: 'Mail Fraud & Parcel Scam Investigation',         img: agencyDescUsps },
  { abbr: 'INTERPOL', name: 'INTERPOL',                                       role: 'International Cross-Border Cybercrime',           img: agencyDescInterpol },
  { abbr: 'CISA',     name: 'Cybersecurity & Infrastructure Security Agency', role: 'National Cyber Infrastructure Protection',        img: agencyDescCisa },
  { abbr: 'DHS',      name: 'Department of Homeland Security',                role: 'Counter Intelligence of Threats',                 img: agencyDescDhs },
  { abbr: 'FBI',      name: 'FBI / Department of Justice',                    role: 'Cybercrime Investigation & IC3',                  img: agencyDescFbi },
  { abbr: 'USSS',     name: 'United States Secret Service',                   role: 'Financial Cybercrime & Access Device Fraud',      img: agencyDescSecretService },
  { abbr: 'IRS',      name: 'Internal Revenue Service',                       role: 'Tax Fraud & Financial Crime Investigation',       img: agencyDescIrs },
]

export default function AboutOfficials() {
  return (
    <>
      {/* ── Hero — centered ── */}
      <header className="about-hero">
        <div className="cyber-grid" aria-hidden="true" />
        <div className="container position-relative text-center" style={{ zIndex: 2, paddingTop: '4rem', paddingBottom: '4rem' }}>
          <div className="section-label mb-2">The Officials</div>
          <h1 className="glow-text fw-bold mb-3">
            Government Agencies &amp; Affiliated Partners
          </h1>
          <p className="text-muted-cyber mx-auto mb-4" style={{ maxWidth: '58ch', fontSize: '1.05rem' }}>
            WHTSIPA operates in formal alignment with these US government agencies and
            international law enforcement bodies. Every valid incident report submitted
            through our platform is shared with the relevant authority.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link className="btn btn-cyber" to="/about">
              <i className="bi bi-arrow-left me-2"></i>About WHTS
            </Link>
            <Link className="btn btn-alert" to="/report">
              <i className="bi bi-exclamation-triangle me-2"></i>Report an Incident
            </Link>
          </div>
        </div>
      </header>

      {/* ── Officials image grid ── */}
      <section className="section-pad-lg">
        <div className="container">
          <div className="row g-4">
            {OFFICIALS.map(official => (
              <div key={official.abbr} className="col-12 col-md-6 col-lg-4">
                <div className="official-card">
                  {/* Full image — no description text */}
                  <div className="official-img-wrap">
                    <img
                      src={official.img}
                      alt={official.name}
                      className="official-img"
                    />
                  </div>
                  {/* Minimal label bar at bottom */}
                  <div className="official-label">
                    <div className="official-label-abbr">{official.abbr}</div>
                    <div className="official-label-name">{official.name}</div>
                    <div className="official-label-role">{official.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-pad" style={{ background: 'rgba(5,9,19,0.55)' }}>
        <div className="container">
          <div className="banner p-4 p-md-5 text-center">
            <div className="section-label mb-3">Take Action</div>
            <h2 className="fw-bold glow-text mb-3">Ready to Report?</h2>
            <p className="text-muted-cyber mb-4 mx-auto" style={{ maxWidth: '50ch' }}>
              Submit a secure incident report through WHTS and let our affiliated agencies
              take it from there. Your report matters.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link className="btn btn-alert" to="/report">
                <i className="bi bi-exclamation-triangle me-2"></i>Report an Incident
              </Link>
              <Link className="btn btn-outline-cyber" to="/about">
                <i className="bi bi-info-circle me-2"></i>Learn About WHTS
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}