import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Spinner from "../components/Common/Spinner";

const CheckVerificationOnly = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <Spinner />;
    }

    if (user) {
        if (!user.emailVerified) {
            return <Navigate to="/verify-email" />;
        }
    }

    return children ? children : <Outlet />;
};

export default CheckVerificationOnly;
