import { useState } from 'react'
import { useAppState } from '../state/AppState'
import useNow from '../hooks/useNow'
import { telemetry } from '../hooks/telemetry'
import Sheet from './Sheet'

// Flow node 8: Verify & release -> ID check if needed
export default function Verify() {
  const [state, actions] = useAppState()
  const order = state.activeOrder
  const now = useNow(Boolean(order && !order.arrived))
  const [idConfirmed, setIdConfirmed] = useState(false)
  const [entered, setEntered] = useState('')
  if (!order) return null

  const t = telemetry(order, now)
  const landed = t.progress >= 1
  const drone = order.mode === 'drone'
  const pinOk = entered === order.pin
  const canRelease = landed && pinOk && (!order.idCheckRequired || idConfirmed)

  return (
    <Sheet
      eyebrow="Verify & release"
      title={drone ? 'Drone Unlock PIN' : 'Hand-off PIN'}
      sub={
        landed
          ? `Enter this PIN on the ${drone ? 'drone’s hatch keypad' : 'courier’s device'} to release your order.`
          : `Your ${drone ? 'drone' : 'courier'} is ${t.eta} away. The hatch unlocks once it lands.`
      }
      onClose={actions.closeSheet}
      footer={
        <button className="btn btn-primary btn-block" disabled={!canRelease} onClick={actions.released}>
          {landed ? 'Release order' : `Arriving in ${t.eta}`}
        </button>
      }
    >
      <div className="pin-display" aria-label={`PIN ${order.pin.split('').join(' ')}`}>
        {order.pin.split('').map((d, i) => (
          <span className="pin-digit mono" key={i}>
            {d}
          </span>
        ))}
      </div>

      {landed && (
        <label className="card panel field">
          <span className="stat-label">Keypad (demo): type the PIN as you would on the hatch</span>
          <input
            className="code-input mono"
            value={entered}
            onChange={(e) => setEntered(e.target.value.replace(/\D/g, '').slice(0, 4))}
            inputMode="numeric"
            placeholder="····"
            aria-invalid={entered.length === 4 && !pinOk}
          />
          {entered.length === 4 && !pinOk && <span className="error-text">That PIN doesn’t match.</span>}
        </label>
      )}

      {order.idCheckRequired && (
        <div className="notice">
          <strong>🪪 ID check required.</strong> This order contains a prescription item. Show a photo ID
          matching <strong>{state.account.name}</strong> to the {drone ? 'drone camera' : 'courier'}.
          <label className="check-row">
            <input type="checkbox" checked={idConfirmed} onChange={(e) => setIdConfirmed(e.target.checked)} disabled={!landed} />
            ID shown and matches account
          </label>
        </div>
      )}
    </Sheet>
  )
}
