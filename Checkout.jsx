import { useState } from 'react'
import { useOrderFlow } from '../state/OrderFlowContext'

const DELIVERY_FEE = { drone: 2.99, courier: 4.49 }

export default function Checkout() {
  const [state, actions] = useOrderFlow()
  const [placing, setPlacing] = useState(false)
  const store = state.store

  const subtotal = Object.entries(state.cart).reduce((sum, [itemId, qty]) => {
    const item = store?.items.find((i) => i.id === itemId)
    return sum + (item?.price ?? 0) * qty
  }, 0)
  const fee = DELIVERY_FEE[state.deliveryMode] ?? 2.99
  const tax = subtotal * 0.09
  const total = subtotal + fee + tax

  function handlePay() {
    setPlacing(true)
    setTimeout(() => {
      actions.confirmPayment()
    }, 900)
  }

  return (
    <>
      <div className="screen-header">
        <p className="eyebrow">05 · Checkout</p>
        <h1 className="screen-title">Confirm & pay</h1>
        <p className="screen-sub">
          Delivering by {state.deliveryMode === 'drone' ? 'drone' : 'standard courier'} from {store?.name}.
        </p>
      </div>

      <div className="screen-body">
        <div>
          <div className="summary-line">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-line">
            <span>{state.deliveryMode === 'drone' ? 'Drone delivery fee' : 'Courier delivery fee'}</span>
            <span>${fee.toFixed(2)}</span>
          </div>
          <div className="summary-line">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="summary-line total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="payment-card">
          <span>💳</span>
          <div>
            <div style={{ fontSize: 13.5 }}>Visa ending in 4471</div>
            <div className="payment-dots">•••• •••• •••• 4471</div>
          </div>
        </div>

        {state.idCheckRequired && (
          <div className="id-check">
            🪪 This order includes an item that requires ID verification on delivery.
          </div>
        )}
      </div>

      <div className="screen-footer">
        <button className="btn btn-ghost" onClick={actions.goBack}>
          Back
        </button>
        <button className="btn btn-primary" disabled={placing} onClick={handlePay}>
          {placing ? 'Processing…' : `Pay $${total.toFixed(2)}`}
        </button>
      </div>
    </>
  )
}
