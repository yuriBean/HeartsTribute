import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Spinner from "../components/Common/Spinner";

const CheckAuth = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }
  if (user) {
    return <Navigate to="/" />;
  }

  return children ? children : <Outlet />;
};

export default CheckAuth;
