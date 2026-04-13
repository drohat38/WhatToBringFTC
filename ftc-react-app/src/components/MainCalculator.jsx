import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ITEMS, ALSO_ITEMS, getReq, getUnit } from '../data/ingredients'
import IngredientCard from './IngredientCard'
import './MainCalculator.css'

// Hoisted: static JSX that never changes — no re-render cost (rendering-hoist-jsx)
const FLOW_STEPS = (
  <div className="flow-steps" aria-label="How it works">
    <div className="fs-step fs-active">
      <span className="fs-num">1</span>
      <span className="fs-lbl">Plan</span>
    </div>
    <div className="fs-step">
      <span className="fs-num">2</span>
      <span className="fs-lbl">Log</span>
    </div>
    <div className="fs-step">
      <span className="fs-num">3</span>
      <span className="fs-lbl">Impact</span>
    </div>
  </div>
)

function MainCalculator({ flowState, onFlowChange }) {
  const [goal, setGoal] = useState(30)

  // Functional setState keeps callbacks stable (rerender-functional-setstate)
  function stepGoal(delta) {
    setGoal(g => Math.max(5, Math.min(500, g + delta)))
  }

  function handleGoalChange(e) {
    const val = parseInt(e.target.value, 10)
    if (!isNaN(val)) setGoal(Math.max(5, Math.min(500, val)))
  }

  function handleGoalBlur(e) {
    const val = parseInt(e.target.value, 10)
    setGoal(isNaN(val) || val < 5 ? 5 : val > 500 ? 500 : val)
  }

  // Derived during render — no effect needed (rerender-derived-state-no-effect)
  const req = getReq(goal)

  return (
    <motion.div id="view-main" layout>
      {FLOW_STEPS}

      <AnimatePresence mode="wait">
        {flowState === 'PLAN' ? (
          <motion.div
            key="plan-content"
            layout
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            {/* ── Goal setter ── */}
            <div className="goal-section">
              <p className="goal-eyebrow">How many sandwiches will you make?</p>

              <div className="goal-ctrl">
                <button
                  className="g-btn"
                  onClick={() => stepGoal(-5)}
                  aria-label="Decrease by 5"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="3"
                    strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                <div className="g-center">
                  <input
                    className="g-input"
                    type="number"
                    value={goal}
                    min={5}
                    max={500}
                    inputMode="numeric"
                    aria-label="Sandwich goal"
                    onChange={handleGoalChange}
                    onBlur={handleGoalBlur}
                  />
                  <span className="g-unit">Sandwiches</span>
                  <span className="g-edit-hint" aria-hidden="true">tap to edit</span>
                </div>

                <button
                  className="g-btn"
                  onClick={() => stepGoal(5)}
                  aria-label="Increase by 5"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="3"
                    strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>

              <p className="g-nudge">
                Most volunteers bring supplies for <strong>25–30 sandwiches.</strong>
              </p>
            </div>

            {/* ── Sandwich supplies grid ── */}
            <div className="sec-hd">
              <p className="sec-ttl">Sandwich Supplies</p>
              <div className="sec-rule" />
            </div>
            <div className="ig ig-5" role="list">
              {ITEMS.map(item => (
                <IngredientCard
                  key={item.key}
                  item={item}
                  qty={req[item.key]}
                  unit={getUnit(item, req[item.key])}
                />
              ))}
            </div>

            {/* ── Snack items grid ── */}
            <div className="sec-hd sec-hd--minor">
              <p className="sec-ttl">Snack Items</p>
              <div className="sec-rule" />
            </div>
            <div className="ig ig-2" role="list">
              {ALSO_ITEMS.map(item => (
                <IngredientCard
                  key={item.key}
                  item={item}
                  qty={req[item.key]}
                  unit={getUnit(item, req[item.key])}
                />
              ))}
            </div>

            {/* ── CTA ── */}
            <div className="cta-block">
              <p className="cta-stmt">
                These supplies make <span className="sn">{goal}</span> sandwiches.
              </p>
              <p className="cta-sub">
                Bring these to the event and help assemble meals for families in your community.
              </p>
              <p className="cta-blurb">
                Ready to shop? Log your contribution below to securely track your community
                impact and unlock your official grocery checklist.
              </p>
              <button className="cta-primary" onClick={() => onFlowChange('LOG')}>
                Log Impact &amp; Get Grocery List →
              </button>
              <button className="cta-secondary">
                View my impact history
              </button>
            </div>

            <div className="pb-40" />
          </motion.div>
        ) : (
          <motion.div
            key="receipt-content"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <div className="receipt-card">
              <div className="receipt-icon">&#10003;</div>
              <p className="receipt-headline">
                Supplies for <span className="receipt-num">{goal}</span> sandwiches
              </p>
              <ul className="receipt-list">
                {[...ITEMS, ...ALSO_ITEMS].map(item => (
                  <li key={item.key} className="receipt-item">
                    <span className="ri-name">{item.name}</span>
                    <span className="ri-qty">{req[item.key]} {getUnit(item, req[item.key])}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pb-24" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default MainCalculator
