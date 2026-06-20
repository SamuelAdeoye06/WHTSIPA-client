import threatFooterLogo from '../assets/media/threat-footer-logo.png'
import './ThreatsFooter.css'

export default function ThreatsFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="threats-footer">
      <div className="container">
        <div className="threats-footer-inner">
          <img
            src={threatFooterLogo}
            alt="WHTSIPA — Cyber Guardians Threats"
            className="threats-footer-logo"
          />
          <h2 className="threats-footer-title">
            Acknowledgement of Country
          </h2>
          <p className="threats-footer-text">
            We acknowledge the Traditional Private Owners and Custodians of Country throughout and
            their continuing connections to land, sea and communities.
          </p>
          <p className="threats-footer-text">
          We pay our respects to them, their cultures and their Elders; past, present and emerging. We also recognise Australia's First Peoples' enduring contribution to Australia's national security.
          </p>
        </div>

        <div className="footer-bottom-bar">
          <div className="footer-bottom-inner">
            <div className="footer-bottom-copy">
              © {year} WHTS · America Cyber Security World. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
