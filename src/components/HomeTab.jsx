import { useAppState } from '../state/AppState'
import useNow from '../hooks/useNow'
import { telemetry } from '../hooks/telemetry'
import MapView from './MapView'
import StatusBadge from './StatusBadge'
import OrderRow from './OrderRow'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function HomeTab() {
  const [state, actions] = useAppState()
  const { account, activeOrder: order, orders, alerts } = state
  const now = useNow(Boolean(order))
  const t = order ? telemetry(order, now) : null
  const unread = alerts.filter((a) => !a.read).length
  const firstName = account.name.split(' ')[0]

  return (
    <div className="tab-page">
      <header className="home-head">
        <div>
          <p className="eyebrow">{greeting()}</p>
          <h1 className="page-title">{firstName}</h1>
        </div>
        <button className="avatar-btn" onClick={() => actions.setTab('profile')} aria-label="Profile">
          {firstName[0].toUpperCase()}
        </button>
      </header>

      <section className="card panel">
        <div className="panel-head">
          <p className="eyebrow muted">Active delivery</p>
          {order && <StatusBadge status={order.arrived ? 'arrived' : 'transit'} />}
        </div>
        {order ? (
          <>
            <button className="map-link" onClick={() => actions.setTab('track')} aria-label="Open live tracking">
              <MapView progress={t.progress} mode={order.mode} altitude={t.altitudeM} />
            </button>
            <div className="stat-grid three">
              <Stat label="ETA" value={t.eta} />
              <Stat label="Distance" value={`${t.distanceKm} km`} />
              <Stat label="Speed" value={`${t.speedKmh} km/h`} />
            </div>
            <button className="btn btn-primary btn-block" onClick={() => actions.openSheet('verify', order.id)}>
              Show {order.mode === 'drone' ? 'Drone' : 'Courier'} Unlock PIN
            </button>
          </>
        ) : (
          <>
            <MapView idle />
            <div className="empty-note">
              <strong>No drone in the air</strong>
              <span className="muted">Order food or pharmacy essentials and track it here live.</span>
            </div>
            <button className="btn btn-primary btn-block" onClick={actions.startOrder}>
              Start a new order
            </button>
          </>
        )}
      </section>

      <div className="tile-row">
        <button className="card tile" onClick={actions.startOrder}>
          <span className="tile-emoji">🍔</span>
          <span className="tile-title">New Order</span>
          <span className="mono muted small">{order ? '1 order in flight' : 'Delivers in 8 min'}</span>
        </button>
        <button className="card tile" onClick={() => actions.openSheet('alerts')}>
          <span className="tile-emoji">🔔</span>
          <span className="tile-title">Alerts</span>
          <span className="mono muted small">{unread ? `${unread} unread` : 'All caught up'}</span>
        </button>
      </div>

      <section>
        <p className="eyebrow muted section-label">Recent deliveries</p>
        <div className="stack">
          {orders.slice(0, 3).map((o) => (
            <OrderRow key={o.id} order={o} onClick={() => actions.openSheet('order', o.id)} />
          ))}
          {orders.length === 0 && <p className="muted small">No deliveries yet.</p>}
        </div>
      </section>
    </div>
  )
}

export function Stat({ label, value }) {
  return (
    <div className="stat">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  )
}
