import { Navigate } from "react-router";
import { useSelector } from "react-redux";
import { type JSX } from "react";
import type { RootState } from "@/redux/store";

interface ProtectedRouteProps {
  element: JSX.Element;
  reverse?: boolean;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  reverse = false,
  adminOnly = false,
}) => {
  const token = localStorage.getItem("token");

  const { grp } = useSelector((state: RootState) => state.AuthSlice.userinfo);

  const isAuthenticated = !!token;
  const isAdmin = grp === 1;

  if (!isAuthenticated) {
    localStorage.clear();
  }

  if (reverse) {
    return isAuthenticated ? <Navigate to="/" replace /> : element;
  }

  if (adminOnly) {
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }

    // if (!isAdmin) {
    //   return <Navigate to="/" replace />;
    // }

    return element;
  }

  return isAuthenticated ? element : <Navigate to="/" replace />;
};

export default ProtectedRoute;
