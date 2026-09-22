import { AppStateProvider, currentFlowNode, useAppState } from './state/AppState'
import CreateAccount from './components/CreateAccount'
import HomeTab from './components/HomeTab'
import TrackTab from './components/TrackTab'
import OrdersTab from './components/OrdersTab'
import ProfileTab from './components/ProfileTab'
import OrderFlow from './components/OrderFlow'
import Verify from './components/Verify'
import Confirm from './components/Confirm'
import AlertsSheet from './components/AlertsSheet'
import OrderDetails from './components/OrderDetails'
import { BrandMark, HomeIcon, OrdersIcon, ProfileIcon, TrackIcon } from './components/Icons'

// Nodes of the user-flow diagram, shown as a stepper beside the phone on wide screens.
// The eligibility branch (fallback) collapses into one step, as in the diagram.
const FLOW_NODES = [
  { key: 'create-account', label: 'Create account', sub: 'Sign up & verify' },
  { key: 'pick-store', label: 'Pick store', sub: 'Restaurant or pharmacy' },
  { key: 'pick-products', label: 'Pick products', sub: 'Add items to cart' },
  { key: 'eligibility', label: 'Drone zone eligible?', sub: 'No → standard courier', altKeys: ['fallback'] },
  { key: 'checkout', label: 'Checkout', sub: 'Payment confirmed' },
  { key: 'dispatch', label: 'Prepare & dispatch', sub: 'Drone loaded & launched' },
  { key: 'tracking', label: 'Live tracking', sub: 'Real-time ETA updates' },
  { key: 'verify', label: 'Verify & release', sub: 'ID check if needed' },
  { key: 'confirm', label: 'Confirm & rate', sub: 'Feedback submitted' },
]
const NODE_ORDER = ['create-account', 'idle', ...FLOW_NODES.slice(1).flatMap((n) => [n.key, ...(n.altKeys ?? [])])]

function nodeStatus(node, current) {
  const keys = [node.key, ...(node.altKeys ?? [])]
  if (keys.includes(current)) return 'active'
  return NODE_ORDER.indexOf(node.key) < NODE_ORDER.indexOf(current) ? 'done' : 'upcoming'
}

const TABS = [
  { key: 'home', label: 'Home', Icon: HomeIcon },
  { key: 'track', label: 'Track', Icon: TrackIcon },
  { key: 'orders', label: 'Orders', Icon: OrdersIcon },
  { key: 'profile', label: 'Profile', Icon: ProfileIcon },
]

function FlowRail() {
  const [state] = useAppState()
  const current = currentFlowNode(state)
  return (
    <aside className="rail">
      <div className="rail-brand">
        <BrandMark width="34" height="34" />
        <div>
          <div className="rail-name">Skyhatch</div>
          <div className="mono small muted">Drone delivery · food & medicine</div>
        </div>
      </div>
      <h2 className="rail-title">Groceries in the sky, dinner at your door in minutes.</h2>
      <p className="muted rail-copy">
        This is an interactive demo. Sign up, order from a restaurant or pharmacy, and follow your
        drone from launch to landing. The stepper tracks where you are in the user flow.
      </p>
      <ol className="flow-steps">
        {FLOW_NODES.map((node, i) => {
          const status = nodeStatus(node, current)
          return (
            <li key={node.key} className={`flow-step ${status}`}>
              <span className="flow-dot mono">{status === 'done' ? '✓' : i + 1}</span>
              <span>
                <span className="flow-label">{node.label}</span>
                <span className="mono small muted block">{node.sub}</span>
              </span>
            </li>
          )
        })}
      </ol>
    </aside>
  )
}

function Phone() {
  const [state, actions] = useAppState()
  if (!state.account) {
    return (
      <div className="phone">
        <div className="phone-screen">
          <CreateAccount />
        </div>
      </div>
    )
  }

  const Tab = { home: HomeTab, track: TrackTab, orders: OrdersTab, profile: ProfileTab }[state.tab]
  const { sheet } = state
  return (
    <div className="phone">
      <div className="phone-screen" key={state.tab}>
        <Tab />
      </div>
      <nav className="tabbar" aria-label="Main">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            className={`tab ${state.tab === key ? 'active' : ''}`}
            aria-current={state.tab === key ? 'page' : undefined}
            onClick={() => actions.setTab(key)}
          >
            <Icon width="20" height="20" />
            <span>{label}</span>
            {key === 'track' && state.activeOrder && <span className="tab-dot" />}
          </button>
        ))}
      </nav>
      {state.flow && <OrderFlow key="flow" />}
      {sheet?.type === 'verify' && <Verify />}
      {sheet?.type === 'confirm' && <Confirm />}
      {sheet?.type === 'alerts' && <AlertsSheet />}
      {sheet?.type === 'order' && <OrderDetails orderId={sheet.orderId} />}
    </div>
  )
}

export default function App() {
  return (
    <AppStateProvider>
      <div className="layout">
        <FlowRail />
        <Phone />
      </div>
    </AppStateProvider>
  )
}
