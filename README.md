# Skyhatch — Drone Delivery App (working example)

A working React app implementing the food & medicine drone-delivery user flow, end to end,
with mocked data (no backend required). Built with Vite + React, no UI framework — just a
small hand-built design system in `src/index.css`.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

To build a production bundle:

```bash
npm run build
npm run preview
```

## How this maps to the flow diagram

The app is a single state machine (`src/state/OrderFlowContext.jsx`) that walks through
every node in the flow exactly:

| Diagram node | Screen | Notes |
|---|---|---|
| Create account → Sign up & verify | `CreateAccount.jsx` | Name/email, then a 4-digit code screen (any 4 digits work in this demo). |
| Pick store → Restaurant or pharmacy | `PickStore.jsx` | Mock catalog in `src/data/catalog.js`, mixing restaurants and a pharmacy. |
| Pick products → Add items to cart | `PickProducts.jsx` | Quantity steppers, live subtotal. Flags items that require ID on delivery. |
| Drone zone eligible? | `Eligibility.jsx` | Looks up the picked store's zone. Branches the flow. |
| — No → Standard courier / Fallback delivery | `Fallback.jsx` | Reassigns the order to a courier and rejoins the main flow at checkout. |
| — Yes → Checkout → Payment confirmed | `Checkout.jsx` | Order summary, mock payment method, simulated "processing" delay. |
| Prepare & dispatch → Drone loaded & launched | `Dispatch.jsx` | Animated prep steps; drone or courier icon depending on the branch taken. |
| Live tracking → Real-time ETA updates | `Tracking.jsx` | Animated ETA countdown and progress along a route. |
| Verify & release → ID check if needed | `Verify.jsx` | Shows the ID-check step only when the cart required it (e.g. a prescription). |
| Confirm & rate → Feedback submitted | `Confirm.jsx` | Star rating + optional comment, then a "start a new order" loop back to store picking. |

The left rail (`src/App.jsx`) renders a live stepper ("flight path") showing progress through
these stages, collapsing the eligibility branch into a single step so it always reflects the
diagram's shape regardless of which path (drone or courier) the order took.

## Project structure

```
src/
  state/OrderFlowContext.jsx   the flow's state machine (React context + reducer)
  data/catalog.js              mock stores & products
  components/                  one component per screen in the flow
  App.jsx                      brand rail + stepper + screen router
  index.css                    design tokens & all styling
```

## Wiring up a real backend

Everything that would hit a real API is isolated:

- `src/data/catalog.js` — replace with a fetch to your store/catalog service.
- `OrderFlowContext.jsx` actions (`createAccount`, `submitCart`, `confirmPayment`, etc.) —
  each is a single dispatch call; add your API calls inside the corresponding action or in
  the component right before calling it.
- Drone-zone eligibility currently reads a static `zone` field per store — swap this for a
  real geofence/coverage lookup keyed on the delivery address.
- Tracking currently simulates progress with a timer — swap for a websocket/poll against
  your live fleet-tracking service.

## Design notes

Visual direction leans into the subject: a dark "night-ops" palette with an amber "signal"
accent (aviation/radar cues) and a teal accent for pharmacy/medical items, Space Grotesk for
display type and IBM Plex Sans/Mono for body and data. The numbered flight-path stepper is
used because the flow genuinely is a fixed sequence, mirroring your diagram.
