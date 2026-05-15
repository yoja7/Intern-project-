import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiRefreshCw, FiCheckCircle, FiClock, FiAlertCircle,
  FiList, FiTrendingUp, FiZap, FiShare2, FiCalendar,
  FiActivity,
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
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
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

  const [allTasks, setAllTasks] = useState(() => getTasksByUser(userId));

  function refresh() {
    setAllTasks(getTasksByUser(userId));
  }

  useEffect(() => {
    checkReminders(getTasksByUser(userId), userId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats      = computeStats(allTasks);
  const todayTasks = getTodayTasks(allTasks);
  const upcoming   = getUpcomingTasks(allTasks, 5);
  const recentLogs = getRecentActivity(allTasks, 8);

  const statCards = [
    { label: "Total Tasks",   value: stats.total,        color: "primary",   icon: <FiList /> },
    { label: "Pending",       value: stats.pending,      color: "secondary", icon: <FiClock /> },
    { label: "In Progress",   value: stats.inProgress,   color: "warning",   icon: <FiTrendingUp /> },
    { label: "Completed",     value: stats.completed,    color: "success",   icon: <FiCheckCircle /> },
    { label: "Overdue",       value: stats.overdue,      color: "danger",    icon: <FiAlertCircle /> },
    { label: "High Priority", value: stats.highPriority, color: "info",      icon: <FiZap /> },
  ];

  function handleComplete(task) { completeTask(task.id); refresh(); }
  function handleDelete(task) {
    if (window.confirm(`Delete "${task.title}"?`)) { deleteTask(task.id); refresh(); }
  }

  async function handleShare() {
    const result = await shareTodayTasks(todayTasks);
    if (result.method !== "cancelled") {
      setShareMsg(result.message);
      setTimeout(() => setShareMsg(""), 3000);
    }
  }

  const firstName = currentUser?.fullName?.split(" ")[0] || "there";

  return (
    <div className="container-fluid px-0">

      {/* ── Header Banner ──────────────────────────────────────────────────── */}
      <div className="dash-header mb-4">
        <div className="dash-header-inner">
          <div>
            <h1 className="dash-greeting">
              {getGreeting()}, <span className="dash-greeting-name">{firstName}</span>
            </h1>
            <p className="dash-quote">&ldquo;{quote}&rdquo;</p>
          </div>
          <div className="d-flex gap-2 align-items-center flex-wrap">
            {shareMsg && (
              <span className="badge bg-success px-3 py-2 rounded-pill">{shareMsg}</span>
            )}
            <button
              className="btn dash-action-btn d-flex align-items-center gap-2"
              onClick={handleShare}
              title="Share today's tasks"
            >
              <FiShare2 size={14} />
              Share Today
            </button>
            <button
              className="btn dash-action-btn-ghost d-flex align-items-center gap-2"
              onClick={refresh}
              title="Refresh dashboard"
            >
              <FiRefreshCw size={14} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="px-3 px-lg-4">

        {/* ── Stats ────────────────────────────────────────────────────────── */}
        <DashboardStats stats={statCards} />

        {/* ── Today + Upcoming ─────────────────────────────────────────────── */}
        <div className="row g-4 mb-4">

          {/* Today's Tasks */}
          <div className="col-lg-6">
            <div className="dash-card h-100">
              <div className="dash-card-header">
                <div className="d-flex align-items-center gap-2">
                  <span className="dash-card-icon" style={{ background: "#e8f0fe", color: "#0d6efd" }}>
                    <FiCalendar size={15} />
                  </span>
                  <h2 className="dash-card-title mb-0">
                    Today&apos;s Tasks
                  </h2>
                  {todayTasks.length > 0 && (
                    <span className="badge rounded-pill bg-primary ms-1" style={{ fontSize: "0.7rem" }}>
                      {todayTasks.length}
                    </span>
                  )}
                </div>
                <Link to="/tasks" className="dash-card-link">View All</Link>
              </div>
              <div className="dash-card-body">
                {todayTasks.length === 0 ? (
                  <EmptyState
                    title="No tasks due today"
                    message="Enjoy your free time or plan ahead."
                  />
                ) : (
                  todayTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={handleComplete}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="col-lg-6">
            <div className="dash-card h-100">
              <div className="dash-card-header">
                <div className="d-flex align-items-center gap-2">
                  <span className="dash-card-icon" style={{ background: "#f0f0f0", color: "#6c757d" }}>
                    <FiTrendingUp size={15} />
                  </span>
                  <h2 className="dash-card-title mb-0">Upcoming Tasks</h2>
                  {upcoming.length > 0 && (
                    <span className="badge rounded-pill bg-secondary ms-1" style={{ fontSize: "0.7rem" }}>
                      {upcoming.length}
                    </span>
                  )}
                </div>
                <Link to="/tasks" className="dash-card-link">View All</Link>
              </div>
              <div className="dash-card-body">
                {upcoming.length === 0 ? (
                  <EmptyState
                    title="No upcoming tasks"
                    message="Add tasks with future due dates to see them here."
                  />
                ) : (
                  upcoming.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={handleComplete}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Recent Activity ───────────────────────────────────────────────── */}
        <div className="dash-card mb-4">
          <div className="dash-card-header">
            <div className="d-flex align-items-center gap-2">
              <span className="dash-card-icon" style={{ background: "#fff3e0", color: "#fd7e14" }}>
                <FiActivity size={15} />
              </span>
              <h2 className="dash-card-title mb-0">Recent Activity</h2>
            </div>
          </div>
          <div className="dash-card-body p-0">
            {recentLogs.length === 0 ? (
              <div className="p-4">
                <EmptyState title="No activity yet" message="Your task activity will appear here." />
              </div>
            ) : (
              <ul className="list-unstyled mb-0">
                {recentLogs.map((log, i) => (
                  <li
                    key={log.id}
                    className="dash-activity-item"
                    style={{ borderBottom: i < recentLogs.length - 1 ? "1px solid #f0f0f0" : "none" }}
                  >
                    <div className="dash-activity-dot" />
                    <div className="flex-grow-1 min-w-0">
                      <div className="d-flex align-items-center gap-1 flex-wrap">
                        <span className="dash-activity-action">{log.action}</span>
                        <span className="text-muted" style={{ fontSize: "0.78rem" }}>on</span>
                        <Link
                          to={`/tasks/${log.taskId}`}
                          className="dash-activity-task"
                        >
                          {log.taskTitle}
                        </Link>
                      </div>
                      <p className="dash-activity-desc mb-0">{log.description}</p>
                    </div>
                    <span className="dash-activity-time flex-shrink-0">
                      {formatDateTime(log.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
