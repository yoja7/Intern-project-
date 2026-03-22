// ─── Initial Users ────────────────────────────────────────────────────────────
export const initialUsers = [
  {
    id: "user-1",
    fullName: "Demo User",
    email: "demo@dainiki.com",
    password: "demo1234",
    createdAt: "2025-01-01T00:00:00.000Z",
  },
];

// ─── Initial Categories ───────────────────────────────────────────────────────
export const initialCategories = [
  { id: "cat-1", userId: "user-1", name: "Work",     createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "cat-2", userId: "user-1", name: "Personal", createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "cat-3", userId: "user-1", name: "Health",   createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "cat-4", userId: "user-1", name: "Learning", createdAt: "2025-01-01T00:00:00.000Z" },
];

// ─── Initial Tasks (using the required task structure) ────────────────────────
export const initialTasks = [
  {
    id: "task-1",
    userId: "user-1",
    title: "Set up project structure",
    description: "Create all folders and base files for the Dainiki app.",
    category: "Work",
    priority: "High",
    status: "Completed",
    dueDate: "2025-01-05",
    dueTime: "17:00",
    reminderDate: "",
    repeatInterval: "None",
    subtasks: [],
    activityLogs: [
      {
        id: "log-1a",
        action: "Task Created",
        description: "Task was created.",
        createdAt: "2025-01-01T08:00:00.000Z",
      },
      {
        id: "log-1b",
        action: "Task Completed",
        description: "Task was marked as completed.",
        createdAt: "2025-01-05T10:00:00.000Z",
      },
    ],
    createdAt: "2025-01-01T08:00:00.000Z",
    updatedAt: "2025-01-05T10:00:00.000Z",
    completedAt: "2025-01-05T10:00:00.000Z",
  },
  {
    id: "task-2",
    userId: "user-1",
    title: "Morning workout",
    description: "30 minutes of cardio and stretching.",
    category: "Health",
    priority: "Medium",
    status: "Pending",
    dueDate: "2026-06-10",
    dueTime: "07:00",
    reminderDate: "2026-06-10",
    repeatInterval: "Daily",
    subtasks: [
      { id: "sub-2a", title: "Warm up stretches", completed: true },
      { id: "sub-2b", title: "20 min cardio",     completed: false },
      { id: "sub-2c", title: "Cool down",          completed: false },
    ],
    activityLogs: [
      {
        id: "log-2a",
        action: "Task Created",
        description: "Task was created.",
        createdAt: "2025-01-02T09:00:00.000Z",
      },
    ],
    createdAt: "2025-01-02T09:00:00.000Z",
    updatedAt: "2025-01-02T09:00:00.000Z",
    completedAt: null,
  },
  {
    id: "task-3",
    userId: "user-1",
    title: "Read React documentation",
    description: "Go through the official React docs on hooks and context.",
    category: "Learning",
    priority: "Low",
    status: "In Progress",
    dueDate: "2026-06-20",
    dueTime: "",
    reminderDate: "",
    repeatInterval: "None",
    subtasks: [
      { id: "sub-3a", title: "Read Hooks section",   completed: true },
      { id: "sub-3b", title: "Read Context section", completed: false },
    ],
    activityLogs: [
      {
        id: "log-3a",
        action: "Task Created",
        description: "Task was created.",
        createdAt: "2025-01-03T10:00:00.000Z",
      },
      {
        id: "log-3b",
        action: "Status Updated",
        description: "Status changed to In Progress.",
        createdAt: "2025-01-04T09:00:00.000Z",
      },
    ],
    createdAt: "2025-01-03T10:00:00.000Z",
    updatedAt: "2025-01-04T09:00:00.000Z",
    completedAt: null,
  },
  {
    id: "task-4",
    userId: "user-1",
    title: "Prepare weekly report",
    description: "Summarize progress and blockers for the team meeting.",
    category: "Work",
    priority: "High",
    status: "Pending",
    dueDate: "2026-06-01",
    dueTime: "09:00",
    reminderDate: "2026-05-31",
    repeatInterval: "Weekly",
    subtasks: [],
    activityLogs: [
      {
        id: "log-4a",
        action: "Task Created",
        description: "Task was created.",
        createdAt: "2025-05-15T08:00:00.000Z",
      },
    ],
    createdAt: "2025-05-15T08:00:00.000Z",
    updatedAt: "2025-05-15T08:00:00.000Z",
    completedAt: null,
  },
];

// ─── Initial Notifications ────────────────────────────────────────────────────
// Note: type must be one of "Reminder" | "Task" | "System" to match TYPE_CONFIG
export const initialNotifications = [
  {
    id: "notif-1",
    userId: "user-1",
    title: "Welcome to Dainiki",
    message: "Welcome to Dainiki! Start by creating your first task.",
    type: "System",
    read: false,
    createdAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "notif-2",
    userId: "user-1",
    title: "Task Overdue",
    message: "Your task 'Prepare weekly report' is overdue.",
    type: "Reminder",
    read: false,
    createdAt: "2025-05-21T08:00:00.000Z",
  },
];

// ─── Motivational Messages ────────────────────────────────────────────────────
export const motivationalMessages = [
  "Small steps every day lead to big results.",
  "You don't have to be perfect, just consistent.",
  "One task at a time. You've got this.",
  "Progress, not perfection.",
  "Every completed task is a win worth celebrating.",
  "Start where you are. Use what you have. Do what you can.",
  "The secret to getting ahead is getting started.",
  "Focus on what matters most today.",
  "Done is better than perfect.",
  "Your future self will thank you for starting now.",
];
