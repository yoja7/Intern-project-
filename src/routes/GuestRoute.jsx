import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "../utils/authHelpers";

/**
 * GuestRoute
 * ──────────
 * Wraps public/auth routes (login, register, etc.).
 * If the user is already logged in, redirects them to /dashboard
 * so they don't see the login page again.
 */
function GuestRoute({ children }) {
  const currentUser = getCurrentUser();

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? children : <Outlet />;
}

export default GuestRoute;
