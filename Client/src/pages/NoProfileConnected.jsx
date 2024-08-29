import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserProfiles, linkProfileToQR, getLoggedInUser, getQRIdsForProfiles } from "../services/profileManager.service";
import Layout from "../components/Layout/Layout";
import Spinner from "../components/Common/Spinner";
import { notifyError, notifySuccess } from "../utils/toastNotifications";

export default function NoProfileConnected() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [linking, setLinking] = useState(false);
  const [searchParams] = useSearchParams();
  const qrid = searchParams.get("qrid");
  const user = getLoggedInUser ();

  const checkUserProfiles = async () => {
    try {
      const user = getLoggedInUser();
      if (user) {
        const profiles = await getUserProfiles(user.uid);
        const qrIds = await getQRIdsForProfiles(profiles.map(profile => profile.id));
        const unlinkedProfiles = profiles.filter(profile => !qrIds.includes(profile.id));
        setProfiles(unlinkedProfiles);
        if (unlinkedProfiles.length === 0) {
          if (!qrid){
            notifyError('QR Code not detected. Please scan your QR Code and try again.');
          }
        }
      } else {
        notifyError("User is not logged in.");
      }
      setLoading(false);
    } catch (error) {
      notifyError("Failed to fetch profiles. Please try again.");
      setLoading(false);
    }
  };

  const handleCreateProfile = () => {
    try {
      const user = getLoggedInUser();
      if (!user)
        navigate(`/login?qrid=${qrid}`);
      else{
        if (!qrid || qrid==='null' || qrid === 'undefined')
          notifyError("Failed to activate your Tribute Tag. Please try scanning it again. If the issue persists, contact support.");
        else
          navigate(`/profile-manager/tribute-tags?qrid=${qrid}`);
      }
    } catch (error) {
      notifyError("Failed to fetch profiles. Please try again.");
      setLoading(false);
    }
  };

  const handleLinkProfile = async (profileId) => {
    setLinking(true);
    try {
      if (!profileId || !qrid || qrid==='null') {
        throw new Error("Invalid profile ID or QR ID.");
      }
      setLoading(true);
      await linkProfileToQR(profileId, qrid); 
      setLoading(false);
      notifySuccess("Profile linked successfully!");
      navigate(`/profile/${profileId}`); 
    } catch (error) {
      console.error("Failed to link profile", error);
      notifyError("Failed to activate your Tribute Tag. Please try scanning it again. If the issue persists, contact support.");
    } finally {
      setLinking(false);
    }
  };

  useEffect(() => {
    checkUserProfiles();
  }, []);

  return !loading ? (
    <Layout>
      <div className="flex flex-col items-center justify-center h-[40rem]">
        {user ? (
        <h1 className="text-2xl md:text-xl  text-center mx-2 md:mx-0 w-100 md:w-70  ">
          Your Tribute Tag is ready for activation. Start by linking it to a profile now. 

        </h1>):(
        <h1 className="text-2xl md:text-xl  text-center mx-2 md:mx-0 w-100 md:w-70  ">
                Welcome to Hearts Tribute!<br></br> It looks like this Tribute Tag isn’t linked to a profile yet. We’ll guide you through the setup in no time. Start by creating an account.
        </h1>
        )
         }
        {profiles.length > 0 ? (
          <>
            <button onClick={() => setModalOpen(true)} className="bg-primary text-white px-4 py-2 rounded mt-4">
              Link Existing Profile
            </button>
            <button onClick={handleCreateProfile} className="bg-primary text-white px-4 py-2 rounded mt-4">
              Create New Profile
            </button>

            {modalOpen && (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                  <h2 className="text-xl font-bold mb-4">Select a Profile to Link</h2>
                  <ul>
                    {profiles.map(profile => (
                      <li key={profile.id} className="mb-2">
                        <button
                          onClick={() => {
                            handleLinkProfile(profile.id);
                            setModalOpen(false);
                          }}
                          className="bg-primary text-white px-4 py-2 rounded w-full text-left"
                          disabled={linking}
                        >
                          {profile.first_name} {/* Replace with the profile property you want to display */}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="bg-red-500 text-white px-4 py-2 rounded mt-4"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <button onClick={handleCreateProfile} className="bg-primary text-white px-4 py-2 rounded mt-4">
            Continue
          </button>
        )}
      </div>
    </Layout>
    ):
    (
      <Spinner />
    );
  }