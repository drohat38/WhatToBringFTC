import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import './index.css'
import MainCalculator from './components/MainCalculator'
import EmailCapture from './components/EmailCapture'

function App() {
  const [flowState, setFlowState] = useState('PLAN')

  return (
    <div id="app-shell">
      <MainCalculator flowState={flowState} onFlowChange={setFlowState} />
      <AnimatePresence>
        {flowState === 'LOG' && (
          <EmailCapture onFlowChange={setFlowState} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
