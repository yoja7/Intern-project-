import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "../utils/authHelpers";

/**
 * ProtectedRoute
 * ─────────────
 * Wraps routes that require the user to be logged in.
 * If no currentUser is found in localStorage, redirects to /login.
 *
 * Usage in AppRoutes:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/dashboard" element={<Dashboard />} />
 *   </Route>
 *
 * Or with a custom children prop (when wrapping a layout):
 *   <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} />
 */
function ProtectedRoute({ children }) {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    // Not logged in — redirect to login, preserving the intended destination
    return <Navigate to="/login" replace />;
  }

  // Logged in — render children (layout) or nested routes via Outlet
  return children ? children : <Outlet />;
}

export default ProtectedRoute;
