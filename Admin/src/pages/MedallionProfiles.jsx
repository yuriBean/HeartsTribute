import { useEffect, useState } from "react";
import dateToNow from "../utils/dateToNow";
import EditProfileForm from "../components/common/EditMedallionProfileForm";
import Modal from "react-modal";
import {
    getPaginatedMedallionProfiles,
    deleteMedallionProfile,
    getProfileWithId,
    getPaginatedQRCodes
} from "../services/admin.service";
import { set } from "date-fns";

const Dashboard = () => {
    const [userID, setUserID] = useState("");
    const [profileID, setProfileID] = useState("");
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastDoc, setLastDoc] = useState(null);
    const [firstDoc, setFirstDoc] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const [currentProfile, setCurrentProfile] = useState(null);
    const [qrCodeMap, setQrCodeMap] = useState({}); // State for QR code mapping

    const fetchProfiles = async (direction) => {
        try {
            setLoading(true);
            const { data, last, first } = await getPaginatedMedallionProfiles();
            const { data: qrCodes } = await getPaginatedQRCodes(); // Fetch QR codes

            const qrCodeMap = {};
            qrCodes.forEach(qr => {
                qrCodeMap[qr.profile_id] = qr.qr_id; // Assuming qr.id is the QR code ID
            });

            setProfiles(data);
            setLastDoc(last);
            setFirstDoc(first);
            setLoading(false);
            if (!last) {
                setHasMore(false);
            }
            setQrCodeMap(qrCodeMap);

            console.log(data, qrCodes);
        } catch (error) {
            console.log(error);
        }
    };

    const handleNext = async () => {
        try {
            setLoading(true);
            const { data, last, first } = await getPaginatedMedallionProfiles(
                10,
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
            const { data, last, first, qrCodes } = await getPaginatedMedallionProfiles(
                10,
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

            console.log(data, qrCodes);
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
            const res = await deleteMedallionProfile(id);
            if (res) {
                fetchProfiles();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = async (profile) => {
        setIsOpen(!isOpen);
        setCurrentProfile(profile);
    };

    const filter = async (type) => {
        try {
            console.log(type);
            setLoading(true);
            if (type == "userID") {
                if (userID == "") return;
                const { data, last, first } =
                    await getPaginatedMedallionProfiles(
                        10,
                        "next",
                        null,
                        null,
                        userID
                    );
                setProfiles(data);
            } else if (type == "profileID") {
                if (profileID == "") return;
                const profile = await getProfileWithId(profileID);
                setProfiles(profile ? [profile] : []);
            }
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

    // const filteredProfiles = profiles.filter((profile) => 
    //     profile.qrids && profile.qrids.some((qrID) => qrID.id.includes(searchTerm))
    // );

    useEffect(() => {
        fetchProfiles();
    }, []);

    return (
        <div>
            {/* filter data by userID input */}
            <div>
                <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                            Medallion Profile
                        </h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <input
                                type="text"
                                placeholder="Search by userID"
                                className="rounded-lg border border-gray-200 p-1 text-sm  focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                value={userID}
                                onChange={(e) => setUserID(e.target.value)}
                            />
                            <button
                                onClick={() => filter("userID")}
                                className="ml-2 rounded-lg bg-primary px-2 py-1 text-xs text-white"
                            >
                                Search
                            </button>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="text"
                                placeholder="Search by profileID"
                                className="rounded-lg border border-gray-200 p-1 text-sm  focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                value={profileID}
                                onChange={(e) => setProfileID(e.target.value)}
                            />
                            <button
                                onClick={() => filter("profileID")}
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
                    <table className="text-black w-full text-left text-sm text-tableText rtl:text-right dark:text-gray-400">
                        <thead className="bg-primary text-xs uppercase text-white dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    ID
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    QR Code ID
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Type
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Last Updated
                                </th>
                                <th scope="col" className="px-6 py-3">
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
                                profiles.map((profile) => (
                                    <tr
                                        key={profile.id}
                                        className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                                    >
                                        <th
                                            scope="row"
                                            className="whitespace-nowrap px-6 py-4 font-medium text-tableText dark:text-white"
                                        >
                                            <a
                                                className="underline"
                                                href={
                                                    "https://www.app.heartstribute.com/profile/" +
                                                    profile.id
                                                }
                                                target="__blank"
                                            >
                                                {profile.id}
                                            </a>
                                        </th>
                                        <th
                                            scope="row"
                                            className="whitespace-nowrap px-6 py-4 font-medium text-tableText dark:text-white"
                                        >
                                            {profile.first_name +
                                                " " +
                                                profile.last_name}
                                        </th>
                                        <td className="px-6 py-4">
                                            {/* {console.log(profile.qr_id)} */}
                                            {qrCodeMap[profile.id] || "No QR Code"} {/* Display corresponding QR Code ID */}
                                        </td>
                                        <td className="px-6 py-4">
                                            {profile.profile_type}
                                        </td>
                                        <td className="px-6 py-4">
                                            {dateToNow(
                                                profile?.updated_at.seconds
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <a
                                                className="mr-4 font-medium text-green-600 hover:underline dark:text-green-500"
                                                href={`/admin/create-qr-code?profile_id=${profile.id}`}
                                            >
                                                Create QR
                                            </a>
                                            <button
                                                className="mr-4 font-medium text-blue-600 hover:underline dark:text-primary"
                                                onClick={() =>
                                                    handleEdit(profile)
                                                }
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="font-medium text-red-600 hover:underline dark:text-primary"
                                                onClick={() =>
                                                    handleDelete(profile.id)
                                                }
                                            >
                                                Delete
                                            </button>
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
                shouldCloseOnOverlayClick={true}
                className="fixed inset-0 z-50 flex items-center justify-center"
            >
                <div className="scrollbar mx-auto h-[95%] w-[95%] overflow-y-auto border bg-white p-4">
                    <EditProfileForm setIsOpen={setIsOpen} profile={currentProfile} />
                </div>
            </Modal>
        </div>
    );
};

export default Dashboard;
