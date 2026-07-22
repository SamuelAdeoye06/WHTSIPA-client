import React from 'react'

export const MIN_WORD_COUNT = 25

export function countWords(str) {
  if (!str) return 0
  const trimmed = str.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}

export function isWordCountValid(str, min = MIN_WORD_COUNT) {
  return countWords(str) >= min
}

export function WordCounter({ text = '', min = MIN_WORD_COUNT }) {
  const words = countWords(text)
  const isSatisfied = words >= min

  return (
    <div className="d-flex justify-content-between align-items-center mt-1" style={{ fontSize: '0.8rem' }}>
      <span className={isSatisfied ? 'text-success font-monospace' : 'text-warning font-monospace'}>
        Word count: {words} / {min} words
      </span>
      {!isSatisfied && (
        <span className="text-warning" style={{ fontSize: '0.78rem' }}>
          (Minimum {min} words required)
        </span>
      )}
    </div>
  )
}
