import Layout from "../components/Layout/Layout";
import Spinner from "../components/Common/Spinner";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserProfiles, linkProfileToQR, getLoggedInUser } from "../services/profileManager.service";

export default function NoProfileConnected() {
  const navigate = useNavigate();
  const { qr_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState(null);

  const checkUserProfiles = async () => {
    try {
      const user = getLoggedInUser();
      if (user) {
        const profiles = await getUserProfiles(user.uid);
        setProfiles(profiles);
      } else {
        setError("User is not logged in.");
      }
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch profiles. Please try again.");
      setLoading(false);
    }
  };

  const handleCreateProfile = async () => {
    navigate('/profile-manager/tribute-tags');
  };

  const handleLinkProfile = async (profileId) => {
    try {
      await linkProfileToQR(profileId, qr_id); // Link existing profile to QR code
      alert("Profile linked successfully!");
      navigate(`/profile/${profileId}`); // Redirect to the linked profile
    } catch (error) {
      console.error("Failed to link profile", error);
      alert("Failed to link profile. Please try again.");
    }
  };

  useEffect(() => {
    checkUserProfiles();
  }, []);

  if (loading) {
    return <Spinner text="Loading profiles..." />;
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-[40rem]">
        <h1 className="text-2xl md:text-4xl font-bold text-center">
          No Profile connected with this QR code.
        </h1>
        {profiles.length > 0 ? (
          <>
            {profiles.map(profile => (
              <button key={profile.id} onClick={() => handleLinkProfile(profile.id)} className="bg-green-500 text-white px-4 py-2 rounded mt-4">
                Link Existing Profile
              </button>
            ))}
            <button onClick={handleCreateProfile} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
              Create New Profile
            </button>
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