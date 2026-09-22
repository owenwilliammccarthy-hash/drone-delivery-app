import { STORES } from '../data/catalog'

// Flow node 2: Pick store -> Restaurant or pharmacy
export default function PickStore({ actions }) {
  return (
    <div className="stack">
      {STORES.map((store) => (
        <button key={store.id} className="card store-card" onClick={() => actions.pickStore(store.id)}>
          <span className="item-emoji">{store.emoji}</span>
          <span className="order-text">
            <span className="mono small accent upper">{store.kind}</span>
            <span className="order-title">{store.name}</span>
            <span className="muted small">{store.tagline}</span>
          </span>
          <span className="store-meta">
            <span className="mono small muted">{store.prepTime}</span>
            <span className={`badge ${store.zone === 'drone' ? 'badge-delivered' : 'badge-transit'}`}>
              {store.zone === 'drone' ? 'Drone zone' : 'Courier only'}
            </span>
          </span>
        </button>
      ))}
    </div>
  )
}
