import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiCalendar } from "react-icons/fi";
import { getCurrentUser } from "../utils/authHelpers";
import { getTasksByUser } from "../utils/taskHelpers";
import EmptyState from "../components/EmptyState";

// ─── Constants ────────────────────────────────────────────────────────────────
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// ─── Priority badge color ─────────────────────────────────────────────────────
const PRIORITY_COLOR = { High: "danger", Medium: "warning", Low: "success" };
const STATUS_COLOR   = { "Completed": "success", "In Progress": "primary", "Pending": "secondary" };

// ─── Helpers ──────────────────────────────────────────────────────────────────
function toYMD(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay(); // 0 = Sunday
}

function Calendar() {
  const currentUser = getCurrentUser();
  const userId      = currentUser?.id;

  const now = new Date();

  // ── State ──────────────────────────────────────────────────────────────────
  const [viewYear,  setViewYear]  = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState(
    toYMD(now.getFullYear(), now.getMonth(), now.getDate())
  );

  // Read tasks into state so the calendar reflects any changes
  const [tasks] = useState(() => getTasksByUser(userId));

  // ── Build a map: "YYYY-MM-DD" → tasks[] ───────────────────────────────────
  const tasksByDate = useMemo(() => {
    const map = {};
    tasks.forEach((task) => {
      if (task.dueDate) {
        if (!map[task.dueDate]) map[task.dueDate] = [];
        map[task.dueDate].push(task);
      }
    });
    return map;
  }, [tasks]);

  // ── Tasks for the selected date ────────────────────────────────────────────
  const selectedTasks = tasksByDate[selectedDate] || [];

  // ── Calendar grid ──────────────────────────────────────────────────────────
  const daysInMonth  = getDaysInMonth(viewYear, viewMonth);
  const firstDayOfWeek = getFirstDayOfWeek(viewYear, viewMonth);
  const todayStr     = toYMD(now.getFullYear(), now.getMonth(), now.getDate());

  // Build array of cells: null = empty leading cell, number = day
  const cells = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // ── Navigation ─────────────────────────────────────────────────────────────
  function prevMonth() {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  }

  function goToToday() {
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setSelectedDate(todayStr);
  }

  return (
    <div className="container-fluid">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <h1 className="h3 fw-bold mb-0">Calendar</h1>
        <button className="btn btn-sm btn-outline-primary" onClick={goToToday}>
          Today
        </button>
      </div>

      <div className="row g-4">
        {/* ── Left: Calendar grid ──────────────────────────────────────────── */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-lg">
            {/* Month navigation */}
            <div className="card-header bg-white border-bottom d-flex align-items-center justify-content-between py-3 px-4">
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={prevMonth}
                aria-label="Previous month"
              >
                <FiChevronLeft size={16} />
              </button>
              <h2 className="h6 fw-bold mb-0">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </h2>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={nextMonth}
                aria-label="Next month"
              >
                <FiChevronRight size={16} />
              </button>
            </div>

            <div className="card-body p-3">
              {/* Day-of-week headers */}
              <div className="calendar-grid mb-1">
                {DAY_NAMES.map((d) => (
                  <div key={d} className="calendar-day-header text-muted-sm text-center fw-semibold py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="calendar-grid">
                {cells.map((day, idx) => {
                  if (day === null) {
                    return <div key={`empty-${idx}`} className="calendar-cell" />;
                  }

                  const dateStr    = toYMD(viewYear, viewMonth, day);
                  const isToday    = dateStr === todayStr;
                  const isSelected = dateStr === selectedDate;
                  const dayTasks   = tasksByDate[dateStr] || [];
                  const hasTask    = dayTasks.length > 0;

                  return (
                    <button
                      key={dateStr}
                      className={[
                        "calendar-cell calendar-day",
                        isToday    ? "calendar-today"    : "",
                        isSelected ? "calendar-selected" : "",
                        hasTask    ? "calendar-has-task" : "",
                      ].join(" ")}
                      onClick={() => setSelectedDate(dateStr)}
                      aria-label={`${dateStr}${hasTask ? `, ${dayTasks.length} task(s)` : ""}`}
                      aria-pressed={isSelected}
                    >
                      <span className="calendar-day-number">{day}</span>
                      {/* Task indicator dots (max 3) */}
                      {hasTask && (
                        <div className="calendar-dots">
                          {dayTasks.slice(0, 3).map((t) => (
                            <span
                              key={t.id}
                              className={`calendar-dot bg-${PRIORITY_COLOR[t.priority] || "secondary"}`}
                              title={t.title}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="card-footer bg-white border-top py-2 px-4">
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <span className="text-muted-sm d-flex align-items-center gap-1">
                  <span className="calendar-dot bg-danger" /> High
                </span>
                <span className="text-muted-sm d-flex align-items-center gap-1">
                  <span className="calendar-dot bg-warning" /> Medium
                </span>
                <span className="text-muted-sm d-flex align-items-center gap-1">
                  <span className="calendar-dot bg-success" /> Low
                </span>
                <span className="text-muted-sm ms-auto">
                  Click a date to see tasks
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Selected date tasks ────────────────────────────────────── */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-lg h-100">
            <div className="card-header bg-white border-bottom py-3 px-4">
              <h2 className="h6 fw-bold mb-0 d-flex align-items-center gap-2">
                <FiCalendar size={15} />
                {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                  weekday: "long", month: "long", day: "numeric",
                })}
              </h2>
              {selectedTasks.length > 0 && (
                <span className="badge bg-primary mt-1">{selectedTasks.length} task{selectedTasks.length !== 1 ? "s" : ""}</span>
              )}
            </div>

            <div className="card-body p-3">
              {selectedTasks.length === 0 ? (
                <EmptyState
                  title="No tasks"
                  message="No tasks scheduled for this date."
                />
              ) : (
                <div>
                  {selectedTasks.map((task) => (
                    <div key={task.id} className="calendar-task-item mb-2">
                      <div className="d-flex align-items-start justify-content-between gap-2">
                        <div className="flex-grow-1 min-w-0">
                          <Link
                            to={`/tasks/${task.id}`}
                            className={`fw-semibold small text-decoration-none ${
                              task.status === "Completed"
                                ? "text-muted text-decoration-line-through"
                                : "text-dark"
                            }`}
                          >
                            {task.title}
                          </Link>
                          <div className="d-flex align-items-center gap-2 mt-1 flex-wrap">
                            {task.dueTime && (
                              <span className="text-muted-sm">🕒 {task.dueTime}</span>
                            )}
                            {task.reminderDate === selectedDate && (
                              <span className="text-muted-sm">🔔 Reminder</span>
                            )}
                          </div>
                        </div>
                        <div className="d-flex flex-column align-items-end gap-1 flex-shrink-0">
                          <span className={`badge bg-${STATUS_COLOR[task.status] || "secondary"} small`}>
                            {task.status}
                          </span>
                          <span className={`badge bg-${PRIORITY_COLOR[task.priority] || "secondary"} small`} style={{ opacity: 0.85 }}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendar;
