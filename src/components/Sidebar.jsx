import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid, FiCheckSquare, FiTag, FiCalendar,
  FiBell, FiUser, FiSettings, FiLogOut,
} from "react-icons/fi";
import { logoutUser } from "../utils/authHelpers";

// ─── Navigation items ─────────────────────────────────────────────────────────
const navItems = [
  { to: "/dashboard",     label: "Dashboard",    icon: <FiGrid /> },
  { to: "/tasks",         label: "Tasks",         icon: <FiCheckSquare /> },
  { to: "/categories",    label: "Categories",    icon: <FiTag /> },
  { to: "/calendar",      label: "Calendar",      icon: <FiCalendar /> },
  { to: "/notifications", label: "Notifications", icon: <FiBell /> },
  { to: "/profile",       label: "Profile",       icon: <FiUser /> },
  { to: "/settings",      label: "Settings",      icon: <FiSettings /> },
];

/**
 * Sidebar — navigation links + logout.
 * The brand header is rendered by DashboardLayout above this component.
 */
function Sidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  return (
    <>
      {/* Nav links */}
      <nav className="flex-grow-1" aria-label="Main navigation">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
            aria-label={label}
          >
            <span className="fs-6" aria-hidden="true">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 mt-auto pb-3">
        <button
          onClick={handleLogout}
          className="btn btn-sm w-100 text-start text-danger d-flex align-items-center gap-2"
          style={{ background: "transparent", border: "none" }}
          aria-label="Logout"
        >
          <FiLogOut size={15} aria-hidden="true" />
          Logout
        </button>
      </div>
    </>
  );
}

export default Sidebar;
