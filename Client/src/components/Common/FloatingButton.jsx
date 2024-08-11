import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";

export default function FloatingButton() {
    const { user } = useAuth();
    const location = useLocation();

    // Check if user is not logged in or on specific routes
    // const shouldHideButton =
    //     user === null ||
    //     [
    //         "/login",
    //         "/signup",
    //         "/verify-email",
    //         "/complete-registration",
    //         "/forgot-password",
    //     ].includes(location.pathname);

    // if (shouldHideButton) {
    //     return null;
    // }

    return (
        <div className="fixed bottom-4 right-4">
            <button className="rounded-full bg-blue-500 p-3 text-white shadow-lg">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                </svg>
            </button>
        </div>
    );
}
