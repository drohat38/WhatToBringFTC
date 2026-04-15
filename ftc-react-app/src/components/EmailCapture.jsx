import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { CHAPTERS_BY_WEEK } from '../data/chapters'
import './EmailCapture.css'

function EmailCapture({ goal, onFlowChange, onLogSubmit }) {
  const [email, setEmail] = useState(
    () => localStorage.getItem('ftc_email') ?? ''
  )
  const [citySlug, setCitySlug] = useState('')
  const [error, setError] = useState('')

  // Combobox state
  const [cityQuery, setCityQuery] = useState('')
  const [cityOpen, setCityOpen]   = useState(false)
  const allCities = useMemo(
    () => CHAPTERS_BY_WEEK.flatMap(g => g.chapters),
    []
  )
  const selectedCity = allCities.find(c => c.slug === citySlug) ?? null
  const cityOptions  = cityQuery.trim()
    ? allCities.filter(c => c.name.toLowerCase().includes(cityQuery.toLowerCase()))
    : allCities

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
      <p className="ec-label">Lock in your contribution</p>

      <p className="ec-confirm">
        These supplies make <strong>{goal}</strong> sandwiches. Bring these to the event and help assemble meals for families in your community.
      </p>
      <p className="ec-instruction">
        Select your city and enter your email to get your grocery checklist.
      </p>

      <form className="ec-form" onSubmit={handleSubmit} noValidate>
        <div className="ec-field">
          <label className="ec-field-label" htmlFor="ec-city">City</label>
          <div className="ec-combobox">
            <input
              id="ec-city"
              className="ec-combobox-input"
              type="text"
              placeholder="Search your city…"
              autoComplete="off"
              value={selectedCity && !cityOpen ? selectedCity.name : cityQuery}
              onFocus={() => { setCityOpen(true); if (selectedCity) setCityQuery('') }}
              onChange={e => { setCityQuery(e.target.value); setCitySlug(''); setCityOpen(true) }}
              onBlur={() => setTimeout(() => setCityOpen(false), 150)}
            />
            {cityOpen && cityOptions.length > 0 && (
              <div className="ec-city-list" role="listbox">
                {cityOptions.map(c => (
                  <button
                    key={c.slug}
                    type="button"
                    role="option"
                    className={`ec-city-opt${c.slug === citySlug ? ' active' : ''}`}
                    onMouseDown={() => {
                      setCitySlug(c.slug); setCityQuery(''); setCityOpen(false); setError('')
                    }}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>
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
