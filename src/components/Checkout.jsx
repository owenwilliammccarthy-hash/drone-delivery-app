import { cartLines, orderTotals } from '../state/AppState'
import { SAVED_LOCATIONS } from '../data/catalog'

// Flow node 5: Checkout -> Payment confirmed
export default function Checkout({ flow, store }) {
  const lines = cartLines(store, flow.cart)
  const { subtotal, fee, tax, total } = orderTotals(lines, flow.deliveryMode)
  return (
    <div className="stack">
      <section className="card panel">
        <p className="eyebrow muted">Your order</p>
        {lines.map((l) => (
          <div className="summary-line" key={l.id}>
            <span>
              {l.qty} × {l.name}
            </span>
            <span>${(l.price * l.qty).toFixed(2)}</span>
          </div>
        ))}
        <div className="divider" />
        <div className="summary-line muted">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="summary-line muted">
          <span>{flow.deliveryMode === 'drone' ? 'Drone delivery fee' : 'Courier delivery fee'}</span>
          <span>${fee.toFixed(2)}</span>
        </div>
        <div className="summary-line muted">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="summary-line total">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </section>

      <section className="card panel">
        <p className="eyebrow muted">Deliver to</p>
        <div className="loc-inline">
          <span className="loc-emoji">{SAVED_LOCATIONS[0].emoji}</span>
          <span>
            <span className="loc-label">{SAVED_LOCATIONS[0].label}</span>
            <span className="mono muted small block">{SAVED_LOCATIONS[0].address}</span>
          </span>
        </div>
        <p className="eyebrow muted">Pay with</p>
        <div className="loc-inline">
          <span className="loc-emoji">💳</span>
          <span>
            <span className="loc-label">Visa ending 4471</span>
            <span className="mono muted small block">•••• •••• •••• 4471</span>
          </span>
        </div>
      </section>

      {flow.idCheckRequired && (
        <div className="notice">🪪 This order includes an item that requires an ID check on delivery.</div>
      )}
    </div>
  )
}

export function checkoutTotal(flow, store) {
  return orderTotals(cartLines(store, flow.cart), flow.deliveryMode).total
}
