import { useOrderFlow } from '../state/OrderFlowContext'

export default function Fallback() {
  const [, actions] = useOrderFlow()

  return (
    <>
      <div className="screen-header">
        <p className="eyebrow">Fallback delivery</p>
        <h1 className="screen-title">Standard courier assigned</h1>
        <p className="screen-sub">
          Your order will still be tracked live, just on wheels instead of rotors.
        </p>
      </div>

      <div className="screen-body">
        <div className="eligibility-result">
          <svg className="eligibility-badge" viewBox="0 0 64 64" fill="none">
            <rect x="10" y="26" width="34" height="16" rx="3" stroke="var(--med)" strokeWidth="2" />
            <path d="M44 30h8l4 6v6h-12z" stroke="var(--med)" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="20" cy="44" r="4" stroke="var(--med)" strokeWidth="2" />
            <circle cx="46" cy="44" r="4" stroke="var(--med)" strokeWidth="2" />
          </svg>
          <p className="screen-sub">
            A courier from our local fleet will pick up your order once it's prepared, and
            you'll get the same real-time ETA updates as a drone delivery.
          </p>
        </div>
      </div>

      <div className="screen-footer">
        <span />
        <button className="btn btn-primary" onClick={actions.continueFallback}>
          Continue to checkout
        </button>
      </div>
    </>
  )
}
