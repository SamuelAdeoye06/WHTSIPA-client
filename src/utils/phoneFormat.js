import { parsePhoneNumberFromString } from 'libphonenumber-js'

/* Formats a raw phone number (digits only, no leading +, e.g. "16502184673"
   for a US number or "2348012345678" for a Nigerian one) into a proper
   international display string:
     "+1 650 218 4673"   (US)
     "+234 801 234 5678" (Nigeria)
   The country is auto-detected from the number itself via its country
   calling code, so admins never have to pick a country separately — just
   enter the full number (country code + local number), no leading +.
   Falls back to a plain "+<digits>" if the number is incomplete/invalid,
   so a still-being-typed number never crashes the display. */
export function formatPhoneDisplay(rawDigits) {
  if (!rawDigits) return ''
  try {
    const parsed = parsePhoneNumberFromString(`+${rawDigits}`)
    if (parsed?.isValid()) return parsed.formatInternational()
  } catch {
    // fall through to the plain fallback below
  }
  return `+${rawDigits}`
}
