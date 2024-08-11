import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import AdminLayout from "./layouts/admin";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./utils/AuthContext";
import Redirect from "./pages/Redirect";

const routes = [
    {
        path: "sign-in",
        element: <SignIn />,
    },
    {
        element: <PrivateRoute />,
        children: [
            {
                path: "admin/*",
                element: <AdminLayout />,
            },
        ],
    },
    {
        path: "/",
        element: <Navigate to="/sign-in" replace />,
    },
    {
        path: "redirect",
        element: (
            <Redirect />
        ),
    },
];

const router = createBrowserRouter(routes);

const App = () => {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
};

export default App;
