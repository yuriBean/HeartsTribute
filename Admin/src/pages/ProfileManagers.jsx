import { useEffect, useState } from "react";
import dateToNow from "../utils/dateToNow";

import {
    getPaginatedProfileManagers,
    deleteProfileManager,
    getProfiles 
} from "../services/admin.service";

const ProfileManagers = () => {
    const [email, setEmail] = useState("");
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastDoc, setLastDoc] = useState(null);
    const [firstDoc, setFirstDoc] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [allProfiles, setAllProfiles] = useState([]);

    const fetchProfiles = async (direction) => {
        try {
            setLoading(true);
            const { data, last, first } = await getPaginatedProfileManagers();
            setProfiles(data);
            setLastDoc(last);
            setFirstDoc(first);
            setLoading(false);
            if (!last) {
                setHasMore(false);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };
    
    const fetchAllProfiles = async () => {
        try {
            const profiles = await getProfiles();
            setAllProfiles(profiles);
        } catch (error) {
            console.log(error);
        }
    };

    const handleNext = async () => {
        try {
            setLoading(true);
            const { data, last, first } = await getPaginatedProfileManagers(
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
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const handlePrevious = async () => {
        try {
            setLoading(true);
            const { data, last, first } = await getPaginatedProfileManagers(
                10,
                "previous",
                null,
                firstDoc
            );
            setPage((prev) => Math.max(prev - 1, 1));
            setProfiles(data);
            setLastDoc(last);
            setFirstDoc(first);
            setLoading(false);
            if (!last) {
                setHasMore(false);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            if (!window.confirm("Are you sure you want to delete this profile?")) return;
            if (!window.confirm("This action is irreversible. Are you sure you want to delete this profile?")) return;
            const res = await deleteProfileManager(id);
            if (res) {
                fetchProfiles();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const filterProfilesByEmail = async () => {
        try {
            setLoading(true);
            const trimmedEmail = email.trim(); 
            if (trimmedEmail !== "") {
                const filteredProfiles = allProfiles.filter(profile => profile.email && profile.email.trim().includes(trimmedEmail));
                setProfiles(filteredProfiles);
                setPage(1); 
                setHasMore(false); 
            } else {
                fetchProfiles(); 
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfiles();
        fetchAllProfiles();
    }, []);

    const getConnectedProfilesForUser = (userId) => {
        return allProfiles
            .filter(profile => profile.user_id === userId)
            .map(profile => profile.id)
            .join(", ");
    };

    const filteredProfiles = email === ""
        ? profiles
        : profiles.filter(profile => profile.email && profile.email.includes(email));

    return (
        <div>
            <div>
                <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                            Profile Managers
                        </h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <input
                                type="text"
                                placeholder="Search by email"
                                className="rounded-lg border border-gray-200 p-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button
                                onClick={filterProfilesByEmail}
                                className="ml-2 rounded-lg bg-primary px-2 py-1 text-xs text-white"
                            >
                                Search
                            </button>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={() => {
                                    fetchProfiles(); 
                                    setEmail(""); 
                                }}
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
                                <th scope="col" className="px-6 py-3">USER_ID</th>
                                <th scope="col" className="px-6 py-3">First Name</th>
                                <th scope="col" className="px-6 py-3">Last Name</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Last Updated</th>
                                <th scope="col" className="px-6 py-3">List of Connected Profiles</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan="7" className="text-center">Loading...</td>
                                </tr>
                            )}
                            {!loading && filteredProfiles.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="text-center">No data found</td>
                                </tr>
                            )}
                            {filteredProfiles.map((profile) => (
                                <tr
                                    key={profile.id}
                                    className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                                >
                                    <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium dark:text-white">
                                        {profile.id}
                                    </th>
                                    <td className="whitespace-nowrap px-6 py-4 dark:text-white">
                                        {profile.first_name}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 dark:text-white">
                                        {profile.last_name}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 dark:text-white">
                                        {profile.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        {dateToNow(profile?.updated_at.seconds)}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 dark:text-white">
                                        {getConnectedProfilesForUser(profile.id)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            className="font-medium text-red-600 hover:underline dark:text-red-500"
                                            onClick={() => handleDelete(profile.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <nav className="flex-column flex flex-wrap items-center justify-between pt-4 md:flex-row" aria-label="Table navigation">
                        <ul className="inline-flex h-8 -space-x-px self-end text-sm rtl:space-x-reverse">
                            <li>
                                <button
                                    onClick={handlePrevious}
                                    className="inline-flex items-center rounded-l-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                    Previous
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={handleNext}
                                    className="inline-flex items-center rounded-r-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default ProfileManagers;
