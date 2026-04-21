import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiBell, FiChevronDown, FiLogOut, FiUser, FiSettings } from "react-icons/fi";
import { getCurrentUser, logoutUser } from "../utils/authHelpers";
import { getUnreadCount }             from "../utils/notificationHelpers";

/**
 * Navbar — renders the right-side content of the top navigation bar.
 * The outer <nav> wrapper is provided by DashboardLayout.
 */
function Navbar() {
  const navigate    = useNavigate();
  const currentUser = getCurrentUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Re-read unread count on each render so it stays in sync
  const unreadCount = getUnreadCount(currentUser?.id);

  function handleLogout() {
    setDropdownOpen(false);
    logoutUser();
    navigate("/login");
  }

  function closeDropdown() {
    setDropdownOpen(false);
  }

  const initials = currentUser?.fullName
    ? currentUser.fullName.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <>
      {/* Brand name — hidden on mobile (hamburger takes that space) */}
      <span className="fw-semibold text-dark d-none d-lg-inline">Dainiki</span>

      {/* Spacer */}
      <div className="flex-grow-1" />

      {/* Right: notification bell + user dropdown */}
      <div className="d-flex align-items-center gap-3">
        {/* Notifications bell with unread badge */}
        <Link
          to="/notifications"
          className="text-secondary position-relative"
          title="Notifications"
          aria-label={unreadCount > 0 ? `Notifications — ${unreadCount} unread` : "Notifications"}
          style={{ lineHeight: 1 }}
        >
          <FiBell size={20} aria-hidden="true" />
          {unreadCount > 0 && (
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style={{ fontSize: "0.55rem", padding: "2px 5px" }}
              aria-hidden="true"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>

        {/* User dropdown */}
        <div className="position-relative">
          <button
            className="btn btn-sm d-flex align-items-center gap-2 border-0 p-0"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            aria-label="User menu"
          >
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
              style={{ width: 32, height: 32, fontSize: "0.75rem" }}
              aria-hidden="true"
            >
              {initials}
            </div>
            <span className="small fw-semibold d-none d-sm-inline">
              {currentUser?.fullName || "User"}
            </span>
            <FiChevronDown size={14} className="text-muted" aria-hidden="true" />
          </button>

          {dropdownOpen && (
            <>
              {/* Click-outside overlay */}
              <div
                className="position-fixed top-0 start-0 w-100 h-100"
                style={{ zIndex: 999 }}
                onClick={closeDropdown}
                aria-hidden="true"
              />
              <div
                className="position-absolute end-0 mt-2 bg-white border rounded shadow-sm py-1"
                style={{ minWidth: 170, zIndex: 1000 }}
                role="menu"
              >
                <Link
                  to="/profile"
                  className="dropdown-item d-flex align-items-center gap-2 small"
                  onClick={closeDropdown}
                  role="menuitem"
                >
                  <FiUser size={14} aria-hidden="true" /> Profile
                </Link>
                <Link
                  to="/settings"
                  className="dropdown-item d-flex align-items-center gap-2 small"
                  onClick={closeDropdown}
                  role="menuitem"
                >
                  <FiSettings size={14} aria-hidden="true" /> Settings
                </Link>
                <hr className="dropdown-divider my-1" />
                <button
                  className="dropdown-item d-flex align-items-center gap-2 small text-danger w-100"
                  onClick={handleLogout}
                  role="menuitem"
                >
                  <FiLogOut size={14} aria-hidden="true" /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
