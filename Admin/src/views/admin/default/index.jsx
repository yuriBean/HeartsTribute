import { useEffect, useState } from "react";
import dateToNow from "utils/dateToNow";
import {
  getPaginatedProfileManagers,
  deleteProfileManager,
} from "services/admin.service";

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [firstDoc, setFirstDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

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
      console.log(data);
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
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePrevious = async () => {
    try {
      setHasMore(true);
      setLoading(true);
      const { data, last, first } = await getPaginatedProfileManagers(
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
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to delete this profile?"))
        return;
      if (
        !window.confirm(
          "This action is irreversible. Are you sure you want to delete this profile?"
        )
      )
        return;
      const res = await deleteProfileManager(id);
      if (res) {
        fetchProfiles();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const filter = async (type) => {
    try {
      console.log(type);
      setLoading(true);
      if (type == "username") {
        if (username == "") return;
        const { data, last, first } = await getPaginatedProfileManagers(
          10,
          "next",
          null,
          null,
          username
        );
        setProfiles(data);
      } else if (type == "email") {
        if (email == "") return;
        const { data, last, first } = await getPaginatedProfileManagers(
          10,
          "next",
          null,
          null,
          null,
          email
        );
        setProfiles(data);
      }
      setLastDoc(null);
      setFirstDoc(null);
      setLoading(false);
      setPage(2);
      setHasMore(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return (
    <div>
      {/* filter data by username input */}
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
                placeholder="Search by username"
                className="rounded-lg border border-gray-200 p-1 text-sm  focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <button
                onClick={() => filter("username")}
                className="ml-2 rounded-lg bg-blue-500 px-2 py-1 text-xs text-white"
              >
                Search
              </button>
            </div>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search by email"
                className="rounded-lg border border-gray-200 p-1 text-sm  focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                onClick={() => filter("email")}
                className="ml-2 rounded-lg bg-blue-500 px-2 py-1 text-xs text-white"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="relative my-10 overflow-x-auto p-2 shadow-md sm:rounded-lg">
          <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  profile_id
                </th>
                <th scope="col" className="px-6 py-3">
                  Username
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
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
                      className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                    >
                      {profile.id}
                    </th>
                    <th
                      scope="row"
                      className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                    >
                      {profile.username}
                    </th>
                    <td className="px-6 py-4">{profile.email}</td>
                    <td className="px-6 py-4">
                      {dateToNow(profile?.updated_at.seconds)}
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
    </div>
  );
};

export default Dashboard;
