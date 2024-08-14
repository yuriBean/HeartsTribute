import React, { useState } from "react";

export default function UnusedIDsTable({ ids, usedIds, loading = false }) {
    const [currentPage, setCurrentPage] = useState(1);
    const idsPerPage = 20;

    // Filter out used IDs
    const unusedIds = ids.filter(idObj => !usedIds.includes(idObj.id));

    // Calculate total pages
    const totalPages = Math.ceil(unusedIds.length / idsPerPage);

    // Calculate the starting and ending index of the ids to display
    const startIdx = (currentPage - 1) * idsPerPage;
    const endIdx = startIdx + idsPerPage;
    const currentIds = unusedIds.slice(startIdx, endIdx);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="mt-5">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                Unused ID's
            </h1>
            <div className="relative my-10 overflow-x-auto p-2 shadow-md sm:rounded-lg">
                <table className="w-full text-left text-sm text-tableText rtl:text-right dark:text-gray-400">
                    <thead className="bg-primary text-xs uppercase text-white dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                #
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Unused ID
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Date Created
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan="3" className="text-center">
                                    Loading...
                                </td>
                            </tr>
                        )}
                        {!loading &&
                            currentIds.map((idObj, index) => (
                                <tr key={index}>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {startIdx + index + 1}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {idObj.id}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        {new Date(idObj.dateCreated).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        {!loading && unusedIds.length === 0 && (
                            <tr>
                                <td colSpan="3" className="text-center">
                                    No data found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <nav
                    className="flex-column flex flex-wrap items-center justify-between pt-4 md:flex-row"
                    aria-label="Table navigation"
                >
                    <ul className="inline-flex items-center -space-x-px">
                        <li>
                            <button
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage === 1}
                                className="ml-0 rounded-l-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            >
                                Previous
                            </button>
                        </li>
                        <li>
                            <span className="px-3 py-2 leading-tight text-gray-500 dark:text-gray-400">
                                Page {currentPage} of {totalPages}
                            </span>
                        </li>

                        <li>
                            <button
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                disabled={currentPage === totalPages}
                                className="rounded-r-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            >
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}