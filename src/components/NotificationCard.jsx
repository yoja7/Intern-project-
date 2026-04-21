import { FiInfo, FiBell } from "react-icons/fi";

/**
 * NotificationCard — displays a single notification.
 * Props:
 *   notification: { id, title, message, type, read, createdAt }
 *   onMarkRead: function called with notification id
 */
function formatTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function NotificationCard({ notification, onMarkRead }) {
  if (!notification) return null;

  const icon = notification.type === "Reminder" ? <FiBell size={16} /> : <FiInfo size={16} />;

  return (
    <div
      className={`d-flex align-items-start gap-3 p-3 border rounded-lg mb-2 ${
        notification.read ? "bg-white" : "bg-light"
      }`}
    >
      <div className="text-primary mt-1">{icon}</div>
      <div className="flex-grow-1">
        {notification.title && (
          <p className="fw-semibold mb-0 small">{notification.title}</p>
        )}
        <p className="mb-0 small text-muted">{notification.message}</p>
        <p className="text-muted-sm mb-0">{formatTime(notification.createdAt)}</p>
      </div>
      {!notification.read && onMarkRead && (
        <button
          className="btn btn-sm btn-outline-secondary flex-shrink-0"
          onClick={() => onMarkRead(notification.id)}
        >
          Mark read
        </button>
      )}
    </div>
  );
}

export default NotificationCard;
