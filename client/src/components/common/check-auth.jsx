import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const path = location.pathname;

  console.log("Current path:", path, "Authenticated:", isAuthenticated);

  // Redirect to login if user tries to access checkout without authentication
  if (path === "/shop/checkout" && !isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: path }} replace />;
  }

  // Restrict access to admin dashboard for unauthenticated users
  if (path.startsWith("/admin")) {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" state={{ from: path }} replace />;
    }

    if (user?.role !== "admin") {
      return <Navigate to="/unauth-page" replace />;
    }
  }

  // Prevent authenticated users from visiting login/register again
  if (
    isAuthenticated &&
    (path.includes("/auth/login") || path.includes("/auth/register"))
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/shop/home" replace />;
    }
  }

  return <>{children}</>;
}

export default CheckAuth;
