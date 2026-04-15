import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getChapter } from '../data/chapters'
import { getReq, getUnit, ITEMS, ALSO_ITEMS } from '../data/ingredients'
import './EventbriteReveal.css'

const BASE_EB_URL = 'https://www.eventbrite.com/e/feed-the-city-registration'

// Plain-text grocery list — STRICTLY NO EMOJIS
function buildGroceryText(goal, cityName) {
  const r = getReq(goal)
  return [
    'FEED THE CITY — SHOPPING LIST',
    cityName || null,
    'Goal: ' + goal + ' sandwiches (~' + Math.round(goal / 2) + ' families)',
    '',
    '— SANDWICHES —',
    'Sliced Bread     ' + r.bread + (r.bread === 1 ? ' loaf' : ' loaves'),
    'Deli Meat        ' + r.meat + ' oz',
    'Sliced Cheese    ' + r.cheese + (r.cheese === 1 ? ' slice' : ' slices'),
    'Yellow Mustard   ' + r.mustard + (r.mustard === 1 ? ' bottle' : ' bottles'),
    'Sandwich Bags    ' + r.bags + (r.bags === 1 ? ' box' : ' boxes'),
    '',
    '— ALSO BRING —',
    'Chips            ' + r.chips + (r.chips === 1 ? ' bag' : ' bags') + ' (full-size)',
    'Tangerines       ' + r.tangerines + (r.tangerines === 1 ? ' bag' : ' bags') + ' · 3 lb',
    '',
    'feedthecity.org | tangocharities.org',
  ].filter(l => l !== null).join('\n')
}

// Arrow icon for Register button
function IconArrowRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  )
}

