/**
 * Tidio loads its script asynchronously (see the <script async> tag in
 * index.html), so `window.tidioChatApi` is NOT guaranteed to exist the
 * moment a component mounts or a button is clicked — especially on first
 * page load or a slow connection. Tidio fires a one-time
 * `tidioChat-ready` event on `document` once the widget has actually
 * finished initializing; everything here waits on that instead of
 * hoping the API object is already there.
 */

let readyPromise = null

export function tidioReady() {
  if (typeof window === 'undefined') return Promise.resolve(null)
  if (window.tidioChatApi) return Promise.resolve(window.tidioChatApi)

  if (!readyPromise) {
    readyPromise = new Promise((resolve) => {
      document.addEventListener(
        'tidioChat-ready',
        () => resolve(window.tidioChatApi || null),
        { once: true }
      )
      // Safety net: if the event never fires (blocked script, ad-blocker,
      // Tidio outage), don't leave callers hanging forever.
      setTimeout(() => resolve(window.tidioChatApi || null), 15000)
    })
  }
  return readyPromise
}

/* Opens the real Tidio widget — used by every "Chat with an Active
   Representative" action across WhatsipModal, Contact, Report, Threats.

   IMPORTANT: opening/showing the widget alone does NOT create a
   conversation or notify anyone in Tidio's Inbox — Tidio only registers
   a conversation once an actual message passes through it. Pass
   `starterMessage` so this fires `messageFromVisitor`, which both
   creates the conversation thread AND notifies whoever's logged in as
   the operator, immediately and with real context instead of a blank
   chat window waiting for the visitor to type first. */
export function openLiveChat(starterMessage) {
  tidioReady().then((api) => {
    if (!api) return
    try {
      api.show()
      api.open()
      // Send official WHTSIPA service greeting message into Tidio
      if (api.messageFromService) {
        api.messageFromService("Welcome to WHTSIPA Help portal. How can we assist you today? ✅")
      }
      if (starterMessage) api.messageFromVisitor(starterMessage)
    } catch { /* ignore */ }
  })
}

/* Registers a listener for a real human agent joining the chat.
   Returns nothing usable to unsubscribe — Tidio's API doesn't expose
   .off() reliably, so callers should guard against double-firing in
   their own state instead. */
export function onAgentJoined(callback) {
  tidioReady().then((api) => {
    if (!api) return
    try {
      api.on('agentJoined', callback)
    } catch { /* ignore */ }
  })
}

/* Hides Tidio's own floating bubble so it doesn't sit on screen
   alongside the app's existing chat entry points. Call once, high up
   in the tree (App.jsx), right after the widget is ready. */
export function hideDefaultBubble() {
  tidioReady().then((api) => {
    if (!api) return
    try {
      api.hide()
    } catch { /* ignore */ }
  })
}

/* Calling .show() to open live chat leaves Tidio's floating bubble
   permanently visible afterwards — it does not rehide itself once the
   visitor closes the widget. This re-hides it on Tidio's own `close`
   event so the bubble disappears again, matching the app's default
   "invisible until requested" state. Call once, high up in the tree. */
export function autoHideOnClose() {
  tidioReady().then((api) => {
    if (!api) return
    try {
      api.on('close', () => api.hide())
    } catch { /* ignore */ }
  })
}

/* Optional: pass the logged-in user's name/email into Tidio so the
   human rep sees who they're talking to instead of an anonymous visitor. */
export function setTidioVisitor({ name, email } = {}) {
  if (!name && !email) return
  tidioReady().then((api) => {
    if (!api) return
    try {
      api.setVisitorData({
        ...(name ? { name } : {}),
        ...(email ? { email } : {}),
      })
    } catch { /* ignore */ }
  })
}
