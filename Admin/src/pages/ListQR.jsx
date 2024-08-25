import { useEffect, useState } from "react";
import dateToNow from "../utils/dateToNow";
import Modal from "react-modal";
import {
    getPaginatedQRCodes,
    deleteQrCode,
    changeQRStatus,
    updateQrCode,
} from "../services/admin.service";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons'; // Import the icons you need

const Dashboard = () => {
    const [profileID, setProfileID] = useState("");
    const [qrID, setQRID] = useState("");
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastDoc, setLastDoc] = useState(null);
    const [firstDoc, setFirstDoc] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const [update, setUpdate] = useState({
        id: "",
        profile_id: "",
    });
    const [showDefinedProfiles, setShowDefinedProfiles] = useState(true);

    const fetchProfiles = async () => {
        try {
            setLoading(true);
            const { data, last, first } = await getPaginatedQRCodes();
            setProfiles(data);
            setLastDoc(last);
            setFirstDoc(first);
            setLoading(false);
            if (!last) {
                setHasMore(false);
            }
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleNext = async () => {
        try {
            setLoading(true);
            const { data, last, first } = await getPaginatedQRCodes(
                20,
                "next",
                lastDoc,
                null
            );
            setPage((prev) => prev + 1);
            setProfiles(data);
            setLastDoc(last);
            setFirstDoc(first);
            setLoading(false);
            if (!last) {
                setHasMore(false);
            }
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    const handlePrevious = async () => {
        try {
            setHasMore(true);
            setLoading(true);
            const { data, last, first } = await getPaginatedQRCodes(
                20,
                "previous",
                null,
                firstDoc
            );
            setPage((prev) => prev - 1);

            setProfiles(data);
            setLastDoc(last);
            setFirstDoc(first);
            setLoading(false);
            if (!last) {
                setHasMore(false);
            }
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            if (
                !window.confirm("Are you sure you want to delete this profile?")
            )
                return;
            if (
                !window.confirm(
                    "This action is irreversible. Are you sure you want to delete this profile?"
                )
            )
                return;
            const res = await deleteQrCode(id);
            if (res) {
                fetchProfiles();
            }
        } catch (error) {
            console.log(error);
        }
    };
    
    const handleEdit = async (id, profile_id) => {
        setIsOpen(!isOpen);
        setUpdate({
            id: id,
            profile_id: profile_id,
        });
        console.log("edit modal: " + id + " " + profile_id);
    };

    const updateProfileId = async () => {
        try {
            console.log(
                "update Profile " + update.id + " " + update.profile_id
            );
            const res = await updateQrCode(update.id, update.profile_id);
            setIsOpen(!isOpen);
            console.log(res);
            if (res) {
                fetchProfiles();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const filterByType = async (type, value) => {
        try {
            console.log("Filter Type:", type);
            console.log("Filter Value:", value);
            setLoading(true);
    
            if (!value) return;
    
            const filters = {
                profileID: { profile_id: value },
                qrID: { qr_id: value }
            };
    
            const filter = filters[type];
    
            if (!filter) {
                console.error("Invalid filter type");
                setLoading(false);
                return;
            }
    
            const { data } = await getPaginatedQRCodes(
                20,
                "next",
                null,
                null,
                filter.profile_id || null,
                filter.qr_id || null
            );
    
            setProfiles(data);
            setLastDoc(null);
            setFirstDoc(null);
            setLoading(false);
            setPage(1);
            setHasMore(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };
        
    useEffect(() => {
        fetchProfiles();
    }, []);

    const toggleProfiles = () => {
        setShowDefinedProfiles(!showDefinedProfiles);
    };

    const filteredProfiles = profiles.filter(profile => {
        // Check for valid profile_id and qr_id
        const profileId = (profile.profile_id || "").toLowerCase();  
        const qrId = (profile.qr_id || "").toLowerCase();           
    
        const hasProfileId = Boolean(profile.profile_id);
    
        // Convert search terms to lowercase
        const searchProfileID = profileID?.toLowerCase() || "";
        const searchQrID = qrID?.toLowerCase() || "";
    
        if (showDefinedProfiles) {
            // Show profiles with a profile_id when toggle is on
            if (!hasProfileId) return false;
        } else {
            // Show profiles without a profile_id when toggle is off
            if (hasProfileId) return false;
        }
    
        // Apply additional filtering based on profileID and qrID, case-insensitive
        if (searchProfileID && searchQrID) {
            return profileId.includes(searchProfileID) && qrId.includes(searchQrID);
        } else if (searchProfileID) {
            return profileId.includes(searchProfileID);
        } else if (searchQrID) {
            return qrId.includes(searchQrID);
        } else {
            return true; // Show all if no filter is applied
        }
    });
    
    
    return (
        <div>
            {/* filter data by userID input */}
            <div>
                <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                            QR Code List
                        </h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <input
                                type="text"
                                placeholder="Search by profileID"
                                className="rounded-lg border border-gray-200 p-1 text-sm  focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                value={profileID}
                                onChange={(e) => setProfileID(e.target.value)}
                            />
                            <button
                                onClick={() => filterByType("profileID", profileID)}
                                className="ml-2 rounded-lg bg-primary px-2 py-1 text-xs text-white"
                            >
                                Search
                            </button>
                        </div>

                        <div className="flex items-center space-x-4">
                            <input
                                type="text"
                                placeholder="Search by QRID"
                                className="rounded-lg border border-gray-200 p-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                value={qrID}
                                onChange={(e) => setQRID(e.target.value)}
                            />
                            <button
                                onClick={() => filterByType("qrID", qrID)}
                                className="ml-2 rounded-lg bg-primary px-2 py-1 text-xs text-white"
                            >
                                Search
                            </button>
                        </div>


                        {/* remove filter button */}
                        <div className="flex items-center">
                            <button
                                onClick={() => fetchProfiles()}
                                className="ml-2 rounded-lg bg-red-500 px-2 py-1 text-xs text-white"
                            >
                                Remove Filter
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-5">
                <div className="relative my-10 overflow-x-auto p-2 shadow-md sm:rounded-lg">
                    <table className="w-full text-left text-sm text-tableText rtl:text-right dark:text-gray-400">
                        <thead className="bg-primary text-xs uppercase text-white dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    QR_ID
                                </th>
                                <th scope="col" className="px-6 py-3 flex items-center">
                                PROFILE_ID   
                                    <button 
                                        onClick={toggleProfiles} 
                                        className="mx-3"
                                    >
                                        <FontAwesomeIcon 
                                            icon={showDefinedProfiles ? faToggleOn : faToggleOff} 
                                            size="2x" 
                                        />
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Last Updated
                                </th>
                                <th scope="col" className="px-8 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        Loading...
                                    </td>
                                </tr>
                            )}
                            {!loading && 
                                filteredProfiles.map((profile) => (
                                    <tr
                                        key={profile.id}
                                        className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                                    >
                                        <th
                                            scope="row"
                                            className="whitespace-nowrap px-6 py-4 font-medium  dark:text-white"
                                        >
                                            {profile.qr_id}
                                        </th>
                                        <th
                                            scope="row"
                                            className="whitespace-nowrap px-6 py-4 font-medium  dark:text-white"
                                        >
                                            <a
                                                className="underline"
                                                href={
                                                    "https://www.app.heartstribute.com/profile/" +
                                                    profile.profile_id
                                                }
                                                target="__blank"
                                            >
                                                {profile.profile_id}
                                            </a>
                                        </th>
                                        <td className="px-6 py-4">
                                            {dateToNow(
                                                profile?.updated_at.seconds
                                            )}
                                        </td>
                                        <td className="px-6 py-4 ">
                                            <div className="grid grid-cols-3">
                                                <button
                                                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                                                    onClick={() =>
                                                        handleEdit(
                                                            profile.id,
                                                            profile.profile_id
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="font-medium text-red-600 hover:underline dark:text-red-500"
                                                    onClick={() =>
                                                        handleDelete(profile.id)
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            {!loading && profiles.length == 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center">
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
                        <div></div>
                        <ul className="inline-flex h-8 -space-x-px self-end text-sm rtl:space-x-reverse">
                            <li>
                                <button
                                    onClick={handlePrevious}
                                    className={`flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 ms-0 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                                        page == 1 ? "cursor-not-allowed" : ""
                                    }`}
                                    disabled={page == 1}
                                >
                                    Previous
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={handleNext}
                                    className={`flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                                        !hasMore ? "cursor-not-allowed" : ""
                                    }`}
                                    disabled={lastDoc == null}
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            <Modal
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                shouldCloseOnOverlayClick={false}
                className="fixed inset-0 z-50 flex items-center justify-center"
            >
                <div
                    className="border-black relative flex w-1/3 flex-col gap-4 rounded-md border bg-white p-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute right-2 top-2"
                    >
                        <img
                            src="/images/close.png"
                            alt="Close"
                            className="h-5 w-5"
                        />
                    </button>
                    <label htmlFor="profileID" className="mt-4">
                        Profile Id
                    </label>
                    <input
                        type="text"
                        name="profileID"
                        className="rounded-md border border-gray-900 px-2 py-1"
                        onChange={(e) =>
                            setUpdate({
                                id: update.id,
                                profile_id: e.target.value,
                            })
                        }
                        value={update.profile_id}
                        placeholder="Write your new profile id"
                        id=""
                    />
                    <button
                        onClick={() => updateProfileId()}
                        className="mx-auto w-fit rounded-md bg-primary px-2 py-1 text-white"
                    >
                        Submit
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Dashboard;
