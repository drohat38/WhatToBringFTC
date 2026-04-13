import { useState } from 'react'
import { motion } from 'framer-motion'
import './EmailCapture.css'

function EmailCapture({ onFlowChange }) {
  const [email, setEmail] = useState(
    () => localStorage.getItem('ftc_email') ?? ''
  )

  function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    localStorage.setItem('ftc_email', email.trim())
    // TODO Step 4 — Eventbrite reveal / Supabase write
  }

  return (
    <motion.section
      className="email-capture"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <p className="ec-label">Lock in your plan</p>
      <p className="ec-sub">
        Enter your email to save your grocery list and track your impact.
      </p>

      <form className="ec-form" onSubmit={handleSubmit}>
        <input
          className="ec-input"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <button className="ec-submit" type="submit">
          I&apos;m In — Save My Plan →
        </button>
      </form>

      <button className="ec-back" type="button" onClick={() => onFlowChange('PLAN')}>
        ← Back to planner
      </button>
    </motion.section>
  )
}

export default EmailCapture
