/**
 * Helper to get Unicode Flag Emoji from 2-letter Country Code (e.g. 'US' -> '🇺🇸', 'NG' -> '🇳🇬')
 */
export const getCountryFlag = (code) => {
  if (!code || typeof code !== 'string' || code.length !== 2) return '🌐'
  return code
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))
    .reduce((str, charCode) => str + String.fromCodePoint(charCode), '')
}

/**
 * Standard Allowed Countries across the app
 */
export const ALLOWED_COUNTRIES = [
  { code: 'US', name: 'United States',          dial: '+1'   },
  { code: 'CA', name: 'Canada',                 dial: '+1'   },
  { code: 'GB', name: 'United Kingdom',         dial: '+44'  },
  { code: 'AU', name: 'Australia',              dial: '+61'  },
  { code: 'NZ', name: 'New Zealand',            dial: '+64'  },
  { code: 'DE', name: 'Germany',                dial: '+49'  },
  { code: 'FR', name: 'France',                 dial: '+33'  },
  { code: 'NL', name: 'Netherlands',            dial: '+31'  },
  { code: 'SE', name: 'Sweden',                 dial: '+46'  },
  { code: 'NO', name: 'Norway',                 dial: '+47'  },
  { code: 'DK', name: 'Denmark',                dial: '+45'  },
  { code: 'FI', name: 'Finland',                dial: '+358' },
  { code: 'CH', name: 'Switzerland',            dial: '+41'  },
  { code: 'SG', name: 'Singapore',              dial: '+65'  },
  { code: 'JP', name: 'Japan',                  dial: '+81'  },
  { code: 'KR', name: 'South Korea',            dial: '+82'  },
  { code: 'AE', name: 'United Arab Emirates',   dial: '+971' },
  { code: 'QA', name: 'Qatar',                  dial: '+974' },
  { code: 'IL', name: 'Israel',                 dial: '+972' },
  { code: 'AT', name: 'Austria',                dial: '+43'  },
  { code: 'BE', name: 'Belgium',                dial: '+32'  },
  { code: 'IT', name: 'Italy',                  dial: '+39'  },
  { code: 'ES', name: 'Spain',                  dial: '+34'  },
  { code: 'PL', name: 'Poland',                 dial: '+48'  },
  { code: 'PT', name: 'Portugal',               dial: '+351' },
  { code: 'IE', name: 'Ireland',                dial: '+353' },
  { code: 'GR', name: 'Greece',                 dial: '+30'  },
  { code: 'CZ', name: 'Czechia',               dial: '+420' },
  { code: 'NG', name: 'Nigeria (Dev)',          dial: '+234' },
]
