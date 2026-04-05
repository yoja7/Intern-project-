/**
 * EmptyState — shown when a list has no items.
 *
 * Props:
 *   title:   heading text
 *   message: supporting text (optional)
 *   icon:    emoji or element to display (optional, defaults to 📭)
 *   action:  optional { label, onClick } for a CTA button
 */
function EmptyState({ title = "Nothing here yet", message = "", icon = "📭", action }) {
  return (
    <div className="text-center py-4" role="status" aria-live="polite">
      <div className="mb-2" style={{ fontSize: "2.5rem" }} aria-hidden="true">
        {icon}
      </div>
      <h3 className="h6 fw-semibold mb-1">{title}</h3>
      {message && <p className="text-muted small mb-3">{message}</p>}
      {action && (
        <button className="btn btn-primary btn-sm" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
