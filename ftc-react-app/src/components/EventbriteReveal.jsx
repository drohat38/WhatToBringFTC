import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getChapter } from '../data/chapters'
import { getReq } from '../data/ingredients'
import './EventbriteReveal.css'

const BASE_EB_URL = 'https://www.eventbrite.com/e/feed-the-city-registration'

// Plain-text grocery list — no emojis
function buildGroceryText(goal, cityName) {
  const r = getReq(goal)
  return [
    'FEED THE CITY — GROCERY LIST',
    cityName || null,
    'Goal: ' + goal + ' sandwiches (~' + Math.round(goal / 2) + ' families)',
    '',
    '— SANDWICHES —',
    'Sliced Bread     ' + r.bread   + (r.bread   === 1 ? ' loaf'   : ' loaves'),
    'Deli Meat        ' + r.meat    + ' oz',
    'Sliced Cheese    ' + r.cheese  + (r.cheese  === 1 ? ' slice'  : ' slices'),
    'Yellow Mustard   ' + r.mustard + (r.mustard === 1 ? ' bottle' : ' bottles'),
    'Sandwich Bags    ' + r.bags    + (r.bags    === 1 ? ' box'    : ' boxes'),
    '',
    '— ALSO BRING —',
    'Chips            ' + r.chips      + (r.chips      === 1 ? ' bag' : ' bags') + ' (full-size)',
    'Tangerines       ' + r.tangerines + (r.tangerines === 1 ? ' bag' : ' bags') + ' · 3 lb',
    '',
    'feedthecity.org | tangocharities.org',
  ].filter(l => l !== null).join('\n')
}

function makeSandwichRows(r) {
  return [
    { label: 'Sliced Bread',   qty: r.bread   + (r.bread   === 1 ? ' loaf'   : ' loaves')  },
    { label: 'Deli Meat',      qty: r.meat    + ' oz'                                        },
    { label: 'Sliced Cheese',  qty: r.cheese  + (r.cheese  === 1 ? ' slice'  : ' slices')  },
    { label: 'Yellow Mustard', qty: r.mustard + (r.mustard === 1 ? ' bottle' : ' bottles') },
    { label: 'Sandwich Bags',  qty: r.bags    + (r.bags    === 1 ? ' box'    : ' boxes')    },
  ]
}

function makeSnackRows(r) {
  return [
    { label: 'Chips',            qty: r.chips      + (r.chips      === 1 ? ' bag' : ' bags') + ', full-size' },
    { label: 'Tangerines, 3 lb', qty: r.tangerines + (r.tangerines === 1 ? ' bag' : ' bags')               },
  ]
}

// Feather-style stroke icons — no fill, no emoji
function IconCopy() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

function IconDownload() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  )
}

function IconArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  )
}

