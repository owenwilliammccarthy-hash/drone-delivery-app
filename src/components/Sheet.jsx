import { BackIcon, CloseIcon } from './Icons'

// Full-height panel that slides over the tabs. Used for the New Order flow,
// PIN unlock, rating, alerts and order details.
export default function Sheet({ eyebrow, title, sub, onBack, onClose, footer, children }) {
  return (
    <div className="sheet" role="dialog" aria-modal="true" aria-label={title}>
      <div className="sheet-top">
        {onBack ? (
          <button className="icon-btn" onClick={onBack} aria-label="Back">
            <BackIcon width="18" height="18" />
          </button>
        ) : (
          <span />
        )}
        {onClose && (
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <CloseIcon width="18" height="18" />
          </button>
        )}
      </div>
      <div className="sheet-scroll">
        <header className="page-head">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="page-title">{title}</h1>
          {sub && <p className="page-sub">{sub}</p>}
        </header>
        <div className="sheet-body">{children}</div>
      </div>
      {footer && <div className="sheet-footer">{footer}</div>}
    </div>
  )
}
