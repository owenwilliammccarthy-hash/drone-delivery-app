import { cartLines } from '../state/AppState'

// Flow node 3: Pick products -> Add items to cart
export default function PickProducts({ store, cart, actions }) {
  const lines = cartLines(store, cart)
  const count = lines.reduce((s, l) => s + l.qty, 0)
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0)
  return (
    <div className="stack">
      {store.items.map((item) => {
        const qty = cart[item.id] ?? 0
        return (
          <div className="card cart-row" key={item.id}>
            <span className="order-text">
              <span className="order-title">{item.name}</span>
              <span className="mono small muted">
                {item.price > 0 ? `$${item.price.toFixed(2)}` : 'Covered by copay'} · {item.weightKg} kg
              </span>
              {item.requiresId && <span className="mono small accent">ID required on delivery</span>}
            </span>
            <span className="qty">
              <button className="qty-btn" onClick={() => actions.setQty(item.id, qty - 1)} disabled={qty === 0} aria-label={`Remove ${item.name}`}>
                −
              </button>
              <span className="qty-value mono">{qty}</span>
              <button className="qty-btn" onClick={() => actions.setQty(item.id, qty + 1)} aria-label={`Add ${item.name}`}>
                +
              </button>
            </span>
          </div>
        )
      })}
      {count > 0 && (
        <div className="summary-line total">
          <span>
            {count} item{count === 1 ? '' : 's'}
          </span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
      )}
    </div>
  )
}
