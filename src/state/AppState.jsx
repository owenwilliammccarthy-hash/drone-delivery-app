import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { findStore, seedOrders } from '../data/catalog'

// The order flow mirrors the user-flow diagram 1:1:
// create-account -> pick-store -> pick-products -> eligibility
//   -> (yes) checkout -> dispatch -> tracking -> verify -> confirm
//   -> (no)  fallback -> checkout -> dispatch -> tracking -> verify -> confirm
// Pick store through dispatch run inside the "New Order" sheet; tracking is the
// Track tab; verify and confirm are sheets opened from the active delivery.

const STORAGE_KEY = 'skyhatch-state-v1'
const DRONE_FLIGHT_MS = 90 * 1000 // compressed flight time so the demo is watchable
const COURIER_TRIP_MS = 150 * 1000

const initialState = {
  account: null, // { name, email }
  tab: 'home', // 'home' | 'track' | 'orders' | 'profile'
  flow: null, // in-progress New Order: { stage, history, storeId, cart, deliveryMode, idCheckRequired }
  activeOrder: null,
  orders: [],
  alerts: [],
  sheet: null, // { type: 'verify' | 'confirm' | 'alerts' | 'order', orderId? }
  prefs: { notifications: true, cameraFeed: true, sms: false, emailReceipts: true },
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (saved?.account) return { ...initialState, ...saved, flow: null, sheet: null }
  } catch {
    // storage unavailable or corrupt: start fresh
  }
  return initialState
}

function saveState(state) {
  try {
    const { flow, sheet, ...rest } = state
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest))
  } catch {
    // ignore: persistence is a convenience only
  }
}

function alert(title, body) {
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, title, body, at: Date.now(), read: false }
}

function nextOrderId(state) {
  const nums = [...state.orders, state.activeOrder]
    .filter(Boolean)
    .map((o) => Number(o.id.replace('DR-', '')))
  return `DR-${Math.max(8821, ...nums) + 2}`
}

export function cartLines(store, cart) {
  if (!store) return []
  return store.items
    .filter((item) => cart[item.id])
    .map((item) => ({ ...item, qty: cart[item.id] }))
}

export function orderTitle(lines) {
  if (lines.length === 1) return lines[0].qty > 1 ? `${lines[0].name} × ${lines[0].qty}` : lines[0].name
  const title = lines.slice(0, 2).map((l) => l.name).join(' + ')
  return lines.length > 2 ? `${title} +${lines.length - 2}` : title
}

export const DELIVERY_FEE = { drone: 2.99, courier: 4.49 }

export function orderTotals(lines, deliveryMode) {
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0)
  const fee = DELIVERY_FEE[deliveryMode] ?? DELIVERY_FEE.drone
  const tax = subtotal * 0.09
  return { subtotal, fee, tax, total: subtotal + fee + tax }
}

function flowStep(state, stage, patch = {}) {
  const flow = { ...state.flow, ...patch, stage, history: [...state.flow.history, stage] }
  return { ...state, flow }
}

