import { useEffect, useState } from 'react'

// Re-renders every `intervalMs` while `active` is true; returns the current time.
export default function useNow(active = true, intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!active) return
    setNow(Date.now())
    const t = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(t)
  }, [active, intervalMs])
  return now
}
