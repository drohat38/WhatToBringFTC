import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getChapter } from '../data/chapters'
import { getReq } from '../data/ingredients'
import './EventbriteReveal.css'

// Prototype prefill URL — in production this is the real chapter Eventbrite URL
const BASE_EB_URL = 'https://www.eventbrite.com/e/feed-the-city-registration'

// Pure function at module level — no re-creation on render
function buildGroceryText(goal, cityName) {
  const r = getReq(goal)
  return [
    '🥪 FEED THE CITY — GROCERY LIST',
    cityName ? '📍 ' + cityName : null,
    '🎯 Goal: ' + goal + ' sandwiches (~' + Math.round(goal / 2) + ' families)',
    '',
    '— SANDWICHES —',
    '🍞 Sliced Bread      ' + r.bread + (r.bread === 1 ? ' loaf' : ' loaves'),
    '🥩 Deli Meat          ' + r.meat + ' oz',
    '🧀 Sliced Cheese      ' + r.cheese + (r.cheese === 1 ? ' slice' : ' slices'),
    '🟡 Yellow Mustard    ' + r.mustard + (r.mustard === 1 ? ' bottle' : ' bottles'),
    '🛍️ Sandwich Bags     ' + r.bags + (r.bags === 1 ? ' box' : ' boxes'),
    '',
    '— ALSO BRING —',
    '🥔 Chips              ' + r.chips + (r.chips === 1 ? ' bag' : ' bags') + ' (full-size)',
    '🍊 Tangerines         ' + r.tangerines + (r.tangerines === 1 ? ' bag' : ' bags') + ' · 3 lb (Halos/Cuties)',
    '',
    'feedthecity.org | tangocharities.org',
  ].filter(l => l !== null).join('\n')
}

