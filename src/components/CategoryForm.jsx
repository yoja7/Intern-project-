import { useState } from "react";

/**
 * CategoryForm — controlled form for creating or editing a category.
 *
 * Props:
 *   onSubmit(name)  — called with the category name string
 *   onCancel()      — called when Cancel is clicked
 *   initialName     — existing name when editing (optional)
 */
function CategoryForm({ onSubmit, onCancel, initialName = "" }) {
  const [name, setName]   = useState(initialName);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }
    onSubmit(name.trim());
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-3">
        <label htmlFor="cat-name" className="form-label">
          Category Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          id="cat-name"
          className={`form-control ${error ? "is-invalid" : ""}`}
          placeholder="e.g. Work, Personal, Health"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          autoFocus
        />
        {error && <div className="invalid-feedback">{error}</div>}
      </div>

      <div className="d-flex gap-2 justify-content-end">
        {onCancel && (
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary btn-sm">
          {initialName ? "Update Category" : "Add Category"}
        </button>
      </div>
    </form>
  );
}

export default CategoryForm;
