import { useState } from "react";
import { FiEdit2, FiLock, FiUser } from "react-icons/fi";
import { getCurrentUser, updateCurrentUser, changePassword } from "../utils/authHelpers";

// ─── Avatar initials helper ───────────────────────────────────────────────────
function getInitials(name = "") {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── Format date helper ───────────────────────────────────────────────────────
function formatDate(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Profile() {
  const currentUser = getCurrentUser();

  // ── Edit Profile state ──────────────────────────────────────────────────────
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: currentUser?.fullName || "",
    email: currentUser?.email || "",
  });
  const [profileAlert, setProfileAlert] = useState(null); // { type, message }
  const [profileLoading, setProfileLoading] = useState(false);

  // ── Change Password state ───────────────────────────────────────────────────
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordAlert, setPasswordAlert] = useState(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // ── Displayed user (updates after save) ────────────────────────────────────
  const [displayUser, setDisplayUser] = useState(currentUser);

  // ─── Profile handlers ───────────────────────────────────────────────────────
  function handleProfileChange(e) {
    setProfileData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setProfileAlert(null);
  }

  function handleProfileSubmit(e) {
    e.preventDefault();
    setProfileAlert(null);
    setProfileLoading(true);

    const result = updateCurrentUser(profileData);

    if (!result.success) {
      setProfileAlert({ type: "danger", message: result.error });
      setProfileLoading(false);
      return;
    }

    setDisplayUser(result.user);
    setProfileAlert({ type: "success", message: "Profile updated successfully." });
    setProfileLoading(false);
    setEditMode(false);
  }

  function handleCancelEdit() {
    setProfileData({
      fullName: displayUser?.fullName || "",
      email: displayUser?.email || "",
    });
    setProfileAlert(null);
    setEditMode(false);
  }

  // ─── Password handlers ──────────────────────────────────────────────────────
  function handlePasswordChange(e) {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPasswordAlert(null);
  }

  function handlePasswordSubmit(e) {
    e.preventDefault();
    setPasswordAlert(null);
    setPasswordLoading(true);

    const result = changePassword(passwordData);

    if (!result.success) {
      setPasswordAlert({ type: "danger", message: result.error });
      setPasswordLoading(false);
      return;
    }

    setPasswordAlert({ type: "success", message: "Password changed successfully." });
    setPasswordData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    setPasswordLoading(false);
  }

  if (!displayUser) {
    return (
      <div className="container-fluid">
        <p className="text-muted">No user session found.</p>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <h1 className="h3 fw-bold mb-4">Profile</h1>

      <div className="row g-4">
        {/* ── Left: User info card ─────────────────────────────────────────── */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-lg p-4 text-center">
            {/* Avatar */}
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold mx-auto mb-3"
              style={{ width: 72, height: 72, fontSize: "1.5rem" }}
              aria-hidden="true"
            >
              {getInitials(displayUser.fullName)}
            </div>

            <h2 className="h5 fw-bold mb-1">{displayUser.fullName}</h2>
            <p className="text-muted small mb-3">{displayUser.email}</p>

            <div className="text-start border-top pt-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <FiUser size={14} className="text-muted" />
                <span className="small text-muted">Member since</span>
              </div>
              <p className="small fw-semibold mb-0">
                {formatDate(displayUser.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* ── Right: Edit forms ────────────────────────────────────────────── */}
        <div className="col-lg-8">
          {/* Edit Profile card */}
          <div className="card border-0 shadow-sm rounded-lg p-4 mb-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h2 className="h6 fw-bold mb-0 d-flex align-items-center gap-2">
                <FiEdit2 size={16} />
                Edit Profile
              </h2>
              {!editMode && (
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setEditMode(true)}
                >
                  Edit
                </button>
              )}
            </div>

            {/* Profile alert */}
            {profileAlert && (
              <div
                className={`alert alert-${profileAlert.type} py-2 small`}
                role="alert"
              >
                {profileAlert.message}
              </div>
            )}

            {editMode ? (
              <form onSubmit={handleProfileSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className="form-control"
                    value={profileData.fullName}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="profileEmail" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="profileEmail"
                    name="email"
                    className="form-control"
                    value={profileData.email}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    disabled={profileLoading}
                  >
                    {profileLoading ? "Saving…" : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="row g-3">
                <div className="col-sm-6">
                  <p className="text-muted small mb-1">Full Name</p>
                  <p className="fw-semibold mb-0">{displayUser.fullName}</p>
                </div>
                <div className="col-sm-6">
                  <p className="text-muted small mb-1">Email</p>
                  <p className="fw-semibold mb-0">{displayUser.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Change Password card */}
          <div className="card border-0 shadow-sm rounded-lg p-4">
            <h2 className="h6 fw-bold mb-3 d-flex align-items-center gap-2">
              <FiLock size={16} />
              Change Password
            </h2>

            {/* Password alert */}
            {passwordAlert && (
              <div
                className={`alert alert-${passwordAlert.type} py-2 small`}
                role="alert"
              >
                {passwordAlert.message}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="currentPassword" className="form-label">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  className="form-control"
                  placeholder="••••••••"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  autoComplete="current-password"
                />
              </div>
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
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
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
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordChange}
                  autoComplete="new-password"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={passwordLoading}
              >
                {passwordLoading ? "Updating…" : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
