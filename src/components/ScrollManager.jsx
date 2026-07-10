import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const PAGE_TITLES = {
  '/':                       'WHTSIPA — Cybersecurity Intelligence & Scam Protection Platform',
  '/threats':                'Cyber Threat Library — Browse All Threats | WHTSIPA',
  '/report':                 'Report a Cybercrime & Recover — WHTSIPA',
  '/recover':                'Incident Recovery Guide — WHTSIPA',
  '/signin':                 'Sign In to Your Account — WHTSIPA',
  '/signup':                 'Create a Free Account — WHTSIPA',
  '/verify-email':           'Verify Your Email Address — WHTSIPA',
  '/forgot-password':        'Forgot Password — Reset Your Account | WHTSIPA',
  '/reset-password':         'Reset Your Password — WHTSIPA',
  '/essential-eight':        'Essential Eight Cybersecurity Strategies — WHTSIPA',
  '/for-victims-government': 'Support for Victims & Government Agencies — WHTSIPA',
  '/blog':                   'Knowledge Base — Security Tips & Awareness | WHTSIPA',
  '/about':                  'About WHTSIPA — Our Mission & Government Alignment',
  '/about-officials':        'Meet the Officials — WHTSIPA Team & Partners',
  '/contact':                'Contact WHTSIPA — Get Support & Report an Incident',
  '/threats-tools':          'Security Tools & Threat Resources — WHTSIPA',
}

export default function ScrollManager() {
  const location = useLocation()
  const lastKey = useRef(null)

  useEffect(() => {
    // Update page title
    const isThreatsDetail = location.pathname.startsWith('/threats/')
    if (isThreatsDetail) {
      const slug = location.pathname.split('/threats/')[1]
      const formatted = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      document.title = `${formatted} — Cyber Threat | WHTSIPA`
    } else {
      document.title = PAGE_TITLES[location.pathname] || 'WHTSIPA — Cybersecurity Intelligence Platform'
    }

    // Scroll logic
    const navKey = `${location.pathname}__${JSON.stringify(location.state)}__${location.hash}`
    if (navKey === lastKey.current) return
    lastKey.current = navKey

    const target = location.state?.scrollTo || location.hash?.replace('#', '')

    if (!target) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // Navbar height differs between mobile (~56px) and desktop (~80px).
    // Read it dynamically from the DOM so the scroll lands exactly on the heading.
    const getNavbarHeight = () => {
      const nav = document.querySelector('.cyber-navbar') || document.querySelector('nav')
      return nav ? nav.getBoundingClientRect().height + 8 : 72
    }

    let attempts = 0
    const scroll = () => {
      const el = document.getElementById(target)
      if (el) {
        const offset = getNavbarHeight()
        const y = el.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
      } else if (attempts++ < 50) {
        // Retry longer — mobile renders slower after navigation
        setTimeout(scroll, 120)
      }
    }
    setTimeout(scroll, 80)
  }, [location])

  return null
}