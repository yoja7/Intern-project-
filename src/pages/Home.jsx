import { Link } from "react-router-dom";
import {
  FiCheckCircle, FiBell, FiCalendar, FiBarChart2,
  FiArrowRight, FiLayers, FiShield, FiZap,
} from "react-icons/fi";
import heroImg from "../assets/hero.png";

const FEATURES = [
  {
    icon: <FiCheckCircle size={22} />,
    title: "Task Tracking",
    desc: "Create, organise, and complete tasks with priorities, due dates, and subtasks.",
    color: "#0d6efd",
  },
  {
    icon: <FiBell size={22} />,
    title: "Smart Reminders",
    desc: "Set reminder dates and get notified before tasks are due.",
    color: "#6f42c1",
  },
  {
    icon: <FiCalendar size={22} />,
    title: "Calendar View",
    desc: "Browse your tasks by month and see what's coming up at a glance.",
    color: "#0dcaf0",
  },
  {
    icon: <FiBarChart2 size={22} />,
    title: "Dashboard Stats",
    desc: "Track your productivity with live stats — completed, overdue, in progress.",
    color: "#198754",
  },
  {
    icon: <FiLayers size={22} />,
    title: "Categories",
    desc: "Group tasks into custom categories to keep your work organised.",
    color: "#fd7e14",
  },
  {
    icon: <FiShield size={22} />,
    title: "Private & Secure",
    desc: "All your data stays in your browser. No servers, no tracking.",
    color: "#dc3545",
  },
];

/**
 * Home — public landing page.
 */
function Home() {
  return (
    <div className="home-page">
      <div className="container py-5">

        {/* ── Hero Section ──────────────────────────────────────────────────── */}
        <div className="row align-items-center g-5 mb-5 pb-4">
          {/* Left: copy */}
          <div className="col-lg-6 text-center text-lg-start">
            <span className="home-badge mb-4 d-inline-flex align-items-center gap-2">
              <FiZap size={13} />
              Personal Task Manager
            </span>

            <h1 className="home-headline mb-4">
              Organise your day.<br />
              <span className="home-headline-accent">Own your time.</span>
            </h1>

            <p className="home-subtext mb-5">
              Dainiki helps you manage daily tasks, set reminders, track progress,
              and stay on top of what matters — all stored privately in your browser.
            </p>

            <div className="d-flex gap-3 justify-content-center justify-content-lg-start flex-wrap">
              <Link to="/register" className="btn home-btn-primary d-inline-flex align-items-center gap-2">
                Get Started Free
                <FiArrowRight size={16} />
              </Link>
              <Link to="/login" className="btn home-btn-secondary">
                Sign In
              </Link>
            </div>

            {/* Trust line */}
            <p className="home-trust mt-4">
              No account required to explore &mdash; use the demo account to try it instantly.
            </p>
          </div>

          {/* Right: hero image */}
          <div className="col-lg-6 text-center">
            <div className="home-img-wrapper">
              <img
                src={heroImg}
                alt="Dainiki task manager preview"
                className="img-fluid home-hero-img"
              />
            </div>
          </div>
        </div>

        {/* ── Features Grid ─────────────────────────────────────────────────── */}
        <div className="home-features-section">
          <div className="text-center mb-5">
            <h2 className="home-section-title">Everything you need to stay productive</h2>
            <p className="home-section-sub">
              Built for simplicity. Designed for focus.
            </p>
          </div>

          <div className="row g-4">
            {FEATURES.map((f) => (
              <div className="col-md-6 col-lg-4" key={f.title}>
                <div className="home-feature-card">
                  <div
                    className="home-feature-icon"
                    style={{ color: f.color, background: `${f.color}15` }}
                  >
                    {f.icon}
                  </div>
                  <h3 className="home-feature-title">{f.title}</h3>
                  <p className="home-feature-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA Banner ────────────────────────────────────────────────────── */}
        <div className="home-cta-banner mt-5">
          <div className="row align-items-center g-3">
            <div className="col-lg-8">
              <h3 className="home-cta-title mb-1">Ready to take control of your tasks?</h3>
              <p className="home-cta-sub mb-0">
                Start for free. No sign-up required to explore with the demo account.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <Link
                to="/register"
                className="btn home-btn-primary d-inline-flex align-items-center gap-2"
              >
                Create Free Account
                <FiArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;
