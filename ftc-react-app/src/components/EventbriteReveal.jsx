import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { getChapter } from '../data/chapters'
import './EventbriteReveal.css'

// Prototype prefill URL — in production this becomes a real Eventbrite embed or URL
const BASE_EB_URL = 'https://www.eventbrite.com/e/feed-the-city-registration'

function EventbriteReveal({ email, citySlug, onReset }) {
  const chapter = getChapter(citySlug)
  const prefillUrl = `${BASE_EB_URL}?email=${encodeURIComponent(email)}`

  useEffect(() => {
    // In the real Wix embed: scroll parent page to the Eventbrite section
    window.parent.postMessage({ type: 'ftc:scrollToRegistration' }, '*')
  }, [])

  return (
    <motion.section
      className="eb-reveal"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="eb-card">
        <div className="eb-check">&#10003;</div>
        <p className="eb-title">You&apos;re all set!</p>
        {chapter && (
          <p className="eb-city">
            {chapter.name} &middot; {['First', 'Second', 'Third', 'Fourth'][chapter.week - 1]} Saturday
          </p>
        )}
        <p className="eb-blurb">
          Complete your registration on Eventbrite so the organizers know you&apos;re coming.
          Your email has been pre-filled.
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
