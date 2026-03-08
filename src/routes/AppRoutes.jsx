import { Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Route guards
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

// Public pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import OtpVerification from "../pages/OtpVerification";

// Protected pages
import Dashboard     from "../pages/Dashboard";
import Tasks         from "../pages/Tasks";
import TaskDetails   from "../pages/TaskDetails";
import Categories    from "../pages/Categories";
import Calendar      from "../pages/Calendar";
import Notifications from "../pages/Notifications";
import Profile       from "../pages/Profile";
import Settings      from "../pages/Settings";

// Fallback
import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <Routes>
      {/* ── Public / guest routes ─────────────────────────────────────────── */}
      {/* Home is always accessible */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* Auth pages: redirect to /dashboard if already logged in */}
      <Route element={<GuestRoute><MainLayout /></GuestRoute>}>
        <Route path="/login"            element={<Login />} />
        <Route path="/register"         element={<Register />} />
        <Route path="/forgot-password"  element={<ForgotPassword />} />
        <Route path="/reset-password"   element={<ResetPassword />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
      </Route>

      {/* ── Protected routes (must be logged in) ─────────────────────────── */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard"         element={<Dashboard />} />
        <Route path="/tasks"             element={<Tasks />} />
        <Route path="/tasks/:id"         element={<TaskDetails />} />
        <Route path="/categories"        element={<Categories />} />
        <Route path="/calendar"          element={<Calendar />} />
        <Route path="/notifications"     element={<Notifications />} />
        <Route path="/profile"           element={<Profile />} />
        <Route path="/settings"          element={<Settings />} />
      </Route>

      {/* ── 404 fallback ─────────────────────────────────────────────────── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
