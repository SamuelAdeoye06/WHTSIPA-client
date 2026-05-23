import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollManager() {
  const location = useLocation()
  const lastKey = useRef(null)

  useEffect(() => {
    // Ignore duplicate fires for the same navigation event
    const navKey = `${location.pathname}__${JSON.stringify(location.state)}__${location.hash}`
    if (navKey === lastKey.current) return
    lastKey.current = navKey

    const target = location.state?.scrollTo || location.hash?.replace('#', '')

    if (!target) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // Try to find the element, retrying up to 30 times (3 seconds total)
    let attempts = 0

    const scroll = () => {
      const el = document.getElementById(target)
      if (el) {
        const offset = el.getBoundingClientRect().top + window.scrollY - 80
        window.scrollTo({ top: offset, behavior: 'smooth' })
      } else if (attempts++ < 30) {
        setTimeout(scroll, 100)
      }
    }

    // Small initial delay to let the new route render first
    setTimeout(scroll, 50)
  }, [location])

  return null
}