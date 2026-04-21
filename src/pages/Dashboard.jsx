import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiRefreshCw, FiCheckCircle, FiClock, FiAlertCircle,
  FiList, FiTrendingUp, FiZap, FiShare2,
} from "react-icons/fi";

import { getCurrentUser }   from "../utils/authHelpers";
import {
  getTasksByUser,
  computeStats,
  getTodayTasks,
  getUpcomingTasks,
  getRecentActivity,
  completeTask,
  deleteTask,
} from "../utils/taskHelpers";
import { motivationalMessages } from "../data/initialData";
import { checkReminders }       from "../utils/notificationHelpers";
import { shareTodayTasks }      from "../utils/shareHelpers";

import DashboardStats from "../components/DashboardStats";
import TaskCard       from "../components/TaskCard";
import EmptyState     from "../components/EmptyState";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

function randomMessage() {
  return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
}

function formatDateTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function Dashboard() {
  const currentUser = getCurrentUser();
  const userId      = currentUser?.id;

  const [quote]    = useState(randomMessage);
  const [shareMsg, setShareMsg] = useState("");

  // ── Data state — re-read from localStorage on refresh ─────────────────────
  const [allTasks, setAllTasks] = useState(() => getTasksByUser(userId));

  // ── Refresh: re-read tasks from localStorage ──────────────────────────────
  function refresh() {
    setAllTasks(getTasksByUser(userId));
  }

  // ── Check reminders once on mount ─────────────────────────────────────────
  useEffect(() => {
    checkReminders(getTasksByUser(userId), userId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Derived data ───────────────────────────────────────────────────────────
  const stats      = computeStats(allTasks);
  const todayTasks = getTodayTasks(allTasks);
  const upcoming   = getUpcomingTasks(allTasks, 5);
  const recentLogs = getRecentActivity(allTasks, 8);

  // ── Stat cards ─────────────────────────────────────────────────────────────
  const statCards = [
    { label: "Total",         value: stats.total,        color: "primary",   icon: <FiList /> },
    { label: "Pending",       value: stats.pending,      color: "secondary", icon: <FiClock /> },
    { label: "In Progress",   value: stats.inProgress,   color: "warning",   icon: <FiTrendingUp /> },
    { label: "Completed",     value: stats.completed,    color: "success",   icon: <FiCheckCircle /> },
    { label: "Overdue",       value: stats.overdue,      color: "danger",    icon: <FiAlertCircle /> },
    { label: "High Priority", value: stats.highPriority, color: "info",      icon: <FiZap /> },
  ];

  // ── Task actions ───────────────────────────────────────────────────────────
  function handleComplete(task) { completeTask(task.id); refresh(); }
  function handleDelete(task) {
    if (window.confirm(`Delete "${task.title}"?`)) { deleteTask(task.id); refresh(); }
  }

  // ── Share today's tasks ────────────────────────────────────────────────────
  async function handleShare() {
    const result = await shareTodayTasks(todayTasks);
    if (result.method !== "cancelled") {
      setShareMsg(result.message);
      setTimeout(() => setShareMsg(""), 3000);
    }
  }

  return (
    <div className="container-fluid">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h1 className="h3 fw-bold mb-1">
            {getGreeting()}, {currentUser?.fullName?.split(" ")[0] || "there"} 👋
          </h1>
          <p className="text-muted small mb-0">
            <em>&ldquo;{quote}&rdquo;</em>
          </p>
        </div>
        <div className="d-flex gap-2 align-items-center flex-wrap">
          {shareMsg && (
            <span className="badge bg-success px-3 py-2">{shareMsg}</span>
          )}
          <button
            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
            onClick={handleShare}
            title="Share today's tasks"
          >
            <FiShare2 size={14} />
            Share Today
          </button>
          <button
            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
            onClick={refresh}
            title="Refresh dashboard"
          >
            <FiRefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <DashboardStats stats={statCards} />

      {/* ── Today's Tasks + Upcoming ───────────────────────────────────────── */}
      <div className="row g-4 mb-4">
        {/* Today's Tasks */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-lg h-100">
            <div className="card-header bg-white border-bottom d-flex align-items-center justify-content-between py-3">
              <h2 className="h6 fw-bold mb-0">
                📅 Today&apos;s Tasks
                {todayTasks.length > 0 && (
                  <span className="badge bg-primary ms-2">{todayTasks.length}</span>
                )}
              </h2>
              <Link to="/tasks" className="btn btn-sm btn-outline-primary">View All</Link>
            </div>
            <div className="card-body p-3">
              {todayTasks.length === 0 ? (
                <EmptyState title="No tasks due today" message="Enjoy your free time or plan ahead!" />
              ) : (
                todayTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onComplete={handleComplete} onDelete={handleDelete} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-lg h-100">
            <div className="card-header bg-white border-bottom d-flex align-items-center justify-content-between py-3">
              <h2 className="h6 fw-bold mb-0">
                🗓️ Upcoming Tasks
                {upcoming.length > 0 && (
                  <span className="badge bg-secondary ms-2">{upcoming.length}</span>
                )}
              </h2>
              <Link to="/tasks" className="btn btn-sm btn-outline-secondary">View All</Link>
            </div>
            <div className="card-body p-3">
              {upcoming.length === 0 ? (
                <EmptyState title="No upcoming tasks" message="Add tasks with future due dates to see them here." />
              ) : (
                upcoming.map((task) => (
                  <TaskCard key={task.id} task={task} onComplete={handleComplete} onDelete={handleDelete} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Activity ────────────────────────────────────────────────── */}
      <div className="card border-0 shadow-sm rounded-lg">
        <div className="card-header bg-white border-bottom py-3">
          <h2 className="h6 fw-bold mb-0">🕐 Recent Activity</h2>
        </div>
        <div className="card-body p-0">
          {recentLogs.length === 0 ? (
            <div className="p-4">
              <EmptyState title="No activity yet" message="Your task activity will appear here." />
            </div>
          ) : (
            <ul className="list-group list-group-flush">
              {recentLogs.map((log) => (
                <li key={log.id} className="list-group-item px-4 py-2">
                  <div className="d-flex align-items-start justify-content-between gap-2">
                    <div>
                      <span className="fw-semibold small">{log.action}</span>
                      <span className="text-muted small"> — </span>
                      <Link to={`/tasks/${log.taskId}`} className="text-primary small text-decoration-none">
                        {log.taskTitle}
                      </Link>
                      <p className="text-muted-sm mb-0">{log.description}</p>
                    </div>
                    <span className="text-muted-sm flex-shrink-0">{formatDateTime(log.createdAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
