/**
 * taskHelpers.js
 * All task and category management functions for Dainiki.
 * Uses only localStorage — no backend, no API calls.
 */

import { v4 as uuidv4 } from "uuid";
import {
  getTasks as getRawTasks,
  saveTasks as saveRawTasks,
  getCategories as getRawCategories,
  saveCategories as saveRawCategories,
} from "./localStorage";

// ─── Re-export base helpers so pages only need one import ─────────────────────
export const getTasks      = getRawTasks;
export const saveTasks     = saveRawTasks;
export const getCategories = getRawCategories;
export const saveCategories = saveRawCategories;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns today's date as "YYYY-MM-DD" */
function today() {
  return new Date().toISOString().split("T")[0];
}

/** Creates a new activity log entry */
function makeLog(action, description) {
  return {
    id: uuidv4(),
    action,
    description,
    createdAt: new Date().toISOString(),
  };
}

// ─── Task CRUD ────────────────────────────────────────────────────────────────

/**
 * Returns all tasks that belong to a specific user.
 */
export function getTasksByUser(userId) {
  return getRawTasks().filter((t) => t.userId === userId);
}

/**
 * Adds a new task for the given user.
 * Returns the created task object.
 */
export function addTask(userId, taskData) {
  const now = new Date().toISOString();

  const newTask = {
    id: uuidv4(),
    userId,
    title: taskData.title?.trim() || "Untitled Task",
    description: taskData.description?.trim() || "",
    category: taskData.category || "",
    priority: taskData.priority || "Medium",
    status: taskData.status || "Pending",
    dueDate: taskData.dueDate || "",
    dueTime: taskData.dueTime || "",
    reminderDate: taskData.reminderDate || "",
    repeatInterval: taskData.repeatInterval || "None",
    subtasks: [],
    activityLogs: [makeLog("Task Created", "Task was created.")],
    createdAt: now,
    updatedAt: now,
    completedAt: null,
  };

  const tasks = getRawTasks();
  saveRawTasks([...tasks, newTask]);
  return newTask;
}

/**
 * Updates an existing task by ID.
 * Automatically appends an "Task Edited" activity log.
 * Returns the updated task, or null if not found.
 */
export function updateTask(taskId, updates) {
  const tasks = getRawTasks();
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index === -1) return null;

  const now = new Date().toISOString();
  const existing = tasks[index];

  const updatedTask = {
    ...existing,
    ...updates,
    id: existing.id,       // never overwrite id
    userId: existing.userId, // never overwrite userId
    updatedAt: now,
    activityLogs: [
      ...existing.activityLogs,
      makeLog("Task Edited", "Task details were updated."),
    ],
  };

  tasks[index] = updatedTask;
  saveRawTasks(tasks);
  return updatedTask;
}

/**
 * Deletes a task by ID.
 * Returns true if deleted, false if not found.
 */
export function deleteTask(taskId) {
  const tasks = getRawTasks();
  const filtered = tasks.filter((t) => t.id !== taskId);
  if (filtered.length === tasks.length) return false;
  saveRawTasks(filtered);
  return true;
}

/**
 * Marks a task as Completed.
 * Sets status, completedAt, and appends a log entry.
 * Returns the updated task, or null if not found.
 */
export function completeTask(taskId) {
  const tasks = getRawTasks();
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index === -1) return null;

  const now = new Date().toISOString();
  const existing = tasks[index];

  const updatedTask = {
    ...existing,
    status: "Completed",
    completedAt: now,
    updatedAt: now,
    activityLogs: [
      ...existing.activityLogs,
      makeLog("Task Completed", "Task was marked as completed."),
    ],
  };

  tasks[index] = updatedTask;
  saveRawTasks(tasks);
  return updatedTask;
}

// ─── Activity Logs ────────────────────────────────────────────────────────────

/**
 * Appends a custom activity log to a task.
 * Returns the updated task, or null if not found.
 */
export function addActivityLog(taskId, action, description) {
  const tasks = getRawTasks();
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index === -1) return null;

  const now = new Date().toISOString();
  tasks[index] = {
    ...tasks[index],
    updatedAt: now,
    activityLogs: [
      ...tasks[index].activityLogs,
      makeLog(action, description),
    ],
  };

  saveRawTasks(tasks);
  return tasks[index];
}

// ─── Subtasks ─────────────────────────────────────────────────────────────────

/**
 * Adds a subtask to a task.
 * Returns the updated task, or null if not found.
 */
export function addSubtask(taskId, title) {
  const tasks = getRawTasks();
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index === -1) return null;

  const newSubtask = { id: uuidv4(), title: title.trim(), completed: false };
  const now = new Date().toISOString();

  tasks[index] = {
    ...tasks[index],
    updatedAt: now,
    subtasks: [...tasks[index].subtasks, newSubtask],
    activityLogs: [
      ...tasks[index].activityLogs,
      makeLog("Subtask Added", `Subtask "${title.trim()}" was added.`),
    ],
  };

  saveRawTasks(tasks);
  return tasks[index];
}

/**
 * Toggles a subtask's completed state.
 * Returns the updated task, or null if not found.
 */
