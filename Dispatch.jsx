import { useEffect, useState } from 'react'
import { useOrderFlow } from '../state/OrderFlowContext'

const DRONE_STEPS = ['Order received', 'Preparing your items', 'Loading onto drone', 'Drone launched']
const COURIER_STEPS = ['Order received', 'Preparing your items', 'Courier assigned', 'Courier en route to pickup']

export default function Dispatch() {
  const [state, actions] = useOrderFlow()
  const steps = state.deliveryMode === 'drone' ? DRONE_STEPS : COURIER_STEPS
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    if (stepIndex >= steps.length - 1) return
    const t = setTimeout(() => setStepIndex((i) => i + 1), 850)
    return () => clearTimeout(t)
  }, [stepIndex, steps.length])

  const done = stepIndex === steps.length - 1

  return (
    <>
      <div className="screen-header">
        <p className="eyebrow">06 · Prepare & dispatch</p>
        <h1 className="screen-title">{state.deliveryMode === 'drone' ? 'Drone loaded & launched' : 'Courier on the way to pickup'}</h1>
        <p className="screen-sub">{state.store?.name} is getting your order ready.</p>
      </div>

      <div className="screen-body">
        <div className="status-panel">
          <DispatchIcon mode={state.deliveryMode} launched={done} />
          <div className="log-list">
            {steps.map((s, i) => (
              <div key={s} className={i === stepIndex ? 'current' : ''}>
                {i < stepIndex ? '✓ ' : i === stepIndex ? '› ' : '  '}
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="screen-footer">
        <span />
        <button className="btn btn-primary" disabled={!done} onClick={actions.dispatched}>
          {done ? 'Track delivery' : 'Preparing…'}
        </button>
      </div>
    </>
  )
}

function DispatchIcon({ mode, launched }) {
  const color = mode === 'drone' ? 'var(--signal)' : 'var(--med)'
  return (
    <svg className="drone-scene" viewBox="0 0 320 160" fill="none">
      <line x1="0" y1="130" x2="320" y2="130" stroke="var(--line)" strokeWidth="1" />
      {mode === 'drone' ? (
        <g transform={launched ? 'translate(0,-30)' : 'translate(0,0)'} style={{ transition: 'transform 500ms ease' }}>
          <rect x="130" y="90" width="60" height="18" rx="4" stroke={color} strokeWidth="2" />
          <line x1="120" y1="80" x2="140" y2="90" stroke={color} strokeWidth="2" />
          <line x1="200" y1="80" x2="180" y2="90" stroke={color} strokeWidth="2" />
          <line x1="120" y1="118" x2="140" y2="108" stroke={color} strokeWidth="2" />
          <line x1="200" y1="118" x2="180" y2="108" stroke={color} strokeWidth="2" />
          <circle cx="118" cy="78" r="8" stroke={color} strokeWidth="2" />
          <circle cx="202" cy="78" r="8" stroke={color} strokeWidth="2" />
          <circle cx="118" cy="120" r="8" stroke={color} strokeWidth="2" />
          <circle cx="202" cy="120" r="8" stroke={color} strokeWidth="2" />
        </g>
      ) : (
        <g>
          <rect x="120" y="95" width="60" height="28" rx="3" stroke={color} strokeWidth="2" />
          <path d="M180 100h16l8 12v11h-24z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <circle cx="136" cy="128" r="6" stroke={color} strokeWidth="2" />
          <circle cx="188" cy="128" r="6" stroke={color} strokeWidth="2" />
        </g>
      )}
    </svg>
  )
}
