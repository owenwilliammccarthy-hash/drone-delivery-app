import { useCallback, useState } from 'react'
import { useAppState } from '../state/AppState'
import { findStore } from '../data/catalog'
import Sheet from './Sheet'
import PickStore from './PickStore'
import PickProducts from './PickProducts'
import Eligibility from './Eligibility'
import Fallback from './Fallback'
import Checkout, { checkoutTotal } from './Checkout'
import Dispatch from './Dispatch'

// The "New Order" sheet: flow nodes 2–6 of the user-flow diagram.
export default function OrderFlow() {
  const [state, actions] = useAppState()
  const { flow } = state
  const store = findStore(flow.storeId)
  const [checked, setChecked] = useState(false)
  const [paying, setPaying] = useState(false)
  const [launched, setLaunched] = useState(false)
  const onChecked = useCallback(() => setChecked(true), [])
  const onLaunched = useCallback(() => setLaunched(true), [])

  const close = actions.closeFlow
  const back = actions.flowBack

  switch (flow.stage) {
    case 'pick-store':
      return (
        <Sheet eyebrow="New order · Pick store" title="Where from?" sub="Restaurants and pharmacies near you." onClose={close}>
          <PickStore actions={actions} />
        </Sheet>
      )
    case 'pick-products': {
      const count = Object.values(flow.cart).reduce((s, q) => s + q, 0)
      return (
        <Sheet
          eyebrow="New order · Pick products"
          title={store.name}
          sub={`Add items to your cart. Prep time ${store.prepTime}.`}
          onBack={back}
          onClose={close}
          footer={
            <button className="btn btn-primary btn-block" disabled={count === 0} onClick={() => { setChecked(false); actions.submitCart() }}>
              Check drone eligibility
            </button>
          }
        >
          <PickProducts store={store} cart={flow.cart} actions={actions} />
        </Sheet>
      )
    }
    case 'eligibility':
      return (
        <Sheet
          eyebrow="New order · Drone zone eligible?"
          title="Checking your address"
          onBack={back}
          onClose={close}
          footer={
            <button className="btn btn-primary btn-block" disabled={!checked} onClick={actions.continueEligibility}>
              {!checked ? 'Checking…' : flow.deliveryMode === 'drone' ? 'Yes, continue to checkout' : 'Continue with courier'}
            </button>
          }
        >
          <Eligibility flow={flow} store={store} onChecked={onChecked} />
        </Sheet>
      )
    case 'fallback':
      return (
        <Sheet
          eyebrow="New order · Fallback delivery"
          title="Standard courier"
          sub="Your order will still be tracked live, just on wheels instead of rotors."
          onBack={back}
          onClose={close}
          footer={
            <button className="btn btn-primary btn-block" onClick={actions.continueFallback}>
              Continue to checkout
            </button>
          }
        >
          <Fallback />
        </Sheet>
      )
    case 'checkout': {
      const total = checkoutTotal(flow, store)
      function pay() {
        setPaying(true)
        setTimeout(() => {
          setPaying(false)
          setLaunched(false)
          actions.confirmPayment()
        }, 900)
      }
      return (
        <Sheet
          eyebrow="New order · Checkout"
          title="Confirm & pay"
          sub={`Delivering by ${flow.deliveryMode === 'drone' ? 'drone' : 'standard courier'} from ${store.name}.`}
          onBack={paying ? undefined : back}
          onClose={paying ? undefined : close}
          footer={
            <button className="btn btn-primary btn-block" disabled={paying} onClick={pay}>
              {paying ? 'Processing payment…' : `Pay $${total.toFixed(2)}`}
            </button>
          }
        >
          <Checkout flow={flow} store={store} />
        </Sheet>
      )
    }
    case 'dispatch':
      return (
        <Sheet
          eyebrow="New order · Prepare & dispatch"
          title={launched ? (flow.deliveryMode === 'drone' ? 'Drone launched' : 'Courier en route') : 'Preparing your order'}
          sub={`${store.name} is getting your order ready.`}
          footer={
            <button className="btn btn-primary btn-block" disabled={!launched} onClick={actions.launch}>
              {launched ? 'Track live' : 'Preparing…'}
            </button>
          }
        >
          <Dispatch flow={flow} store={store} onDone={onLaunched} />
        </Sheet>
      )
    default:
      return null
  }
}
