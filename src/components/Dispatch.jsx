import { useEffect, useState } from 'react'
import { CheckIcon, CourierIcon, DroneIcon } from './Icons'

const DRONE_STEPS = ['Payment confirmed', 'Kitchen preparing your items', 'Sealed & loaded into drone', 'Drone launched']
const COURIER_STEPS = ['Payment confirmed', 'Kitchen preparing your items', 'Courier assigned', 'Courier picked up']
const PHARMACY_PREP = 'Pharmacist packing your order'

// Flow node 6: Prepare & dispatch -> Drone loaded & launched
export default function Dispatch({ flow, store, onDone }) {
  const drone = flow.deliveryMode === 'drone'
  const steps = (drone ? DRONE_STEPS : COURIER_STEPS).map((s, i) =>
    i === 1 && store.kind === 'pharmacy' ? PHARMACY_PREP : s,
  )
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (idx >= steps.length - 1) {
      onDone()
      return
    }
    const t = setTimeout(() => setIdx((i) => i + 1), 900)
    return () => clearTimeout(t)
  }, [idx, steps.length, onDone])

  const launched = idx === steps.length - 1
  return (
    <div className="stack">
      <div className={`card panel launch-pad ${launched ? 'launched' : ''}`}>
        <span className="launch-vehicle">
          {drone ? <DroneIcon width="56" height="56" /> : <CourierIcon width="56" height="56" />}
        </span>
        <span className="launch-ground" />
      </div>
      <ol className="card panel checklist">
        {steps.map((s, i) => (
          <li key={s} className={i < idx || launched ? 'done' : i === idx ? 'current' : ''}>
            <span className="check-dot">{i < idx || launched ? <CheckIcon width="12" height="12" /> : null}</span>
            {s}
          </li>
        ))}
      </ol>
    </div>
  )
}
