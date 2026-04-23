import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import './index.css'
import MainCalculator from './components/MainCalculator'
import EventbriteReveal from './components/EventbriteReveal'

function App() {
  const [flowState, setFlowState] = useState('PLAN')
  const [goal, setGoal] = useState(30)

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

  function handleReset() {
    setFlowState('PLAN')
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
        {flowState === 'EVENTBRITE' && (
          <EventbriteReveal
            key="eventbrite-reveal"
            goal={goal}
            email=""
            citySlug=""
            onReset={handleReset}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
