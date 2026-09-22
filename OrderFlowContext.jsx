import { createContext, useContext, useMemo, useReducer } from 'react'
import { findStore } from '../data/catalog'

// Stages mirror the user-flow diagram 1:1:
// create-account -> pick-store -> pick-products -> eligibility
//   -> (yes) checkout -> dispatch -> tracking -> verify -> confirm
//   -> (no)  fallback  -> tracking -> verify -> confirm
export const STAGES = [
  'create-account',
  'pick-store',
  'pick-products',
  'eligibility',
  'fallback',
  'checkout',
  'dispatch',
  'tracking',
  'verify',
  'confirm',
]

const initialState = {
  stage: 'create-account',
  account: null, // { name, email }
  storeId: null,
  cart: {}, // itemId -> qty
  deliveryMode: null, // 'drone' | 'courier'
  idCheckRequired: false,
  rating: null,
  feedback: '',
  history: ['create-account'],
}

function reducer(state, action) {
  switch (action.type) {
    case 'CREATE_ACCOUNT': {
      return advance(state, 'pick-store', { account: action.payload })
    }
    case 'PICK_STORE': {
      return advance(state, 'pick-products', { storeId: action.payload, cart: {} })
    }
    case 'SET_QTY': {
      const cart = { ...state.cart }
      if (action.payload.qty <= 0) delete cart[action.payload.itemId]
      else cart[action.payload.itemId] = action.payload.qty
      return { ...state, cart }
    }
    case 'SUBMIT_CART': {
      const store = findStore(state.storeId)
      const eligible = store?.zone === 'drone'
      const idCheckRequired = Object.keys(state.cart).some((itemId) =>
        store?.items.find((i) => i.id === itemId)?.requiresId,
      )
      return advance(state, 'eligibility', {
        deliveryMode: eligible ? 'drone' : 'courier',
        idCheckRequired,
      })
    }
    case 'CONTINUE_ELIGIBILITY': {
      if (state.deliveryMode === 'drone') return advance(state, 'checkout')
      return advance(state, 'fallback')
    }
    case 'CONTINUE_FALLBACK': {
      return advance(state, 'checkout')
    }
    case 'CONFIRM_PAYMENT': {
      return advance(state, 'dispatch')
    }
    case 'DISPATCHED': {
      return advance(state, 'tracking')
    }
    case 'ARRIVED': {
      return advance(state, 'verify')
    }
    case 'VERIFIED': {
      return advance(state, 'confirm')
    }
    case 'SUBMIT_FEEDBACK': {
      return { ...state, rating: action.payload.rating, feedback: action.payload.feedback }
    }
    case 'NEW_ORDER': {
      return { ...initialState, account: state.account, stage: 'pick-store', history: ['pick-store'] }
    }
    case 'GO_BACK': {
      const history = state.history.slice(0, -1)
      const stage = history[history.length - 1] ?? state.stage
      return { ...state, stage, history }
    }
    default:
      return state
  }
}

function advance(state, stage, patch = {}) {
  return { ...state, ...patch, stage, history: [...state.history, stage] }
}

const OrderFlowStateContext = createContext(null)
const OrderFlowDispatchContext = createContext(null)

export function OrderFlowProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const store = useMemo(() => findStore(state.storeId), [state.storeId])
  const value = useMemo(() => ({ ...state, store }), [state, store])
  return (
    <OrderFlowStateContext.Provider value={value}>
      <OrderFlowDispatchContext.Provider value={dispatch}>{children}</OrderFlowDispatchContext.Provider>
    </OrderFlowStateContext.Provider>
  )
}

export function useOrderFlow() {
  const state = useContext(OrderFlowStateContext)
  const dispatch = useContext(OrderFlowDispatchContext)
  if (!state || !dispatch) throw new Error('useOrderFlow must be used within OrderFlowProvider')
  const actions = useMemo(
    () => ({
      createAccount: (payload) => dispatch({ type: 'CREATE_ACCOUNT', payload }),
      pickStore: (storeId) => dispatch({ type: 'PICK_STORE', payload: storeId }),
      setQty: (itemId, qty) => dispatch({ type: 'SET_QTY', payload: { itemId, qty } }),
      submitCart: () => dispatch({ type: 'SUBMIT_CART' }),
      continueEligibility: () => dispatch({ type: 'CONTINUE_ELIGIBILITY' }),
      continueFallback: () => dispatch({ type: 'CONTINUE_FALLBACK' }),
      confirmPayment: () => dispatch({ type: 'CONFIRM_PAYMENT' }),
      dispatched: () => dispatch({ type: 'DISPATCHED' }),
      arrived: () => dispatch({ type: 'ARRIVED' }),
      verified: () => dispatch({ type: 'VERIFIED' }),
      submitFeedback: (rating, feedback) => dispatch({ type: 'SUBMIT_FEEDBACK', payload: { rating, feedback } }),
      newOrder: () => dispatch({ type: 'NEW_ORDER' }),
      goBack: () => dispatch({ type: 'GO_BACK' }),
    }),
    [dispatch],
  )
  return [state, actions]
}
