import React, { useState, useEffect, useRef } from 'react'
import { getCountryFlag } from '../utils/countryUtils'
import { useCountries } from '../context/CountriesContext'

export default function CountrySelectField({
  value,
  onChange,
  onBlur,
  id,
  name,
  label,
  isRequired = false,
  isInvalid = false,
  errorMsg = null,
  placeholder = 'Choose country',
  theme = 'auto' // 'auto' | 'light' | 'dark'
}) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef(null)
  const { allCountries, matchCountrySearch } = useCountries()

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selectedCountry = allCountries.find(c => c.code === value)
  const filtered = allCountries.filter(c => matchCountrySearch(c, search))

  const themeClass = theme !== 'auto' ? `theme-${theme}` : ''

  return (
    <div className={`custom-country-field-wrap ${themeClass}`} ref={dropdownRef}>
      {label && (
        <label className="form-label cyber-label" htmlFor={id}>
          {label} {isRequired ? <span className="text-danger">* (Required)</span> : <span className="text-muted-cyber">(Optional)</span>}
        </label>
      )}
      <div className="position-relative">
        <button
          type="button"
          id={id}
          className={`form-select cyber-select custom-country-btn ${isInvalid ? 'is-invalid' : ''} ${showDropdown ? 'is-active' : ''}`}
          onClick={() => setShowDropdown(prev => !prev)}
          onBlur={onBlur}
        >
          <span className="country-flag-emoji me-2">
            {selectedCountry ? getCountryFlag(selectedCountry.code) : '🌐'}
          </span>
          <span className="country-select-label">
            {selectedCountry ? `${selectedCountry.name.replace(' (Dev)', '')} (${selectedCountry.dial})` : placeholder}
          </span>
          <i className={`bi bi-caret-${showDropdown ? 'up' : 'down'}-fill country-arrow-icon ms-auto`}></i>
        </button>

        {showDropdown && (
          <div className={`custom-country-dropdown-menu ${themeClass}`}>
            <div className="custom-country-search-wrap">
              <i className="bi bi-search custom-country-search-icon"></i>
              <input
                type="text"
                className="form-control form-control-sm custom-country-search"
                placeholder="Search country or code (+234, NG)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
            <ul className="list-unstyled mb-0 custom-country-list">
              {filtered.length === 0 ? (
                <li className="p-3 text-muted-cyber text-center" style={{ fontSize: '0.82rem' }}>
                  No country matches
                </li>
              ) : (
                filtered.map(c => {
                  const isSelected = value === c.code
                  const cleanName = c.name.replace(' (Dev)', '')
                  return (
                    <li key={c.code}>
                      <button
                        type="button"
                        className={`custom-country-dropdown-item ${isSelected ? 'active' : ''}`}
                        onClick={() => {
                          onChange(c.code)
                          setShowDropdown(false)
                          setSearch('')
                        }}
                      >
                        <span className="country-flag-emoji me-2">{getCountryFlag(c.code)}</span>
                        <span className="country-option-text">{cleanName} ({c.dial})</span>
                      </button>
                    </li>
                  )
                })
              )}
            </ul>
          </div>
        )}
      </div>

      {isInvalid && errorMsg && (
        <div className="cyber-error-msg mt-1">
          <i className="bi bi-exclamation-triangle-fill me-1"></i>
          {errorMsg}
        </div>
      )}
    </div>
  )
}
