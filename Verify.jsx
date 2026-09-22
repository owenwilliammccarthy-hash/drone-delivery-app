import { useState } from 'react'
import { useOrderFlow } from '../state/OrderFlowContext'

export default function Verify() {
  const [state, actions] = useOrderFlow()
  const [idConfirmed, setIdConfirmed] = useState(!state.idCheckRequired)
  const pin = '4192'

  return (
    <>
      <div className="screen-header">
        <p className="eyebrow">08 · Verify & release</p>
        <h1 className="screen-title">
          {state.deliveryMode === 'drone' ? 'Unlock the delivery hatch' : 'Confirm hand-off'}
        </h1>
        <p className="screen-sub">
          {state.idCheckRequired
            ? 'This order requires ID verification before release.'
            : 'Enter the drop-off PIN to release your order.'}
        </p>
      </div>

      <div className="screen-body">
        <div className="pin-display">
          {pin.split('').map((d, i) => (
            <span className="pin-digit" key={i}>
              {d}
            </span>
          ))}
        </div>

        {state.idCheckRequired && (
          <div className="id-check">
            <span>🪪</span>
            <div>
              <strong>ID check required.</strong> Confirm the name on your ID matches the account
              name before release.
              <div style={{ marginTop: 10 }}>
                <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
                  <input
                    type="checkbox"
                    checked={idConfirmed}
                    onChange={(e) => setIdConfirmed(e.target.checked)}
                  />
                  ID matches {state.account?.name}
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="screen-footer">
        <span />
        <button className="btn btn-primary" disabled={!idConfirmed} onClick={actions.verified}>
          Release order
        </button>
      </div>
    </>
  )
}
