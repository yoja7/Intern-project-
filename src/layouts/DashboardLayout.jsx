import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import Navbar  from "../components/Navbar";

/**
 * DashboardLayout
 * ───────────────
 * Wraps all protected pages with a sidebar + top navbar.
 * On mobile (< lg breakpoint), the sidebar slides in via a hamburger button.
 */
function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      {/* ── Mobile overlay (closes sidebar on outside click) ─────────────── */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay d-lg-none"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-mobile-open" : ""}`}>
        {/* Mobile close button inside sidebar */}
        <div className="d-flex align-items-center justify-content-between px-4 py-3 mb-2">
          <span className="fw-bold fs-5 text-white">Dainiki</span>
          <button
            className="btn btn-sm btn-link text-white d-lg-none p-0"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FiX size={18} />
          </button>
        </div>
        <Sidebar />
      </aside>

      {/* ── Main: navbar + content ───────────────────────────────────────── */}
      <div className="dashboard-main">
        <nav className="top-navbar">
          {/* Hamburger — only on mobile */}
          <button
            className="btn btn-sm btn-outline-secondary d-lg-none"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle sidebar"
          >
            <FiMenu size={18} />
          </button>

          {/* Navbar inner content */}
          <Navbar />
        </nav>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
