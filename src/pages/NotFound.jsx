import { Link } from "react-router-dom";
import { getCurrentUser } from "../utils/authHelpers";

/**
 * NotFound — 404 page.
 * Redirects to dashboard if logged in, otherwise to home.
 */
function NotFound() {
  const currentUser = getCurrentUser();
  const destination = currentUser ? "/dashboard" : "/";
  const label       = currentUser ? "Go to Dashboard" : "Go to Home";

  return (
    <div className="flex-center full-height">
      <div className="text-center">
        <div className="mb-3" style={{ fontSize: "4rem" }}>🔍</div>
        <h1 className="display-1 fw-bold text-primary">404</h1>
        <h2 className="h4 fw-semibold mb-2">Page Not Found</h2>
        <p className="text-muted mb-4">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link to={destination} className="btn btn-primary">
          {label}
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
