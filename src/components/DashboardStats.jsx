const COLOR_MAP = {
  primary:   { bg: "#e8f0fe", text: "#0d6efd" },
  secondary: { bg: "#f0f0f0", text: "#6c757d" },
  success:   { bg: "#e6f4ea", text: "#198754" },
  danger:    { bg: "#fce8e6", text: "#dc3545" },
  warning:   { bg: "#fff8e1", text: "#e65100" },
  info:      { bg: "#e0f7fa", text: "#0097a7" },
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
      {stats.map((stat) => {
        const colors = COLOR_MAP[stat.color] || COLOR_MAP.secondary;
        return (
          <div className="col-6 col-xl-2" key={stat.label}>
            <div className="dash-stat-card">
              <div
                className="dash-stat-icon"
                style={{ background: colors.bg, color: colors.text }}
              >
                {stat.icon}
              </div>
              <p className="dash-stat-label">{stat.label}</p>
              <h2 className="dash-stat-value">{stat.value}</h2>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DashboardStats;
