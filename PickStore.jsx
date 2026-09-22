import { STORES } from '../data/catalog'
import { useOrderFlow } from '../state/OrderFlowContext'

export default function PickStore() {
  const [state, actions] = useOrderFlow()

  return (
    <>
      <div className="screen-header">
        <p className="eyebrow">02 · Pick store</p>
        <h1 className="screen-title">Hi {state.account?.name?.split(' ')[0] ?? 'there'}, where from?</h1>
        <p className="screen-sub">Restaurants and pharmacies near you, ranked by fastest prep.</p>
      </div>

      <div className="screen-body">
        {STORES.map((store) => (
          <button key={store.id} className="store-card" onClick={() => actions.pickStore(store.id)}>
            <div>
              <span className="store-kind">{store.kind}</span>
              <div className="store-name">{store.name}</div>
              <div className="store-tagline">{store.tagline}</div>
            </div>
            <div className="store-meta">
              {store.prepTime}
              <br />
              <span className={`zone-chip ${store.zone}`}>
                {store.zone === 'drone' ? 'in drone corridor' : 'standard courier only'}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="screen-footer">
        <button className="btn btn-ghost" onClick={actions.goBack}>
          Back
        </button>
        <span />
      </div>
    </>
  )
}
