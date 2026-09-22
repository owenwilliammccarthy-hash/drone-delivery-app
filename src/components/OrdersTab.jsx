import { useState } from 'react'
import { useAppState } from '../state/AppState'
import OrderRow from './OrderRow'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'transit', label: 'In Transit' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
]

export default function OrdersTab() {
  const [state, actions] = useAppState()
  const [filterIdx, setFilterIdx] = useState(0)
  const all = [state.activeOrder, ...state.orders].filter(Boolean)
  const filter = FILTERS[filterIdx]
  const shown = filter.key === 'all' ? all : all.filter((o) => o.status === filter.key)
  const delivered = all.filter((o) => o.status === 'delivered')
  const avgEta = delivered.length
    ? Math.round(delivered.reduce((s, o) => s + (o.etaMin ?? 0), 0) / delivered.length)
    : 0

  return (
    <div className="tab-page">
      <header className="page-head row">
        <div>
          <p className="eyebrow">History</p>
          <h1 className="page-title">Orders</h1>
        </div>
        <button className="btn btn-outline btn-sm mono" onClick={() => setFilterIdx((i) => (i + 1) % FILTERS.length)}>
          {filter.key === 'all' ? 'Filter' : filter.label}
        </button>
      </header>

      <div className="stat-grid three">
        <div className="card summary">
          <span className="summary-value">{all.length}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="card summary">
          <span className="summary-value">{delivered.length}</span>
          <span className="stat-label">Delivered</span>
        </div>
        <div className="card summary">
          <span className="summary-value">{avgEta} min</span>
          <span className="stat-label">Avg ETA</span>
        </div>
      </div>

      <div className="stack">
        {shown.map((o) => (
          <OrderRow key={o.id} order={o} onClick={() => actions.openSheet('order', o.id)} />
        ))}
        {shown.length === 0 && <p className="muted small center">No {filter.label.toLowerCase()} orders.</p>}
      </div>
    </div>
  )
}
