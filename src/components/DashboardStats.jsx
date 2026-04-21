// ─── Bootstrap color map for left border ─────────────────────────────────────
const COLOR_MAP = {
  primary:   "#0d6efd",
  secondary: "#6c757d",
  success:   "#198754",
  danger:    "#dc3545",
  warning:   "#ffc107",
  info:      "#0dcaf0",
};

/**
 * DashboardStats — displays a responsive row of stat cards.
 *
 * Props:
 *   stats: array of { label, value, color, icon }
 */
function DashboardStats({ stats = [] }) {
  return (
    <div className="row g-3 mb-4">
      {stats.map((stat) => (
        <div className="col-6 col-xl-2" key={stat.label}>
          <div
            className="card border-0 shadow-sm rounded-lg p-3 h-100"
            style={{ borderLeft: `4px solid ${COLOR_MAP[stat.color] || "#6c757d"}` }}
          >
            {stat.icon && (
              <div className={`text-${stat.color} mb-1`} style={{ fontSize: "1.2rem" }}>
                {stat.icon}
              </div>
            )}
            <p className="text-muted small mb-1">{stat.label}</p>
            <h2 className="h4 fw-bold mb-0">{stat.value}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardStats;
