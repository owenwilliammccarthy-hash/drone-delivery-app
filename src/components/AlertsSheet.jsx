import { useAppState } from '../state/AppState'
import { formatDate } from '../hooks/telemetry'
import Sheet from './Sheet'

export default function AlertsSheet() {
  const [state, actions] = useAppState()
  return (
    <Sheet eyebrow="Inbox" title="Alerts" onClose={actions.closeSheet}>
      <div className="stack">
        {state.alerts.map((a) => (
          <div className="card panel alert" key={a.id}>
            <strong>{a.title}</strong>
            <span className="muted small">{a.body}</span>
            <span className="mono faint small">{formatDate(a.at)}</span>
          </div>
        ))}
        {state.alerts.length === 0 && <p className="muted small center">No alerts yet.</p>}
      </div>
    </Sheet>
  )
}
