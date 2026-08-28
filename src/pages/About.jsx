import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/cyber.css'
import './About.css'
import api from '../services/api'
import ReactionButtons from '../components/ReactionButtons'

import agencyDescFtc from '../assets/media/agency-desc-ftc.jpeg'
import agencyDescUsps from '../assets/media/agency-desc-usps.jpeg'
import agencyDescInterpol from '../assets/media/agency-desc-interpol.jpeg'
import agencyDescCisa from '../assets/media/agency-desc-cisa.jpeg'
import agencyDescDhs from '../assets/media/agency-desc-dhs.jpeg'
import agencyDescFbi from '../assets/media/agency-desc-fbi.jpeg'
import agencyDescSecretService from '../assets/media/agency-desc-secret-service.jpeg'
import agencyDescIrs from '../assets/media/agency-desc-irs.jpeg'

const TIMELINE = [
  { year: '2018', title: 'WHTSIPA Founded', desc: 'The Watch Eyes organisation was established to track and expose cybercriminals targeting individuals and businesses.' },
  { year: '2019', title: 'ACSW Partnership', desc: 'America Cyber Security World formally partnered with WHTSIPA, expanding reach across federal and international frameworks.' },
  { year: '2021', title: 'IC3 Integration', desc: 'Reports submitted through WHTS became eligible for escalation to the FBI\'s Internet Crime Complaint Center.' },
  { year: '2022', title: 'Research Published', desc: 'WHTSIPA published landmark research on ransomware impact, referenced by multiple government cybersecurity agencies.' },
  { year: '2024', title: 'Platform Launched', desc: 'The public-facing intelligence platform launched — giving individuals direct access to threat education and incident reporting.' },
  { year: '2026', title: 'Global Expansion', desc: 'Operations expanded to support victims across 40+ countries with multilingual reporting and recovery guidance.' },
]

const PILLARS = [
  { icon: '🔍', title: 'Track', desc: 'We track scammers, cybercriminals, and threat actors using intelligence methods aligned with government law enforcement frameworks.' },
  { icon: '📢', title: 'Expose', desc: 'We expose fraudulent operations through coordinated reporting with INTERPOL, FBI, IRS, and other affiliated agencies.' },
  { icon: '🛡️', title: 'Protect', desc: 'We protect individuals and organizations with real-time threat intelligence, education, and guided recovery workflows.' },
  { icon: '⚖️', title: 'Pursue', desc: 'We pursue accountability — every valid report contributes to ongoing investigations and official cybercrime records.' },
]

const GOV_AGENCIES = [
  { abbr: 'FTC',      name: 'Federal Trade Commission',                       role: 'Consumer Protection & Fraud Enforcement',   img: agencyDescFtc },
  { abbr: 'USPIS',    name: 'US Postal Inspection Service',                   role: 'Mail Fraud & Parcel Scam Investigation',    img: agencyDescUsps },
  { abbr: 'INTERPOL', name: 'INTERPOL',                                       role: 'International Cross-Border Cybercrime',      img: agencyDescInterpol },
  { abbr: 'CISA',     name: 'Cybersecurity & Infrastructure Security Agency', role: 'National Cyber Infrastructure Protection',   img: agencyDescCisa },
  { abbr: 'DHS',      name: 'Department of Homeland Security',                role: 'Counter Intelligence of Threats',            img: agencyDescDhs },
  { abbr: 'FBI',      name: 'FBI / Department of Justice',                    role: 'Cybercrime Investigation & IC3',             img: agencyDescFbi },
  { abbr: 'USSS',     name: 'United States Secret Service',                   role: 'Financial Cybercrime & Access Device Fraud', img: agencyDescSecretService },
  { abbr: 'IRS',      name: 'Internal Revenue Service',                       role: 'Tax Fraud & Financial Crime Investigation',  img: agencyDescIrs },
]

