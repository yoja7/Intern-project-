import { Outlet } from "react-router-dom";

/**
 * MainLayout — used for public pages (Home, auth pages).
 * Renders child routes via <Outlet />.
 */
function MainLayout() {
  return (
    <div className="page-wrapper">
      <Outlet />
    </div>
  );
}

export default MainLayout;
