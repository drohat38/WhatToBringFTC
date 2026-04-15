import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import './index.css'
import MainCalculator from './components/MainCalculator'
import EmailCapture from './components/EmailCapture'
import EventbriteReveal from './components/EventbriteReveal'

function App() {
  const [flowState, setFlowState] = useState('PLAN')
  const [goal, setGoal] = useState(30)
  const [logData, setLogData] = useState({ email: '', city: '' })

  // Fire ftc:resize whenever the document body height changes.
  useEffect(() => {
    const ro = new ResizeObserver(() => {
      window.parent.postMessage(
        { type: 'ftc:resize', height: document.body.scrollHeight },
        '*'
      )
    })
    ro.observe(document.body)
    return () => ro.disconnect()
  }, [])

  function handleLogSubmit(email, citySlug) {
    // Persist — same schema as legacy script.js: { meals, date, chapter }
    localStorage.setItem('ftc_email', email)
    const logs = JSON.parse(localStorage.getItem('ftc_logs') || '[]')
    logs.push({ meals: goal, date: new Date().toISOString(), chapter: citySlug })
    localStorage.setItem('ftc_logs', JSON.stringify(logs))

    setLogData({ email, city: citySlug })
    setFlowState('EVENTBRITE')
  }

  function handleReset() {
    setFlowState('PLAN')
    setLogData({ email: '', city: '' })
  }

  return (
    <div id="app-shell">
      <AnimatePresence mode="wait">
        {flowState === 'PLAN' && (
          <MainCalculator
            key="main-calc"
            goal={goal}
            setGoal={setGoal}
            onFlowChange={setFlowState}
          />
        )}
        {flowState === 'LOG' && (
          <EmailCapture
            key="email-capture"
            goal={goal}
            onFlowChange={setFlowState}
            onLogSubmit={handleLogSubmit}
          />
        )}
        {flowState === 'EVENTBRITE' && (
          <EventbriteReveal
            key="eventbrite-reveal"
            goal={goal}
            email={logData.email}
            citySlug={logData.city}
            onReset={handleReset}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
