import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiTag } from "react-icons/fi";

import { getCurrentUser }  from "../utils/authHelpers";
import {
  getCategoriesByUser,
  addCategory,
  updateCategory,
  deleteCategory,
  getTasksByUser,
} from "../utils/taskHelpers";

import CategoryForm from "../components/CategoryForm";
import EmptyState   from "../components/EmptyState";

function Categories() {
  const currentUser = getCurrentUser();
  const userId      = currentUser?.id;

  const [categories, setCategories] = useState(() => getCategoriesByUser(userId));
  // Read tasks once for count display — tasks don't change on this page
  const [tasks] = useState(() => getTasksByUser(userId));

  // Modal state: null = closed, "create" = add mode, category object = edit mode
  const [modalMode, setModalMode] = useState(null);

  function reloadCategories() {
    setCategories(getCategoriesByUser(userId));
  }

  function handleAdd(name) {
    addCategory(userId, name);
    reloadCategories();
    setModalMode(null);
  }

  function handleEdit(name) {
    updateCategory(modalMode.id, name);
    reloadCategories();
    setModalMode(null);
  }

  function handleDelete(cat) {
    // Count tasks using this category
    const taskCount = tasks.filter((t) => t.category === cat.name).length;
    const msg = taskCount > 0
      ? `Delete "${cat.name}"? It is used by ${taskCount} task(s). The tasks will keep their category label but it won't appear in the list.`
      : `Delete category "${cat.name}"?`;

    if (window.confirm(msg)) {
      deleteCategory(cat.id);
      reloadCategories();
    }
  }

  // Count tasks per category
  function taskCount(catName) {
    return tasks.filter((t) => t.category === catName).length;
  }

  return (
    <div className="container-fluid">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h1 className="h3 fw-bold mb-0">Categories</h1>
          <p className="text-muted small mb-0">
            {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
          </p>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => setModalMode("create")}
        >
          <FiPlus size={16} />
          New Category
        </button>
      </div>

      {/* ── Category list ──────────────────────────────────────────────────── */}
      {categories.length === 0 ? (
        <EmptyState
          title="No categories yet"
          message="Create categories to organise your tasks."
          action={{ label: "New Category", onClick: () => setModalMode("create") }}
        />
      ) : (
        <div className="row g-3">
          {categories.map((cat) => (
            <div className="col-sm-6 col-lg-4" key={cat.id}>
              <div className="card border-0 shadow-sm rounded-lg p-3 h-100">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary"
                      style={{ width: 36, height: 36 }}
                    >
                      <FiTag size={16} />
                    </div>
                    <div>
                      <p className="fw-semibold mb-0">{cat.name}</p>
                      <p className="text-muted-sm mb-0">
                        {taskCount(cat.name)} task{taskCount(cat.name) !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="d-flex gap-1">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      title="Edit"
                      onClick={() => setModalMode(cat)}
                    >
                      <FiEdit2 size={13} />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      title="Delete"
                      onClick={() => handleDelete(cat)}
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal ──────────────────────────────────────────────────────────── */}
      {modalMode !== null && (
        <>
          <div
            className="modal-backdrop fade show"
            onClick={() => setModalMode(null)}
            style={{ zIndex: 1040 }}
          />
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            style={{ zIndex: 1050 }}
            aria-modal="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">
                    {modalMode === "create" ? "New Category" : `Edit "${modalMode.name}"`}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setModalMode(null)}
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">
                  <CategoryForm
                    initialName={modalMode === "create" ? "" : modalMode.name}
                    onSubmit={modalMode === "create" ? handleAdd : handleEdit}
                    onCancel={() => setModalMode(null)}
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

export default Categories;
