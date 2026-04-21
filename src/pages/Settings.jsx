import { useState } from "react";
import { FiBell, FiShield, FiInfo } from "react-icons/fi";
import {
  getNotificationSettings,
  saveNotificationSettings,
  requestNotificationPermission,
} from "../utils/notificationHelpers";

// ─── ToggleRow — defined outside component to avoid remounting on re-render ───
/**
 * A labelled toggle switch row.
 * Props: label, description, settingKey, checked, onChange
 */
function ToggleRow({ label, description, settingKey, checked, onChange }) {
  return (
    <div className="d-flex align-items-center justify-content-between py-3 border-bottom">
      <div>
        <p className="fw-semibold mb-0 small">{label}</p>
        {description && <p className="text-muted-sm mb-0">{description}</p>}
      </div>
      <div className="form-check form-switch mb-0 ms-3">
        <input
          className="form-check-input cursor-pointer"
          type="checkbox"
          role="switch"
          id={`toggle-${settingKey}`}
          checked={checked}
          onChange={() => onChange(settingKey)}
          style={{ width: "2.5em", height: "1.25em" }}
        />
        <label className="form-check-label visually-hidden" htmlFor={`toggle-${settingKey}`}>
          {label}
        </label>
      </div>
    </div>
  );
}

function Settings() {
  const [settings, setSettings] = useState(() => getNotificationSettings());
  const [permStatus, setPermStatus] = useState(
    "Notification" in window ? Notification.permission : "unsupported"
  );
  const [saveMsg, setSaveMsg] = useState("");

  // ── Toggle a boolean setting ───────────────────────────────────────────────
  function handleToggle(key) {
    setSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      saveNotificationSettings(updated);
      return updated;
    });
    setSaveMsg("Settings saved.");
    setTimeout(() => setSaveMsg(""), 2000);
  }

  // ── Request browser notification permission ────────────────────────────────
  async function handleRequestPermission() {
    const result = await requestNotificationPermission();
    setPermStatus(result);
  }

  return (
    <div className="container-fluid">
      <h1 className="h3 fw-bold mb-4">Settings</h1>

      {/* ── Notification Settings ─────────────────────────────────────────── */}
      <div className="card border-0 shadow-sm rounded-lg mb-4" style={{ maxWidth: 600 }}>
        <div className="card-header bg-white border-bottom py-3 px-4">
          <h2 className="h6 fw-bold mb-0 d-flex align-items-center gap-2">
            <FiBell size={16} />
            Notification Settings
          </h2>
        </div>
        <div className="card-body px-4 py-0">
          <ToggleRow
            label="Enable Notifications"
            description="Master switch for all in-app notifications."
            settingKey="enableNotifications"
            checked={settings.enableNotifications}
            onChange={handleToggle}
          />
          <ToggleRow
            label="Reminder Alerts"
            description="Get notified when a task reminder date arrives."
            settingKey="enableReminderAlerts"
            checked={settings.enableReminderAlerts}
            onChange={handleToggle}
          />
          <ToggleRow
            label="Task Completion Alerts"
            description="Show a notification when you complete a task."
            settingKey="enableCompletionAlerts"
            checked={settings.enableCompletionAlerts}
            onChange={handleToggle}
          />
          <ToggleRow
            label="Motivational Messages"
            description="Receive daily motivational messages."
            settingKey="enableMotivational"
            checked={settings.enableMotivational}
            onChange={handleToggle}
          />
        </div>

        {saveMsg && (
          <div className="px-4 pb-2">
            <p className="text-success small mb-0">✓ {saveMsg}</p>
          </div>
        )}
      </div>

      {/* ── Browser Notifications ─────────────────────────────────────────── */}
      <div className="card border-0 shadow-sm rounded-lg mb-4" style={{ maxWidth: 600 }}>
        <div className="card-header bg-white border-bottom py-3 px-4">
          <h2 className="h6 fw-bold mb-0 d-flex align-items-center gap-2">
            <FiShield size={16} />
            Browser Notifications
          </h2>
        </div>
        <div className="card-body px-4 py-3">
          {permStatus === "unsupported" ? (
            <div className="alert alert-warning py-2 small mb-0">
              Your browser does not support desktop notifications.
            </div>
          ) : (
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div>
                <p className="fw-semibold mb-0 small">Permission Status</p>
                <p className="text-muted-sm mb-0">
                  {permStatus === "granted"
                    ? "✅ Notifications are allowed."
                    : permStatus === "denied"
                    ? "❌ Notifications are blocked. Enable them in your browser settings."
                    : "⚠️ Permission not yet requested."}
                </p>
              </div>
              {permStatus !== "granted" && permStatus !== "denied" && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={handleRequestPermission}
                >
                  Allow Notifications
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── About ─────────────────────────────────────────────────────────── */}
      <div className="card border-0 shadow-sm rounded-lg" style={{ maxWidth: 600 }}>
        <div className="card-header bg-white border-bottom py-3 px-4">
          <h2 className="h6 fw-bold mb-0 d-flex align-items-center gap-2">
            <FiInfo size={16} />
            About Dainiki
          </h2>
        </div>
        <div className="card-body px-4 py-3">
          <p className="small text-muted mb-1">
            <strong>Dainiki</strong> is a frontend-only personal task manager built with React + Vite.
          </p>
          <p className="small text-muted mb-1">All data is stored locally in your browser using localStorage.</p>
          <p className="small text-muted mb-0">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
