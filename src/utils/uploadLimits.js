// Keep these in sync with WHTS-server/routes/upload.route.js (multer config +
// ALLOWED_MIME_TYPES). This file exists so every upload UI in the app shows
// the same, correct limit text instead of each one guessing independently.

export const MAX_FILES = 5
export const MAX_FILE_SIZE_MB = 10

// Accept attribute for <input type="file"> — matches the server's
// ALLOWED_MIME_TYPES (images, PDF, Word .doc/.docx). No .txt — the server
// rejects it, so don't offer it in the picker.
export const ACCEPT_ATTR = 'image/*,.pdf,.doc,.docx'

export const LIMIT_HINT = `Images, PDF, DOC · Max ${MAX_FILES} files · ${MAX_FILE_SIZE_MB}MB each`
