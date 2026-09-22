// Stroke icons used across the app. All inherit currentColor.

const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }

export function HomeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z" />
    </svg>
  )
}

export function TrackIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    </svg>
  )
}

export function OrdersIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <rect x="5" y="3.5" width="14" height="17" rx="2.5" />
      <path d="M9 9h6M9 13h6M9 17h3" />
    </svg>
  )
}

export function ProfileIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <circle cx="12" cy="8.5" r="4" />
      <path d="M4.5 20.5c1.2-3.8 4-5.5 7.5-5.5s6.3 1.7 7.5 5.5" />
    </svg>
  )
}

export function DroneIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M8.5 8.5 10.5 10.5M15.5 8.5 13.5 10.5M8.5 15.5 10.5 13.5M15.5 15.5 13.5 13.5" />
      <rect x="10" y="10" width="4" height="4" rx="1" />
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="6.5" r="2.5" />
      <circle cx="6.5" cy="17.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  )
}

export function CourierIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <rect x="2.5" y="7" width="11" height="9" rx="1.5" />
      <path d="M13.5 10h4l3 3.5V16h-7z" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </svg>
  )
}

export function BackIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  )
}

export function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

export function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} strokeWidth={2.2} {...props}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  )
}

export function BrandMark(props) {
  return (
    <svg viewBox="0 0 32 32" fill="none" {...props}>
      <circle cx="16" cy="16" r="14.5" stroke="currentColor" strokeWidth="1.4" opacity="0.45" />
      <path d="M16 5v6M16 21v6M5 16h6M21 16h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="16" cy="16" r="4" fill="currentColor" />
    </svg>
  )
}
