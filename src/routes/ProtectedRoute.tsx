import { Navigate } from "react-router";
import { type JSX } from "react";

interface ProtectedRouteProps {
  element: JSX.Element;
  reverse?: boolean; // if true, redirect authenticated users away from login
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, reverse = false }) => {
  const isAuthenticated = !!localStorage.getItem('token');

  if (!isAuthenticated) {
    localStorage.clear();
  }

  if (reverse) {
    // e.g., User is authenticated and tries to visit login → redirect them
    return isAuthenticated ? <Navigate to="/" replace /> : element;
  }

  // Regular protected route
  return isAuthenticated ? element : <Navigate to="/" replace />;
};

export default ProtectedRoute;