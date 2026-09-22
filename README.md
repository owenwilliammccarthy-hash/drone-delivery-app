# Skyhatch: Drone Delivery

An interactive drone delivery web app for food and medicine, built from the wireframes
(Home / Track / Orders / Profile) and the user-flow diagram. It's a Vite + React single-page
app that uses mocked data, so it needs no backend and runs on GitHub Pages.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
```

## Deploy to GitHub Pages

A workflow in `.github/workflows/deploy.yml` builds and deploys the site on every push to `main`.

1. In the repo, go to **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**.
2. Merge to `main` (or run the workflow manually from the **Actions** tab).
3. The site is published at `https://<user>.github.io/<repo>/`.

`vite.config.js` uses a relative `base`, so the build works under any repo name.

## How the user flow maps to the app

| Flow node | Where | File |
|---|---|---|
| Create account → Sign up & verify | First-visit onboarding (any 4-digit code works) | `CreateAccount.jsx` |
| Pick store → Restaurant or pharmacy | Home → **New Order** | `PickStore.jsx` |
| Pick products → Add items to cart | Quantity steppers; prescription items flag an ID check | `PickProducts.jsx` |
| Drone zone eligible? | Checks the store's zone and branches | `Eligibility.jsx` |
| No → Standard courier / Fallback delivery | Courier-only stores (e.g. Basil & Bone) | `Fallback.jsx` |
| Yes → Checkout → Payment confirmed | Order summary and mock payment | `Checkout.jsx` |
| Prepare & dispatch → Drone loaded & launched | Animated prep checklist | `Dispatch.jsx` |
| Live tracking → Real-time ETA updates | **Track** tab + Home "Active delivery" card | `TrackTab.jsx`, `MapView.jsx` |
| Verify & release → ID check if needed | **Show Drone Unlock PIN** → PIN keypad (+ ID check) | `Verify.jsx` |
| Confirm & rate → Feedback submitted | Star rating, then the order moves to history | `Confirm.jsx` |

On wide screens a stepper beside the phone highlights the current flow node. Flights are
compressed to about 90 seconds so the demo is watchable, and **Demo: skip to landing** on the
Track tab jumps ahead. Account, orders, alerts and preferences persist in `localStorage`, and
**Sign Out** resets everything.

## Project structure

```
src/
  App.jsx                 flow stepper, phone shell, tab bar, sheet router
  state/AppState.jsx      reducer for account, order flow, active delivery, history, prefs
  data/catalog.js         mock stores, products, order history, saved locations
  hooks/                  useNow ticker + telemetry (progress, ETA, altitude, battery)
  components/             tabs, flow screens, sheets, map, icons
  index.css               design tokens and all styling
```

## Wiring up a real backend

- `src/data/catalog.js`: replace with calls to your store/catalog API.
- `hooks/telemetry.js`: replace the time-based simulation with a websocket or poll against fleet tracking.
- Eligibility reads a static `zone` per store; swap in a geofence lookup on the delivery address.
