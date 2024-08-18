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
          } else {
          navigate(`/profile-manager/tribute-tags?qrid=${qrid}`);
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
          notifyError('QR Code not detected. Please scan your QR Code and try again.');
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

      console.log(`Linking profile ${profileId} to QR code ${qrid}`);

      // Check if the QRID already exists and is not linked to another profile
      await linkProfileToQR(profileId, qrid); // Link existing profile to QR code
      notifySuccess("Profile linked successfully!");
      navigate(`/profile/${profileId}`); // Redirect to the linked profile
    } catch (error) {
      console.error("Failed to link profile", error);
      notifyError("Failed to link profile. The QR ID or profile may be invalid.");
    } finally {
      setLinking(false);
    }
  };

  useEffect(() => {
    // if(qrid===null)
    //   navigate('/');
    checkUserProfiles();
  }, []);

  if (loading) {
    return <Spinner text="Loading profiles..." />;
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-[40rem]">
        <h1 className="text-2xl md:text-4xl font-bold text-center mx-1 md:mx-9">
          Looks like no profile is connected with this QR code. Start by creating a new profile or linking an existing unused one.
        </h1>
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
          <button onClick={handleCreateProfile} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
            Create New Profile
          </button>
        )}
      </div>
    </Layout>
  );
}