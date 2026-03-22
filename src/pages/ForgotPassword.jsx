import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { initiatePasswordReset } from "../utils/authHelpers";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = initiatePasswordReset(email);

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setLoading(false);
    // Email found — move to OTP step
    navigate("/otp-verification");
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="mb-3" style={{ fontSize: "2.5rem" }}>🔑</div>
          <h1 className="h4 fw-bold mb-1">Forgot Password?</h1>
          <p className="text-muted small">
            Enter your email and we&apos;ll send you a reset code.
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <div className="alert alert-danger py-2 small" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              autoComplete="email"
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
                Checking…
              </>
            ) : (
              "Send Reset Code"
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

export default ForgotPassword;
