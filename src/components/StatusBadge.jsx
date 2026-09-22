const LABELS = { transit: 'In Transit', delivered: 'Delivered', cancelled: 'Cancelled', arrived: 'Landed' }

export default function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{LABELS[status] ?? status}</span>
}
