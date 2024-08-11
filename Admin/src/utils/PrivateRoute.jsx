import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import {useAuth} from "./AuthContext"

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        // Render a loading indicator or placeholder while loading the auth state
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/sign-in" />;
    }

    return children ? children : <Outlet />;
};

export default PrivateRoute;
