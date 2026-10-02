import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'

/* Reusable styled dropdown — replaces native <select>/<option> per client
   instruction ("no regular select... make sure they are all designed
   dropdowns just like the country code dropdowns"). Mirrors
   CountrySelectField's button+menu pattern for visual consistency.

   Built as a near drop-in replacement: pass the same <option value="...">
   children you'd give a native select, and the same onChange handler —
   it's invoked with a synthetic { target: { value, name } } event, so
   existing handlers written as `e => setX(e.target.value)` or
   `handleStatusChange(e)` keep working unchanged. Only the tag itself
   (<select> -> <StyledSelect>) needs to change at most call sites.

   The open menu is rendered via a portal onto document.body, positioned
   by the button's actual screen coordinates, rather than as a normal
   absolutely-positioned child of the wrap. Several admin pages wrap their
   content in .admin-card, which sets `overflow: hidden` (to clip a
   table's square corners to the card's rounded ones) — a dropdown sitting
   inside that card as a normal child gets sliced off by that same
   overflow the moment the card is shorter than the menu, which is exactly
   what happened on Contact Messages with an empty/short results list.
   Portaling the menu out to the body sidesteps that entirely, for every
   page this component is used on, rather than patching each container. */
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
  // Extra class(es) applied to the portaled menu itself. Needed because
  // the dark-themed variants of this component (the cyber-themed Report
  // form, the WhatsApp/Telegram modal) used to rely on CSS selectors like
  // `.cyber-select ~ .styled-select-menu` or `.wm-field .styled-select-menu`
  // that only matched because the menu was a DOM descendant/sibling of its
  // trigger — portaling it onto document.body (see below) breaks that
  // relationship, so those themed call sites now pass an explicit class
  // here instead of relying on where the menu happens to sit in the DOM.
  menuClassName = '',
}) {
  const [open, setOpen] = useState(false)
  const [menuPos, setMenuPos] = useState(null) // { top, left, width } in viewport coords
  const wrapRef = useRef(null)
  const menuRef = useRef(null)
  const btnRef = useRef(null)

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

  // A click is "inside" this control if it's on the toggle button/wrap, OR
  // inside the portaled menu — the menu is no longer a DOM descendant of
  // wrapRef once portaled, so it needs its own explicit check.
  const isInside = (target) =>
    (wrapRef.current && wrapRef.current.contains(target)) ||
    (menuRef.current && menuRef.current.contains(target))

  useEffect(() => {
    const handler = (e) => {
      if (!isInside(e.target)) setOpen(false)
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

  // Compute the menu's screen position from the button whenever it opens,
  // and keep it in sync with scrolling/resizing while open. A scroll or
  // resize closes the menu instead of repositioning it — these are short
  // filter/status menus, not something worth tracking continuously, and
  // closing on scroll matches how most native dropdowns behave anyway.
  useLayoutEffect(() => {
    if (!open || !btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    setMenuPos({ top: rect.bottom + 6, left: rect.left, width: rect.width })

    const closeOnScroll = () => setOpen(false)
    window.addEventListener('scroll', closeOnScroll, true)
    window.addEventListener('resize', closeOnScroll)
    return () => {
      window.removeEventListener('scroll', closeOnScroll, true)
      window.removeEventListener('resize', closeOnScroll)
    }
  }, [open])

  const selectOption = (opt) => {
    if (opt.disabled) return
    setOpen(false)
    onChange?.({ target: { value: opt.value, name } })
  }

  // Fires the caller's onBlur (e.g. Formik's handleBlur, which marks a
  // field "touched") only when focus leaves the whole control — not when
  // it moves internally between the toggle button and a menu-item button,
  // which are separate focusable elements (and, now, in separate parts of
  // the DOM since the menu is portaled).
  const handleWrapBlur = (e) => {
    if (isInside(e.relatedTarget)) return
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
        ref={btnRef}
        className={`styled-select-btn ${className}`}
        onClick={() => !disabled && setOpen(prev => !prev)}
        disabled={disabled}
        style={buttonStyle}
      >
        <span className="styled-select-label">{selected ? selected.label : placeholder}</span>
        <i className={`bi bi-caret-${open ? 'up' : 'down'}-fill styled-select-arrow`}></i>
      </button>

      {open && menuPos && createPortal(
        <ul
          className={`styled-select-menu styled-select-menu-portal ${menuClassName}`}
          role="listbox"
          ref={menuRef}
          style={{ position: 'fixed', top: menuPos.top, left: menuPos.left, minWidth: menuPos.width }}
        >
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
        </ul>,
        document.body
      )}
    </div>
  )
}
