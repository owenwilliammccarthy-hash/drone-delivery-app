import { useAppState } from '../state/AppState'
import useNow from '../hooks/useNow'
import { PROGRESS_STAGES, telemetry } from '../hooks/telemetry'
import MapView from './MapView'
import { Stat } from './HomeTab'

export default function TrackTab() {
  const [state, actions] = useAppState()
  const order = state.activeOrder
  const now = useNow(Boolean(order))

  if (!order) {
    return (
      <div className="tab-page">
        <header className="page-head">
          <p className="eyebrow">Live tracking</p>
          <h1 className="page-title">Nothing in flight</h1>
          <p className="page-sub">Once your order launches you’ll see real-time ETA updates here.</p>
        </header>
        <MapView idle />
        <button className="btn btn-primary btn-block" onClick={actions.startOrder}>
          Start a new order
        </button>
      </div>
    )
  }

  const t = telemetry(order, now)
  const drone = order.mode === 'drone'
  const pct = Math.round(t.progress * 100)

  return (
    <div className="tab-page">
      <header className="page-head">
        <p className="eyebrow">Live tracking</p>
        <h1 className="page-title">Order #{order.id}</h1>
      </header>

      <MapView progress={t.progress} mode={order.mode} altitude={t.altitudeM} />

      <section className="card panel">
        <div className="panel-head">
          <h2 className="panel-title">Delivery Progress</h2>
          <span className="mono muted">{pct}%</span>
        </div>
        <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="progress-labels">
          {PROGRESS_STAGES.map((s, i) => (
            <span key={s} className={i <= t.stageIndex ? 'reached' : ''}>
              {i === 1 && !drone ? 'Picked up' : s}
            </span>
          ))}
        </div>
        <p className="mono small muted eta-line">
          {t.progress >= 1 ? 'Arrived at drop point' : `ETA ${t.eta} · ${t.distanceKm} km to go`}
        </p>
      </section>

      <section className="card panel">
        <p className="eyebrow muted">{drone ? 'Drone telemetry' : 'Courier details'}</p>
        <div className="stat-grid two">
          {drone ? (
            <>
              <Stat label="Drone ID" value="AX-7 Phantom" />
              <Stat label="Battery" value={`${t.battery}%`} />
              <Stat label="Altitude" value={`${t.altitudeM} m`} />
              <Stat label="Wind" value="12 km/h NW" />
            </>
          ) : (
            <>
              <Stat label="Courier" value="Sam R." />
              <Stat label="Vehicle" value="E-bike" />
              <Stat label="Speed" value={`${t.speedKmh} km/h`} />
              <Stat label="Distance" value={`${t.distanceKm} km`} />
            </>
          )}
        </div>
      </section>

      <section className="card item-card">
        <span className="item-emoji">{order.emoji}</span>
        <span className="order-text">
          <span className="order-title">{order.title}</span>
          <span className="mono muted small">
            {order.weightKg} kg · {order.storeKind === 'pharmacy' ? 'sealed' : 'insulated'}
          </span>
        </span>
        <button className="btn btn-outline btn-sm" onClick={() => actions.openSheet('order', order.id)}>
          Details
        </button>
      </section>

      <button className="btn btn-primary btn-block" onClick={() => actions.openSheet('verify', order.id)}>
        {t.progress >= 1 ? 'Unlock & release order' : `Show ${drone ? 'Drone' : 'Courier'} Unlock PIN`}
      </button>
      {t.progress < 1 && (
        <button className="link-btn" onClick={actions.fastForward}>
          Demo: skip to landing
        </button>
      )}
    </div>
  )
}
