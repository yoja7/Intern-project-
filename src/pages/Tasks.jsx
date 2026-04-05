import { useState, useMemo } from "react";
import { FiPlus, FiSearch, FiFilter, FiX, FiShare2 } from "react-icons/fi";

import { getCurrentUser } from "../utils/authHelpers";
import {
  getTasksByUser,
  getCategoriesByUser,
  addTask,
  updateTask,
  deleteTask,
  completeTask,
  filterTasks,
  searchTasks,
  getTodayTasks,
} from "../utils/taskHelpers";
import { shareTodayTasks } from "../utils/shareHelpers";

import TaskCard   from "../components/TaskCard";
import TaskForm   from "../components/TaskForm";
import EmptyState from "../components/EmptyState";

const PRIORITIES = ["All", "Low", "Medium", "High"];
const STATUSES   = ["All", "Pending", "In Progress", "Completed"];

function Tasks() {
  const currentUser = getCurrentUser();
  const userId      = currentUser?.id;

  // ── Data state ─────────────────────────────────────────────────────────────
  const [tasks,      setTasks]      = useState(() => getTasksByUser(userId));
  const [categories, setCategories] = useState(() => getCategoriesByUser(userId));

  // ── Modal state ────────────────────────────────────────────────────────────
  const [showModal,   setShowModal]   = useState(false);
  const [editingTask, setEditingTask] = useState(null); // null = create mode

  // ── Search & filter state ──────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    priority: "All",
    status:   "All",
    category: "All",
    dateFrom: "",
    dateTo:   "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [shareMsg,    setShareMsg]    = useState("");

  // ── Derived: category names list ───────────────────────────────────────────
  const categoryNames = useMemo(
    () => categories.map((c) => c.name),
    [categories]
  );

  // ── Derived: filtered + searched tasks ────────────────────────────────────
  const displayedTasks = useMemo(() => {
    let result = filterTasks(tasks, filters);
    result = searchTasks(result, searchQuery);
    return result;
  }, [tasks, filters, searchQuery]);

  // ── Reload tasks from localStorage ────────────────────────────────────────
  function reloadTasks() {
    setTasks(getTasksByUser(userId));
    setCategories(getCategoriesByUser(userId));
  }

  // ── CRUD handlers ──────────────────────────────────────────────────────────
  function handleOpenCreate() {
    setEditingTask(null);
    setShowModal(true);
  }

  function handleOpenEdit(task) {
    setEditingTask(task);
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    setEditingTask(null);
  }

  function handleFormSubmit(formData) {
    if (editingTask) {
      updateTask(editingTask.id, formData);
    } else {
      addTask(userId, formData);
    }
    reloadTasks();
    handleCloseModal();
  }

  function handleDelete(task) {
    if (window.confirm(`Delete "${task.title}"? This cannot be undone.`)) {
      deleteTask(task.id);
      reloadTasks();
    }
  }

  function handleComplete(task) {
    completeTask(task.id);
    reloadTasks();
  }

  // ── Filter helpers ─────────────────────────────────────────────────────────
  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function clearFilters() {
    setFilters({ priority: "All", status: "All", category: "All", dateFrom: "", dateTo: "" });
    setSearchQuery("");
  }

  const hasActiveFilters =
    searchQuery ||
    filters.priority !== "All" ||
    filters.status   !== "All" ||
    filters.category !== "All" ||
    filters.dateFrom ||
    filters.dateTo;

  // ── Share today's tasks ────────────────────────────────────────────────────
  async function handleShare() {
    const todayTasks = getTodayTasks(tasks);
    const result = await shareTodayTasks(todayTasks);
    if (result.method !== "cancelled") {
      setShareMsg(result.message);
      setTimeout(() => setShareMsg(""), 3000);
    }
  }

  return (
    <div className="container-fluid">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h1 className="h3 fw-bold mb-0">Tasks</h1>
          <p className="text-muted small mb-0">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <div className="d-flex gap-2 align-items-center flex-wrap">
          {shareMsg && <span className="badge bg-success px-3 py-2">{shareMsg}</span>}
          <button
            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
            onClick={handleShare}
            title="Share today's tasks"
          >
            <FiShare2 size={14} />
            Share Today
          </button>
          <button
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={handleOpenCreate}
          >
            <FiPlus size={16} />
            New Task
          </button>
        </div>
      </div>

      {/* ── Search + Filter bar ───────────────────────────────────────────── */}
      <div className="card border-0 shadow-sm rounded-lg p-3 mb-4">
        <div className="d-flex gap-2 flex-wrap align-items-center">
          {/* Search */}
          <div className="input-group flex-grow-1" style={{ minWidth: 200 }}>
            <span className="input-group-text bg-white border-end-0">
              <FiSearch size={15} className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Search tasks…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Toggle filters */}
          <button
            className={`btn btn-sm ${showFilters ? "btn-primary" : "btn-outline-secondary"} d-flex align-items-center gap-1`}
            onClick={() => setShowFilters((v) => !v)}
          >
            <FiFilter size={14} />
            Filters
            {hasActiveFilters && (
              <span className="badge bg-danger ms-1" style={{ fontSize: "0.6rem" }}>!</span>
            )}
          </button>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
              onClick={clearFilters}
            >
              <FiX size={14} />
              Clear
            </button>
          )}
        </div>

        {/* Expanded filter row */}
        {showFilters && (
          <div className="row g-2 mt-3">
            <div className="col-sm-6 col-md-3">
              <label className="form-label small mb-1">Priority</label>
              <select
                name="priority"
                className="form-select form-select-sm"
                value={filters.priority}
                onChange={handleFilterChange}
              >
                {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="col-sm-6 col-md-3">
              <label className="form-label small mb-1">Status</label>
              <select
                name="status"
                className="form-select form-select-sm"
                value={filters.status}
                onChange={handleFilterChange}
              >
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-sm-6 col-md-3">
              <label className="form-label small mb-1">Category</label>
              <select
                name="category"
                className="form-select form-select-sm"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="All">All</option>
                {categoryNames.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-sm-6 col-md-3">
              <label className="form-label small mb-1">Due From</label>
              <input
                type="date"
                name="dateFrom"
                className="form-control form-control-sm"
                value={filters.dateFrom}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-sm-6 col-md-3">
              <label className="form-label small mb-1">Due To</label>
              <input
                type="date"
                name="dateTo"
                className="form-control form-control-sm"
                value={filters.dateTo}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Task list ─────────────────────────────────────────────────────── */}
      {displayedTasks.length === 0 ? (
        <EmptyState
          title={hasActiveFilters ? "No tasks match your filters" : "No tasks yet"}
          message={
            hasActiveFilters
              ? "Try adjusting your search or filters."
              : "Click 'New Task' to create your first task."
          }
          action={
            hasActiveFilters
              ? { label: "Clear Filters", onClick: clearFilters }
              : { label: "New Task", onClick: handleOpenCreate }
          }
        />
      ) : (
        <div>
          {displayedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              onComplete={handleComplete}
            />
          ))}
          <p className="text-muted small text-center mt-3">
            Showing {displayedTasks.length} of {tasks.length} tasks
          </p>
        </div>
      )}

      {/* ── Task Form Modal ───────────────────────────────────────────────── */}
      {showModal && (
        <>
          {/* Backdrop */}
          <div
            className="modal-backdrop fade show"
            onClick={handleCloseModal}
            style={{ zIndex: 1040 }}
          />
          {/* Modal */}
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            style={{ zIndex: 1050 }}
            aria-modal="true"
          >
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">
                    {editingTask ? "Edit Task" : "New Task"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">
                  <TaskForm
                    initialData={editingTask || {}}
                    categories={categoryNames}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCloseModal}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Tasks;
