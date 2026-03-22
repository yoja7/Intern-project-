import {
  initialUsers,
  initialTasks,
  initialCategories,
  initialNotifications,
} from "../data/initialData";

// ─── Keys ─────────────────────────────────────────────────────────────────────
const KEYS = {
  USERS: "dainiki_users",
  TASKS: "dainiki_tasks",
  CATEGORIES: "dainiki_categories",
  NOTIFICATIONS: "dainiki_notifications",
  CURRENT_USER: "dainiki_current_user",
};

// ─── Safe JSON parse ──────────────────────────────────────────────────────────
/**
 * Safely parses a JSON string. Returns fallback if parsing fails or value is null.
 */
function safeParse(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    // Corrupted data — return the fallback value
    return fallback;
  }
}

// ─── Initialize ───────────────────────────────────────────────────────────────
/**
 * Seeds localStorage with default data if it hasn't been set up yet.
 * Call this once when the app starts.
 */
export function initializeData() {
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(initialUsers));
  }
  if (!localStorage.getItem(KEYS.TASKS)) {
    localStorage.setItem(KEYS.TASKS, JSON.stringify(initialTasks));
  }
  if (!localStorage.getItem(KEYS.CATEGORIES)) {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(initialCategories));
  }
  if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(initialNotifications));
  }
}

// ─── Users ────────────────────────────────────────────────────────────────────
export function getUsers() {
  return safeParse(localStorage.getItem(KEYS.USERS), []);
}

export function saveUsers(users) {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

// ─── Tasks ────────────────────────────────────────────────────────────────────
export function getTasks() {
  return safeParse(localStorage.getItem(KEYS.TASKS), []);
}

export function saveTasks(tasks) {
  localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
}

// ─── Categories ───────────────────────────────────────────────────────────────
export function getCategories() {
  return safeParse(localStorage.getItem(KEYS.CATEGORIES), []);
}

export function saveCategories(categories) {
  localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
}

// ─── Notifications ────────────────────────────────────────────────────────────
export function getNotifications() {
  return safeParse(localStorage.getItem(KEYS.NOTIFICATIONS), []);
}

export function saveNotifications(notifications) {
  localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications));
}

// ─── Current User (Session) ───────────────────────────────────────────────────
export function getCurrentUser() {
  return safeParse(localStorage.getItem(KEYS.CURRENT_USER), null);
}

export function saveCurrentUser(user) {
  localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
}

export function removeCurrentUser() {
  localStorage.removeItem(KEYS.CURRENT_USER);
}
