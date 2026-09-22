// Stylised city map with the delivery route. `progress` 0..1 moves the vehicle
// from the store (bottom-left) to the drop point (top-right).

const FROM = { x: 58, y: 172 }
const TO = { x: 196, y: 64 }

export default function MapView({ progress = 0, mode = 'drone', altitude, idle = false }) {
  const x = FROM.x + (TO.x - FROM.x) * progress
  const y = FROM.y + (TO.y - FROM.y) * progress
  return (
    <div className="map">
      <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Delivery route map">
        <rect width="300" height="200" className="map-ground" />
        {/* city blocks */}
        <rect x="96" y="22" width="62" height="40" rx="3" className="map-block" />
        <rect x="18" y="92" width="44" height="30" rx="3" className="map-block" />
        <rect x="126" y="104" width="62" height="38" rx="3" className="map-block" />
        <rect x="230" y="46" width="56" height="52" rx="3" className="map-block" />
        <rect x="214" y="140" width="70" height="40" rx="3" className="map-block" />
        {/* roads */}
        <path d="M0 84 L300 70" className="map-road" strokeWidth="9" />
        <path d="M78 0 L90 200" className="map-road" strokeWidth="7" />
        <path d="M204 0 L198 200" className="map-road" strokeWidth="6" />
        <path d="M0 158 L300 150" className="map-road" strokeWidth="4" />
        {!idle && (
          <>
            <line x1={FROM.x} y1={FROM.y} x2={TO.x} y2={TO.y} className="map-route" />
            <circle cx={FROM.x} cy={FROM.y} r="5" className="map-pin" />
            <circle cx={FROM.x} cy={FROM.y} r="1.8" className="map-pin-core" />
            <circle cx={TO.x} cy={TO.y} r="11" className="map-target-ring" />
            <circle cx={TO.x} cy={TO.y} r="5.5" className="map-pin" />
            <circle cx={TO.x} cy={TO.y} r="2" className="map-pin-core" />
            <g transform={`translate(${x} ${y})`} className="map-vehicle">
              {mode === 'drone' ? (
                <g>
                  <path d="M-7 -7L7 7M7 -7L-7 7" />
                  <circle cx="-7" cy="-7" r="3" />
                  <circle cx="7" cy="-7" r="3" />
                  <circle cx="-7" cy="7" r="3" />
                  <circle cx="7" cy="7" r="3" />
                  <circle r="2" className="map-pin-core" />
                </g>
              ) : (
                <g>
                  <rect x="-8" y="-5" width="16" height="10" rx="2" />
                  <circle cx="-4" cy="6" r="1.8" />
                  <circle cx="4" cy="6" r="1.8" />
                </g>
              )}
            </g>
          </>
        )}
      </svg>
      {!idle && mode === 'drone' && altitude != null && <span className="map-chip">ALT {altitude}m</span>}
      {!idle && mode === 'courier' && <span className="map-chip">COURIER</span>}
      <span className="map-coords">37.7749° N, 122.4194° W</span>
    </div>
  )
}
