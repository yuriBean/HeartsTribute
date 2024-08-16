import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { getDiscoverProfiles } from "../services/profileManager.service";
import DiscoverProfileCard from "../components/Common/DiscoverProfileCard";
import Spinner from "../components/Common/Spinner";
import { checkUserProfiles, getLoggedInUser } from "../services/profileManager.service"; // Import your service functions
import { useNavigate, useSearchParams } from "react-router-dom"; // Import useNavigate
import CreateProfileModal from "../components/Profile/CreateProfileModal"; // Import your modal component

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loadingProfiles, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [user, setUser] = useState(null); // State to store user info
  const [searchParams] = useSearchParams();
  const qrid = searchParams.get("qrid");
  
  const loadMoreProfiles = async () => {
    if (loadingProfiles || !hasMore) return;

    setLoading(true);

    const { profiles: newProfiles, lastDoc: newLastDoc } =
      await getDiscoverProfiles(lastDoc);
    console.log("new profiles: ", newProfiles);
    console.log("last doc: ", newLastDoc);

    if (newProfiles.length === 0) {
      setHasMore(false);
    } else {
      setProfiles((prevProfiles) => [...prevProfiles, ...newProfiles]);
      setLastDoc(newLastDoc);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMoreProfiles();
  }, []);

  useEffect(() => {
    if (!hasMore) return;

    const handleScroll = () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight =
        document.documentElement.clientHeight || window.innerHeight;

      if (scrollTop + clientHeight >= scrollHeight - 5) {
        loadMoreProfiles();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loadingProfiles]);

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const checkProfile = async () => {
      // Assuming you have a way to get the logged-in user
      const loggedInUser = await getLoggedInUser(); // Replace with your method to get the logged-in user
      setUser(loggedInUser);

      if (loggedInUser) {
        const profiles = await checkUserProfiles(loggedInUser.uid);
        if (profiles.length === 0) {
          setShowModal(true); // Show modal if no profile exists
        }
      }
    };

    checkProfile();
  }, []);

  const handleCreateProfile = () => {
    setShowModal(false); // Close the modal
    navigate(`/profile-manager/tribute-tags?qrid=${qrid}`); // Navigate to the Tribute Tags page
  };
  return (
    <>
      <Layout>
        <div className="flex flex-col gap-16 md:gap-40 justify-between p-4 md:ml-11 md:mt-10 md:mr-11">
          {profiles.map((profile) => (
            <DiscoverProfileCard key={profile.id} profile={profile} />
          ))}
          {loadingProfiles && <Spinner />}
          {!loadingProfiles && hasMore && (
            <button
              onClick={loadMoreProfiles}
              className="bg-primary text-white py-2 px-4 rounded mx-auto md:hidden"
            >
              Load More
            </button>
          )}
        </div>
        <CreateProfileModal
            qrid={qrid}
            isOpen={showModal} 
            onClose={() => setShowModal(false)} 
            onCreateProfile={handleCreateProfile} 
          />

      </Layout>
    </>
  );
}
