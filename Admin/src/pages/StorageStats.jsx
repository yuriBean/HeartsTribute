import React, { useEffect, useState } from "react";
import { getStorageStats } from "../services/stats.service";

export default function StorageStats() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const fetchStats = async () => {
        try {
            setLoading(true);
            const data = await getStorageStats();
            setStats(data);
            setLoading(false);
        } catch (error) {}
    };

    useEffect(() => {
        fetchStats();
    }, []);
    return (
        <div>
            {/* filter data by username input */}
            <div>
                <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                            Firebase Cloud Storage Stats
                        </h1>
                    </div>
                </div>
                <div className="mt-5">
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="h-20 w-20 animate-spin rounded-full border-t-2 border-b-2 border-gray-900"></div>
                        </div>
                    ) : (
                        <div className="mb-8 grid gap-y-6  grid-cols-1">
                            <div className="shadow-xs flex items-center rounded-lg  md:md:w-1/3 bg-white p-4 dark:bg-gray-800">
                                <div className="mr-4 rounded-full bg-blue-100 p-3 text-blue-500 dark:bg-blue-500 dark:text-blue-100">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        className="h-5 w-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        ></path>
                                    </svg>
                                </div>
                                <div>
                                    <p
                                        className="font -medium mb-2
                                    text-sm text-gray-600 dark:text-gray-400"
                                    >
                                        Total Storage Used
                                    </p>
                                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                        {/* round of to 2 decimal places*/}
                                        {stats?.storage_used.toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                            <div className="shadow-xs flex items-center rounded-lg md:w-1/3 bg-white p-4 dark:bg-gray-800">
                                <div className="mr-4 rounded-full bg-orange-100 p-3 text-orange-500 dark:bg-orange-500 dark:text-orange-100">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        className="h-5 w-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        ></path>
                                    </svg>
                                </div>
                                <div>
                                    <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Total Files
                                    </p>
                                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                        {stats?.no_of_files}
                                    </p>
                                </div>
                            </div>

                            <div className="shadow-xs flex items-center rounded-lg md:w-1/3 bg-white p-4 dark:bg-gray-800">
                                <div className="mr-4 rounded-full bg-green-100 p-3 text-green-500 dark:bg-green-500 dark:text-green-100">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        className="h-5 w-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        ></path>
                                    </svg>
                                </div>
                                <div>
                                    <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Total Images
                                    </p>
                                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                        {stats?.no_of_images}
                                    </p>
                                </div>
                            </div>
                            {/* no_of_qr_codes */}
                            <div className="shadow-xs flex items-center rounded-lg md:w-1/3 bg-white p-4 dark:bg-gray-800">
                                <div className="mr-4 rounded-full bg-red-100 p-3 text-red-500 dark:bg-red-500 dark:text-red-100">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        className="h-5 w-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        ></path>
                                    </svg>
                                </div>
                                <div>
                                    <p
                                        className="font -medium mb-2
                                    text-sm text-gray-600 dark:text-gray-400"
                                    >
                                        Total QR Codes
                                    </p>
                                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                        {stats?.no_of_qr_codes}
                                    </p>
                                </div>
                            </div>
                        </div>
                        // no_of_images
                    )}
                </div>
            </div>
        </div>
    );
}
