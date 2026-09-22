import { useEffect, useState } from 'react'
import { useOrderFlow } from '../state/OrderFlowContext'

export default function Eligibility() {
  const [state, actions] = useOrderFlow()
  const [checking, setChecking] = useState(true)
  const eligible = state.deliveryMode === 'drone'

  useEffect(() => {
    const t = setTimeout(() => setChecking(false), 900)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <div className="screen-header">
        <p className="eyebrow">04 · Drone zone eligible?</p>
        <h1 className="screen-title">Checking your delivery address</h1>
        <p className="screen-sub">We match {state.store?.name}'s location against active drone corridors.</p>
      </div>

      <div className="screen-body">
        <div className="eligibility-result">
          {checking ? (
            <>
              <ScanIcon />
              <p className="screen-sub">Scanning airspace corridors…</p>
            </>
          ) : eligible ? (
            <>
              <BadgeIcon color="var(--good)" />
              <h2 className="screen-title" style={{ fontSize: 18 }}>
                Eligible for drone delivery
              </h2>
              <p className="screen-sub">
                Estimated flight time is faster than standard courier for this route.
              </p>
            </>
          ) : (
            <>
              <BadgeIcon color="var(--text-muted)" />
              <h2 className="screen-title" style={{ fontSize: 18 }}>
                Outside the current drone corridor
              </h2>
              <p className="screen-sub">
                No landing pad is certified near this address yet. We'll fall back to a standard courier.
              </p>
            </>
          )}
        </div>
      </div>

      <div className="screen-footer">
        <button className="btn btn-ghost" onClick={actions.goBack}>
          Back
        </button>
        <button className="btn btn-primary" disabled={checking} onClick={actions.continueEligibility}>
          {checking ? 'Checking…' : eligible ? 'Continue to checkout' : 'Continue with courier'}
        </button>
      </div>
    </>
  )
}

function ScanIcon() {
  return (
    <svg className="eligibility-badge" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="26" stroke="var(--line)" strokeWidth="2" />
      <circle cx="32" cy="32" r="26" stroke="var(--signal)" strokeWidth="2" strokeDasharray="40 200">
        <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="1.1s" repeatCount="indefinite" />
      </circle>
      <circle cx="32" cy="32" r="4" fill="var(--signal)" />
    </svg>
  )
}

function BadgeIcon({ color }) {
  return (
    <svg className="eligibility-badge" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="26" stroke={color} strokeWidth="2" />
      <path d="M22 33l7 7 14-16" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