function reducer(state, action) {
  const { flow } = state
  switch (action.type) {
    case 'SIGN_UP':
      return {
        ...initialState,
        account: action.payload,
        orders: seedOrders(),
        alerts: [alert('Welcome aboard', 'Your account is verified. Your first drone delivery is one tap away.')],
      }
    case 'SIGN_OUT':
      return initialState
    case 'SET_TAB':
      return { ...state, tab: action.payload }
    case 'TOGGLE_PREF':
      return { ...state, prefs: { ...state.prefs, [action.payload]: !state.prefs[action.payload] } }

    // ---- New Order flow ----
    case 'START_ORDER':
      if (state.activeOrder) return { ...state, tab: 'track' }
      return { ...state, flow: { stage: 'pick-store', history: ['pick-store'], storeId: null, cart: {} } }
    case 'CLOSE_FLOW':
      return { ...state, flow: null }
    case 'FLOW_BACK': {
      const history = flow.history.slice(0, -1)
      if (history.length === 0) return { ...state, flow: null }
      return { ...state, flow: { ...flow, history, stage: history[history.length - 1] } }
    }
    case 'PICK_STORE':
      return flowStep(state, 'pick-products', {
        storeId: action.payload,
        cart: flow.storeId === action.payload ? flow.cart : {},
      })
    case 'SET_QTY': {
      const cart = { ...flow.cart }
      if (action.payload.qty <= 0) delete cart[action.payload.itemId]
      else cart[action.payload.itemId] = action.payload.qty
      return { ...state, flow: { ...flow, cart } }
    }
    case 'SUBMIT_CART': {
      const store = findStore(flow.storeId)
      const lines = cartLines(store, flow.cart)
      return flowStep(state, 'eligibility', {
        deliveryMode: store?.zone === 'drone' ? 'drone' : 'courier',
        idCheckRequired: lines.some((l) => l.requiresId),
      })
    }
    case 'CONTINUE_ELIGIBILITY':
      return flowStep(state, flow.deliveryMode === 'drone' ? 'checkout' : 'fallback')
    case 'CONTINUE_FALLBACK':
      return flowStep(state, 'checkout')
    case 'CONFIRM_PAYMENT':
      return flowStep(state, 'dispatch')
    case 'LAUNCH': {
      const store = findStore(flow.storeId)
      const lines = cartLines(store, flow.cart)
      const drone = flow.deliveryMode === 'drone'
      const order = {
        id: nextOrderId(state),
        title: orderTitle(lines),
        lines: lines.map(({ id, name, qty, price }) => ({ id, name, qty, price })),
        weightKg: Math.round(lines.reduce((s, l) => s + l.weightKg * l.qty, 0) * 10) / 10,
        emoji: store.emoji,
        storeName: store.name,
        storeKind: store.kind,
        mode: flow.deliveryMode,
        idCheckRequired: flow.idCheckRequired,
        total: orderTotals(lines, flow.deliveryMode).total,
        status: 'transit',
        placedAt: Date.now(),
        launchedAt: Date.now(),
        durationMs: drone ? DRONE_FLIGHT_MS : COURIER_TRIP_MS,
        distanceKm: drone ? 1.8 : 2.6,
        pin: String(Math.floor(1000 + Math.random() * 9000)),
        arrived: false,
      }
      return {
        ...state,
        flow: null,
        tab: 'track',
        activeOrder: order,
        alerts: [
          alert(drone ? 'Drone launched' : 'Courier on the way', `${order.title} from ${store.name} is en route.`),
          ...state.alerts,
        ],
      }
    }

    // ---- Active delivery ----
    case 'FAST_FORWARD': {
      const o = state.activeOrder
      if (!o) return state
      return { ...state, activeOrder: { ...o, launchedAt: Date.now() - o.durationMs } }
    }
    case 'ARRIVED': {
      const o = state.activeOrder
      if (!o || o.arrived) return state
      return {
        ...state,
        activeOrder: { ...o, arrived: true },
        alerts: [
          alert(
            o.mode === 'drone' ? 'Your drone has landed' : 'Your courier has arrived',
            o.idCheckRequired ? 'Have your ID ready, then unlock with your PIN.' : 'Unlock the hatch with your PIN.',
          ),
          ...state.alerts,
        ],
      }
    }
    case 'RELEASED':
      return { ...state, sheet: { type: 'confirm', orderId: state.activeOrder?.id } }
    case 'RATE': {
      const o = state.activeOrder
      if (!o) return state
      const etaMin = Math.max(1, Math.round(o.durationMs / 60000))
      const delivered = { ...o, status: 'delivered', etaMin, rating: action.payload.rating, feedback: action.payload.feedback }
      return { ...state, activeOrder: null, orders: [delivered, ...state.orders] }
    }
    case 'CANCEL_ORDER': {
      const o = state.activeOrder
      if (!o) return state
      return { ...state, activeOrder: null, sheet: null, orders: [{ ...o, status: 'cancelled' }, ...state.orders] }
    }

    // ---- Sheets & alerts ----
    case 'OPEN_SHEET':
      return {
        ...state,
        sheet: action.payload,
        alerts: action.payload.type === 'alerts' ? state.alerts.map((a) => ({ ...a, read: true })) : state.alerts,
      }
    case 'CLOSE_SHEET':
      return { ...state, sheet: null }
    default:
      return state
  }
}

const StateContext = createContext(null)
const DispatchContext = createContext(null)

export function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  useEffect(() => saveState(state), [state])

  // Fire the arrival event once the active delivery's flight time elapses.
  const o = state.activeOrder
  useEffect(() => {
    if (!o || o.arrived) return
    const remaining = o.launchedAt + o.durationMs - Date.now()
    const t = setTimeout(() => dispatch({ type: 'ARRIVED' }), Math.max(0, remaining))
    return () => clearTimeout(t)
  }, [o?.id, o?.launchedAt, o?.arrived])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export function useAppState() {
  const state = useContext(StateContext)
  const dispatch = useContext(DispatchContext)
  if (!state || !dispatch) throw new Error('useAppState must be used within AppStateProvider')
  const actions = useMemo(() => {
    const act = (type) => (payload) => dispatch({ type, payload })
    return {
      signUp: act('SIGN_UP'),
      signOut: act('SIGN_OUT'),
      setTab: act('SET_TAB'),
      togglePref: act('TOGGLE_PREF'),
      startOrder: act('START_ORDER'),
      closeFlow: act('CLOSE_FLOW'),
      flowBack: act('FLOW_BACK'),
      pickStore: act('PICK_STORE'),
      setQty: (itemId, qty) => dispatch({ type: 'SET_QTY', payload: { itemId, qty } }),
      submitCart: act('SUBMIT_CART'),
      continueEligibility: act('CONTINUE_ELIGIBILITY'),
      continueFallback: act('CONTINUE_FALLBACK'),
      confirmPayment: act('CONFIRM_PAYMENT'),
      launch: act('LAUNCH'),
      fastForward: act('FAST_FORWARD'),
      released: act('RELEASED'),
      rate: (rating, feedback) => dispatch({ type: 'RATE', payload: { rating, feedback } }),
      cancelOrder: act('CANCEL_ORDER'),
      openSheet: (type, orderId) => dispatch({ type: 'OPEN_SHEET', payload: { type, orderId } }),
      closeSheet: act('CLOSE_SHEET'),
    }
  }, [dispatch])
  return [state, actions]
}

// Which node of the user-flow diagram the user is currently on (drives the desktop stepper).
export function currentFlowNode(state) {
  if (!state.account) return 'create-account'
  if (state.flow) return state.flow.stage
  if (state.sheet?.type === 'confirm') return 'confirm'
  if (state.sheet?.type === 'verify') return 'verify'
  if (state.activeOrder) return state.activeOrder.arrived ? 'verify' : 'tracking'
  return 'idle'
}
