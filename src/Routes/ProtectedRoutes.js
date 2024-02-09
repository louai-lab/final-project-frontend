import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({
  isAllowed,
  children,
  redirectPath = "/login",
  isError = false,
}) {
  // console.log(isAllowed)
  if (isError) {
    return <Navigate to="./network_error" replace />;
  } else if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }
  return children ? children : <Outlet />;
}

export default ProtectedRoute;
