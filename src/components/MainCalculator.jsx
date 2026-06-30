import { motion } from 'framer-motion'
import { ITEMS, ALSO_ITEMS, getReq, getUnit } from '../data/ingredients'
import IngredientCard from './IngredientCard'
import './MainCalculator.css'

function MainCalculator({ goal, setGoal, onFlowChange }) {
  function stepGoal(delta) {
    setGoal(g => {
      const n = typeof g === 'number' ? g : parseInt(g, 10) || 5
      return Math.max(5, Math.min(500, n + delta))
    })
  }

  function handleGoalChange(e) {
    const raw = e.target.value
    if (raw === '') { setGoal(''); return }
    const val = parseInt(raw, 10)
    if (!isNaN(val)) setGoal(Math.min(500, val))
  }

  function handleGoalBlur(e) {
    const val = parseInt(e.target.value, 10)
    setGoal(isNaN(val) || val < 5 ? 5 : val > 500 ? 500 : val)
  }

  const req = getReq(typeof goal === 'number' ? goal : 5)

  return (
    <motion.div id="view-main" exit={{ opacity: 0, transition: { duration: 0.35, delay: 0.1 } }}>
      <div className="main-layout">
        
        {/* ── LEFT COLUMN: HERO, COUNTER & CTA (Sticky on Desktop) ── */}
        <div className="layout-left">
          <div className="goal-hero">
            <h1 className="goal-heading">
              How many <span className="goal-heading-accent">sandwiches</span> will you provide supplies for?
            </h1>
            <p className="goal-sub">
              Tell us your goal — we'll build your exact shopping list, ready to screenshot and take to the store before you come to the event.
            </p>
          </div>

          <div className="goal-counter">
            <div className="goal-ctrl">
              <button
                className="g-btn"
                onClick={() => stepGoal(-5)}
                aria-label="Decrease by 5"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="3"
                  strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <div className="g-center">
                <div className="g-input-wrap">
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
                  <span className="g-input-display" aria-hidden="true">
                    {goal === '' ? ' ' : goal}
                  </span>
                </div>
                <span className="g-unit">Sandwiches</span>
              </div>

              <button
                className="g-btn"
                onClick={() => stepGoal(5)}
                aria-label="Increase by 5"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
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

          {/* Desktop CTA location (hidden on mobile, uses CSS order/display) */}
          <div className="cta-block cta-desktop">
            <button
              className="cta-primary"
              onClick={() => {
                if (typeof goal !== 'number' || goal < 5) setGoal(5)
                onFlowChange('EVENTBRITE')
              }}
            >
              Get My Shopping List →
            </button>
          </div>
        </div>

        {/* ── RIGHT COLUMN: INGREDIENTS STACK ── */}
        <div className="layout-right">
          <div className="sec-hd">
            <p className="sec-ttl">Sandwich Supplies</p>
            <div className="sec-rule" />
          </div>
          <div className="ig" role="list">
            {ITEMS.map((item, index) => (
              <motion.div
                key={item.key}
                exit={{ opacity: 0, y: 20, transition: { duration: 0.22, delay: index * 0.025 } }}
              >
                <IngredientCard
                  item={item}
                  qty={req[item.key]}
                  unit={getUnit(item, req[item.key])}
                />
              </motion.div>
            ))}
          </div>

          <div className="sec-hd">
            <p className="sec-ttl">Snack Items</p>
            <div className="sec-rule" />
          </div>
          <div className="ig" role="list">
            {ALSO_ITEMS.map((item, index) => (
              <motion.div
                key={item.key}
                exit={{ opacity: 0, y: 20, transition: { duration: 0.22, delay: (ITEMS.length + index) * 0.025 } }}
              >
                <IngredientCard
                  item={item}
                  qty={req[item.key]}
                  unit={getUnit(item, req[item.key])}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile CTA location (hidden on desktop) */}
        <div className="cta-block cta-mobile">
          <button
            className="cta-primary"
            onClick={() => {
              if (typeof goal !== 'number' || goal < 5) setGoal(5)
              onFlowChange('EVENTBRITE')
            }}
          >
            Get My Shopping List →
          </button>
        </div>

      </div>
    </motion.div>
  )
}

export default MainCalculator
