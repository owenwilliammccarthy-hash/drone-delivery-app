import { DroneIcon } from './Icons'
import StatusBadge from './StatusBadge'
import { formatDate } from '../hooks/telemetry'

export default function OrderRow({ order, onClick }) {
  const status = order.status === 'transit' && order.arrived ? 'arrived' : order.status
  return (
    <button className="card order-row" onClick={onClick}>
      <span className="order-icon">
        <DroneIcon width="18" height="18" />
      </span>
      <span className="order-text">
        <span className="order-title">{order.title}</span>
        <span className="mono muted small">
          <span className="accent">#{order.id}</span> · {order.weightKg} kg
        </span>
        <span className="mono faint small">{formatDate(order.placedAt)}</span>
      </span>
      <StatusBadge status={status} />
    </button>
  )
}
