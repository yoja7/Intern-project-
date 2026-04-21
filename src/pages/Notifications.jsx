import { useState } from "react";
import { FiBell, FiCheck, FiCheckCircle, FiTrash2, FiX } from "react-icons/fi";
import { getCurrentUser } from "../utils/authHelpers";
import {
  getNotificationsByUser,
  markNotificationRead,
  markAllRead,
  deleteNotification,
  clearAllNotifications,
} from "../utils/notificationHelpers";
import EmptyState from "../components/EmptyState";

// ─── Type badge config ────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  Reminder: { color: "warning",   icon: "🔔" },
  Task:     { color: "primary",   icon: "✅" },
  System:   { color: "secondary", icon: "ℹ️" },
};

function formatTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function Notifications() {
  const currentUser = getCurrentUser();
  const userId      = currentUser?.id;

  const [notifications, setNotifications] = useState(() =>
    getNotificationsByUser(userId)
  );

  function reload() {
    setNotifications(getNotificationsByUser(userId));
  }

  function handleMarkRead(id) {
    markNotificationRead(id);
    reload();
  }

  function handleMarkAllRead() {
    markAllRead(userId);
    reload();
  }

  function handleDelete(id) {
    deleteNotification(id);
    reload();
  }

  function handleClearAll() {
    if (window.confirm("Clear all notifications?")) {
      clearAllNotifications(userId);
      reload();
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="container-fluid">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h1 className="h3 fw-bold mb-0 d-flex align-items-center gap-2">
            <FiBell size={22} />
            Notifications
            {unreadCount > 0 && (
              <span className="badge bg-danger">{unreadCount}</span>
            )}
          </h1>
          <p className="text-muted small mb-0">
            {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
            {unreadCount > 0 && ` · ${unreadCount} unread`}
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="d-flex gap-2">
            {unreadCount > 0 && (
              <button
                className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                onClick={handleMarkAllRead}
              >
                <FiCheckCircle size={14} />
                Mark all read
              </button>
            )}
            <button
              className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
              onClick={handleClearAll}
            >
              <FiTrash2 size={14} />
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ── Notification list ─────────────────────────────────────────────── */}
      {notifications.length === 0 ? (
        <EmptyState
          title="No notifications"
          message="You're all caught up! Notifications will appear here."
        />
      ) : (
        <div className="d-flex flex-column gap-2">
          {notifications.map((notif) => {
            const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.System;
            return (
              <div
                key={notif.id}
                className={`card border-0 shadow-sm rounded-lg p-3 ${
                  notif.read ? "" : "notif-unread"
                }`}
              >
                <div className="d-flex align-items-start gap-3">
                  {/* Icon */}
                  <div
                    className={`notif-icon bg-${config.color} bg-opacity-10 text-${config.color}`}
                    aria-hidden="true"
                  >
                    {config.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-grow-1 min-w-0">
                    <div className="d-flex align-items-start justify-content-between gap-2">
                      <div>
                        <p className={`mb-0 small fw-semibold ${notif.read ? "text-muted" : "text-dark"}`}>
                          {notif.title}
                        </p>
                        <p className="mb-1 small text-muted">{notif.message}</p>
                        <span className="text-muted-sm">{formatTime(notif.createdAt)}</span>
                      </div>

                      {/* Actions */}
                      <div className="d-flex gap-1 flex-shrink-0">
                        {!notif.read && (
                          <button
                            className="btn btn-sm btn-outline-success"
                            title="Mark as read"
                            onClick={() => handleMarkRead(notif.id)}
                          >
                            <FiCheck size={12} />
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-outline-danger"
                          title="Delete"
                          onClick={() => handleDelete(notif.id)}
                        >
                          <FiX size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Type badge */}
                    <span
                      className={`badge bg-${config.color} mt-1`}
                      style={{ fontSize: "0.65rem", opacity: 0.85 }}
                    >
                      {notif.type}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Notifications;
