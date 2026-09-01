import api from '../services/api'

/**
 * Uploads real files to the server (which streams them to Cloudinary) and
 * returns their permanent URLs. Call this BEFORE submitting a report/ticket
 * that references evidenceFiles — the submission payload should include
 * the URLs this returns, never the raw File objects or just their names.
 *
 * @param {File[]} files
 * @returns {Promise<string[]>} array of Cloudinary URLs, same order as input
 */
export async function uploadEvidenceFiles(files) {
  if (!files || files.length === 0) return []

  const formData = new FormData()
  files.forEach(file => formData.append('files', file))

  const { data } = await api.post('/uploads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.urls
}
