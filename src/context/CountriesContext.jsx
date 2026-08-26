import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'
import { ALLOWED_COUNTRIES, matchCountrySearch } from '../utils/countryUtils'

/* ───────────────────────────────────────────────────────────────
   CountriesContext
   Fetches /api/countries once on app start and caches two lists:
     • allCountries    — visible in dropdowns (showInDropdown: true)
     • signupCountries — subset that can also sign up (signupAllowed: true)

   Falls back to the full local ALLOWED_COUNTRIES list if the API
   is unreachable, so the app still works offline / during dev.
───────────────────────────────────────────────────────────────── */

const CountriesContext = createContext(null)

export function CountriesProvider({ children }) {
  const [allCountries,    setAllCountries]    = useState(ALLOWED_COUNTRIES)
  const [signupCountries, setSignupCountries] = useState(ALLOWED_COUNTRIES)
  const [loading,         setLoading]         = useState(true)
  const [error,           setError]           = useState(null)

  useEffect(() => {
    api.get('/countries')
      .then(({ data }) => {
        // data = array of { code, name, dial, signupAllowed }
        // Merge with local ALLOWED_COUNTRIES to get code3, aliases, flag support
        const localMap = Object.fromEntries(ALLOWED_COUNTRIES.map(c => [c.code, c]))

        const merged = data.map(serverEntry => ({
          ...(localMap[serverEntry.code] || {}),
          code:          serverEntry.code,
          name:          serverEntry.name,
          dial:          serverEntry.dial,
          signupAllowed: serverEntry.signupAllowed,
        }))

        setAllCountries(merged)
        setSignupCountries(merged.filter(c => c.signupAllowed))
      })
      .catch(err => {
        console.warn('CountriesContext: could not fetch /api/countries, using local fallback.', err?.message)
        setError(err?.message || 'Failed to load countries')
        // Keep the local fallback values already set in useState
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <CountriesContext.Provider value={{ allCountries, signupCountries, loading, error, matchCountrySearch }}>
      {children}
    </CountriesContext.Provider>
  )
}

export function useCountries() {
  const ctx = useContext(CountriesContext)
  if (!ctx) throw new Error('useCountries must be used inside <CountriesProvider>')
  return ctx
}
