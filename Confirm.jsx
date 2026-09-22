import { useState } from 'react'
import { useOrderFlow } from '../state/OrderFlowContext'

export default function Confirm() {
  const [state, actions] = useOrderFlow()
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit() {
    actions.submitFeedback(rating, feedback)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <>
        <div className="screen-header">
          <p className="eyebrow">09 · Confirm & rate</p>
          <h1 className="screen-title">Feedback submitted</h1>
          <p className="screen-sub">Thanks — it helps us route smarter next time.</p>
        </div>
        <div className="screen-body">
          <div className="confirm-panel">
            <svg className="confirm-check" viewBox="0 0 56 56" fill="none">
              <circle cx="28" cy="28" r="24" stroke="var(--good)" strokeWidth="2" />
              <path d="M18 29l7 7 14-15" stroke="var(--good)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="screen-sub">
              Order from {state.store?.name} rated {rating}/5.
            </p>
          </div>
        </div>
        <div className="screen-footer">
          <span />
          <button className="btn btn-primary" onClick={actions.newOrder}>
            Start a new order
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="screen-header">
        <p className="eyebrow">09 · Confirm & rate</p>
        <h1 className="screen-title">Order delivered</h1>
        <p className="screen-sub">How did {state.deliveryMode === 'drone' ? 'the drone drop' : 'your courier'} go?</p>
      </div>

      <div className="screen-body">
        <div className="rating-row">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              className={`rating-star ${n <= rating ? 'selected' : ''}`}
              onClick={() => setRating(n)}
              aria-label={`Rate ${n} star${n === 1 ? '' : 's'}`}
            >
              ★
            </button>
          ))}
        </div>
        <textarea
          className="feedback-input"
          placeholder="Anything we should know? (optional)"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
      </div>

      <div className="screen-footer">
        <span />
        <button className="btn btn-primary" disabled={rating === 0} onClick={handleSubmit}>
          Submit feedback
        </button>
      </div>
    </>
  )
}
