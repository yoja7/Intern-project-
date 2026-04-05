import { useState } from "react";

const PRIORITIES      = ["Low", "Medium", "High"];
const STATUSES        = ["Pending", "In Progress", "Completed"];
const REPEAT_INTERVALS = ["None", "Daily", "Weekly", "Monthly", "Yearly"];

/**
 * TaskForm — fully controlled form for creating or editing a task.
 *
 * Props:
 *   onSubmit(formData)  — called with the validated form data object
 *   onCancel()          — called when the user clicks Cancel
 *   initialData         — existing task object when editing (optional)
 *   categories          — array of category name strings for the dropdown
 */
function TaskForm({ onSubmit, onCancel, initialData = {}, categories = [] }) {
  const [formData, setFormData] = useState({
    title:          initialData.title          || "",
    description:    initialData.description    || "",
    category:       initialData.category       || "",
    priority:       initialData.priority       || "Medium",
    status:         initialData.status         || "Pending",
    dueDate:        initialData.dueDate        || "",
    dueTime:        initialData.dueTime        || "",
    reminderDate:   initialData.reminderDate   || "",
    repeatInterval: initialData.repeatInterval || "None",
  });

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the error for this field as the user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function validate() {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required.";
    }
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required.";
    }
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(formData);
  }

  const isEditing = Boolean(initialData.id);

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Title */}
      <div className="mb-3">
        <label htmlFor="tf-title" className="form-label">
          Title <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          id="tf-title"
          name="title"
          className={`form-control ${errors.title ? "is-invalid" : ""}`}
          placeholder="What needs to be done?"
          value={formData.title}
          onChange={handleChange}
        />
        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
      </div>

      {/* Description */}
      <div className="mb-3">
        <label htmlFor="tf-desc" className="form-label">Description</label>
        <textarea
          id="tf-desc"
          name="description"
          className="form-control"
          rows={3}
          placeholder="Add more details (optional)"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      {/* Category + Priority */}
      <div className="row g-3 mb-3">
        <div className="col-sm-6">
          <label htmlFor="tf-category" className="form-label">Category</label>
          <select
            id="tf-category"
            name="category"
            className="form-select"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">— No Category —</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="col-sm-6">
          <label htmlFor="tf-priority" className="form-label">Priority</label>
          <select
            id="tf-priority"
            name="priority"
            className="form-select"
            value={formData.priority}
            onChange={handleChange}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Status + Repeat */}
      <div className="row g-3 mb-3">
        <div className="col-sm-6">
          <label htmlFor="tf-status" className="form-label">Status</label>
          <select
            id="tf-status"
            name="status"
            className="form-select"
            value={formData.status}
            onChange={handleChange}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="col-sm-6">
          <label htmlFor="tf-repeat" className="form-label">Repeat</label>
          <select
            id="tf-repeat"
            name="repeatInterval"
            className="form-select"
            value={formData.repeatInterval}
            onChange={handleChange}
          >
            {REPEAT_INTERVALS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Due Date + Due Time */}
      <div className="row g-3 mb-3">
        <div className="col-sm-6">
          <label htmlFor="tf-dueDate" className="form-label">
            Due Date <span className="text-danger">*</span>
          </label>
          <input
            type="date"
            id="tf-dueDate"
            name="dueDate"
            className={`form-control ${errors.dueDate ? "is-invalid" : ""}`}
            value={formData.dueDate}
            onChange={handleChange}
          />
          {errors.dueDate && <div className="invalid-feedback">{errors.dueDate}</div>}
        </div>
        <div className="col-sm-6">
          <label htmlFor="tf-dueTime" className="form-label">Due Time</label>
          <input
            type="time"
            id="tf-dueTime"
            name="dueTime"
            className="form-control"
            value={formData.dueTime}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Reminder Date */}
      <div className="mb-4">
        <label htmlFor="tf-reminder" className="form-label">Reminder Date</label>
        <input
          type="date"
          id="tf-reminder"
          name="reminderDate"
          className="form-control"
          value={formData.reminderDate}
          onChange={handleChange}
        />
      </div>

      {/* Actions */}
      <div className="d-flex gap-2 justify-content-end">
        {onCancel && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          {isEditing ? "Update Task" : "Create Task"}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
