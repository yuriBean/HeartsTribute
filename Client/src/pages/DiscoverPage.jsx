import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { deleteSignUpQR, getDiscoverProfiles } from "../services/profileManager.service";
import DiscoverProfileCard from "../components/Common/DiscoverProfileCard";
import Spinner from "../components/Common/Spinner";
import { useNavigate, useSearchParams } from "react-router-dom";
import CreateProfileModal from "../components/Profile/CreateProfileModal"; 
import { notifyError } from "../utils/toastNotifications";

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loadingProfiles, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchParams] = useSearchParams();
  const qrid = searchParams.get("qrid");
  const [savedQR, setSavedQR] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

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
    console.log(user.qrid)

      if (qrid === 'null' || qrid === undefined || ( !qrid && !user.qrid)) {
        setShowModal(false);
      } else {
        setShowModal(true); // Show modal if either is not null
        setSavedQR(user.qrid); // Store the qrid from user
      }
    };

    checkProfile();
  }, []);

  const handleCreateProfile = async () => {
    
    console.log("user    ", user.uid);
    if (savedQR && !qrid) {
      await deleteSignUpQR(user.uid);
      navigate(`/no-profile-connected?qrid=${savedQR}`);
      setSavedQR('');
    } else if (!savedQR && qrid) {
      navigate(`/no-profile-connected?qrid=${qrid}`);
    } else if(qrid === 'null' || !qrid || qrid === 'undefined'){
      notifyError('QR Code not detected. Please scan your QR Code and try again.');
    }
  };

  const handleClose = () => {
    setShowModal(false);
  }

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
        {showModal && (
                  <CreateProfileModal
                  onCreateProfile={handleCreateProfile} 
                  onClose={handleClose}
                />      
        )}

      </Layout>
    </>
  );
}
