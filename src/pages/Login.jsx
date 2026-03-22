import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { loginUser } from "../utils/authHelpers";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = loginUser(formData);

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate("/dashboard");
  }

  function handleGoogleSignIn() {
    alert("Google Sign-In requires backend integration.");
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="h4 fw-bold mb-1">Welcome back</h1>
          <p className="text-muted small">Sign in to your Dainiki account</p>
        </div>

        {/* Error alert */}
        {error && (
          <div className="alert alert-danger py-2 small" role="alert">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="mb-2">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          {/* Remember me + Forgot password row */}
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="form-check mb-0">
              <input
                type="checkbox"
                id="rememberMe"
                className="form-check-input"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe" className="form-check-label small">
                Remember me
              </label>
            </div>
            <Link to="/forgot-password" className="text-primary small">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
                Signing in…
              </>
            ) : (
              "Login"
            )}
          </button>

          {/* Divider */}
          <div className="d-flex align-items-center gap-2 mb-3">
            <hr className="flex-grow-1 m-0" />
            <span className="text-muted small">or</span>
            <hr className="flex-grow-1 m-0" />
          </div>

          {/* Google Sign-In (UI only) */}
          <button
            type="button"
            className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={handleGoogleSignIn}
          >
            <FcGoogle size={18} />
            <span className="small">Continue with Google</span>
          </button>
        </form>

        <p className="text-center mt-3 small">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-primary fw-semibold">
            Register
          </Link>
        </p>

        {/* Demo hint */}
        <div className="mt-3 p-2 bg-light rounded small text-muted text-center">
          Demo: <strong>demo@dainiki.com</strong> / <strong>demo1234</strong>
        </div>
      </div>
    </div>
  );
}

export default Login;
