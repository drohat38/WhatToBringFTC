import { motion } from 'framer-motion'
import { ITEMS, ALSO_ITEMS, getReq, getUnit } from '../data/ingredients'
import IngredientCard from './IngredientCard'
import './MainCalculator.css'

function MainCalculator({ goal, setGoal, onFlowChange }) {
  // goal/setGoal lifted to App so handleLogSubmit can read goal for ftc_logs

  // Functional setState keeps callbacks stable (rerender-functional-setstate).
  // Coerce the goal to a number first — it can be '' during keyboard editing.
  function stepGoal(delta) {
    setGoal(g => {
      const n = typeof g === 'number' ? g : parseInt(g, 10) || 5
      return Math.max(5, Math.min(500, n + delta))
    })
  }

  // Don't clamp during typing — users need to clear the field and type a
  // multi-digit number without the value snapping to 5 after each keystroke.
  // Cap only the upper bound so they can't blow out the layout with 9999.
  function handleGoalChange(e) {
    const raw = e.target.value
    if (raw === '') { setGoal(''); return }
    const val = parseInt(raw, 10)
    if (!isNaN(val)) setGoal(Math.min(500, val))
  }

  // Clamp once the user leaves the field.
  function handleGoalBlur(e) {
    const val = parseInt(e.target.value, 10)
    setGoal(isNaN(val) || val < 5 ? 5 : val > 500 ? 500 : val)
  }

  // Derived during render — no effect needed (rerender-derived-state-no-effect)
  const req = getReq(typeof goal === 'number' ? goal : 5)

  return (
    <motion.div id="view-main" exit={{ opacity: 0, transition: { duration: 0.35, delay: 0.1 } }}>
      {/* ── Goal setter ── */}
      <div className="goal-section">
        <p className="goal-eyebrow">How many sandwiches will you provide supplies for?</p>

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
            {/* motion.span is the visual layer; input is an invisible overlay for interaction */}
            <div style={{ position: 'relative', width: '160px' }}>
              {/* Input first (z-index 0) — invisible but receives keyboard/touch events */}
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
                style={{ position: 'absolute', inset: 0, color: 'transparent', caretColor: '#FF6500', background: 'transparent', border: 'none', zIndex: 0 }}
              />
              {/* Span second (z-index 1) — visible display */}
              <span
                className="g-input"
                style={{ display: 'block', pointerEvents: 'none', position: 'relative', zIndex: 1 }}
              >
                {goal}
              </span>
            </div>
            <span className="g-unit">Sandwiches</span>
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

      {/* ── Snack items grid ── */}
      <div className="sec-hd sec-hd--minor">
        <p className="sec-ttl">Snack Items</p>
        <div className="sec-rule" />
      </div>
      <div className="ig ig-2" role="list">
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

      {/* ── CTA ── */}
      <div className="cta-block">
        <button
          className="cta-primary"
          onClick={() => {
            // Safety net: if the user advances while the field is mid-edit,
            // commit the current value to a valid number first.
            if (typeof goal !== 'number' || goal < 5) setGoal(5)
            onFlowChange('EVENTBRITE')
          }}
        >
          Get My Shopping List →
        </button>
      </div>
    </motion.div>
  )
}

export default MainCalculator