function EventbriteReveal({ goal, email, citySlug, onReset }) {
  const chapter = getChapter(citySlug)
  const prefillUrl = `${BASE_EB_URL}?email=${encodeURIComponent(email)}`
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)

  const r = getReq(goal)
  const allItems = [...ITEMS, ...ALSO_ITEMS]

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

      const W = 900
      const PAD = 52
      const RADIUS = 16

      const rows = [
        { label: 'Sliced Bread', qty: r.bread + (r.bread === 1 ? ' loaf' : ' loaves') },
        { label: 'Deli Meat', qty: r.meat + ' oz' },
        { label: 'Sliced Cheese', qty: r.cheese + (r.cheese === 1 ? ' slice' : ' slices') },
        { label: 'Yellow Mustard', qty: r.mustard + (r.mustard === 1 ? ' bottle' : ' bottles') },
        { label: 'Sandwich Bags', qty: r.bags + (r.bags === 1 ? ' box' : ' boxes') },
        { label: 'Chips', qty: r.chips + (r.chips === 1 ? ' full-size bag' : ' full-size bags') },
        { label: 'Tangerines (3 lb)', qty: r.tangerines + (r.tangerines === 1 ? ' bag' : ' bags') },
      ]

      const HEADER_H = 140
      const ROW_H = 62
      const BODY_H = PAD + rows.length * ROW_H + PAD / 2
      const FOOTER_H = 56
      const OUTER_PAD = 24 // space around the card
      const CARD_H = HEADER_H + BODY_H + FOOTER_H
      const H = CARD_H + OUTER_PAD * 2

      const canvas = document.createElement('canvas')
      canvas.width = W
      canvas.height = H
      const ctx = canvas.getContext('2d')

      // Page background — very light gray
      ctx.fillStyle = '#F2F4F7'
      ctx.fillRect(0, 0, W, H)

      // ── Card (white, rounded) ──
      const CX = OUTER_PAD
      const CY = OUTER_PAD
      const CW = W - OUTER_PAD * 2

      ctx.save()
      // Rounded card background
      ctx.beginPath()
      ctx.moveTo(CX + RADIUS, CY)
      ctx.lineTo(CX + CW - RADIUS, CY)
      ctx.quadraticCurveTo(CX + CW, CY, CX + CW, CY + RADIUS)
      ctx.lineTo(CX + CW, CY + CARD_H - RADIUS)
      ctx.quadraticCurveTo(CX + CW, CY + CARD_H, CX + CW - RADIUS, CY + CARD_H)
      ctx.lineTo(CX + RADIUS, CY + CARD_H)
      ctx.quadraticCurveTo(CX, CY + CARD_H, CX, CY + CARD_H - RADIUS)
      ctx.lineTo(CX, CY + RADIUS)
      ctx.quadraticCurveTo(CX, CY, CX + RADIUS, CY)
      ctx.closePath()
      ctx.fillStyle = '#FFFFFF'
      ctx.fill()
      // Subtle card shadow via stroke
      ctx.strokeStyle = 'rgba(0,0,0,0.07)'
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.restore()

      // ── Orange left accent bar ──
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(CX + RADIUS, CY)
      ctx.lineTo(CX + 8, CY)
      ctx.quadraticCurveTo(CX, CY, CX, CY + RADIUS)
      ctx.lineTo(CX, CY + CARD_H - RADIUS)
      ctx.quadraticCurveTo(CX, CY + CARD_H, CX + RADIUS, CY + CARD_H)
      ctx.lineTo(CX + 8, CY + CARD_H)
      ctx.lineTo(CX + 8, CY)
      ctx.closePath()
      ctx.fillStyle = '#FF6500'
      ctx.fill()
      ctx.restore()

      // ── Header ──
      const HX = CX + 8 + PAD / 2

      // "Shopping List" in Anton-style (bold serif)
      ctx.font = 'bold 36px serif'
      ctx.fillStyle = '#003366'
      ctx.textAlign = 'left'
      ctx.fillText('Shopping List', HX, CY + 48)

      // City + week meta (orange)
      const weekLabels = ['First', 'Second', 'Third', 'Fourth']
      const metaParts = []
      if (chapter?.name) metaParts.push(chapter.name)
      if (chapter?.week) metaParts.push(weekLabels[chapter.week - 1] + ' Saturday')
      if (metaParts.length) {
        ctx.font = '700 14px sans-serif'
        ctx.fillStyle = '#FF6500'
        ctx.fillText(metaParts.join('  ·  '), HX, CY + 74)
      }

      // Sandwich count (muted)
      ctx.font = '400 13px sans-serif'
      ctx.fillStyle = '#9CA3AF'
      ctx.fillText('Supplies for ' + goal + ' sandwiches', HX, CY + 96)

      // Divider below header
      ctx.strokeStyle = '#E5E7EB'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(CX + 8, CY + HEADER_H)
      ctx.lineTo(CX + CW, CY + HEADER_H)
      ctx.stroke()

      // ── Rows ──
      rows.forEach((row, i) => {
        const rowY = CY + HEADER_H + PAD / 2 + i * ROW_H
        const midY = rowY + ROW_H / 2 + 6

        // Row divider (skip first)
        if (i > 0) {
          ctx.strokeStyle = '#E5E7EB'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(HX, rowY)
          ctx.lineTo(CX + CW - 24, rowY)
          ctx.stroke()
        }

        // Circle checkbox (empty)
        const circleX = HX + 11
        const circleY = midY - 6
        ctx.strokeStyle = '#D1D5DB'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(circleX, circleY, 10, 0, Math.PI * 2)
        ctx.stroke()

        // Item name
        ctx.font = '600 18px sans-serif'
        ctx.fillStyle = '#1A1A1A'
        ctx.textAlign = 'left'
        ctx.fillText(row.label, HX + 32, midY)

        // Quantity (Anton-style bold, orange)
        ctx.font = 'bold 20px serif'
        ctx.fillStyle = '#FF6500'
        ctx.textAlign = 'right'
        ctx.fillText(row.qty, CX + CW - 28, midY)
      })

      // ── Footer ──
      const footerY = CY + HEADER_H + BODY_H
      ctx.strokeStyle = '#E5E7EB'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(CX + 8, footerY)
      ctx.lineTo(CX + CW, footerY)
      ctx.stroke()

      ctx.font = '400 12px sans-serif'
      ctx.fillStyle = '#9CA3AF'
      ctx.textAlign = 'center'
      ctx.fillText('tangocharities.org/feed-the-city', W / 2, footerY + FOOTER_H / 2 + 5)

      canvas.toBlob((blob) => {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* ── Tabbed Receipt Presentation ── */}
      <div className="receipt-wrapper">
        <div className="receipt-back-tab">
          <h2 className="receipt-headline">Shopping List</h2>
          {chapter && (
            <p className="receipt-meta">
              {chapter.name} | {['First', 'Second', 'Third', 'Fourth'][chapter.week - 1]} Saturday
            </p>
          )}
          <p className="receipt-sub-goal">Supplies for <span>{goal}</span> sandwiches</p>
        </div>

        <motion.div 
          className="receipt-front-tab"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <ul className="receipt-list">
            {allItems.map((item, index) => (
              <motion.li
                key={item.key}
                className="receipt-bubble"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.04, duration: 0.3 }}
              >
                <span className="ri-name">{item.name}</span>
                <span className="ri-qty">{r[item.key]} {getUnit(item, r[item.key])}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="eb-actions">
        <button
          className={`eb-util-btn${copied ? ' copied' : ''}`}
          type="button"
          onClick={handleCopy}
        >
          {copied ? 'Copied to Clipboard' : 'Copy Shopping List'}
        </button>
        <button
          className="eb-util-btn"
          type="button"
          onClick={handleSaveImage}
          disabled={saving}
        >
          {saving ? 'Generating Image…' : 'Save as Image'}
        </button>
      </div>

      {/* ── Final Eventbrite Registration ── */}
      <a
        className="eb-primary-cta"
        href={prefillUrl}
        target="_blank"
        rel="noreferrer"
      >
        Register Here <IconArrowRight />
      </a>

      <button className="eb-reset" type="button" onClick={onReset}>
        Plan another event
      </button>
    </motion.section>
  )
}

export default EventbriteReveal