export function toggleSubtask(taskId, subtaskId) {
  const tasks = getRawTasks();
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index === -1) return null;

  const subtask = tasks[index].subtasks.find((s) => s.id === subtaskId);
  if (!subtask) return null;

  const now = new Date().toISOString();
  const newCompleted = !subtask.completed;

  tasks[index] = {
    ...tasks[index],
    updatedAt: now,
    subtasks: tasks[index].subtasks.map((s) =>
      s.id === subtaskId ? { ...s, completed: newCompleted } : s
    ),
    activityLogs: [
      ...tasks[index].activityLogs,
      makeLog(
        "Subtask Updated",
        `Subtask "${subtask.title}" marked as ${newCompleted ? "completed" : "incomplete"}.`
      ),
    ],
  };

  saveRawTasks(tasks);
  return tasks[index];
}

/**
 * Deletes a subtask from a task.
 * Returns the updated task, or null if not found.
 */
export function deleteSubtask(taskId, subtaskId) {
  const tasks = getRawTasks();
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index === -1) return null;

  const subtask = tasks[index].subtasks.find((s) => s.id === subtaskId);
  const now = new Date().toISOString();

  tasks[index] = {
    ...tasks[index],
    updatedAt: now,
    subtasks: tasks[index].subtasks.filter((s) => s.id !== subtaskId),
    activityLogs: [
      ...tasks[index].activityLogs,
      makeLog(
        "Subtask Deleted",
        subtask ? `Subtask "${subtask.title}" was deleted.` : "A subtask was deleted."
      ),
    ],
  };

  saveRawTasks(tasks);
  return tasks[index];
}

// ─── Search & Filter ──────────────────────────────────────────────────────────

/**
 * Filters a tasks array by priority, status, category, and/or date range.
 * All filter params are optional — omit to skip that filter.
 *
 * @param {Array}  tasks
 * @param {Object} filters - { priority, status, category, dateFrom, dateTo }
 * @returns {Array} filtered tasks
 */
export function filterTasks(tasks, filters = {}) {
  let result = [...tasks];

  if (filters.priority && filters.priority !== "All") {
    result = result.filter((t) => t.priority === filters.priority);
  }

  if (filters.status && filters.status !== "All") {
    result = result.filter((t) => t.status === filters.status);
  }

  if (filters.category && filters.category !== "All") {
    result = result.filter((t) => t.category === filters.category);
  }

  if (filters.dateFrom) {
    result = result.filter((t) => t.dueDate && t.dueDate >= filters.dateFrom);
  }

  if (filters.dateTo) {
    result = result.filter((t) => t.dueDate && t.dueDate <= filters.dateTo);
  }

  return result;
}

/**
 * Searches tasks by title (case-insensitive substring match).
 *
 * @param {Array}  tasks
 * @param {string} query
 * @returns {Array} matching tasks
 */
export function searchTasks(tasks, query) {
  if (!query || !query.trim()) return tasks;
  const q = query.trim().toLowerCase();
  return tasks.filter((t) => t.title.toLowerCase().includes(q));
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

/**
 * Computes summary statistics for a user's tasks.
 * Returns an object with counts for each stat.
 */
export function computeStats(tasks) {
  const todayStr = today();

  return {
    total:      tasks.length,
    pending:    tasks.filter((t) => t.status === "Pending").length,
    inProgress: tasks.filter((t) => t.status === "In Progress").length,
    completed:  tasks.filter((t) => t.status === "Completed").length,
    overdue:    tasks.filter(
      (t) => t.dueDate && t.dueDate < todayStr && t.status !== "Completed"
    ).length,
    highPriority: tasks.filter((t) => t.priority === "High" && t.status !== "Completed").length,
  };
}

/**
 * Returns tasks due today (by dueDate) that are not completed.
 */
export function getTodayTasks(tasks) {
  const todayStr = today();
  return tasks.filter((t) => t.dueDate === todayStr && t.status !== "Completed");
}

/**
 * Returns upcoming tasks (due after today) that are not completed, sorted by dueDate.
 */
export function getUpcomingTasks(tasks, limit = 5) {
  const todayStr = today();
  return tasks
    .filter((t) => t.dueDate && t.dueDate > todayStr && t.status !== "Completed")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, limit);
}

/**
 * Returns the most recent activity logs across all tasks, sorted newest first.
 */
export function getRecentActivity(tasks, limit = 10) {
  const logs = [];
  tasks.forEach((task) => {
    task.activityLogs.forEach((log) => {
      logs.push({ ...log, taskTitle: task.title, taskId: task.id });
    });
  });
  return logs
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
}

// ─── Category CRUD ────────────────────────────────────────────────────────────

/**
 * Returns categories belonging to a specific user.
 */
export function getCategoriesByUser(userId) {
  return getRawCategories().filter((c) => c.userId === userId);
}

/**
 * Adds a new category for the given user.
 * Returns the created category.
 */
export function addCategory(userId, name) {
  const newCat = {
    id: uuidv4(),
    userId,
    name: name.trim(),
    createdAt: new Date().toISOString(),
  };
  const cats = getRawCategories();
  saveRawCategories([...cats, newCat]);
  return newCat;
}

/**
 * Updates a category's name.
 * Returns the updated category, or null if not found.
 */
export function updateCategory(categoryId, name) {
  const cats = getRawCategories();
  const index = cats.findIndex((c) => c.id === categoryId);
  if (index === -1) return null;
  cats[index] = { ...cats[index], name: name.trim() };
  saveRawCategories(cats);
  return cats[index];
}

/**
 * Deletes a category by ID.
 * Returns true if deleted, false if not found.
 */
export function deleteCategory(categoryId) {
  const cats = getRawCategories();
  const filtered = cats.filter((c) => c.id !== categoryId);
  if (filtered.length === cats.length) return false;
  saveRawCategories(filtered);
  return true;
}
