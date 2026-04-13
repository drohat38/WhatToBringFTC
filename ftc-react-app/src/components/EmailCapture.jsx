import { useState } from 'react'
import { motion } from 'framer-motion'
import { CHAPTERS_BY_WEEK } from '../data/chapters'
import './EmailCapture.css'

function EmailCapture({ onFlowChange, onLogSubmit }) {
  const [email, setEmail] = useState(
    () => localStorage.getItem('ftc_email') ?? ''
  )
  const [citySlug, setCitySlug] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!citySlug) { setError('Please select your city.'); return }
    if (!email.trim()) { setError('Please enter your email.'); return }
    setError('')
    onLogSubmit(email.trim(), citySlug)
  }

  return (
    <motion.section
      className="email-capture"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <p className="ec-label">Lock in your spot</p>
      <p className="ec-sub">
        Select your city and enter your email to get your grocery checklist.
      </p>

      <form className="ec-form" onSubmit={handleSubmit} noValidate>
        <div className="ec-field">
          <label className="ec-field-label" htmlFor="ec-city">City</label>
          <select
            id="ec-city"
            className="ec-select"
            value={citySlug}
            onChange={e => { setCitySlug(e.target.value); setError('') }}
          >
            <option value="">Select your city…</option>
            {CHAPTERS_BY_WEEK.map(group => (
              <optgroup key={group.week} label={group.label}>
                {group.chapters.map(ch => (
                  <option key={ch.slug} value={ch.slug}>{ch.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="ec-field">
          <label className="ec-field-label" htmlFor="ec-email">Email</label>
          <input
            id="ec-email"
            className="ec-input"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setError('') }}
            autoComplete="email"
          />
        </div>

        {error && <p className="ec-error" role="alert">{error}</p>}

        <button className="ec-submit" type="submit">
          Get My Grocery List →
        </button>
      </form>

      <button className="ec-back" type="button" onClick={() => onFlowChange('PLAN')}>
        ← Back to planner
      </button>
    </motion.section>
  )
}

export default EmailCapture
