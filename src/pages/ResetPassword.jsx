import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword, getResetEmail } from "../utils/authHelpers";

function ResetPassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const resetEmail = getResetEmail();

  // Guard: if no reset email in storage, the user hasn't gone through the flow
  if (!resetEmail) {
    return (
      <div className="auth-page">
        <div className="auth-card text-center">
          <p className="text-muted mb-3">
            No reset session found. Please start from the Forgot Password page.
          </p>
          <Link to="/forgot-password" className="btn btn-primary btn-sm">
            Go to Forgot Password
          </Link>
        </div>
      </div>
    );
  }

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const result = resetPassword({
      email: resetEmail,
      newPassword: formData.newPassword,
      confirmNewPassword: formData.confirmNewPassword,
    });

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSuccess("Password reset successfully! Redirecting to login…");
    setLoading(false);
    setTimeout(() => navigate("/login"), 1500);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="mb-3" style={{ fontSize: "2.5rem" }}>🔒</div>
          <h1 className="h4 fw-bold mb-1">Set New Password</h1>
          <p className="text-muted small">
            Create a new password for <strong>{resetEmail}</strong>
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="alert alert-danger py-2 small" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success py-2 small" role="alert">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              className="form-control"
              placeholder="Min. 6 characters"
              value={formData.newPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmNewPassword" className="form-label">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              className="form-control"
              placeholder="Repeat new password"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
                Resetting…
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <p className="text-center mt-3 small">
          <Link to="/login" className="text-primary">
            &larr; Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
