import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import './index.css'
import MainCalculator from './components/MainCalculator'
import EmailCapture from './components/EmailCapture'
import EventbriteReveal from './components/EventbriteReveal'

function App() {
  const [flowState, setFlowState] = useState('PLAN')
  const [goal, setGoal] = useState(30)
  const [logData, setLogData] = useState({ email: '', city: '' })

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
      <MainCalculator
        goal={goal}
        setGoal={setGoal}
        flowState={flowState}
        onFlowChange={setFlowState}
      />
      <AnimatePresence>
        {flowState === 'LOG' && (
          <EmailCapture
            key="email-capture"
            onFlowChange={setFlowState}
            onLogSubmit={handleLogSubmit}
          />
        )}
        {flowState === 'EVENTBRITE' && (
          <EventbriteReveal
            key="eventbrite-reveal"
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
