import { useEffect, useState } from 'react'
import { useOrderFlow } from '../state/OrderFlowContext'

const TOTAL_ETA_SECONDS = 12 // compressed for demo purposes

export default function Tracking() {
  const [state, actions] = useOrderFlow()
  const [elapsed, setElapsed] = useState(0)
  const progress = Math.min(1, elapsed / TOTAL_ETA_SECONDS)
  const remaining = Math.max(0, TOTAL_ETA_SECONDS - elapsed)
  const arrived = progress >= 1

  useEffect(() => {
    if (arrived) return
    const t = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(t)
  }, [arrived])

  const label = state.deliveryMode === 'drone' ? 'Drone' : 'Courier'

  return (
    <>
      <div className="screen-header">
        <p className="eyebrow">07 · Live tracking</p>
        <h1 className="screen-title">{label} en route</h1>
        <p className="screen-sub">Real-time ETA updates, refreshed automatically.</p>
      </div>

      <div className="screen-body">
        <div className="status-panel">
          <MapTrack progress={progress} mode={state.deliveryMode} />
          <span className="eta-pill">{arrived ? 'Arrived' : `ETA ${remaining}s`}</span>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
          </div>
          <div className="log-list">
            <div className={progress >= 0 ? 'current' : ''}>
              {progress > 0.05 ? '✓ ' : '› '}Left {state.store?.name}
            </div>
            <div className={progress >= 0.4 ? 'current' : ''}>
              {progress > 0.45 ? '✓ ' : progress >= 0.4 ? '› ' : '  '}Halfway to you
            </div>
            <div className={progress >= 0.9 ? 'current' : ''}>
              {arrived ? '✓ ' : progress >= 0.9 ? '› ' : '  '}Approaching drop point
            </div>
          </div>
        </div>
      </div>

      <div className="screen-footer">
        <span />
        <button className="btn btn-primary" disabled={!arrived} onClick={actions.arrived}>
          {arrived ? 'Continue to hand-off' : 'Tracking…'}
        </button>
      </div>
    </>
  )
}

function MapTrack({ progress, mode }) {
  const color = mode === 'drone' ? 'var(--signal)' : 'var(--med)'
  const x = 40 + progress * 240
  return (
    <svg className="drone-scene" viewBox="0 0 320 160" fill="none">
      <path d="M40 120 Q160 40 280 120" stroke="var(--line)" strokeWidth="2" strokeDasharray="4 6" />
      <circle cx="40" cy="120" r="5" fill="var(--text-muted)" />
      <circle cx="280" cy="120" r="5" fill="var(--good)" />
      <circle cx={x} cy={120 - Math.sin((progress * Math.PI))* 60} r="7" fill={color} />
    </svg>
  )
}
