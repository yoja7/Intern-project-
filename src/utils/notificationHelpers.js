/**
 * notificationHelpers.js
 * Manages in-app notifications and browser Notification API.
 * Uses only localStorage — no backend.
 */

import { v4 as uuidv4 } from "uuid";
import { getNotifications, saveNotifications } from "./localStorage";

// ─── Notification Settings ────────────────────────────────────────────────────
const SETTINGS_KEY = "dainiki_notification_settings";

const DEFAULT_SETTINGS = {
  enableNotifications:    true,
  enableReminderAlerts:   true,
  enableCompletionAlerts: true,
  enableMotivational:     false,
};

export function getNotificationSettings() {
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (!raw) return { ...DEFAULT_SETTINGS };
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveNotificationSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// ─── In-App Notification CRUD ─────────────────────────────────────────────────

/**
 * Returns all notifications for a specific user, newest first.
 */
export function getNotificationsByUser(userId) {
  return getNotifications()
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Adds a new in-app notification for a user.
 * type: "Reminder" | "Task" | "System"
 */
export function addNotification(userId, { title, message, type = "System" }) {
  const newNotif = {
    id: uuidv4(),
    userId,
    title,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString(),
  };
  const all = getNotifications();
  saveNotifications([newNotif, ...all]);
  return newNotif;
}

/**
 * Marks a single notification as read.
 */
export function markNotificationRead(notifId) {
  const all = getNotifications().map((n) =>
    n.id === notifId ? { ...n, read: true } : n
  );
  saveNotifications(all);
}

/**
 * Marks all notifications for a user as read.
 */
export function markAllRead(userId) {
  const all = getNotifications().map((n) =>
    n.userId === userId ? { ...n, read: true } : n
  );
  saveNotifications(all);
}

/**
 * Deletes a single notification by ID.
 */
export function deleteNotification(notifId) {
  saveNotifications(getNotifications().filter((n) => n.id !== notifId));
}

/**
 * Clears all notifications for a user.
 */
export function clearAllNotifications(userId) {
  saveNotifications(getNotifications().filter((n) => n.userId !== userId));
}

/**
 * Returns the count of unread notifications for a user.
 */
export function getUnreadCount(userId) {
  return getNotifications().filter((n) => n.userId === userId && !n.read).length;
}

// ─── Browser Notification API ─────────────────────────────────────────────────

/**
 * Requests browser notification permission.
 * Returns the permission string: "granted" | "denied" | "default"
 */
export async function requestNotificationPermission() {
  if (!("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied")  return "denied";
  const result = await Notification.requestPermission();
  return result;
}

/**
 * Shows a browser notification if permission is granted.
 * Falls back silently if not supported or denied.
 */
export function showBrowserNotification(title, message) {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  try {
    new Notification(title, {
      body: message,
      icon: "/favicon.svg",
    });
  } catch {
    // Some browsers block notifications in certain contexts — fail silently
  }
}

// ─── Reminder Checker ─────────────────────────────────────────────────────────

/**
 * Checks all tasks for due reminders and fires browser notifications.
 * Call this once on app load (while the app is open).
 *
 * A reminder fires if:
 *   - reminderDate matches today
 *   - task is not completed
 *   - we haven't already fired it this session (tracked in sessionStorage)
 */
export function checkReminders(tasks, userId) {
  const settings = getNotificationSettings();
  if (!settings.enableNotifications || !settings.enableReminderAlerts) return;

  const todayStr = new Date().toISOString().split("T")[0];
  const firedKey = "dainiki_fired_reminders";
  let fired;
  try {
    fired = JSON.parse(sessionStorage.getItem(firedKey) || "[]");
    if (!Array.isArray(fired)) fired = [];
  } catch {
    fired = [];
  }

  tasks.forEach((task) => {
    if (
      task.reminderDate === todayStr &&
      task.status !== "Completed" &&
      !fired.includes(task.id)
    ) {
      const msg = `Reminder: "${task.title}" is due${task.dueDate ? ` on ${task.dueDate}` : ""}.`;
      showBrowserNotification("Dainiki Reminder", msg);
      addNotification(userId, {
        title: "Task Reminder",
        message: msg,
        type: "Reminder",
      });
      fired.push(task.id);
    }
  });

  sessionStorage.setItem(firedKey, JSON.stringify(fired));
}
