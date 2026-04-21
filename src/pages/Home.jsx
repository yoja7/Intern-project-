import { Link } from "react-router-dom";
import heroImg from "../assets/hero.png";

/**
 * Home — public landing page.
 * Shown to visitors who are not logged in.
 */
function Home() {
  return (
    <div className="home-page">
      <div className="container py-5">
        <div className="row align-items-center g-5">
          {/* ── Left: copy ─────────────────────────────────────────────────── */}
          <div className="col-lg-6 text-center text-lg-start">
            <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold mb-3 px-3 py-2">
              Personal Task Manager
            </span>
            <h1 className="display-5 fw-bold mb-3 lh-sm">
              Stay organised.<br />Stay productive.
            </h1>
            <p className="lead text-muted mb-4">
              Dainiki helps you manage your daily tasks, set reminders, track
              progress, and stay on top of what matters most — all in one place.
            </p>
            <div className="d-flex gap-3 justify-content-center justify-content-lg-start flex-wrap">
              <Link to="/register" className="btn btn-primary btn-lg px-4">
                Get Started Free
              </Link>
              <Link to="/login" className="btn btn-outline-secondary btn-lg px-4">
                Sign In
              </Link>
            </div>

            {/* Feature highlights */}
            <div className="d-flex gap-4 mt-4 justify-content-center justify-content-lg-start flex-wrap">
              {["✅ Task tracking", "🔔 Reminders", "📅 Calendar view", "📊 Dashboard stats"].map((f) => (
                <span key={f} className="text-muted small">{f}</span>
              ))}
            </div>
          </div>

          {/* ── Right: hero image ───────────────────────────────────────────── */}
          <div className="col-lg-6 text-center">
            <img
              src={heroImg}
              alt="Dainiki task manager preview"
              className="img-fluid rounded-lg shadow-sm"
              style={{ maxHeight: 420, objectFit: "contain" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
