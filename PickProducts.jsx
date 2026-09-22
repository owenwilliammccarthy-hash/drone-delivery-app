import { useOrderFlow } from '../state/OrderFlowContext'

export default function PickProducts() {
  const [state, actions] = useOrderFlow()
  const store = state.store
  if (!store) return null

  const cartEntries = Object.entries(state.cart)
  const total = cartEntries.reduce((sum, [itemId, qty]) => {
    const item = store.items.find((i) => i.id === itemId)
    return sum + (item?.price ?? 0) * qty
  }, 0)
  const itemCount = cartEntries.reduce((sum, [, qty]) => sum + qty, 0)

  return (
    <>
      <div className="screen-header">
        <p className="eyebrow">03 · Pick products</p>
        <h1 className="screen-title">{store.name}</h1>
        <p className="screen-sub">Add items to your cart. Prep time {store.prepTime}.</p>
      </div>

      <div className="screen-body">
        {store.items.map((item) => {
          const qty = state.cart[item.id] ?? 0
          return (
            <div className="cart-row" key={item.id}>
              <div>
                <div className="cart-item-name">
                  {item.name}
                  {item.requiresId && ' · ID required'}
                </div>
                <div className="cart-item-price">{item.price > 0 ? `$${item.price.toFixed(2)}` : 'covered by copay'}</div>
              </div>
              <div className="qty-control">
                <button className="qty-btn" onClick={() => actions.setQty(item.id, qty - 1)} aria-label={`Remove ${item.name}`}>
                  −
                </button>
                <span className="qty-value">{qty}</span>
                <button className="qty-btn" onClick={() => actions.setQty(item.id, qty + 1)} aria-label={`Add ${item.name}`}>
                  +
                </button>
              </div>
            </div>
          )
        })}

        {itemCount > 0 && (
          <div className="cart-total">
            <span>{itemCount} item{itemCount === 1 ? '' : 's'}</span>
            <span>${total.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="screen-footer">
        <button className="btn btn-ghost" onClick={actions.goBack}>
          Back
        </button>
        <button className="btn btn-primary" disabled={itemCount === 0} onClick={actions.submitCart}>
          Check delivery eligibility
        </button>
      </div>
    </>
  )
}
