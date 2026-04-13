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

  function handleSaveImage() {
    console.log('Canvas image save coming soon — Phase 2')
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

        <p className="eb-title">You&apos;re all set!</p>
        {chapter && (
          <p className="eb-city">
            {chapter.name} &middot; {['First', 'Second', 'Third', 'Fourth'][chapter.week - 1]} Saturday
          </p>
        )}

        {/* ── Grocery list action buttons ── */}
        <div className="eb-actions">
          <button
            className={`eb-ghost-btn${copied ? ' copied' : ''}`}
            type="button"
            onClick={handleCopy}
          >
            {copied ? '✓ Copied!' : '📋 Copy List'}
          </button>
          <button
            className="eb-ghost-btn"
            type="button"
            onClick={handleSaveImage}
          >
            💾 Save Image
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
        <p className="eb-placeholder-note">[ Eventbrite Widget Goes Here ]</p>
      </div>

      <button className="eb-reset" type="button" onClick={onReset}>
        ← Plan another event
      </button>
    </motion.section>
  )
}

export default EventbriteReveal
