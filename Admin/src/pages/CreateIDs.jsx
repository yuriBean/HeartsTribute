import React, { useState, useEffect } from "react";
import { createExtraIDs, getQRCodeIDs } from "../queries/qrcode";
import { exportCSVData } from "../services/admin.service"
import UnusedIDsTable from "../components/UnusedIDsTable";
import { saveAs } from 'file-saver';  

export default function CreateIDs() {
    const [noOfQRsToGenerate, setNoOfQRsToGenerate] = useState(1);
    const [loading, setLoading] = useState(false);
    const [qrids, setQrids] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [usedIds, setUsedIds] = useState([]); // Define usedIds state

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createExtraIDs(noOfQRsToGenerate);
        alert("New QR ID's generated successfully");
        getQRIds();
    };

    const getQRIds = async () => {
        setLoading(true);
        const qrIds = await getQRCodeIDs();
        setQrids(qrIds.idsAvailable);
        console.log(qrIds);
        setLoading(false);
    };

    const getUsedIds = async () => {
        const fetchedUsedIds = await getUsedQRCodeIDs(); // Fetch used QR IDs
        setUsedIds(fetchedUsedIds.usedIds); // Set the used IDs in state
    };

    useEffect(() => {
        getQRIds();
        getUsedIds();
    }, []);

    const handleDownloadCSV = async () => {
        try {
            const csvBlob = await exportCSVData(qrids); // Pass the qrids to the export function
            saveAs(csvBlob, 'QRCodeIDs.csv');
        } catch (error) {
            console.error("Error downloading CSV:", error);
            alert("Failed to download CSV");
        }
    };
    const filteredQRIDs = qrids.filter(qrID => qrID.id && qrID.id.includes(searchTerm));


    return (
        <div>
            <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center">
                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                        Create New QR IDs
                    </h1>
                </div>
                <button
                    onClick={handleDownloadCSV}
                    className="rounded-md bg-secondary p-2 text-black "
                    style={{ border: 'black 2px solid'}}
                >
                    Download CSV
                </button>
            </div>

            <div className="mx-auto mt-5 w-fit">
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <label htmlFor="noOfQRs">
                           Enter number of QR IDs to generate (0 to 100)
                        </label>
                        <input
                            type="number"
                            id="noOfQRs"
                            value={noOfQRsToGenerate}
                            onChange={(e) =>
                                setNoOfQRsToGenerate(parseInt(e.target.value, 10))
                            }
                            className="mt-2 rounded-md border border-gray-300 p-2"
                            min="0"
                            max="100"
                        />
                        <button
                            type="submit"
                            className="mt-2 rounded-md bg-primary p-2 text-white"
                        >
                            Generate QR IDs
                        </button>
                    </div>
                </form>
            </div>
            <div className="mt-5">
                <input
                    type="text"
                    placeholder="Search for Unique IDs"
                    className="rounded-lg border border-gray-200 p-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="mt-5">
            <UnusedIDsTable ids={qrids} usedIds={usedIds} loading={loading} />
            </div>

        </div>
    );
}
