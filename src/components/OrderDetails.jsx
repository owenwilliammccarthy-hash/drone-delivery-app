import { useAppState } from '../state/AppState'
import { formatDate } from '../hooks/telemetry'
import Sheet from './Sheet'
import StatusBadge from './StatusBadge'

export default function OrderDetails({ orderId }) {
  const [state, actions] = useAppState()
  const order = [state.activeOrder, ...state.orders].find((o) => o?.id === orderId)
  if (!order) return null
  const active = order.status === 'transit'

  return (
    <Sheet
      eyebrow={`Order #${order.id}`}
      title={order.title}
      sub={formatDate(order.placedAt)}
      onClose={actions.closeSheet}
      footer={
        active ? (
          <button className="btn btn-primary btn-block" onClick={() => { actions.closeSheet(); actions.setTab('track') }}>
            Track live
          </button>
        ) : null
      }
    >
      <section className="card panel">
        <div className="panel-head">
          <span className="item-emoji">{order.emoji}</span>
          <StatusBadge status={active && order.arrived ? 'arrived' : order.status} />
        </div>
        {order.storeName && <div className="summary-line"><span className="muted">From</span><span>{order.storeName}</span></div>}
        <div className="summary-line"><span className="muted">Weight</span><span>{order.weightKg} kg</span></div>
        {order.mode && <div className="summary-line"><span className="muted">Delivery</span><span>{order.mode === 'drone' ? 'Drone' : 'Standard courier'}</span></div>}
        {order.etaMin != null && <div className="summary-line"><span className="muted">Delivered in</span><span>{order.etaMin} min</span></div>}
        {order.rating != null && <div className="summary-line"><span className="muted">Your rating</span><span>{'★'.repeat(order.rating)}</span></div>}
        {order.lines && (
          <>
            <div className="divider" />
            {order.lines.map((l) => (
              <div className="summary-line" key={l.id}>
                <span>{l.qty} × {l.name}</span>
                <span>${(l.price * l.qty).toFixed(2)}</span>
              </div>
            ))}
            <div className="summary-line total"><span>Total paid</span><span>${order.total.toFixed(2)}</span></div>
          </>
        )}
      </section>
      {active && !order.arrived && (
        <button className="btn btn-danger btn-block" onClick={actions.cancelOrder}>
          Cancel order
        </button>
      )}
    </Sheet>
  )
}
