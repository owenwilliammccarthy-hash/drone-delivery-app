import { useEffect, useState } from 'react'
import { DroneIcon, CourierIcon } from './Icons'

// Flow node 4: Drone zone eligible? (branches to checkout or fallback)
export default function Eligibility({ flow, store, onChecked }) {
  const [checking, setChecking] = useState(true)
  const eligible = flow.deliveryMode === 'drone'

  useEffect(() => {
    const t = setTimeout(() => {
      setChecking(false)
      onChecked()
    }, 1100)
    return () => clearTimeout(t)
  }, [onChecked])

  return (
    <div className="card panel result">
      {checking ? (
        <>
          <span className="radar" aria-hidden="true" />
          <strong>Scanning airspace corridors…</strong>
          <span className="muted small">Matching {store.name} and your address against active drone corridors.</span>
        </>
      ) : eligible ? (
        <>
          <span className="result-icon good">
            <DroneIcon width="34" height="34" />
          </span>
          <strong>Eligible for drone delivery</strong>
          <span className="muted small">Route is inside the certified corridor. Estimated flight: 6 min.</span>
        </>
      ) : (
        <>
          <span className="result-icon warn">
            <CourierIcon width="34" height="34" />
          </span>
          <strong>Outside the drone corridor</strong>
          <span className="muted small">
            No certified landing zone near {store.name} yet, so we’ll fall back to a standard courier.
          </span>
        </>
      )}
    </div>
  )
}
