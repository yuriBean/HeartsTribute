import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "../../components/sidebar";
import routes from "../../routes";

export default function Admin(props) {
    const { ...rest } = props;
    const location = useLocation();
    const [open, setOpen] = React.useState(true);
    const [currentRoute, setCurrentRoute] = React.useState("Main Dashboard");

    React.useEffect(() => {
        window.addEventListener("resize", () =>
            window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
        );
    }, []);
    React.useEffect(() => {
        getActiveRoute(routes);
    }, [location.pathname]);

    const getActiveRoute = (routes) => {
        let activeRoute = "Main Dashboard";
        for (let i = 0; i < routes.length; i++) {
            if (
                window.location.href.indexOf(
                    routes[i].layout + "/" + routes[i].path
                ) !== -1
            ) {
                setCurrentRoute(routes[i].name);
            }
        }
        return activeRoute;
    };
    const getRoutes = (routes) => {
        return routes.map((prop, key) => {
            if (prop.layout === "/admin") {
                return (
                    <Route
                        path={`/${prop.path}`}
                        element={prop.component}
                        key={key}
                    />
                );
            } else {
                return null;
            }
        });
    };

    document.documentElement.dir = "ltr";
    return (
        <div className="flex h-full w-full">
            <Sidebar open={open} onClose={() => setOpen(false)} />
            {/* Navbar & Main Content */}
            <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
                {/* Main Content */}
                <main
                    className={`mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]`}
                >
                    {/* Routes */}
                    <div className="h-full">
                        <div className="pt-5s mx-auto mb-auto h-full min-h-screen p-2 md:pr-2">
                            {/* hamburger */}
                            <div className="flex items-center justify-between">
                                <div className="xl:hidden">
                                    <button
                                        onClick={() => setOpen(!open)}
                                        className="text-2xl text-navy-800 dark:text-white"
                                    >
                                        {open ? "X" : "☰"}
                                    </button>
                                </div>
                            </div>

                            <Routes>
                                {getRoutes(routes)}

                                <Route
                                    path="/"
                                    element={
                                        <Navigate to="/admin/default" replace />
                                    }
                                />
                            </Routes>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