function EventbriteReveal({ goal, email, citySlug, onReset }) {
  const chapter = getChapter(citySlug)
  const prefillUrl = `${BASE_EB_URL}?email=${encodeURIComponent(email)}`
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)

  const r = getReq(goal)
  const weekNames = ['First', 'Second', 'Third', 'Fourth']
  const weekLabel = chapter ? weekNames[chapter.week - 1] + ' Saturday' : null

  useEffect(() => {
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
    await new Promise(res => setTimeout(res, 40))
    try {
      await document.fonts.ready
      const W = 900, PAD = 52
      const allRows = [...makeSandwichRows(r), ...makeSnackRows(r)]
      const HEADER_H = 180, ROW_H = 60
      const BODY_H = PAD + allRows.length * ROW_H + PAD
      const FOOTER_H = 76
      const H = HEADER_H + BODY_H + FOOTER_H

      const canvas = document.createElement('canvas')
      canvas.width = W; canvas.height = H
      const ctx = canvas.getContext('2d')

      // Header — navy
      ctx.fillStyle = '#003366'; ctx.fillRect(0, 0, W, HEADER_H)
      ctx.fillStyle = '#FF6500'; ctx.fillRect(0, 0, 10, HEADER_H)

      // Goal number
      ctx.font = 'bold 100px serif'; ctx.fillStyle = '#FF6500'; ctx.textAlign = 'left'
      ctx.fillText(String(goal), PAD + 14, HEADER_H - 28)
      const numW = ctx.measureText(String(goal)).width

      ctx.font = '600 22px sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.55)'
      ctx.fillText('SANDWICHES', PAD + 14 + numW + 18, HEADER_H - 52)
      ctx.font = '400 15px sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.35)'
      ctx.fillText('FEED THE CITY — GROCERY CHECKLIST', PAD + 14 + numW + 18, HEADER_H - 26)

      // Body
      ctx.fillStyle = '#F8F9FA'; ctx.fillRect(0, HEADER_H, W, BODY_H)

      allRows.forEach((row, i) => {
        const y = HEADER_H + PAD + i * ROW_H
        if (i > 0) {
          ctx.strokeStyle = '#E5E7EB'; ctx.lineWidth = 1
          ctx.beginPath(); ctx.moveTo(PAD, y); ctx.lineTo(W - PAD, y); ctx.stroke()
        }
        const midY = y + ROW_H / 2 + 6
        ctx.font = '600 19px sans-serif'; ctx.fillStyle = '#003366'; ctx.textAlign = 'left'
        ctx.fillText(row.label, PAD, midY)
        ctx.font = 'bold 22px sans-serif'; ctx.fillStyle = '#FF6500'; ctx.textAlign = 'right'
        ctx.fillText(row.qty, W - PAD, midY)
      })

      // Footer — navy
      ctx.fillStyle = '#003366'; ctx.fillRect(0, HEADER_H + BODY_H, W, FOOTER_H)
      ctx.font = '400 13px sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.38)'; ctx.textAlign = 'center'
      ctx.fillText('tangocharities.org/feed-the-city', W / 2, HEADER_H + BODY_H + FOOTER_H / 2 + 5)

      canvas.toBlob(blob => {
        if (!blob) return
        const filename = 'ftc-grocery-list.png'
        const file = new File([blob], filename, { type: 'image/png' })
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({ files: [file] }).catch(() => triggerDL(canvas, filename))
        } else {
          triggerDL(canvas, filename)
        }
      }, 'image/png')
    } finally {
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* ── Grocery manifest card ── */}
      <div className="eb-card">

        {/* Header: title + meta + icon toolbar */}
        <div className="eb-card-head">
          <div className="eb-card-title-wrap">
            <p className="eb-headline">Grocery List</p>
            <p className="eb-meta"><strong>{goal} sandwiches</strong></p>
            {chapter && (
              <p className="eb-meta eb-meta-city">{chapter.name} · {weekLabel}</p>
            )}
          </div>
          <div className="eb-toolbar" role="toolbar" aria-label="List actions">
            <button
              className={`eb-icon-btn${copied ? ' done' : ''}`}
              type="button"
              onClick={handleCopy}
              title="Copy list"
              aria-label="Copy grocery list to clipboard"
            >
              {copied ? <IconCheck /> : <IconCopy />}
            </button>
            <button
              className="eb-icon-btn"
              type="button"
              onClick={handleSaveImage}
              disabled={saving}
              title={saving ? 'Generating…' : 'Save as image'}
              aria-label="Download grocery list as image"
            >
              <IconDownload />
            </button>
          </div>
        </div>

        {/* Rows */}
        <div className="eb-rows">
          <div className="eb-section-label">Sandwiches</div>
          {makeSandwichRows(r).map(row => (
            <div key={row.label} className="eb-row">
              <span className="eb-row-name">{row.label}</span>
              <span className="eb-row-qty">{row.qty}</span>
            </div>
          ))}
          <div className="eb-section-label">Also Bring</div>
          {makeSnackRows(r).map(row => (
            <div key={row.label} className="eb-row">
              <span className="eb-row-name">{row.label}</span>
              <span className="eb-row-qty">{row.qty}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Eventbrite registration ── */}
      <p className="eb-register-prompt">
        Reserve your spot — your email is pre-filled.
      </p>
      <a
        className="eb-register-btn"
        href={prefillUrl}
        target="_blank"
        rel="noreferrer"
      >
        Register on Eventbrite <IconArrow />
      </a>

      <button className="eb-reset" type="button" onClick={onReset}>
        Plan another event
      </button>
    </motion.section>
  )
}

export default EventbriteReveal
