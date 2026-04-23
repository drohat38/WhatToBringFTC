import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import './index.css'
import MainCalculator from './components/MainCalculator'
import EventbriteReveal from './components/EventbriteReveal'

const DEFAULT_GOAL = 30

function App() {
  const [flowState, setFlowState] = useState('PLAN')
  const [goal, setGoal] = useState(DEFAULT_GOAL)

  // Tell the parent Wix page to resize the iframe whenever our content height
  // changes. Throttled via rAF so rapid layout thrash during framer-motion
  // transitions coalesces into one message per frame.
  useEffect(() => {
    let scheduled = false
    let lastHeight = 0

    const post = () => {
      scheduled = false
      const h = document.body.scrollHeight
      if (h === lastHeight) return
      lastHeight = h
      window.parent.postMessage({ type: 'ftc:resize', height: h }, '*')
    }

    const ro = new ResizeObserver(() => {
      if (scheduled) return
      scheduled = true
      requestAnimationFrame(post)
    })
    ro.observe(document.body)
    return () => ro.disconnect()
  }, [])

  function handleReset() {
    setGoal(DEFAULT_GOAL)
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
            onReset={handleReset}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
