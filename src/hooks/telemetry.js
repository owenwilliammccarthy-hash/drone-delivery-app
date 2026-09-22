// Derives live telemetry for an in-flight order from its launch time.
// Swap for a websocket/poll against a real fleet-tracking service.

export const PROGRESS_STAGES = ['Packed', 'Launched', 'En route', 'Arrived']

export function telemetry(order, now) {
  const progress = order.arrived ? 1 : Math.min(1, Math.max(0, (now - order.launchedAt) / order.durationMs))
  const remainingMs = Math.max(0, order.launchedAt + order.durationMs - now) * (order.arrived ? 0 : 1)
  const drone = order.mode === 'drone'
  const cruising = progress > 0.05 && progress < 0.95
  return {
    progress,
    remainingMs,
    eta: formatEta(remainingMs),
    distanceKm: (order.distanceKm * (1 - progress)).toFixed(1),
    speedKmh: progress >= 1 ? 0 : drone ? (cruising ? 48 : 22) : 28,
    altitudeM: drone ? Math.round(120 * Math.min(1, progress / 0.05, (1 - progress) / 0.05)) : 0,
    battery: drone ? Math.round(100 - progress * 16) : null,
    stageIndex: progress >= 1 ? 3 : progress > 0.15 ? 2 : progress > 0 ? 1 : 0,
  }
}

export function formatEta(ms) {
  if (ms <= 0) return 'Landed'
  const s = Math.ceil(ms / 1000)
  if (s >= 60) return `${Math.ceil(s / 60)} min`
  return `${s} sec`
}

export function formatDate(ms) {
  const d = new Date(ms)
  const today = new Date()
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  if (d.toDateString() === today.toDateString()) return `Today ${time}`
  return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${time}`
}