export default function About() {
  const { user } = useAuth()
  const [reactions, setReactions] = useState({})

  useEffect(() => {
    const url = user?._id ? `/reactions?userId=${encodeURIComponent(user._id)}` : '/reactions'
    api.get(url)
      .then(({ data }) => {
        if (data) setReactions(data)
      })
      .catch(err => console.error('Failed to load reactions:', err))
  }, [user])

  const handleReactionChange = (entityId, updatedData) => {
    setReactions(prev => ({
      ...prev,
      [entityId]: updatedData
    }))
  }

  return (
    <div className="page-light">
      <>
        {/* ── Hero ── */}
        <header className="about-hero">
          <div className="cyber-grid" aria-hidden="true" />
          <div className="container position-relative" style={{ zIndex: 2, paddingTop: '4rem', paddingBottom: '4rem' }}>
            <div className="row align-items-center g-5">
              <div className="col-12 col-lg-7">
                <div className="section-label mb-2">About WHTSIPA</div>
                <h1 className="glow-text fw-bold mb-3">
                  We Help Track Scammers.<br />We Help Protect People.
                </h1>
                <p className="mb-4" style={{ maxWidth: '56ch', fontSize: '1.05rem', color: '#4a5568'  }}>
                  WHTSIPA — The Watch Eyes — is a certified cybersecurity intelligence organisation
                  operating in alignment with US government agencies and international law enforcement
                  to track, expose, and dismantle cybercriminal networks.
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  <Link className="btn btn-cyber" to="/about-officials">
                    <i className="bi bi-people me-2"></i>Meet the Officials
                  </Link>
                  <Link className="btn btn-outline-cyber" to="/report">
                    <i className="bi bi-send me-2"></i>Submit a Report
                  </Link>
                </div>
              </div>
              <div className="col-12 col-lg-5">
                <div className="banner p-4">
                  <div className="section-label mb-2">Our Mission</div>
                  <h3 className="fw-bold mb-3">Don't Get Caught.</h3>
                  <p className="text-muted-cyber small mb-4">
                    Our motto isn't just a warning — it's a commitment. We arm individuals and
                    organizations with the intelligence they need to stay one step ahead of every threat.
                  </p>
                  <div className="scan-bar mb-2"><span /></div>
                  <div className="text-muted-cyber small">
                    Operated under the banner of America Cyber Security World (ACSW) ·
                    Aligned with WeHelpTrackScammersIpAddress.com
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ── Four pillars ── */}
        <section className="section-pad-lg">
          <div className="container">
            <div className="text-center mb-5">
              <div className="section-label mb-2">What We Do</div>
              <h2 className="fw-bold mb-2">Four Pillars of Operation</h2>
              <p className="text-muted-cyber mx-auto" style={{ maxWidth: '52ch' }}>
                Every action WHTSIPA takes is built on these four core operational principles.
              </p>
            </div>
            <div className="row g-4">
              {PILLARS.map(p => (
                <div key={p.title} className="col-12 col-md-6 col-lg-3">
                  <div className="card-glass card-hover p-4 h-100 text-center">
                    <div className="about-pillar-icon">{p.icon}</div>
                    <div className="fw-bold fs-5 mb-2">{p.title}</div>
                    <div className="text-muted-cyber small">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Government Affiliated Agencies ── */}
        <section className="section-pad-lg" id="government-agencies" style={{ background: '#f8fafc' }}>
          <div className="container">
            <div className="text-center mb-5">
              <div className="section-label mb-2">Our Partners</div>
              <h2 className="fw-bold mb-2" style={{ color: '#0f172a' }}>Government Affiliated Agencies</h2>
              <p style={{ color: '#4a5568', maxWidth: '56ch', margin: '0 auto' }}>
                WHTSIPA operates in formal alignment with the listed U.S. government agencies and
                international law enforcement bodies. All valid reports received are reviewed and
                submitted to the relevant authorities listed to support partnership and ensure smooth
                operational coordination.
              </p>
            </div>
            <div className="row g-4">
              {GOV_AGENCIES.map(agency => {
                const entityKey = agency.abbr.toLowerCase()
                const entityReaction = reactions[entityKey]

                return (
                  <div key={agency.abbr} className="col-12 col-md-6 col-lg-4">
                    <div className="official-card">
                      <div className="official-img-wrap">
                        <img src={agency.img} alt={agency.name} className="official-img" />
                      </div>
                      <div className="official-label-light d-flex align-items-center justify-content-between gap-2">
                        <div style={{ minWidth: 0, flex: '1 1 auto' }}>
                          <div className="official-label-abbr-light">{agency.abbr}</div>
                          <div className="official-label-name-light">{agency.name}</div>
                          <div className="official-label-role-light">{agency.role}</div>
                        </div>
                        <ReactionButtons
                          entityId={entityKey}
                          theme="light"
                          serverData={entityReaction}
                          onReactionChange={handleReactionChange}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="text-center mt-4">
              <Link className="btn btn-outline-primary px-4" to="/about-officials" style={{ borderRadius: 12, fontWeight: 600 }}>
                <i className="bi bi-people me-2"></i>Meet The Officials
              </Link>
            </div>
          </div>
        </section>

        {/* ── Timeline ── */}
        <section className="section-pad" style={{ background: 'rgba(5,9,19,0.55)' }}>
          <div className="container">
            <div className="section-label mb-2">History</div>
            <h2 className="fw-bold mb-5">Our Journey</h2>
            <div className="about-timeline">
              {TIMELINE.map((item, i) => (
                <div key={item.year} className={`about-timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}>
                  <div className="about-timeline-year">{item.year}</div>
                  <div className="about-timeline-card card-glass p-4">
                    <div className="fw-bold mb-1">{item.title}</div>
                    <div className="text-muted-cyber small">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Affiliation statement ── */}
        <section className="section-pad-lg">
          <div className="container">
            <div className="banner p-4 p-md-5">
              <div className="row align-items-center g-4">
                <div className="col-12 col-lg-8">
                  <div className="section-label mb-2">Government Aligned</div>
                  <h2 className="fw-bold mb-3">Certified. Aligned. Accountable.</h2>
                  <p className="text-muted-cyber mb-3">
                    WHTSIPA operates as a certified organisation recognised under American Government
                    cybersecurity frameworks. All valid incident reports submitted through our platform
                    are eligible for escalation to the FBI Internet Crime Complaint Center (IC3),
                    INTERPOL, IRS Criminal Investigation, and other affiliated agencies.
                  </p>
                  <p className="text-muted-cyber mb-0 small">
                    We do not operate as a replacement for law enforcement — we operate alongside it.
                  </p>
                </div>
                <div className="col-12 col-lg-4 text-lg-end">
                  <Link className="btn btn-alert mb-2 w-100" to="/report">
                    <i className="bi bi-exclamation-triangle me-2"></i>Report an Incident
                  </Link>
                  <Link className="btn btn-outline-cyber w-100" to="/about-officials">
                    <i className="bi bi-people me-2"></i>Meet the Officials
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    </div>
  )
}
