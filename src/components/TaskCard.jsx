import { Link } from "react-router-dom";
import { FiCalendar, FiClock, FiEye, FiEdit2, FiTrash2, FiCheckCircle } from "react-icons/fi";

// ─── Badge helpers ────────────────────────────────────────────────────────────
const PRIORITY_BADGE = {
  High:   "danger",
  Medium: "warning",
  Low:    "success",
};

const STATUS_BADGE = {
  "Completed":  "success",
  "In Progress": "primary",
  "Pending":    "secondary",
};

/**
 * TaskCard — displays a single task summary with action buttons.
 *
 * Props:
 *   task        — task object
 *   onEdit(task)    — called when Edit is clicked
 *   onDelete(task)  — called when Delete is clicked
 *   onComplete(task)— called when Mark Complete is clicked
 */
function TaskCard({ task, onEdit, onDelete, onComplete }) {
  if (!task) return null;

  const isCompleted   = task.status === "Completed";
  const priorityColor = PRIORITY_BADGE[task.priority] || "secondary";
  const statusColor   = STATUS_BADGE[task.status]     || "secondary";

  // Detect overdue: has a dueDate, not completed, and dueDate is before today
  const todayStr = new Date().toISOString().split("T")[0];
  const isOverdue = task.dueDate && task.dueDate < todayStr && !isCompleted;

  return (
    <div className={`task-card mb-3 ${isCompleted ? "opacity-75" : ""}`}>
      <div className="d-flex align-items-start justify-content-between gap-2">
        {/* ── Left: task info ─────────────────────────────────────────────── */}
        <div className="flex-grow-1 min-w-0">
          {/* Title */}
          <Link
            to={`/tasks/${task.id}`}
            className={`fw-semibold text-decoration-none ${isCompleted ? "text-muted text-decoration-line-through" : "text-dark"}`}
          >
            {task.title}
          </Link>

          {/* Description preview */}
          {task.description && (
            <p className="text-muted-sm mt-1 mb-2 text-truncate">{task.description}</p>
          )}

          {/* Meta row */}
          <div className="d-flex align-items-center gap-3 flex-wrap mt-1">
            {/* Category */}
            {task.category && (
              <span className="badge bg-light text-dark border small">
                {task.category}
              </span>
            )}

            {/* Priority */}
            <span className={`badge bg-${priorityColor} small`} style={{ opacity: 0.85 }}>
              {task.priority}
            </span>

            {/* Due date */}
            {task.dueDate && (
              <span className={`text-muted-sm d-flex align-items-center gap-1 ${isOverdue ? "text-danger fw-semibold" : ""}`}>
                <FiCalendar size={12} />
                {task.dueDate}
                {isOverdue && <span className="ms-1 badge bg-danger" style={{fontSize:"0.65rem"}}>Overdue</span>}
              </span>
            )}

            {/* Due time */}
            {task.dueTime && (
              <span className="text-muted-sm d-flex align-items-center gap-1">
                <FiClock size={12} />
                {task.dueTime}
              </span>
            )}
          </div>
        </div>

        {/* ── Right: status badge + actions ───────────────────────────────── */}
        <div className="d-flex flex-column align-items-end gap-2 flex-shrink-0">
          <span className={`badge bg-${statusColor}`}>{task.status}</span>

          {/* Action buttons */}
          <div className="d-flex gap-1">
            <Link
              to={`/tasks/${task.id}`}
              className="btn btn-sm btn-outline-secondary"
              title="View"
            >
              <FiEye size={13} />
            </Link>

            {!isCompleted && onEdit && (
              <button
                className="btn btn-sm btn-outline-primary"
                title="Edit"
                onClick={() => onEdit(task)}
              >
                <FiEdit2 size={13} />
              </button>
            )}

            {!isCompleted && onComplete && (
              <button
                className="btn btn-sm btn-outline-success"
                title="Mark Complete"
                onClick={() => onComplete(task)}
              >
                <FiCheckCircle size={13} />
              </button>
            )}

            {onDelete && (
              <button
                className="btn btn-sm btn-outline-danger"
                title="Delete"
                onClick={() => onDelete(task)}
              >
                <FiTrash2 size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Subtask progress bar (if task has subtasks) */}
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="mt-2">
          {(() => {
            const done  = task.subtasks.filter((s) => s.completed).length;
            const total = task.subtasks.length;
            const pct   = Math.round((done / total) * 100);
            return (
              <>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted-sm">Subtasks</span>
                  <span className="text-muted-sm">{done}/{total}</span>
                </div>
                <div className="progress" style={{ height: 4 }}>
                  <div
                    className="progress-bar bg-primary"
                    role="progressbar"
                    style={{ width: `${pct}%` }}
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}

export default TaskCard;