function EventbriteReveal({ goal, email, citySlug, onReset }) {
  const chapter = getChapter(citySlug)
  const prefillUrl = `${BASE_EB_URL}?email=${encodeURIComponent(email)}`
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // In the real Wix embed: scroll parent page to the Eventbrite section
    window.parent.postMessage({ type: 'ftc:scrollToRegistration' }, '*')
  }, [])

  function flashCopied() {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleCopy() {
    const text = buildGroceryText(goal, chapter?.name ?? '')
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(flashCopied).catch(() => fallbackCopy(text))
    } else {
      fallbackCopy(text)
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;'
    document.body.appendChild(ta)
    ta.focus(); ta.select()
    try { document.execCommand('copy'); flashCopied() } catch (e) { /* silent */ }
    document.body.removeChild(ta)
  }

  async function handleSaveImage() {
    setSaving(true)
    
    // Slight delay to let React render the "Generating..." button state
    await new Promise(r => setTimeout(r, 40))

    try {
      // Ensure fonts are loaded before drawing
      await document.fonts.ready

      const W = 900
      const PAD = 52
      const r = getReq(goal)

      const rows = [
        { label: 'Sliced Bread',      qty: r.bread      + (r.bread      === 1 ? ' loaf'    : ' loaves')   },
        { label: 'Deli Meat',         qty: r.meat        + ' oz'                                            },
        { label: 'Sliced Cheese',     qty: r.cheese      + (r.cheese     === 1 ? ' slice'   : ' slices')   },
        { label: 'Yellow Mustard',    qty: r.mustard     + (r.mustard    === 1 ? ' bottle'  : ' bottles')  },
        { label: 'Sandwich Bags',     qty: r.bags        + (r.bags       === 1 ? ' box'     : ' boxes')    },
        { label: 'Chips',             qty: r.chips       + (r.chips      === 1 ? ' bag'     : ' bags')     },
        { label: 'Tangerines (3 lb)', qty: r.tangerines  + (r.tangerines === 1 ? ' bag'     : ' bags')     },
      ]

      const HEADER_H = 180
      const ROW_H    = 60
      const BODY_H   = PAD + rows.length * ROW_H + PAD
      const FOOTER_H = 76
      const H        = HEADER_H + BODY_H + FOOTER_H

      const canvas = document.createElement('canvas')
      canvas.width  = W
      canvas.height = H
      const ctx = canvas.getContext('2d')

      // Header — navy
      ctx.fillStyle = '#003366'
      ctx.fillRect(0, 0, W, HEADER_H)

      // Orange left bar
      ctx.fillStyle = '#FF6500'
      ctx.fillRect(0, 0, 10, HEADER_H)

      // Big number
      ctx.font      = 'bold 100px serif'
      ctx.fillStyle = '#FF6500'
      ctx.textAlign = 'left'
      ctx.fillText(String(goal), PAD + 14, HEADER_H - 28)
      const numW = ctx.measureText(String(goal)).width

      // SANDWICHES label
      ctx.font      = '600 22px sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.55)'
      ctx.fillText('SANDWICHES', PAD + 14 + numW + 18, HEADER_H - 52)

      // Subtitle
      ctx.font      = '400 15px sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.35)'
      ctx.fillText('FEED THE CITY — GROCERY CHECKLIST', PAD + 14 + numW + 18, HEADER_H - 26)

      // Body — off-white
      ctx.fillStyle = '#F8F9FA'
      ctx.fillRect(0, HEADER_H, W, BODY_H)

      // Rows
      rows.forEach((row, i) => {
        const y = HEADER_H + PAD + i * ROW_H

        // Divider
        if (i > 0) {
          ctx.strokeStyle = '#E5E7EB'
          ctx.lineWidth   = 1
          ctx.beginPath()
          ctx.moveTo(PAD, y)
          ctx.lineTo(W - PAD, y)
          ctx.stroke()
        }

        const midY = y + ROW_H / 2 + 6

        // Item name
        ctx.font      = '600 19px sans-serif'
        ctx.fillStyle = '#003366'
        ctx.textAlign = 'left'
        ctx.fillText(row.label, PAD, midY)

        // Quantity
        ctx.font      = 'bold 22px sans-serif'
        ctx.fillStyle = '#FF6500'
        ctx.textAlign = 'right'
        ctx.fillText(row.qty, W - PAD, midY)
      })

      // Footer — navy
      ctx.fillStyle = '#003366'
      ctx.fillRect(0, HEADER_H + BODY_H, W, FOOTER_H)

      ctx.font      = '400 13px sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.38)'
      ctx.textAlign = 'center'
      ctx.fillText('tangocharities.org/feed-the-city', W / 2, HEADER_H + BODY_H + FOOTER_H / 2 + 5)

      // Download
      canvas.toBlob((blob) => {
        if (!blob) return
        const filename = 'ftc-grocery-list.png'
        const file = new File([blob], filename, { type: 'image/png' })
        
        // Try Web Share API (mobile), else fallback to <a> download
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({ files: [file] }).catch(() => triggerDL(canvas, filename))
        } else {
          triggerDL(canvas, filename)
        }
      }, 'image/png')
      
    } finally {
      // Keep button state for at least 1s for visual feedback completion
      setTimeout(() => setSaving(false), 1200)
    }
  }

  function triggerDL(canvas, filename) {
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = filename
    a.click()
  }

  return (
    <motion.section
      className="eb-reveal"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="eb-card">

        {/* ── Animated success ring ── */}
        <div className="eb-svg-wrap">
          <svg width="88" height="88" viewBox="0 0 88 88" aria-hidden="true">
            {/* Faint track ring */}
            <circle
              cx="44" cy="44" r="36"
              stroke="rgba(255,101,0,0.12)"
              strokeWidth="5"
              fill="none"
            />
            {/* Animated ring — rotated so it draws from 12 o'clock */}
            <g transform="rotate(-90 44 44)">
              <motion.circle
                cx="44" cy="44" r="36"
                stroke="#FF6500"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.52, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </g>
            {/* Filled orange circle springs in after ring completes */}
            <motion.circle
              cx="44" cy="44" r="31"
              fill="#FF6500"
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.28, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            />
            {/* Checkmark draws itself on top of the filled circle */}
            <motion.path
              d="M 28 44 L 39 55 L 61 31"
              stroke="white"
              strokeWidth="4.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: { duration: 0.28, delay: 0.54 },
                opacity:    { duration: 0.01, delay: 0.54 },
              }}
            />
          </svg>
        </div>

        <p className="eb-title">Register Here!</p>
        {chapter && (
          <p className="eb-city">
            {chapter.name} | {['First', 'Second', 'Third', 'Fourth'][chapter.week - 1]} Saturday
          </p>
        )}

        {/* ── Grocery list action buttons ── */}
        <div className="eb-actions">
          <button
            className={`eb-primary-btn${copied ? ' copied' : ''}`}
            type="button"
            onClick={handleCopy}
          >
            {copied ? '✓ Copied!' : '📋 Copy Grocery List'}
          </button>
          <button
            className="eb-ghost-btn"
            type="button"
            onClick={handleSaveImage}
            disabled={saving}
          >
            {saving ? '⏳ Generating…' : '💾 Save Image'}
          </button>
        </div>

        {/* ── Eventbrite section ── */}
        <div className="eb-divider" />
        <p className="eb-blurb">
          Lock in your spot — your email is pre-filled.
        </p>
        <a
          className="eb-link"
          href={prefillUrl}
          target="_blank"
          rel="noreferrer"
        >
          Open Eventbrite Registration →
        </a>
      </div>

      <button className="eb-reset" type="button" onClick={onReset}>
        ← Plan another event
      </button>
    </motion.section>
  )
}

export default EventbriteReveal
