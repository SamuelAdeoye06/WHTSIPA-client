import { parsePhoneNumberFromString } from 'libphonenumber-js'

/* Standard cap applied to every "digits only" phone input across the site
   (signup, report, booking, support-ticket forms) — not just signup,
   per client instruction. 15 matches the ITU E.164 standard's maximum
   total length for a phone number (country code + national number
   combined); since the dial code is entered/stored separately in every
   one of these forms, capping the digits-only portion at 15 is already
   generous for every real country's actual number length, while still
   reliably blocking garbage input (e.g. a 29-digit string pasted or
   mistyped into the field). */
export const PHONE_DIGITS_MAX_LENGTH = 15

/* Strips anything that isn't a digit and truncates to the max length
   above. Used as a shared onChange filter so every phone "digits" field
   behaves the same way, rather than each form re-implementing its own
   (or, as before, several forms implementing none at all). */
export function sanitizePhoneDigits(value) {
  return (value || '').replace(/\D/g, '').slice(0, PHONE_DIGITS_MAX_LENGTH)
}

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
