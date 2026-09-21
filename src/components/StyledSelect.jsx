import React, { useState, useEffect, useRef } from 'react'

/* Reusable styled dropdown — replaces native <select>/<option> per client
   instruction ("no regular select... make sure they are all designed
   dropdowns just like the country code dropdowns"). Mirrors
   CountrySelectField's button+menu pattern for visual consistency.

   Built as a near drop-in replacement: pass the same <option value="...">
   children you'd give a native select, and the same onChange handler —
   it's invoked with a synthetic { target: { value, name } } event, so
   existing handlers written as `e => setX(e.target.value)` or
   `handleStatusChange(e)` keep working unchanged. Only the tag itself
   (<select> -> <StyledSelect>) needs to change at most call sites. */
export default function StyledSelect({
  value,
  onChange,
  onBlur,
  children,
  className = '',
  disabled = false,
  id,
  name,
  style,
  buttonStyle,
  placeholder = 'Select...',
}) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  const options = React.Children.toArray(children)
    .filter(child => child.type === 'option')
    .map(child => ({
      // Native <option> with no value attribute falls back to using its
      // text content as the value — match that so options written as
      // <option>{label}</option> (no explicit value) keep working.
      value: child.props.value !== undefined ? child.props.value : child.props.children,
      label: child.props.children,
      disabled: !!child.props.disabled,
    }))

  const selected = options.find(o => String(o.value) === String(value))

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const selectOption = (opt) => {
    if (opt.disabled) return
    setOpen(false)
    onChange?.({ target: { value: opt.value, name } })
  }

  // Fires the caller's onBlur (e.g. Formik's handleBlur, which marks a
  // field "touched") only when focus leaves the whole control — not when
  // it moves internally between the toggle button and a menu-item button,
  // which are separate focusable elements within the same wrap.
  const handleWrapBlur = (e) => {
    if (wrapRef.current && wrapRef.current.contains(e.relatedTarget)) return
    onBlur?.({ target: { value, name } })
  }

  return (
    <div
      className={`styled-select-wrap ${open ? 'is-active' : ''} ${disabled ? 'is-disabled' : ''}`}
      ref={wrapRef}
      style={style}
      onBlur={handleWrapBlur}
    >
      <button
        type="button"
        id={id}
        className={`styled-select-btn ${className}`}
        onClick={() => !disabled && setOpen(prev => !prev)}
        disabled={disabled}
        style={buttonStyle}
      >
        <span className="styled-select-label">{selected ? selected.label : placeholder}</span>
        <i className={`bi bi-caret-${open ? 'up' : 'down'}-fill styled-select-arrow`}></i>
      </button>

      {open && (
        <ul className="styled-select-menu" role="listbox">
          {options.map(opt => (
            <li key={opt.value}>
              <button
                type="button"
                role="option"
                aria-selected={String(opt.value) === String(value)}
                className={`styled-select-item ${String(opt.value) === String(value) ? 'active' : ''} ${opt.disabled ? 'disabled' : ''}`}
                onClick={() => selectOption(opt)}
                disabled={opt.disabled}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
