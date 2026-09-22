import { OrderFlowProvider, useOrderFlow } from './state/OrderFlowContext'
import CreateAccount from './components/CreateAccount'
import PickStore from './components/PickStore'
import PickProducts from './components/PickProducts'
import Eligibility from './components/Eligibility'
import Fallback from './components/Fallback'
import Checkout from './components/Checkout'
import Dispatch from './components/Dispatch'
import Tracking from './components/Tracking'
import Verify from './components/Verify'
import Confirm from './components/Confirm'

// Display steps for the rail — collapses the branch (eligibility/fallback)
// into a single "Drone zone check" step, matching the source diagram.
const DISPLAY_STEPS = [
  { key: 'create-account', label: 'Create account' },
  { key: 'pick-store', label: 'Pick store' },
  { key: 'pick-products', label: 'Pick products' },
  { key: 'eligibility', label: 'Drone zone check', altKeys: ['fallback'] },
  { key: 'checkout', label: 'Checkout' },
  { key: 'dispatch', label: 'Prepare & dispatch' },
  { key: 'tracking', label: 'Live tracking' },
  { key: 'verify', label: 'Verify & release' },
  { key: 'confirm', label: 'Confirm & rate' },
]

function stepStatus(step, currentStage) {
  const keys = [step.key, ...(step.altKeys ?? [])]
  const order = DISPLAY_STEPS.flatMap((s) => [s.key, ...(s.altKeys ?? [])])
  const currentIdx = order.indexOf(currentStage)
  const stepIdx = Math.min(...keys.map((k) => order.indexOf(k)))
  if (keys.includes(currentStage)) return 'active'
  if (stepIdx < currentIdx) return 'done'
  return 'upcoming'
}

function Screen() {
  const [state] = useOrderFlow()
  switch (state.stage) {
    case 'create-account':
      return <CreateAccount />
    case 'pick-store':
      return <PickStore />
    case 'pick-products':
      return <PickProducts />
    case 'eligibility':
      return <Eligibility />
    case 'fallback':
      return <Fallback />
    case 'checkout':
      return <Checkout />
    case 'dispatch':
      return <Dispatch />
    case 'tracking':
      return <Tracking />
    case 'verify':
      return <Verify />
    case 'confirm':
      return <Confirm />
    default:
      return null
  }
}

function Rail() {
  const [state] = useOrderFlow()
  return (
    <aside className="rail">
      <div className="brand">
        <svg className="brand-mark" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="15" stroke="#ffb020" strokeWidth="1.4" opacity="0.5" />
          <path d="M16 5v6M16 21v6M5 16h6M21 16h6" stroke="#ffb020" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="16" cy="16" r="4.5" fill="#ffb020" />
        </svg>
        <div>
          <div className="brand-name">Skyhatch</div>
          <div className="brand-sub">Food & medicine, flown in</div>
        </div>
      </div>
      <ol className="flightpath">
        {DISPLAY_STEPS.map((step, i) => {
          const status = stepStatus(step, state.stage)
          return (
            <li key={step.key} className={`flightpath-step ${status}`}>
              <span className="flightpath-dot">{status === 'done' ? '✓' : i + 1}</span>
              <span className="flightpath-label">{step.label}</span>
            </li>
          )
        })}
      </ol>
      <p className="rail-note">
        This mirrors the product's user-flow diagram exactly, including the drone-zone
        eligibility branch: outside the corridor, orders fall back to standard courier
        instead of a drone.
      </p>
    </aside>
  )
}

function Shell() {
  return (
    <div className="app-shell">
      <Rail />
      <main className="screen">
        <Screen />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <OrderFlowProvider>
      <Shell />
    </OrderFlowProvider>
  )
}
