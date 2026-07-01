import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const PAGE_TITLES = {
  '/':        'WHTS — Cybersecurity Intelligence Platform',
  '/threats': 'Threat Library — WHTS',
  '/report':  'Report & Recover — WHTS',
  '/signin':  'Sign In — WHTS',
  '/signup':  'Create Account — WHTS',
  '/essential-eight':        'Essential Eight — WHTS',
  '/for-victims-government': 'For Victims & Government — WHTS',
  '/blog':                   'Knowledge Base — WHTS',
  '/about':                  'About WHTSIPA — WHTS',
  '/about-officials':        'The Officials — WHTS',
  '/contact':                'Contact — WHTS',
  '/threats-tools': 'Threats & Tools — WHTS',
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
      document.title = `${formatted} — WHTS`
    } else {
      document.title = PAGE_TITLES[location.pathname] || 'WHTS — Cybersecurity Intelligence'
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