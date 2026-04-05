import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiEdit2, FiTrash2, FiCheckCircle, FiPlus, FiX,
  FiCalendar, FiClock, FiRepeat, FiBell, FiTag,
} from "react-icons/fi";

import {
  getTasks,
  updateTask,
  deleteTask,
  completeTask,
  addSubtask,
  toggleSubtask,
  deleteSubtask,
  getCategoriesByUser,
} from "../utils/taskHelpers";
import { getCurrentUser } from "../utils/authHelpers";

import TaskForm from "../components/TaskForm";

// ─── Badge helpers ────────────────────────────────────────────────────────────
const PRIORITY_BADGE = { High: "danger", Medium: "warning", Low: "success" };
const STATUS_BADGE   = { "Completed": "success", "In Progress": "primary", "Pending": "secondary" };

function formatDateTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

function TaskDetails() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const currentUser = getCurrentUser();

  // ── Local state ────────────────────────────────────────────────────────────
  const [task, setTask]         = useState(() => getTasks().find((t) => t.id === id) || null);
  const [editMode, setEditMode] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");
  const [subtaskError, setSubtaskError] = useState("");

  const categories = getCategoriesByUser(currentUser?.id).map((c) => c.name);

  // ── Guard: task not found ──────────────────────────────────────────────────
  if (!task) {
    return (
      <div className="container-fluid">
        <div className="mb-3">
          <Link to="/tasks" className="text-muted small">&larr; Back to Tasks</Link>
        </div>
        <div className="text-center py-5">
          <p className="text-muted">Task not found.</p>
          <Link to="/tasks" className="btn btn-primary btn-sm">Go to Tasks</Link>
        </div>
      </div>
    );
  }

  // Ensure arrays exist even if data is malformed
  const subtasks     = task.subtasks     || [];
  const activityLogs = task.activityLogs || [];

  const isCompleted    = task.status === "Completed";
  const priorityColor  = PRIORITY_BADGE[task.priority] || "secondary";
  const statusColor    = STATUS_BADGE[task.status]     || "secondary";
  const todayStr       = new Date().toISOString().split("T")[0];
  const isOverdue      = task.dueDate && task.dueDate < todayStr && !isCompleted;

  // ── Task actions ───────────────────────────────────────────────────────────
  function handleComplete() {
    const updated = completeTask(task.id);
    if (updated) setTask(updated);
  }

  function handleDelete() {
    if (window.confirm(`Delete "${task.title}"? This cannot be undone.`)) {
      deleteTask(task.id);
      navigate("/tasks");
    }
  }

  function handleEditSubmit(formData) {
    const updated = updateTask(task.id, formData);
    if (updated) setTask(updated);
    setEditMode(false);
  }

  // ── Subtask actions ────────────────────────────────────────────────────────
  function handleAddSubtask(e) {
    e.preventDefault();
    if (!newSubtask.trim()) {
      setSubtaskError("Subtask title is required.");
      return;
    }
    const updated = addSubtask(task.id, newSubtask);
    if (updated) setTask(updated);
    setNewSubtask("");
    setSubtaskError("");
  }

  function handleToggleSubtask(subtaskId) {
    const updated = toggleSubtask(task.id, subtaskId);
    if (updated) setTask(updated);
  }

  function handleDeleteSubtask(subtaskId) {
    const updated = deleteSubtask(task.id, subtaskId);
    if (updated) setTask(updated);
  }

  const subtasksDone  = subtasks.filter((s) => s.completed).length;
  const subtasksTotal = subtasks.length;
  const subtaskPct    = subtasksTotal > 0 ? Math.round((subtasksDone / subtasksTotal) * 100) : 0;

  return (
    <div className="container-fluid">
      {/* ── Breadcrumb ───────────────────────────────────────────────────── */}
      <div className="mb-3">
        <Link to="/tasks" className="text-muted small">&larr; Back to Tasks</Link>
      </div>

      {editMode ? (
        /* ── Edit mode ──────────────────────────────────────────────────── */
        <div className="card border-0 shadow-sm rounded-lg p-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="h5 fw-bold mb-0">Edit Task</h2>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </div>
          <TaskForm
            initialData={task}
            categories={categories}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditMode(false)}
          />
        </div>
      ) : (
        /* ── View mode ──────────────────────────────────────────────────── */
        <div className="row g-4">
          {/* ── Left: main task info ──────────────────────────────────────── */}
          <div className="col-lg-8">
            {/* Task header card */}
            <div className="card border-0 shadow-sm rounded-lg p-4 mb-4">
              {/* Title + action buttons */}
              <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
                <h1 className={`h4 fw-bold mb-0 ${isCompleted ? "text-muted text-decoration-line-through" : ""}`}>
                  {task.title}
                </h1>
                <div className="d-flex gap-2 flex-shrink-0">
                  {!isCompleted && (
                    <>
                      <button
                        className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                        onClick={() => setEditMode(true)}
                      >
                        <FiEdit2 size={13} /> Edit
                      </button>
                      <button
                        className="btn btn-sm btn-success d-flex align-items-center gap-1"
                        onClick={handleComplete}
                      >
                        <FiCheckCircle size={13} /> Complete
                      </button>
                    </>
                  )}
                  <button
                    className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                    onClick={handleDelete}
                  >
                    <FiTrash2 size={13} /> Delete
                  </button>
                </div>
              </div>

              {/* Badges */}
              <div className="d-flex gap-2 flex-wrap mb-3">
                <span className={`badge bg-${statusColor}`}>{task.status}</span>
                <span className={`badge bg-${priorityColor}`} style={{ opacity: 0.85 }}>
                  {task.priority} Priority
                </span>
                {task.category && (
                  <span className="badge bg-light text-dark border">
                    <FiTag size={11} className="me-1" />{task.category}
                  </span>
                )}
                {isOverdue && (
                  <span className="badge bg-danger">Overdue</span>
                )}
              </div>

              {/* Description */}
              {task.description ? (
                <p className="text-muted mb-0">{task.description}</p>
              ) : (
                <p className="text-muted fst-italic small mb-0">No description provided.</p>
              )}
            </div>

            {/* Subtasks card */}
            <div className="card border-0 shadow-sm rounded-lg p-4 mb-4">
              <h2 className="h6 fw-bold mb-3">
                Subtasks
                {subtasksTotal > 0 && (
                  <span className="text-muted fw-normal ms-2 small">
                    {subtasksDone}/{subtasksTotal} completed
                  </span>
                )}
              </h2>

              {/* Progress bar */}
              {subtasksTotal > 0 && (
                <div className="progress mb-3" style={{ height: 6 }}>
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: `${subtaskPct}%` }}
                    aria-valuenow={subtaskPct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
              )}

              {/* Subtask list */}
              {subtasks.length === 0 ? (
                <p className="text-muted small mb-3">No subtasks yet. Add one below.</p>
              ) : (
                <ul className="list-group list-group-flush mb-3">
                  {subtasks.map((sub) => (
                    <li
                      key={sub.id}
                      className="list-group-item px-0 d-flex align-items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        className="form-check-input mt-0 cursor-pointer"
                        checked={sub.completed}
                        onChange={() => handleToggleSubtask(sub.id)}
                        id={`sub-${sub.id}`}
                      />
                      <label
                        htmlFor={`sub-${sub.id}`}
                        className={`flex-grow-1 cursor-pointer mb-0 ${sub.completed ? "text-muted text-decoration-line-through" : ""}`}
                      >
                        {sub.title}
                      </label>
                      <button
                        className="btn btn-sm btn-link text-danger p-0"
                        onClick={() => handleDeleteSubtask(sub.id)}
                        title="Delete subtask"
                        aria-label="Delete subtask"
                      >
                        <FiX size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Add subtask form */}
              {!isCompleted && (
                <form onSubmit={handleAddSubtask} className="d-flex gap-2">
                  <div className="flex-grow-1">
                    <input
                      type="text"
                      className={`form-control form-control-sm ${subtaskError ? "is-invalid" : ""}`}
                      placeholder="Add a subtask…"
                      value={newSubtask}
                      onChange={(e) => {
                        setNewSubtask(e.target.value);
                        setSubtaskError("");
                      }}
                    />
                    {subtaskError && (
                      <div className="invalid-feedback">{subtaskError}</div>
                    )}
                  </div>
                  <button type="submit" className="btn btn-sm btn-primary d-flex align-items-center gap-1">
                    <FiPlus size={13} /> Add
                  </button>
                </form>
              )}
            </div>

            {/* Activity Log card */}
            <div className="card border-0 shadow-sm rounded-lg">
              <div className="card-header bg-white border-bottom py-3">
                <h2 className="h6 fw-bold mb-0">Activity Log</h2>
              </div>
              <div className="card-body p-0">
                {activityLogs.length === 0 ? (
                  <p className="text-muted small p-4 mb-0">No activity recorded yet.</p>
                ) : (
                  <ul className="list-group list-group-flush">
                    {[...activityLogs]
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .map((log) => (
                        <li key={log.id} className="list-group-item px-4 py-2">
                          <div className="d-flex justify-content-between align-items-start gap-2">
                            <div>
                              <span className="fw-semibold small">{log.action}</span>
                              <p className="text-muted-sm mb-0">{log.description}</p>
                            </div>
                            <span className="text-muted-sm flex-shrink-0">
                              {formatDateTime(log.createdAt)}
                            </span>
                          </div>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* ── Right: task metadata ──────────────────────────────────────── */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-lg p-4">
              <h2 className="h6 fw-bold mb-3">Task Details</h2>

              <dl className="row g-0 mb-0">
                {/* Due Date */}
                <dt className="col-5 text-muted small d-flex align-items-center gap-1 mb-2">
                  <FiCalendar size={13} /> Due Date
                </dt>
                <dd className={`col-7 small mb-2 fw-semibold ${isOverdue ? "text-danger" : ""}`}>
                  {task.dueDate || "—"}
                  {isOverdue && <span className="ms-1 badge bg-danger" style={{fontSize:"0.6rem"}}>Overdue</span>}
                </dd>

                {/* Due Time */}
                <dt className="col-5 text-muted small d-flex align-items-center gap-1 mb-2">
                  <FiClock size={13} /> Due Time
                </dt>
                <dd className="col-7 small mb-2 fw-semibold">
                  {task.dueTime || "—"}
                </dd>

                {/* Reminder */}
                <dt className="col-5 text-muted small d-flex align-items-center gap-1 mb-2">
                  <FiBell size={13} /> Reminder
                </dt>
                <dd className="col-7 small mb-2 fw-semibold">
                  {task.reminderDate || "—"}
                </dd>

                {/* Repeat */}
                <dt className="col-5 text-muted small d-flex align-items-center gap-1 mb-2">
                  <FiRepeat size={13} /> Repeat
                </dt>
                <dd className="col-7 small mb-2 fw-semibold">
                  {task.repeatInterval || "None"}
                </dd>

                <hr className="my-2" />

                {/* Created */}
                <dt className="col-5 text-muted small mb-2">Created</dt>
                <dd className="col-7 small mb-2">{formatDate(task.createdAt)}</dd>

                {/* Updated */}
                <dt className="col-5 text-muted small mb-2">Updated</dt>
                <dd className="col-7 small mb-2">{formatDate(task.updatedAt)}</dd>

                {/* Completed */}
                {task.completedAt && (
                  <>
                    <dt className="col-5 text-muted small mb-2">Completed</dt>
                    <dd className="col-7 small mb-2 text-success fw-semibold">
                      {formatDate(task.completedAt)}
                    </dd>
                  </>
                )}
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskDetails;
