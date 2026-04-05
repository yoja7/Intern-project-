/**
 * Loader — centered spinner for loading states.
 * Props:
 *   message: optional text shown below the spinner
 */
function Loader({ message = "Loading..." }) {
  return (
    <div className="flex-center py-5">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted small">{message}</p>
      </div>
    </div>
  );
}

export default Loader;
