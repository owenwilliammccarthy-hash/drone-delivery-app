import { useAppState } from '../state/AppState'
import { SAVED_LOCATIONS } from '../data/catalog'

const PREFS = [
  { key: 'notifications', label: 'Delivery Notifications' },
  { key: 'cameraFeed', label: 'Drone Camera Feed' },
  { key: 'sms', label: 'SMS Alerts' },
  { key: 'emailReceipts', label: 'Email Receipts' },
]

export default function ProfileTab() {
  const [state, actions] = useAppState()
  const { account, prefs } = state
  const delivered = state.orders.filter((o) => o.status === 'delivered').length

  return (
    <div className="tab-page">
      <header className="page-head">
        <p className="eyebrow">Account</p>
        <h1 className="page-title">Profile</h1>
      </header>

      <section className="card panel profile-card">
        <span className="avatar-lg">{account.name[0].toUpperCase()}</span>
        <div>
          <div className="profile-name">{account.name}</div>
          <div className="mono muted small">{account.email}</div>
          <span className="chip mono">{delivered >= 10 ? 'Tier 3 · Soar' : 'Tier 2 · Swift'}</span>
        </div>
      </section>

      <section className="card panel">
        <p className="eyebrow muted">Saved locations</p>
        <ul className="loc-list">
          {SAVED_LOCATIONS.map((loc) => (
            <li key={loc.id}>
              <span className="loc-emoji">{loc.emoji}</span>
              <span>
                <span className="loc-label">{loc.label}</span>
                <span className="mono muted small block">{loc.address}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card panel">
        <p className="eyebrow muted">Preferences</p>
        <ul className="pref-list">
          {PREFS.map((p) => (
            <li key={p.key}>
              <span id={`pref-${p.key}`}>{p.label}</span>
              <button
                role="switch"
                aria-checked={prefs[p.key]}
                aria-labelledby={`pref-${p.key}`}
                className={`switch ${prefs[p.key] ? 'on' : ''}`}
                onClick={() => actions.togglePref(p.key)}
              >
                <span className="switch-knob" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <button className="btn btn-danger btn-block" onClick={actions.signOut}>
        Sign Out
      </button>
    </div>
  )
}
