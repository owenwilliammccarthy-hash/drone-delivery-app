import { useState } from 'react'
import { useAppState } from '../state/AppState'
import Sheet from './Sheet'
import { CheckIcon } from './Icons'

// Flow node 9: Confirm & rate -> Feedback submitted
export default function Confirm() {
  const [state, actions] = useAppState()
  const [order] = useState(state.activeOrder) // keep a copy: rating moves it into history
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)
  if (!order) return null

  if (submitted) {
    return (
      <Sheet
        eyebrow="Confirm & rate"
        title="Feedback submitted"
        sub="Thanks! It helps us route smarter next time."
        onClose={actions.closeSheet}
        footer={
          <button className="btn btn-primary btn-block" onClick={() => { actions.closeSheet(); actions.setTab('home') }}>
            Back to home
          </button>
        }
      >
        <div className="card panel result">
          <span className="result-icon good">
            <CheckIcon width="30" height="30" />
          </span>
          <strong>Order #{order.id} delivered</strong>
          <span className="muted small">
            {order.title} · rated {rating}/5
          </span>
        </div>
      </Sheet>
    )
  }

  return (
    <Sheet
      eyebrow="Confirm & rate"
      title="Order delivered"
      sub={`How did the ${order.mode === 'drone' ? 'drone drop' : 'courier hand-off'} go?`}
      footer={
        <button
          className="btn btn-primary btn-block"
          disabled={rating === 0}
          onClick={() => {
            actions.rate(rating, feedback.trim())
            setSubmitted(true)
          }}
        >
          Submit feedback
        </button>
      }
    >
      <div className="card panel result">
        <span className="item-emoji">{order.emoji}</span>
        <strong>{order.title}</strong>
        <span className="mono muted small">#{order.id} · {order.storeName}</span>
        <div className="rating-row" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              role="radio"
              aria-checked={rating === n}
              className={`star ${n <= rating ? 'on' : ''}`}
              onClick={() => setRating(n)}
              aria-label={`${n} star${n === 1 ? '' : 's'}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <textarea
        className="card feedback"
        placeholder="Anything we should know? (optional)"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
    </Sheet>
  )
}
