import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getResetEmail } from "../utils/authHelpers";

// Fixed demo OTP for this frontend-only project
const DEMO_OTP = "123456";

function OtpVerification() {
  const navigate = useNavigate();

  // 6 individual digit inputs stored as an array
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Refs for each input so we can auto-focus the next box
  const inputRefs = useRef([]);

  const resetEmail = getResetEmail();

  // If someone lands here without going through Forgot Password, redirect them
  if (!resetEmail) {
    return (
      <div className="auth-page">
        <div className="auth-card text-center">
          <p className="text-muted mb-3">
            No reset request found. Please start from the Forgot Password page.
          </p>
          <Link to="/forgot-password" className="btn btn-primary btn-sm">
            Go to Forgot Password
          </Link>
        </div>
      </div>
    );
  }

  function handleDigitChange(index, value) {
    // Accept only a single digit
    const digit = value.replace(/\D/g, "").slice(-1);
    const updated = [...digits];
    updated[index] = digit;
    setDigits(updated);
    setError("");

    // Auto-advance to next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, e) {
    // On Backspace with empty field, go back to previous input
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const updated = ["", "", "", "", "", ""];
    pasted.split("").forEach((char, i) => {
      updated[i] = char;
    });
    setDigits(updated);
    // Focus the last filled input
    const lastIndex = Math.min(pasted.length, 5);
    inputRefs.current[lastIndex]?.focus();
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const enteredOtp = digits.join("");

    if (enteredOtp.length < 6) {
      setError("Please enter all 6 digits.");
      setLoading(false);
      return;
    }

    if (enteredOtp !== DEMO_OTP) {
      setError("Incorrect OTP. Please try again. (Hint: 123456)");
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate("/reset-password");
  }

  function handleResend() {
    setDigits(["", "", "", "", "", ""]);
    setError("");
    alert(`Demo OTP resent to ${resetEmail}. Use: ${DEMO_OTP}`);
    inputRefs.current[0]?.focus();
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="mb-3" style={{ fontSize: "2.5rem" }}>📩</div>
          <h1 className="h4 fw-bold mb-1">Check your email</h1>
          <p className="text-muted small">
            We sent a 6-digit code to{" "}
            <strong>{resetEmail}</strong>
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <div className="alert alert-danger py-2 small" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* 6-digit OTP input boxes */}
          <div
            className="d-flex justify-content-center gap-2 mb-4"
            onPaste={handlePaste}
          >
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="form-control text-center fw-bold fs-5"
                style={{ width: "48px", height: "52px" }}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                aria-label={`OTP digit ${index + 1}`}
              />
            ))}
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
                Verifying…
              </>
            ) : (
              "Verify Code"
            )}
          </button>
        </form>

        <p className="text-center mt-3 small text-muted">
          Didn&apos;t receive a code?{" "}
          <button
            type="button"
            className="btn btn-link btn-sm p-0 text-primary"
            onClick={handleResend}
          >
            Resend
          </button>
        </p>

        <p className="text-center small">
          <Link to="/forgot-password" className="text-primary">
            &larr; Back
          </Link>
        </p>
      </div>
    </div>
  );
}

export default OtpVerification;
