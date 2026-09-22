import { CourierIcon } from './Icons'

// Flow branch "No": Standard courier -> Fallback delivery
export default function Fallback() {
  return (
    <div className="card panel result">
      <span className="result-icon warn">
        <CourierIcon width="34" height="34" />
      </span>
      <strong>Standard courier assigned</strong>
      <span className="muted small">
        A courier from our local fleet picks up your order once it’s prepared. You get the same live
        tracking and PIN-protected hand-off as a drone drop.
      </span>
    </div>
  )
}
